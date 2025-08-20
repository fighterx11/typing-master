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
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2 py-2 sm:py-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">Test Complete!</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Here's how you performed</p>
      </div>

      {/* Main Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto">
        {/* WPM Card */}
        <Card className="stat-card p-4 sm:p-6 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {results.wpm}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Words Per Minute</div>
          <Badge variant={getPerformanceColor('wpm', results.wpm) as any} className="text-xs px-2 py-1">
            {getPerformanceLabel('wpm', results.wpm)}
          </Badge>
        </Card>

        {/* Accuracy Card */}
        <Card className="stat-card p-4 sm:p-6 text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">
            {results.accuracy}%
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Accuracy</div>
          <Badge variant={getPerformanceColor('accuracy', results.accuracy) as any} className="text-xs px-2 py-1">
            {getPerformanceLabel('accuracy', results.accuracy)}
          </Badge>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="card-elevated p-3 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          Test Details
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="text-center sm:text-left">
            <div className="text-muted-foreground mb-1">Duration</div>
            <div className="font-semibold text-sm sm:text-base">{results.duration}s</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-muted-foreground mb-1">Total Characters</div>
            <div className="font-semibold text-sm sm:text-base">{results.totalChars}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-muted-foreground mb-1">Correct Characters</div>
            <div className="font-semibold text-sm sm:text-base">{results.correctChars}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-muted-foreground mb-1">Errors</div>
            <div className="font-semibold text-sm sm:text-base">{results.totalChars - results.correctChars}</div>
          </div>
        </div>
      </Card>

      {/* Performance Chart */}
      {chartData.length > 1 && (
        <Card className="card-elevated p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Performance Trend</h3>
          <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="test"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center px-4 sm:px-0 pb-2">
        <Button
          onClick={onRetakeTest}
          className="btn-primary gap-2 w-full sm:w-auto sm:min-w-[140px] h-12 sm:h-10 text-base font-medium"
          size="lg"
        >
          <RotateCcw size={18} />
          Retake Test
        </Button>
        <Button
          onClick={onSaveResults}
          variant="outline"
          className="gap-2 w-full sm:w-auto sm:min-w-[140px] h-12 sm:h-10 text-base font-medium border-2 hover:bg-muted/50"
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