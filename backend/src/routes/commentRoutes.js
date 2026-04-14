import express from 'express';
import commentController from '../controllers/commentController.js';
import validate from '../middleware/validation.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

//authentication middleware has been applied to all routes so only authorised users can comment.
router.use(authenticate);

//method chaining applied: groups POST and GET on the same path, DRY principle, avoids repetition
router.route('/:projectId/comments')
  .post(validate('createComment'), commentController.addComment)
  .get(commentController.getComments);

//delete uses a separate route due to the additional :commentId parameter
router.delete('/:projectId/comments/:commentId', commentController.deleteComment);

export default router;