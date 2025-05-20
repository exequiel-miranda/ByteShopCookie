import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Employees from "../pages/Employees";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, Login, logout, authCokie, setAuthCokie } = useAuth();
  const navigate = useNavigate();

  /*const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Por favor, complete todos los campos.");
            return;
        }

        const success = useLogin(email, password);

        if (!success.message) {
            toast.error("Credenciales incorrectas.");
            return;
        }

        // Aquí puedes agregar la lógica para iniciar sesión
        toast.success(success.message);
        navigate('/dashboard');

const renderBody = useCallback(() => {
    if (!loggedInGlobalUsers?.length) {
      return <Screen name="auth" component={AuthenticationStack} />;
    }
    if (!user || !location) {
      if (isOneWorkspace) {
        return <Screen name="workspace" component={LocationSelectionStack} />;
      }
      return <Screen name="workspace" component={WorkspaceSelectionStack} />;
    }
    return <Screen name="main" component={StackNavigator} />;
  }, [isOneWorkspace, loggedInGlobalUsers, location,


    };*/
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }
    const result = await Login(email, password);

    if (!result.success) {
      toast.error(result.message || "Credenciales incorrectas.");
      return;
    }
    
    
  };*/ const SERVER_URL = "https://byteshopcookie.onrender.com/api";

  const HandleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password, "email y password desde el login");
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la autenticación");
      }

      const data = await response.json();
      alert("Login ok");
      //localStorage.setItem("authToken", data.token);
      //localStorage.setItem("user", JSON.stringify({ email }));
      //setAuthCokie(data.token);
      //setUser({ email });

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    const miCookie = localStorage.getItem("authToken");
    console.log(miCookie, "cookie desde el login useEffect");
  }, []);

  const checkAuth = () => {
    console.log(authCokie, "token desde login contexto");
    console.log(user, "user desde login contexto");
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={HandleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
        <Toaster
          toastOptions={{
            duration: 2000,
          }}
        />
      </div>
    </div>
  );
};

export default Login;
