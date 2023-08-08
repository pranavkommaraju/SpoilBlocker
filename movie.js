let blockingEnabled = true;
let movieTitles = [];
let blockedElements = new Set();
let originalTextMap = new Map();

function blockSpoilers(movieTitles) {
  const allNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  while (allNodes.nextNode()) {
    const currentNode = allNodes.currentNode;
    const textContent = currentNode.textContent;

    const isSpoiler = movieTitles.some(title => textContent.includes(title))

    if (blockingEnabled && isSpoiler) {
      blockElement(currentNode)
    }
  }
}

function blockElement(element) {
  originalTextMap.set(element, element.textContent);
  element.textContent = "Spoiler Blocked: This content contains movie spoilers.";
  blockedElements.add(element);
}

function unblockElement(element) {
  const originalText = originalTextMap.get(element);
  element.textContent = originalTextMap.get(element);
  blockedElements.delete(element);
}

function toggleBlocking() {
  blockingEnabled = !blockingEnabled;

  if (blockingEnabled) {
    blockSpoilers(movieTitles);
  } else {
    for (const element of blockedElements) {
      unblockElement(element);
    }
  }
}

function fetchMovieTitles() {
  const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjIyNmI5ZTQ5Y2E3N2YxYjM2ZDE4NjViMjU4OWRlOCIsInN1YiI6IjY0OGEzZDI1ZDA1YTAzMDBlMjRlYjE5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M163Z6pon1nVnIIgeyFRt1oQ8cDG6W3yiNv1QYUlR0g'
      }
    };
    
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    .then(response => response.json())
    .then(function (result) {
      movieTitles = result.results.map(movie => movie.title);
      setTimeout(() => {blockSpoilers(movieTitles);}, 500);
    })
    .catch(error => console.error('error', error)); 
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'toggleBlocking') {
    toggleBlocking();
  }
});


fetchMovieTitles();