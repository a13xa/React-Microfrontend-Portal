import { useEffect, useRef } from 'react';

export interface PortalEventMap {
  NOTIFICATION_COUNT_CHANGE: { unreadCount: number };
  MF_DATA_READY: { source: string; summary: Record<string, unknown> };
}

export function emitPortalEvent<K extends keyof PortalEventMap>(
  type: K,
  payload: PortalEventMap[K]
): void {
  window.dispatchEvent(
    new CustomEvent(`portal:${type}`, { detail: payload })
  );
}

export function usePortalEvent<K extends keyof PortalEventMap>(
  type: K,
  handler: (payload: PortalEventMap[K]) => void
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const eventName = `portal:${type}`;
    const listener = (e: Event): void => {
      const customEvent = e as CustomEvent<PortalEventMap[K]>;
      handlerRef.current(customEvent.detail);
    };

    window.addEventListener(eventName, listener);
    return () => window.removeEventListener(eventName, listener);
  }, [type]);
}
