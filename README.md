# Taskflow Task Manager

A simple full-stack task manager built with Node.js, Express, MongoDB, and vanilla JavaScript. Taskflow provides a clean, responsive interface for adding, completing, filtering, and deleting tasks.

## Features

- Add new tasks
- Mark tasks as completed or active
- Delete tasks
- Filter tasks by all, active, or completed status
- Daily completion progress indicator
- Responsive modern UI for desktop and mobile
- MongoDB persistence
- REST API powered by Express

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js and Express
- **Database:** MongoDB with Mongoose
- **Development:** Nodemon

## Requirements

Install the following before running the project:

- [Node.js](https://nodejs.org/) 18 or newer
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- npm, included with Node.js

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nikki370/task-manager.git
cd task-manager
```


### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

The application connects to MongoDB at:

```text
mongodb://127.0.0.1:27017/taskManager
```

Make sure your local MongoDB service is running before starting the application.

### 4. Start the application

For normal use:

```bash
npm start
```

For development with automatic server restarts:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Get all tasks |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task's completion status |
| `DELETE` | `/tasks/:id` | Delete a task |

### Create a task example

```json
{
  "title": "Finish project documentation"
}
```

### Update a task example

```json
{
  "isCompleted": true
}
```

## Project Structure

```text
task-manager/
├── models/
│   └── Task.js
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## Available npm Scripts

```bash
npm start     # Start the production server
npm run dev   # Start the server with Nodemon
```

## Notes

- `node_modules` is excluded from Git using `.gitignore`.
- Tasks are stored in the `taskManager` MongoDB database.
- The Express server serves both the REST API and the frontend.

## License

This project is available under the ISC License.
