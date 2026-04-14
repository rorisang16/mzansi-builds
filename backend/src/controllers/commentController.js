import commentRepository from '../repositories/commentRepository.js';
import projectRepository from '../repositories/projectRepository.js';
import { NotFoundError, UnauthorizedError } from '../utils/customErrors.js';



class CommentController {

  //adds a comment to a project
  //validate --> authenticate --> check if project exists --> create comment
  //chain of responsibility pattern, each middleware only handles one concern
  async addComment(req, res, next) {
    try {
      const { projectId } = req.params;
      const { content } = req.validatedData; //cleans data from validation middleware
      const userId = req.userId; // jwt decoded , ensures only authenticated users can comment 

      //O(log n) B-tree lookup to verify project exists before inserting comment: basically a referential integrity check)
      const project = await projectRepository.getById(projectId);
      if (!project) {
        throw new NotFoundError("Project not found");
      }

 const comment = await commentRepository.create(content, projectId, userId);

      //resource is created and comment is returned after which is immediate display in the ui
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: comment,
      });
    } catch (error) {
      next(error); //delegates to  errorHandler middleware
    }
  }

  //gets all comments for a specific project
  async getComments(req, res, next) {
    try {
      const { projectId } = req.params;

      // O(log n) : existence check for project before fetching comments
      const project = await projectRepository.getById(projectId);
      if (!project) {
        throw new NotFoundError("Project not found");
      }

      //O(n log m): through a join, comments with usernames are fetched in a single query : indexed nested loop join (clrs) --> n = comments, m = users
      const comments = await commentRepository.getByProjectId(projectId);


      //returns success + array of comments
      res.status(200).json({
        success: true,
        data: comments,
        count: comments.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // deletes a comment after authorisation check has been done to ensure its only the authorised user making the deletion
  // Implements ownership verification to prevent unauthorised deletion
  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.userId;
  //O(log n) B-tree lookup by primary key to fetch comment and verify ownership before deletion
      const comment = await commentRepository.getById(commentId);
      if (!comment) {
        throw new NotFoundError("Comment not found");
      }

      //owner check : only author cand delete comment : principle of least privilege
   
      if (comment.userId !== userId) {
        throw new UnauthorizedError("You can only delete your own comments");
      }

      await commentRepository.delete(commentId);

      //success message after deletion, frontend then removes comment
      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}


export default new CommentController();