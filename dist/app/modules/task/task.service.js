"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const task_model_1 = require("./task.model");
// Create a new task
const createTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_model_1.TaskModel.create(data);
    return result;
});
// Get all tasks
const getAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_model_1.TaskModel.find();
    return result;
});
// Get single task by ID
const getSingleTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_model_1.TaskModel.findById(id);
    return result;
});
// Update task by ID
const updateTask = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_model_1.TaskModel.findByIdAndUpdate(id, payload, {
        new: true, // return updated document
        runValidators: true,
    });
    return result;
});
// Delete task by ID
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_model_1.TaskModel.findByIdAndDelete(id);
    return result;
});
exports.taskService = {
    createTask,
    getAllTasks,
    getSingleTask,
    updateTask,
    deleteTask,
};
