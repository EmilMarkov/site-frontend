function getCookie(name) {
	const cookieValue = document.cookie.match(
		'(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'
	)
	return cookieValue ? cookieValue.pop() : ''
}

var isLoggedIn = getCookie('isLoggedIn')

document.addEventListener('DOMContentLoaded', function () {
	const url = new URL(window.location.href)
	const path = url.pathname

	if (path.endsWith('index.html')) {
		var accountLink = document.querySelectorAll('[href="pages/auth.html"]')
	} else {
		var accountLink = document.querySelectorAll('[href="./auth.html"]')
	}

	accountLink.forEach(function (link) {
		if (isLoggedIn == 'true') {
			link.innerHTML = 'Профиль'
			if (path.endsWith('index.html') == true) {
				link.href = 'pages/profile.html'
			} else {
				link.href = 'profile.html'
			}
		} else {
			link.innerHTML = 'Войти'
			if (path.endsWith('index.html') == true) {
				link.href = 'pages/auth.html'
			} else {
				link.href = 'auth.html'
			}
		}
	})
})

async function load() {
	if (isLoggedIn == 'true') {
		let _id = getCookie('_id')

		try {
			const response = await fetch(
				'https://site-backend-production.up.railway.app/getmessages',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ _id: _id }),
				}
			)

			if (response.ok) {
				const userData = await response.json()
				document.cookie = `isLoggedIn=true; path=/;`
				document.cookie = `_id=${userData._id}; path=/;`
				document.cookie = `firstname=${userData.firstname}; path=/;`
				document.cookie = `lastname=${userData.lastname}; path=/;`
				document.cookie = `email=${userData.email}; path=/;`
				document.cookie = `password=${userData.password}; path=/;`
				document.cookie = `messages=${JSON.stringify(
					userData.messages
				)}; path=/;`
			} else if (response.status === 409) {
				throw new Error('Пользователь с таким именем уже существует')
			} else {
				throw new Error('Ошибка при регистрации')
			}
		} catch (error) {
			showNotification(error)
		}
	}
}

window.addEventListener('load', load)

const checkbox = document.getElementById('theme-checkbox');
const body = document.querySelector('body');
const backgroundImageLight = "url('../src/img/light_theme.png')";
const backgroundImageDark = "url('../src/img/1.gif')";

function setTheme(theme) {
  if (theme === 'light') {
    body.style.background = backgroundImageLight;
    body.style.setProperty('--background-color', '#ffffff');
    body.style.setProperty('--text-color', '#000000');
    body.style.setProperty('--primary-color', '#dddddd');
    body.style.setProperty('--secondary-color', '#ff6600');
    body.style.setProperty('--accent-color', '#0055ff');
    body.style.setProperty('--link-color', '#0066cc');
    body.style.setProperty('--hover-color', '#ff0000');
  } else {
    body.style.background = backgroundImageDark;
    body.style.setProperty('--background-color', '#000000');
    body.style.setProperty('--text-color', '#f1f1f1');
    body.style.setProperty('--primary-color', '#080808');
    body.style.setProperty('--secondary-color', '#b3a3f5');
    body.style.setProperty('--accent-color', '#e317b7');
    body.style.setProperty('--link-color', '#b3db0f');
    body.style.setProperty('--hover-color', '#fff');
  }
}

function switchTheme(e) {
  const theme = e.target.checked ? 'light' : 'dark';
  setTheme(theme);
  document.cookie = `theme=${theme}; path=/`;
}

checkbox.addEventListener('click', switchTheme);

const themeCookie = document.cookie.match(/theme=(dark|light)/);
if (themeCookie) {
  const theme = themeCookie[1];
  checkbox.checked = theme === 'light';
  setTheme(theme);
}

document.getElementsByClassName('topbutton')[0].style.display = 'none'

document.addEventListener('scroll', (event) => {
	if (window.scrollY == 0) {
		document.getElementsByClassName('topbutton')[0].style.display = 'none'
	}
	else {
		document.getElementsByClassName('topbutton')[0].style.display = 'block'
	}
});
