import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from 'cookie-parser';
import notFound from "./middlewares/NotFound";
import path from 'path';


// express
const app :Application= express();

// parsers
app.use(express.json());
app.use(cors({origin:true,credentials:true}));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', router);


app.get("/", (req: Request, res: Response) => {
  res.send("Motor-bridge World!");
});


app.use(globalErrorHandler);
app.use(notFound);

export default app;