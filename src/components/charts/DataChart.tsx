import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { exportChartAsPNG } from '../../libs/chart-export';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

interface ChartData {
    type: 'bar' | 'line' | 'pie';
    data: any[];
}

interface DataChartProps {
    chartData: ChartData;
    title?: string;
}

export function DataChart({ chartData, title }: DataChartProps) {
    const handleExport = () => {
        exportChartAsPNG('data-chart', title || 'chart');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{title || 'Data Visualization'}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div id="data-chart" className="w-full h-[300px]">
                    {chartData.type === 'bar' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill={COLORS[0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {chartData.type === 'line' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} />
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
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
