import { SandboxClient } from "@/components/simulator/sandbox-client";

export const metadata = {
  title: "Policy Reform Sandbox | National Land Governance Platform",
  description:
    "Interactive district-level regression model predicting land conflict risk. Explore how digitization, urbanization, and court efficiency affect disputes.",
};

export default function SimulatorPage() {
  return <SandboxClient />;
}
