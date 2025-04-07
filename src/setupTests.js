import '@testing-library/jest-dom';

// Global mocks and setup for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
