import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Eye, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const QuestionCard = ({ question }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const voteMutation = useMutation(
    async ({ questionId, voteType }) => {
      const response = await axios.post(`/api/questions/${questionId}/vote`, { voteType });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('questions');
        queryClient.invalidateQueries('recentQuestions');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Vote failed');
      }
    }
  );

  const handleVote = (voteType) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    voteMutation.mutate({ questionId: question._id, voteType });
  };

  const isUpvoted = user && question.votes?.upvotes?.includes(user._id);
  const isDownvoted = user && question.votes?.downvotes?.includes(user._id);

  return (
    <div className="card hover:shadow-lg transition-shadow border border-blue-900">
      <div className="card-body">
        <div className="flex items-start gap-4">
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleVote('upvote')}
              className={`p-1 rounded hover:bg-blue-900 transition-colors ${
                isUpvoted ? 'text-blue-400' : 'text-gray-500'
              }`}
              disabled={voteMutation.isLoading || (user && user.isGuest)}
              title="Upvote"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-blue-200">
              {question.voteCount || 0}
            </span>
            <button
              onClick={() => handleVote('downvote')}
              className={`p-1 rounded hover:bg-blue-900 transition-colors ${
                isDownvoted ? 'text-red-400' : 'text-gray-500'
              }`}
              disabled={voteMutation.isLoading || (user && user.isGuest)}
              title="Downvote"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>

          {/* Question content */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/questions/${question._id}`}
              className="block hover:text-blue-400 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {question.title}
              </h3>
            </Link>
            
            <p className="text-blue-200 text-sm mb-3 line-clamp-3">
              {question.content}
            </p>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-blue-400 mt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{question.answerCount || 0} answers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{question.views || 0} views</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {question.author?.avatar ? (
                  <img
                    src={question.author.avatar}
                    alt={question.author.username}
                    className="w-6 h-6 rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-300" />
                  </div>
                )}
                <span className="text-blue-200">
                  {question.author?.username}
                </span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard; 