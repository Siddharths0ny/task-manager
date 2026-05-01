const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a project name']
    },
    description: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Active', 'On Hold', 'Completed'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
