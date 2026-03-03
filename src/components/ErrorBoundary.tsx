
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // Here we could log to a service like Sentry or LogRocket
    }

    private handleRestart = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-4 border-blue-100 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Oops! Something went wrong.
                        </h1>

                        <p className="text-gray-500 mb-8">
                            Don't worry, even computers get confused sometimes! Let's try again.
                        </p>

                        <button
                            onClick={this.handleRestart}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105"
                        >
                            <RefreshCw className="w-6 h-6" />
                            Restart App
                        </button>


                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
