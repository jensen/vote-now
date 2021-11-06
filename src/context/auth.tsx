import React, { useState, useContext, PropsWithChildren } from "react";
import supabase from "services";

interface IUser {
  id: string;
}

interface IAuthContext {
  user: IUser | null;
  login: () => void;
}

const initialContext = {
  user: null,
  login: () => null,
};

const AuthContext = React.createContext<IAuthContext>(initialContext);

const AuthProvider = (props: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<IAuthContext>(initialContext);

  const login = () => {};

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("Must useAuth within AuthProvider");
  }

  return auth;
};

export default AuthProvider;
