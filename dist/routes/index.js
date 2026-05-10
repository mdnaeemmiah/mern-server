"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../app/modules/auth/auth.route"));
const user_route_1 = __importDefault(require("../app/modules/user/user.route"));
const task_route_1 = __importDefault(require("../app/modules/task/task.route"));
const vehicle_route_1 = __importDefault(require("../app/modules/vehicle/vehicle.route"));
const documents_route_1 = __importDefault(require("../app/modules/documents/documents.route"));
const cost_route_1 = __importDefault(require("../app/modules/cost/cost.route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/user',
        route: user_route_1.default,
    },
    {
        path: '/task',
        route: task_route_1.default,
    },
    {
        path: '/vehicle',
        route: vehicle_route_1.default,
    },
    {
        path: '/documents',
        route: documents_route_1.default,
    },
    {
        path: '/cost',
        route: cost_route_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
