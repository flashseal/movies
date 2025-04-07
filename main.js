// main.js
document.addEventListener("DOMContentLoaded", () => {
  const movies = document.getElementsByClassName("movie");
  const movieArray = Array.from(movies);

  // 使用 FuzzySet 建立索引
  const fuzzySet = FuzzySet();
  const movieMap = new Map(); // 儲存索引與電影元素的映射

  movieArray.forEach((movie, index) => {
    const title = movie.getAttribute("data-title") || "";
    const pElements = movie.getElementsByTagName("p");
    const pText = pElements.length > 0 ? pElements[0].textContent : ""; // 只取第一個 <p>

    // 分別索引 data-title 和第一個 <p> 的內容
    if (title) fuzzySet.add(title);
    if (pText) fuzzySet.add(pText);

    // 儲存映射，方便後續查找
    movieMap.set(title, movie);
    if (pText && pText !== title) movieMap.set(pText, movie);
  });

  // 搜索功能
  const searchInput = document.getElementById("movietitle");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
      movieArray.forEach(movie => (movie.style.display = "block"));
      return;
    }

    const results = fuzzySet.get(query, null, 0.1); // 降低匹配門檻到 0.1

    // 隱藏所有電影，然後根據結果顯示匹配項
    movieArray.forEach(movie => (movie.style.display = "none"));
    if (results) {
      results.forEach(([score, matchedText]) => {
        const matchedMovie = movieMap.get(matchedText);
        if (matchedMovie) matchedMovie.style.display = "block";
      });
    }
  });

  // 圖片延遲加載
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });
  document.querySelectorAll("img.poster").forEach(img => observer.observe(img));
});