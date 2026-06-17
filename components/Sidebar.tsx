"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClaroStore } from "@/lib/store";
import { businessConfig } from "@/lib/data";
import { LayoutDashboard, Users, UserCheck, Bot, Settings, CalendarDays, ClipboardList, Receipt, UserCog, Lock } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/employees", label: "Team", icon: UserCheck },
  { href: "/ai", label: "AI Assistant", icon: Bot },
];

const comingSoon = [
  { label: "Scheduling", icon: CalendarDays },
  { label: "Job Orders", icon: ClipboardList },
  { label: "Invoicing", icon: Receipt },
  { label: "HR & Payroll", icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { businessType, businessName } = useClaroStore();
  const cfg = businessType ? businessConfig[businessType] : null;

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="text-xl font-bold text-slate-800">
          <span className="text-teal-600">Clar</span>o
        </div>
        {cfg && (
          <div className="mt-1">
            <div className="text-xs font-medium text-slate-500 truncate">{businessName}</div>
            <div className="text-xs text-slate-400">{cfg.icon} {cfg.label}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        {/* Coming Soon modules */}
        <div className="mt-4 mb-1 px-3">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Coming Soon</p>
        </div>
        {comingSoon.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 cursor-not-allowed select-none"
          >
            <div className="flex items-center gap-3">
              <Icon size={16} />
              {label}
            </div>
            <Lock size={11} className="text-slate-200" />
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400">
          <Settings size={14} />
          <span>Essentials Plan</span>
        </div>
      </div>
    </aside>
  );
}
