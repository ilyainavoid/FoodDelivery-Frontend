document.addEventListener('DOMContentLoaded', function () {
	initPage();
});

async function initPage() {
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

	await refreshCart();
	await fillUserData();
	await buildCartContent();

	const submitButton = document.querySelector('.submitbutton');
	const deliveryDateTimeInput = document.querySelector('#forTime');
	submitButton.addEventListener('click', (e) => {
		e.preventDefault();
		const checkoutTime = new Date();
		const deliveryTime = new Date(deliveryDateTimeInput.value);

		if (deliveryTime > (checkoutTime.setHours(checkoutTime.getHours() + 1))) {
			const addressSection = document.getElementById('address-section-main');
			const addressUnits = addressSection.querySelectorAll('select');
			const lastAddressUnit = document.getElementById(addressUnits.length);
			const lastAddressUnitGuid = JSON.parse(lastAddressUnit.value)['objectGuid'];

			const orderInfo = {
				"deliveryTime": `${deliveryDateTimeInput.value}`,
  			"addressId": lastAddressUnitGuid
			};

			fetch ('https://food-delivery.kreosoft.ru/api/order', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(orderInfo)
			})
		} else {
			alert("Время доставки должно быть на час больше времени оформления заказа!")
		}
	})
}

async function buildCartContent() {
	await fetch (`https://food-delivery.kreosoft.ru/api/basket`,
	 {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	})
	.then(response => {
		if(response.status === 200) {
			response.json().then(data => {
				let index = 1;
				data.forEach(item => {
					createItem(item, index);
					index++;
				});
			})
		}
	})
}

function createItem(item, index) {
	const parent = document.querySelector('.dish-list');
	const fullOrderPrice = document.querySelector('.fop');

	if (fullOrderPrice.textContent === "") {
		fullOrderPrice.textContent = "0";
	}

	let currentValue;
	let newValue;

	let itemName = item['name'];
	let itemPrice = item['price'];
	let totalPrice = item['totalPrice'];
	let image = item['image'];
	let amount = item['amount']

	const itemlayout = `
		<div class="item-wrap" id="">
			<div class="outline-container d-flex flex-row justify-content-between align-items-center p-2 mb-2">
				<div class="cart-item row d-flex align-items-center">

					<div class="col-lg-3 d-flex flex-row align-items-center">
						<span class="item-index m-3">${index}</span>
						<div class="item-image rounded-2">
							<img src="${image}" alt="">
						</div>
					</div>

					<div class="col-lg-9">
						<div class="row d-flex flex-row align-items-center">
							<div class="col-12 d-flex flex-row align-items-center justify-content-between">
								<div class="item-name-price d-flex flex-column">
									<h5 class="item-name">${itemName}</h5>
									<h6 class="price">Цена: ${itemPrice} руб/шт.</h6>
									<p class="amount text-start">Количество: ${amount} шт.</p>
								</div>
								<div class="full-price d-flex flex-column m-2">
									<p class="full-price-text text-end"><strong>Стоимость:</strong> ${totalPrice}  руб.</p>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	`

	parent.innerHTML += itemlayout;
	currentValue = fullOrderPrice.textContent;
	newValue = parseInt(currentValue) + parseInt(totalPrice);
	fullOrderPrice.textContent = newValue;
}

async function fillUserData() {
	await fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				return;
			}
		})
		.then(data => {
			if(data) {
				const emailField = document.getElementById('emailInput');
				const phoneField = document.getElementById('phoneInput');
				emailField.value = data['email'];
				phoneField.value = data['phoneNumber'];
				return;
			}
			else {
				alert("Время действия токена истекло!");
				window.location.reload();
				window.location.href = "signin.html"
				return;
			}
		})
		.catch(error => {
			console.error("Error:", error);
		});
}