import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestResults } from './TypingTest';
import { Trophy, Target, Clock, BarChart3, RotateCcw, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ResultsProps {
  results: TestResults;
  previousResults: TestResults[];
  onRetakeTest: () => void;
  onSaveResults: () => void;
  isResultSaved?: boolean;
}

export const Results: React.FC<ResultsProps> = ({
  results,
  previousResults,
  onRetakeTest,
  onSaveResults,
  isResultSaved = false,
}) => {
  // Prepare chart data
  const chartData = previousResults.slice(-10).map((result, index) => ({
    test: index + 1,
    wpm: result.wpm,
    accuracy: result.accuracy,
  }));

  // Add current result to chart data
  chartData.push({
    test: chartData.length + 1,
    wpm: results.wpm,
    accuracy: results.accuracy,
  });

  const getPerformanceColor = (metric: string, value: number) => {
    switch (metric) {
      case 'wpm':
        if (value >= 60) return 'success';
        if (value >= 30) return 'success'; // Changed: Average should be green
        return 'error';
      case 'accuracy':
        if (value >= 95) return 'success';
        if (value >= 80) return 'success'; // Changed: Fair should be green
        return 'error';
      case 'consistency':
        if (value >= 80) return 'success';
        if (value >= 60) return 'warning';
        return 'error';
      default:
        return 'primary';
    }
  };

  const getPerformanceLabel = (metric: string, value: number) => {
    switch (metric) {
      case 'wpm':
        if (value >= 70) return 'Excellent';
        if (value >= 50) return 'Good';
        if (value >= 30) return 'Average';
        return 'Needs Practice';
      case 'accuracy':
        if (value >= 95) return 'Excellent';
        if (value >= 90) return 'Good';
        if (value >= 80) return 'Fair';
        return 'Needs Work';
      case 'consistency':
        if (value >= 85) return 'Very Steady';
        if (value >= 70) return 'Steady';
        if (value >= 50) return 'Moderate';
        return 'Inconsistent';
      default:
        return '';
    }
  };

  const chartConfig = {
    wpm: {
      label: "WPM",
      color: "hsl(var(--primary))",
    },
    accuracy: {
      label: "Accuracy",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">Test Complete!</h2>
        <p className="text-muted-foreground">Here's how you performed</p>
      </div>

      {/* Main Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* WPM Card */}
        <Card className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary mb-1">
            {results.wpm}
          </div>
          <div className="text-sm text-muted-foreground mb-2">Words Per Minute</div>
          <Badge variant={getPerformanceColor('wpm', results.wpm) as any} className="text-xs">
            {getPerformanceLabel('wpm', results.wpm)}
          </Badge>
        </Card>

        {/* Accuracy Card */}
        <Card className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-8 w-8 text-accent" />
          </div>
          <div className="text-3xl font-bold text-accent mb-1">
            {results.accuracy}%
          </div>
          <div className="text-sm text-muted-foreground mb-2">Accuracy</div>
          <Badge variant={getPerformanceColor('accuracy', results.accuracy) as any} className="text-xs">
            {getPerformanceLabel('accuracy', results.accuracy)}
          </Badge>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Test Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Duration</div>
            <div className="font-medium">{results.duration}s</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Characters</div>
            <div className="font-medium">{results.totalChars}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Correct Characters</div>
            <div className="font-medium">{results.correctChars}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Errors</div>
            <div className="font-medium">{results.totalChars - results.correctChars}</div>
          </div>
        </div>
      </Card>

      {/* Performance Chart */}
      {chartData.length > 1 && (
        <Card className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="test"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onRetakeTest}
          className="btn-primary gap-2"
          size="lg"
        >
          <RotateCcw size={18} />
          Retake Test
        </Button>
        <Button
          onClick={onSaveResults}
          variant="outline"
          className="gap-2"
          size="lg"
          disabled={isResultSaved}
        >
          <Save size={18} />
          {isResultSaved ? 'Results Saved' : 'Save Results'}
        </Button>
      </div>
    </div>
  );
};