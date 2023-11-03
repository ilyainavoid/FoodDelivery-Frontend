document.addEventListener('DOMContentLoaded', function () {
	initPage();
});

async function initPage() {
	const indicator = document.querySelector('.indicator');
	const suggest = document.querySelector('.suggest-order');
	await refreshCart();

	refreshCart().then(()=> {
		if (indicator.textContent != 0) {
			suggest.classList.remove("d-none");
		}
	});

	await buildOrdersList();
}

function initElements() {
	const orderHeads = document.querySelectorAll('.order-heading');
	const submitDeliveryButtons = document.querySelectorAll('.submitDelivery');
	let index = 0;
	
	orderHeads.forEach(head => {
		index++;
		head.addEventListener('click', () => {
			localStorage.setItem('orderId', head.parentElement.parentElement.parentElement.id);
			localStorage.setItem('index', index)
			window.location.href='../pages/order-details.html'
		})
	})

	submitDeliveryButtons.forEach(button => {
		button.addEventListener('click', () => {
			submitOrderDelivery(button.id).then(()=> {
				window.location.reload();
			})
		})
	})
}

async function submitOrderDelivery(id) {
	await fetch (`https://food-delivery.kreosoft.ru/api/order/${id}/status`,
	 {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	})
}

async function buildOrdersList() {
	await fetch ('https://food-delivery.kreosoft.ru/api/order',
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
				data.forEach(order => {
					createElement(order)
				});
				initElements();
			})
		}
	})

}

function createElement(order) {
	const container = document.querySelector('.last-orders');

	const checkoutDate = formatDate(order['orderTime']);
	const deliveryTime = formatTime(order['deliveryTime']);
	const price = order['price'];
	const id = order['id'];
	
	let displayButton = "d-inline";
	let deliveryStatus = "Доставка ожидается: "
	let status = "В обработке";
	if (order['status'] === "Delivered") {
		status = "Доставлен";
		displayButton = "d-none"
		deliveryStatus = "Доставлено: "
	}

	const orderItemLayout = `
		<div class="outline-container p-3" id="${id}">
			<div class="row item">
				<div class="col-md-6 order-info d-flex flex-column justify-content-start">
					<h6 class="order-heading">Заказ от ${checkoutDate}</h6>
					<p class="status">Статус заказа: ${status}</p>
					<p class="delivery-time">${deliveryStatus} ${deliveryTime}</p>
				</div>
				<div class="col-md-6 order-button-price d-flex flex-column justify-content-end">
					<button id="${id}" class="btn btn-outline-success ${displayButton} submitDelivery align-self-md-end mt-2 mt-md-0">Подтвердить доставку</button>
					<div class="order-price-label align-self-md-end text-start text-md-end"><strong>Стоимость заказа:</strong> <span class="order-price">${price} руб.</span> </div>
				</div>
			</div>
		</div>
`;

	container.innerHTML += orderItemLayout;
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
