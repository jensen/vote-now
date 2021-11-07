import classnames from "classnames";
import Button from "components/common/Button";
import { HStack } from "components/common/Stack";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className={classnames("p-2", "text-white bg-gray-200")}>
      <HStack>
        <Button onClick={() => navigate("/projects")}>Projects</Button>
        <Button onClick={() => navigate("/admin")}>Admin</Button>
      </HStack>
    </header>
  );
};

export default Header;
