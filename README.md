# MzansiBuilds

A "build in public" platform for South African developers to share what they're building, track project progress, and engage with the community through comments and stage updates.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [API Reference](#api-reference)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)
- [Problems Encountered](#problems-encountered)
- [Performance & Space Requirements](#performance--space-requirements)
- [Trade-offs](#trade-offs)
- [Potential Improvements](#potential-improvements)

---

## Overview

MzansiBuilds is a full-stack web application that allows developers to post projects, track their progress through stages (Ideation → Development → Testing), and receive community feedback via comments. The platform is aimed at the South African developer community and follows a "build in public" philosophy — encouraging transparency and peer support.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22 | Runtime |
| Express | 5 | REST API framework |
| MySQL2 | 3 | Database driver with promise support |
| Joi | 18 | Request body validation |
| bcrypt | 6 | Password hashing |
| jsonwebtoken | 9 | JWT authentication |
| dotenv | 17 | Environment variable management |
| nodemon | 3 | Development auto-reload |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool and dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Radix UI | various | Accessible headless UI primitives |
| Lucide React | 1 | Icon library |
| clsx + tailwind-merge | latest | Conditional classname utilities |

### Database & Environment
| Technology | Purpose |
|---|---|
| MySQL via XAMPP | Relational database |
| XAMPP | Local Apache + MySQL server |

### Testing
| Technology | Purpose |
|---|---|
| Jest 30 | Test runner |
| Supertest 7 | HTTP assertions for Express |
| cross-env 10 | Cross-platform environment variables |

---

## Features

- **User Authentication** — Register, login, and change password with JWT-based sessions
- **Project Feed** — Public feed of all active projects with stage badges and comment counts
- **Project Management** — Create, view, update stage, and delete projects
- **Comments** — Authenticated users can comment on any project
- **Stage Tracking** — Projects progress through `ideation`, `development`, and `testing`
- **Completed Projects** — Dedicated endpoint and view for finished projects
- **Input Validation** — All API inputs validated with Joi (password strength, username format, field lengths)
- **Rate-limited Login** — Login attempts tracked per email; locked after 5 failed attempts
- **Responsive UI** — Mobile-friendly layout with Tailwind CSS and Radix UI

---

## Setup Instructions

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) with MySQL running
- Git

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mzansi-builds

2. Database setup
Start XAMPP and ensure MySQL is running
Open phpMyAdmin at http://localhost/phpmyadmin
Create a database named mzansi_builds
Run the SQL schema to create the required tables
3. Backend setup

cd backend
npm install

Create a .env file in backend:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mzansi_builds
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=2h

Start the backend:

npm run dev    # development with auto-reload
npm start      # production

API available at http://localhost:5000

4. Frontend setup

cd frontend
npm install
npm run dev


App available at http://localhost:5173

5. Running tests

cd backend
npm test
**
Design Decisions**
Repository Pattern
Database queries are isolated in repository modules (userRepository, projectRepository, commentRepository). Controllers call repositories rather than running raw SQL directly. This decouples business logic from data access and makes unit testing straightforward — repositories can be mocked without touching the database.
**
Joi Validation Middleware**
A single validate(schemaKey) middleware handles all request body validation before requests reach controllers. Custom human-readable error messages are defined per field. This keeps controllers clean and centralises all validation logic in one place.
**
MySQL Connection Pool**
A pool of up to 10 connections is created once at startup. This avoids the overhead of opening and closing a connection on every request and prevents exhausting MySQL's connection limit under concurrent load.

**JWT Authentication**

Stateless JWTs are used over server-side sessions. No session store is required, the approach scales horizontally, and tokens carry the user ID so controllers can authorise operations without a database lookup. Tokens are stored in localStorage and sent as Authorization: Bearer headers.

Fluent Route Chaining
Express routes use .route() with method chaining (.get().post().put()) to group related handlers on the same path. This follows the DRY principle and matches the pattern recommended in the Express documentation.
**
ESM Throughout**
Both backend and frontend use native ES Modules ("type": "module"). This ensures a consistent module system across the whole project and forward compatibility with the Node.js ecosystem.
**
Radix UI + Tailwind CSS**
Radix UI headless primitives provide built-in accessibility (keyboard navigation, ARIA roles) while Tailwind controls all visual styling. This gives full design control without sacrificing accessibility compliance.
**
@/ Path Alias**
Vite and TypeScript are both configured with a @/ alias pointing to src/. This eliminates fragile relative import chains like ../../../components/ui/button across the codebase.


**Assumptions**
Users run XAMPP locally — no hosted or cloud database is assumed
A single JWT_SECRET is used for all tokens; there is no per-user token revocation
The application targets a local development environment, not production deployment
All users interact in good faith; no admin role or content moderation is implemented
Project ownership is solely determined by the user_id stored in the JWT
The frontend runs on Vite's default port 5173 and the backend on port 5000
The MySQL user is root with no password, matching XAMPP's default configuration
**
Performance & Space Requirements**

**Backend**

Connection pool capped at 10 MySQL connections — suitable for tens of concurrent users
Stateless JWT means zero per-user memory on the server
Login attempt tracking uses an in-memory Map — resets on restart, not suitable for multiple instances
node_modules size: ~150–200 MB
**
Decision	Benefit	Cost**
localStorage for JWT	Simple, no server state	Vulnerable to XSS if third-party scripts run on the page
In-memory login attempt tracking	No extra infrastructure	Resets on restart; won't scale across multiple instances
No pagination on project feed	Simpler to implement	Full table scan as data grows
Radix UI + Tailwind over a component library	Full visual control	More individual component files to maintain
ESM throughout	Modern and forward-compatible	Jest requires --experimental-vm-modules and unstable_mockModule
XAMPP / local MySQL	Zero infrastructure cost	Manual setup; not production-deployable as-is

**Potential Improvements**
Pagination on the project feed with cursor or offset pagination
HttpOnly cookies instead of localStorage for JWT to eliminate XSS risk
Redis for persistent, distributed login attempt rate limiting
Role-based access control with an admin role for content moderation
File uploads for project screenshots via S3 or Cloudinary
Real-time feed updates using WebSockets or Server-Sent Events
Email verification on registration
Password reset via time-limited email tokens
Search and filtering on the project feed by stage, keyword, or date
Milestone table in the database to persist milestones per project with full history
Docker containerisation for consistent local and production environments
Deployment — backend to Railway or Render, frontend to Vercel, database to PlanetScale or Supabase
Refresh tokens to extend sessions without re-login
End-to-end tests with Playwright covering the full register → create project → comment flow
