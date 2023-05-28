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

if (getCookie('isLoggedIn') == 'false') {
	document.getElementById('login-error').style.display = 'block'
	document.getElementById('feedback-form').style.display = 'none'
}

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

const form = document.getElementById('feedback-form')

form.addEventListener('submit', function (event) {
	event.preventDefault()

	if (validateForm()) {
		sendFeedback()
	}
})

let firstNameValue = getCookie('firstname')
let lastNameValue = getCookie('lastname')
let emailValue = getCookie('email')
let topicValue = ''
let messageValue = ''

function validateForm() {
	let isValid = true

	const topic = document.getElementById('topic')
	const message = document.getElementById('message')

	if (topic.value.trim() === '') {
		isValid = false
		showError(topic, 'Пожалуйста, введите тему')
	} else {
		showSuccess(topic)
		topicValue = topic.value
	}

	if (message.value.trim() === '') {
		isValid = false
		showError(message, 'Пожалуйста, введите сообщение')
	} else {
		showSuccess(message)
		messageValue = message.value
	}

	return isValid
}

function showError(input, message) {
	const formGroup = input.parentElement
	formGroup.classList.add('error')
	const errorElement = formGroup.querySelector('.error-message')

	if (errorElement) {
		errorElement.textContent = message
	} else {
		const newErrorElement = document.createElement('div')
		newErrorElement.className = 'error-message'
		newErrorElement.textContent = message
		formGroup.appendChild(newErrorElement)
	}
}

function showSuccess(input) {
	const formGroup = input.parentElement
	formGroup.classList.remove('error')
	const errorElement = formGroup.querySelector('.error-message')

	if (errorElement) {
		formGroup.removeChild(errorElement)
	}
}

function sendFeedback() {
	const messageData = {
		topic: topicValue,
		message: messageValue,
	}

	const _id = getCookie('_id')
	const oldMessages = JSON.parse(getCookie('messages'))

	const dataToSend = {
		_id: _id,
		message: [...oldMessages, messageData],
	}

	fetch('https://site-backend-production.up.railway.app/postmessages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(dataToSend),
	})
	.then(response => {
		if (response.ok) {
			showNotification('Результаты отправлены на сервер!')
		} else {
			showNotification('Ошибка при отправке результатов на сервер!')
		}
	})
	.catch(error => {
		showNotification(error)
	})
}
