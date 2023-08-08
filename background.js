chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'toggleBlocking') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, { action: 'toggleBlocking' });
            }
        });
    }
});
