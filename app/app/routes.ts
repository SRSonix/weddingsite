import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/overview.tsx"), 
    route("/overview", "routes/overview.tsx" , {id:"index"}), 
    route("/user", "routes/user.tsx"),
    route("/admin", "routes/admin.tsx"),
    route("/imprint", "routes/imprint.tsx")
] satisfies RouteConfig;
