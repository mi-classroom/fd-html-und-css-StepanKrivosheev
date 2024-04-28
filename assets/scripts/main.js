const menuButton = document.querySelector('[data-js-menu-button]');
const closeButton = document.querySelector('[data-js-close-button]');
const menu = document.querySelector('[data-js-menu]');
const tabs = document.querySelectorAll('[data-js-tab]');
const area = document.querySelectorAll('[data-js-area]');

tabs[0].classList.toggle('is-active');
area[0].classList.toggle('is-active');
var activeTab = tabs[0];
var activeArea = area[0];

menuButton.addEventListener('click', function () {
  menu.classList.toggle('is-active');
  menuButton.classList.toggle('is-active');
  if (menuButton.classList.contains('is-active')) {
    menuButton.textContent = 'close';
  } else {
    menuButton.textContent = 'menu';
  }
});

tabs.forEach((tab, i) => {
  tab.addEventListener('click', function () {
    if (!tab.classList.contains('is-active')) {
      area[i].classList.toggle('is-active');
      tab.classList.toggle('is-active');
      activeTab.classList.remove('is-active');
      activeArea.classList.remove('is-active');
      activeArea = area[i];
      activeTab = tab;
    }
  });
});
