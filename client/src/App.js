import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import {Loader} from './components/Loader'
import 'materialize-css'

function App() {
	const { token, login, logout, userId, ready } = useAuth() //вызываем хук useAuth из которого забираем 4 элемента
	const isAuthenticated = !!token //флаг о том, залогинен ли пользователь, через двойное отрицание приводим к булевому значению
	const routes = useRoutes(isAuthenticated) //False, т.к пока не можем передать какой либо флаг, а пользователь пока не в системе (если было бы true, попадали бы на страницу create, доступны были бы links и detail)//после создания флага меняем на isAuthenticated
	
	if (!ready) { //если флаг об авторизации фолси, то возвращаем компонент Лоадер
		return <Loader />//создаем отдельный файл в компонентах
	}
	
	return (
		<AuthContext.Provider
			value={{ token, login, logout, userId, isAuthenticated }}
		>
			<Router>
				{isAuthenticated && <Navbar />}
				<div className="container">{routes}</div>
			</Router>
		</AuthContext.Provider>
	) //меняем h1 на {routes}-и выхватываем ошибку, правим, оборачивая в Роут.
}

export default App
