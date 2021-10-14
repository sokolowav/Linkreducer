import { createContext } from 'react'

function noop() {} //пустая ф-ия, кторая ничего не делает

export const AuthContext = createContext({
	//будем экспортировать КОНтекст, с указаным по дефолту набором свойств (плюс в том, что будет передавать параметры не по древовидной системе, а по всему контексту проекта)
	token: null,
	userId: null,
	login: noop,
	logout: noop,
	isAuthenticated: false, //флаг указывает залогигнен ли пользователь
})
