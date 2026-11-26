import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: (error: unknown) => void;
}

/** Catches render/chunk-load failures in the 3D layer and hands control to the fallback. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[room] 3D view failed:', error);
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
