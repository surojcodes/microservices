import express, { Request } from "express";
import data from "./customers.json";

const PORT = 3000;
const app = express();

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
app.listen(PORT, () => {
  console.log(`CUSTOMER_API Listening on ${PORT}`);
});
