import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/numina/Stub";

export const Route = createFileRoute("/pantheon")({
  head: () => ({
    meta: [
      { title: "The Pantheon — NÚMINA" },
      { name: "description", content: "Marketplace of strategies. Clone the Numina that have proven themselves before the Choir." },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="The Pantheon"
      title="Strategies of the elder Numina."
      body="A marketplace where every public strategy is forged and shared. Filter by risk, asset, and ROI. Clone a proven Numen with a single rite, or contribute your own to be judged by the Choir."
      seed="pantheon-elders"
    />
  ),
});