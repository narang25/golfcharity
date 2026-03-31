import Link from "next/link";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-emerald-950 font-sans">
        <div className="max-w-xl text-center">
          <div className="w-24 h-24 bg-emerald-100/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Search className="w-10 h-10" />
          </div>
          
          <h1 className="text-5xl font-bold font-serif mb-4 text-emerald-950">
            Page Not Found
          </h1>
          
          <p className="text-xl text-emerald-800/60 leading-relaxed mb-12">
            The fairway you&apos;re looking for doesn&apos;t seem to exist. It might have been moved, or the link could be broken.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="py-4 px-8 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="py-4 px-8 bg-white hover:bg-stone-50 border border-stone-200 text-emerald-950 font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
