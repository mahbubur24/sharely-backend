import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import routes from "./routes/route-controller";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

const whitelist: string[] = [
  "http://localhost:3000",
  "https://sharely-sepia.vercel.app",
];

// ✅ CORS options with origin as a function
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

app.use(routes);

app.use(/(.*)/, (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
