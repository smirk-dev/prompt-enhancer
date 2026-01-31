/**
 * Jest Setup File
 * Configures testing environment and global mocks
 */

import '@testing-library/jest-dom';

// Mock performance.now() for consistent timing tests
const mockPerformanceNow = jest.fn();
let performanceCounter = 0;

mockPerformanceNow.mockImplementation(() => {
  performanceCounter += 10;
  return performanceCounter;
});

Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow,
  },
  writable: true,
});

// Reset performance counter between tests
beforeEach(() => {
  performanceCounter = 0;
});

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Note: window.location is configured via jest.config.js testEnvironmentOptions.url
// For tests that need different URLs, use explicit URL parameters in function calls
// or mock the entire module

// Mock window.getSelection
Object.defineProperty(window, 'getSelection', {
  value: jest.fn(() => ({
    toString: () => '',
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
  })),
  writable: true,
});

// Mock document.execCommand
document.execCommand = jest.fn(() => true);

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock chrome APIs for extension testing
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    id: 'test-extension-id',
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
} as unknown as typeof chrome;

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});
