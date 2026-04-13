

import projectRepository from '../repositories/projectRepository.js';
import { NotFoundError } from '../utils/customErrors.js';

class ProjectController {

  //creates new project 
  async createProject(req, res, next) {
    try {
      // req.validated data comes from validation middleware which will be already clean +safe
      const projectData = req.validatedData;
 // userId will come from auth middleware later, hardcoded for now (placeholder)
      const userId = req.userId || 1;

      const project = await projectRepository.create(projectData, userId);

      // resource successfully created
      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } catch (error) {
  // Passes error to global errorHandler middleware
      next(error);
    }
  }

  //  Gets a single project

  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await projectRepository.getById(id);

      if (!project) {
        throw new NotFoundError("Project not found");
      }

  //resource found and then returned
      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  //gets all projects for project feed
  async getAllProjects(req, res, next) {
    try {
      const projects = await projectRepository.getAll();

      res.status(200).json({
        success: true,
        data: projects,
        count: projects.length,
      });
    } catch (error) {
      next(error);
    }
  }

  //gets completed projects ( for celebration wall)
  async getCompletedProjects(req, res, next) {
    try {
      const projects = await projectRepository.getCompleted();

      res.status(200).json({
        success: true,
        data: projects,
        count: projects.length,
      });
    } catch (error) {
      next(error);
    }
  }

  //updates project
  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.validatedData;

      const project = await projectRepository.update(id, updateData);

      if (!project) {
        throw new NotFoundError("Project not found");
      }

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  // deletes project by id
  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
  const deleted = await projectRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError("Project not found");
      }

      // 200 ok + confirmation message
      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

// Singleton instance 
export default new ProjectController();