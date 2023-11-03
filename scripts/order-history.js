document.addEventListener('DOMContentLoaded', function () {
	initPage();
});

async function initPage() {
	const indicator = document.querySelector('.indicator');
	const suggest = document.querySelector('.suggest-order');
	await refreshCart();


	refreshCart().then(data=> {
		if (indicator.textContent != 0) {
			console.log("here");
			suggest.classList.remove("d-none");
		}
	});

	const orderItemLayout = `
		<div class="outline-container p-3">
			<div class="row item">
				<div class="col-md-6 order-info d-flex flex-column justify-content-start">
					<h6 class="order-heading">Заказ от 20.04.2022</h6>
					<p class="status">Статус заказа - в обработке</p>
					<p class="delivery-time">Доставка ожидается в 15:30</p>
				</div>
				<div class="col-md-6 order-button-price d-flex flex-column justify-content-end">
					<button class="btn btn-outline-success submitDelivery align-self-md-end mt-2 mt-md-0">Подтвердить доставку</button>
					<div class="order-price-label align-self-md-end text-start text-md-end"><strong>Стоимость заказа:</strong> <span class="order-price">785 руб.</span> </div>
				</div>
			</div>
		</div>
	`;
}
