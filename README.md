# Task Manager API

A RESTful backend for a task management system, built with Node.js and
Express as part of AWDF **Practical 4**. Tasks are held in an in-memory
array for now — Practical 5 swaps this for a real MongoDB/Mongoose model.

## Run it

```
npm install
npm start        # node server.js
# or, auto-restart on file changes:
npm run dev       # node --watch server.js
```

Server listens on `http://localhost:5000` (override with `PORT`).

## Middleware pipeline

```
Client (Postman/browser)
  │
  ▼
express.json()                  parses JSON bodies
  │
  ▼
requestLogger                   logs "METHOD URL - ISO timestamp" for every request
  │
  ▼
Express Router (/tasks)
  ├── requireJsonContentType    POST/PUT only — 415 if Content-Type isn't application/json
  ├── validateTaskId            :id routes only — 400 if the id isn't a positive integer
  └── controller (CRUD)
  │
  ▼
notFoundHandler                 catches any request that matched nothing above — 404 JSON
  │
  ▼
errorHandler                    LAST middleware — catches every next(err), returns structured JSON
```

The error handler is registered after every route on purpose: Express only
routes an error to a handler that comes *after* the point `next(err)` was
called, so if it were registered first it would never see anything.

## Endpoints

| Method | Path         | Status codes    | Description |
|--------|--------------|------------------|-------------|
| GET    | `/tasks`     | 200              | List all tasks |
| GET    | `/tasks/:id` | 200, 400, 404    | Get one task |
| POST   | `/tasks`     | 201, 400, 415    | Create a task (`title` required) |
| PUT    | `/tasks/:id` | 200, 400, 404, 415 | Update a task (partial body allowed) |
| DELETE | `/tasks/:id` | 200, 400, 404    | Delete a task |

Task shape:

```json
{ "id": 1, "title": "string", "description": "string", "completed": false }
```

## Try it with curl

```bash
# list
curl http://localhost:5000/tasks

# create
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write the README","description":"Document the API"}'

# update
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# delete
curl -X DELETE http://localhost:5000/tasks/1

# 400 — invalid id
curl http://localhost:5000/tasks/abc

# 404 — undefined route
curl http://localhost:5000/nope

# 415 — missing Content-Type
curl -X POST http://localhost:5000/tasks -d '{"title":"no header"}'

# 500 — deliberately thrown error, to prove the global handler works
curl http://localhost:5000/debug/throw
```

Or import the routes above into Postman/Thunder Client.

## What's implemented (Practical 4 rubric)

- Express server on a defined port, confirmed via terminal + curl/Postman
- All 4 CRUD endpoints with correct HTTP methods and status codes (200/201/400/404/415/500)
- Global request-logging middleware (method, URL, timestamp) applied to every request
- Global error-handling middleware, registered last, returns structured JSON and never leaks stack traces to the client
- Supplementary: Content-Type validation on POST/PUT, route-specific task-id format validation, and a structured 404 handler for undefined routes
