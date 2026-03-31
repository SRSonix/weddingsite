import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/overview.tsx"),
    route("/login", "routes/login.tsx"),
    route("/admin", "routes/admin.tsx"),
    route("/imprint", "routes/imprint.tsx")
] satisfies RouteConfig;
