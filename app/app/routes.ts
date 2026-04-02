import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("/login", "routes/login.tsx"),
    route("/admin", "routes/admin.tsx"),
    route("/datenschutzerklärung", "routes/policies.tsx")
] satisfies RouteConfig;
