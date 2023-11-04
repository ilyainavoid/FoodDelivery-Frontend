const authToken = getToken("userToken");
const apiEndpointProfile = "https://food-delivery.kreosoft.ru/api/account/profile";
const options = {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${authToken}`
	}
};
console.log(authToken)

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

function submitForm(user) {
	console.log(user);
	const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${authToken}`
		},
		body: JSON.stringify(user)
	};

	fetch('https://food-delivery.kreosoft.ru/api/account/profile', options)
}

function validateForm() {
	const form = document.getElementById('form');
	const inputs = form.querySelectorAll('input');
	const address = document.getElementById(`${numberOfLevel}`);
	const selectedOption = address.options[address.selectedIndex];
	const addressObject = selectedOption.value;
	const addressId = JSON.parse(addressObject)['objectGuid'];

	const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
	const name = document.getElementById('firstName').value;
	const surname = document.getElementById('secondName').value;
	const patronymic = document.getElementById('patronymic').value;
	const birthday = document.getElementById('birthdayDate').value;
	let gender = document.getElementById('gender').value;
	const phone = document.getElementById('phoneNumber').value;

	let isEmpty = false;

	if (gender === "Мужской") {
		gender = "Male";
	} else {
		gender = "Female";
	}

	inputs.forEach(input => {
		if (input.value.trim() === '') {
      isEmpty = true;
		}
	});

	if(isEmpty) {
		alert("Форма заполнена не полностью!")
		return;
	}

	console.log(phone)

	if (!phoneRegex.test(phone)) {
		alert("Номер телефона указан неправильно!");
		return;
	}

	console.log({addressId});

	const user = {
		fullName: `${name} ${surname} ${patronymic}`,
		birthDate: birthday,
		gender: gender,
		addressId: addressId,
		phoneNumber: phone
	};

	console.log(user)

	submitForm(user);
}

document.addEventListener('DOMContentLoaded', function () {
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
	refreshCart();
	checkIfAuthorized();
});
