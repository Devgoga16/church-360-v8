import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Solicitudes",
    icon: FileText,
    href: "/solicitudes",
  },
  {
    label: "Usuarios",
    icon: Users,
    href: "/usuarios",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/configuracion",
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#050A30] border-r border-[#173747] w-64 transition-all duration-300 ease-in-out z-40 md:relative md:top-0 flex flex-col shadow-xl",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="flex-1 px-3 py-8 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-gradient-to-r from-[#5E17EB] to-[#5E17EB] text-white shadow-lg shadow-[#5E17EB]/30"
                    : "text-slate-300 hover:text-white hover:bg-[#0C6980]/20"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                  active ? "text-white" : "group-hover:scale-110"
                )} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-6 border-t border-[#173747] space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-red-500/20 transition-all duration-200 font-medium group">
            <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
