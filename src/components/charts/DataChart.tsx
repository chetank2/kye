import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { exportChartAsPNG } from '../../libs/chart-export';
import { cn } from '../../libs/utils';

const COLORS = ['#407BFF', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

interface ChartData {
    type: 'bar' | 'line' | 'pie';
    data: any[];
}

interface DataChartProps {
    chartData: ChartData;
    title?: string;
    className?: string;
}

export function DataChart({ chartData, title, className }: DataChartProps) {
    const handleExport = () => {
        exportChartAsPNG('data-chart', title || 'chart');
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 text-sm">
                    <p className="font-semibold mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-medium">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className={cn("border-none shadow-sm bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
            <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title || 'Data Visualization'}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={handleExport}>
                        <Download className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div id="data-chart" className="w-full h-[250px]">
                    {chartData.type === 'bar' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20" />
                                <XAxis
                                    dataKey="name"
                                    stroke="currentColor"
                                    className="text-muted-foreground text-xs"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="currentColor"
                                    className="text-muted-foreground text-xs"
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', className: 'text-muted/10' }} />
                                <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} animationDuration={1000} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {chartData.type === 'line' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20" />
                                <XAxis
                                    dataKey="name"
                                    stroke="currentColor"
                                    className="text-muted-foreground text-xs"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="currentColor"
                                    className="text-muted-foreground text-xs"
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={COLORS[0]}
                                    strokeWidth={2}
                                    dot={{ fill: COLORS[0], strokeWidth: 2, r: 4, stroke: 'var(--background)' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {chartData.type === 'pie' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--background)" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
