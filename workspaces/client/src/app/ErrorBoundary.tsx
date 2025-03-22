import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムのエラー表示、または提供されたフォールバックを使用
      return (
        this.props.fallback || (
          <div className="error-boundary bg-red-900 p-4 text-white">
            <h2 className="mb-2 text-xl font-bold">アプリケーションエラー</h2>
            <details className="mt-2">
              <summary className="cursor-pointer">詳細を表示</summary>
              <pre className="mt-2 overflow-auto rounded bg-red-950 p-2 text-sm">{this.state.error?.toString()}</pre>
            </details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
