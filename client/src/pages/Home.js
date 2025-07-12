import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowRight, Users, MessageSquare, Eye, TrendingUp, Search } from 'lucide-react';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';

const Home = () => {
  const { data: questionsData } = useQuery('recentQuestions', async () => {
    const response = await axios.get('/api/questions?limit=6&sort=createdAt&order=desc');
    return response.data;
  });

  const { data: topUsers } = useQuery('topUsers', async () => {
    const response = await axios.get('/api/users/top/contributors?limit=5');
    return response.data;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-black mb-6" style={{lineHeight:1.1}}>
          Go from questioning<br />to understanding
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          StackIt is the knowledge-sharing community where students and experts put their heads together to crack their toughest questions.
        </p>
        <form className="hero-search" style={{marginTop:'3.5rem', marginBottom:'2.5rem'}}>
          <input
            type="text"
            placeholder="What is your question?"
            className=""
            style={{fontWeight:600}}
          />
          <button type="submit" aria-label="Search">
            <Search />
          </button>
        </form>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {questionsData?.pagination?.total || 0}
          </div>
          <div className="text-gray-300">Questions</div>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {topUsers?.length || 0}
          </div>
          <div className="text-gray-300">Active Users</div>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {questionsData?.questions?.reduce((sum, q) => sum + (q.answerCount || 0), 0) || 0}
          </div>
          <div className="text-gray-300">Answers</div>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {questionsData?.questions?.reduce((sum, q) => sum + (q.views || 0), 0) || 0}
          </div>
          <div className="text-gray-300">Views</div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Recent Questions</h2>
          <Link
            to="/questions"
            className="btn btn-outline flex items-center gap-2 btn-sm shadow"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {questionsData?.questions?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionsData.questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No questions yet</h3>
            <p className="text-gray-400 mb-4">Be the first to ask a question!</p>
            <Link to="/ask" className="btn btn-primary shadow">
              Ask a Question
            </Link>
          </div>
        )}
      </div>

      {/* Top Contributors */}
      {topUsers?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Top Contributors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topUsers.map((user) => (
              <div key={user._id} className="card p-4 text-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-300" />
                  </div>
                )}
                <h3 className="font-medium text-white mb-1">{user.username}</h3>
                <div className="text-sm text-blue-200">
                  Reputation: {user.reputation}
                </div>
                <div className="text-xs text-blue-400 mt-1">
                  {user.questionsCount} questions • {user.answersCount} answers
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ask Questions</h3>
          <p className="text-gray-400">
            Get help from the community by asking well-structured questions with proper tags.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Build Reputation</h3>
          <p className="text-gray-400">
            Earn reputation points by providing helpful answers and receiving upvotes.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Join Community</h3>
          <p className="text-gray-400">
            Connect with like-minded developers and share knowledge collaboratively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 