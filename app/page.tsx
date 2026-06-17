"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClaroStore } from "@/lib/store";
import { BusinessType, businessConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  const [selected, setSelected] = useState<BusinessType | null>(null);
  const [name, setName] = useState("");
  const setBusinessType = useClaroStore((s) => s.setBusinessType);
  const router = useRouter();

  function handleStart() {
    if (!selected || !name.trim()) return;
    setBusinessType(selected, name.trim());
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-slate-800 tracking-tight mb-2">
          <span className="text-teal-600">Clar</span>o
        </h1>
        <p className="text-slate-500 text-lg">Finally know your customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Welcome — let&apos;s get you set up</h2>
        <p className="text-slate-500 text-sm mb-6">Select your business type. Claro will configure itself for you.</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {(Object.entries(businessConfig) as [BusinessType, typeof businessConfig[BusinessType]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                selected === key
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 hover:border-teal-300 bg-white"
              }`}
            >
              <span className="text-3xl mb-2">{cfg.icon}</span>
              <span className="font-semibold text-slate-800 text-sm">{cfg.label}</span>
              <span className="text-slate-400 text-xs mt-0.5">{cfg.description}</span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <Label htmlFor="bizname" className="text-sm font-medium text-slate-700 mb-1 block">
            Your business name
          </Label>
          <Input
            id="bizname"
            placeholder="e.g. Glow Studio, Paws & Claws, River Spa..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-slate-200"
          />
        </div>

        <Button
          onClick={handleStart}
          disabled={!selected || !name.trim()}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl"
        >
          Start with sample data →
        </Button>
        <p className="text-center text-xs text-slate-400 mt-3">
          14-day free trial · No credit card required
        </p>
      </div>
    </div>
  );
}
