"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const oauthRouter = (0, express_1.Router)();
oauthRouter.get('/google', auth_controllers_1.AuthControllers.googleLogin);
oauthRouter.get('/google/callback', auth_controllers_1.AuthControllers.googleCallback);
exports.default = oauthRouter;
