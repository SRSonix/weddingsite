import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useTranslation } from "react-i18next";
import Backend from 'i18next-http-backend';
import detector from "i18next-browser-languagedetector";

import {Header} from "./components/common/header";

import type { Route } from "./+types/root";
import "./app.css";
import { Footer } from "./components/common/footer";
import { UserProvider, useUser } from "./providers/userProvider";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(detector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: false,
    backend: {
      loadPath: 'translations/{{ns}}/{{lng}}.json'
    },
    ns: ['app'],
    defaultNS: 'app',
    fallbackLng: false,
    interpolation: {
      escapeValue: false
    }
  });

export const links: Route.LinksFunction = () => [
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-w-95">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AdminBanner() {
  const {user} = useUser();
  const {pathname} = useLocation();
  if (user?.role !== "ADMIN") return null;
  const onAdmin = pathname === "/admin";
  return (
    <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between text-sm text-olive-700 bg-olive-50 border border-olive-200 rounded mt-4">
      <span>You are admin.</span>
      {onAdmin
        ? <Link to="/" className="text-olive-600 hover:underline">← Back to index</Link>
        : <Link to="/admin" className="text-olive-600 hover:underline">Go to admin page →</Link>
      }
    </div>
  );
}

function LogoutBanner() {
  const {user, logout} = useUser();
  const {t} = useTranslation("app");
  if (!user) return null;
  return (
    <div className="max-w-5xl mx-auto px-4 py-3 mt-6 flex items-center justify-between text-sm text-olive-600 border-t border-olive-200">
      <span className="italic">{t("page_personalized_for", "This page is personalized for {{name}} using a session token.", {name: user.name})}</span>
      <button onClick={logout} className="btn btn-small">{t("logout", "Logout")}</button>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Header />
      <AdminBanner />
      <main className="h-full max-w-5xl mx-auto px-4">
        <Outlet />
      </main>
      <LogoutBanner />
      <Footer />
    </UserProvider>
  );
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
