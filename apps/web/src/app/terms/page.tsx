import { Footer } from "../../components/Footer";
import { LegalPageClient } from "../../components/legal/LegalPageClient";
import { Nav } from "../../components/Nav";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <LegalPageClient pageKey="terms" />
      <Footer />
    </>
  );
}
