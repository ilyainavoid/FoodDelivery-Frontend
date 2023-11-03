function submitForm() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	if (!email || !password) {
		alert("Форма заполнена не полностью!")
		return;
	}

	if (!validator.isEmail(email)) {
		alert("Адрес эл. почты введен некорректно!");
		return;
	}

	const loginData = {
		email: email,
		password: password
	}

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(loginData)
	};

	fetch('https://food-delivery.kreosoft.ru/api/account/login', options)
  .then(response => {
    if (response) {
      return response.json();
    }
  })
  .then(data => {
		if(data['message'] === "Login failed") {
			alert("Неверный логин или пароль!")
		}
		else {
			alert("Авторизация прошла успешно!")
			const token = data['token'];
			setCookie("userToken", token, 7);
			const previous = localStorage.getItem('previousUrl')
			window.location.href = previous;
		}
  })
}
