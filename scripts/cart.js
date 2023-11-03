const indicator = document.querySelector('.indicator');
const token = getToken("userToken");

async function refreshCart() {
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
				indicator.textContent = data.length;
			})
		}
	})
}

function deleteDishFromCart(toDeleteId) {
	fetch (`https://food-delivery.kreosoft.ru/api/basket/dish/${toDeleteId}?increase=false`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	})
	.then(response => {
		if(response.status === 200) {
			window.location.reload();
		}
		else {
			response => response.json().then(data => {
				console.log(data)
			})
		}
	})
}

function deleteDishUnitFromCart(toDeleteId) {
	fetch (`https://food-delivery.kreosoft.ru/api/basket/dish/${toDeleteId}?increase=true`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	})
	.then(response => {
		if(response.status === 200) {
			//window.location.reload();
		}
		else {
			response => response.json().then(data => {
				console.log(data)
			})
		}
	})
}

function addItem(toDeleteId) {
	fetch (`https://food-delivery.kreosoft.ru/api/basket/dish/${toDeleteId}`,
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	})
	.then(response => {
		if(response.status === 200) {
			//window.location.reload();
		}
		else {
			response => response.json().then(data => {
				console.log(data)
			})
		}
	})
}
