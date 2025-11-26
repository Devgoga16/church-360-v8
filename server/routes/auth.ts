import { RequestHandler } from "express";
import { ApiResponse } from "@shared/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

// Mock users database
const mockUsers = [
  {
    id: 1,
    email: "admin@iglesia360.com",
    password: "password",
    name: "Juan García",
    roles: ["admin"],
  },
  {
    id: 2,
    email: "director@iglesia360.com",
    password: "password",
    name: "Carlos Director",
    roles: ["admin", "tesorero", "pastor_general"],
  },
  {
    id: 3,
    email: "tesorero@iglesia360.com",
    password: "password",
    name: "María López",
    roles: ["tesorero"],
  },
  {
    id: 4,
    email: "pastor@iglesia360.com",
    password: "password",
    name: "Carlos Rodríguez",
    roles: ["pastor_general"],
  },
];

export const login: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};
