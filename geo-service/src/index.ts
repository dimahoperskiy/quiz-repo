import { config } from "./config";
import app from "./app";

app.listen(config.port, () => {
  console.log(
    `🌍 Geo Service is running on http://localhost:${config.port}/api`,
  );
});
