import app from "./app";
import { prisma } from "./prisma-client/prisma";

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log("Connected to Database successfully");

    // Start the server only after DB is connected
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
