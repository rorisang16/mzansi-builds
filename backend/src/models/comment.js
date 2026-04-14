class Comment{

constructor({ id = null, content, projectId, userId, createdAt = null }) {
    this.id = id;
    this.content = content;
    this.projectId = projectId; //foreign key to projects table
    this.userId = userId;       //foreign key to users table
    this.createdAt = createdAt;
  }
}
export default Comment;






