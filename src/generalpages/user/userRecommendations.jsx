import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Settings, Bell, TrendingUp, LogOut, BookOpen, Target, ChevronRight, RefreshCw, User, Calendar, Clock } from 'lucide-react';
import { AuthContext } from "../../context/authContext";
import { useAxios } from '../../config/api';
import { toast } from 'react-toastify';

const RecommendationsPage = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { 
    // user,
     dispatch } = useContext(AuthContext);
  
  const username = "Alex Johnson";
  const email = "alex.johnson@email.com";
  const role = "Professional";
  const api = useAxios()


  const handleLogout = () => {
    try {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const handledahsboard = () => {
    try{
      navigate('/dashboard');
    }
    catch {
      console.error('Couldn.t navigate to dashbaord')
    }
  }

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
  
        const response = await api.get('/api/recommendations');
        
        if (!response.data) {
          throw new Error('No data returned from server');
        }
  
        const data = response.data;
  
        const profile = {
          personalityProfile: data.profile?.personalityProfile || '',
          interestSummary: data.profile?.interestSummary || '',
          metaSummary: data.profile?.metaSummary || '',
          completedAt: data.completedAt
            ? new Date(data.completedAt).toLocaleDateString()
            : new Date().toLocaleDateString()
        };
  
        setUserProfile(profile);
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('❌ Failed to fetch recommendations:', err);
        setError(err.response?.data?.message || err.message || 'Unknown error');
        toast.error(`Failed to load recommendations`, {
          position: 'top-right',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored'
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecommendations();
  }, [api]);
  

  const getIconComponent = (iconType) => {
    const iconMap = {
      briefcase: TrendingUp,
      'chart-line': TrendingUp,
      book: BookOpen,
      code: TrendingUp,
      chart: TrendingUp,
      clock: Clock,
      target: Target,
      message: User
    };
    const IconComponent = iconMap[iconType] || Star;
    return <IconComponent className="h-6 w-6" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'career': return 'text-blue-600 bg-blue-50';
      case 'skill': return 'text-purple-600 bg-purple-50';
      case 'education': return 'text-green-600 bg-green-50';
      case 'certification': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600">
          <div className="h-12 w-12 mx-auto mb-4 text-red-500">⚠️</div>
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
  const lowPriorityRecs = recommendations.filter(r => r.priority === 'low');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Updated Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  FutureForge
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
            <button onClick={handledahsboard} className="text-sm font-medium text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 transition" >
                Dashboard
              </button>

              <div className="relative">
                <button
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <User className="w-4 h-4 text-slate-600" />
                </button>

                {showUserMenu && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl p-4"
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{username}</h4>
                        <p className="text-sm text-slate-600">{email}</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-1">
                          {role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
                        <Bell className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">Notifications</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
                        <Settings className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-700">Settings</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-red-50 rounded-lg transition-colors text-left text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto md:px-10 px-6 py-8">
        {/* Enhanced Header */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div> */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AI Recommendations
                </h1>
                <p className="text-slate-600 mt-1">Personalized insights for your growth journey</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced User Profile Summary */}
          {userProfile && (
            <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/60 border border-blue-200/40 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-slate-800 text-lg">Profile Analysis</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-200/40">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700 text-sm">{userProfile.completedAt}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {userProfile.personalityProfile && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/60">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Personality Profile
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{userProfile.personalityProfile}</p>
                  </div>
                )}
                
                {userProfile.interestSummary && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/60">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Interest Summary
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{userProfile.interestSummary}</p>
                  </div>
                )}
                
                {userProfile.metaSummary && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/60">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                      Test Summary
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{userProfile.metaSummary}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-slate-600 text-lg leading-relaxed">
            Based on your comprehensive assessment, we've curated personalized recommendations to accelerate your professional and personal development.
          </p>
        </div>

        {/* Enhanced High Priority Recommendations */}
        {highPriorityRecs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg"></div>
                <h2 className="text-2xl font-bold text-slate-800">High Priority Recommendations</h2>
              </div>
              <div className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {highPriorityRecs.length} items
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {highPriorityRecs.map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  getIconComponent={getIconComponent} 
                  getPriorityColor={getPriorityColor} 
                  getTypeColor={getTypeColor} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Medium Priority Recommendations */}
        {mediumPriorityRecs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full shadow-lg"></div>
                <h2 className="text-2xl font-bold text-slate-800">Medium Priority Recommendations</h2>
              </div>
              <div className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {mediumPriorityRecs.length} items
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {mediumPriorityRecs.map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  getIconComponent={getIconComponent} 
                  getPriorityColor={getPriorityColor} 
                  getTypeColor={getTypeColor} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Low Priority Recommendations */}
        {lowPriorityRecs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"></div>
                <h2 className="text-2xl font-bold text-slate-800">Additional Recommendations</h2>
              </div>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {lowPriorityRecs.length} items
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lowPriorityRecs.map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  getIconComponent={getIconComponent} 
                  getPriorityColor={getPriorityColor} 
                  getTypeColor={getTypeColor} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Footer Section */}
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to explore more?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              These recommendations are tailored specifically for you. Start with high-priority items and gradually work through your personalized development plan.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500  text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                Download Report
              </button>
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-white/90 transition-all duration-300">
                Schedule Review
              </button>
              <button onClick={handledahsboard} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendationCard = ({ recommendation, getIconComponent, getPriorityColor, getTypeColor }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl border border-white/40 overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-500 transform hover:scale-[1.02] relative">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center flex-1">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 rounded-2xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                  {getIconComponent(recommendation.icon)}
                </div>
              </div>
              {/* Icon glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-xl mb-2 bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                {recommendation.title}
              </h3>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize backdrop-blur-sm border shadow-sm transition-all duration-200 ${getTypeColor(recommendation.type)}`}>
                  {recommendation.type}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize backdrop-blur-sm shadow-sm transition-all duration-200 ${getPriorityColor(recommendation.priority)}`}>
                  {recommendation.priority} Priority
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right ml-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100/50 shadow-sm group-hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <Star className="h-5 w-5 mr-2 fill-current" />
                <span className="font-bold text-lg">{recommendation.confidence}%</span>
              </div>
              <span className="text-xs text-slate-600 font-medium">Confidence</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-slate-700 leading-relaxed text-base font-medium">
            {recommendation.description}
          </p>
        </div>

        {/* Timeframe */}
        <div className="flex items-center mb-6">
          <div className="inline-flex items-center bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/50 rounded-full px-4 py-2 shadow-sm">
            <Clock className="h-4 w-4 mr-2 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{recommendation.timeframe}</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {recommendation.skills.slice(0, 3).map((skill, idx) => (
              <span 
                key={idx} 
                className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-slate-700 rounded-xl text-sm font-medium border border-blue-100/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default"
              >
                {skill}
              </span>
            ))}
            {recommendation.skills.length > 3 && (
              <span className="px-3 py-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 rounded-xl text-sm font-medium border border-slate-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default">
                +{recommendation.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="group/btn inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {expanded ? 'Show Less' : 'View Action Plan'}
          <ChevronRight className={`h-4 w-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1 ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded Action Items */}
        {expanded && (
          <div className="mt-8 pt-6 border-t border-gradient-to-r from-slate-200 via-blue-100 to-purple-100">
            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl p-6 border border-blue-100/30 shadow-inner">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                <h4 className="font-bold text-slate-800 text-lg bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  Recommended Action Steps:
                </h4>
              </div>
              <ul className="space-y-4">
                {recommendation.actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start group/item">
                    <div className="relative">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 mt-0.5 shadow-sm group-hover/item:shadow-md transition-all duration-200">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all duration-200 group-hover/item:bg-white/80">
                      <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;