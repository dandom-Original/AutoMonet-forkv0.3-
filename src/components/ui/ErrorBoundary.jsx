import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // You could log this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 mx-auto mt-10 max-w-lg bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 dark:text-red-400">
            {this.state.error?.message || "An unknown error occurred"}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
