document.addEventListener('DOMContentLoaded', function () {
	let authorized = localStorage.getItem('authorized');
	if(!authorized) {
		document.querySelector('.header-top-authorized').classList.remove("d-none");
	} else {
		document.querySelector('.header-top-unauthorized').classList.remove("d-none");
	}
});