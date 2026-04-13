import pool from '../config/database.js';
import { DatabaseError } from '../utils/customErrors.js';

class ProjectRepository {

  // creates new project + inserts it into the database
  //parameterised queries to prevent sql injection (express best security practices)

  async create(projectData, userId) {
    const { title, description, stage, status } = projectData;

    const query = `
      INSERT INTO projects (title, description, stage, status, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    try {
      const [result] = await pool.execute(query, [
        title, description, stage, status, userId,
      ]);

      return {
        id: result.insertId,//auto generated id
        title,
        description,
        stage,
        status,
        userId,
      };
    } catch (error) { ///custom db error
      throw new DatabaseError("Failed to create project");
    }
  }

  // gets single project by id for project details page and update/delete operations
  //indexed lookup by primary key (id) for fast retrieval - O (log n) using B-tree index
  async getById(projectId) {
    const query = 'SELECT * FROM projects WHERE id = ?';

    try { //rows = array of matching records(only one record expected since id is unique)
      const [rows] = await pool.execute(query, [projectId]);
     
      //returning of first match or is null if not found
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new DatabaseError("Failed to fetch project");
    }
  }

  // gets all projects ordered by newest first ( project feed)
  async getAll() {
    const query = 'SELECT * FROM projects ORDER BY createdAt DESC';

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new DatabaseError("Failed to fetch projects");
    }
  }

  // gets completed projects for celebration wall 
  async getCompleted() {
    const query = "SELECT * FROM projects WHERE status = 'completed' ORDER BY updatedAt DESC";

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new DatabaseError("Failed to fetch completed projects");
    }
  }

  // Updates project by ID
  async update(projectId, updateData) {
    const { title, description, stage, status } = updateData;

    const query = `
      UPDATE projects SET title = ?, description = ?, stage = ?, status = ?, updatedAt = NOW()
      WHERE id = ?
    `;

    try {
      const [result] = await pool.execute(query, [
        title, description, stage, status, projectId,
      ]);

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.getById(projectId);
    } catch (error) {
      throw new DatabaseError("Failed to update project");
    }
  }

  // DELETE - Remove a project by ID
  async delete(projectId) {
    const query = 'DELETE FROM projects WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [projectId]);
      //will return true if project is deleted , false if not found
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Failed to delete project");
    }
  }
}

//O(1) SPACE - one instance instead of O(n) duplicates
export default new ProjectRepository();//singleton instance of repository for use in controllers