
//representation of project entity
class Project {
  constructor(title, description, stage, status, userId) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.stage = stage;          // 'ideation', 'development', 'testing'
    this.status = status || 'active';  // 'active', 'completed' new projects start activ
    this.userId = userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  //helper methods for business logic

  // Checks if project is completed for celebration wall feature
  isCompleted() {
    return this.status === 'completed';
  }

  // Checks if project is in development

  isInDevelopment() {
    return this.stage === 'development';
  }
}

export default Project;