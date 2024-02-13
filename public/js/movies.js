/* This code toggles the display of a dropdown menu (with the class "main-dropdown-menu")
 when a button (with the class "main-dropdown-menu-btn") is clicked. It uses the "flex"
  display style to show or hide the menu. */
window.addEventListener('load', () => {
  const filterBtn = document.querySelector('.main-dropdown-menu-btn');
  const dropdownMenu = document.querySelector('.main-dropdown-menu');

  filterBtn.addEventListener('click', () => {
    if (dropdownMenu.style.display === 'none') {
      dropdownMenu.style.display = 'flex';
    } else {
      dropdownMenu.style.display = 'none';
    }
  });
});
