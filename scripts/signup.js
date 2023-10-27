function validateForm() {
	const form = document.getElementById('signup-form');
	const inputs = form.querySelectorAll('input[required]')
	const address = document.getElementById(`${numberOfLevel}`);

	const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
	const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;

	const name = document.getElementById('firstName').value;
	const surname = document.getElementById('secondName').value;
	const patronymic = document.getElementById('patronymic').value;
	const birthday = document.getElementById('birthdayDate').value;
	const gender = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
	const cellphone = document.getElementById('phoneNumber').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

  const selectedOption = address.options[address.selectedIndex];
	const addressObject = selectedOption.value;
	const addressId = JSON.parse(addressObject)['objectGuid'];

	let isEmpty = false;

	inputs.forEach(input => {
		if (input.value.trim() === '') {
      isEmpty = true;
		}
	});

	if(isEmpty) {
		alert("Форма заполнена не полностью!")
		return;
	}

	if(!validator.isEmail(email)) {
		alert("Адрес эл. почты указан неправильно!")
		return;
	}

	if (password.length < 10 || !/\d/.test(password)) {
    alert("Пароль должен быть длиннее 10 символов и содержать хотя бы одну цифру!");
    return;
  }

	if (!phoneRegex.test(cellphone)) {
		alert("Номер телефона указан неправильно!");
		return;
	}

	const user = {
		fullName: `${name} ${surname} ${patronymic}`,
		password: password,
		email: email,
		addressId: addressId,
		birthDate: birthday,
		gender: gender,
		phoneNumber: cellphone
	};

	submitRegistration(user);
}

function submitRegistration(user) {
	console.log(user);
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
	};

	fetch('https://food-delivery.kreosoft.ru/api/account/register', options)
  .then(response => {
    if (response) {
      return response.json();
    }
  })
  .then(data => {
    console.log("API Response:", data);
		const token = data['token'];
		setCookie("userToken", token, 7);
		alert("Регистрация прошла успешно!");
  })
  .catch(error => {
    console.error("Error:", error);
  });
}