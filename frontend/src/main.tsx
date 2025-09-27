import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // global styles (or Tailwind base styles)

function Root() {
  return (
    <React.StrictMode>
      <Suspense fallback={<div style={loaderStyle}>Loading Stablecoin Savings App...</div>}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Suspense>
    </React.StrictMode>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div style={errorStyle}>⚠ Something went wrong. Please refresh the page.</div>
    }
    return this.props.children
  }
}

// Inline styles 
const loaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '1.2rem',
  fontWeight: '500',
  color: '#333',
}

const errorStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20%',
  fontSize: '1.2rem',
  color: 'red',
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)
