import Image from "next/image";
import Link from 'next/link';

const categories = [
  {
    name: 'Tops',
    image: '/images/category-tops.jpg',
    href: '/shop/tops',
    description: 'T-shirts, blouses, sweatshirts, and more'
  },
  {
    name: 'Bottoms',
    image: '/images/category-bottoms.jpg',
    href: '/shop/bottoms',
    description: 'Jeans, shorts, skirts, and pants'
  },
  {
    name: 'Outerwear',
    image: '/images/category-outerwear.jpg',
    href: '/shop/outerwear',
    description: 'Jackets, coats, sweaters, and hoodies'
  },
  {
    name: 'Accessories',
    image: '/images/category-accessories.jpg',
    href: '/shop/accessories',
    description: 'Hats, scarves, bags, and jewelry'
  },
];

const features = [
  {
    name: 'University Exclusive',
    description: 'Trade only with verified students from your university.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    name: 'Sustainable Fashion',
    description: 'Reduce waste and save money by trading second-hand clothes.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
      </svg>
    ),
  },
  {
    name: 'Easy Transactions',
    description: 'Meet up on campus or use our secure payment system.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 pt-20 pb-24 sm:pt-32 sm:pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" fill="none">
            <path d="M0,0 L1440,0 L1440,800 L0,800 Z" fill="url(#grid-pattern)" />
          </svg>
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40 L40 40 L40 0" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl drop-shadow-sm">
                College Clothing,<br />Reimagined
              </h1>
              <p className="mt-6 text-lg text-white/90 max-w-xl">
                Buy, sell, and trade second-hand clothing exclusively with students at Carleton University.
                Save money, reduce waste, and refresh your wardrobe sustainably.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-emerald-600 shadow-md hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
                >
                  Shop Now
                </Link>
                <Link
                  href="/sell"
                  className="rounded-md bg-emerald-800 px-8 py-3 text-sm font-semibold text-white shadow-md border border-emerald-400/30 hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900 transition-all duration-200"
                >
                  Sell Items
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative h-96 w-96 overflow-hidden rounded-full bg-emerald-800 shadow-xl border-8 border-emerald-700/50">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-emerald-700/40 to-emerald-900/50"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-20 text-9xl font-bold drop-shadow-lg">
                  WH
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shop by Category</h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse through our selection of second-hand clothing categories.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.name} className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
                  <div className="h-64 w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative">
                    {/* Placeholder for category image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-emerald-600/10"></div>
                    <span className="text-lg font-medium text-gray-600 z-10">{category.name}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link href={category.href}>
                      <span className="absolute inset-0" />
                      {category.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mb-4">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sustainable Campus Fashion
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join the movement to reduce textile waste and promote sustainable fashion choices on campus.
              Every item you buy second-hand or sell helps create a more sustainable future.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Making an Impact</h2>
            <p className="mt-4 text-lg text-gray-600">
              Together we're creating a more sustainable campus community
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Active Users</dt>
              <dd className="text-4xl font-bold tracking-tight text-emerald-600 mt-1">1,200+</dd>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Items Listed</dt>
              <dd className="text-4xl font-bold tracking-tight text-emerald-600 mt-1">3,500+</dd>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Waste Diverted</dt>
              <dd className="text-4xl font-bold tracking-tight text-emerald-600 mt-1">2.3 tons</dd>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
              <dt className="text-sm font-medium text-gray-500">Money Saved</dt>
              <dd className="text-4xl font-bold tracking-tight text-emerald-600 mt-1">$45K+</dd>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to join WearHouse?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Sign up with your university email to start buying, selling, and trading clothes.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <Link
                href="/register"
                className="rounded-md bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-200"
              >
                Sign up now
              </Link>
              <Link href="/about" className="text-base font-semibold leading-6 text-gray-900 hover:text-emerald-600 transition-all duration-200">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
