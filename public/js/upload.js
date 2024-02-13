/* This function handles form submissions, sending data to a specified URL
 via a POST request. It updates the uploadStatusText element to display
  success or failure messages based on the response status and the dataset
   of the submit button. */
function initUploadFormSumbit() {
  const form = document.getElementById('upload-form');
  const uploadStatusText = document.querySelector('#upload-status-text');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formInputs = {
      title: document.querySelector('#title').value,
      release: document.querySelector('#release').value,
      description: document.querySelector('#description').value,
      imagePath: document.querySelector('#imagePath').value,
      language: document.querySelector('#language').value,
      quality: document.querySelector('#quality').value,
      source: document.querySelector('#source').value,
      link: document.querySelector('#link').value,
      category: document.querySelector('#category').value,
    };

    const { action } = event.submitter.dataset;
    const submitBtn = event.submitter.dataset.number;
    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formInputs),
      });

      if (response.status === 200) {
        if (Number(submitBtn) === 1) {
          uploadStatusText.innerHTML = 'succesful upload';
        } else if (Number(submitBtn) === 2) {
          uploadStatusText.innerHTML = 'We send the upload request';
        }
      } else if (Number(submitBtn) === 1) {
        uploadStatusText.innerHTML = 'unsuccesful upload';
      } else if (Number(submitBtn) === 2) {
        uploadStatusText.innerHTML = 'Upload sending faild try with other parameters';
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  });
}

window.addEventListener('load', () => {
  initUploadFormSumbit();
});
