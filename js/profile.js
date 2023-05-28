var menuItems = document.getElementsByClassName('menu-item')
var sidebar = document.querySelector('.sidebar')
var content = document.querySelector('.content')
var usernameInput,
	emailInput,
	currentPasswordInput,
	newPasswordInput,
	confirmPasswordInput
var changePasswordButton, saveButton
var testsResult = []

function getCookie(name) {
	const cookieValue = document.cookie.match(
		'(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'
	)
	return cookieValue ? cookieValue.pop() : ''
}

function deleteCookie(name) {
	document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
}

function updateCookie(cookieName, newValue) {
	document.cookie = cookieName + '=' + newValue + '; path=/;'
}

function checkAuthorization() {
	var isLoggedIn = getCookie('isLoggedIn')

	if (isLoggedIn == 'true') {
		content.style.display = 'block'
	} else {
		showLoginMessage()
	}
}

function showLoginMessage() {
	var message = document.createElement('p')
	message.textContent =
		'Пожалуйста, авторизуйтесь, чтобы просмотреть содержимое страницы.'
	document.querySelector('.container').appendChild(message)

	sidebar.style.display = 'none'

	content.style.display = 'none'
}

checkAuthorization()

function showNotification(message) {
	var notification = document.createElement('div')
	notification.classList.add('custom-notification')
	notification.textContent = message
	document.body.appendChild(notification)

	var previousNotificationsHeight = 0

	var previousNotifications = document.getElementsByClassName(
		'custom-notification'
	)
	for (var i = 0; i < previousNotifications.length; i++) {
		previousNotificationsHeight += previousNotifications[i].offsetHeight + 7
	}

	notification.style.bottom = previousNotificationsHeight + 'px'

	setTimeout(function () {
		notification.style.opacity = '0'
		setTimeout(function () {
			document.body.removeChild(notification)
		}, 1000)
	}, 5000)
}

menuItems[0].classList.add('active')
showDataPage()

for (var i = 0; i < menuItems.length; i++) {
	menuItems[i].addEventListener('click', function (event) {
		event.preventDefault()

		for (var j = 0; j < menuItems.length; j++) {
			menuItems[j].classList.remove('active')
		}

		this.classList.add('active')

		var selectedMenu = this.textContent

		if (selectedMenu === 'Данные') {
			showDataPage()
		} else if (selectedMenu === 'Результаты тестов') {
			showMessagesPage()
		}
	})
}

function showDataPage() {
	content.innerHTML = ''

	var form = document.createElement('form')
	form.classList.add('data-form')

	firstnameInput = createInput('text', 'firstname', 'Имя')
	form.appendChild(firstnameInput)

	lastnameInput = createInput('text', 'lastname', 'Фамилия')
	form.appendChild(lastnameInput)

	emailInput = createInput('email', 'email', 'Почта')
	form.appendChild(emailInput)

	changePasswordButton = document.createElement('button')
	changePasswordButton.textContent = 'Изменить пароль'
	form.appendChild(changePasswordButton)

	currentPasswordInput = createInput(
		'password',
		'current-password',
		'Текущий пароль'
	)
	newPasswordInput = createInput('password', 'new-password', 'Новый пароль')
	confirmPasswordInput = createInput(
		'password',
		'confirm-password',
		'Подтвердите пароль'
	)

	currentPasswordInput.style.display = 'None'
	newPasswordInput.style.display = 'None'
	confirmPasswordInput.style.display = 'None'

	saveButton = document.createElement('button')
	saveButton.type = 'button'
	saveButton.textContent = 'Сохранить'

	exitButton = document.createElement('button')
	exitButton.type = 'button'
	exitButton.textContent = 'Выйти'

	changePasswordButton.addEventListener('click', function (event) {
		event.preventDefault()

		showPasswordFields(form)
	})

	saveButton.addEventListener('click', function (event) {
		saveData()
	})

	exitButton.addEventListener('click', function (event) {
		event.preventDefault()

		exit()
	})

	content.appendChild(form)
	form.appendChild(currentPasswordInput)
	form.appendChild(newPasswordInput)
	form.appendChild(confirmPasswordInput)
	form.appendChild(saveButton)
	form.appendChild(exitButton)
	document.getElementById('firstname').value = getCookie('firstname')
	document.getElementById('lastname').value = getCookie('lastname')
	document.getElementById('email').value = getCookie('email')
}

