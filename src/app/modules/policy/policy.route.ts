import { Router } from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/validateRequest";
import { policyController } from "./policy.controller";
import {
  createPolicyValidationSchema,
  updatePolicyValidationSchema,
} from "./policy.validation";

const policyRoute = Router();

policyRoute.post(
  "/",
  auth("admin"),
  validateRequest(createPolicyValidationSchema),
  policyController.createPolicy,
);
policyRoute.get("/", policyController.getAllPolicies);
policyRoute.get("/:id", policyController.getSinglePolicy);
policyRoute.patch(
  "/:id",
  auth("admin"),
  validateRequest(updatePolicyValidationSchema),
  policyController.updatePolicy,
);
policyRoute.delete("/:id", auth("admin"), policyController.deletePolicy);

export default policyRoute;
