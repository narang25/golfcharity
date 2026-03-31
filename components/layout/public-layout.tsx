import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * Wrapper for public-facing pages that includes the sticky header and footer.
 * Dashboard and Admin pages have their own layouts and should NOT use this.
 */
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
