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
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary-glow bg-clip-text text-transparent">
            Performance Analytics
          </h2>
          <p className="text-muted-foreground/80 font-medium tracking-wide">
            {results.length} typing session{results.length !== 1 ? 's' : ''} analyzed
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onClearData}
            variant="outline"
            size="sm"
            className="gap-1 sm:gap-2 text-xs sm:text-sm text-error border-error/30 hover:bg-error hover:text-error-foreground hover:border-error transition-all duration-200 px-2 sm:px-3"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-strong hover:scale-105 p-4 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-primary mb-1 font-mono">
              {bestWpm}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Best WPM</div>
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300" />
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-accent/5 via-card to-accent/10 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-strong hover:scale-105 p-4 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-accent mb-1 font-mono">
              {bestAccuracy}%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Best Accuracy</div>
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors duration-300" />
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-success/5 via-card to-success/10 border border-success/20 hover:border-success/40 transition-all duration-300 hover:shadow-strong hover:scale-105 p-4 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-full bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-success mb-1 font-mono">
              {avgWpm}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Avg WPM</div>
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-success/5 group-hover:bg-success/10 transition-colors duration-300" />
          </div>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-warning/5 via-card to-warning/10 border border-warning/20 hover:border-warning/40 transition-all duration-300 hover:shadow-strong hover:scale-105 p-4 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-full bg-warning/10 group-hover:bg-warning/20 transition-colors duration-300">
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-warning" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-bold text-warning mb-1 font-mono">
              {avgAccuracy}%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Avg Accuracy</div>
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-warning/5 group-hover:bg-warning/10 transition-colors duration-300" />
          </div>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-muted/10 via-card to-muted/5 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-elegant p-3 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Performance Trend Analysis
        </h3>
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
      <Card className="group relative overflow-hidden bg-gradient-to-br from-muted/10 via-card to-muted/5 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-elegant p-3 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 flex items-center gap-2">
          <div className="p-1 rounded-md bg-muted/50">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Session History
          </span>
        </h3>
        <div className="overflow-x-auto rounded-lg border border-border/50 bg-gradient-to-br from-muted/10 to-muted/5">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gradient-to-r from-muted/20 to-muted/10">
              <tr className="border-b border-border/30">
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-foreground tracking-wide uppercase text-xs">Date</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-foreground tracking-wide uppercase text-xs">WPM</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-foreground tracking-wide uppercase text-xs">Accuracy</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-foreground tracking-wide uppercase text-xs">Duration</th>
              </tr>
            </thead>
            <tbody>
              {results.slice().reverse().map((result, index) => (
                <tr key={index} className="border-b border-border/30 hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-200 group">
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm">
                    <div className="hidden sm:block font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {result.timestamp.toLocaleDateString('en-GB')} {result.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="sm:hidden font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {result.timestamp.toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-primary font-mono text-sm sm:text-base">
                    {result.wpm}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-accent font-mono text-sm sm:text-base">
                    {result.accuracy}%
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-muted-foreground group-hover:text-foreground font-mono transition-colors">
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