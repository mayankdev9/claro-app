export type BusinessType = "salon" | "petgroomer" | "spa" | "autoshop";

export interface Employee {
  id: string;
  name: string;
  role: string;
  specialty: string;
  active: boolean;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  preferredEmployee: string;
  visits: number;
  lastVisit: string;
  totalSpend: number;
  serviceHistory: ServiceRecord[];
  notes: string;
  // salon
  hairType?: string;
  // pet groomer
  petName?: string;
  petBreed?: string;
  // spa
  membershipStatus?: string;
  // auto shop
  vehicleMake?: string;
  vehicleModel?: string;
  mileage?: number;
}

export interface ServiceRecord {
  date: string;
  service: string;
  employee: string;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  cost: number;
}

export const businessConfig: Record<BusinessType, {
  label: string;
  icon: string;
  description: string;
  employeeRole: string;
  customerLabel: string;
  services: Service[];
  extraFields: string[];
}> = {
  salon: {
    label: "Salon / Hair Studio",
    icon: "✂️",
    description: "Manage clients, stylists, and hair services",
    employeeRole: "Stylist",
    customerLabel: "Client",
    extraFields: ["hairType"],
    services: [
      { id: "s1", name: "Haircut", category: "Cutting", duration: 45, price: 55, cost: 10 },
      { id: "s2", name: "Hair Color", category: "Color", duration: 120, price: 150, cost: 40 },
      { id: "s3", name: "Highlights", category: "Color", duration: 90, price: 120, cost: 30 },
      { id: "s4", name: "Blowout", category: "Styling", duration: 45, price: 45, cost: 8 },
      { id: "s5", name: "Deep Conditioning", category: "Treatment", duration: 30, price: 35, cost: 12 },
    ],
  },
  petgroomer: {
    label: "Pet Groomer",
    icon: "🐾",
    description: "Track pets, owners, and grooming history",
    employeeRole: "Groomer",
    customerLabel: "Pet Owner",
    extraFields: ["petName", "petBreed"],
    services: [
      { id: "s1", name: "Full Groom", category: "Grooming", duration: 90, price: 75, cost: 15 },
      { id: "s2", name: "Bath & Brush", category: "Grooming", duration: 60, price: 45, cost: 10 },
      { id: "s3", name: "Nail Trim", category: "Grooming", duration: 15, price: 20, cost: 3 },
      { id: "s4", name: "Teeth Cleaning", category: "Health", duration: 30, price: 30, cost: 8 },
      { id: "s5", name: "Ear Cleaning", category: "Health", duration: 15, price: 15, cost: 3 },
    ],
  },
  spa: {
    label: "Massage Spa / Wellness",
    icon: "🧖",
    description: "Track clients, therapists, and treatments",
    employeeRole: "Therapist",
    customerLabel: "Client",
    extraFields: ["membershipStatus"],
    services: [
      { id: "s1", name: "Swedish Massage", category: "Massage", duration: 60, price: 90, cost: 20 },
      { id: "s2", name: "Deep Tissue", category: "Massage", duration: 60, price: 110, cost: 22 },
      { id: "s3", name: "Hot Stone", category: "Massage", duration: 90, price: 130, cost: 30 },
      { id: "s4", name: "Facial", category: "Skin Care", duration: 60, price: 85, cost: 18 },
      { id: "s5", name: "Body Scrub", category: "Skin Care", duration: 45, price: 75, cost: 15 },
    ],
  },
  autoshop: {
    label: "Auto Repair Shop",
    icon: "🔧",
    description: "Manage vehicles, mechanics, and service records",
    employeeRole: "Mechanic",
    customerLabel: "Customer",
    extraFields: ["vehicleMake", "vehicleModel", "mileage"],
    services: [
      { id: "s1", name: "Oil Change", category: "Maintenance", duration: 30, price: 65, cost: 20 },
      { id: "s2", name: "Brake Service", category: "Safety", duration: 120, price: 250, cost: 80 },
      { id: "s3", name: "Tire Rotation", category: "Maintenance", duration: 30, price: 45, cost: 10 },
      { id: "s4", name: "Engine Diagnostic", category: "Diagnostic", duration: 60, price: 120, cost: 15 },
      { id: "s5", name: "AC Service", category: "Comfort", duration: 90, price: 180, cost: 50 },
    ],
  },
};

