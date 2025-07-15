# Event Management API

A RESTful API for managing events and user registrations, built with Node.js, Express, and PostgreSQL.

## Features
- Create and manage events
- User registration for events
- Capacity and registration limits
- Upcoming events listing with custom sorting
- Event statistics

## Tech Stack
- Node.js
- Express
- PostgreSQL
- Sequelize ORM

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following content:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_api
   DB_USER=postgres
   DB_PASS=Cls@1234
   ```
4. **Run database migrations:**
   (Instructions will be added after models are defined)
5. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- **POST /events**: Create Event
- **GET /events/:id**: Get Event Details
- **POST /events/:id/register**: Register for Event
- **POST /events/:id/cancel**: Cancel Registration
- **GET /events/upcoming**: List Upcoming Events
- **GET /events/:id/stats**: Event Stats

### Example requests and responses will be added after implementation. 

## Example Requests and Responses

### 1. Create User
**POST** `/events/user`
**Body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```
**Response:**
```json
{
  "userId": "USER_UUID"
}
```

### 2. Create Event
**POST** `/events`
**Body:**
```json
{
  "title": "Tech Conference",
  "date_time": "2030-01-01T10:00:00Z",
  "location": "New York",
  "capacity": 100
}
```
**Response:**
```json
{
  "eventId": "EVENT_UUID"
}
```

### 3. Get Event Details
**GET** `/events/EVENT_UUID`
**Response:**
```json
{
  "id": "EVENT_UUID",
  "title": "Tech Conference",
  "date_time": "2030-01-01T10:00:00.000Z",
  "location": "New York",
  "capacity": 100,
  "createdAt": "...",
  "updatedAt": "...",
  "users": [
    {
      "id": "USER_UUID",
      "name": "Alice",
      "email": "alice@example.com"
    }
  ]
}
```

### 4. Register for Event
**POST** `/events/EVENT_UUID/register`
**Body:**
```json
{
  "userId": "USER_UUID"
}
```
**Response:**
```json
{
  "message": "Registration successful"
}
```

### 5. Cancel Registration
**POST** `/events/EVENT_UUID/cancel`
**Body:**
```json
{
  "userId": "USER_UUID"
}
```
**Response:**
```json
{
  "message": "Registration cancelled"
}
```

### 6. List Upcoming Events
**GET** `/events/upcoming`
**Response:**
```json
[
  {
    "id": "EVENT_UUID",
    "title": "Tech Conference",
    "date_time": "2030-01-01T10:00:00.000Z",
    "location": "New York",
    "capacity": 100,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 7. Event Stats
**GET** `/events/EVENT_UUID/stats`
**Response:**
```json
{
  "totalRegistrations": 1,
  "remainingCapacity": 99,
  "percentUsed": 1.00
}
``` # event_api
