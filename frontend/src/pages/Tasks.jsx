import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        fetchTasks();
        if (user.role === 'Admin') {
            fetchProjects();
        }
    }, [user.role]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error('Failed to fetch projects for dropdown');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tasks', { title, description, projectId, dueDate, assignedTo });
            setShowModal(false);
            setTitle('');
            setDescription('');
            setProjectId('');
            setDueDate('');
            setAssignedTo('');
            toast.success('Task created successfully');
            fetchTasks(); // refresh to get populated fields
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    const todoTasks = tasks.filter(t => t.status === 'Todo');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
                {user.role === 'Admin' && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        + Create Task
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Todo Column */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                        TODO <span className="bg-gray-200 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">{todoTasks.length}</span>
                    </h2>
                    <div className="space-y-4">
                        {todoTasks.map(task => (
                            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                        ))}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                        IN PROGRESS <span className="bg-blue-200 text-blue-700 py-0.5 px-2.5 rounded-full text-xs">{inProgressTasks.length}</span>
                    </h2>
                    <div className="space-y-4">
                        {inProgressTasks.map(task => (
                            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                        ))}
                    </div>
                </div>

                {/* Completed Column */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                        COMPLETED <span className="bg-green-200 text-green-700 py-0.5 px-2.5 rounded-full text-xs">{completedTasks.length}</span>
                    </h2>
                    <div className="space-y-4">
                        {completedTasks.map(task => (
                            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project</label>
                                <select
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                >
                                    <option value="">Select a project</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    disabled={!projectId}
                                >
                                    <option value="">Select a user</option>
                                    {projectId && projects.find(p => p._id === projectId)?.members?.map(member => (
                                        <option key={member._id} value={member._id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
