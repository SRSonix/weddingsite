import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("/login", "routes/login.tsx"),
    route("/admin", "routes/admin.tsx"),
    route("/brunch-rsvp", "routes/brunch.tsx"),
    route("/datenschutzerklärung", "routes/policies.tsx")
] satisfies RouteConfig;
