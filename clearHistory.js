// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.storage.sync.get('websitesToClear', function (data) {
      let websitesToClear = data.websitesToClear || [];
      if (websitesToClear.some(website => changeInfo.url.includes(website))) {
        chrome.storage.local.get({ urlsToClear: [] }, function (data) {
          let urlsToClear = data.urlsToClear;
          if (!urlsToClear.includes(changeInfo.url)) {
            urlsToClear.push(changeInfo.url);
            chrome.storage.local.set({ urlsToClear: urlsToClear });
          }
        });
      }
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get({ urlsToClear: [] }, function (data) {
    let urlsToClear = data.urlsToClear;
    if (urlsToClear.length > 0) {
      urlsToClear.forEach((url) => {
        chrome.history.deleteUrl({ url: url });
      });
      chrome.storage.local.set({ urlsToClear: [] });
    }
  });
});

