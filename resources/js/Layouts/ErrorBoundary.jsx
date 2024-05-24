// ErrorBoundary.jsx

import Error from '@/Pages/Error';
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {

    console.error(error, errorInfo);
}


render() {

    if (this.state.hasError) {
      return <div><Error/></div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
