import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import SliderBanner from './components/SliderBanner';
import Footer from './components/Footer';
import Home from './pages/Home';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user } = useAuth();
  const rainDrops = Array.from({length: 60});

  return (
    <div className="App" style={{position:'relative', overflow:'hidden'}}>
      <div className="lighting-background" />
      <div className="rain-background">
        {rainDrops.map((_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>
      <SliderBanner />
      <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', margin:'1.2rem 0 0.5rem 0'}}>
        <span className="logo" style={{fontSize:'2rem', padding:'0.15em 0.7em'}}>STACKIT</span>
      </div>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/ask" element={
            <PrivateRoute>
              <AskQuestion />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 