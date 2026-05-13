// Mock authentication service for offline/development
// Stores user data in localStorage

const STORAGE_KEY = 'equiclimate_users';
const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@gmail.com',
    password: 'demo123',
    role: 'Citizen'
  }
];

// Initialize localStorage with mock data
const initMockUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
  }
};

export const mockRegister = async (data) => {
  initMockUsers();
  
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  // Check if user already exists
  if (users.some(u => u.email === data.email)) {
    const error = new Error('User already exists');
    error.response = { status: 409, data: { message: 'User already exists' } };
    throw error;
  }
  
  // Add new user
  const newUser = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  // Simulate API response
  return {
    data: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      message: 'User registered successfully'
    }
  };
};

export const mockLogin = async (data) => {
  initMockUsers();
  
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const user = users.find(u => u.email === data.email && u.password === data.password);
  
  if (!user) {
    const error = new Error('Invalid credentials');
    error.response = { status: 401, data: { message: 'Invalid email or password' } };
    throw error;
  }
  
  // Simulate API response
  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: 'mock_token_' + user.id
    }
  };
};

export const mockGetRegions = async () => {
  // Return mock regions data with coordinates to support location lookups
  return {
    data: [
      { id: 1, city: 'Urban Basin', aqi: 180, temperature: 38, income: 45000, populationDensity: 800, emissions: 650, gapScore: 7.5, latitude: 28.7041, longitude: 77.1025 },
      { id: 2, city: 'Coastal Delta', aqi: 140, temperature: 32, income: 55000, populationDensity: 600, emissions: 480, gapScore: 5.2, latitude: 19.0760, longitude: 72.8777 },
      { id: 3, city: 'River Plains', aqi: 200, temperature: 40, income: 35000, populationDensity: 900, emissions: 720, gapScore: 8.9, latitude: 22.5726, longitude: 88.3639 },
      { id: 4, city: 'Forest Margin', aqi: 95, temperature: 28, income: 40000, populationDensity: 300, emissions: 250, gapScore: 2.1, latitude: 13.0827, longitude: 80.2707 },
    ]
  };
};

export const mockGetSupport = async () => {
  return {
    data: [
      { id: 1, category: 'Health', description: 'Mobile health camps', region: 'Urban Basin' }
    ]
  };
};

export const mockGetAlerts = async () => {
  return {
    data: [
      { id: 1, message: 'High air quality alert in Urban Basin' }
    ]
  };
};

export const mockGetNotes = async () => {
  return {
    data: [
      { id: 1, region: 'Urban Basin', note: 'Need more resources' }
    ]
  };
};

export const mockGetSchemes = async () => {
  return {
    data: [
      { id: 1, name: 'Free Community Health Camps', description: 'Monthly health screenings', targetRegion: 'Urban Basin' }
    ]
  };
};

export const mockPostSchemes = async (data) => {
  return {
    data: { ...data, id: Date.now() }
  };
};

export const mockPostSupport = async (data) => {
  return {
    data: { ...data, id: Date.now() }
  };
};

export const mockPostAlerts = async (data) => {
  return {
    data: { ...data, id: Date.now() }
  };
};

export const mockPostNotes = async (data) => {
  return {
    data: { ...data, id: Date.now() }
  };
};
