document.addEventListener('DOMContentLoaded', function () {
	checkAuth().then(() => {
		if(localStorage.getItem('authorizedStatus') != 0) {
			document.querySelector('.header-top-authorized').classList.remove("d-none");
		} else {
			document.querySelector('.header-top-unauthorized').classList.remove("d-none");
		}
	})
});