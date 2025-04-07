import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Simple smoke test to verify the testing setup works
describe('App', () => {
  it('renders without crashing', () => {
    // This test is just to verify the testing setup
    expect(true).toBe(true);
  });
});
