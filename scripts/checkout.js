document.addEventListener('DOMContentLoaded', function () {
	initPage();
});

async function initPage() {
	await refreshCart();
	await fillUserData();
	await buildCartContent();
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
	const parent = document.querySelector('.dish-list')

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