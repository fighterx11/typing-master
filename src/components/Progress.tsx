import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestResults } from './TypingTest';
import { TrendingUp, Trophy, Target, BarChart3, Trash2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ProgressProps {
  results: TestResults[];
  onClearData: () => void;
  onBackToTest: () => void;
}

export const Progress: React.FC<ProgressProps> = ({
  results,
  onClearData,
  onBackToTest,
}) => {
  if (results.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center space-y-6">
        <Card className="card-elevated p-12">
          <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Results Yet</h2>
          <p className="text-muted-foreground mb-6">
            Take some typing tests to see your progress here
          </p>
          <Button onClick={onBackToTest} className="btn-primary">
            Start Your First Test
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const latest = results[results.length - 1];
  const avgWpm = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length);
  const avgAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length);
  const bestWpm = Math.max(...results.map(r => r.wpm));
  const bestAccuracy = Math.max(...results.map(r => r.accuracy));

  // Prepare chart data
  const chartData = results.slice(-20).map((result, index) => ({
    test: index + 1,
    wpm: result.wpm,
    accuracy: result.accuracy,
    date: result.timestamp.toLocaleDateString(),
  }));

  const chartConfig = {
    wpm: {
      label: "WPM",
      color: "hsl(var(--primary))",
    },
    accuracy: {
      label: "Accuracy %",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">Your Progress</h2>
          <p className="text-muted-foreground">
            {results.length} test{results.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onClearData}
            variant="outline"
            size="sm"
            className="gap-1 sm:gap-2 text-xs sm:text-sm text-error border-error/20 hover:bg-error/10 px-2 sm:px-3"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear Data</span>
            <span className="sm:hidden">Clear</span>
          </Button>
          <Button onClick={onBackToTest} className="btn-primary text-xs sm:text-sm px-2 sm:px-3">
            <span className="hidden sm:inline">New Test</span>
            <span className="sm:hidden">Test</span>
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="stat-card p-3 sm:p-6">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-primary">
            {bestWpm}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Best WPM</div>
        </Card>

        <Card className="stat-card p-3 sm:p-6">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <Target className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-accent">
            {bestAccuracy}%
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Best Accuracy</div>
        </Card>

        <Card className="stat-card p-3 sm:p-6">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-success" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-success">
            {avgWpm}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Avg WPM</div>
        </Card>

        <Card className="stat-card p-3 sm:p-6">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-success" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-success">
            {avgAccuracy}%
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">Avg Accuracy</div>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="card-elevated p-3 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Performance Over Time</h3>
        <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
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
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      {/* Results Table */}
      <Card className="card-elevated p-3 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Test History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1 sm:py-2 px-1 sm:px-3">Date</th>
                <th className="text-left py-1 sm:py-2 px-1 sm:px-3">WPM</th>
                <th className="text-left py-1 sm:py-2 px-1 sm:px-3">Accuracy</th>
                <th className="text-left py-1 sm:py-2 px-1 sm:px-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.slice().reverse().map((result, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-2 sm:py-3 px-1 sm:px-3 text-xs sm:text-sm">
                    <div className="hidden sm:block">
                      {result.timestamp.toLocaleDateString()} {result.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="sm:hidden">
                      {result.timestamp.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-1 sm:px-3 font-medium text-primary">
                    {result.wpm}
                  </td>
                  <td className="py-2 sm:py-3 px-1 sm:px-3 font-medium text-accent">
                    {result.accuracy}%
                  </td>
                  <td className="py-2 sm:py-3 px-1 sm:px-3 text-muted-foreground">
                    {result.duration}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};