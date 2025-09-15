import { EMessageType } from '../../background';

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export enum StatusOperation {
  NONE = 'NONE',
  OK = 'OK',
  SEND_CARDS = 'SEND_CARDS',
  NOT_FOUND_CARDS = 'NOT_FOUND_CARDS',
  FETCH_SAVE_ERROR = 'FETCH_SAVE_ERROR',
}

export function sendNotification(params: {
  title: string;
  message: string;
  requireInteraction?: boolean;
}) {
  return chrome.runtime.sendMessage({
    params,
    type: EMessageType.NOTIFICATIONS,
  });
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
