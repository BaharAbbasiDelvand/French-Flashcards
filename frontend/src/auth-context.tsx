import { createContext, useContext, type ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export interface AuthState {
  enabled: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: { name?: string; email?: string; picture?: string } | null;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an auth provider");
  return ctx;
}

export function Auth0Bridge({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0();

  const value: AuthState = {
    enabled: true,
    isLoading,
    isAuthenticated,
    user: user ?? null,
    login: () => loginWithRedirect(),
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
    getToken: () => getAccessTokenSilently(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function OpenAuth({ children }: { children: ReactNode }) {
  const value: AuthState = {
    enabled: false,
    isLoading: false,
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    getToken: async () => undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
