const authToken = getToken("userToken");
const authorizedElements = document.querySelectorAll(".authorized");
const unauthorizedElements = document.querySelectorAll(".unauthorized");
let isAuthorized = false;

console.log(authToken);

if (authToken) {
	isAuthorized = true;
	authorizedElements.forEach(function(element) {
			element.style.display = "block";
	});

	
	unauthorizedElements.forEach(function(element) {
			element.style.display = "none";
	});
} else {
	
	authorizedElements.forEach(function(element) {
			element.style.display = "none";
	});

	unauthorizedElements.forEach(function(element) {
			element.style.display = "block";
	});
}

if (isAuthorized) {
	const profileLink = document.querySelector(".profile-link");
	const apiEndpoint = "https://food-delivery.kreosoft.ru/api/account/profile"
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${authToken}`
		},
	};
	fetch(apiEndpoint, options)
		.then(response => {
			if (response.status === 200) {
				response.json().then((data) => {
					const link = profileLink.querySelector("a");
					link.textContent = data['email'];
				})
			}
			else if (response.status === 401) {
				alert("Время действия токена закончилось!")
				window.location.href="pages/signin.html";
			}
		})
}