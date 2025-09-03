'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
type FormData = {
  title: string;
  category: string;
  size: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  meetupOptions: string[];
  paymentOptions: string[];
  images: File[];
};

// Constants
const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const MEETUP_OPTIONS = ['On Campus', 'Downtown Ottawa', 'Glebe', 'Westboro', 'Kanata', 'Orleans', 'Nepean'];
const PAYMENT_OPTIONS = ['Cash', 'E-transfer', 'PayPal'];

export default function SellPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    size: '',
    condition: '',
    price: '',
    description: '',
    location: '',
    meetupOptions: ['On Campus'],
    paymentOptions: ['Cash'],
    images: []
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes for arrays (meetupOptions, paymentOptions)
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, optionType: 'meetupOptions' | 'paymentOptions') => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add the option if checked
      setFormData(prev => ({
        ...prev,
        [optionType]: [...prev[optionType], value]
      }));
    } else {
      // Remove the option if unchecked
      setFormData(prev => ({
        ...prev,
        [optionType]: prev[optionType].filter(option => option !== value)
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 5 images
      const totalImages = [...formData.images, ...newFiles].slice(0, 5);
      setFormData(prev => ({ ...prev, images: totalImages }));
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls].slice(0, 5));
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    // Remove from formData.images
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Remove from preview URLs and revoke the URL to free memory
    const urlToRemove = imagePreviewUrls[index];
    URL.revokeObjectURL(urlToRemove);
    
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };

  // Validate the current step
  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.size) newErrors.size = 'Size is required';
      if (!formData.condition) newErrors.condition = 'Condition is required';
      
      const price = parseFloat(formData.price);
      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (isNaN(price) || price <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    } else if (step === 2) {
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (formData.meetupOptions.length === 0) newErrors.meetupOptions = 'Select at least one meetup option';
      if (formData.paymentOptions.length === 0) newErrors.paymentOptions = 'Select at least one payment option';
    } else if (step === 3) {
      if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Go to next step
  const goToNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to previous step
  const goToPreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call to submit the listing
      console.log('Submitting listing:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to success page or listings page
      router.push('/sell/success');
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Sell Your Item</h1>
          <p className="mt-2 text-sm text-gray-600">
            List your second-hand university clothing for other students to buy.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              <li className={`relative pr-8 sm:pr-20 ${step === 1 ? 'text-emerald-600' : 'text-gray-500'}`}>
                <div className="flex items-center">
                  <span className={`h-9 flex items-center ${step === 1 ? 'text-emerald-600' : (step > 1 ? 'text-emerald-600' : 'text-gray-500')}`}>
                    {step > 1 ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="h-9 w-9 flex justify-center items-center rounded-full border-2 border-emerald-600 text-emerald-600 font-bold">1</span>
                    )}
                  </span>
                  <span className="ml-2 text-sm font-medium">Item Details</span>
                </div>
                <div className="absolute top-4 right-0 w-full h-0.5 bg-gray-200" />
              </li>

              <li className={`relative px-8 sm:px-20 ${step === 2 ? 'text-emerald-600' : 'text-gray-500'}`}>
                <div className="flex items-center">
                  <span className={`h-9 flex items-center ${step === 2 ? 'text-emerald-600' : (step > 2 ? 'text-emerald-600' : 'text-gray-500')}`}>
                    {step > 2 ? (
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className={`h-9 w-9 flex justify-center items-center rounded-full ${step >= 2 ? 'border-2 border-emerald-600 text-emerald-600' : 'border-2 border-gray-300'} font-bold`}>2</span>
                    )}
                  </span>
                  <span className="ml-2 text-sm font-medium">Meet-up & Payment</span>
                </div>
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
              </li>

              <li className={`relative pl-8 sm:pl-20 ${step === 3 ? 'text-emerald-600' : 'text-gray-500'}`}>
                <div className="flex items-center">
                  <span className={`h-9 flex items-center ${step === 3 ? 'text-emerald-600' : 'text-gray-500'}`}>
                    <span className={`h-9 w-9 flex justify-center items-center rounded-full ${step >= 3 ? 'border-2 border-emerald-600 text-emerald-600' : 'border-2 border-gray-300'} font-bold`}>3</span>
                  </span>
                  <span className="ml-2 text-sm font-medium">Photos</span>
                </div>
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" />
              </li>
            </ol>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Item Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.title ? 'border-red-300' : ''}`}
                    placeholder="e.g., Carleton University Hoodie"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.category ? 'border-red-300' : ''}`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
                  <div className="mt-1">
                    <select
                      id="size"
                      name="size"
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.size ? 'border-red-300' : ''}`}
                      value={formData.size}
                      onChange={handleChange}
                    >
                      <option value="">Select a size</option>
                      {SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  {errors.size && <p className="mt-2 text-sm text-red-600">{errors.size}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                  <div className="mt-1">
                    <select
                      id="condition"
                      name="condition"
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.condition ? 'border-red-300' : ''}`}
                      value={formData.condition}
                      onChange={handleChange}
                    >
                      <option value="">Select condition</option>
                      {CONDITIONS.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                  {errors.condition && <p className="mt-2 text-sm text-red-600">{errors.condition}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className={`focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${errors.price ? 'border-red-300' : ''}`}
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-300' : ''}`}
                    placeholder="Describe your item, including details about its condition, features, and any imperfections."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {formData.description.length} / 500 characters (min 20)
                </p>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={goToNextStep}
                >
                  Next: Meet-up & Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Meet-up & Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Your Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.location ? 'border-red-300' : ''}`}
                    placeholder="e.g., Carleton University Campus, Downtown Ottawa"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700">Meet-up Options</legend>
                  <div className="mt-2 space-y-2">
                    {MEETUP_OPTIONS.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`meetup-${option}`}
                          name={`meetup-${option}`}
                          type="checkbox"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          value={option}
                          checked={formData.meetupOptions.includes(option)}
                          onChange={(e) => handleCheckboxChange(e, 'meetupOptions')}
                        />
                        <label htmlFor={`meetup-${option}`} className="ml-3 text-sm text-gray-700">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.meetupOptions && <p className="mt-2 text-sm text-red-600">{errors.meetupOptions}</p>}
                </fieldset>
              </div>

              <div>
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700">Payment Methods</legend>
                  <div className="mt-2 space-y-2">
                    {PAYMENT_OPTIONS.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`payment-${option}`}
                          name={`payment-${option}`}
                          type="checkbox"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          value={option}
                          checked={formData.paymentOptions.includes(option)}
                          onChange={(e) => handleCheckboxChange(e, 'paymentOptions')}
                        />
                        <label htmlFor={`payment-${option}`} className="ml-3 text-sm text-gray-700">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.paymentOptions && <p className="mt-2 text-sm text-red-600">{errors.paymentOptions}</p>}
                </fieldset>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={goToPreviousStep}
                >
                  Back: Item Details
                </button>
                <button
                  type="button"
                  className="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={goToNextStep}
                >
                  Next: Photos
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Photos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                      >
                        <span>Upload photos</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB (max 5 photos)
                    </p>
                  </div>
                </div>
                {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
              </div>

              {/* Image previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                        <img src={url} alt={`Preview ${index + 1}`} className="object-cover h-full w-full" />
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={goToPreviousStep}
                >
                  Back: Meet-up & Payment
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 inline-flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 