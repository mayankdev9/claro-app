import { create } from "zustand";
import { BusinessType, Customer, Employee, mockCustomers, mockEmployees } from "./data";

interface ClaroStore {
  businessType: BusinessType | null;
  businessName: string;
  customers: Customer[];
  employees: Employee[];
  setBusinessType: (type: BusinessType, name: string) => void;
  addCustomer: (customer: Customer) => void;
  addEmployee: (employee: Employee) => void;
}

export const useClaroStore = create<ClaroStore>((set) => ({
  businessType: null,
  businessName: "",
  customers: [],
  employees: [],
  setBusinessType: (type, name) =>
    set({
      businessType: type,
      businessName: name,
      customers: mockCustomers[type],
      employees: mockEmployees[type],
    }),
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),
}));
