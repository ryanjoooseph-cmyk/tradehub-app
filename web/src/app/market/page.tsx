import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Star, Users } from "lucide-react";

// Seeded providers
const providers = [
  { id: 'PROV-001', name: 'Elite Painting Co', category: 'painting', verified: true, rating: 4.8, reviewCount: 127, completedJobs: 89, location: 'Melbourne CBD' },
  { id: 'PROV-002', name: 'Premier Strata Services', category: 'strata', verified: true, rating: 4.9, reviewCount: 203, completedJobs: 156, location: 'Southbank' },
  { id: 'PROV-003', name: 'Quality Builders Ltd', category: 'building', verified: true, rating: 4.7, reviewCount: 98, completedJobs: 67, location: 'Richmond' },
  { id: 'PROV-004', name: 'Professional Repairs', category: 'maintenance', verified: false, rating: 4.5, reviewCount: 45, completedJobs: 34, location: 'Carlton' },
  { id: 'PROV-005', name: 'Heritage Restoration', category: 'restoration', verified: true, rating: 4.9, reviewCount: 156, completedJobs: 112, location: 'South Yarra' },
  { id: 'PROV-006', name: 'Modern Facades', category: 'painting', verified: true, rating: 4.6, reviewCount: 78, completedJobs: 56, location: 'Docklands' },
  { id: 'PROV-007', name: 'Trust Building Group', category: 'building', verified: true, rating: 4.8, reviewCount: 134, completedJobs: 98, location: 'St Kilda' },
  { id: 'PROV-008', name: 'Quick Fix Maintenance', category: 'maintenance', verified: false, rating: 4.3, reviewCount: 29, completedJobs: 23, location: 'Footscray' },
  { id: 'PROV-009', name: 'Premium Strata Care', category: 'strata', verified: true, rating: 4.7, reviewCount: 89, completedJobs: 71, location: 'Hawthorn' },
  { id: 'PROV-010', name: 'Expert Renovations', category: 'restoration', verified: true, rating: 4.8, reviewCount: 112, completedJobs: 87, location: 'Brunswick' },
];

const categories = [
  { name: 'Painting & Facades', icon: '🎨', count: 45 },
  { name: 'Strata Management', icon: '🏢', count: 32 },
  { name: 'Building & Construction', icon: '🏗️', count: 28 },
  { name: 'Maintenance & Repairs', icon: '🔧', count: 56 },
  { name: 'Heritage Restoration', icon: '🏛️', count: 18 },
  { name: 'Landscaping', icon: '🌳', count: 24 },
];

export default function MarketLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Dashboard Callout Banner */}
      <div className="border-b bg-gradient-to-r from-violet-600/10 to-indigo-600/10 dark:from-violet-950/50 dark:to-indigo-950/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Want the full dashboard experience with KPIs, activity tracking, and escrow management?
          </p>
          <Link
            href="/app/market"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-700 hover:to-indigo-700"
          >
            Open Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Find Trusted Tradespeople
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Post your job, get quotes from verified providers, and pay with escrow protection.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/market/post-job"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-lg font-semibold text-background hover:opacity-90"
              >
                Post a Job
              </Link>
              <Link
                href="/market/jobs/MJ-001"
                className="inline-flex items-center gap-2 rounded-xl border bg-background px-8 py-4 text-lg font-semibold hover:bg-muted"
              >
                Browse Jobs
              </Link>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-lg font-semibold">Escrow Protected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your payment is held securely until work is completed
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-lg font-semibold">Verified Providers</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All providers verified with licenses and insurance
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center">
              <Star className="h-12 w-12 text-yellow-600" />
              <h3 className="mt-4 text-lg font-semibold">Rated & Reviewed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Real reviews from real customers, fully transparent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to get your job done
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-950">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">Post Your Job</h3>
              <p className="mt-3 text-muted-foreground">
                Describe your project, set your budget, and upload photos. Takes 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600 dark:bg-green-950">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">Get Quotes</h3>
              <p className="mt-3 text-muted-foreground">
                Receive quotes from verified providers. Compare prices, timelines, and reviews.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600 dark:bg-purple-950">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">Pay with Escrow</h3>
              <p className="mt-3 text-muted-foreground">
                Accept a quote, fund milestones, and release payments as work progresses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find the right tradesperson for your project
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href="/market/post-job"
                className="flex items-center gap-4 rounded-2xl border bg-card p-6 transition-transform hover:scale-105"
              >
                <div className="text-4xl">{cat.icon}</div>
                <div>
                  <div className="font-semibold">{cat.name}</div>
                  <div className="text-sm text-muted-foreground">{cat.count} providers</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Showcase */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Featured Providers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Trusted professionals ready to help with your project
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <div key={provider.id} className="rounded-2xl border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.location}</p>
                  </div>
                  {provider.verified && (
                    <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {provider.completedJobs} jobs
                  </div>
                </div>
                <div className="mt-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize">
                    {provider.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Post your job now and get quotes from verified providers
          </p>
          <Link
            href="/market/post-job"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-lg font-semibold text-background hover:opacity-90"
          >
            Post a Job Now
          </Link>
        </div>
      </section>
    </div>
  );
}
