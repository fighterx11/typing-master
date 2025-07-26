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
    consistency: result.consistency,
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
    consistency: {
      label: "Consistency %",
      color: "hsl(var(--success))",
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Your Progress</h2>
          <p className="text-muted-foreground">
            {results.length} test{results.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onClearData}
            variant="outline"
            size="sm"
            className="gap-2 text-error border-error/20 hover:bg-error/10"
          >
            <Trash2 size={16} />
            Clear Data
          </Button>
          <Button onClick={onBackToTest} className="btn-primary">
            New Test
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">
            {bestWpm}
          </div>
          <div className="text-sm text-muted-foreground">Best WPM</div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-accent">
            {bestAccuracy}%
          </div>
          <div className="text-sm text-muted-foreground">Best Accuracy</div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div className="text-2xl font-bold text-success">
            {avgWpm}
          </div>
          <div className="text-sm text-muted-foreground">Average WPM</div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="h-6 w-6 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">
            {avgAccuracy}%
          </div>
          <div className="text-sm text-muted-foreground">Avg Accuracy</div>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
              <Line 
                type="monotone" 
                dataKey="consistency" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--success))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      {/* Results Table */}
      <Card className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Test History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">WPM</th>
                <th className="text-left py-2 px-3">Accuracy</th>
                <th className="text-left py-2 px-3">Consistency</th>
                <th className="text-left py-2 px-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.slice().reverse().map((result, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-3 px-3">
                    {result.timestamp.toLocaleDateString()} {result.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 font-medium text-primary">
                    {result.wpm}
                  </td>
                  <td className="py-3 px-3 font-medium text-accent">
                    {result.accuracy}%
                  </td>
                  <td className="py-3 px-3 font-medium text-success">
                    {result.consistency}%
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
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