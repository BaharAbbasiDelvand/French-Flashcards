import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.tsx";
import { Auth0Bridge, OpenAuth } from "./auth-context.tsx";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {domain && clientId ? (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ redirect_uri: `${window.location.origin}/callback` }}
        onRedirectCallback={() => window.history.replaceState({}, document.title, "/")}
      >
        <Auth0Bridge>
          <App />
        </Auth0Bridge>
      </Auth0Provider>
    ) : (
      <OpenAuth>
        <App />
      </OpenAuth>
    )}
  </StrictMode>
);
