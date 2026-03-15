import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-navy min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-gold font-display text-4xl md:text-5xl mb-6">
              Something went wrong
            </h1>
            <p className="text-warm/70 text-lg mb-8">
              An unexpected error occurred. Please try again or head back to the
              home page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-muted transition-colors"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-6 py-3 border border-gold/40 text-gold rounded-lg hover:border-gold transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
