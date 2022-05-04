
const form = document.querySelector('.js-form');
form.addEventListener('submit', handleSubmit);
const nextBtn = document.querySelector('.js-next');
const prevBtn = document.querySelector('.js-prev');
let resultStats = document.querySelector('.js-result-stats');
const spinner = document.querySelector('.js-spinner');
const first_foto = document.querySelector('.first_foto')

let totalResults;
let currentPage = 1;
let searchQuery;

const apiKey = "LE7K4oYWwLzz4LMEPKfTezW-G8mObIzaEAngYKxUaSM";

function handleSubmit(event) {
    event.preventDefault();
    currentPage = 1;
    const inputValue = document.querySelector('.js-search-input').value;
    searchQuery = inputValue.trim();
    fetchResults(searchQuery);
}

async function searchUnsplash(searchQuery) {
    const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=30&page=${currentPage}&client_id=${apiKey}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
       throw Error(res.statusText);
    }
    const json = await res.json();
    return json;
}

function displayResults(json) {
    const searchResults = document.querySelector('.search-results');
    searchResults.textContent = '';
    json.results.forEach(result => {
    const url = result.urls.small;
    const unsplashLink = result.links.html;
    const photographer = result.user.name;
    const photographerPage = result.user.links.html;
    searchResults.insertAdjacentHTML(
    'beforeend', 
                `<div>
                    <a href = "${unsplashLink}" target = "_blank">
                        <div class = "result-item" style = "background-image: url(${url});" ></div>
                    </a>
                    <p class = "photographer-name">
                        <a href = "${photographerPage}" target = "_blank" style = "color: white; text-decoration: none;">Photo by ${photographer}</a>
                    </p>
                </div>`
);	
});
    totalResults = json.total;
    resultStats.textContent = `about ${totalResults} results found`;
    first_foto.style.display = 'none'
    if (totalResults === 0) {
        searchResults.insertAdjacentHTML(
            'beforeend', 
                        `<div>
                        <div class = "notFound"></div>
                        </div>`
        );	

    }
};


function pagination(totalPages) {
    nextBtn.classList.remove('hidden');
    if (currentPage >= totalPages) {
    nextBtn.classList.add('hidden');
    }
    prevBtn.classList.add('hidden');
    if (currentPage !== 1) {
    prevBtn.classList.remove('hidden');
    }
};

async function fetchResults(searchQuery) {
    spinner.classList.remove('hidden');
    try {
    const results = await searchUnsplash(searchQuery);
    pagination(results.total_pages);
    displayResults(results);
    } catch(err) {
    console.log(err);
    alert('Failed to search Unsplash');
    }
    spinner.classList.add('hidden');
}; 


nextBtn.addEventListener('click', () => {
    currentPage += 1;
    fetchResults(searchQuery);
});

prevBtn.addEventListener('click', () => {
    currentPage -= 1;
    fetchResults(searchQuery);
});

