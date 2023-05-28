const authForms = document.querySelector('.auth')
const loginForm = document.querySelector('.login-form')
const registrationForm = document.querySelector('.registration-form')
const registrationFormLink = document.querySelector('.registration-form__link')
const loginFormLink = document.querySelector('.login-form__link')

let current_user

const interval = 5000
const clientKeys = {}

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


registrationFormLink.addEventListener('click', event => {
	event.preventDefault()
	loginForm.classList.remove('show')
	registrationForm.classList.add('show')
})

loginFormLink.addEventListener('click', event => {
	event.preventDefault()
	registrationForm.classList.remove('show')
	loginForm.classList.add('show')
})

loginForm.addEventListener('submit', event => {
	event.preventDefault()
	const resultData = {
		email: loginForm.querySelector('#email').value,
		password: loginForm.querySelector('#password').value,
	}

	fetch('https://site-backend-production.up.railway.app/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(resultData),
	})
	.then(response => {
		if (response.ok) {

			response.json().then(userData => {
				document.cookie = `isLoggedIn=true; path=/;`
				document.cookie = `_id=${userData._id}; path=/;`
				document.cookie = `firstname=${userData.firstname}; path=/;`
				document.cookie = `lastname=${userData.lastname}; path=/;`
				document.cookie = `email=${userData.email}; path=/;`
				document.cookie = `password=${userData.password}; path=/;`
				document.cookie = `messages=${JSON.stringify(
					userData.messages
				)}; path=/;`

				window.location.href = 'profile.html'
			})
		} else {
			throw new Error('Неверное имя пользователя или пароль')
		}
	})
	.catch(error => {
		showNotification(error)
	})
})

registrationForm.addEventListener('submit', event => {
	event.preventDefault()
	const resultData = {
		firstname: registrationForm.querySelector('#r-firstname').value,
		lastname: registrationForm.querySelector('#r-lastname').value,
		email: registrationForm.querySelector('#r-email').value,
		password: registrationForm.querySelector('#r-password').value,
	}

	fetch('https://site-backend-production.up.railway.app/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(resultData),
	})
		.then(response => {
			if (response.ok) {

				response.json().then(userData => {
					document.cookie = `isLoggedIn=true; path=/;`
					document.cookie = `_id=${userData._id}; path=/;`
					document.cookie = `firstname=${userData.firstname}; path=/;`
					document.cookie = `lastname=${userData.lastname}; path=/;`
					document.cookie = `email=${userData.email}; path=/;`
					document.cookie = `password=${userData.password}; path=/;`
					document.cookie = `messages=${JSON.stringify(
						userData.messages
					)}; path=/;`

					window.location.href = 'profile.html'
				})
			} else if (response.status === 409) {
				throw new Error('Пользователь с таким именем уже существует')
			} else {
				throw new Error('Ошибка при регистрации')
			}
		})
		.catch(error => {
			showNotification(error)
		})
})
