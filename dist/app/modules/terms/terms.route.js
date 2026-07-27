"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const terms_controller_1 = require("./terms.controller");
const terms_validation_1 = require("./terms.validation");
const termsRoute = (0, express_1.Router)();
termsRoute.post("/", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(terms_validation_1.createTermsValidationSchema), terms_controller_1.termsController.createTerms);
termsRoute.get("/", terms_controller_1.termsController.getAllTerms);
termsRoute.get("/:id", terms_controller_1.termsController.getSingleTerms);
termsRoute.patch("/:id", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(terms_validation_1.updateTermsValidationSchema), terms_controller_1.termsController.updateTerms);
termsRoute.delete("/:id", (0, auth_1.default)("admin"), terms_controller_1.termsController.deleteTerms);
exports.default = termsRoute;
