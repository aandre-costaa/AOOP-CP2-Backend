document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('movieList');
    const detailContainer = document.getElementById('movieDetail');
    const loadingIndicator = document.getElementById('loading');
    const apiUrl = 'http://localhost:3000/movies';

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    function showLoading() {
        if (loadingIndicator) loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    // LOAD ALL MOVIES
    if (listContainer) {
        showLoading();
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                hideLoading();
                data.forEach(movie => {
                    const card = document.createElement('div');
                    card.className = 'movie-card';
                    card.innerHTML = `
                        <img src="${movie.poster ? movie.poster : 'https://via.placeholder.com/300x450'}" alt="${movie.title ? movie.title : 'No Title'}">
                        <div class="card-info">
                            <h2>${movie.title ? movie.title : 'N/A'}</h2>
                            <p class="year">${movie.year ? movie.year : 'Unknown Year'}</p>
                            <p class="genres">
                                ${movie.genres?.map(g => `<span>${g}</span>`).join(' ') || 'No Genres'}
                            </p>
                            <p class="desc">${movie.plot ? movie.plot : 'No Description Available'}</p>
                            <a class="details-btn" href="movie-page.html?id=${movie._id ? movie._id : ''}">View Details</a>
                        </div>
                    `;
                    listContainer.appendChild(card);
                });
            })
            .catch(err => {
                hideLoading();
                console.error('Error loading movies:', err);
            });
    }

    // LOAD MOVIE DETAIL
    if (detailContainer && movieId) {
        showLoading();

        // First, fetch the movie details
        fetch(`${apiUrl}/${movieId}`)
            .then(res => res.json())
            .then(movie => {
                hideLoading();

                // Fetch movie comments
                fetch(`${apiUrl}/comments/${movieId}`)
                    .then(res => res.json())
                    .then(comments => {
                        // Check if comments is an array and not empty
                        const commentsHtml = Array.isArray(comments) && comments.length > 0
                            ? comments.map(c => `
                            <div class="comment">
                                <p><strong>${c.name}</strong> <span class="date">${new Date(c.date).toLocaleDateString()}</span></p>
                                <p class="text">${c.text}</p>
                            </div>
                        `).join('')
                            : '<p class="text">No comments available</p>';

                        // Add movie details and comments
                        detailContainer.innerHTML = `
                        <div class="container">
                            <div class="poster-section">
                                <img src="${movie.poster || 'https://via.placeholder.com/300x450'}" alt="${movie.title || 'No Title'} Poster">
                            </div>
                            <div class="info-section">
                                <h1>${movie.title || 'Untitled'} <span class="year">(${movie.year || 'Unknown Year'})</span></h1>
                                <p class="genres">
                                    ${movie.genres?.map(g => `<span>${g}</span>`).join(' ') || 'No Genres'}
                                </p>
                                <p><strong>Directed by:</strong> ${movie.directors?.join(', ') || 'Unknown Directors'}</p>
                                <p><strong>Writers:</strong> ${movie.writers?.join(', ') || 'Unknown Writers'}</p>
                                <p><strong>Cast:</strong> ${movie.cast?.join(', ') || 'Unknown Cast'}</p>
                                <p><strong>Languages:</strong> ${movie.languages?.join(', ') || 'Unknown Languages'}</p>
                                <p><strong>Country:</strong> ${movie.countries?.join(', ') || 'Unknown Country'}</p>
                                <p><strong>Runtime:</strong> ${movie.runtime || 'Unknown Runtime'} minutes</p>
                                <p><strong>IMDb Rating:</strong> ${movie.imdb?.rating || 'N/A'} (${movie.imdb?.votes || '0'} votes)</p>
                                <p><strong>Awards:</strong> ${movie.awards?.text || 'No Awards'}</p>
                                <p><strong>Plot:</strong> ${movie.plot || 'No Plot Available'}</p>
                                <p><strong>Full Plot:</strong> ${movie.fullplot || 'No Full Plot Available'}</p>

                                <h3><strong>Comments:</strong></h3>
                                <div class="comments-section">
                                    ${commentsHtml}
                                </div>
                            </div>
                        </div>
                    `;
                    })
                    .catch(err => {
                        console.error('Error loading comments:', err);
                        // Fallback message in case of errors
                        detailContainer.innerHTML = `<p>Failed to load comments.</p>`;
                    });
            })
            .catch(err => {
                hideLoading();
                console.error('Error loading movie detail:', err);
            });
    }

});
