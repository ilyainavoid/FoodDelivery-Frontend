document.addEventListener('DOMContentLoaded', function () {
	if(window.location['href'] != "http://localhost:5500/pages/signin.html" ||
	window.location['href'] != "http://localhost:5500/pages/signup.html") {
		const token = getToken("userToken");
		fetch('https://food-delivery.kreosoft.ru/api/account/profile', {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
		.then((response) => {
			if (!response.ok) {
				if (response.status === 401) {
					alert("Действие токена истекло!");
					localStorage.setItem('previousUrl', window.location['href']);
					localStorage.setItem('authorized', false)
					window.location.href = '../pages/signin.html'
				}
				throw new Error('Ошибка HTTP: ' + response.status);
			}
			else {
				localStorage.setItem('authorized', true);
			}
			return response.json();
		})
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error('Произошла ошибка:', error);
		});
	}
});


function setCookie(name, token, daysToExpire) {
  const date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${token}; ${expires}; path=/; secure; samesite=strict;`;
}

function getToken(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

function logout() {
	document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.reload();
}