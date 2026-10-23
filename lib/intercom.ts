export const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || 'y85thz7b';
export const INTERCOM_API_BASE = 'https://api-iam.intercom.io';

type IntercomFn = ((command: string, ...args: unknown[]) => void) & { booted?: boolean };

declare global {
  interface Window {
    Intercom?: IntercomFn;
    intercomSettings?: Record<string, unknown>;
  }
}

export function ic(command: string, ...args: unknown[]) {
  if (typeof window === 'undefined' || !window.Intercom) return false;
  window.Intercom(command, ...args);
  return true;
}

/** Reinicia el Messenger con una identidad nueva (o como visitante si no se pasa ninguna). */
export function reboot(settings: Record<string, unknown> = {}) {
  ic('shutdown');
  const next = { api_base: INTERCOM_API_BASE, app_id: INTERCOM_APP_ID, ...settings };
  window.intercomSettings = next;
  ic('boot', next);
}
