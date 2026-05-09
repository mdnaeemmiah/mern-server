
import mongoose from "mongoose";
import dns from "dns";

// Fix DNS resolution issues (querySrv ECONNREFUSED) for MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

import { Server } from "http";
import config from "./app/config";
import app from "./app";

let server: Server;
const port = config.port;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(port, () => {
      console.log(`Motor-bridge app listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log(`😈🙉 unhandledRejection is detected. Shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈🙉 uncaughtException is detected. Shutting down...`);
  process.exit(1);
});