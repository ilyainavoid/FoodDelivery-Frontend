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

		if (rating.classList.contains('rating-set')) {
			setRating(rating);
		}
	}

	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.rating-active');
		ratingValue = rating.querySelector('.rating-value')
	}

	function setRatingActiveWidth(index = ratingValue.innerHTML) {
		const ratingActiveWidth = index / 0.1;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}

	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.rating-item');
		for (let i = 0; i < ratingItems.length; i++) {
			const ratingItem = ratingItems[i];
			ratingItem.addEventListener('mouseenter', function (e) {
				initRatingVars(rating);
				setRatingActiveWidth(ratingItem.value);
			});
			ratingItem.addEventListener('mouseleave', function (e) {
				setRatingActiveWidth();
			});
			ratingItem.addEventListener('click', function (e) {
				initRatingVars(rating);
				ratingValue.innerHTML = i + 1;
				setRatingActiveWidth();
				ratingCheck(ratingValue.innerHTML)
			});
		}
	}
}

async function ratingCheck(value) {
	const token = getToken("userToken")
	console.log(token)
	await fetch(`https://food-delivery.kreosoft.ru/api/dish/${dishId}/rating/check`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	}).then((response) => {
		if(response['ok']) {
			setRating(value);
		}
	});
}

async function setRating(value) {
	await fetch(`https://food-delivery.kreosoft.ru/api/dish/${dishId}/rating?ratingScore=${value}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	})
	.then((response) => {
		console.log(response);
	})
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
	fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		}).then((response) => {
			return response.json();
		}).then((data) => {
			if(localStorage.getItem('authorizedStatus') != 0) {
				document.querySelector('.profile-link').text = data['email'];
			}
		})

	checkAuth().then(() => {
		if(localStorage.getItem('authorizedStatus') != 0) {
			document.querySelector('.header-top-authorized').classList.remove("d-none");
		} else {
			document.querySelector('.header-top-unauthorized').classList.remove("d-none");
			document.querySelector('.rating').classList.remove("rating-set")
		}
	})
	refreshCart();
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