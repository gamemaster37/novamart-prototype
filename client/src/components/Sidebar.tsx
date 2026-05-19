import { BarChart3, Megaphone, ShieldCheck, Tags, Users, LifeBuoy } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/segments", label: "Segments", icon: Tags },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/support-cases", label: "Support Cases", icon: LifeBuoy },
  { to: "/privacy", label: "Privacy", icon: ShieldCheck }
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="text-lg font-bold text-slate-950">NovaMart CRM</div>
        <div className="mt-1 text-xs font-medium uppercase tracking-wide text-blue-600">AI-enabled demo</div>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100",
                isActive && "bg-blue-50 text-blue-700"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
