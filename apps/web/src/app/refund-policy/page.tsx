import { Footer } from "../../components/Footer";
import { LegalPageClient } from "../../components/legal/LegalPageClient";
import { Nav } from "../../components/Nav";

export default function RefundPolicyPage() {
  return (
    <>
      <Nav />
      <LegalPageClient pageKey="refundPolicy" />
      <Footer />
    </>
  );
}
