import { Hono } from "hono";
import { renderPage } from "vike/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import { env } from "../config/env";
import users from "./routes/users";
import { authMiddleware } from "./middleware/auth";


import { readFileSync } from "fs";
import { createServer } from "https";
import { serve } from "@hono/node-server";

const isProduction = process.env.NODE_ENV === "production";
const port = Number(env.APP_PORT) || 443;

console.log("NODE_ENV:", process.env.NODE_ENV, "APP_PORT:", port);

const app = new Hono();

app.use(compress());

if (isProduction) {
  app.use(
    "/*",
    serveStatic({
      root: `./dist/client/`,
    })
  );
}

// Public API routes (no authentication required)
app.route("/api/auth", authRoutes);

// Create API group with authentication middleware
const protectedApi = new Hono().use("*", authMiddleware);

// Protected API routes
protectedApi.route("/upload", uploadRoutes);
protectedApi.route("/users", users);

// Mount the protected API group
app.route("/api", protectedApi);

// Serve uploaded files statically
app.use("/uploads/*", serveStatic({ root: "./" }));

// SSR routes (Vike)
app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;

  if (!httpResponse) return next();

  const { body, statusCode, headers } = httpResponse;
  headers.forEach(([name, value]) => c.header(name, value));
  c.status(statusCode);
  return c.body(body);
});

// 🟢 HTTPS Server (production only)
if (isProduction) {
  const cert = readFileSync('./server/server.crt');
  const key = readFileSync('./server/server.key');

  serve({
    fetch: app.fetch,
    port,
    createServer,
    serverOptions: { key, cert },
  }, () => {
    console.log(`🚀 HTTPS server running at https://localhost:${port}`);
  });
}

export default app;
