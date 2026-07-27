import { Router } from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/validateRequest";
import { termsController } from "./terms.controller";
import {
  createTermsValidationSchema,
  updateTermsValidationSchema,
} from "./terms.validation";

const termsRoute = Router();

termsRoute.post(
  "/",
  auth("admin"),
  validateRequest(createTermsValidationSchema),
  termsController.createTerms,
);
termsRoute.get("/", termsController.getAllTerms);
termsRoute.get("/:id", termsController.getSingleTerms);
termsRoute.patch(
  "/:id",
  auth("admin"),
  validateRequest(updateTermsValidationSchema),
  termsController.updateTerms,
);
termsRoute.delete("/:id", auth("admin"), termsController.deleteTerms);

export default termsRoute;
