function incrementValue(e) {
	e.preventDefault();
	var fieldName = $(e.target).data('field');
	var parent = $(e.target).closest('div');
	var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

	if (!isNaN(currentVal)) {
			parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
	} else {
			parent.find('input[name=' + fieldName + ']').val(0);
	}
}

function decrementValue(e) {
	e.preventDefault();
	var fieldName = $(e.target).data('field');
	var parent = $(e.target).closest('div');
	var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

	if (!isNaN(currentVal) && currentVal > 0) {
			parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
	} else {
			parent.find('input[name=' + fieldName + ']').val(0);
	}
}


document.addEventListener('DOMContentLoaded', function () {
	refreshCart();
	buildCartContent();
});

function buildCartContent() {
	fetch (`https://food-delivery.kreosoft.ru/api/basket`,
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
				initButtons();
			})
		}
	})
}

function initButtons() {
	const buttons = document.querySelectorAll('.delete-button');
	buttons.forEach(button => {
		button.addEventListener("click", () => {
			deleteDishFromCart(button.parentElement.parentElement.id);
			const currentItemLayout = document.getElementById(button.parentElement.parentElement.id);
			currentItemLayout.remove();
		})
	})

	const decrements = document.querySelectorAll('.button-minus');
		const increments = document.querySelectorAll('.button-plus');
		decrements.forEach(decrement => {
			decrement.addEventListener('click', (e) => {
				decrementValue(e);
				deleteDishUnitFromCart(decrement.parentElement.id)
				const itemparent = decrement.parentElement;
				const number = itemparent.querySelector('.quantity-field');
				if (number.value == 0) {
					const itemparentglobal = document.getElementById(decrement.parentElement.id);
					itemparentglobal.remove();
					const currentLevel = indicator.textContent - 1;
					indicator.textContent = currentLevel;
				}
			})
		})
		increments.forEach(increment => {
			increment.addEventListener('click', (e) => {
				incrementValue(e);
				addItem(increment.parentElement.id);
			})
		})
}

function createItem(item, index) {
	const parent = document.querySelector('.cart-items')

	let itemName = item['name'];
	let itemPrice = item['price'];
	let totalPrice = item['totalPrice'];
	let image = item['image'];
	let id = item['id'];
	let amount = item['amount']

	const itemlayout = `
	<div class="item-wrap" id="${id}">
			<div class="outline-container d-flex flex-row justify-content-between align-items-center mb-2">
				<div class="cart-item row d-flex align-items-center">

					<div class="col-3 d-flex flex-row align-items-center">
						<span class="item-index m-3">${index}</span>
						<div class="item-image rounded-2">
							<img src="${image}" alt="">
						</div>
					</div>

					<div class="col-5">
						<div class="row d-flex flex-row align-items-center">
							<div class="col-6">
								<div class="item-name-price d-flex flex-column">
									<h5 class="item-name">${itemName}</h5>
									<h6 class="price">Цена: ${itemPrice} руб/шт.</h6>
								</div>
							</div>
							
							<div class="col-6">
								<div class="increment d-flex">
									<div class="input-group justify-content-start align-items-center" id="${id}">
										<input type="button" value="-" class="button-minus border rounded-circle  icon-shape icon-sm mx-1 " data-field="quantity">
										<input type="number" step="1" max="10" value="${amount}" name="quantity" class="quantity-field border-0 text-center w-25">
										<input type="button" value="+" class="button-plus border rounded-circle icon-shape icon-sm " data-field="quantity">
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="delete-button p-3" id="deleteFromCart${index}">
					<button class="btn btn-danger" id="deleteFromCart${index}">Удалить</button>
				</div>
			</div>
	</div>
	`
	parent.innerHTML += itemlayout;
}