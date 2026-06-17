"use client";
import { useClaroStore } from "@/lib/store";
import { businessConfig } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Star, Calendar, CalendarDays, ClipboardList, Receipt, UserCog, Lock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function DashboardPage() {
  const { customers, employees, businessType, businessName } = useClaroStore();
  const cfg = businessType ? businessConfig[businessType] : null;

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpend, 0);
  const totalVisits = customers.reduce((s, c) => s + c.visits, 0);
  const avgSpend = customers.length ? Math.round(totalRevenue / customers.length) : 0;

  // Service frequency from history
  const serviceCount: Record<string, number> = {};
  customers.forEach((c) =>
    c.serviceHistory.forEach((h) => {
      serviceCount[h.service] = (serviceCount[h.service] || 0) + 1;
    })
  );
  const serviceData = Object.entries(serviceCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Employee loyalty — count customers per preferred employee
  const empCount: Record<string, number> = {};
  customers.forEach((c) => {
    if (c.preferredEmployee) empCount[c.preferredEmployee] = (empCount[c.preferredEmployee] || 0) + 1;
  });
  const empData = Object.entries(empCount).map(([name, value]) => ({ name, value }));
  const COLORS = ["#0d9488", "#0891b2", "#6366f1", "#f59e0b", "#ef4444"];

  // Area breakdown
  const areaCount: Record<string, number> = {};
  customers.forEach((c) => { areaCount[c.area] = (areaCount[c.area] || 0) + 1; });
  const areaData = Object.entries(areaCount).map(([area, count]) => ({ area, count }));

  if (!businessType) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Please <a href="/" className="text-teal-600 underline">set up your business</a> first.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{businessName}</h1>
          <p className="text-slate-400 text-sm">{cfg?.icon} {cfg?.label} · Dashboard</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Customers", value: customers.length, icon: Users, color: "text-teal-600" },
            { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-blue-600" },
            { label: "Avg Spend / Customer", value: `$${avgSpend}`, icon: Star, color: "text-violet-600" },
            { label: "Total Visits", value: totalVisits, icon: Calendar, color: "text-amber-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-5 bg-white border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
                <Icon size={16} className={color} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{value}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Top Services */}
          <Card className="p-5 bg-white border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Services by Frequency</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Employee loyalty */}
          <Card className="p-5 bg-white border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Customer Loyalty by {cfg?.employeeRole}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={empData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }: { name?: string; value?: number }) => name ? `${name.split(" ")[0]} (${value})` : ""} labelLine={false}>
                  {empData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Area breakdown + top customers */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="p-5 bg-white border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Customers by Area</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={areaData}>
                <XAxis dataKey="area" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5 bg-white border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Customers by Spend</h3>
            <div className="space-y-3">
              {[...customers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.visits} visits · {c.preferredEmployee}</div>
                  </div>
                  <div className="text-sm font-semibold text-teal-600">${c.totalSpend.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Add-on Modules */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Add-on Modules</h2>
              <p className="text-xs text-slate-400 mt-0.5">Expand Claro as your business grows · +$6.99/mo each</p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-full font-medium">Growth Plan includes any 2</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                icon: CalendarDays,
                name: "Scheduling",
                desc: "Preference-aware appointment booking. Auto-suggests the customer's preferred employee at open slots.",
                color: "text-teal-600",
                bg: "bg-teal-50",
              },
              {
                icon: ClipboardList,
                name: "Job Orders",
                desc: "Create and track service jobs end-to-end. Attach notes, parts, and status updates to each job.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Receipt,
                name: "Invoicing",
                desc: "Generate and send invoices tied to jobs and customers. Track payments and outstanding balances.",
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                icon: UserCog,
                name: "HR & Payroll",
                desc: "Manage shifts, time-off requests, and payroll tracking. Export clean reports for your accountant.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map(({ icon: Icon, name, desc, color, bg }) => (
              <Card key={name} className="p-5 bg-white border-slate-100 relative flex flex-col gap-3 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    <Lock size={10} /> Coming Soon
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">{name}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
                <button className="mt-auto text-xs font-medium text-teal-600 hover:text-teal-700 border border-teal-100 hover:border-teal-200 rounded-md py-1.5 transition-colors">
                  Learn More →
                </button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
