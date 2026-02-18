import express, { Request } from "express";
import data from "./customers.json";

import { configDotenv } from "dotenv";

const app = express();

configDotenv();
const PORT = process.env.PORT;
app.use(express.json());
interface CreateCustomerDto {
  customer_id: string;
  name: string;
  email: string;
}
interface CustomerDto {
  id: string;
  name: string;
  email: string;
}
interface CustomerAPIRes {
  success: boolean;
  data?: CustomerDto | CustomerDto[];
  message?: string;
}

app.get("/customers", (req: Request<never, CustomerAPIRes>, res) => {
  const customers = data.customers;
  res.status(200).json({
    success: true,
    data: customers.map((customer) => {
      return {
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
      };
    }),
  });
});
app.get(
  "/customers/:id",
  (req: Request<{ id: string }, CustomerAPIRes>, res) => {
    const { id } = req.params;
    const customers = data.customers;
    const customer = customers.find((customer) => customer.customer_id === id);
    if (!customer)
      res
        .status(404)
        .json({ success: false, message: `Customer with id ${id} not found` });
    else
      res.json({
        success: true,
        data: {
          id: customer.customer_id,
          name: customer.name,
          email: customer.email,
        },
      });
  },
);
app.post(
  "/customers",
  (req: Request<never, CustomerAPIRes, CreateCustomerDto>, res) => {
    const reqBody = req.body;
    if (!reqBody.name || !reqBody.email) {
      res.status(400).json({
        success: false,
        message: "Non empty name and email are required ",
      });
    }
    const customers = data.customers;
    const newCustomer: CreateCustomerDto = {
      customer_id: String(customers.length + 1),
      email: reqBody.email,
      name: reqBody.name,
    };
    customers.push(newCustomer);
    res.status(201).json({
      success: true,
      data: {
        id: newCustomer.customer_id,
        email: newCustomer.email,
        name: newCustomer.name,
      },
    });
  },
);
app.listen(PORT, () => {
  console.log(`CUSTOMER_API Listening on ${PORT}`);
});
