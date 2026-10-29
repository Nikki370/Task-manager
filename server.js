const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/taskManager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define the port
const PORT = 3000;

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const Task = require("./models/Task");

// Fetch all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.json({ message: "Task added", task });
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Mark a task as completed
app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { isCompleted: req.body.isCompleted }, { new: true });
  res.json({ message: "Task updated", task });
});
