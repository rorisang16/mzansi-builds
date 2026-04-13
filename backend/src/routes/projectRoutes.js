// use of DRY principles - path string "/:id" written once versus three times
//use of fluent interface pattern (node js design patterns) where each method call returns the same route object which will then enable chaining
// groups operations by source
// recommended as per Express docs 

import express from 'express';
import projectController from '../controllers/projectController.js';
import validate from '../middleware/validation.js';

const router = express.Router();

// base route : creates + lists projects

router.route('/').post(validate('createProject'), projectController.createProject).get(projectController.getAllProjects);

//placed before id so express doesnt treat completed as an id
router.route('/completed').get(projectController.getCompletedProjects);

// single project operations by ID

router.route('/:id').get(projectController.getProjectById).put(validate('createProject'), projectController.updateProject)
.delete(projectController.deleteProject);

export default router;