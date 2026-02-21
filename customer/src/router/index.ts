import express from "express";
import { CreateCustomer, getCustomer, getCustomers } from "../controllers";

const customerRouter = express.Router();

customerRouter.route("/").get(getCustomers).post(CreateCustomer);
customerRouter.route("/:id").get(getCustomer);

export default customerRouter;
