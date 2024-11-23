import Express from "express";
import CakesRoute from "./router/cakesRouter";
import MaterialsRoute from "./router/materialRouter";
import SuppliersRoute from "./router/suppliersRouter";
import CompositionsRoute from "./router/compositionsRouter";
import UsersRoute from "./router/userRouter";
import OrdersRoute from "./router/orderRouter";
import SuppliesRoute from "./router/suppliesRouter";

const app = Express();

app.use(Express.json());

app.use(`/cakes`, CakesRoute);
app.use(`/materials`, MaterialsRoute);
app.use(`/suppliers`, SuppliersRoute);
app.use(`/compositions`, CompositionsRoute);
app.use(`/users`, UsersRoute);
app.use(`/orders`, OrdersRoute);
app.use(`/supplies`, SuppliesRoute);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server Sekopling's Bakery run on port ${PORT}`);
});