function formatDateTime(dateTimeString) {
	const dateTime = new Date(dateTimeString)

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short',
	}

	return dateTime.toLocaleString('en-US', options)
}

function showMessagesPage() {
	const messagesCookie = getCookie('messages')

	const listContainer = document.createElement('div')
	listContainer.classList.add('mdc-list')

	let messages = JSON.parse(messagesCookie)

	messages.forEach(message => {
		const listItem = document.createElement('li')
		listItem.classList.add('mdc-list-item')

		const topicElement = document.createElement('span')
		topicElement.classList.add('mdc-list-item__text')
		topicElement.textContent = `Тема: ${message.topic}`

		const messageElement = document.createElement('span')
		messageElement.classList.add('mdc-list-item__text')
		messageElement.textContent = `Сообщение: ${message.message}`

		listItem.appendChild(topicElement)
		listItem.appendChild(messageElement)

		listContainer.appendChild(listItem)
	})

	content.innerHTML = ''
	content.appendChild(listContainer)
}

function createInput(type, id, label) {
	var container = document.createElement('div')
	container.classList.add('input-container')

	var input = document.createElement('input')
	input.type = type
	input.id = id
	input.placeholder = label
	input.autocomplete = 'new-password'

	var inputLabel = document.createElement('label')
	inputLabel.textContent = label

	container.appendChild(inputLabel)
	container.appendChild(input)

	return container
}

function showPasswordFields(form) {
	currentPasswordInput.style.display = 'block'
	newPasswordInput.style.display = 'block'
	confirmPasswordInput.style.display = 'block'

	changePasswordButton.style.display = 'none'
}

function saveData() {
	let firstname = document.getElementById('firstname').value
	let lastname = document.getElementById('lastname').value
	let email = document.getElementById('email').value
	let currentPassword = document.getElementById('current-password').value
	let newPassword = document.getElementById('new-password').value
	let confirmPassword = document.getElementById('confirm-password').value

	let messages = JSON.parse(getCookie('messages'))

	let result = {
		_id: getCookie('_id'),
		firstname: firstname,
		lastname: lastname,
		email: email,
		password: newPassword,
		messages: messages,
	}

	if (firstname == getCookie('firstname')) {
		result.firstname = getCookie('firstname')
	} else {
		if (firstname == '') {
			showNotification('Введите имя!')
			return
		}
	}

	if (lastname == getCookie('lastname')) {
		result.lastname = getCookie('lastname')
	} else {
		if (lastname == '') {
			showNotification('Введите фамилию!')
			return
		}
	}

	if (email == getCookie('email')) {
		result.email = getCookie('email')
	} else {
		if (email == '') {
			showNotification('Введите почту!')
			return
		}
	}

	if (currentPassword == getCookie('password')) {
		if (newPassword != confirmPassword) {
			showNotification('Пароли не совпадают!')
			return
		}
	} else {
		if (currentPassword == '') {
			result.password = getCookie('password')
		} else {
			showNotification('Неверный пароль!')
			return
		}
	}

	updateCookie('firstname', result.firstname)
	updateCookie('lastname', result.lastname)
	updateCookie('email', result.email)
	updateCookie('password', result.password)

	fetch('https://site-backend-production.up.railway.app/update', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(result),
	})
		.then(response => {
			if (response.ok) {
				showNotification('Данные успешно обновлены!')
			} else {
				showNotification('Ошибка при отправке данных на сервер!')
			}
		})
		.catch(error => {
			showNotification('Ошибка при отправке данных на сервер!')
		})
	clearPasswordFields()
}

function clearPasswordFields() {
	currentPasswordInput.value = ''
	newPasswordInput.value = ''
	confirmPasswordInput.value = ''

	currentPasswordInput.style.display = 'none'
	newPasswordInput.style.display = 'none'
	confirmPasswordInput.style.display = 'none'

	changePasswordButton.style.display = ''
}

function exit() {
	deleteCookie('_id')
	deleteCookie('firstname')
	deleteCookie('lastname')
	deleteCookie('email')
	deleteCookie('password')
	deleteCookie('messages')

	updateCookie('isLoggedIn', 'false')

	window.location.href = '../index.html'
}
