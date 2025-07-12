# StackIt - Q&A Forum Platform

StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It's designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

## Features

### Core Functionality
- **User Authentication** - Register, login, and profile management
- **Question Management** - Ask, edit, and delete questions with tags
- **Answer System** - Provide answers with voting and acceptance
- **Voting System** - Upvote/downvote questions and answers
- **Search & Filter** - Find questions by tags, content, or author
- **User Profiles** - View user statistics and contributions
- **Responsive Design** - Works on desktop and mobile devices

### Advanced Features
- **Reputation System** - Earn reputation through helpful contributions
- **Answer Acceptance** - Mark the best answer for your question
- **Comment System** - Add comments to answers
- **Edit History** - Track changes to questions and answers
- **Real-time Updates** - Live voting and content updates
- **Markdown Support** - Rich text formatting for questions and answers

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stackit
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

3. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Full Stack Development

To run both backend and frontend simultaneously:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Questions
- `GET /api/questions` - Get all questions (with pagination/filtering)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/vote` - Vote on question

### Answers
- `GET /api/answers/question/:questionId` - Get answers for question
- `POST /api/answers` - Create new answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer
- `POST /api/answers/:id/comments` - Add comment to answer

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/questions` - Get user's questions
- `GET /api/users/:id/answers` - Get user's answers
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/search/:query` - Search users
- `GET /api/users/top/contributors` - Get top contributors

## Database Schema

### User
- username, email, password
- avatar, bio, reputation
- badges, questionsCount, answersCount
- isVerified, lastActive

### Question
- title, content, author
- tags, votes (upvotes/downvotes)
- views, answers, acceptedAnswer
- isClosed, bounty, status

### Answer
- content, author, question
- votes (upvotes/downvotes)
- isAccepted, isEdited, editHistory
- comments

## Project Structure

```
stackit-qa-platform/
├── server/
│   ├── index.js              # Main server file
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Question.js
│   │   └── Answer.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   └── users.js
│   └── middleware/           # Custom middleware
│       └── auth.js
├── client/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Browse Questions** - View all questions or search by tags
3. **Ask Questions** - Create new questions with proper tags
4. **Answer Questions** - Provide helpful answers
5. **Vote** - Upvote good content, downvote poor content
6. **Build Reputation** - Earn points through contributions

### For Developers
1. **Fork the repository**
2. **Set up environment** - Configure MongoDB and environment variables
3. **Install dependencies** - Run `npm install` in both root and client directories
4. **Start development** - Use `npm run dev` for full-stack development
5. **Make changes** - Follow the existing code structure and patterns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Provide steps to reproduce the problem

## Roadmap

- [ ] Email notifications
- [ ] Real-time chat
- [ ] Advanced search filters
- [ ] Question bounties
- [ ] User badges and achievements
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Image upload support
- [ ] Question moderation tools
- [ ] Analytics dashboard 