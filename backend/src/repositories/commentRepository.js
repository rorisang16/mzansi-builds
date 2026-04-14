import pool from '../config/database.js' ;
import { DatabaseError } from '../utils/customErrors.js';



class CommentRepository {

  //Inserts a new comment into the database
  //Parameterised queries prevent SQL injection (OWASP security best practice)
  //Time complexity: O(log n) for B-tree index insert on primary key
  async create(content, projectId, userId) {
    const query = `
      INSERT INTO comments (content, projectId, userId, createdAt)
      VALUES (?, ?, ?, NOW())
    `;

    try {
      const [result] = await pool.execute(query, [content, projectId, userId]);

      return {
        id: result.insertId, //auto-generated primary key
        content,
        projectId,
        userId,
      };
    } catch (error) {
      throw new DatabaseError("Failed to create comment");
    }
  }

//Retrieves all comments for a given project with the commenter's username
  
  //Results ordered by createdAt DESC for newest-first display in the UI
  async getByProjectId(projectId) {
    const query = `
      SELECT c.*, u.username 
      FROM comments c 
      JOIN users u ON c.userId = u.id 
      WHERE c.projectId = ? 
      ORDER BY c.createdAt DESC 
    `;
    //ordered by created at for newest first display
   // JOIN operation, O(nlogm) where n = comments, m = users (CLRS Ch.18 - indexed nested loop join)

    try {
      // array of matching records, could be empty if no comments exist
      const [rows] = await pool.execute(query, [projectId]);
      return rows;
    } catch (error) {
      throw new DatabaseError("Failed to fetch comments");
    }
  }

  //fetches a single comment by its primary key + O(log n) lookup using B-tree index on primary key 
  
  async getById(commentId) {
    const query = 'SELECT * FROM comments WHERE id = ?';

    try {
      const [rows] = await pool.execute(query, [commentId]);
      //returns first match or null : O(1) array access
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new DatabaseError("Failed to fetch comment");
    }
  }

  //removes a comment by its primary key
  //O(log n) B-tree index lookup + delete 
  async delete(commentId) {
    const query = 'DELETE FROM comments WHERE id = ?';

    try {
      const [result] = await pool.execute(query, [commentId]);
      //returns true if a row was deleted, false if no matching commentId was found
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Failed to delete comment");
    }
  }
}








export default new CommentRepository();