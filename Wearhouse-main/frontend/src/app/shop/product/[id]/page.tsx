'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
    seller: {
      name: 'Sarah Johnson',
      avatar: '/images/avatars/sarah.jpg',
      rating: 4.8,
      reviews: 12,
      member: 'Oct 2022'
    },
    listed: '2 days ago',
    description: 'Red Carleton University hoodie. Only worn a few times, in like-new condition. Size Medium, very comfortable and warm. Perfect for those cold Ottawa winters!',
    location: 'Carleton University Campus',
    meetupOptions: ['On Campus', 'Downtown Ottawa'],
    paymentOptions: ['Cash', 'E-transfer']
  },
  {
    id: '2',
    name: 'Ravens Baseball Cap',
    price: 20,
    size: 'One Size',
    condition: 'Good',
    category: 'Accessories',
    image: '/images/products/cap.jpg',
    seller: {
      name: 'Mike Thomas',
      avatar: '/images/avatars/mike.jpg',
      rating: 4.5,
      reviews: 8,
      member: 'Jan 2023'
    },
    listed: '5 days ago',
    description: 'Black Ravens baseball cap with the official logo. In good condition with minor wear. One size fits most.',
    location: 'Orleans',
    meetupOptions: ['On Campus', 'Orleans Area'],
    paymentOptions: ['Cash', 'E-transfer', 'PayPal']
  },
  {
    id: '3',
    name: 'Vintage Carleton Sweatpants',
    price: 25,
    size: 'L',
    condition: 'Good',
    category: 'Bottoms',
    image: '/images/products/sweatpants.jpg',
    seller: {
      name: 'Jamie Lee',
      avatar: '/images/avatars/jamie.jpg',
      rating: 4.9,
      reviews: 15,
      member: 'Sep 2021'
    },
    listed: '1 week ago',
    description: 'Vintage Carleton University sweatpants in gray. Size Large with drawstring waist. Small logo on left thigh. Very comfortable for lounging!',
    location: 'Glebe',
    meetupOptions: ['On Campus', 'Glebe', 'Downtown Ottawa'],
    paymentOptions: ['Cash', 'E-transfer']
  },
  {
    id: '4',
    name: 'Engineering Society T-Shirt',
    price: 15,
    size: 'S',
    condition: 'Like New',
    category: 'Tops',
    image: '/images/products/tshirt.jpg',
    seller: {
      name: 'Alex Kim',
      avatar: '/images/avatars/alex.jpg',
      rating: 4.7,
      reviews: 6,
      member: 'Apr 2023'
    },
    listed: '3 days ago',
    description: 'Engineering Society t-shirt from last year\'s event. Only worn once. Size Small, black with printed design on front and back.',
    location: 'Carleton University Campus',
    meetupOptions: ['On Campus'],
    paymentOptions: ['Cash', 'E-transfer']
  },
  {
    id: '5',
    name: 'Winter Jacket with Carleton Logo',
    price: 50,
    size: 'XL',
    condition: 'Good',
    category: 'Outerwear',
    image: '/images/products/jacket.jpg',
    seller: {
      name: 'Taylor Reed',
      avatar: '/images/avatars/taylor.jpg',
      rating: 4.6,
      reviews: 10,
      member: 'Dec 2022'
    },
    listed: '1 day ago',
    description: 'Black winter jacket with Carleton logo on the chest. Size XL, good condition with some minor wear around the cuffs. Very warm with inner fleece lining.',
    location: 'Kanata',
    meetupOptions: ['On Campus', 'Kanata'],
    paymentOptions: ['Cash', 'E-transfer']
  },
  {
    id: '6',
    name: 'Red and Black Scarf',
    price: 18,
    size: 'One Size',
    condition: 'New',
    category: 'Accessories',
    image: '/images/products/scarf.jpg',
    seller: {
      name: 'Jordan Park',
      avatar: '/images/avatars/jordan.jpg',
      rating: 5.0,
      reviews: 9,
      member: 'Nov 2022'
    },
    listed: '4 days ago',
    description: 'Brand new Carleton University scarf in red and black. Never worn, still has tags. Perfect for showing your school spirit!',
    location: 'Nepean',
    meetupOptions: ['On Campus', 'Nepean', 'Downtown Ottawa'],
    paymentOptions: ['Cash', 'E-transfer', 'PayPal']
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Find the product by ID
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-gray-400 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sending message to ${product.seller.name}: ${message}`);
    
    // In a real app, this would send the message to the backend
    setMessageSent(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setMessageSent(false);
      setContactFormOpen(false);
      setMessage('');
    }, 2000);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-end">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center text-sm">
                    <Link href="/shop" className="text-gray-500 hover:text-gray-700">
                      Shop
                    </Link>
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href={`/shop?category=${product.category}`} className="text-gray-500 hover:text-gray-700">
                      {product.category}
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="mt-4 aspect-w-4 aspect-h-3 rounded-lg bg-gray-200 overflow-hidden">
              {/* This would be a real image in production */}
              <div className="h-80 w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">[Product Image]</span>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">[Avatar]</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{product.seller.name}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-1 text-sm text-gray-500">{product.seller.rating} ({product.seller.reviews} reviews)</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Member since {product.seller.member}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="space-y-6 text-base text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Size:</p>
                      <p className="text-gray-900 font-medium">{product.size}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Condition:</p>
                      <p className="text-gray-900 font-medium">{product.condition}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Posted:</p>
                      <p className="text-gray-900 font-medium">{product.listed}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Meet-up Options</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <p className="text-gray-900">{product.location}</p>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Available for meetup at:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.meetupOptions.map((option, index) => (
                          <li key={index}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900">Payment Options</h3>
              <div className="mt-2 flex items-center space-x-2">
                {product.paymentOptions.map((option, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {option}
                  </span>
                ))}
              </div>
            </div>

            {contactFormOpen ? (
              <div className="mt-8 border-t border-gray-200 pt-6">
                {messageSent ? (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Message sent successfully!</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message to Seller</label>
                      <div className="mt-1">
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder={`Hi ${product.seller.name}, I'm interested in your ${product.name}. Is it still available?`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        onClick={() => setContactFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="mt-10 flex sm:flex-col1">
                <button
                  type="button"
                  className="w-full bg-emerald-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={() => setContactFormOpen(true)}
                >
                  Contact Seller
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}