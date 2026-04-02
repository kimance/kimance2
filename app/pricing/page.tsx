import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Kimance',
  description: 'Transparent pricing for Kimance financial services. No hidden fees, competitive rates.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Pricing</h1>
          <p className="mt-4 text-xl text-gray-600">
            Transparent pricing with no hidden fees
          </p>
        </div>

        <div className="mt-16">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Pricing information coming soon. Contact us for current rates and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}