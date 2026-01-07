import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  uploadCustomerQuery,
  getCustomerQueries,
  updateCustomerQueryStatus,
} from "../controllers/queries.controller.js";
const queriesRouter = Router();

queriesRouter
  .route("/api/contact-us")
  .post(authMiddleware, uploadCustomerQuery);

queriesRouter.route("/api/get-customer-queries").get(getCustomerQueries);

queriesRouter.route("/api/update-query-status").post(updateCustomerQueryStatus);

export { queriesRouter };
