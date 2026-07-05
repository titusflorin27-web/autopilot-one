import { createPageMetadata } from "../../lib/seo";
import { BusinessDnaForm } from "./BusinessDnaForm";

export const metadata = createPageMetadata({
  title: "Profil companie Autopilot One",
  description: "Profilul companiei, servicii, reguli, ton, întrebări frecvente și obiective pentru AI.",
  path: "/onboarding",
  noIndex: true,
});


export default function OnboardingPage() {
  return (
    <main className="container page-stack">
      <BusinessDnaForm />
    </main>
  );
}
