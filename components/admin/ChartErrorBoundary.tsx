import React from 'react'

export default class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle?: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackTitle?: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Chart error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card p-6 rounded-xl border flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-muted-foreground mb-2">
            {this.props.fallbackTitle || 'Failed to load this section'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