export const mockEmployees: Record<BusinessType, Employee[]> = {
  salon: [
    { id: "e1", name: "Maria Santos", role: "Stylist", specialty: "Color & Highlights", active: true, phone: "555-0101" },
    { id: "e2", name: "James Lee", role: "Stylist", specialty: "Cuts & Styling", active: true, phone: "555-0102" },
    { id: "e3", name: "Priya Patel", role: "Stylist", specialty: "Keratin Treatments", active: true, phone: "555-0103" },
  ],
  petgroomer: [
    { id: "e1", name: "David Kim", role: "Groomer", specialty: "Large Breeds", active: true, phone: "555-0201" },
    { id: "e2", name: "Sofia Ramirez", role: "Groomer", specialty: "Small Breeds & Cats", active: true, phone: "555-0202" },
  ],
  spa: [
    { id: "e1", name: "Aisha Johnson", role: "Therapist", specialty: "Deep Tissue & Hot Stone", active: true, phone: "555-0301" },
    { id: "e2", name: "Lena Park", role: "Therapist", specialty: "Swedish & Facial", active: true, phone: "555-0302" },
    { id: "e3", name: "Marco Rossi", role: "Therapist", specialty: "Sports & Rehabilitation", active: true, phone: "555-0303" },
  ],
  autoshop: [
    { id: "e1", name: "Carlos Rivera", role: "Mechanic", specialty: "Engine & Transmission", active: true, phone: "555-0401" },
    { id: "e2", name: "Tom Bradley", role: "Mechanic", specialty: "Brakes & Suspension", active: true, phone: "555-0402" },
  ],
};

