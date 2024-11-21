// script.js

// Select DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = {
  all: document.getElementById('filter-all'),
  completed: document.getElementById('filter-completed'),
  pending: document.getElementById('filter-pending'),
};
const quoteElement = document.getElementById('quote');

// Task Array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to Save Tasks to Local Storage
const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

// Render Tasks
const renderTasks = (filter = 'all') => {
  taskList.innerHTML = ''; // Clear the task list
  const filteredTasks = tasks.filter(task =>
    filter === 'completed'
      ? task.completed
      : filter === 'pending'
      ? !task.completed
      : true
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">
        ${task.name}
      </span>
      <div>
        <button onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
};

// Add Task
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const newTask = {
    name: taskInput.value,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

// Toggle Task Completion
const toggleTask = index => {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

// Delete Task
const deleteTask = index => {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

// Filter Tasks
filters.all.addEventListener('click', () => renderTasks('all'));
filters.completed.addEventListener('click', () => renderTasks('completed'));
filters.pending.addEventListener('click', () => renderTasks('pending'));

// Fetch and Display Quote
const fetchQuote = async () => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/quotes');
    const quotes = await response.json();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = `"${randomQuote.text}" - ${randomQuote.author || 'Unknown'}`;
  } catch (error) {
    quoteElement.textContent = 'Failed to fetch quote.';
  }
};

// Initialize
renderTasks();
fetchQuote();
