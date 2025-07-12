const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's questions
router.get('/:id/questions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const questions = await Question.find({ author: req.params.id })
      .populate('author', 'username avatar reputation')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments({ author: req.params.id });

    res.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user questions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's answers
router.get('/:id/answers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const answers = await Answer.find({ author: req.params.id })
      .populate('author', 'username avatar reputation')
      .populate('question', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Answer.countDocuments({ author: req.params.id });

    res.json({
      answers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user answers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;

    const [user, questions, answers] = await Promise.all([
      User.findById(userId).select('-password'),
      Question.find({ author: userId }),
      Answer.find({ author: userId })
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate statistics
    const totalQuestions = questions.length;
    const totalAnswers = answers.length;
    const acceptedAnswers = answers.filter(answer => answer.isAccepted).length;
    
    const totalVotes = questions.reduce((sum, q) => sum + q.voteCount, 0) +
                      answers.reduce((sum, a) => sum + a.voteCount, 0);

    const totalViews = questions.reduce((sum, q) => sum + q.views, 0);

    res.json({
      user,
      stats: {
        totalQuestions,
        totalAnswers,
        acceptedAnswers,
        totalVotes,
        totalViews,
        reputation: user.reputation,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    })
    .select('-password')
    .sort({ reputation: -1, username: 1 })
    .limit(limit)
    .skip((page - 1) * limit);

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get top users
router.get('/top/contributors', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find()
      .select('-password')
      .sort({ reputation: -1, questionsCount: -1, answersCount: -1 })
      .limit(limit);

    res.json(users);
  } catch (error) {
    console.error('Get top users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 