"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const policy_controller_1 = require("./policy.controller");
const policy_validation_1 = require("./policy.validation");
const policyRoute = (0, express_1.Router)();
policyRoute.post("/", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(policy_validation_1.createPolicyValidationSchema), policy_controller_1.policyController.createPolicy);
policyRoute.get("/", policy_controller_1.policyController.getAllPolicies);
policyRoute.get("/:id", policy_controller_1.policyController.getSinglePolicy);
policyRoute.patch("/:id", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(policy_validation_1.updatePolicyValidationSchema), policy_controller_1.policyController.updatePolicy);
policyRoute.delete("/:id", (0, auth_1.default)("admin"), policy_controller_1.policyController.deletePolicy);
exports.default = policyRoute;
