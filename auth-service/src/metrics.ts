import client from "prom-client";
import { Request, Response } from "express";

client.collectDefaultMetrics();

export const loginCounter = new client.Counter({
  name: "auth_login_total",
  help: "Total number of login attempts",
});

export const registerCounter = new client.Counter({
  name: "auth_register_total",
  help: "Total number of registration attempts",
});

export const errorCounter = new client.Counter({
  name: "auth_errors_total",
  help: "Total number of auth-related errors",
});

export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};
