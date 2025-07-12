const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const tag = req.query.tag;
    const search = req.query.search;

    const query = {};

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .populate('answers')
      .sort({ [sort]: order })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

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
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation bio')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar reputation'
        }
      })
      .populate('acceptedAnswer');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new question
router.post('/', auth, [
  body('title')
    .isLength({ min: 10, max: 300 })
    .withMessage('Title must be between 10 and 300 characters'),
  body('content')
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters'),
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Must provide 1-5 tags')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    const question = new Question({
      title,
      content,
      author: req.user.userId,
      tags: tags.map(tag => tag.toLowerCase().trim())
    });

    await question.save();

    // Update user's question count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { questionsCount: 1 }
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username avatar reputation');

    res.status(201).json({
      message: 'Question created successfully',
      question: populatedQuestion
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update question
router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ min: 10, max: 300 })
    .withMessage('Title must be between 10 and 300 characters'),
  body('content')
    .optional()
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters'),
  body('tags')
    .optional()
    .isArray({ min: 1, max: 5 })
    .withMessage('Must provide 1-5 tags')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is the author
    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, content, tags } = req.body;
    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (tags !== undefined) updateFields.tags = tags.map(tag => tag.toLowerCase().trim());

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar reputation');

    res.json({
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is the author
    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Question.findByIdAndDelete(req.params.id);

    // Update user's question count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { questionsCount: -1 }
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote on question
router.post('/:id/vote', auth, [
  body('voteType').isIn(['upvote', 'downvote']).withMessage('Vote type must be upvote or downvote')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { voteType } = req.body;
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const userId = req.user.userId;
    const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
    const oppositeField = voteType === 'upvote' ? 'downvotes' : 'upvotes';

    // Remove from opposite vote if exists
    if (question.votes[oppositeField].includes(userId)) {
      question.votes[oppositeField] = question.votes[oppositeField].filter(
        id => id.toString() !== userId
      );
    }

    // Toggle vote
    const voteIndex = question.votes[voteField].indexOf(userId);
    if (voteIndex > -1) {
      question.votes[voteField].splice(voteIndex, 1);
    } else {
      question.votes[voteField].push(userId);
    }

    await question.save();

    res.json({
      message: 'Vote updated successfully',
      voteCount: question.voteCount
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 