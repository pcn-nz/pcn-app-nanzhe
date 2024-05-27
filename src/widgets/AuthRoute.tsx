import { message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRoute = ({ children, auth }: any) => {
  const navigate = useNavigate();
  const appConfig = localStorage.getItem("appConfig") || "";

  useEffect(() => {
    if (appConfig == "" && auth) {
      navigate("/config");
    }
  }, []);

  return children;
};
export default AuthRoute;