import axios from 'axios';
import config from '../config';
import { mockRegister, mockLogin, mockGetRegions, mockGetSupport, mockGetAlerts, mockGetNotes, mockGetSchemes, mockPostSchemes, mockPostSupport, mockPostAlerts, mockPostNotes } from './mockBackend';

const normalizeEndpoint = (endpoint) => endpoint.replace(/^\//, '');

const buildFallbackPaths = (endpoint) => {
  const normalized = normalizeEndpoint(endpoint);
  const baseUrl = config.API_BASE_URL;
  
  return [
    `${baseUrl}/api/${normalized}`,
    `${baseUrl}/api/analytics/${normalized}`,
    `${baseUrl}/api/auth/${normalized}`,
    `${baseUrl}/api/v1/${normalized}`,
    `${baseUrl}/${normalized}`,
    `${baseUrl}/auth/${normalized}`,
    `${baseUrl}/users/${normalized}`,
  ];
};

const DEBUG = true;

const log = (message) => {
  if (DEBUG) {
    console.log(`[API] ${message}`);
  }
};

const shouldFallback = (error) => {
  if (!error) return false;
  if (!error.response) return true; // network error / no server response
  return error.response.status === 404;
};

export const getWithFallback = async (endpoint, config_override) => {
  const paths = buildFallbackPaths(endpoint);
  log(`GET ${endpoint} from ${config.API_BASE_URL} - trying paths:`);
  paths.forEach(p => log(`  - ${p}`));
  
  let lastError;

  for (const path of paths) {
    try {
      log(`  Attempting: ${path}`);
      const response = await axios.get(path, config_override);
      log(`  ✓ Success: ${path}`);
      return response;
    } catch (error) {
      if (shouldFallback(error)) {
        log(`  ✗ Fallback-eligible error: ${error?.response?.status || 'network'} at ${path}`);
        lastError = error;
        continue;
      }
      log(`  ✗ Error (${error?.response?.status || 'network'}): ${path}`);
      throw error;
    }
  }

  // Try mock fallback
  try {
    log(`Trying mock for ${endpoint}`);
    let mockResponse;
    if (endpoint === 'regions') mockResponse = await mockGetRegions();
    else if (endpoint === 'support') mockResponse = await mockGetSupport();
    else if (endpoint === 'alerts') mockResponse = await mockGetAlerts();
    else if (endpoint === 'notes') mockResponse = await mockGetNotes();
    else if (endpoint === 'schemes') mockResponse = await mockGetSchemes();
    if (mockResponse) {
      log(`  ✓ Mock Success: ${endpoint}`);
      return mockResponse;
    }
  } catch (mockError) {
    log(`  ✗ Mock Error: ${endpoint}`);
  }

  log(`GET ${endpoint} - ALL PATHS AND MOCK FAILED`);
  throw lastError;
};

export const postWithFallback = async (endpoint, data, config_override) => {
  const paths = buildFallbackPaths(endpoint);
  log(`POST ${endpoint} from ${config.API_BASE_URL} - trying paths:`);
  paths.forEach(p => log(`  - ${p}`));
  
  let lastError;

  for (const path of paths) {
    try {
      log(`  Attempting: ${path}`);
      const response = await axios.post(path, data, config_override);
      log(`  ✓ Success: ${path}`);
      return response;
    } catch (error) {
      if (shouldFallback(error)) {
        log(`  ✗ Fallback-eligible error: ${error?.response?.status || 'network'} at ${path}`);
        lastError = error;
        continue;
      }
      log(`  ✗ Error (${error?.response?.status || 'network'}): ${path}`);
      throw error;
    }
  }

  // Try mock fallback
  try {
    log(`Trying mock for ${endpoint}`);
    let mockResponse;
    if (endpoint === 'register') mockResponse = await mockRegister(data);
    else if (endpoint === 'login') mockResponse = await mockLogin(data);
    else if (endpoint === 'schemes') mockResponse = await mockPostSchemes(data);
    else if (endpoint === 'support') mockResponse = await mockPostSupport(data);
    else if (endpoint === 'alerts') mockResponse = await mockPostAlerts(data);
    else if (endpoint === 'notes') mockResponse = await mockPostNotes(data);
    if (mockResponse) {
      log(`  ✓ Mock Success: ${endpoint}`);
      return mockResponse;
    }
  } catch (mockError) {
    log(`  ✗ Mock Error: ${endpoint}`);
    throw mockError;
  }

  log(`POST ${endpoint} - ALL PATHS AND MOCK FAILED`);
  throw lastError;
};
