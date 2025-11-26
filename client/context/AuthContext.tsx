import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Permission {
  rol: {
    _id: string;
    nombre: string;
    icono: string;
    descripcion: string;
  };
  modulos: Array<{
    module: {
      _id: string;
      nombre: string;
      descripcion: string;
      orden: number;
    };
    opciones: Array<{
      _id: string;
      nombre: string;
      ruta: string;
      orden: number;
    }>;
  }>;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  person?: {
    _id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    telefono: string;
    direccion: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    nombreCompleto: string;
    id: string;
  };
  roles: Array<{
    _id: string;
    nombre: string;
    icono: string;
    descripcion: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  intentosFallidos: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ultimoAcceso: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
    permisos: Permission[];
  };
}

interface AuthContextType {
  user: User | null;
  permisos: Permission[] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("[Auth] Login response status:", response.status);

      if (!response.ok) {
        console.log("[Auth] Response not OK, status:", response.status);
        const errorData = await response.json();
        console.log("[Auth] Error data:", errorData);
        throw new Error(
          errorData.error || `HTTP ${response.status}: Login failed`,
        );
      }

      const data = await response.json();
      console.log("[Auth] Login response data:", data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data));
        setUser(data.data);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("[Auth] Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
