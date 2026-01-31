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
};

export const jobs: Job[] = [
  { id: "J-1041", title: "High-rise washdown + repaint", client: "Strata Group A", site: "Southbank Tower", status: "In Progress", assignee: "Crew 2", due: "Tue", value: 18400, tags: ["rope-access", "facade"] },
  { id: "J-1042", title: "Balcony leak remediation", client: "Homeowner", site: "Carlton", status: "Awaiting Payment", assignee: "Crew 1", due: "Thu", value: 6200, tags: ["waterproofing"] },
  { id: "J-1043", title: "Common area repaint", client: "Body Corp", site: "Docklands", status: "Scheduled", assignee: "Crew 3", due: "Mon", value: 9100, tags: ["interior"] },
  { id: "J-1044", title: "Render repairs + seal", client: "Builder Co", site: "Fitzroy", status: "Dispute", assignee: "Crew 2", due: "Wed", value: 5400, tags: ["qa", "inspection"] },
  { id: "J-1045", title: "Roof touch-ups", client: "Commercial", site: "Richmond", status: "Complete", assignee: "Crew 1", due: "Fri", value: 3300, tags: ["maintenance"] },
];
