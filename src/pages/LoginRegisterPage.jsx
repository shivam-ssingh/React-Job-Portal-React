import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginRegisterComponent from "../components/LoginRegister";
import { UserContext } from "../components/UserContext";
const LoginRegisterPage = () => {
  const { login } = useContext(UserContext); // Access login from UserContext
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";
  const mode = isLogin ? "login" : "register";

  const handleSubmit = async (formData) => {
    try {
      const endpoint = isLogin ? "/api/v1/user/login" : "/api/v1/user/register";
      const response = await fetch(
        `https://express-job-api.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const userData = { token: data.token, profile: data.user };
        login(userData);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <LoginRegisterComponent mode={mode} onSubmit={handleSubmit} />;
};

export default LoginRegisterPage;
