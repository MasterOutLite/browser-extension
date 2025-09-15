import { EMessageType } from '../../types';

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

export function sendSetActiveTab() {
  return chrome.runtime.sendMessage({
    type: EMessageType.SET_CURRENT_TAB_ACTIVE,
  });
}
