const dishListEndpoint = "https://food-delivery.kreosoft.ru/api/dish"

const controls = document.querySelector(".menu-control");
const applyButton = document.getElementById("apply-button");
const navigation = document.getElementById("pagination");

let lastQuery = dishListEndpoint;
let pagesCount = 4;
let currentPage = 1;

function setRatings() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}

	function initRatings() {
		let ratingActive, ratingValue;
		for(let i = 0; i < ratings.length; i++) {
			const rating = ratings[i];
			initRating(rating);
		}
	}	

	function initRating(rating) {
		initRatingVars(rating);
		setRatingActiveWidth();
	}

	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.rating-active');
		ratingValue = rating.querySelector('.rating-value')
	}

	function setRatingActiveWidth(index = ratingValue.innerHTML) {
		const ratingActiveWidth = index / 0.1;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}
}

function preparePagination(pagination) {
	pagesCount = pagination['count'];
	currentPage = pagination['current'];

	const paginationBar = document.getElementById("pagination");
	paginationBar.innerHTML = '';
	for (let i = 1; i <= pagesCount; i++) {
		if (currentPage == i) {
			paginationBar.innerHTML += `<li class="page-item active"><a class="page-link" href="">${i}</a></li>`
		}
		else {
			paginationBar.innerHTML += `<li class="page-item"><a class="page-link" href="">${i}</a></li>`
		}
	}
	const listItems = paginationBar.querySelectorAll("li")
	listItems.forEach(item => {
		const link = item.querySelector('a');
		link.addEventListener('click', function (event) {
			event.preventDefault();
			const aimPage = link.textContent;
			changePage(aimPage);
		})
	});
}

function buildMenu(dishList) {
	const currentPageDishesList = dishList['dishes']
	const pagination = dishList['pagination']

	preparePagination(pagination);

	for (let i = 0; i < currentPageDishesList.length; i++) {
		console.log(currentPageDishesList[i])
		const dish = {
			name: currentPageDishesList[i]['name'],
			category: currentPageDishesList[i]['category'],
			id: currentPageDishesList[i]['id'],
			description: currentPageDishesList[i]['description'],
			image: currentPageDishesList[i]['image'],
			price: currentPageDishesList[i]['price'],
			rating: currentPageDishesList[i]['rating'],
			vegetarian: currentPageDishesList[i]['vegetarian']
		};
		createMenuItem(dish)
	}

	const cards = document.querySelectorAll('.menu-item');
	cards.forEach(card => {
		card.addEventListener('click', (e) => {
			e.preventDefault();
			localStorage.setItem('dishId', card.id);
			window.location.href="position-in-menu.html";
		})
	})

	setRatings();
}

function createMenuItem(dish) {
	let rating;
	let vegetarianIdicator = `<i class="fa-solid fa-leaf fa isVeg"></i>`;
	if (dish['rating']) {
		rating = dish['rating'].toFixed(1);
	}
	else {
		rating = 0;
	}

	if (!dish['vegetarian']) {
		vegetarianIdicator = ' ';
	}

	var item =
	`
		<div class="col-xl-3 d-flex">
			<div class="menu-item flex-wrap rounded-2 m-2 p-2" id=${dish['id']}>
				
					<div class="menu-item-image-place">
						<img src="${dish['image']}" alt="" class="menu-item-image">
						${vegetarianIdicator}
					</div>
					<h5 class="menu-item-name">${dish['name']}</h5>
					<h6 class="menu-item-category">Категория: ${dish['category']}</h6>
					<div class="rating p-1 d-flex align-items-center justify-content-center mb-2">
						<div class="rating-body">
							<div class="rating-active">
								<div class="rating-items">
									<input type="radio" class="rating-item" value ="1" name="rating">
									<input type="radio" class="rating-item" value ="2" name="rating">
									<input type="radio" class="rating-item" value ="3" name="rating">
									<input type="radio" class="rating-item" value ="4" name="rating">
									<input type="radio" class="rating-item" value ="5" name="rating">
									<input type="radio" class="rating-item" value ="6" name="rating">
									<input type="radio" class="rating-item" value ="7" name="rating">
									<input type="radio" class="rating-item" value ="8" name="rating">
									<input type="radio" class="rating-item" value ="9" name="rating">
									<input type="radio" class="rating-item" value ="10" name="rating">
								</div>
							</div>
						</div>
						<div class="rating-value">
							${rating}
						</div>
					</div>
					<p class="menu-item-desc">${dish['description']}</p>
					<div class="price-and-order rounded p-2 d-flex align-items-center flex-lg-row justify-content-between">
						<div class="pricetag d-flex align-items-center flex-lg-row">
							<i class="fa-solid fa-coins fa me-1"></i>
							<h6 class="price">Цена: ${dish['price']} руб.</h6>
						</div>
						<button class="btn btn-outline-dark order-button">Заказать</button>
					</div>
				
			</div>
		</div>
	`
	
	document.getElementById('for-items').innerHTML += item;
}

function createQuery(selectedCategories, selectedSort, isVegetarian) {
	let query = "https://food-delivery.kreosoft.ru/api/dish?"
	console.log(selectedCategories);
	if(selectedCategories.length != 0) {
		selectedCategories.forEach(category => {
			query += `${category}&`;
		});
	}
	console.log(isVegetarian);
	if (isVegetarian) {
		query += "vegetarian=true&"
	} else {
		query += "vegetarian=false&"
	}
	console.log(selectedSort);
	if(selectedSort) {
		query += `${selectedSort}&`
	}
	return query;
}

function changePage(nextPage) {
	clearMenu();
 	currentPage = nextPage;
	fetch(`${lastQuery}page=${currentPage}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})
	.then(response => response.json())
	.then(data => {
		buildMenu(data);
	})
}

function recreateMenu(selectedCategories, selectedSort, isVegetarian) {
	clearMenu();
	lastQuery = createQuery(selectedCategories, selectedSort, isVegetarian);
	fetch(`${lastQuery}page=${currentPage}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})
	.then(response => response.json())
	.then(data => {
		buildMenu(data);
	})
}

function clearMenu() {
	document.getElementById('for-items').innerHTML = '';
}

applyButton.addEventListener('click', () => {
	const categoriesSelect = document.getElementById('categories-select');
	const sortSelect = document.getElementById('sort-select');
	const isVegetarianCheck = document.getElementById('isVegetarian');

	var selectedCategories = [];
	for(let i = 0; i < categoriesSelect.options.length; i++) {
		if (categoriesSelect.options[i].selected) {
			selectedCategories.push(categoriesSelect.options[i].value);
		}
	}

	var selectedSort = sortSelect.value;
	var isVegetarian;
	if (isVegetarianCheck.checked) {
		isVegetarian=true;
	}
	else {
		isVegetarian=false;
	}

	console.log(selectedCategories);
	console.log(selectedSort);
	console.log(isVegetarian);

	recreateMenu(selectedCategories, selectedSort, isVegetarian);
})

document.addEventListener('DOMContentLoaded', function () {
	fetch('https://food-delivery.kreosoft.ru/api/dish?vegetarian=false&page=1', {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})
	.then(response => response.json())
	.then(data => {
		lastQuery = 'https://food-delivery.kreosoft.ru/api/dish?vegetarian=false&';
		buildMenu(data);
	})
});