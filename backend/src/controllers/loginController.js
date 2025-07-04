import clientsModel from "../models/Client.js";
import employeesModel from "../models/Employees.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// CREATE: Login para clientes, empleados y administrador
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  // Validación de campos requeridos
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let userFound;
    let userType;

    // Verificar si es el administrador
    if (email === config.admin.email && password === config.admin.password) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      // Buscar primero en la colección de empleados
      userFound = await employeesModel.findOne({ email });
      if (userFound) {
        userType = "employee";
        // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }
      } else {
        // Si no es un empleado, buscar en la colección de clientes
        userFound = await clientsModel.findOne({ email });
        if (userFound) {
          userType = "client";
          // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
          const isMatch = await bcrypt.compare(password, userFound.password);
          if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
          }
        }
      }
    }

    // Si no se encuentra el usuario en ninguna colección (ni cliente ni empleado), devolver error
    if (!userFound) {
      console.log("No se encuentra en ninguna colección");
      return res.status(404).json({ message: "User not found" });
    }

    // Generar el token JWT
    const miToken = jwt.sign(
      {
        id: userFound._id,
        userType,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );

    res.cookie("authToken", miToken, { secure: false, httpOnly: false });
    res.json({ message: "login" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export default loginController;
