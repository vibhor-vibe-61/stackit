import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex justify-end items-start px-8 py-8" style={{minHeight:'60vh'}}>
      <div className="rounded-full shadow-lg card flex flex-col items-center justify-center p-8" style={{background:'#fff', border:'none', width:'370px', height:'370px', minWidth:'320px', minHeight:'320px', maxWidth:'400px', maxHeight:'400px', position:'relative'}}>
        <div className="w-full flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{color:'#1976d2', letterSpacing:'0.01em'}}>Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline btn-sm"
              style={{borderRadius:'2rem', fontWeight:600}}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="avatar" className="form-label">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <label htmlFor="bio" className="form-label">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-400 mt-1">{formData.bio.length}/500 characters</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{borderRadius:'2rem', fontWeight:700}}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  style={{borderRadius:'2rem', fontWeight:700}}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8 w-full flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-4 mb-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-4 border-blue-200 shadow"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-200 shadow">
                    <User className="w-12 h-12 text-blue-400" />
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-1" style={{color:'#1976d2'}}>{user?.username}</h2>
                  <p className="text-gray-500 mb-2">{user?.email}</p>
                </div>
              </div>
              {user?.bio && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Bio</h3>
                  <p className="text-blue-900">{user.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user?.reputation || 0}</div>
                  <div className="text-sm text-blue-700">Reputation</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user?.questionsCount || 0}</div>
                  <div className="text-sm text-green-700">Questions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user?.answersCount || 0}</div>
                  <div className="text-sm text-purple-700">Answers</div>
                </div>
              </div>
              {user?.badges && user.badges.length > 0 && (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Badges</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {user.badges.map((badge, index) => (
                      <span key={index} className="badge badge-primary" style={{fontWeight:600, fontSize:'1rem', padding:'0.4em 1em'}}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 