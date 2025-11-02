# API Documentation

## Overview
The VulHub Leaderboard API provides endpoints for user authentication, leaderboard management, and submission handling.

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-1",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student",
    "points": 1250,
    "level": 3,
    "joinDate": "2024-01-15T00:00:00.000Z",
    "lastActive": "2024-01-20T10:30:00.000Z",
    "completedActivities": ["vuln-001", "vuln-002"],
    "pendingSubmissions": [],
    "approvedSubmissions": []
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "schoolId": "student456",
  "name": "Jane Smith",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-2",
    "schoolId": "student456",
    "name": "Jane Smith",
    "email": "student456@school.edu",
    "role": "student",
    "points": 0,
    "level": 1,
    "joinDate": "2024-01-20T10:30:00.000Z",
    "lastActive": "2024-01-20T10:30:00.000Z",
    "completedActivities": [],
    "pendingSubmissions": [],
    "approvedSubmissions": []
  }
}
```

### Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Leaderboard

### Get Leaderboard
```http
GET /api/leaderboard
```

**Response:**
```json
{
  "users": [
    {
      "id": "user-1",
      "name": "John Doe",
      "points": 1250,
      "level": 3,
      "rank": 1,
      "completedActivities": ["vuln-001", "vuln-002"]
    },
    {
      "id": "user-2", 
      "name": "Jane Smith",
      "points": 800,
      "level": 2,
      "rank": 2,
      "completedActivities": ["vuln-001"]
    }
  ],
  "totalUsers": 2,
  "lastUpdated": "2024-01-20T10:30:00.000Z"
}
```

## Submissions

### Submit Proof
```http
POST /api/submissions
Content-Type: multipart/form-data

{
  "activityId": "vuln-001",
  "description": "Successfully exploited SQL injection vulnerability",
  "files": [File, File, ...]
}
```

**Response:**
```json
{
  "success": true,
  "submission": {
    "id": "sub-123",
    "userId": "user-1",
    "activityId": "vuln-001",
    "activityName": "SQL Injection Challenge",
    "description": "Successfully exploited SQL injection vulnerability",
    "files": [
      {
        "id": "file-1",
        "name": "screenshot.png",
        "type": "image/png",
        "size": 1024000,
        "url": "https://storage.example.com/files/file-1"
      }
    ],
    "status": "pending",
    "submittedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### Get User Submissions
```http
GET /api/submissions?userId=user-1
```

**Response:**
```json
{
  "submissions": [
    {
      "id": "sub-123",
      "activityId": "vuln-001",
      "activityName": "SQL Injection Challenge",
      "status": "pending",
      "submittedAt": "2024-01-20T10:30:00.000Z",
      "pointsAwarded": null
    }
  ]
}
```

## Activities

### Get Available Activities
```http
GET /api/activities
```

**Response:**
```json
{
  "activities": [
    {
      "id": "vuln-001",
      "name": "SQL Injection Challenge",
      "description": "Find and exploit SQL injection vulnerabilities in a web application",
      "points": 100,
      "difficulty": "beginner",
      "category": "Web Security",
      "requirements": ["Basic SQL knowledge", "Web application testing"],
      "isActive": true,
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "schoolId": "School ID is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Submission endpoints**: 10 requests per minute per user
- **General endpoints**: 100 requests per minute per IP

## Authentication Headers

For protected endpoints, include the authentication token:

```http
Authorization: Bearer <jwt-token>
```

## WebSocket Events

### Real-time Updates
Connect to WebSocket for real-time leaderboard updates:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'leaderboard_update') {
    // Update leaderboard UI
    updateLeaderboard(data.users);
  }
};
```

### Event Types
- `leaderboard_update` - Leaderboard data has changed
- `submission_approved` - User submission was approved
- `submission_rejected` - User submission was rejected
- `user_level_up` - User leveled up

## Data Models

### User
```typescript
interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: 'student' | 'grader' | 'admin';
  points: number;
  level: number;
  joinDate: Date;
  lastActive: Date;
  completedActivities: string[];
  pendingSubmissions: string[];
  approvedSubmissions: string[];
}
```

### Activity
```typescript
interface Activity {
  id: string;
  name: string;
  description: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
}
```

### Submission
```typescript
interface Submission {
  id: string;
  userId: string;
  activityId: string;
  activityName: string;
  description: string;
  files: FileUpload[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  feedback?: string;
  pointsAwarded?: number;
}
```

### FileUpload
```typescript
interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}
```
