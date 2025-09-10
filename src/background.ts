import browser from 'webextension-polyfill';

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
    console.log('Response error: ', error);
    sendResponse?.({ success: false, error: error.message });
  }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendRequest(message, sender, sendResponse);

  return true;
});
