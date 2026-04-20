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
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 p-10 text-right" dir="rtl">
          <div className="bg-white p-12 rounded-4xl shadow-2xl border-2 border-rose-100 max-w-2xl">
            <h2 className="text-4xl font-black text-rose-600 mb-6">عذراً، حدث خطأ تقني</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              يبدو أن هناك مشكلة في تحميل هذه الصفحة. حاول تحديث الصفحة أو العودة للرئيسية.
            </p>
            <pre className="bg-slate-50 p-6 rounded-2xl text-xs text-rose-400 overflow-auto mb-8 dir-ltr text-left">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-rose-700 transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
