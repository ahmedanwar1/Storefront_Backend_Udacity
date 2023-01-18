import express from "express";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes/index";

const app: express.Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/api", routes);

//handle errors
app.use(errorHandler);

app.listen(port, () => console.log(`server is up and running on port ${port}`));

export default app;
