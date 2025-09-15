import browser, { Runtime } from 'webextension-polyfill';
import { EMessageType } from './types';

async function sendRequest(
  message: any,
  sender: Runtime.MessageSender,
  sendResponse: (...params: any) => void
) {
  console.log('Request: ', message, sender);

  try {
    const response = await fetch(message.url, message?.init);
    const result = await response.json();

    sendResponse?.({ success: true, result });
  } catch (error: any) {
    sendResponse?.({
      success: false,
      error,
      message: error.message,
    });
  }
}

async function invokeNotifications(
  message: any,
  sender: Runtime.MessageSender,
  sendResponse: (...params: any) => void
) {
  try {
    console.log('invokeNotifications: ', message);

    const { params } = message;

    if (!params) {
      sendResponse?.({ success: false });
    }

    chrome.notifications.create({
      ...params,
      type: params.type || 'basic',
      iconUrl: chrome.runtime.getURL('icon/48.png'),
    });

    sendResponse?.({ success: true });
  } catch {
    console.log({ chrome, notifications: chrome.notifications });
    sendResponse?.({ success: false });
  }
}

async function setActiveTab(
  message: any,
  sender: Runtime.MessageSender,
  sendResponse: (...params: any) => void
) {
  try {
    if (sender.tab?.id && sender.tab?.windowId) {
      const tabId = sender.tab.id;
      const windowId = sender.tab.windowId;

      chrome.tabs.update(tabId, { active: true }, () => {
        chrome.windows.update(windowId, { focused: true });
      });
    }

    sendResponse?.({ true: false });
  } catch {
    sendResponse?.({ success: false });
  }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case EMessageType.REQUEST:
      sendRequest(message, sender, sendResponse);
      break;
    case EMessageType.NOTIFICATIONS:
      invokeNotifications(message, sender, sendResponse);
      break;
    case EMessageType.SET_CURRENT_TAB_ACTIVE:
      setActiveTab(message, sender, sendResponse);
      break;
  }

  return true;
});
