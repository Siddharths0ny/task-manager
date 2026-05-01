import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const TaskCard = ({ task, onStatusChange }) => {
    const { user } = useContext(AuthContext);
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Todo': return 'bg-gray-100 text-gray-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

    const handleStatusUpdate = (e) => {
        onStatusChange(task._id, e.target.value);
    };

    const canEdit = user.role === 'Admin' || task.assignedTo?._id === user._id || task.assignedTo === user._id;

    return (
        <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{task.description}</p>
            
            <div className="mt-auto space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Project:</span>
                    <span className="font-medium text-gray-700">{task.projectId?.name || 'Unknown'}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Assignee:</span>
                    <span className="font-medium text-gray-700">{task.assignedTo?.name || 'Unassigned'}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Due:</span>
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No Date'}
                    </span>
                </div>

                {canEdit && (
                    <div className="pt-3 border-t mt-3">
                        <select
                            value={task.status}
                            onChange={handleStatusUpdate}
                            className="block w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
