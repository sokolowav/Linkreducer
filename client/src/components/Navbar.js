import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { NavLink, useHistory } from 'react-router-dom'

export const Navbar = () => {
	const history = useHistory() //подключаем модуль useHistory
	const auth = useContext(AuthContext) //так же понадобится контекст (не забываем импортировать)
	const logoutHandler = event => {
		//ф-ия для кнопки логаута
		event.preventDefault() //пресекаем стандартное поведение, чтобы ссылка не обрабатывалась
		auth.logout()
		history.push('/') //переходим на страницу аутентификации
	}
	return (
		<nav>
			<div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
				<a href="/" className="brand-logo">
					Links reduction
				</a>
				<ul id="nav-mobile" className="right hide-on-med-and-down">
					<li>
						<NavLink to="/create">Create</NavLink>
					</li>
					<li>
						<NavLink to="/links">List of Links</NavLink>
					</li>
					<li>
						<a href="/" onClick={logoutHandler}>
							Logout
						</a>
					</li>
				</ul>
			</div>
		</nav>
	)
}
