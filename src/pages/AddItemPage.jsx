import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Upload, X, Plus } from 'lucide-react';

export const AddItemPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    size: '',
    category: '',
    gender: '',
    ageCategory: '',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Shirts', 'Pants', 'Dresses', 'Jackets', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const genders = ['men', 'women', 'kids'];
  const ageCategories = ['adult', 'teen', 'child'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.title || !formData.description || !formData.size || !formData.category || !formData.gender || !formData.ageCategory) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
      images.forEach(image => submitData.append('images', image));

      await axios.post('http://localhost:5000/api/items', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <p className="text-gray-600 text-lg">Please login to add items</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">Add New Item</h1>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Images (up to 5)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md border" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-purple-300 rounded-md h-32 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <span className="text-sm text-purple-500">Add Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-purple-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Vintage Denim Jacket"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-purple-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item in detail..."
              />
            </div>

            {/* Size and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-purple-700 mb-2">Size *</label>
                <select
                  id="size"
                  name="size"
                  required
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  value={formData.size}
                  onChange={handleInputChange}
                >
                  <option value="">Select size</option>
                  {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-purple-700 mb-2">Category *</label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
            </div>

            {/* Gender and Age Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-purple-700 mb-2">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  {genders.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="ageCategory" className="block text-sm font-medium text-purple-700 mb-2">Age Category *</label>
                <select
                  id="ageCategory"
                  name="ageCategory"
                  required
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  value={formData.ageCategory}
                  onChange={handleInputChange}
                >
                  <option value="">Select age category</option>
                  {ageCategories.map(category => <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>)}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-purple-700 mb-2">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., vintage, casual, summer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-md font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding Item...' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
