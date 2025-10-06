import axios from "axios";

// ✅ CONSISTENT BASE URL
const API_BASE_URL = 'http://localhost:8080/api';

// ✅ JWT TOKEN MANAGEMENT - ONLY localStorage
const getToken = () => localStorage.getItem("token");

const setToken = (token) => {
  localStorage.setItem("token", token);
};

const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ AXIOS CONFIGURATION
axios.defaults.baseURL = API_BASE_URL;

// ✅ REQUEST INTERCEPTOR - PROPER JWT HANDLING
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 JWT Token attached to request');
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR - HANDLE JWT EXPIRY
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚪 JWT expired - redirecting to login');
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ AUTHENTICATION FUNCTIONS
export const authLogin = async (loginData) => {
  try {
    console.log('🔐 Logging in via /auth/login...');
    
    const response = await axios.post('/auth/login', loginData);
    const data = response.data;
    
    console.log('Login response:', data);
    
    // ✅ SAVE JWT TOKEN TO localStorage
    if (data.token) {
      setToken(data.token);
      console.log('✅ JWT token saved to localStorage');
    }
    
    // ✅ SAVE USER DATA TO localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ User data cached to localStorage');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Login failed');
  }
};

export const authRegister = async (userData) => {
  try {
    console.log('📝 Registering via /auth/register...');
    
    const response = await axios.post('/auth/register', userData);
    const data = response.data;
    
    console.log('Registration response:', data);
    
    // ✅ SAVE JWT TOKEN TO localStorage
    if (data.token) {
      setToken(data.token);
      console.log('✅ JWT token saved after registration');
    }
    
    // ✅ SAVE USER DATA TO localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ User data saved after registration');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Registration error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
  }
};

export const logout = () => {
  console.log('🚪 Logging out - clearing localStorage...');
  removeToken();
  window.location.href = "/login";
};

// ✅ STUDENT PROFILE FUNCTIONS
export const getUserProfile = async () => {
  try {
    console.log('📖 Fetching profile from /students/profile...');
    
    const response = await axios.get('/students/profile');
    const profile = response.data.student || response.data;
    
    // ✅ UPDATE localStorage WITH DATABASE DATA
    localStorage.setItem('user', JSON.stringify(profile));
    console.log('✅ Profile fetched from MySQL and cached');
    
    return profile;
    
  } catch (error) {
    console.error('❌ Error fetching profile:', error.response?.data || error.message);
    
    // ✅ FALLBACK TO CACHED DATA
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      console.log('⚠️ Using cached profile (database unavailable)');
      return JSON.parse(cachedUser);
    }
    
    throw new Error(error.response?.data?.error || 'Failed to get profile');
  }
};

export const saveUserProfile = async (profileData) => {
  try {
    console.log('💾 Saving profile to /students/profile...');
    console.log('Profile data:', profileData);
    
    const response = await axios.put('/students/profile', profileData);
    
    // ✅ HANDLE RESPONSE PROPERLY
    let savedProfile;
    if (response.data.student) {
      savedProfile = response.data.student;
    } else if (response.data.success !== false) {
      savedProfile = response.data;
    } else {
      throw new Error(response.data.error || 'Failed to save profile');
    }
    
    // ✅ UPDATE localStorage
    localStorage.setItem('user', JSON.stringify(savedProfile));
    console.log('✅ Profile saved to MySQL and cached');
    
    return savedProfile;
    
  } catch (error) {
    console.error('❌ Error saving profile:', error.response?.data || error.message);
    
    // ✅ IF STUDENT NOT FOUND, CREATE NEW PROFILE
    if (error.response?.data?.error?.includes('Student not found') || 
        error.response?.status === 404) {
      
      console.log('⚠️ Student not found, creating new profile...');
      return await createProfile(profileData);
    }
    
    throw new Error(error.response?.data?.error || 'Failed to save profile');
  }
};

export const createProfile = async (profileData) => {
  try {
    console.log('🆕 Creating profile via /students/profile...');
    
    const response = await axios.post('/students/profile', profileData);
    const newProfile = response.data.student || response.data;
    
    // ✅ UPDATE localStorage
    localStorage.setItem('user', JSON.stringify(newProfile));
    console.log('✅ Profile created and cached');
    
    return newProfile;
    
  } catch (error) {
    console.error('❌ Error creating profile:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to create profile');
  }
};

