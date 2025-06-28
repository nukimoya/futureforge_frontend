import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {  Briefcase,  Sparkles,  LogOut,  BarChart2,  User, Clock,  FileText,  TrendingUp, Calendar, Target, ChevronRight, Download, MessageCircle, Bell, Settings } from "lucide-react";
import { AuthContext } from "../../context/authContext";
import StartTestModal from "../../components/startTestModal";

import { toast } from 'react-toastify';
import { useAxios } from "../../config/api";
const Dashboard = () => {
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [testStatus, setTestStatus] = useState("Completed");
  const [userStats, setUserStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({})
  const [learningPaths, setLearningPaths] = useState([
    {
      title: "UX Design Fundamentals",
      description: "Master the principles of user experience design",
      completedModules: 3,
      totalModules: 8
    },
    {
      title: "Data Analysis with Python",
      description: "Learn statistical analysis and data visualization",
      completedModules: 0,
      totalModules: 12
    }
  ]);
  const [showTestInstructions, setShowTestInstructions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const api = useAxios()

  const username = user?.data?.user?.username;
  const email = user?.data?.user?.email;
  const role = user?.data?.user?.role;


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

  const handleOpenRecommendations = () => {
    try {
      navigate('/recommendations');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to open recommendations');
    }
  };

  const handleTakeTestClick = () => {
    setShowTestInstructions(true);
  };

    const handleCloseInstructions = () => {
    setShowTestInstructions(false);
  };

  const handleBeginTest = () => {
    setShowTestInstructions(false);
    navigate('/test');
  };

  const mockActivities = [
    { type: "assessment", title: "Completed Personality Assessment", time: "2 hours ago", icon: BarChart2 },
    { type: "learning", title: "Finished Python Basics Module", time: "1 day ago", icon: FileText },
    { type: "career", title: "New career match found", time: "3 days ago", icon: Target }
  ];

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
  
        const response = await api.get('/api/recommendations');
  
        if (!response.data) {
          throw new Error('No data returned from server');
        }
  
        const data = response.data;
  
        // Optional: populate the user profile section
        const profile = {
          personalityProfile: data.profile?.personalityProfile || '',
          interestSummary: data.profile?.interestSummary || '',
          metaSummary: data.profile?.metaSummary || '',
          completedAt: data.completedAt
            ? new Date(data.completedAt).toLocaleDateString()
            : new Date().toLocaleDateString()
        };
        setUserProfile(profile);
  
        // Format the recommendations for the frontend UI
        const formattedRecommendations = (data.recommendations || []).map((rec) => ({
          title: rec.title || 'Untitled Career',
          summary: rec.summary || 'No summary available.',
          score: rec.score || 0
        }));
  
        setCareerRecommendations(formattedRecommendations);
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

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
  
        const response = await api.get('/api/userStats');
  
        if (!response.data) {
          throw new Error('No stats returned from server');
        }
  
        setUserStats(response.data);
      } catch (err) {
        console.error('❌ Failed to fetch user stats:', err);
        toast.error(`Failed to load user stats`, {
          position: 'top-right',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored'
        });
      } finally {
        setStatsLoading(false);
      }
    };
  
    fetchUserStats();
  }, [api]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
  
        const response = await api.get('/api/user/activities');
  
        if (!response.data || !Array.isArray(response.data.activities)) {
          throw new Error('Invalid response format');
        }
  
        setActivities(response.data.activities);
      } catch (error) {
        console.error('❌ Failed to fetch user activities:', error);
        toast.error('Failed to load recent activities', {
          position: 'top-right',
          autoClose: 4000,
          pauseOnHover: true,
          theme: 'colored'
        });
      } finally {
        setLoadingActivities(false);
      }
    };
  
    fetchActivities();
  }, [api]);
  
  


  const getTestStatusInfo = (status) => {
    const statusMap = {
      "Not started": { 
        color: "text-slate-500", 
        bg: "bg-slate-100", 
        progress: 0,
        message: "Ready to discover your potential?"
      },
      "In Progress": { 
        color: "text-amber-600", 
        bg: "bg-amber-100", 
        progress: 40,
        message: "You're making great progress!"
      },
      "Completed": { 
        color: "text-emerald-600", 
        bg: "bg-emerald-100", 
        progress: 100,
        message: "Assessment complete - explore your results!"
      }
    };
    return statusMap[status] || statusMap["Not started"];
  };

  const statusInfo = getTestStatusInfo(testStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Top Navigation */}
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
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-2">
                Welcome back, {username}! 👋
              </h2>
              <p className="text-lg text-slate-600">
                {careerRecommendations.length > 0
                  ? `Your top career match: ${careerRecommendations[0]?.title}`
                  : "Ready to discover your perfect career path?"}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Today's Date</p>
                <p className="text-lg font-semibold text-slate-700">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{userStats.testsTaken}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Assessments Completed</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{userStats.distinctCareerCount}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Career Matches</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{userStats.averageScore}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Average Score</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{userStats.timeSinceLastTest}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Last test</p>
            </div>

          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assessment Section */}
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Career Assessment</h3>
                  <p className="text-slate-600">{statusInfo.message}</p>
                </div>
              </div>

              <div className={`${statusInfo.bg} rounded-2xl p-6 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Assessment Status</p>
                    <p className={`text-lg font-bold ${statusInfo.color}`}>{testStatus}</p>
                  </div>
                  {testStatus === "Completed" && (
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">AI Confidence</p>
                      <p className="text-lg font-bold text-emerald-600">92%</p>
                    </div>
                  )}
                </div>

                {statusInfo.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-700">{statusInfo.progress}%</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${statusInfo.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <p>✨ Discover your strengths and interests</p>
                  <p>⏱️ Takes about 8-10 minutes</p>
                </div>
                <button
                  onClick={handleTakeTestClick}
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>{testStatus === "Completed" ? "Retake Assessment" : "Start Assessment"}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">AI Career Recommendations</h3>
                    <p className="text-slate-600">Personalized matches based on your profile</p>
                  </div>
                </div>
                {careerRecommendations.length > 0 && (
                  <button onClick={handleOpenRecommendations} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : careerRecommendations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-4">Complete your assessment to unlock personalized career recommendations</p>
                  <button 
                    onClick={() => navigate("/test")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Take Assessment →
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {careerRecommendations.slice(0, 3).map((career, idx) => (
                    <div
                      key={idx}
                      className="group bg-gradient-to-r from-slate-50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50 border border-slate-200/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-slate-800 text-lg">{career.title}</h4>
                          </div>
                          <p className="text-slate-600 mb-3">{career.summary}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-green-700">{career.score}% Match</span>
                            </div>
                            <span className="text-sm text-slate-500">High Demand</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Paths */}
            <div className="relative">
              {/* Original Content */}
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Learning Paths</h3>
                    <p className="text-slate-600">Curated courses to boost your career</p>
                  </div>
                </div>
                

                {learningPaths.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">Learning paths will appear after completing your assessment</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                    <span className="text-xl font-semibold text-slate-700 bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-slate-300">
                      🚧 Coming Soon
                    </span>
                  </div>
                  {learningPaths.map((path, index) => (
                    <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800 text-lg">{path.title}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium text-emerald-700">
                            {Math.round((path.completedModules / path.totalModules) * 100)}% Complete
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-4">{path.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${(path.completedModules / path.totalModules) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {path.completedModules} of {path.totalModules} modules
                          </p>
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                          {path.completedModules === 0 ? "Start" : "Continue"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Your Profile</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="font-bold text-slate-800 text-lg">{username}</h4>
                  <p className="text-slate-600">{email}</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mt-2">
                    {role}
                  </span>
                </div>

                <button 
                // onClick={handleDownloadReport}
                 className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700 font-medium">Ask CareerBot</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-700 font-medium">Schedule Mentoring</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Skill Assessment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StartTestModal
          isOpen={showTestInstructions}
          onClose={handleCloseInstructions}
          onStartTest={handleBeginTest}
          testDuration={12}
        />
    </div>
  );
};

export default Dashboard;