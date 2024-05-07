'use strict';
const articleListUrl =
  'https://gist.githubusercontent.com/vschaefer/8d26be957bbc8607f60da5dd1b251a78/raw/49ddd7c2636fb722912d91107aff55c79ddf05a8/articles.json';

document.addEventListener('DOMContentLoaded', initArticlelist);
let curentData = null;
let articles = null;
let filters = null;
let activeButtons = [];
let selectedFilter = [];
let activeTags = [];
let selectedTags = [];

function initArticlelist() {
  const responePromise = fetch(articleListUrl);
  responePromise.then(function (respone) {
    const dataPromise = respone.json();
    dataPromise.then(function (data) {
      articles = data.articles;
      filters = articles.map((article) => article.tags);
      let keywordsSet = new Set(filters.map((filter) => filter.keywords).flat());
      let projectphaseSet = new Set(filters.map((filter) => filter.projectphase).flat());
      let modulesSet = new Set(filters.map((filter) => filter.modules).flat());
      let fileFormatSet = new Set(filters.map((filter) => filter.fileFormat).flat());

      const uniqueFilters = {
        keywords: Array.from(keywordsSet),
        projectphase: Array.from(projectphaseSet),
        modules: Array.from(modulesSet),
        fileFormat: Array.from(fileFormatSet),
      };

      renderArticleList(articles);
      curentData = data;
      initFilters(uniqueFilters);
    });
  });
}

function filterArticles(selectedFilter) {
  let filteredArticles = curentData.articles.filter((article) => {
    return selectedFilter.some((filterValue) => {
      return (
        article.tags.keywords.includes(filterValue) ||
        article.tags.projectphase.includes(filterValue) ||
        article.tags.modules.includes(filterValue) ||
        article.tags.fileFormat.includes(filterValue)
      );
    });
  });
  return filteredArticles;
}

function initFilters(filters) {
  for (let i in filters) {
    let filterButtonsUL = document.querySelector(`[data-js-category="${i}"]`);
    filterButtonsUL.innerHTML = filters[i]
      .map(function (filter) {
        return `
              <li>
	  		  	    <button class="button button-primary" data-js-filter>${filter}</button>
              </li> `;
      })
      .join('');

    //wenn man auf data- html attribut zugreifen moechte geht das mit querySelector.dataset.name in camelCase
    //console.log(filterButtonsUL.dataset.jsCategory);
  }

  const filterButtons = document.querySelectorAll('[data-js-filter]');
  const filterButtonsClear = document.querySelectorAll('[data-js-clear-filter]');
  const filterButtonsApply = document.querySelectorAll('[data-js-apply-filter]');
  const articleTags = document.querySelectorAll('[data-js-article-tag]');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      if (!button.classList.contains('is-active')) {
        const filter = event.currentTarget.textContent;
        selectedFilter.push(filter);
        button.classList.toggle('is-active');

        articleTags.forEach((tag) => {
          if (tag.textContent === filter) {
            tag.classList.add('is-active');
            activeTags.push(tag);
          }
        });

        activeButtons.push(button);
      } else {
        button.classList.remove('is-active');
        articleTags.forEach((tag) => {
          activeTags.forEach((tag) => {
            if (tag.textContent === event.currentTarget.textContent)
              console.log(tag.textContent + '  ==  ' + event.currentTarget.textContent);
            console.log(activeTags);
            tag.classList.remove('is-active');
          });
        });
        selectedFilter = selectedFilter.filter((filter) => filter !== button.textContent);
      }
    });
  });

  filterButtonsClear.forEach(function (button) {
    button.addEventListener('click', function (event) {
      activeButtons.forEach(function (button) {
        button.classList.remove('is-active');
      });
      activeButtons = [];
      selectedFilter = [];
      activeTags = [];
      renderArticleList(articles);
    });
  });

  filterButtonsApply.forEach(function (button) {
    button.addEventListener('click', function (event) {
      if (selectedFilter.length === 0) {
        renderArticleList(articles);
      } else {
        const filteredArticles = filterArticles(selectedFilter);
        renderArticleList(filteredArticles);
        activeTags.forEach((tag) => tag.classList.add('is-active'));
      }
    });
  });
}

function renderArticleList(articles) {
  const articleListElements = document.querySelector('[data-js-generate-articlelist]');

  const card = articles
    .map(function (article) {
      return `<li>
                    <figure>
                        <img src="./images/${
                          article.teaserImg
                        }" alt="${article.teaserImg.toString()}">
                        <h3>
                            ${article.title}
                        </h3>
                        <address>${article.author}</address>
                        <ul class="tag-list">
                        ${article.tags.projectphase
                          .map((tag) => `<li data-js-article-tag>${tag}</li>`)
                          .join('')}
                        ${article.tags.keywords
                          .map((tag) => `<li data-js-article-tag>${tag}</li>`)
                          .join('')}
                        ${article.tags.modules
                          .map((tag) => `<li data-js-article-tag>${tag}</li>`)
                          .join('')}
                        ${article.tags.fileFormat
                          .map((tag) => `<li data-js-article-tag>${tag}</li>`)
                          .join('')}
                        </ul>
                    </figure>
                </li>`;
    })
    .join('');

  articleListElements.innerHTML = card;
}
