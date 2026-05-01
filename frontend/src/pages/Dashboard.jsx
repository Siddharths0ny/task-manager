import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/dashboard');
            setStats(res.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            fetchStats(); // Refresh stats after status change
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    const statCards = [
        { title: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Completed', value: stats.completedTasks, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Pending', value: stats.pendingTasks, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { title: 'Overdue', value: stats.overdueTasks, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
                        <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Tasks by Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                            TODO <span className="bg-gray-200 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">{tasks.filter(t => t.status === 'Todo').length}</span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'Todo').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                            IN PROGRESS <span className="bg-blue-200 text-blue-700 py-0.5 px-2.5 rounded-full text-xs">{tasks.filter(t => t.status === 'In Progress').length}</span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'In Progress').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                            COMPLETED <span className="bg-green-200 text-green-700 py-0.5 px-2.5 rounded-full text-xs">{tasks.filter(t => t.status === 'Completed').length}</span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === 'Completed').map(task => (
                                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
