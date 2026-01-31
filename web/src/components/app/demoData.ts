export type Job = {
  id: string;
  title: string;
  client: string;
  site: string;
  status: "In Progress" | "Awaiting Payment" | "Dispute" | "Complete" | "Scheduled";
  assignee: string;
  due: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  value: number;
  tags: string[];
  milestone: "Deposit" | "Mid" | "Final";
};

export type Client = {
  id: string;
  name: string;
  type: "Strata" | "Commercial" | "Residential" | "Builder";
  email: string;
  phone: string;
  risk: "Low" | "Medium" | "High";
};

export type Invoice = {
  id: string;
  client: string;
  jobId: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  dueIn: string;
};

export const jobs: Job[] = [
  { id: "J-1041", title: "High-rise washdown + repaint", client: "Strata Group A", site: "Southbank Tower", status: "In Progress", assignee: "Crew 2", due: "Tue", value: 18400, tags: ["rope-access", "facade"], milestone: "Mid" },
  { id: "J-1042", title: "Balcony leak remediation", client: "Homeowner", site: "Carlton", status: "Awaiting Payment", assignee: "Crew 1", due: "Thu", value: 6200, tags: ["waterproofing"], milestone: "Final" },
  { id: "J-1043", title: "Common area repaint", client: "Body Corp", site: "Docklands", status: "Scheduled", assignee: "Crew 3", due: "Mon", value: 9100, tags: ["interior"], milestone: "Deposit" },
  { id: "J-1044", title: "Render repairs + seal", client: "Builder Co", site: "Fitzroy", status: "Dispute", assignee: "Crew 2", due: "Wed", value: 5400, tags: ["qa", "inspection"], milestone: "Mid" },
  { id: "J-1045", title: "Roof touch-ups", client: "Commercial", site: "Richmond", status: "Complete", assignee: "Crew 1", due: "Fri", value: 3300, tags: ["maintenance"], milestone: "Final" },
];

export const clients: Client[] = [
  { id: "C-2001", name: "Strata Group A", type: "Strata", email: "ops@stratagroupa.com", phone: "+61 4xx xxx xxx", risk: "Low" },
  { id: "C-2002", name: "Builder Co", type: "Builder", email: "accounts@builderco.com", phone: "+61 4xx xxx xxx", risk: "Medium" },
  { id: "C-2003", name: "Docklands Body Corp", type: "Strata", email: "committee@docklandsbc.com", phone: "+61 4xx xxx xxx", risk: "Low" },
  { id: "C-2004", name: "Southbank Commercial", type: "Commercial", email: "facilities@southbank.com", phone: "+61 4xx xxx xxx", risk: "Medium" },
  { id: "C-2005", name: "Homeowner", type: "Residential", email: "ryan.joooseph@icloud.com", phone: "+61 4xx xxx xxx", risk: "High" },
];

export const invoices: Invoice[] = [
  { id: "INV-9001", client: "Strata Group A", jobId: "J-1041", amount: 9200, status: "Sent", dueIn: "6 days" },
  { id: "INV-9002", client: "Homeowner", jobId: "J-1042", amount: 6200, status: "Overdue", dueIn: "3 days ago" },
  { id: "INV-9003", client: "Docklands Body Corp", jobId: "J-1043", amount: 4550, status: "Draft", dueIn: "—" },
  { id: "INV-9004", client: "Builder Co", jobId: "J-1044", amount: 2700, status: "Paid", dueIn: "—" },
];
