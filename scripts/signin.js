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
}
