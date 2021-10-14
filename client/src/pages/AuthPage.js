import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook' //не забываем подключать хуки
import { AuthContext } from '../context/AuthContext'

export const AuthPage = () => {
	const auth = useContext(AuthContext) //пользуемся контекстом с помощью хука useContext и передаем в него AuthContext
	const message = useMessage() //импортирую хук useMessage в объект message и добавляю его в зависимости useEffect (10стр.)
	const { loading, request, error, clearError } = useHttp() //подключаем хук и получаем из него объект, с 3 полями
	const [form, setForm] = useState({ email: '', password: '' })

	useEffect(() => {
		//используем хук useEffect  (не забываем подключить в импортах) и следим за ошибкой, если она есть, выводим для пользователя + добавляем объект message с хуком useMessage (6стр.)
		//console.log('Error', error)
		message(error) //если меняется ошибка error, показываю ее функцией message
		clearError() //сразу после этого отчистим ошибку вызовом ф-ии clearError, которую, также импортируем из useHttp (7стр.) + добавляем ее в зависимости (14стр)
	}, [error, message, clearError])

	useEffect(() => {
		window.M.updateTextFields()
	}, []) //для того, чтоб красиво выглядели поля формы

	const changeHandler = event => {
		setForm({ ...form, [event.target.name]: event.target.value }) //Валидация на стороне Фронта (опциально, т.к имеется на Бэке)
	}
	// для осуществления запросов на сервер, понадобятся 2 метода, для регистрации и для логина, создаем функцию
	const registerHandler = async () => {
		try {
			const data = await request('api/auth/register', 'POST', { ...form }) //получаем data, 3 параметра, 1-ый = url, что уже осуществили на бэке (в auth.routes), 2-ой метод POST, 3-ий та data, которую мы хотим передать на сервер (мыло и пароль, потому можем развернуть локальный стейт form)
			message(data.message)
		} catch (e) {} //catch пустой, так как уже обработан в хуке useHttp
	}
	const loginHandler = async () => {
		//аналогично registerHandler
		try {
			const data = await request('api/auth/login', 'POST', { ...form }) //получаем data, 3 параметра, 1-ый = url, что уже осуществили на бэке (в auth.routes), 2-ой метод POST, 3-ий та data, которую мы хотим передать на сервер (мыло и пароль, потому можем развернуть локальный стейт form)
			auth.login(data.token, data.userId)
		} catch (e) {} //catch пустой, так как уже обработан в хуке useHttp
	}
	return (
		<div className="row">
			<div className="col s6 offset-s3">
				<h1>Reduce ur Link</h1>
				<div className="card blue darken-1">
					<div className="card-content white-text">
						<span className="card-title">Authorization</span>
						<div>
							<div className="input-field">
								<input
									placeholder="Enter Email"
									id="email"
									type="text"
									name="email"
									className="yellow-input"
									onChange={changeHandler}
									value={form.email}
								/>
								<label htmlFor="email">Email</label>
							</div>
							<div className="input-field">
								<input
									placeholder="Enter Password"
									id="password"
									type="password"
									name="password"
									className="yellow-input"
									onChange={changeHandler}
									value={form.password}
								/>
								<label htmlFor="PWD">Password</label>
							</div>
						</div>
					</div>
					<div className="card-action">
						<button
							className="btn yellow darken-4"
							onClick={loginHandler}
							style={{ marginRight: 10 }}
							disabled={loading} //блокируем кнопку, если происходит процесс загрузки
						>
							Login
						</button>
						<button
							className="btn grey lighten-1 black-text"
							onClick={registerHandler} //прицепляем метод registerHandler к кнопке
							disabled={loading} //блокируем кнопку, если происходит процесс загрузки
						>
							Registration
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
