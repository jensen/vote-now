import { Button } from "components/common";
import { useAuth } from "context/auth";

export const DiscordLoginButton = () => {
  const { login } = useAuth();

  return <Button onClick={() => login({ provider: "discord" })}>Login</Button>;
};

const LoginButton = () => {
  return <Button>Login</Button>;
};

export default LoginButton;