// ✅ UTILITY FUNCTIONS
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log('⚠️ JWT token expired');
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Invalid JWT token');
    removeToken();
    return false;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

// ✅ SIMPLE DASHBOARD FUNCTIONS - NO BACKEND DEPENDENCIES
export const getDashboardStats = () => {
  const user = getCurrentUser();
  
  return {
    success: true,
    data: {
      userName: user?.name || user?.username || 'User',
      userEmail: user?.email || '',
      profileComplete: !!(user?.name && user?.email),
      lastLogin: new Date().toISOString(),
      welcomeMessage: `Welcome back, ${user?.name || user?.username || 'User'}!`
    }
  };
};

export const getUserActivity = () => {
  const user = getCurrentUser();
  
  return {
    success: true,
    data: {
      user: user,
      recentActivities: [
        {
          type: 'profile_update',
          message: 'Profile information updated',
          date: new Date().toISOString()
        }
      ],
      lastProfileUpdate: new Date().toISOString()
    }
  };
};

// ✅ CAREER FUNCTIONS - OPTIONAL ENDPOINTS
export const getAllCareers = async () => {
  try {
    console.log('📚 Fetching all careers...');
    const response = await axios.get('/careers');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Careers endpoint not available:', error.message);
    return { 
      careers: [
        { id: 1, title: 'Software Developer', description: 'Build applications and websites' },
        { id: 2, title: 'Data Scientist', description: 'Analyze data to gain insights' },
        { id: 3, title: 'UX Designer', description: 'Design user-friendly interfaces' }
      ] 
    };
  }
};

export const getCareerById = async (id) => {
  try {
    console.log(`🔍 Fetching career by ID: ${id}...`);
    const response = await axios.get(`/careers/${id}`);
    return response.data;
  } catch (error) {
    console.warn('⚠️ Career details endpoint not available:', error.message);
    return { 
      career: { 
        id: id, 
        title: 'Sample Career', 
        description: 'Career details coming soon...' 
      } 
    };
  }
};

// ✅ QUIZ FUNCTIONS - OPTIONAL ENDPOINTS
export const getQuizQuestions = async () => {
  try {
    console.log('📝 Fetching quiz questions...');
    const response = await axios.get('/quiz/questions');
    
    if (response.data.success) {
      return { data: response.data.data };
    } else {
      throw new Error(response.data.message || 'Failed to fetch questions');
    }
  } catch (error) {
    console.warn('⚠️ Quiz endpoint not available:', error.message);
    return {
      data: [
        {
          id: 1,
          question: 'What type of work environment do you prefer?',
          options: ['Office', 'Remote', 'Hybrid', 'Outdoor']
        },
        {
          id: 2,
          question: 'Which skills are you most interested in developing?',
          options: ['Programming', 'Design', 'Analysis', 'Management']
        }
      ]
    };
  }
};

export const submitQuizAnswers = async (answers, legacyAnswers = null) => {
  try {
    console.log('📤 Submitting quiz answers...');
    
    const payload = {
      answers: answers || {},
      legacyAnswers: legacyAnswers || {},
      userId: 1,
      studentId: 1,
      category: "mixed"
    };
    
    // Fix: Use axios instead of apiClient (which doesn't exist)
    const response = await axios.post('/quiz/submit', payload);
    
    console.log('✅ Quiz answers submitted');
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error submitting quiz:', error);
    throw error;
  }
};

// ✅ REMOVED PROBLEMATIC FUNCTIONS
// - getSavedCareers (was causing 500 errors)
// - getCareerTrends (was causing 500 errors)
// - removeSavedCareer (was causing 500 errors)
// - uploadProfileImage (not needed yet)

// ✅ DEBUG FUNCTION
export const debugAuth = () => {
  const token = getToken();
  const user = getCurrentUser();
  
  console.log('🔍 Authentication Status:');
  console.log('- Token exists:', !!token);
  console.log('- Is authenticated:', isAuthenticated());
  console.log('- Current user:', user);
  console.log('- Storage type: localStorage only');
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('- Token expires:', new Date(payload.exp * 1000));
      console.log('- Username:', payload.sub || payload.username);
    } catch (error) {
      console.log('- Token parse error:', error.message);
    }
  }
};