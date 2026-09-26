import { PolicyPlanningView } from "@/components/simulator/policy-planning-view";

export const metadata = {
  title: "Policy Planning | National Land Governance Platform",
  description:
    "Define a proposed zone and assess its initial land impact. Interactive manual spatial planning for policymakers and researchers.",
};

export default function SimulatorPage() {
  return <PolicyPlanningView />;
}

