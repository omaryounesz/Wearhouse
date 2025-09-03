'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock products data
const PRODUCTS = [
  {
    id: '1',
    name: 'Carleton University Hoodie',
    price: 35,
    size: 'M',
    condition: 'Like New',
    category: 'Tops',
    image: '/images/products/hoodie.jpg',
    seller: 'Sarah J.',
    listed: '2 days ago'
  },
  {
    id: '2',
    name: 'Ravens Baseball Cap',
    price: 20,
    size: 'One Size',
    condition: 'Good',
    category: 'Accessories',
    image: '/images/products/cap.jpg',
    seller: 'Mike T.',
    listed: '5 days ago'
  },
  {
    id: '3',
    name: 'Vintage Carleton Sweatpants',
    price: 25,
    size: 'L',
    condition: 'Good',
    category: 'Bottoms',
    image: '/images/products/sweatpants.jpg',
    seller: 'Jamie L.',
    listed: '1 week ago'
  },
  {
    id: '4',
    name: 'Engineering Society T-Shirt',
    price: 15,
    size: 'S',
    condition: 'Like New',
    category: 'Tops',
    image: '/images/products/tshirt.jpg',
    seller: 'Alex K.',
    listed: '3 days ago'
  },
  {
    id: '5',
    name: 'Winter Jacket with Carleton Logo',
    price: 50,
    size: 'XL',
    condition: 'Good',
    category: 'Outerwear',
    image: '/images/products/jacket.jpg',
    seller: 'Taylor R.',
    listed: '1 day ago'
  },
  {
    id: '6',
    name: 'Red and Black Scarf',
    price: 18,
    size: 'One Size',
    condition: 'New',
    category: 'Accessories',
    image: '/images/products/scarf.jpg',
    seller: 'Jordan P.',
    listed: '4 days ago'
  },
];

// Filter options
const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'One Size'];
const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair'];

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = PRODUCTS.filter(product => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || 
      product.category === selectedCategory;
    
    // Size filter
    const matchesSize = selectedSize === 'All' || 
      product.size === selectedSize;
    
    // Condition filter
    const matchesCondition = selectedCondition === 'All' || 
      product.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesSize && matchesCondition;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      // This is a mock sort based on "listed" field
      return a.listed.localeCompare(b.listed);
    } else if (sortOption === 'price-low') {
      return a.price - b.price;
    } else if (sortOption === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 flex z-40 lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={() => setMobileFiltersOpen(false)}></div>
            
            <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 border-t border-gray-200">
                {/* Category filter */}
                <div className="px-4 py-6">
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  <div className="mt-2 space-y-2">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          name="category"
                          type="radio"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size filter */}
                <div className="px-4 py-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <div className="mt-2 space-y-2">
                    {SIZES.map((size) => (
                      <div key={size} className="flex items-center">
                        <input
                          id={`size-${size}`}
                          name="size"
                          type="radio"
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor={`size-${size}`} className="ml-3 text-sm text-gray-600">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Condition filter */}
                <div className="px-4 py-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                  <div className="mt-2 space-y-2">
                    {CONDITIONS.map((condition) => (
                      <div key={condition} className="flex items-center">
                        <input
                          id={`condition-${condition}`}
                          name="condition"
                          type="radio"
                          checked={selectedCondition === condition}
                          onChange={() => setSelectedCondition(condition)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor={`condition-${condition}`} className="ml-3 text-sm text-gray-600">
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between pt-24 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Shop</h1>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <select
                  id="sort-option"
                  name="sort-option"
                  className="pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <button
                type="button"
                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">Products</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
              {/* Filters */}
              <form className="hidden lg:block">
                {/* Search filter */}
                <div className="mb-6">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search products..."
                    />
                  </div>
                </div>

                {/* Category filter */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  <div className="mt-2 space-y-2">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`desktop-category-${category}`}
                          name="category"
                          type="radio"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor={`desktop-category-${category}`} className="ml-3 text-sm text-gray-600">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size filter */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <div className="mt-2 space-y-2">
                    {SIZES.map((size) => (
                      <div key={size} className="flex items-center">
                        <input
                          id={`desktop-size-${size}`}
                          name="size"
                          type="radio"
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor={`desktop-size-${size}`} className="ml-3 text-sm text-gray-600">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Condition filter */}
                <div className="py-6">
                  <h3 className="text-sm font-medium text-gray-900">Condition</h3>
                  <div className="mt-2 space-y-2">
                    {CONDITIONS.map((condition) => (
                      <div key={condition} className="flex items-center">
                        <input
                          id={`desktop-condition-${condition}`}
                          name="condition"
                          type="radio"
                          checked={selectedCondition === condition}
                          onChange={() => setSelectedCondition(condition)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor={`desktop-condition-${condition}`} className="ml-3 text-sm text-gray-600">
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Mobile search */}
                <div className="mb-6 block lg:hidden">
                  <label htmlFor="mobile-search" className="block text-sm font-medium text-gray-700">Search</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="mobile-search"
                      id="mobile-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search products..."
                    />
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <Link href={`/shop/product/${product.id}`} key={product.id} className="group">
                        <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                          <div className="h-60 w-full bg-gray-200 flex items-center justify-center">
                            {/* This would be a real image in production */}
                            <span className="text-gray-400">[Product Image]</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <span className="text-white font-medium">${product.price}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-sm text-gray-700 font-medium">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.size} · {product.condition}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>{product.seller}</span>
                          <span>{product.listed}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
} 