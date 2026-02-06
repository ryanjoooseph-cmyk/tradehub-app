'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';

type FormData = {
  category: string;
  location: string;
  timing: string;
  budgetMin: string;
  budgetMax: string;
  photos: string;
  description: string;
};

const categories = ['Painting & Facades', 'Strata Management', 'Building & Construction', 'Maintenance & Repairs', 'Heritage Restoration', 'Landscaping'];
const timings = ['Within 1 week', 'Within 2 weeks', 'Within 1 month', 'Flexible'];

const STORAGE_KEY = 'market-post-job-draft';

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    location: '',
    timing: '',
    budgetMin: '',
    budgetMax: '',
    photos: '',
    description: '',
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(parsed);
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    };
    loadDraft();
  }, []);

  // Save draft to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, [formData]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.category !== '';
      case 2:
        return formData.location.trim() !== '' && formData.timing !== '';
      case 3:
        return formData.budgetMin !== '' && formData.budgetMax !== '' && Number(formData.budgetMin) < Number(formData.budgetMax);
      case 4:
        return true; // Photos optional
      case 5:
        return formData.description.trim().length >= 20;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Clear draft and navigate
    localStorage.removeItem(STORAGE_KEY);
    router.push('/market/jobs/MJ-001');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    s === step
                      ? 'border-foreground bg-foreground text-background'
                      : s < step
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 5 && (
                  <div
                    className={`h-0.5 w-12 md:w-24 ${s < step ? 'bg-green-600' : 'bg-muted-foreground/30'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Step {step} of 5: {['Category', 'Location & Timing', 'Budget', 'Photos', 'Description'][step - 1]}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border bg-card p-8">
          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold">What type of work do you need?</h2>
              <p className="mt-2 text-muted-foreground">Select the category that best fits your project</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateField('category', cat)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      formData.category === cat
                        ? 'border-foreground bg-muted'
                        : 'hover:border-foreground/50'
                    }`}
                  >
                    <div className="font-semibold">{cat}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location & Timing */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold">Where and when?</h2>
              <p className="mt-2 text-muted-foreground">Tell us about location and timing</p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g., Southbank, Melbourne"
                    className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">When do you need this done?</label>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {timings.map((t) => (
                      <button
                        key={t}
                        onClick={() => updateField('timing', t)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          formData.timing === t
                            ? 'border-foreground bg-muted'
                            : 'hover:border-foreground/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold">What&apos;s your budget?</h2>
              <p className="mt-2 text-muted-foreground">Set a budget range to get accurate quotes</p>
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold">Minimum ($)</label>
                    <input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => updateField('budgetMin', e.target.value)}
                      placeholder="5000"
                      className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Maximum ($)</label>
                    <input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => updateField('budgetMax', e.target.value)}
                      placeholder="10000"
                      className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                    />
                  </div>
                </div>
                {formData.budgetMin && formData.budgetMax && (
                  <div className="rounded-xl bg-muted p-4 text-sm">
                    Budget range: <span className="font-semibold">${Number(formData.budgetMin).toLocaleString()} - ${Number(formData.budgetMax).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold">Add photos (optional)</h2>
              <p className="mt-2 text-muted-foreground">Photos help providers understand your project better</p>
              <div className="mt-6">
                <div className="rounded-2xl border-2 border-dashed p-12 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4 text-sm font-semibold">Drop files here or click to upload</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Supports: JPG, PNG (max 10MB per file)
                  </div>
                  <button className="mt-4 rounded-xl border bg-background px-4 py-2 text-sm hover:bg-muted">
                    Browse Files
                  </button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Photos are optional but recommended. You can skip this step if you prefer.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Description */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold">Describe your project</h2>
              <p className="mt-2 text-muted-foreground">Provide details about what you need done</p>
              <div className="mt-6">
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your project in detail... What needs to be done? Any specific requirements? Access considerations?"
                  rows={8}
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-foreground"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {formData.description.length} characters (minimum 20)
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold disabled:opacity-50 hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!validateStep()}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 font-semibold text-background disabled:opacity-50 hover:opacity-90"
            >
              {step === 5 ? 'Submit Job' : 'Next'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Save Draft Notice */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Your progress is automatically saved. You can come back anytime to continue.
        </div>
      </div>
    </div>
  );
}
