import { Request, Response } from "express";
import {
  CreateCustomerDto,
  CustomerAPIRes,
  CustomerEntity,
} from "../models/customer-model";
import data from "../customers.json";
export const getCustomers = (
  req: Request<never, CustomerAPIRes>,
  res: Response,
) => {
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
};

export const getCustomer = (
  req: Request<{ id: string }, CustomerAPIRes>,
  res: Response,
) => {
  const { id } = req.params;
  const customers = data.customers;
  const customer = customers.find((customer) => customer.customer_id === id);
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: `Customer with id ${id} not found` });
  }
  res.json({
    success: true,
    data: {
      id: customer.customer_id,
      name: customer.name,
      email: customer.email,
    },
  });
};

export const CreateCustomer = (
  req: Request<never, CustomerAPIRes, CreateCustomerDto>,
  res: Response,
) => {
  const reqBody = req.body;
  if (!reqBody.name || !reqBody.email) {
    return res.status(400).json({
      success: false,
      message: "Non empty name and email are required ",
    });
  }
  const customers = data.customers as CustomerEntity[];
  const newCustomer: CustomerEntity = {
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
};
