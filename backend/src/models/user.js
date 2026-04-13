class User{
constructor({ id = null, username, email, password, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password; // hashed password
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
export default User;