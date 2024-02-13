/* This function initializes the "Accept" buttons for queue movies.
 It listens for clicks on buttons with the class "accept-queue-movie-btn."
 When clicked, it sends a request to upload the movie to the main movie list
  and then deletes it from the queue. After successfully accepting the movie,
   it updates the displayed queue movies. */
function initAcceptBtn() {
  const acceptBtns = document.querySelectorAll('.accept-queue-movie-btn');
  acceptBtns.forEach((acceptBtn) => {
    acceptBtn.addEventListener('click', async (event) => {
      const data = event.target.dataset;
      const movieData = {
        userName: data.userName,
        title: data.title,
        release: data.release,
        description: data.description,
        imagePath: data.imagepath,
        language: data.language,
        quality: data.quality,
        source: data.source,
        link: data.link,
        category: data.category,
      };
      try {
        const uploadResponse = await fetch('/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movieData),
        });
        if (uploadResponse.ok) {
          const movieQueueID = {
            id: data.movieQueueId,
          };
          const deleteResponse = await fetch('/delete-queue-movie', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieQueueID),
          });
          if (deleteResponse.ok) {
            const newQueueMovies = await deleteResponse.json();
            const queueMovieSection = document.querySelector('#queue-movies-section');
            let newQueueMoviesHTML = '';
            newQueueMovies.forEach((element) => {
              newQueueMoviesHTML += `<li class="queue-movie">
                                      <div class="queue-movie-parameters">
                                        <ul>
                                          <li>Movie send by: ${element.userName}</li>
                                          <li>${element.movie_title}</li>
                                          <li>${element.movie_release}</li>
                                          <li>${element.movie_description}</li>
                                          <li><a href="${element.movie_imagePath}" target="_blank" >Image-url</a></li>
                                          <li>${element.link_language}</li>
                                          <li>${element.link_quality}</li>
                                          <li>${element.link_source}</li>
                                          <li><a href="${element.link_url}" target="_blank" >Link-url</a></li>
                                          <li>${element.category}</li>
                                        </ul>
                                        <button class="accept-queue-movie-btn"
                                            data-user-name="${element.userName}"
                                            data-movie-queue-id="${element.movie_queueID}"
                                            data-title="${element.movie_title}"
                                            data-release="${element.movie_release}"
                                            data-description="${element.movie_description}"
                                            data-imagepath="${element.movie_imagePath}"
                                            data-language="${element.link_language}"
                                            data-quality="${element.link_quality}"
                                            data-source="${element.link_source}"
                                            data-link="${element.link_url}"
                                            data-category="${element.category}"
                                        >Accept</button>
                                        <button class="reject-queue-movie-btn" data-movie-queue-id="${element.movie_queueID}">Reject</button>
                                      </div>
                                    </li>`;
            });
            queueMovieSection.innerHTML = newQueueMoviesHTML;
            initAcceptBtn();
            initRejecttBtn();
          }
        }
      } catch (error) {
        console.log(error, 'An error occured during the request.');
      }
    });
  });
}
/* This function initializes the "Reject" buttons for queue movies.
 It listens for clicks on buttons with the class "reject-queue-movie-btn."
  When clicked, it sends a request to delete the movie from the queue. After
   successfully rejecting the movie, it updates the displayed queue movies. */
function initRejecttBtn() {
  const rejectrBtns = document.querySelectorAll('.reject-queue-movie-btn');
  rejectrBtns.forEach((rejectrBtn) => {
    rejectrBtn.addEventListener('click', async (event) => {
      const data = event.target.dataset;
      try {
        const movieQueueID = {
          id: data.movieQueueId,
        };
        const deleteResponse = await fetch('/delete-queue-movie', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movieQueueID),
        });
        if (deleteResponse.ok) {
          const newQueueMovies = await deleteResponse.json();
          const queueMovieSection = document.querySelector('#queue-movies-section');
          let newQueueMoviesHTML = '';
          newQueueMovies.forEach((element) => {
            newQueueMoviesHTML += `
                  <li class="queue-movie">
                    <div class="queue-movie-parameters">
                      <ul>
                        <li>Movie send by: ${element.userName}</li>
                        <li>${element.movie_title}</li>
                        <li>${element.movie_release}</li>
                        <li>${element.movie_description}</li>
                        <li><a href="${element.movie_imagePath}" target="_blank" >Image-url</a></li>
                        <li>${element.link_language}</li>
                        <li>${element.link_quality}</li>
                        <li>${element.link_source}</li>
                        <li><a href="${element.link_url}" target="_blank" >Link-url</a></li>
                        <li>${element.category}</li>
                      </ul>
                      <button class="accept-queue-movie-btn"
                          data-user-name="${element.userName}"
                          data-movie-queue-id="${element.movie_queueID}"
                          data-title="${element.movie_title}"
                          data-release="${element.movie_release}"
                          data-description="${element.movie_description}"
                          data-imagepath="${element.movie_imagePath}"
                          data-language="${element.link_language}"
                          data-quality="${element.link_quality}"
                          data-source="${element.link_source}"
                          data-link="${element.link_url}"
                          data-category="${element.category}"
                      >Accept</button>
                      <button class="reject-queue-movie-btn" data-movie-queue-id="${element.movie_queueID}">Reject</button>
                    </div>
                  </li>
                  `;
          });
          queueMovieSection.innerHTML = newQueueMoviesHTML;
          initRejecttBtn();
          initAcceptBtn();
        }
      } catch (error) {
        console.log(error, 'An error occured during the request.');
      }
    });
  });
}

window.addEventListener('load', () => {
  initAcceptBtn();
  initRejecttBtn();
});
