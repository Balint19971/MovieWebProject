/* This function listens for clicks on buttons with the class "add-link-to-movie-btn."
 When clicked, it performs two actions: it adds a link to a movie and removes the link
  from the queue. Afterward, it updates the displayed queue based on these actions. */
function initAddBtnFromQueueLinks() {
  const addLinkToMovieBtns = document.querySelectorAll('.add-link-to-movie-btn');

  addLinkToMovieBtns.forEach((addLinkToMovieBtn) => {
    addLinkToMovieBtn.addEventListener('click', async (event) => {
      const datasetParams = event.target.dataset;
      const dataFromAddBtn = {
        linkID: datasetParams.linkId,
        movieID: datasetParams.movieId,
        link_language: datasetParams.language,
        link_quality: datasetParams.quality,
        link_source: datasetParams.source,
        link_url: datasetParams.url,
      };
      const addResponse = await fetch('/add-link-to-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataFromAddBtn),
      });
      if (addResponse.ok) {
        const deleteResponse = await fetch('/delete-queue-link', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataFromAddBtn),
        });
        if (deleteResponse.ok) {
          const newLinkQueues = await deleteResponse.json();
          const queueLinkRow = document.querySelector('#moderation-queue-link-table');
          let newLinkQueueHTML = `<tr>
                                  <th></th>
                                  <th>AddedBy</th>
                                  <th>MovieName</th>
                                  <th>Language</th>
                                  <th>Quality</th>
                                  <th>Source</th>
                                  <th>Link</th>
                                  </tr>`;
          newLinkQueues.forEach((newLinkQueue) => {
            newLinkQueueHTML += `
             <tr>
               <td>
                 <button class="add-link-to-movie-btn"
                     data-link-id="${newLinkQueue.link_queueID}"
                     data-movie-id="${newLinkQueue.movieID}"
                     data-title="${newLinkQueue.movie_title}"
                     data-language="${newLinkQueue.link_language}"
                     data-quality="${newLinkQueue.link_quality}"
                     data-source="${newLinkQueue.link_source}"
                     data-url="${newLinkQueue.link_url}">   
                 Add</button>
                 <button class="remove-link-to-movie-btn"
                     data-link-id="${newLinkQueue.link_queueID}"
                     data-movie-id="${newLinkQueue.movieID}"
                     data-title="${newLinkQueue.movie_title}"
                     data-language="${newLinkQueue.link_language}"
                     data-quality="${newLinkQueue.link_quality}"
                     data-source="${newLinkQueue.link_source}"
                     data-url="${newLinkQueue.link_url}">
                 Remove</button>
               </td>
               <td>${newLinkQueue.userName}</td>
               <td>${newLinkQueue.movie_title}</td>
               <td>${newLinkQueue.link_language}</td>
               <td>${newLinkQueue.link_quality}</td>
               <td>${newLinkQueue.link_source}</td>
               <td><a href="${newLinkQueue.link_url}">watch</a></td>
             </tr>`;
          });
          queueLinkRow.innerHTML = newLinkQueueHTML;
          initAddBtnFromQueueLinks();
          initRemoveBtnFromQueueLinks();
        }
      }
    });
  });
}
/* This function handles the removal of links from a queue. It listens for clicks
 on buttons with the class "remove-link-to-movie-btn." When clicked, it sends a
  request to delete the link from the queue. After successfully removing the link,
   it updates the displayed queue. */
function initRemoveBtnFromQueueLinks() {
  const removeLinkBtns = document.querySelectorAll('.remove-link-to-movie-btn');

  removeLinkBtns.forEach((removeLinkBtn) => {
    removeLinkBtn.addEventListener('click', async (event) => {
      const datasetParams = event.target.dataset;
      const dataFromRemoveBtn = {
        linkID: datasetParams.linkId,
        movieID: datasetParams.movieId,
        link_language: datasetParams.language,
        link_quality: datasetParams.quality,
        link_source: datasetParams.source,
        link_url: datasetParams.url,
      };
      const deleteResponse = await fetch('/delete-queue-link', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataFromRemoveBtn),
      });
      if (deleteResponse.ok) {
        const newLinkQueues = await deleteResponse.json();
        const queueLinkTable = document.querySelector('#moderation-queue-link-table');
        let newLinkQueueHTML = `
              <tr>
              <th></th>
              <th>AddedBy</th>
              <th>MovieName</th>
              <th>Language</th>
              <th>Quality</th>
              <th>Source</th>
              <th>Link</th>
              </tr>
            `;
        newLinkQueues.forEach((newLinkQueue) => {
          newLinkQueueHTML += `
              <tr>
                <td>
                  <button class="add-link-to-movie-btn"
                      data-link-id="${newLinkQueue.link_queueID}"
                      data-movie-id="${newLinkQueue.movieID}"
                      data-title="${newLinkQueue.movie_title}"
                      data-language="${newLinkQueue.link_language}"
                      data-quality="${newLinkQueue.link_quality}"
                      data-source="${newLinkQueue.link_source}"
                      data-url="${newLinkQueue.link_url}">   
                  Add</button>
                  <button class="remove-link-to-movie-btn"
                      data-link-id="${newLinkQueue.link_queueID}"
                      data-movie-id="${newLinkQueue.movieID}"
                      data-title="${newLinkQueue.movie_title}"
                      data-language="${newLinkQueue.link_language}"
                      data-quality="${newLinkQueue.link_quality}"
                      data-source="${newLinkQueue.link_source}"
                      data-url="${newLinkQueue.link_url}">
                  Remove</button>
                </td>
                <td>${newLinkQueue.userName}</td>
                <td>${newLinkQueue.movie_title}</td>
                <td>${newLinkQueue.link_language}</td>
                <td>${newLinkQueue.link_quality}</td>
                <td>${newLinkQueue.link_source}</td>
                <td><a href="${newLinkQueue.link_url}">watch</a></td>
              </tr>`;
        });
        queueLinkTable.innerHTML = newLinkQueueHTML;
        initRemoveBtnFromQueueLinks();
        initAddBtnFromQueueLinks();
      }
    });
  });
}

window.addEventListener('load', () => {
  initAddBtnFromQueueLinks();
  initRemoveBtnFromQueueLinks();
});
