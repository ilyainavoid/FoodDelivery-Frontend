function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

const authToken = getCookie("authToken");
const authorizedElements = document.querySelectorAll(".authorized");
const unauthorizedElements = document.querySelectorAll(".unauthorized");
console.log(authToken);

if (authToken) {
	
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