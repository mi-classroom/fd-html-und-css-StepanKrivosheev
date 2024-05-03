'use strict';
const articleListUrl =
	'https://gist.githubusercontent.com/vschaefer/8d26be957bbc8607f60da5dd1b251a78/raw/49ddd7c2636fb722912d91107aff55c79ddf05a8/articles.json';

document.addEventListener('DOMContentLoaded', initArticlelist);
let curentData = null;

function initArticlelist() {
	const responePromise = fetch(articleListUrl);
	responePromise.then(function (respone) {
		const dataPromise = respone.json();
		dataPromise.then(function (data) {
			renderArticleList(data.articles);
			curentData = data;
			initFilters();
		});
	});
}

function filterArticles(filterValue) {
	const filteredArticles = curentData.articles.filter(function (article) {
		return article.tags.keywords.includes(filterValue);
	});
	console.log(filteredArticles + '======' + filterValue);
	return filteredArticles;
}

function initFilters() {
	const filterButtons = document.querySelectorAll(
		'[data-js-category="keywords"]'
	);

	const keywords = curentData.articles
		.map(function (articles) {
			return articles.tags.keywords;
		})
		.flat();

	const uniqueKeywords = keywords.filter((item, index) => {
		return keywords.indexOf(item) === index;
	});
	console.log(uniqueKeywords);

	filterButtons.innerHTML = uniqueKeywords
		.map(function (keywords) {
			return `<li><button class="button button-primary" data-js-filter>
                        ${keywords}</button>
                    </li> `;
		})
		.join('');
        
	filterButtons.forEach(function (button) {
		button.addEventListener('click', function (event) {
			const filter = event.currentTarget.textContent;
			const filteredArticles = filterArticles(filter);
			renderArticleList(filteredArticles);
		});
	});
	
}

// function renderFiltersKeywords(article){

//     const filterElements = document.querySelector('[data-js-category="keywords"]' )
//     const filters = article.map(function (article) {
//         return `<li><button class="button button-primary" data-js-filter>
//                     ${article.tags.keywords.map((tag) => `${tag}`).join('')}</button>
//                 </li>`
//     }).join('')

//     filterElements.innerHTML = filters
// }

function renderArticleList(articles) {
	const articleListElements = document.querySelector(
		'[data-js-generate-articlelist]'
	);

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
													.map((tag) => `<li>${tag}</li>`)
													.join('')}
                        ${article.tags.keywords
													.map((tag) => `<li>${tag}</li>`)
													.join('')}
                        ${article.tags.modules
													.map((tag) => `<li>${tag}</li>`)
													.join('')}
                        ${article.tags.fileFormat
													.map((tag) => `<li>${tag}</li>`)
													.join('')}
                        
                        </ul>
                    </figure>
                </li>`;
		})
		.join('');

	articleListElements.innerHTML = card;
}
