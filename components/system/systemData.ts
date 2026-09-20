export type SystemCategory =
  | "OPERATIONS"
  | "COMMERCE"
  | "INTELLIGENCE"
  | "PLATFORMS"
  | "BUSINESS SYSTEMS"
  | "AI AUTOMATION"
  | "PAYMENTS";

export type SystemModule = {
  id: string;
  name: string;
  role: string;
  description: string;
};

export type SystemDefinition = {
  id: string;
  number: string;
  name: string;
  category: SystemCategory;
  headline: string;
  description: string;
  applications: string[];
  modules: SystemModule[];
};

export const SYSTEM_CATEGORIES: Array<"ALL" | SystemCategory> = [
  "ALL",
  "OPERATIONS",
  "COMMERCE",
  "INTELLIGENCE",
  "PLATFORMS",
  "BUSINESS SYSTEMS",
  "AI AUTOMATION",
  "PAYMENTS",
];

export const SYSTEMS: SystemDefinition[] = [
  {
    id: "enterprise-operations",
    number: "001",
    name: "ENTERPRISE OPERATIONS",
    category: "OPERATIONS",
    headline: "ONE OPERATING SYSTEM. EVERY DEPARTMENT.",
    description: "Connect teams, approvals, assets, purchasing, and operational reporting inside one coordinated environment.",
    applications: ["Multi-department workflows", "Procurement and approvals", "Asset management", "Operational dashboards"],
    modules: [
      { id: "intake", name: "INTAKE", role: "01 / INPUT", description: "Collect requests, documents, operational events, and structured data from across the organization." },
      { id: "rules", name: "RULE ENGINE", role: "02 / LOGIC", description: "Apply authorization rules, approval chains, escalation conditions, and business-specific policies." },
      { id: "orchestrator", name: "ORCHESTRATOR", role: "03 / EXECUTION", description: "Coordinate tasks between departments, external services, and human decision-makers." },
      { id: "records", name: "RECORDS", role: "04 / DATA", description: "Maintain searchable operational records, history, ownership, and audit trails." },
      { id: "command", name: "COMMAND", role: "05 / OUTPUT", description: "Present live operational views, notifications, exceptions, and management reporting." },
    ],
  },
  {
    id: "commerce-infrastructure",
    number: "002",
    name: "COMMERCE INFRASTRUCTURE",
    category: "COMMERCE",
    headline: "FROM FIRST CLICK TO FINAL DELIVERY.",
    description: "Build connected commerce environments spanning storefronts, inventory, orders, payments, and fulfillment.",
    applications: ["Multi-store commerce", "Order orchestration", "Supplier integrations", "Inventory synchronization"],
    modules: [
      { id: "storefront", name: "STOREFRONT", role: "01 / INPUT", description: "Support product discovery, customer accounts, configurable products, and checkout experiences." },
      { id: "checkout", name: "CHECKOUT", role: "02 / LOGIC", description: "Coordinate pricing rules, payment flows, eligibility checks, and order validation." },
      { id: "orders", name: "ORDER ENGINE", role: "03 / EXECUTION", description: "Route orders, manage exceptions, and coordinate supplier or warehouse fulfillment." },
      { id: "inventory", name: "INVENTORY", role: "04 / DATA", description: "Reconcile stock levels, supplier availability, reservations, and fulfillment updates." },
      { id: "delivery", name: "DELIVERY", role: "05 / OUTPUT", description: "Expose order status, shipping events, customer updates, and operational reporting." },
    ],
  },
  {
    id: "ai-intelligence",
    number: "003",
    name: "AI INTELLIGENCE SYSTEMS",
    category: "INTELLIGENCE",
    headline: "TURN INFORMATION INTO ACTION.",
    description: "Design AI-assisted workflows that connect organizational knowledge, structured data, human review, and business tools.",
    applications: ["Knowledge assistants", "Document processing", "Recommendation engines", "Human-in-the-loop workflows"],
    modules: [
      { id: "sources", name: "DATA SOURCES", role: "01 / INPUT", description: "Connect approved documents, databases, applications, and internal knowledge repositories." },
      { id: "retrieval", name: "RETRIEVAL", role: "02 / LOGIC", description: "Find relevant information using search, structured queries, and retrieval pipelines." },
      { id: "reasoning", name: "AI ENGINE", role: "03 / EXECUTION", description: "Generate responses, classify information, and assist with defined business tasks." },
      { id: "review", name: "GUARDRAILS", role: "04 / DATA", description: "Introduce permission checks, evaluation, traceability, and human approval where required." },
      { id: "actions", name: "WORKSPACE", role: "05 / OUTPUT", description: "Deliver useful results through dashboards, internal tools, notifications, or authorized actions." },
    ],
  },
  {
    id: "logistics-command",
    number: "004",
    name: "LOGISTICS COMMAND",
    category: "OPERATIONS",
    headline: "COORDINATE MOVEMENT AT SCALE.",
    description: "Unify fleet activity, dispatch, tracking, warehouse events, and operational exceptions.",
    applications: ["Fleet management", "Dispatch planning", "Warehouse coordination", "Delivery visibility"],
    modules: [
      { id: "requests", name: "REQUESTS", role: "01 / INPUT", description: "Capture shipment requirements, locations, capacity constraints, and delivery priorities." },
      { id: "planning", name: "PLANNING", role: "02 / LOGIC", description: "Evaluate allocation rules, available resources, schedules, and route constraints." },
      { id: "dispatch", name: "DISPATCH", role: "03 / EXECUTION", description: "Assign resources, distribute work, and coordinate updates across operational teams." },
      { id: "tracking", name: "TRACKING", role: "04 / DATA", description: "Collect position updates, milestones, delays, and warehouse or delivery events." },
      { id: "control", name: "CONTROL ROOM", role: "05 / OUTPUT", description: "Surface exceptions, operational status, and performance information in one command view." },
    ],
  },
  {
    id: "financial-workflows",
    number: "005",
    name: "FINANCIAL WORKFLOWS",
    category: "PLATFORMS",
    headline: "COMPLEX TRANSACTIONS. CLEAR CONTROL.",
    description: "Create financial operations platforms with structured transaction workflows, reconciliation, and controlled access.",
    applications: ["Transaction workflows", "Reconciliation tools", "Account dashboards", "Approval and audit systems"],
    modules: [
      { id: "accounts", name: "ACCOUNTS", role: "01 / INPUT", description: "Organize user identities, permissions, account views, and transaction requests." },
      { id: "validation", name: "VALIDATION", role: "02 / LOGIC", description: "Apply configured business rules, authorization requirements, and transaction checks." },
      { id: "processing", name: "PROCESSING", role: "03 / EXECUTION", description: "Coordinate transaction states and approved integrations with external providers." },
      { id: "ledger", name: "RECORDS", role: "04 / DATA", description: "Maintain structured transaction history, reconciliation data, and operational records." },
      { id: "reporting", name: "REPORTING", role: "05 / OUTPUT", description: "Provide account views, financial operations reports, exception queues, and administrative tools." },
    ],
  },
  {
    id: "customer-platform",
    number: "006",
    name: "CUSTOMER PLATFORMS",
    category: "PLATFORMS",
    headline: "BUILD THE ENTIRE CUSTOMER JOURNEY.",
    description: "Bring onboarding, appointments, communication, payments, service delivery, and support into one product.",
    applications: ["Customer portals", "Booking platforms", "Membership systems", "Service marketplaces"],
    modules: [
      { id: "discovery", name: "DISCOVERY", role: "01 / INPUT", description: "Present services, profiles, offerings, and personalized entry points." },
      { id: "onboarding", name: "ONBOARDING", role: "02 / LOGIC", description: "Manage accounts, eligibility, forms, permissions, and customer setup." },
      { id: "service", name: "SERVICE ENGINE", role: "03 / EXECUTION", description: "Coordinate bookings, payments, assignments, and service workflows." },
      { id: "relationships", name: "CUSTOMER DATA", role: "04 / DATA", description: "Maintain customer records, preferences, history, and service progress." },
      { id: "portal", name: "CUSTOMER PORTAL", role: "05 / OUTPUT", description: "Give customers a clear place to manage their activity and communicate with the business." },
    ],
  },
  {
    id: "industrial-monitoring",
    number: "007",
    name: "INDUSTRIAL MONITORING",
    category: "OPERATIONS",
    headline: "FROM FIELD DATA TO DECISIONS.",
    description: "Design operational software for equipment, sites, maintenance, inspections, and resource allocation.",
    applications: ["Equipment monitoring", "Maintenance scheduling", "Inspection workflows", "Site reporting"],
    modules: [
      { id: "field", name: "FIELD INPUT", role: "01 / INPUT", description: "Collect equipment readings, inspection reports, operator inputs, and site events." },
      { id: "conditions", name: "CONDITIONS", role: "02 / LOGIC", description: "Compare incoming information with configured thresholds and operational rules." },
      { id: "maintenance", name: "MAINTENANCE", role: "03 / EXECUTION", description: "Generate work requests, assign teams, and coordinate service schedules." },
      { id: "assets", name: "ASSET DATA", role: "04 / DATA", description: "Maintain equipment histories, documentation, maintenance records, and site-level data." },
      { id: "overview", name: "SITE OVERVIEW", role: "05 / OUTPUT", description: "Show operational status, unresolved issues, maintenance progress, and management views." },
    ],
  },
  {
    id: "analytics-control",
    number: "008",
    name: "ANALYTICS & CONTROL",
    category: "INTELLIGENCE",
    headline: "ONE VIEW OF A COMPLEX BUSINESS.",
    description: "Bring data from disconnected systems into a governed reporting and decision-support environment.",
    applications: ["Executive dashboards", "Data integration", "KPI monitoring", "Scenario analysis"],
    modules: [
      { id: "connectors", name: "CONNECTORS", role: "01 / INPUT", description: "Ingest information from databases, applications, files, and approved external services." },
      { id: "transformation", name: "DATA PIPELINE", role: "02 / LOGIC", description: "Validate, normalize, and combine data according to business-specific definitions." },
      { id: "metrics", name: "METRICS", role: "03 / EXECUTION", description: "Calculate defined KPIs, aggregations, and analytical outputs." },
      { id: "warehouse", name: "DATA LAYER", role: "04 / DATA", description: "Organize reporting datasets, historical information, and controlled access." },
      { id: "dashboards", name: "DASHBOARDS", role: "05 / OUTPUT", description: "Expose interactive reports, business views, alerts, and decision-support tools." },
    ],
  },
  {
    id: "business-systems",
    number: "009",
    name: "BUSINESS SYSTEMS",
    category: "BUSINESS SYSTEMS",
    headline: "MAKE THE BUSINESS RUN AS ONE SYSTEM.",
    description: "Build custom internal platforms that connect teams, customers, approvals, documents, reporting, and day-to-day decision making.",
    applications: ["Custom CRM and ERP", "Team workspaces", "Approval systems", "Business portals"],
    modules: [
      { id: "people", name: "PEOPLE & ROLES", role: "01 / INPUT", description: "Model teams, responsibilities, permissions, and the people who operate the business." },
      { id: "processes", name: "PROCESSES", role: "02 / LOGIC", description: "Turn repeatable business rules, approvals, and handoffs into visible workflows." },
      { id: "workspaces", name: "WORKSPACES", role: "03 / EXECUTION", description: "Give each department focused tools while keeping shared work connected." },
      { id: "records", name: "BUSINESS RECORDS", role: "04 / DATA", description: "Create one governed record of customers, projects, assets, documents, and decisions." },
      { id: "cockpit", name: "EXECUTIVE COCKPIT", role: "05 / OUTPUT", description: "Surface priorities, bottlenecks, performance, and the next best action." },
    ],
  },
  {
    id: "ai-automation",
    number: "010",
    name: "AI AUTOMATION SYSTEMS",
    category: "AI AUTOMATION",
    headline: "AUTOMATE THE WORK. KEEP PEOPLE IN CONTROL.",
    description: "Design practical AI automation that observes signals, reasons over trusted context, uses business tools, and hands off decisions safely.",
    applications: ["AI agents", "Document automation", "Email and support triage", "Human approval loops"],
    modules: [
      { id: "triggers", name: "TRIGGERS", role: "01 / INPUT", description: "Listen for messages, new documents, events, schedules, and changes in business systems." },
      { id: "context", name: "CONTEXT", role: "02 / LOGIC", description: "Retrieve the right policies, records, instructions, and history before taking action." },
      { id: "agent", name: "AGENT RUNTIME", role: "03 / EXECUTION", description: "Plan bounded steps, call approved tools, and complete repetitive work with traceability." },
      { id: "approval", name: "HUMAN GATE", role: "04 / CONTROL", description: "Route sensitive, ambiguous, or high-impact actions to the right person for review." },
      { id: "outcomes", name: "OUTCOMES", role: "05 / OUTPUT", description: "Write results back to systems, notify teams, and measure the value of each automation." },
    ],
  },
  {
    id: "custom-payments",
    number: "011",
    name: "CUSTOM PAYMENT SOFTWARE",
    category: "PAYMENTS",
    headline: "PAYMENTS BUILT AROUND YOUR BUSINESS.",
    description: "Create controlled payment experiences for checkout, billing, payouts, reconciliation, disputes, and finance operations.",
    applications: ["Custom checkout", "Billing and subscriptions", "Marketplace payouts", "Reconciliation and disputes"],
    modules: [
      { id: "payment-intent", name: "PAYMENT INTENT", role: "01 / INPUT", description: "Capture what the customer is paying for, who is paying, and which payment method is appropriate." },
      { id: "risk", name: "RISK & RULES", role: "02 / LOGIC", description: "Apply fraud signals, limits, eligibility, tax, pricing, and business-specific controls." },
      { id: "processing", name: "PROCESSING", role: "03 / EXECUTION", description: "Coordinate provider calls, authorization, capture, refunds, retries, and payment state changes." },
      { id: "ledger", name: "PAYMENT LEDGER", role: "04 / DATA", description: "Maintain immutable transaction history, balances, settlement records, and reconciliation evidence." },
      { id: "payouts", name: "PAYOUTS & REPORTING", role: "05 / OUTPUT", description: "Deliver merchant payouts, finance reports, customer receipts, and dispute workflows." },
    ],
  },
];