import { Router } from "express";
import { authMiddleware } from "./../middlewares/auth.middleware.js";
import { uploadCustomerQuerry } from "../controllers/contact.controller.js";
const ContactRouter = Router();

ContactRouter.route("/api/contact-us").post(
  authMiddleware,
  uploadCustomerQuerry
);

export { ContactRouter };
