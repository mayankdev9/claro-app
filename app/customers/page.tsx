"use client";
import { useState } from "react";
import { useClaroStore } from "@/lib/store";
import { businessConfig, Customer } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, ChevronRight, Upload } from "lucide-react";

export default function CustomersPage() {
  const { customers, employees, businessType, addCustomer } = useClaroStore();
  const cfg = businessType ? businessConfig[businessType] : null;
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", area: "", preferredEmployee: "", notes: "", hairType: "", colorTreated: "", petName: "", petBreed: "", petSize: "", petAge: "", membershipStatus: "", pressurePreference: "", vehicleMake: "", vehicleModel: "", mileage: "", fleetVehicle: "" });

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.area.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    const c: Customer = {
      id: `c${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      area: form.area,
      preferredEmployee: form.preferredEmployee,
      visits: 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      totalSpend: 0,
      serviceHistory: [],
      notes: form.notes,
      ...(businessType === "salon" && { hairType: form.hairType, colorTreated: form.colorTreated }),
      ...(businessType === "petgroomer" && { petName: form.petName, petBreed: form.petBreed, petSize: form.petSize, petAge: form.petAge }),
      ...(businessType === "spa" && { membershipStatus: form.membershipStatus, pressurePreference: form.pressurePreference }),
      ...(businessType === "autoshop" && { vehicleMake: form.vehicleMake, vehicleModel: form.vehicleModel, mileage: Number(form.mileage), fleetVehicle: form.fleetVehicle }),
    };
    addCustomer(c);
    setAdding(false);
    setForm({ name: "", phone: "", email: "", area: "", preferredEmployee: "", notes: "", hairType: "", colorTreated: "", petName: "", petBreed: "", petSize: "", petAge: "", membershipStatus: "", pressurePreference: "", vehicleMake: "", vehicleModel: "", mileage: "", fleetVehicle: "" });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{cfg?.customerLabel}s</h1>
            <p className="text-slate-400 text-sm">{customers.length} records</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 text-sm border-slate-200">
              <Upload size={14} /> Import Excel
            </Button>
            <Button onClick={() => setAdding(true)} className="bg-teal-600 hover:bg-teal-700 gap-2 text-sm">
              <Plus size={14} /> Add {cfg?.customerLabel}
            </Button>
          </div>
        </div>

        <Card className="bg-white border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search by name or area..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-slate-200 text-sm" />
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-left transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.area} · {c.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400">Preferred</div>
                    <div className="text-xs font-medium text-slate-600">{c.preferredEmployee || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Visits</div>
                    <div className="text-sm font-semibold text-slate-700">{c.visits}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Spend</div>
                    <div className="text-sm font-semibold text-teal-600">${c.totalSpend.toLocaleString()}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Customer Detail Modal */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                  {selected?.name.charAt(0)}
                </div>
                {selected?.name}
              </DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-400">Phone</span><div className="font-medium">{selected.phone}</div></div>
                  <div><span className="text-slate-400">Email</span><div className="font-medium">{selected.email}</div></div>
                  <div><span className="text-slate-400">Area</span><div className="font-medium">{selected.area}</div></div>
                  <div><span className="text-slate-400">Preferred {cfg?.employeeRole}</span><div className="font-medium text-teal-600">{selected.preferredEmployee || "None"}</div></div>
                  {selected.hairType && <div><span className="text-slate-400">Hair Type</span><div className="font-medium">{selected.hairType}</div></div>}
                  {selected.colorTreated && <div><span className="text-slate-400">Color Treated</span><div className="font-medium">{selected.colorTreated}</div></div>}
                  {selected.petName && <div><span className="text-slate-400">Pet</span><div className="font-medium">{selected.petName} ({selected.petBreed})</div></div>}
                  {selected.petSize && <div><span className="text-slate-400">Pet Size</span><div className="font-medium">{selected.petSize}</div></div>}
                  {selected.petAge && <div><span className="text-slate-400">Pet Age</span><div className="font-medium">{selected.petAge}</div></div>}
                  {selected.membershipStatus && <div><span className="text-slate-400">Membership</span><Badge variant="secondary">{selected.membershipStatus}</Badge></div>}
                  {selected.pressurePreference && <div><span className="text-slate-400">Pressure Pref.</span><div className="font-medium">{selected.pressurePreference}</div></div>}
                  {selected.vehicleMake && <div><span className="text-slate-400">Vehicle</span><div className="font-medium">{selected.vehicleMake} {selected.vehicleModel}</div></div>}
                  {selected.mileage && <div><span className="text-slate-400">Mileage</span><div className="font-medium">{selected.mileage?.toLocaleString()} mi</div></div>}
                  {selected.fleetVehicle && <div><span className="text-slate-400">Fleet</span><Badge variant="secondary">Fleet Vehicle</Badge></div>}
                </div>
                {selected.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
                    📝 {selected.notes}
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Service History</div>
                  <div className="space-y-2">
                    {selected.serviceHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                        <div>
                          <span className="font-medium text-slate-700">{h.service}</span>
                          <span className="text-slate-400 ml-2">by {h.employee}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-xs">{h.date}</span>
                          <span className="font-semibold text-teal-600">${h.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Customer Modal */}
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add {cfg?.customerLabel}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "name", label: "Full Name" },
                { key: "phone", label: "Phone" },
                { key: "email", label: "Email" },
                { key: "area", label: "Area / Neighborhood" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs text-slate-500 mb-1 block">{label}</Label>
                  <Input value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="text-sm border-slate-200" />
                </div>
              ))}

              <div className="col-span-2">
                <Label className="text-xs text-slate-500 mb-1 block">Preferred {cfg?.employeeRole}</Label>
                <select value={form.preferredEmployee} onChange={(e) => setForm((f) => ({ ...f, preferredEmployee: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                  <option value="">No preference</option>
                  {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
              </div>

              {/* Business-type specific fields */}
              <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-3">{cfg?.label} Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {businessType === "salon" && (
                    <>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Hair Type</Label>
                        <select value={form.hairType} onChange={(e) => setForm((f) => ({ ...f, hairType: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                          <option value="">Select...</option>
                          <option>Straight</option><option>Wavy</option><option>Curly</option><option>Coily</option><option>Fine</option><option>Thick</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Color Treated?</Label>
                        <select value={form.colorTreated} onChange={(e) => setForm((f) => ({ ...f, colorTreated: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                          <option value="">Unknown</option><option>Yes — Single Process</option><option>Yes — Highlights</option><option>Yes — Balayage</option><option>No — Natural</option>
                        </select>
                      </div>
                    </>
                  )}
                  {businessType === "petgroomer" && (
                    <>
                      <div><Label className="text-xs text-slate-500 mb-1 block">Pet Name</Label><Input value={form.petName} onChange={(e) => setForm((f) => ({ ...f, petName: e.target.value }))} className="text-sm border-slate-200" /></div>
                      <div><Label className="text-xs text-slate-500 mb-1 block">Breed</Label><Input value={form.petBreed} onChange={(e) => setForm((f) => ({ ...f, petBreed: e.target.value }))} className="text-sm border-slate-200" /></div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Pet Size</Label>
                        <select value={form.petSize} onChange={(e) => setForm((f) => ({ ...f, petSize: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                          <option value="">Select...</option><option>Small (under 20 lbs)</option><option>Medium (20–50 lbs)</option><option>Large (50+ lbs)</option>
                        </select>
                      </div>
                      <div><Label className="text-xs text-slate-500 mb-1 block">Pet Age</Label><Input placeholder="e.g. 3 years" value={form.petAge} onChange={(e) => setForm((f) => ({ ...f, petAge: e.target.value }))} className="text-sm border-slate-200" /></div>
                    </>
                  )}
                  {businessType === "spa" && (
                    <>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Membership Status</Label>
                        <select value={form.membershipStatus} onChange={(e) => setForm((f) => ({ ...f, membershipStatus: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                          <option value="">Non-Member</option><option>Basic Member</option><option>Premium Member</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Pressure Preference</Label>
                        <select value={form.pressurePreference} onChange={(e) => setForm((f) => ({ ...f, pressurePreference: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                          <option value="">No preference</option><option>Light</option><option>Medium</option><option>Firm</option><option>Deep Tissue</option>
                        </select>
                      </div>
                    </>
                  )}
                  {businessType === "autoshop" && (
                    <>
                      <div><Label className="text-xs text-slate-500 mb-1 block">Vehicle Make</Label><Input value={form.vehicleMake} onChange={(e) => setForm((f) => ({ ...f, vehicleMake: e.target.value }))} className="text-sm border-slate-200" /></div>
                      <div><Label className="text-xs text-slate-500 mb-1 block">Model & Year</Label><Input value={form.vehicleModel} onChange={(e) => setForm((f) => ({ ...f, vehicleModel: e.target.value }))} className="text-sm border-slate-200" /></div>
                      <div><Label className="text-xs text-slate-500 mb-1 block">Mileage</Label><Input type="number" placeholder="e.g. 45000" value={form.mileage} onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))} className="text-sm border-slate-200" /></div>
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Fleet Vehicle?</Label>
                        <select value={form.fleetVehicle} onChange={(e) => setForm((f) => ({ ...f, fleetVehicle: e.target.value }))} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm">
                          <option value="">No</option><option>Yes — invoice to company</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <Label className="text-xs text-slate-500 mb-1 block">Notes</Label>
                <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="text-sm border-slate-200" placeholder="Allergies, preferences..." />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!form.name} className="w-full bg-teal-600 hover:bg-teal-700 mt-2">Add {cfg?.customerLabel}</Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
