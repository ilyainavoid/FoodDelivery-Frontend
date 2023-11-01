const dishId = localStorage.getItem('dishId');
console.log(dishId)

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

function editCard(dish) {
	const name = dish['name'];
	const category = dish['category'];
	const description = dish['description'];
	const image = dish['image'];
	const price = dish['price'];
	const vegetarian = dish['vegetarian'];

	const dishName = document.getElementById('name');
	const dishImage = document.getElementById('image');
	const vegIndicator = document.getElementById('veg');
	const dishCategory = document.getElementById('category');
	const vegLabel = document.getElementById('isVeg');
	const dishDescription = document.getElementById('desc');
	const dishPrice = document.getElementById('price');
	const ratingScale = document.querySelector('.rating-value')

	if (dish['rating']) {
		ratingScale.textContent = dish['rating'].toFixed(1);
	} else {
		ratingScale.textContent = 0;
	}

	dishName.textContent = name;
	dishImage.setAttribute('src', image);
	dishCategory.textContent = `Категория: ${category}`;
	dishDescription.textContent = description;
	dishPrice.textContent = `Цена: ${price} руб.`;

	if (vegetarian) {
		vegLabel.textContent = `Вегетарианское: Да`;
	} else {
		vegIndicator.remove('fa-solid fa-leaf fa isVeg');
		vegLabel.textContent =`Вегетарианское: Нет`;
	}


	setRatings();
}

document.addEventListener('DOMContentLoaded', function () {
	fetch(`https://food-delivery.kreosoft.ru/api/dish/${dishId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})
	.then(response => response.json())
	.then(data => {
		editCard(data);
	})
});