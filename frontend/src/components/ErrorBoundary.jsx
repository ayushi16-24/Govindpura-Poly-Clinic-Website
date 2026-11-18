import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="p-4 rounded-3 border bg-white shadow-sm mx-auto" style={{ maxWidth: 540 }}>
            <h2 className="h4 mb-2">Something went wrong</h2>
            <p className="text-muted mb-4">
              An unexpected error occurred while loading this page. Please refresh or return to the home page.
            </p>
            <button
              className="btn-gp me-2"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
            >
              Go to Home
            </button>
            <button
              className="btn-gp-outline"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
