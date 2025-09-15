import browser from 'webextension-polyfill';

export enum EMessageType {
  REQUEST = 'REQUEST',
  NOTIFICATIONS = 'NOTIFICATIONS',
}

async function sendRequest(
  message: any,
  sender: any,
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
  sender: any,
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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case EMessageType.REQUEST:
      sendRequest(message, sender, sendResponse);
      break;
    case EMessageType.NOTIFICATIONS:
      invokeNotifications(message, sender, sendResponse);
      break;
  }

  return true;
});
