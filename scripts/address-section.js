const apiEndpoint = 'https://food-delivery.kreosoft.ru/api/address/search';
const appendPoint = document.getElementById('address-section-main')
let currentObject = '{"objectId": 1281271, "objectGuid": "889b1f3a-98aa-40fc-9d3d-0f41192758ab", "text": "обл Томская","objectLevel": "Region","objectLevelText": "Субъект РФ"}';
let currentObjectId = 1281271;
let numberOfLevel = 1;

document.addEventListener('DOMContentLoaded', function () {

	function generateOptions() {
		const option = document.createElement('option');
		option.textContent = " ";
		document.getElementById(numberOfLevel).appendChild(option);
		fetch(`${apiEndpoint}?parentObjectId=${currentObjectId}`)
			.then(response => response.json())
			.then(data => {
				data.forEach(element => {
					const option = document.createElement('option');
					option.value = JSON.stringify(element);
					option.textContent = element["text"];
					document.getElementById(numberOfLevel).appendChild(option);
				});
			});
	}

	function appendSelect() {
		numberOfLevel += 1;
		const nameOfLevel = document.createElement('label');
		const newSelect = document.createElement('select');

		nameOfLevel.id = `label${numberOfLevel}`;
		newSelect.id = numberOfLevel;

		nameOfLevel.className = "form-label";
		nameOfLevel.setAttribute("for", newSelect.id)

		newSelect.className = "form-select form-select-lg mb-3";
		newSelect.setAttribute("name", newSelect.id);

		nameOfLevel.textContent = "Следующий элемент адреса";

		appendPoint.appendChild(nameOfLevel);
		appendPoint.appendChild(newSelect);
		generateOptions();
	}

	function buildForm() {
		if (currentObject["objectLevel"] != "Building") {
			appendSelect();
		}
		const currentSelect = document.getElementById(numberOfLevel);
		currentSelect.addEventListener('change', () => {
			if (currentSelect.id < numberOfLevel) {
				while(numberOfLevel != currentSelect.id) {
					let indexToDelete = numberOfLevel;
					const selectToDelete = document.getElementById(indexToDelete);
					const labelToDelete = document.getElementById(`label${indexToDelete}`);
					selectToDelete.remove();
					labelToDelete.remove();
					numberOfLevel--;
				}
				const optionValue = currentSelect.value;
				currentObject = JSON.parse(optionValue);
				currentObjectId = currentObject["objectId"];
				document.getElementById(`label${numberOfLevel}`).textContent = currentObject['objectLevelText'];
				buildForm();
			}
			else {
			const optionValue = currentSelect.value;
			currentObject = JSON.parse(optionValue);
			currentObjectId = currentObject["objectId"];
			document.getElementById(`label${numberOfLevel}`).textContent = currentObject['objectLevelText'];
			buildForm();
			}
		})
	}
	buildForm();
});