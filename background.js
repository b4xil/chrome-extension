chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_HIGHLIGHT") {
    chrome.storage.local.get(["highlights"], (result) => {
      const highlights = result.highlights || [];

      highlights.push(message.payload);

      chrome.storage.local.set({ highlights });
    });
  }
});