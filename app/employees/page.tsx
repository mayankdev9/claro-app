"use client";
import { useState } from "react";
import { useClaroStore } from "@/lib/store";
import { businessConfig, Employee } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Phone } from "lucide-react";

export default function EmployeesPage() {
  const { employees, customers, businessType, addEmployee } = useClaroStore();
  const cfg = businessType ? businessConfig[businessType] : null;
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", specialty: "", phone: "" });

  function loyalCustomers(empName: string) {
    return customers.filter((c) => c.preferredEmployee === empName).length;
  }

  function totalRevenue(empName: string) {
    return customers.reduce((sum, c) => {
      return sum + c.serviceHistory.filter((h) => h.employee === empName).reduce((s, h) => s + h.price, 0);
    }, 0);
  }

  function handleAdd() {
    const e: Employee = {
      id: `e${Date.now()}`,
      name: form.name,
      role: form.role || cfg?.employeeRole || "Staff",
      specialty: form.specialty,
      active: true,
      phone: form.phone,
    };
    addEmployee(e);
    setAdding(false);
    setForm({ name: "", role: "", specialty: "", phone: "" });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Team</h1>
            <p className="text-slate-400 text-sm">{employees.length} {cfg?.employeeRole}s</p>
          </div>
          <Button onClick={() => setAdding(true)} className="bg-teal-600 hover:bg-teal-700 gap-2 text-sm">
            <Plus size={14} /> Add {cfg?.employeeRole}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {employees.map((emp) => {
            const loyal = loyalCustomers(emp.name);
            const rev = totalRevenue(emp.name);
            return (
              <Card key={emp.id} className="p-5 bg-white border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <Badge variant={emp.active ? "default" : "secondary"} className={emp.active ? "bg-teal-100 text-teal-700 hover:bg-teal-100" : ""}>
                    {emp.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="font-semibold text-slate-800">{emp.name}</div>
                <div className="text-xs text-slate-400 mb-1">{emp.role}</div>
                <div className="text-xs text-teal-600 font-medium mb-3">{emp.specialty}</div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                  <Phone size={11} /> {emp.phone}
                </div>
                <div className="border-t border-slate-50 pt-3 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-800">{loyal}</div>
                    <div className="text-xs text-slate-400">Loyal clients</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-teal-600">${rev}</div>
                    <div className="text-xs text-slate-400">Revenue</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Preferred employee breakdown table */}
        <Card className="bg-white border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Client-{cfg?.employeeRole} Preference Map</h3>
          <div className="space-y-2">
            {customers.filter((c) => c.preferredEmployee).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-4 py-2">
                <span className="font-medium text-slate-700">{c.name}</span>
                <span className="text-slate-400">prefers</span>
                <span className="font-medium text-teal-600">{c.preferredEmployee}</span>
                <span className="text-slate-400 text-xs">{c.visits} visits · last {c.lastVisit}</span>
              </div>
            ))}
          </div>
        </Card>

        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add {cfg?.employeeRole}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {[
                { key: "name", label: "Full Name" },
                { key: "specialty", label: "Specialty" },
                { key: "phone", label: "Phone" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs text-slate-500 mb-1 block">{label}</Label>
                  <Input value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="text-sm border-slate-200" />
                </div>
              ))}
            </div>
            <Button onClick={handleAdd} disabled={!form.name} className="w-full bg-teal-600 hover:bg-teal-700 mt-2">Add {cfg?.employeeRole}</Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
