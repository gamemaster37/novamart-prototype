import { getCustomerById } from "./customerService.js";

export function routeSupportCase(input: { customerId: number; title: string; description: string }) {
  const text = `${input.title} ${input.description}`.toLowerCase();
  const customer = getCustomerById(input.customerId) as any;

  let category = "General enquiry";
  let assignedTeam = "General Support";
  let priority = "Medium";

  if (text.includes("billing") || text.includes("invoice") || text.includes("refund") || text.includes("charged") || text.includes("payment")) {
    category = "Billing issue";
    assignedTeam = "Billing Support";
  } else if (text.includes("delivery") || text.includes("shipping") || text.includes("tracking") || text.includes("late")) {
    category = "Delivery issue";
    assignedTeam = "Logistics Support";
  } else if (text.includes("loyalty") || text.includes("points") || text.includes("reward")) {
    category = "Loyalty points issue";
    assignedTeam = "Loyalty Support";
  } else if (text.includes("technical") || text.includes("password") || text.includes("login") || text.includes("app") || text.includes("website")) {
    category = "Technical issue";
    assignedTeam = "Digital Support";
  } else if (text.includes("complaint")) {
    category = "Complaint";
  }

  if ((text.includes("complaint") && customer?.segment === "High-value customers") || text.includes("urgent")) {
    priority = "High";
  } else if (text.includes("question") || text.includes("change") || text.includes("update")) {
    priority = "Low";
  }

  return { category, priority, assignedTeam };
}
