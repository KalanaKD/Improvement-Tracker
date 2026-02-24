import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const ProgressChart = ({ stats = [], title = 'Progress Overview' }) => {
    // Transform stats into chart data
    const chartData = stats.map((stat) => ({
        name: stat.name || 'Tracker',
        value: stat.completed_days || 0,
        total: stat.total_days || 1,
        rate: stat.completion_rate || 0,
        color: stat.color || '#10B981',
    }));

    const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="glassmorphism p-3 rounded-lg border border-border shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">
                        {data.value} / {data.total} days ({(data.rate * 100).toFixed(1)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
        >
            <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No data available
                </div>
            )}
        </motion.div>
    );
};

export default ProgressChart;
