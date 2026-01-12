import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#2D2A26' }}>Something went wrong</h1>
          <p style={{ marginBottom: '8px', color: '#666', fontSize: '16px' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          {this.state.error?.stack && (
            <details style={{ marginTop: '16px', maxWidth: '800px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#A88B5C', marginBottom: '8px' }}>
                Technical Details (Click to expand)
              </summary>
              <pre style={{ 
                backgroundColor: '#fff', 
                padding: '12px', 
                borderRadius: '4px', 
                overflow: 'auto',
                fontSize: '12px',
                color: '#333',
                border: '1px solid #ddd'
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#A88B5C', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reload Page
            </button>
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#8F7A52', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

