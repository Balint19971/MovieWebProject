/* This code initializes a delete button for movies. When the button is clicked,
 it asks for confirmation to delete a movie. If confirmed, it sends a DELETE
  request to the server to delete the movie. If successful, it redirects to
   the "/movies" page; otherwise, it displays an error message. */
function initDeleteMovieBtn() {
  const deleteMovieBtn = document.querySelector('#delete-movie-btn');
  if (!deleteMovieBtn) {
    return;
  }
  deleteMovieBtn.addEventListener('click', async (event) => {
    if (confirm('Are you sure you want to delete the movie?')) {
      const movieID = event.target.dataset.id;
      try {
        const response = await fetch(`/delete/${movieID}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          document.querySelector('#delete-movie-btn').style.display = 'none';
          document.querySelector('#delete-message').innerHTML = 'Nincs jogod torolni';
          document.querySelector('#delete-message').style.display = 'block';
        } else {
          window.location.href = '/movies';
        }
      } catch (error) {
        console.log('Hiba történt:', error);
      }
    }
  });
}
/* This code initializes a delete button for comments. When the button is clicked,
 it sends a DELETE request to the server to delete a comment associated with a
  specific movie. If successful, it redirects to the movie's page; otherwise,
   it logs an error message. */
function initDeleteCommentBtn() {
  const deleteCommentBtn = document.querySelector('#delete-comment-btn');
  if (!deleteCommentBtn) {
    return;
  }
  deleteCommentBtn.addEventListener('click', async () => {
    const dataFromDeleteBtn = {
      movieID: deleteCommentBtn.dataset.movieId,
      userName: deleteCommentBtn.dataset.username,
    };

    try {
      const response = await fetch('/delete-comment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataFromDeleteBtn),
      });
      if (response.ok) {
        window.location.href = `/movie/${dataFromDeleteBtn.movieID}`;
      } else {
        console.log('can t delete comment');
      }
    } catch (error) {
      console.log(error);
    }
  });
}
/* This code initializes a submit button for comments. When the button is clicked,
 it sends a POST request to the server to add a new comment to a movie. If successful,
  it hides the comment form and displays the updated comments on the page.
   If there is an error, it logs the error message. */
function initSubmitCommentBtn() {
  const submitCommentBtn = document.querySelector('#submit-comment-btn');
  if (!submitCommentBtn) {
    return;
  }
  submitCommentBtn.addEventListener('click', async () => {
    const commentParams = {
      movieID: document.querySelector('#movieID').value,
      comment: document.querySelector('#comment').value,
    };
    try {
      const response = await fetch('/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentParams),
      });

      const newComments = await response.json();
      const commentForm = document.querySelector('#comment-form');
      const commentSection = document.querySelector('#comment-section');
      const oldComments = document.querySelectorAll('.comment');
      commentForm.style.display = 'none';
      submitCommentBtn.style.display = 'none';
      oldComments.forEach((comment) => {
        comment.style.display = 'none';
      });
      let newCommentsHTML = '';
      newComments.forEach((element) => {
        newCommentsHTML += `
          <li class="comment">
          <strong>${element.userName}</strong> : 
          <p>${element.comment}</p>
          </li>
          `;
      });
      commentSection.innerHTML = newCommentsHTML;
    } catch (error) {
      console.log(error);
    }
  });
}
/* This code initializes a button for adding a new link to a movie. When the button is clicked,
 it toggles the display of an "Add new link" form. If the form is not visible,
  clicking the button displays it, and if the form is visible, clicking the button hides it. */
function intiAddLinkBtn() {
  const addLinkBtn = document.querySelector('#add-link-btn');
  if (!addLinkBtn) {
    return;
  }
  let clicked = false;
  addLinkBtn.addEventListener('click', () => {
    const addLinkForm = document.querySelector('#add-new-link-form');
    if (!clicked) {
      clicked = true;
      addLinkBtn.innerHTML = 'Close';
      addLinkForm.style.display = 'block';
    } else {
      clicked = false;
      addLinkBtn.innerHTML = 'Add new link';
      addLinkForm.style.display = 'none';
    }
  });
}
/* This code initializes a form for sending a new link to a movie. When the form is submitted,
 it prevents the default form submission behavior, collects data from the form fields,
  sends a POST request to a server endpoint (/link-moderation-queue) with the data in JSON format,
   and displays a success or error message based on the response from the server. */
function handleLinkFormSubmit() {
  const addNewLinkForm = document.querySelector('#add-new-link-form');
  if (!addNewLinkForm) {
    return;
  }
  addNewLinkForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newLinkFormContent = {
      movieID: event.target.movieID.value,
      language: document.querySelector('#new-language').value,
      quality: document.querySelector('#new-quality').value,
      source: document.querySelector('#new-source').value,
      link: document.querySelector('#new-link').value,
    };

    const response = await fetch('/link-moderation-queue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLinkFormContent),
    });
    if (response.ok) {
      document.querySelector('#add-link-result-response').innerHTML = 'We have sent the link succesfully';
    } else {
      document.querySelector('#add-link-result-response').innerHTML = 'We have sent the link unsuccesfully';
    }
  });
}
/* This code handles the removal of movie links. It attaches a click event listener
 to buttons with the class "remove-link-btn" to delete links associated with movies.
  When a button is clicked, it extracts link information from the dataset and sends
   a DELETE request to the server. If successful, it updates the links table in the HTML. */
function initRemoveLinkBtn() {
  const removeLinkBtns = document.querySelectorAll('.remove-link-btn');
  if (!removeLinkBtns) {
    return;
  }
  removeLinkBtns.forEach((removeLinkBtn) => {
    removeLinkBtn.addEventListener('click', async (event) => {
      const datasetParams = event.target.dataset;
      const removeBtnParams = {
        movieID: datasetParams.movieId,
        linkID: datasetParams.linkId,
        link_language: datasetParams.language,
        link_quality: datasetParams.quality,
        link_source: datasetParams.source,
        link_url: datasetParams.link,
      };
      try {
        const deleteResponse = await fetch('/remove-link', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(removeBtnParams),
        });
        if (deleteResponse.ok) {
          const updatedLinks = await deleteResponse.json();
          const movieLinksTable = document.querySelector('#movie-links-table');
          let newMovieLinksTableHTML = `
            <tr class="movie-link-header">
                <th>Delete</th>
                <th>Language</th>
                <th>Quality</th>
                <th>Source</th>
                <th>Link</th>
            </tr>
            `;
          updatedLinks.forEach((updatedLink) => {
            newMovieLinksTableHTML += `
          <tr class="movie-link">
                <td>
                    <button class="remove-link-btn"
                     data-movie-id="${updatedLink.movieID}"
                     data-link-id="${updatedLink.linkID}"
                     data-language="${updatedLink.link_language}"
                     data-quality="${updatedLink.link_quality}"
                     data-source="${updatedLink.link_source}"
                     data-link="${updatedLink.link_url}"
                     >
                    Remove</button></td>
                <td data-cell="language">${updatedLink.link_language}</td>
                <td data-cell="quality">${updatedLink.link_quality}</td>
                <td data-cell="source">${updatedLink.link_source}</td>
                <td data-cell="link"><a href="${updatedLink.link_url}" target="_blank"><button>Watch</button></a></td>
            </tr>
            `;
          });
          movieLinksTable.innerHTML = newMovieLinksTableHTML;
          initRemoveLinkBtn();
        } else {
          console.log('The deleteResponse is not ok.');
        }
      } catch (error) {
        console.log(error, 'An error occured during the request.');
      }
    });
  });
}

window.addEventListener('load', () => {
  initDeleteMovieBtn();
  initDeleteCommentBtn();
  initSubmitCommentBtn();
  intiAddLinkBtn();
  handleLinkFormSubmit();
  initRemoveLinkBtn();
});
