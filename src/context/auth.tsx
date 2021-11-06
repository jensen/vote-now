import React, {
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import supabase, { ISupabaseSession, ISupabaseUser } from "services";

interface ILogin {
  provider: "discord";
}

interface IAuthContext {
  user: ISupabaseUser | null;
  login: (options: ILogin) => void;
  logout: () => void;
}

const AuthContext = React.createContext<IAuthContext>(null!);

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("Must useAuth within AuthProvider");
  }

  return auth;
};

const useWaitForSession = () => {
  const location = useLocation();

  if (location.hash) {
    const params = new URLSearchParams(location.hash.substring(1));

    /*
      this is a redirect from discord OAuth
    */

    return (
      params.has("token_type") &&
      params.get("token_type") === "bearer" &&
      params.has("access_token") &&
      params.has("refresh_token") &&
      params.has("provider_token")
    );
  }

  if (localStorage.getItem("supabase.auth.token") === null) {
    return false;
  }

  return true;
};

const AuthProvider = (props: PropsWithChildren<unknown>) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [authenticating, setAuthenticating] = useState<boolean>(
    useWaitForSession()
  );
  const [session, setSession] = useState<ISupabaseSession | null>(null);

  const login = ({ provider }: ILogin) => {
    const from = location.state?.from?.pathname || "/";

    return supabase.auth.signIn(
      {
        provider,
      },
      { redirectTo: `${process.env.REACT_APP_CLIENT_HOST}${from}` }
    );
  };

  const logout = () => supabase.auth.signOut().then(() => navigate("/login"));

  useEffect(() => {
    const session = supabase.auth.session();

    if (session) {
      setSession(session);
      setAuthenticating(false);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthenticating(false);
    });
  }, []);

  if (authenticating) return null;

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
