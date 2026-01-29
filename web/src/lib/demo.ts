export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  createdAt: string;
};

export const clients: Client[] = [
  {
    id: "cli_001",
    name: "Acme Strata",
    email: "admin@acmestrata.com",
    phone: "+61 400 000 000",
    address: "1 Collins St",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cli_002",
    name: "Harbour View Body Corp",
    email: "manager@harbourview.com",
    phone: "+61 400 000 001",
    address: "22 Harbour Rd",
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cli_003",
    name: "Riverside Apartments",
    email: "office@riverside.com",
    phone: "+61 400 000 002",
    address: "9 River Ave",
    suburb: "Brisbane",
    state: "QLD",
    postcode: "4000",
    createdAt: new Date().toISOString(),
  },
];

export const escrow = [];

export const invoices = [];

export const jobs = [];

export const team = [];

export const settings = [];
