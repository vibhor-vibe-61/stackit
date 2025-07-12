import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Eye, ThumbsUp, ThumbsDown, User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: question, isLoading, error } = useQuery(
    ['question', id],
    async () => {
      const response = await axios.get(`/api/questions/${id}`);
      return response.data;
    }
  );

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post('/api/answers', {
        content: answerContent,
        questionId: id
      });
      setAnswerContent('');
      // Refetch question data
      window.location.reload();
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h2>
          <p className="text-gray-600">The question you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-start gap-4">
              {/* Vote buttons */}
              <div className="flex flex-col items-center gap-1">
                <button className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400" disabled={user && user.isGuest}>
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {question.voteCount || 0}
                </span>
                <button className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400" disabled={user && user.isGuest}>
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>

              {/* Question content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {question.title}
                </h1>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
                </div>

                {/* Tags */}
                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="badge badge-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Question metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
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
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                    )}
                    <span className="text-gray-600">
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
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {question.answerCount || 0} Answer{question.answerCount !== 1 ? 's' : ''}
        </h2>

        {question.answers && question.answers.length > 0 ? (
          <div className="space-y-6">
            {question.answers.map((answer) => (
              <div key={answer._id} className={`card ${answer.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    {/* Vote buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400" disabled={user && user.isGuest}>
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {answer.voteCount || 0}
                      </span>
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400" disabled={user && user.isGuest}>
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      {answer.isAccepted && (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-2" />
                      )}
                    </div>

                    {/* Answer content */}
                    <div className="flex-1">
                      <div className="prose max-w-none mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                      </div>

                      {/* Answer metadata */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {answer.author?.avatar ? (
                            <img
                              src={answer.author.avatar}
                              alt={answer.author.username}
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                          )}
                          <span className="text-gray-600">
                            {answer.author?.username}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
            <p className="text-gray-600 mb-4">Be the first to answer this question!</p>
          </div>
        )}
      </div>

      {/* Answer form */}
      {user && user.isGuest && (
        <div className="card">
          <div className="card-body text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest users cannot post answers</h3>
            <p className="text-gray-600">Please sign in or register to answer questions.</p>
          </div>
        </div>
      )}
      {user && !user.isGuest && (
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-4">
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="form-input form-textarea"
                  placeholder="Write your answer here..."
                  rows={6}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !answerContent.trim()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Posting Answer...
                    </div>
                  ) : (
                    'Post Answer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail; 