//модуль, что работает исключительно с авторизацией
import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useAuth = () => {
	//функция, в которой будем экспортировать методы для входа (выхода) пользователя
	const [token, setToken] = useState(null) //стейт для токена
	const [ready, setReady] = useState(false) //флаг для корректной работы обновления страницы DetailPage
	const [userId, setUserId] = useState(null) //стейт для ID
	//так же понадобятся два метода (логин и логаут), сразу обернутые в коллбэк функции
	const login = useCallback((jwtToken, id) => {
		setToken(jwtToken)
		setUserId(id)

		localStorage.setItem(
			storageName,
			JSON.stringify({
				userId: id,
				token: jwtToken,
			})
		) // записываем setToken и setUserId в локалсторадж - браузерный api
	}, [])

	const logout = useCallback(() => {
		setToken(null)
		setUserId(null)
		localStorage.removeItem(storageName)
	}, [])

	useEffect(() => {
		//создаем метод, который будет смотреть, есть ли ссылки у данного пользователя, и если есть, подгружает их в локальное состояние
		const data = JSON.parse(localStorage.getItem(storageName))

		if (data && data.token) {
			login(data.token, data.userId)
		}
		setReady(true) //для корректной работы обновления DetailsPage меняем флаг, на тру, мол авторизация отработала
	}, [login])

	return { login, logout, token, userId, ready } //два метода и возвращаем, плюс токен и юзерАйДи и рэди(для корректной работы обновления на ДетэйлсПэйдж)
}
