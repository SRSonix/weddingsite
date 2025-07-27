import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import Backend from 'i18next-http-backend';
import detector from "i18next-browser-languagedetector";

import {Header} from "./components/common/header";

import type { Route } from "./+types/root";
import "./app.css";
import { Footer } from "./components/common/footer";
import { UserProvider, type User } from "./providers/userProvider";
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
    ns: ['common'],
    fallbackLng: "en",
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
      <body className="min-w-128">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Header />
      <main className="h-full">
        <Outlet />
      </main>
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
