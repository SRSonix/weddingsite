import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/overview.tsx"), 
    route("/overview", "routes/overview.tsx" , {id:"index"}), 
    route("/getting_there", "routes/getting_there.tsx"),
    route("/traveling", "routes/traveling.tsx"),
    route("/user", "routes/user.tsx"),
    route("/admin", "routes/admin.tsx"),
    route("/imprint", "routes/imprint.tsx")
] satisfies RouteConfig;
