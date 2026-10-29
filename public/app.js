const API_URL = "http://localhost:3000/tasks";
let allTasks = [];
let currentFilter = "all";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const errorMessage = document.getElementById("error-message");
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("taskflow-theme");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-label").textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem("taskflow-theme", isDark ? "dark" : "light");
}

setTheme(savedTheme === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
});

document.getElementById("today-label").textContent = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
}).format(new Date());

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    taskInput.value = "";
    await loadTasks();
  } catch (error) {
    showError("That task could not be added. Please try again.");
  }
});

async function loadTasks() {
  try {
    allTasks = await request(API_URL);
    renderTasks();
    clearError();
  } catch (error) {
    showError("Could not load your tasks. Is the server running?");
  }
}

function renderTasks() {
  const visibleTasks = allTasks.filter((task) => {
    if (currentFilter === "active") return !task.isCompleted;
    if (currentFilter === "completed") return task.isCompleted;
    return true;
  });

  taskList.innerHTML = "";
  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item${task.isCompleted ? " completed" : ""}`;
    const toggle = document.createElement("button");
    toggle.className = "check-button";
    toggle.type = "button";
    toggle.setAttribute("aria-label", task.isCompleted ? "Mark as active" : "Complete task");
    toggle.textContent = task.isCompleted ? "✓" : "";
    toggle.addEventListener("click", () => toggleTask(task._id, !task.isCompleted));

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteTask(task._id));

    li.append(toggle, title, deleteButton);
    taskList.appendChild(li);
  });

  emptyState.hidden = visibleTasks.length !== 0;
  document.getElementById("task-count").textContent =
    `${allTasks.length} ${allTasks.length === 1 ? "task" : "tasks"}`;
  updateProgress();
}

async function deleteTask(id) {
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    await loadTasks();
  } catch (error) {
    showError("That task could not be deleted. Please try again.");
  }
}

async function toggleTask(id, isCompleted) {
  try {
    await request(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted }),
    });
    await loadTasks();
  } catch (error) {
    showError("That task could not be updated. Please try again.");
  }
}

function updateProgress() {
  const total = allTasks.length;
  const completed = allTasks.filter((task) => task.isCompleted).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  document.getElementById("progress-value").textContent = `${percentage}%`;
  document.getElementById("progress-bar").style.width = `${percentage}%`;
  document.getElementById("progress-copy").textContent =
    total ? `${completed} of ${total} tasks completed` : "Let's get started";
}

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

loadTasks();
