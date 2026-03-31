import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { PublicLayout } from "@/components/layout/public-layout";

export default function PricingPage() {
  const { monthly, yearly } = PLANS;

  return (
    <PublicLayout>
    <div className="min-h-screen bg-stone-50 py-24 sm:py-32 pt-32 sm:pt-40 overflow-hidden text-emerald-950">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-100/50 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-700 tracking-wide uppercase">Membership</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-950 font-serif sm:text-5xl">
            Play. Win. Give.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-800/70">
            Join the community competing for cash prizes while actively 
            transforming lives. Select a plan, and automatically donate a 
            portion of your recurring play to your chosen charity.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
          
          {/* Monthly Plan */}
          <div className="rounded-3xl p-8 ring-1 ring-emerald-200 bg-white/60 backdrop-blur-xl shadow-sm xl:p-10 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-xl font-semibold leading-8 text-emerald-950">{monthly.name}</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-emerald-800/70">{monthly.description}</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-emerald-950">£{monthly.price}</span>
              <span className="text-sm font-semibold leading-6 text-emerald-800/60">/month</span>
            </p>
            <Link
              href={`/subscribe?plan=monthly`}
              className="mt-6 block rounded-2xl bg-emerald-50 px-3 py-3 text-center text-sm font-semibold leading-6 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-emerald-800 xl:mt-10">
              <li className="flex gap-x-3"><CheckIcon /> 5 Score window capacity</li>
              <li className="flex gap-x-3"><CheckIcon /> Access to all prize draws</li>
              <li className="flex gap-x-3"><CheckIcon /> Active charitable contribution</li>
            </ul>
          </div>

          {/* Yearly Plan */}
          <div className="rounded-3xl p-8 ring-2 ring-emerald-600 bg-emerald-950 shadow-2xl xl:p-10 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-xl font-semibold leading-8 text-white">{yearly.name}</h3>
              <p className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold leading-5 text-amber-300 ring-1 ring-inset ring-amber-500/30">
                Best Value
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-emerald-100/70">{yearly.description}</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-white">£{yearly.price}</span>
              <span className="text-sm font-semibold leading-6 text-emerald-100/50">/year</span>
            </p>
            <Link
              href={`/subscribe?plan=yearly`}
              className="mt-6 block rounded-2xl bg-emerald-500 px-3 py-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-400 transition-colors shadow-emerald-900"
            >
              Get Started
            </Link>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-emerald-100 xl:mt-10">
              <li className="flex gap-x-3 text-amber-200"><CheckIcon className="text-amber-500"/> Save ~17% annually</li>
              <li className="flex gap-x-3"><CheckIcon className="text-emerald-400"/> 5 Score window capacity</li>
              <li className="flex gap-x-3"><CheckIcon className="text-emerald-400"/> Access to all prize draws</li>
              <li className="flex gap-x-3"><CheckIcon className="text-emerald-400"/> Active charitable contribution</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
    </PublicLayout>
  );
}

function CheckIcon({ className = "text-emerald-600" }: { className?: string }) {
  return (
    <svg className={`h-6 w-5 flex-none ${className}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}
