import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, BookOpen, Target, Award, ChevronRight, RefreshCw, User, Calendar, Clock } from 'lucide-react';
import { useAxios } from '../../config/api';
import { toast } from 'react-toastify';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const api = useAxios()

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                      <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">AI Recommendations</h1>
          </div>
          
          {/* User Profile Summary */}
          {userProfile && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-800">Profile Analysis</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-600">{userProfile.completedAt}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {userProfile.personalityProfile && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Personality Profile:</h4>
                    <p className="text-gray-600 text-sm">{userProfile.personalityProfile}</p>
                  </div>
                )}
                
                {userProfile.interestSummary && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Interest Summary:</h4>
                    <p className="text-gray-600 text-sm">{userProfile.interestSummary}</p>
                  </div>
                )}
                
                {userProfile.metaSummary && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Test Summary:</h4>
                    <p className="text-gray-600 text-sm">{userProfile.metaSummary}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-gray-600">
            Based on your test results and profile analysis, here are personalized recommendations to help you achieve your goals.
          </p>
        </div>

        {/* High Priority Recommendations */}
        {highPriorityRecs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              High Priority Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {highPriorityRecs.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} getIconComponent={getIconComponent} getPriorityColor={getPriorityColor} getTypeColor={getTypeColor} />
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority Recommendations */}
        {mediumPriorityRecs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              Medium Priority Recommendations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediumPriorityRecs.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} getIconComponent={getIconComponent} getPriorityColor={getPriorityColor} getTypeColor={getTypeColor} />
              ))}
            </div>
          </div>
        )}

        {/* Low Priority Recommendations */}
        {lowPriorityRecs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              Additional Recommendations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lowPriorityRecs.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} getIconComponent={getIconComponent} getPriorityColor={getPriorityColor} getTypeColor={getTypeColor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RecommendationCard = ({ recommendation, getIconComponent, getPriorityColor, getTypeColor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              {getIconComponent(recommendation.icon)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{recommendation.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(recommendation.type)}`}>
                  {recommendation.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getPriorityColor(recommendation.priority)}`}>
                  {recommendation.priority} Priority
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-blue-600 mb-1">
              <Star className="h-4 w-4 mr-1" />
              <span className="font-semibold">{recommendation.confidence}%</span>
            </div>
            <span className="text-xs text-gray-500">Confidence</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">{recommendation.description}</p>

        {/* Skills and Timeframe */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{recommendation.timeframe}</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {recommendation.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {skill}
              </span>
            ))}
            {recommendation.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                +{recommendation.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
        >
          {expanded ? 'Show Less' : 'View Action Plan'}
          <ChevronRight className={`h-4 w-4 ml-1 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded Action Items */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-3">Recommended Action Steps:</h4>
            <ul className="space-y-2">
              {recommendation.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;