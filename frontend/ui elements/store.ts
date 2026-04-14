export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
}

export interface Milestone {
  id: string;
  text: string;
  date: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
}

export interface Project {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  stage: "idea" | "in-progress" | "testing" | "completed";
  supportNeeded: string;
  milestones: Milestone[];
  comments: Comment[];
  collaborationRequests: string[];
  createdAt: string;
  updatedAt: string;
}

const PROJECTS_KEY = "mzansi_projects";
const USERS_KEY = "mzansi_users";

export function getProjects(): Project[] {
  return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function addProject(project: Project) {
  const projects = getProjects();
  projects.unshift(project);
  saveProjects(projects);
}

export function updateProject(updated: Project) {
  const projects = getProjects().map((p) => (p.id === updated.id ? updated : p));
  saveProjects(projects);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem("mzansi_user");
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: User) {
  localStorage.setItem("mzansi_user", JSON.stringify(user));
}

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
