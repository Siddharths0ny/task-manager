const express = require('express');
const router = express.Router();
const { getProjects, createProject, addMember, updateProjectStatus } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getProjects)
    .post(protect, admin, createProject);

router.post('/:id/add-member', protect, admin, addMember);
router.patch('/:id/status', protect, admin, updateProjectStatus);

module.exports = router;
