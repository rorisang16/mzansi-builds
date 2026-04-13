import pool from '../config/database.js';
import User from '../models/User.js';
import { DatabaseError, ValidationError } from '../utils/customErrors.js';



class UserRepository {
  // Create a new user and adds them to db
  async create({ username, email, password }) {
    try {
      // Validate inputs and checks that all fields are present
      if (!username || !email || !password) {
        throw new ValidationError('Username, email, and password are required');
      }
//runs an insert query
      const [result] = await pool.query(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, password]
      );
// if successful, a new user object with the inserted data is returned
      return new User({
        id: result.insertId,
        username,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      // Preserves original error details for logging
      if (error instanceof ValidationError) {
        throw error;
      }
      // if the email already exists a db error with message is thrown
      if (error.code === "ER_DUP_ENTRY") {
        throw new DatabaseError("Email already exists");
      }
      throw new DatabaseError(`Failed to create user: ${error.message}`);
    }
  }

  // Finds user by email
  async getByEmail(email) {
    try {
      if (!email) {
        throw new ValidationError("Email is required");
      }

      //runs a select query for the email
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
      );

      if (rows.length === 0) return null;
      return new User(rows[0]);// returns user object if found, null if not
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Failed to fetch user by email: ${error.message}`);
    }
  }

  //Finds user by id ( will be used when decoding jwt to get user info)
  async getById(id) {
    try {
      if (!id) { //Validates that Id is provided
        throw new ValidationError("User ID is required");
      }

      const [rows] = await pool.query(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [id]
      );

      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Failed to fetch user by id: ${error.message}`);
    }
  }

  //Updates user fields
  async update(id, updates) {
    try {
      if (!id) { //validates ID and that at least one valid field is being updated
        throw new ValidationError('User ID is required');
      }

      const allowedFields = ['username', 'email', 'password'];
      const validUpdates = {};

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          validUpdates[key] = value;
        }
      }

      if (Object.keys(validUpdates).length === 0) {
        throw new ValidationError('No valid fields to update');
      }
// dynamically constructs the SET clause of the update query based on the fields provided in the updates object. This allows for flexible updates without needing separate methods for each field. Only valid fields are included in the update, and if no valid fields are provided, a validation error is thrown.
      const setClause = Object.keys(validUpdates)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(validUpdates), id];

      const [result] = await pool.query(
        `UPDATE users SET ${setClause}, updatedAt = NOW() WHERE id = ?`,//update query is run
        values
      );

      if (result.affectedRows === 0) return null;
//returns updated user or null if not found
      return this.getById(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update user: ${error.message}`);
    }
  }

  //deletes user by id
  async delete(id) {
    try {
      if (!id) { //validates ID
        throw new ValidationError('User ID is required');
      }

      const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`, //runs delete query
        [id]
      );

      //returns true if user deleted, false otherwise

      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to delete user: ${error.message}`);
    }
  }

  //gets all users (with pagination)

  async getAll(page = 1, limit = 10) {
    try {
      if (page < 1 || limit < 1) { //validation of pagination params
        throw new ValidationError("Page and limit must be positive integers");
      }

      const offset = (page - 1) * limit;

      const [users] = await pool.query(
        `SELECT * FROM users LIMIT ? OFFSET ?`, //runs select query with limit +offset
        [limit, offset]
      );

      const [countResult] = await pool.query('SELECT COUNT(*) as count FROM users');
      const total = countResult[0].count;

      return {
        data: users.map(user => new User(user)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Failed to fetch users: ${error.message}`);
    }
  }

  //fetches user by username
  async getByUsername(username) {
    try {
      if (!username) {
        throw new ValidationError("Username is required");
      }

      const [rows] = await pool.query(
        `SELECT * FROM users WHERE username = ? LIMIT 1`, //select query for username
        [username]
      );

      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) { //returns user object if found m or null if not
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Failed to fetch user by username: ${error.message}`);
    }
  }

  // checks if user exists by id
  async exists(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 1 FROM users WHERE id = ? LIMIT 1`, //runs a select 1 query (lightweight)
        [id]
      );
      return rows.length > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to check user existence: ${error.message}`);
    }
  }
}

export default new UserRepository();