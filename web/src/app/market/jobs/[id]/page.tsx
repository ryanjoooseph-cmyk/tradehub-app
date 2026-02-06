'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, MapPin, Clock, DollarSign, CheckCircle, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';

// Seeded job data
const jobData = {
  id: 'MJ-001',
  category: 'Painting & Facades',
  location: 'Southbank, Melbourne',
  timing: 'Within 2 weeks',
  budget: { min: 5000, max: 10000 },
  status: 'Open',
  description: 'Need professional exterior painting for a high-rise residential building. Includes facade repair, surface preparation, and painting with premium weather-resistant paint. Access via rope access required.',
  postedDate: '2026-02-01',
};

// Seeded quotes
const quotes = [
  {
    id: 'Q-001',
    provider: { id: 'PROV-001', name: 'Elite Painting Co', verified: true, rating: 4.8, reviews: 127, completedJobs: 89 },
    price: 8450,
    timeline: '10 days',
    milestones: 3,
    riskLevel: 'Low',
    notes: 'Includes all materials, rope access equipment, and safety compliance. Can start immediately.',
  },
  {
    id: 'Q-002',
    provider: { id: 'PROV-006', name: 'Modern Facades', verified: true, rating: 4.6, reviews: 78, completedJobs: 56 },
    price: 7200,
    timeline: '14 days',
    milestones: 4,
    riskLevel: 'Medium',
    notes: 'Competitive pricing with staged completion. Materials sourced from premium suppliers.',
  },
  {
    id: 'Q-003',
    provider: { id: 'PROV-004', name: 'Professional Repairs', verified: false, rating: 4.5, reviews: 45, completedJobs: 34 },
    price: 6800,
    timeline: '12 days',
    milestones: 2,
    riskLevel: 'High',
    notes: 'Budget-friendly option. Payment required upfront. Limited warranty coverage.',
  },
];

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Job Summary */}
        <div className="rounded-2xl border bg-card p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{jobData.category}</h1>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600 dark:bg-green-950">
                  {jobData.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {jobData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {jobData.timing}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${jobData.budget.min.toLocaleString()} - ${jobData.budget.max.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Job ID</div>
              <div className="font-mono font-semibold">{jobId}</div>
              <div className="mt-2 text-xs text-muted-foreground">Posted {jobData.postedDate}</div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-muted/50 p-4">
            <h3 className="font-semibold">Project Description</h3>
            <p className="mt-2 text-sm text-muted-foreground">{jobData.description}</p>
          </div>
        </div>

        {/* Quotes Received */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Quotes Received ({quotes.length})</h2>
          <p className="mt-2 text-muted-foreground">Compare quotes and choose the best provider for your project</p>

          <div className="mt-6 space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="rounded-2xl border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Provider Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold">
                      {quote.provider.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{quote.provider.name}</h3>
                        {quote.provider.verified && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{quote.provider.rating}</span>
                          <span className="text-muted-foreground">({quote.provider.reviews})</span>
                        </div>
                        <span className="text-muted-foreground">{quote.provider.completedJobs} jobs completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Quote Details */}
                  <div className="text-right">
                    <div className="text-3xl font-bold">${quote.price.toLocaleString()}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{quote.timeline} • {quote.milestones} milestones</div>
                    <div className="mt-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        quote.riskLevel === 'Low' ? 'bg-green-100 text-green-600 dark:bg-green-950' :
                        quote.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950' :
                        'bg-red-100 text-red-600 dark:bg-red-950'
                      }`}>
                        {quote.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-muted/50 p-3 text-sm">
                  <span className="font-semibold">Quote notes:</span> {quote.notes}
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/market/checkout?job=${jobId}&quote=${quote.id}`}
                    className="flex-1 rounded-xl bg-foreground py-3 text-center font-semibold text-background hover:opacity-90"
                  >
                    Accept Quote
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold hover:bg-muted">
                    <MessageCircle className="h-5 w-5" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Comparison Table */}
        <div className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Quote Comparison</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b">
                <tr>
                  <th className="pb-3 text-left font-semibold">Provider</th>
                  <th className="pb-3 text-left font-semibold">Verified</th>
                  <th className="pb-3 text-left font-semibold">Rating</th>
                  <th className="pb-3 text-right font-semibold">Price</th>
                  <th className="pb-3 text-left font-semibold">Timeline</th>
                  <th className="pb-3 text-left font-semibold">Milestones</th>
                  <th className="pb-3 text-left font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{quote.provider.name}</td>
                    <td className="py-4">
                      {quote.provider.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {quote.provider.rating}
                      </div>
                    </td>
                    <td className="py-4 text-right font-semibold">${quote.price.toLocaleString()}</td>
                    <td className="py-4">{quote.timeline}</td>
                    <td className="py-4">{quote.milestones}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        quote.riskLevel === 'Low' ? 'bg-green-100 text-green-600 dark:bg-green-950' :
                        quote.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950' :
                        'bg-red-100 text-red-600 dark:bg-red-950'
                      }`}>
                        {quote.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Mini Cards */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Provider Profiles</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {quotes.map((quote) => (
              <div key={quote.id} className="rounded-2xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl font-bold">
                    {quote.provider.name.charAt(0)}
                  </div>
                  {quote.provider.verified && (
                    <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-semibold">{quote.provider.name}</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{quote.provider.rating}</span>
                    <span className="text-muted-foreground">({quote.provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-muted-foreground">{quote.provider.completedJobs} jobs completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
