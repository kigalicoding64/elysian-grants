import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundPage } from "./routes/not-found";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage, // 👈 Catches any unmapped route and shows your custom 404
  defaultPreload: "intent",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
