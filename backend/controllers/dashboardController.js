const Task = require('../models/Task');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query.assignedTo = req.user.id;
        }

        const tasks = await Task.find(query);

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
        const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
