const express = require('express');
const { body, validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username avatar reputation')
      .sort({ voteCount: -1, createdAt: 1 });

    res.json(answers);
  } catch (error) {
    console.error('Get answers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new answer
router.post('/', auth, [
  body('content')
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters'),
  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = new Answer({
      content,
      author: req.user.userId,
      question: questionId
    });

    await answer.save();

    // Add answer to question
    question.answers.push(answer._id);
    await question.save();

    // Update user's answer count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { answersCount: 1 }
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation');

    res.status(201).json({
      message: 'Answer created successfully',
      answer: populatedAnswer
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update answer
router.put('/:id', auth, [
  body('content')
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is the author
    if (answer.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { content } = req.body;

    // Add to edit history
    answer.editHistory.push({
      content: answer.content,
      editedAt: new Date(),
      editedBy: req.user.userId
    });

    answer.content = content;
    answer.isEdited = true;

    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation');

    res.json({
      message: 'Answer updated successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete answer
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is the author
    if (answer.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Remove answer from question
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id }
    });

    await Answer.findByIdAndDelete(req.params.id);

    // Update user's answer count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { answersCount: -1 }
    });

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote on answer
router.post('/:id/vote', auth, [
  body('voteType').isIn(['upvote', 'downvote']).withMessage('Vote type must be upvote or downvote')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { voteType } = req.body;
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const userId = req.user.userId;
    const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
    const oppositeField = voteType === 'upvote' ? 'downvotes' : 'upvotes';

    // Remove from opposite vote if exists
    if (answer.votes[oppositeField].includes(userId)) {
      answer.votes[oppositeField] = answer.votes[oppositeField].filter(
        id => id.toString() !== userId
      );
    }

    // Toggle vote
    const voteIndex = answer.votes[voteField].indexOf(userId);
    if (voteIndex > -1) {
      answer.votes[voteField].splice(voteIndex, 1);
    } else {
      answer.votes[voteField].push(userId);
    }

    await answer.save();

    res.json({
      message: 'Vote updated successfully',
      voteCount: answer.voteCount
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept answer
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is the question author
    if (question.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the question author can accept answers' });
    }

    // Unaccept previously accepted answer if exists
    if (question.acceptedAnswer) {
      const prevAccepted = await Answer.findById(question.acceptedAnswer);
      if (prevAccepted) {
        prevAccepted.isAccepted = false;
        await prevAccepted.save();
      }
    }

    // Accept new answer
    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id;
    await question.save();

    res.json({
      message: 'Answer accepted successfully',
      answer
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to answer
router.post('/:id/comments', auth, [
  body('content')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const { content } = req.body;

    answer.comments.push({
      content,
      author: req.user.userId
    });

    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation')
      .populate('comments.author', 'username avatar');

    res.json({
      message: 'Comment added successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 