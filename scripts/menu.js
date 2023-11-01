const dishListEndpoint = "https://food-delivery.kreosoft.ru/api/dish"

const controls = document.querySelector(".menu-control");
const applyButton = document.getElementById("apply-button");

function buildMenu(dishList) {
	const currentPageDishesList = dishList['dishes']
	const pagination = dishList['pagination']

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
}

function createMenuItem(dish) {
	let rating;
	if (dish['rating']) {
		rating = dish['rating'].toFixed(1);
	}
	else {
		rating = 0;
	}

	var item =
	`
		<div class="col-xl-3 d-flex">
			<div class="menu-item flex-wrap justify-content-end rounded-2 m-2 p-2">
				<div class="menu-item-image-place">
					<img src="${dish['image']}" alt="" class="menu-item-image">
					<i class="fa-solid fa-leaf fa isVeg"></i>
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

applyButton.addEventListener('click', () => {
	const categoriesSelect = document.getElementById('categories-select');
	const sortSelect = document.getElementById('sort-select');
	const isVegetarianButton = document.getElementById('isVegetarian');

	var selectedCategories = [];
	for(let i = 0; i < categoriesSelect.options.length; i++) {
		if (categoriesSelect.options[i].selected) {
			selectedCategories.push(categoriesSelect.options[i].value);
		}
	}

	var selectedSort = sortSelect.value;
	var isVegetarian = isVegetarianButton.value;

	console.log(selectedCategories);
	console.log(selectedSort);
	console.log(isVegetarian);
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
		buildMenu(data);
	})
});