export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  loyalty_status: string;
  preferred_category: string;
  last_purchase_date: string;
  lifetime_value: number;
  churn_risk: string;
  data_source: string;
  created_at?: string;
};

export type Purchase = {
  id: number;
  customer_id: number;
  product_name: string;
  category: string;
  amount: number;
  purchase_date: string;
};

export type Interaction = {
  id: number;
  customer_id: number;
  type: string;
  channel: string;
  summary: string;
  status: string;
  created_at: string;
};

export type SupportCase = {
  id: number;
  customer_id: number;
  customer_name?: string;
  customer_segment?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assigned_team: string;
  created_at: string;
};

export type Campaign = {
  id: number;
  name: string;
  target_segment: string;
  channel: string;
  status: string;
  start_date: string;
  end_date: string;
  conversion_rate: number;
  revenue_generated: number;
};

export type Segment = {
  id: number;
  name: string;
  description: string;
  rule_description: string;
  customer_count: number;
};

export type AiRecommendation = {
  type: string;
  response: Record<string, unknown> | string;
  is_fallback: boolean | number;
  created_at?: string;
};

export type DashboardData = {
  kpis: {
    totalCustomers: number;
    activeCustomers: number;
    monthlySales: number;
    retentionRate: number;
    openSupportCases: number;
    campaignConversionRate: number;
  };
  charts: {
    salesTrend: Array<{ month: string; sales: number }>;
    segmentBreakdown: Array<{ name: string; value: number }>;
    campaignPerformance: Array<{ name: string; conversion_rate: number; revenue_generated: number }>;
    supportStatusBreakdown: Array<{ name: string; value: number }>;
  };
  insightSummary: string;
};
