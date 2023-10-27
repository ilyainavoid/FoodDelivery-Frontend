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
