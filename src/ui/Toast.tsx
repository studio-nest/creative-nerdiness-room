import { useEffect } from 'react';
import { useRoomStore } from '../state/useRoomStore';

export function Toast() {
  const toast = useRoomStore((s) => s.toast);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => useRoomStore.getState().clearToast(), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
