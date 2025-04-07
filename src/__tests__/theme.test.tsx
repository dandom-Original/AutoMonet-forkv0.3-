import React from 'react';
import { render, act } from '@testing-library/react';
import { useTheme } from '../context/ThemeContext';
import { ThemeProvider } from '../context/ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('Theme System', () => {
  test('toggles between light and dark mode', () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme').textContent).toBe('light');
    
    act(() => {
      getByText('Toggle').click();
    });
    
    expect(getByTestId('theme').textContent).toBe('dark');
  });
});
