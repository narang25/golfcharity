"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global crash logged:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-emerald-950 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif mb-3 text-emerald-950">
          Something went wrong
        </h2>
        <p className="text-emerald-800/60 leading-relaxed mb-8">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-all"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full py-3.5 px-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-emerald-950 font-semibold rounded-xl transition-all inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
