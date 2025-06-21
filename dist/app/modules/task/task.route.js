"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("./task.controller");
const taskRoute = express_1.default.Router();
// Create a new task
taskRoute.post("/create", task_controller_1.taskController.createTask);
// Get all tasks
taskRoute.get("/", task_controller_1.taskController.getAllTasks);
// Get a single task by ID
taskRoute.get("/:id", task_controller_1.taskController.getSingleTask);
// Update a task by ID
taskRoute.patch("/:id", task_controller_1.taskController.updateTask);
// Delete a task by ID
taskRoute.delete("/:id", task_controller_1.taskController.deleteTask);
exports.default = taskRoute;
