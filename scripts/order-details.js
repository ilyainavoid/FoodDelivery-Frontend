document.addEventListener('DOMContentLoaded', function () {
	initPage();
});

async function initPage() {
	const indicator = document.querySelector('.indicator');
	const orderId = localStorage.getItem('orderId');
	const index = localStorage.getItem('index');
	document.querySelector('.index').textContent = index;
	await refreshCart();
	await getContentData(orderId);
}

async function getContentData(id) {
	await fetch (`https://food-delivery.kreosoft.ru/api/order/${id}`,
	 {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	}).then((response) => response.json())
	.then((data) => {
		useData(data);
	})
}

async function useData(data) {
	const dateCheckoutField = document.querySelector('.datetime-checkout');
	const dateDeliveryField = document.querySelector('.datetime-delivery');
	const addressDeliveryField = document.querySelector('.address');
	const orderStatusField = document.querySelector('.status');
	const fullPriceField = document.querySelector('.fullPriceField')

	const dateCheckout = formatTime(data['orderTime']);
	const dateDelivery = formatTime(data['deliveryTime']);
	const orderStatus = data['status'];
	const totalPrice = data['price'];

	let addressFull= " ";
	addressFull = await createAddressString(data['address'], addressFull);


	let statusToWrite = "В обработке"
	if (orderStatus === "Delivered") {
		statusToWrite = "Доставлен";
	}

	dateCheckoutField.textContent = dateCheckout;
	dateDeliveryField.textContent = dateDelivery;
	orderStatusField.textContent = statusToWrite;
	addressDeliveryField.textContent = addressFull;
	fullPriceField.textContent = totalPrice;

	createItemsList(data['dishes'])
}

async function createAddressString(addressGuid, addressFull) {
	return fetch(`https://food-delivery.kreosoft.ru/api/address/getaddresschain?objectGuid=${addressGuid}`, {
		method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
	})
	.then((response) => response.json())
	.then((data) => {
		data.forEach(addressUnit => {
			console.log("Был")
			addressFull = addressFull.concat(`${addressUnit['text']}, `)
		});
		addressFull = addressFull.substring(0, addressFull.length - 2);
		return addressFull;
	});
}

function createItemsList(dishes) {
	let index = 1;
	dishes.forEach((dish) => {
		createItem(dish, index);
		index++;
	})
}

function createItem(dish, index) {
	const parent = document.querySelector('.items-in-order');

	const itemlayout = `
		<div class="item-wrap" id="">
			<div class="outline-container d-flex flex-row justify-content-between align-items-center p-2 mb-2">
				<div class="cart-item row d-flex align-items-center">

					<div class="col-lg-3 d-flex flex-row align-items-center">
						<span class="item-index m-3">${index}</span>
						<div class="item-image rounded-2">
							<img src="${dish['image']}" alt="">
						</div>
					</div>

					<div class="col-lg-9">
						<div class="row d-flex flex-row align-items-center">
							<div class="col-12 d-flex flex-row align-items-center justify-content-between">
								<div class="item-name-price d-flex flex-column">
									<h5 class="item-name">${dish['name']}</h5>
									<h6 class="price">Цена: ${dish['price']} руб/шт.</h6>
									<p class="amount text-start">Количество: ${dish['amount']} шт.</p>
								</div>
								<div class="full-price d-flex flex-column m-2">
									<p class="full-price-text text-end"><strong>Стоимость:</strong> ${dish['totalPrice']}  руб.</p>
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

function formatDate(datetime) {
	const inputDate = new Date(datetime);

	const day = inputDate.getDate().toString().padStart(2, '0');
	const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
	const year = inputDate.getFullYear();

	const formattedDate = `${day}.${month}.${year}`;
	return formattedDate;
}

function formatTime(datetime) {
	let date = datetime.split("T")[0].substring(0, 10);

	const dateUnits = date.split("-");
	date = `${dateUnits[2]}.${dateUnits[1]}.${dateUnits[0]}`;

	const time = datetime.split("T")[1].substring(0, 5);
	return `${time} ${date}`;
}
