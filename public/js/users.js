/* This function initializes change role buttons. When a button is clicked,
 it sends a PUT request to the '/change-role' endpoint to change the user's
  role based on the selected value from a dropdown menu. If the request is
   successful, it reloads the '/users' page. */
function initChangeRoleBtn() {
  const changeRoleBtns = document.querySelectorAll('.change-role-btn');

  changeRoleBtns.forEach((changeRoleBtn) => {
    changeRoleBtn.addEventListener('click', async (event) => {
      event.preventDefault();

      const selectElement = changeRoleBtn.nextElementSibling;
      const selectedRole = selectElement.value;
      const userID = changeRoleBtn.value;

      const userDetail = {
        userID,
        userRole: selectedRole,
      };

      try {
        const changeResponse = await fetch('/change-role', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDetail),
        });
        if (changeResponse.ok) {
          window.location.reload('/users');
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}
/* This function initializes delete user buttons. When a button is clicked,
 it displays a confirmation dialog to ensure the user wants to delete a specific user.
  If confirmed, it sends a DELETE request to the '/delete-user' endpoint with the user's
   ID for deletion. If the request is successful, it reloads the '/users' page. */
function intiDeleteUserBtn() {
  const deleteUserBtns = document.querySelectorAll('.delete-user-btn');

  deleteUserBtns.forEach((deleteUserBtn) => {
    deleteUserBtn.addEventListener('click', async () => {
      const { userName } = deleteUserBtn.dataset;
      const confirmation = confirm(`Are you sure you want to delete user: ${userName}?`);
      const userID = deleteUserBtn.value;
      const userDetail = {
        userID,
      };
      if (confirmation) {
        try {
          const deleteResponse = await fetch('/delete-user', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetail),
          });
          if (deleteResponse.ok) {
            window.location.reload('/users');
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  });
}

window.addEventListener('load', () => {
  initChangeRoleBtn();
  intiDeleteUserBtn();
});
