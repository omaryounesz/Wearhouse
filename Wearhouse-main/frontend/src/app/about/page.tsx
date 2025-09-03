import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:text-center mb-12">
          <p className="text-base font-semibold tracking-wide uppercase text-emerald-600">About WearHouse</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Fashion that's sustainable, affordable, and local
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            WearHouse is a marketplace exclusively for university students to buy, sell, and trade second-hand clothing within their campus community.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                WearHouse was founded with a simple mission: to make it easy for university students to 
                buy and sell second-hand clothing. We believe in creating a sustainable fashion ecosystem 
                within university campuses that reduces waste, saves money, and builds community.
              </p>
              <p className="text-gray-600 mb-6">
                Our platform focuses exclusively on connecting students at the same university, 
                making it safe and convenient to exchange items on or near campus. No shipping required, 
                no complicated logistics - just students helping each other find new homes for pre-loved clothing.
              </p>
              <p className="text-gray-600 mb-6">
                By choosing to buy second-hand, you're not just saving money, you're also making a positive 
                environmental impact by extending the lifecycle of clothing and reducing the demand for 
                new production.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                [Mission Image]
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 lg:text-center">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-emerald-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Sign Up</h3>
                <p className="text-gray-600">
                  Create an account using your university email. This ensures that all users are part of the same university community.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-emerald-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Browse or List</h3>
                <p className="text-gray-600">
                  Browse items posted by other students or list your own clothing for sale. Add details, photos, and set your price.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-emerald-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Connect & Exchange</h3>
                <p className="text-gray-600">
                  Message sellers, arrange a convenient meet-up location on campus, and complete the transaction in person.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-emerald-50 rounded-lg px-6 py-8">
          <div className="lg:text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sustainability Impact</h2>
            <p className="mt-4 max-w-2xl text-gray-600 lg:mx-auto">
              Every purchase on WearHouse contributes to creating a more sustainable fashion ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reduced Carbon Footprint</h3>
              <p className="text-gray-600">
                The fashion industry accounts for 10% of global carbon emissions. By buying second-hand, you're helping reduce this impact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Budget-Friendly Fashion</h3>
              <p className="text-gray-600">
                University students can save an average of 50-80% by purchasing pre-loved clothing instead of new items.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Local Community Building</h3>
              <p className="text-gray-600">
                WearHouse connects students with shared interests in sustainable fashion and creates a stronger campus community.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 lg:text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Ready to Join?</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
              Sign Up Now
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Browse the Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 