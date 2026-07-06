import { Footer } from "../../components/Footer";
import { LegalPageClient } from "../../components/legal/LegalPageClient";
import { Nav } from "../../components/Nav";

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <LegalPageClient pageKey="cookies" />
      <Footer />
    </>
  );
}
