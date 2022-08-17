import { config } from "dotenv";
// Initialize config immediately
config();
import app from "./app";

app.listen(
  process.env.HTTP_PORT || 4000,
  process.env.HTTP_HOST || "0.0.0.0",
  (err: Error | null, address: string) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  }
);
