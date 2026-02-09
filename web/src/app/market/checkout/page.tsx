'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, CreditCard, Shield, Lock } from 'lucide-react';

// Seeded milestones for different quotes
const milestonesByQuote: Record<string, Array<{ title: string; amount: number; description: string }>> = {
  'Q-001': [
    { title: 'Initial Deposit', amount: 2535, description: 'Materials procurement and site setup' },
    { title: 'Surface Preparation', amount: 2535, description: 'Facade repair and surface prep complete' },
    { title: 'Final Completion', amount: 3380, description: 'Painting complete, QA inspection passed' },
  ],
  'Q-002': [
    { title: 'Deposit', amount: 1800, description: 'Initial materials and equipment' },
    { title: 'Phase 1', amount: 2160, description: 'First section complete' },
    { title: 'Phase 2', amount: 2160, description: 'Second section complete' },
    { title: 'Final Payment', amount: 1080, description: 'All work complete and inspected' },
  ],
  'Q-003': [
    { title: 'Upfront Payment', amount: 3400, description: 'Full payment required before start' },
    { title: 'Completion', amount: 3400, description: 'Final payment on completion' },
  ],
};

const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
  { id: 'bank', name: 'Bank Transfer', icon: Shield },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('job') || 'MJ-001';
  const quoteId = searchParams?.get('quote') || 'Q-001';
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [funded, setFunded] = useState(false);

  const milestones = milestonesByQuote[quoteId] || milestonesByQuote['Q-001'];
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);

  const handleFundEscrow = () => {
    // Simulate payment processing
    setTimeout(() => {
      setFunded(true);
    }, 500);
  };

  if (funded) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border bg-card p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Escrow Funded Successfully!</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your payment of <span className="font-semibold">${totalAmount.toLocaleString()}</span> has been securely held in escrow
            </p>
            
            <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4 ring-1 ring-blue-500/20">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                ✓ Job {jobId} is now visible in your Dashboard Jobs
              </p>
            </div>

            <div className="mt-8 rounded-xl bg-muted/50 p-6 text-left">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>The provider has been notified and will start work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Funds are held securely until milestones are completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>You&apos;ll receive notifications as work progresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Release payments milestone by milestone after review</span>
                </li>
              </ul>
            </div>
            <Link
              href={`/app/jobs?source=market&job=${jobId}&quote=${quoteId}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-lg font-semibold text-background hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Fund Escrow</h1>
          <p className="mt-2 text-muted-foreground">
            Your payment is protected until work is completed
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Milestone Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-xl font-bold">Milestone Breakdown</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Payments are released as milestones are completed and approved
              </p>
              <div className="mt-6 space-y-4">
                {milestones.map((milestone, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 rounded-xl border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                          {i + 1}
                        </div>
                        <h3 className="font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${milestone.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-muted p-4">
                <span className="font-semibold">Total Escrow Amount</span>
                <span className="text-2xl font-bold">${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <div className="mt-4 space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 transition-all ${
                      selectedPayment === method.id
                        ? 'border-foreground bg-muted'
                        : 'hover:border-foreground/50'
                    }`}
                  >
                    <method.icon className="h-6 w-6" />
                    <span className="font-semibold">{method.name}</span>
                    {selectedPayment === method.id && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                    )}
                  </button>
                ))}
              </div>

              {selectedPayment === 'card' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment === 'bank' && (
                <div className="mt-6 rounded-xl bg-muted/50 p-4 text-sm">
                  <p className="font-semibold">Bank transfer details will be provided after confirmation.</p>
                  <p className="mt-2 text-muted-foreground">
                    Funds must be received within 48 hours to secure your booking.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleFundEscrow}
              className="w-full rounded-xl bg-foreground py-4 text-lg font-semibold text-background hover:opacity-90"
            >
              Fund Escrow - ${totalAmount.toLocaleString()}
            </button>
          </div>

          {/* Security & Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job</span>
                  <span className="font-mono">{jobId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quote</span>
                  <span className="font-mono">{quoteId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Milestones</span>
                  <span>{milestones.length}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <h3 className="font-semibold">Escrow Protection</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Funds held securely until work approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Release payments milestone by milestone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Dispute resolution support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Full refund if terms not met</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <Lock className="h-8 w-8 text-green-600" />
                <h3 className="font-semibold">Secure Payment</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
