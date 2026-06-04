# Blender Farm API

Backend API for Blender Farm, a cloud-based render farm platform that enables users to manage Blender projects, upload assets, and submit rendering jobs.

## Features

* AWS Cognito Authentication
* JWT-based Authorization
* Refresh Token Support
* Project Management (CRUD)
* DynamoDB Single Table Design
* Centralized Error Handling
* Request Validation
* Dockerized Deployment
* AWS-Ready Infrastructure

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Authentication

* AWS Cognito
* JSON Web Tokens (JWT)

### Database

* Amazon DynamoDB

### Infrastructure

* Docker
* Amazon EC2
* Amazon ECR
* GitHub Actions

---

## Project Structure

```text
src/
├── common/
├── config/
├── controller/
├── middleware/
├── routes/
├── service/
├── validation/
├── utils/
└── app.js
```

---

## Authentication Flow

1. User signs up using AWS Cognito
2. User confirms account
3. User logs in
4. Cognito issues:

   * Access Token
   * Refresh Token
5. Protected routes validate access tokens
6. Refresh endpoint generates new access tokens

---

## DynamoDB Single Table Design

### Project Item

```json
{
  "pk": "USER#abc123",
  "sk": "PROJECT#550e8400",
  "entityType": "PROJECT",
  "projectId": "550e8400",
  "ownerId": "abc123",
  "title": "Animation Project",
  "description": "First Blender Render",
  "status": "ACTIVE",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/auth/signup`        |
| POST   | `/auth/confirm`       |
| POST   | `/auth/login`         |
| POST   | `/auth/refresh-token` |

### Projects

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/projects`            |
| GET    | `/projects`            |
| GET    | `/projects/:projectId` |
| PATCH  | `/projects/:projectId` |
| DELETE | `/projects/:projectId` |

---

## Environment Variables

Create a `.env` file:

```env
PORT=3000

AWS_REGION=your-region

COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
COGNITO_CLIENT_SECRET=your-client-secret

DYNAMODB_TABLE_NAME=your-table-name
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd blender-farm-api
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run production server:

```bash
npm start
```

---

## Docker

Build image:

```bash
docker build -t blender-farm-api .
```

Run container:

```bash
docker run -p 3000:3000 blender-farm-api
```

---

## Current Status

### Completed

* Authentication with AWS Cognito
* JWT Middleware
* Refresh Token Flow
* Create Project
* Get All Projects
* Get Project By ID
* Update Project
* Delete Project
* DynamoDB Single Table Design
* Docker Setup

### In Progress

* File Uploads
* Amazon S3 Integration
* Multipart Upload Support

### Planned

* Render Job Management
* Render Queue System
* Worker Nodes
* Team Collaboration
* Billing & Subscription Management

---

## Architecture

```text
Client
   │
   ▼
Express API
   │
   ├── AWS Cognito
   │
   ├── DynamoDB
   │
   ├── Amazon S3
   │
   └── Render Workers (Planned)
```

---

## Learning Objectives

This project was built to gain hands-on experience with:

* Backend API Development
* AWS Cognito Authentication
* DynamoDB Single Table Design
* Docker & Containerization
* AWS Deployment Workflows
* CI/CD Pipelines
* Scalable System Design

---

## Author

Built as a backend engineering learning project focused on AWS, authentication, scalable architecture, and cloud-native application development.
