const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Admin') {
            // Admin sees all tasks
            tasks = await Task.find().populate('projectId', 'name').populate('assignedTo', 'name');
        } else {
            // Member sees only their tasks
            tasks = await Task.find({ assignedTo: req.user.id }).populate('projectId', 'name').populate('assignedTo', 'name');
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId) {
        return res.status(400).json({ message: 'Please provide title and projectId' });
    }

    try {
        const task = await Task.create({
            title,
            description,
            projectId,
            assignedTo,
            dueDate
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if member is assigned to this task or is admin
        if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTaskStatus
};
