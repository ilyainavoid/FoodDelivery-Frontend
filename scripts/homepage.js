document.addEventListener('DOMContentLoaded', function () {
	checkAuth().then(() => {
		if(localStorage.getItem('authorizedStatus') != 0) {
			document.querySelector('.header-top-authorized').classList.remove("d-none");
			const user = localStorage.getItem('user')
			document.querySelector('.profile-link').textContent = user['email'];
		} else {
			document.querySelector('.header-top-unauthorized').classList.remove("d-none");
		}
	})

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
});