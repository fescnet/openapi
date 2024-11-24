import express, { Application, Request, Response } from "express";
import cors from "cors";
import exampleRoute from "./routes/exampleRoute";

import swaggerUi from "swagger-ui-express";
import * as yamljs from "yamljs";
import path from "path";

const openapiSpec = yamljs.load(path.join(__dirname, "openapi/openapi.yaml"));

const app: Application = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Define routes
app.use("/api/example", exampleRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the TypeScript API!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});
