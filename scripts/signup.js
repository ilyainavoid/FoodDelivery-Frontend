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

	if (password.length < 10) {
    alert("Пароль должен быть длиннее 10 символов!");
    return;
  }

	if (!phoneRegex.test(cellphone)) {
		alert("Номер телефона указан неправильно!");
		return;
	}
}