import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard.jsx';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText(/dashboard/i)).toBeTruthy();
  });
});
