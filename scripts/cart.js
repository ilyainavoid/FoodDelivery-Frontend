const indicator = document.querySelector('.indicator');
const token = getToken("userToken");

function refreshCart() {
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
				indicator.textContent = data.length;
			})
		}
	})
}

function deleteDishFromCart(toDeleteId) {
	fetch (`https://food-delivery.kreosoft.ru/api/dish${toDeleteId}?increase=false`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	})
	.then(refreshCart())
}

function deleteDishUnitFromCart(toDeleteId) {
	fetch (`https://food-delivery.kreosoft.ru/api/dish${toDeleteId}?increase=true`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
	})
}

function addItem(toAddId) {

}
