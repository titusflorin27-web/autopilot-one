import { Footer } from "../../components/Footer";
import { LegalPageClient } from "../../components/legal/LegalPageClient";
import { Nav } from "../../components/Nav";

export default function ConsumerRightsPage() {
  return (
    <>
      <Nav />
      <LegalPageClient pageKey="consumerRights" />
      <Footer />
    </>
  );
}
