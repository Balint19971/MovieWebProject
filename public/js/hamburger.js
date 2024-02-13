/* This code controls the display of a navigation dropdown menu based on the state of
 a checkbox element with the ID "hamburger-checkbox." When the checkbox is checked,
  it sets the dropdown menu to be displayed, and when unchecked, it hides the menu. */
window.addEventListener('load', () => {
  const hamburgerCheckbox = document.getElementById('hamburger-checkbox');
  const dropdownMenu = document.querySelector('.nav-dropdown-menu');
  hamburgerCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      dropdownMenu.style.display = 'inline';
    } else {
      dropdownMenu.style.display = 'none';
    }
  });
});
