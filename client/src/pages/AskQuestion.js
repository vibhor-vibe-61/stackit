import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Send, Tag, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const AskQuestion = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const createQuestionMutation = useMutation(
    async (questionData) => {
      const response = await axios.post('/api/questions', questionData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Question created successfully!');
        navigate(`/questions/${data.question._id}`);
      },
      onError: (error) => {
        const message = error.response?.data?.error || 'Failed to create question';
        toast.error(message);
      }
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 300) {
      newErrors.title = 'Title must be less than 300 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    } else {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tags.length === 0) {
        newErrors.tags = 'At least one tag is required';
      } else if (tags.length > 5) {
        newErrors.tags = 'Maximum 5 tags allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await createQuestionMutation.mutateAsync({
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user && user.isGuest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Guest users cannot ask questions</h2>
          <p className="text-gray-600">Please sign in or register to ask a question.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
          <p className="text-gray-600">
            Share your knowledge and get help from the community
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="form-label">
                  Question Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="What's your question? Be specific."
                  maxLength={300}
                />
                {errors.title && (
                  <p className="form-error">{errors.title}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/300 characters
                </p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="form-label">
                  Question Details *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className={`form-input form-textarea ${errors.content ? 'border-red-500' : ''}`}
                  placeholder="Provide all the information someone would need to answer your question..."
                  rows={10}
                />
                {errors.content && (
                  <p className="form-error">{errors.content}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="form-label">
                  Tags *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className={`form-input pl-10 ${errors.tags ? 'border-red-500' : ''}`}
                    placeholder="javascript, react, nodejs (comma separated)"
                  />
                </div>
                {errors.tags && (
                  <p className="form-error">{errors.tags}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Add up to 5 tags to help categorize your question
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      Writing a good question
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Be specific and provide context</li>
                      <li>• Include code examples if relevant</li>
                      <li>• Explain what you've tried already</li>
                      <li>• Use clear, descriptive language</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Creating Question...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Ask Question
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion; 