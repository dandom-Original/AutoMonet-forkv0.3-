import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ThemeProvider } from '../context/ThemeContext';

describe('Routing', () => {
  test('displays dashboard on default route', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