export const mockCustomers: Record<BusinessType, Customer[]> = {
  salon: [
    { id: "c1", name: "Emma Wilson", phone: "555-1001", email: "emma@email.com", area: "Downtown", preferredEmployee: "Maria Santos", visits: 12, lastVisit: "2026-06-10", totalSpend: 1240, hairType: "Curly", notes: "Prefers organic products", serviceHistory: [{ date: "2026-06-10", service: "Hair Color", employee: "Maria Santos", price: 150 }, { date: "2026-05-15", service: "Haircut", employee: "Maria Santos", price: 55 }] },
    { id: "c2", name: "Olivia Chen", phone: "555-1002", email: "olivia@email.com", area: "Midtown", preferredEmployee: "James Lee", visits: 8, lastVisit: "2026-06-05", totalSpend: 620, hairType: "Straight", notes: "", serviceHistory: [{ date: "2026-06-05", service: "Blowout", employee: "James Lee", price: 45 }, { date: "2026-05-01", service: "Haircut", employee: "James Lee", price: 55 }] },
    { id: "c3", name: "Sarah Mitchell", phone: "555-1003", email: "sarah@email.com", area: "Uptown", preferredEmployee: "Maria Santos", visits: 20, lastVisit: "2026-06-12", totalSpend: 2800, hairType: "Wavy", notes: "VIP client — always books 2 weeks ahead", serviceHistory: [{ date: "2026-06-12", service: "Highlights", employee: "Maria Santos", price: 120 }] },
    { id: "c4", name: "Zoe Adams", phone: "555-1004", email: "zoe@email.com", area: "East Side", preferredEmployee: "Priya Patel", visits: 5, lastVisit: "2026-05-20", totalSpend: 380, hairType: "Fine", notes: "", serviceHistory: [{ date: "2026-05-20", service: "Deep Conditioning", employee: "Priya Patel", price: 35 }] },
    { id: "c5", name: "Rachel Torres", phone: "555-1005", email: "rachel@email.com", area: "West End", preferredEmployee: "James Lee", visits: 15, lastVisit: "2026-06-08", totalSpend: 1650, hairType: "Thick", notes: "Allergic to ammonia-based dye", serviceHistory: [{ date: "2026-06-08", service: "Hair Color", employee: "James Lee", price: 150 }] },
  ],
  petgroomer: [
    { id: "c1", name: "Tom & Bella Harris", phone: "555-2001", email: "tom@email.com", area: "Suburbs", preferredEmployee: "David Kim", visits: 10, lastVisit: "2026-06-01", totalSpend: 650, petName: "Bella", petBreed: "Golden Retriever", notes: "Bella is anxious — needs extra time", serviceHistory: [{ date: "2026-06-01", service: "Full Groom", employee: "David Kim", price: 75 }] },
    { id: "c2", name: "Lisa Park", phone: "555-2002", email: "lisa@email.com", area: "Downtown", preferredEmployee: "Sofia Ramirez", visits: 7, lastVisit: "2026-06-10", totalSpend: 320, petName: "Mochi", petBreed: "Shih Tzu", notes: "", serviceHistory: [{ date: "2026-06-10", service: "Bath & Brush", employee: "Sofia Ramirez", price: 45 }] },
  ],
  spa: [
    { id: "c1", name: "Diana Foster", phone: "555-3001", email: "diana@email.com", area: "North Side", preferredEmployee: "Aisha Johnson", visits: 18, lastVisit: "2026-06-11", totalSpend: 2100, membershipStatus: "Premium Member", notes: "Prefers firm pressure", serviceHistory: [{ date: "2026-06-11", service: "Deep Tissue", employee: "Aisha Johnson", price: 110 }, { date: "2026-05-28", service: "Hot Stone", employee: "Aisha Johnson", price: 130 }] },
    { id: "c2", name: "Natalie Bloom", phone: "555-3002", email: "natalie@email.com", area: "Downtown", preferredEmployee: "Lena Park", visits: 9, lastVisit: "2026-06-05", totalSpend: 890, membershipStatus: "Basic Member", notes: "", serviceHistory: [{ date: "2026-06-05", service: "Swedish Massage", employee: "Lena Park", price: 90 }] },
    { id: "c3", name: "Karen Wu", phone: "555-3003", email: "karen@email.com", area: "West Side", preferredEmployee: "Lena Park", visits: 6, lastVisit: "2026-05-30", totalSpend: 540, membershipStatus: "Non-Member", notes: "Birthday in July — send promo", serviceHistory: [{ date: "2026-05-30", service: "Facial", employee: "Lena Park", price: 85 }] },
  ],
  autoshop: [
    { id: "c1", name: "Mike Johnson", phone: "555-4001", email: "mike@email.com", area: "East Side", preferredEmployee: "Carlos Rivera", visits: 14, lastVisit: "2026-06-08", totalSpend: 2400, vehicleMake: "Toyota", vehicleModel: "Camry 2019", mileage: 68000, notes: "Comes every 5K miles for oil change", serviceHistory: [{ date: "2026-06-08", service: "Oil Change", employee: "Carlos Rivera", price: 65 }, { date: "2026-03-10", service: "Brake Service", employee: "Carlos Rivera", price: 250 }] },
    { id: "c2", name: "Amanda Scott", phone: "555-4002", email: "amanda@email.com", area: "Suburbs", preferredEmployee: "Tom Bradley", visits: 6, lastVisit: "2026-05-25", totalSpend: 950, vehicleMake: "Honda", vehicleModel: "CR-V 2021", mileage: 32000, notes: "", serviceHistory: [{ date: "2026-05-25", service: "Tire Rotation", employee: "Tom Bradley", price: 45 }] },
    { id: "c3", name: "Robert Chase", phone: "555-4003", email: "robert@email.com", area: "Downtown", preferredEmployee: "Carlos Rivera", visits: 22, lastVisit: "2026-06-14", totalSpend: 5800, vehicleMake: "Ford", vehicleModel: "F-150 2020", mileage: 95000, notes: "Fleet vehicle — invoice to Chase Construction", serviceHistory: [{ date: "2026-06-14", service: "Engine Diagnostic", employee: "Carlos Rivera", price: 120 }] },
  ],
};
