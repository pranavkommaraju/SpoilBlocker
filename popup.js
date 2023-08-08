document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggleButton');
  let spoilersBlocked = true;

  function toggleBlocking() {
    spoilersBlocked = !spoilersBlocked;
    toggleButton.textContent = spoilersBlocked ? 'Spoilers Blocked' : 'Spoilers Showing';
    chrome.runtime.sendMessage({ action: 'toggleBlocking' });
  }

  toggleButton.addEventListener('click', toggleBlocking);
});
