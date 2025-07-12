import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';

const Questions = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');

  const page = parseInt(searchParams.get('page')) || 1;

  const { data: questionsData, isLoading, error } = useQuery(
    ['questions', searchQuery, selectedTag, sortBy, order, page],
    async () => {
      const params = new URLSearchParams({
        page,
        limit: 10,
        sort: sortBy,
        order,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedTag && { tag: selectedTag })
      });
      
      const response = await axios.get(`/api/questions?${params}`);
      return response.data;
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (selectedTag) newParams.set('tag', selectedTag);
    if (sortBy !== 'createdAt') newParams.set('sort', sortBy);
    if (order !== 'desc') newParams.set('order', order);
    setSearchParams(newParams);
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (tag !== selectedTag) newParams.set('tag', tag);
    if (sortBy !== 'createdAt') newParams.set('sort', sortBy);
    if (order !== 'desc') newParams.set('order', order);
    setSearchParams(newParams);
  };

  const handleSort = (newSortBy) => {
    const newOrder = sortBy === newSortBy && order === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setOrder(newOrder);
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (selectedTag) newParams.set('tag', selectedTag);
    newParams.set('sort', newSortBy);
    newParams.set('order', newOrder);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (selectedTag) newParams.set('tag', selectedTag);
    if (sortBy !== 'createdAt') newParams.set('sort', sortBy);
    if (order !== 'desc') newParams.set('order', order);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Questions</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions</h1>
          <p className="text-gray-600">
            {questionsData?.pagination?.total || 0} questions found
          </p>
        </div>
        {user && (
          <a
            href="/ask"
            className="btn btn-primary mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4" />
            Ask Question
          </a>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            <button
              onClick={() => handleSort('createdAt')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'createdAt' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => handleSort('voteCount')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'voteCount' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Most Voted
            </button>
            <button
              onClick={() => handleSort('views')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'views' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Most Viewed
            </button>
            <button
              onClick={() => handleSort('answerCount')}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === 'answerCount' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Most Answered
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {questionsData?.questions?.length > 0 ? (
        <div className="space-y-4">
          {questionsData.questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedTag ? 'Try adjusting your search criteria.' : 'Be the first to ask a question!'}
          </p>
          {user && (
            <a href="/ask" className="btn btn-primary">
              Ask a Question
            </a>
          )}
        </div>
      )}

      {/* Pagination */}
      {questionsData?.pagination && questionsData.pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {page > 1 && (
              <button
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            {Array.from({ length: Math.min(5, questionsData.pagination.pages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border rounded-lg ${
                    pageNum === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {page < questionsData.pagination.pages && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions; 