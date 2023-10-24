document.addEventListener('DOMContentLoaded', function () {
	fetch('../components/address-section.html')
      .then(response => response.text())
      .then(data => {
				console.log(data)
        document.getElementById('address-section').innerHTML = data;
      })
});