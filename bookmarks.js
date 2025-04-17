let bookmarks = [];
let favoriteBookmarks = [];

function addBookmark() {
  const title = document.getElementById('bookmark-title').value;
  const url = document.getElementById('bookmark-url').value;
  const category = document.getElementById('bookmark-category').value;

  const bookmark = { title, url, category, isFavorite: false };
  bookmarks.push(bookmark);
  displayBookmarks();
}

function displayBookmarks() {
  const bookmarksContainer = document.getElementById('bookmarks');
  bookmarksContainer.innerHTML = '';

  bookmarks.forEach((bookmark, index) => {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.classList.add('bookmark');
    bookmarkElement.innerHTML = `
      <div>
        <span class="bookmark-title">${bookmark.title}</span><br>
        <span class="bookmark-url"><a href="${bookmark.url}" target="_blank">${bookmark.url}</a></span><br>
        <span class="category">${bookmark.category}</span>
      </div>
      <button class="favorite-button" onclick="toggleFavorite(${index})">
        ${bookmark.isFavorite ? '取消心标' : '标记心标'}
      </button>
    `;
    bookmarksContainer.appendChild(bookmarkElement);
  });
}

function toggleFavorite(index) {
  const bookmark = bookmarks[index];
  bookmark.isFavorite = !bookmark.isFavorite;

  if (bookmark.isFavorite) {
    favoriteBookmarks.push(bookmark);
  } else {
    favoriteBookmarks = favoriteBookmarks.filter(b => b !== bookmark);
  }

  displayFavorites();
  displayBookmarks();
}

function displayFavorites() {
  const favoriteContainer = document.getElementById('favorite-bookmarks');
  favoriteContainer.innerHTML = '';

  favoriteBookmarks.forEach((bookmark) => {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.classList.add('bookmark');
    bookmarkElement.innerHTML = `
      <div>
        <span class="bookmark-title">${bookmark.title}</span><br>
        <span class="bookmark-url"><a href="${bookmark.url}" target="_blank">${bookmark.url}</a></span><br>
        <span class="category">${bookmark.category}</span>
      </div>
    `;
    favoriteContainer.appendChild(bookmarkElement);
  });
}

function searchBookmarks() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(query) ||
    bookmark.url.toLowerCase().includes(query)
  );
  displayFilteredBookmarks(filteredBookmarks);
}

function displayFilteredBookmarks(filteredBookmarks) {
  const bookmarksContainer = document.getElementById('bookmarks');
  bookmarksContainer.innerHTML = '';

  filteredBookmarks.forEach((bookmark, index) => {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.classList.add('bookmark');
    bookmarkElement.innerHTML = `
      <div>
        <span class="bookmark-title">${bookmark.title}</span><br>
        <span class="bookmark-url"><a href="${bookmark.url}" target="_blank">${bookmark.url}</a></span><br>
        <span class="category">${bookmark.category}</span>
      </div>
      <button class="favorite-button" onclick="toggleFavorite(${index})">
        ${bookmark.isFavorite ? '取消心标' : '标记心标'}
      </button>
    `;
    bookmarksContainer.appendChild(bookmarkElement);
  });
}

function logout() {
  // Logout logic here
}
