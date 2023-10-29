const authToken = getToken("userToken");
const apiEndpointProfile = "https://food-delivery.kreosoft.ru/api/account/profile";
const options = {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${authToken}`
	}
};

isProfile = true;

function checkIfAuthorized() {
	if (authToken) {
		fetch(apiEndpointProfile, options)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				return;
			}
		})
		.then(data => {
			if(data) {
				fillData(data);
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
}



function fillData(user) {

	const name = document.getElementById('firstName');
	const surname = document.getElementById('secondName');
	const patronymic = document.getElementById('patronymic');
	const birthday = document.getElementById('birthdayDate');
	const gender = document.getElementById('gender');
	const phone = document.getElementById('phoneNumber');
	const email = document.getElementById('email');

	const fullName = user['fullName'].split(' ');

	name.value = fullName[0];
	surname.value = fullName[1];
	patronymic.value = fullName[2];
	birthday.value = user['birthDate'];
	if (user['gender'] === "Male") {
		gender.value = "Мужской";
	} else {
		gender.value = "Женский";
	}
	phone.value = user['phoneNumber'];
	email.value = user['email'];
	forProfile = true;
	getAddressChain(user['address'])
}

function getAddressChain(userAddressId) {
	console.log(userAddressId);
	const apiEndpointAddress = "https://food-delivery.kreosoft.ru/api/address/getaddresschain"
	fetch(`${apiEndpointAddress}?objectGuid=${userAddressId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
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
				controlProfileForm(data);
				return;
			}
			else {
				console.log(data)
				// alert("Время действия токена истекло!");
				// window.location.reload();
				// window.location.href = "signin.html"
				return;
			}
		})
		.catch(error => {
			console.error("Error:", error);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	checkIfAuthorized();
});
