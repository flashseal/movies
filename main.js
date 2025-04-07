// main.js
document.addEventListener("DOMContentLoaded", () => {
  const movies = document.getElementsByClassName("movie");
  const movieArray = Array.from(movies);

  // �ϥ� FuzzySet �إ߯���
  const fuzzySet = FuzzySet();
  const movieMap = new Map(); // �x�s���޻P�q�v�������M�g

  movieArray.forEach((movie, index) => {
    const title = movie.getAttribute("data-title") || "";
    const pElements = movie.getElementsByTagName("p");
    const pText = pElements.length > 0 ? pElements[0].textContent : ""; // �u���Ĥ@�� <p>

    // ���O���� data-title �M�Ĥ@�� <p> �����e
    if (title) fuzzySet.add(title);
    if (pText) fuzzySet.add(pText);

    // �x�s�M�g�A��K����d��
    movieMap.set(title, movie);
    if (pText && pText !== title) movieMap.set(pText, movie);
  });

  // �j���\��
  const searchInput = document.getElementById("movietitle");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
      movieArray.forEach(movie => (movie.style.display = "block"));
      return;
    }

    const results = fuzzySet.get(query, null, 0.1); // ���C�ǰt���e�� 0.1

    // ���éҦ��q�v�A�M��ھڵ��G��ܤǰt��
    movieArray.forEach(movie => (movie.style.display = "none"));
    if (results) {
      results.forEach(([score, matchedText]) => {
        const matchedMovie = movieMap.get(matchedText);
        if (matchedMovie) matchedMovie.style.display = "block";
      });
    }
  });

  // �Ϥ�����[��
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