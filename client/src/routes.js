import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { LinksPage } from './pages/LinksPage'
import { CreatePage } from './pages/CreatePage'
import { DetailPage } from './pages/DetailPage'
import { AuthPage } from './pages/AuthPage'

export const useRoutes = isAuthenticated => {
	if (isAuthenticated) {
		//Набор ссылок для авторизованных
		return (
			<Switch>
				<Route path="/links" exact>
					<LinksPage />
				</Route>
				<Route path="/create" exact>
					<CreatePage />
				</Route>
				<Route path="/detail/:id">
					<DetailPage />
				</Route>
				<Redirect to="/create" />
			</Switch>
		)
	}
	//Набор ссылок для НЕавторизованных
	return (
		<Switch>
			<Route path="/" exact>
				<AuthPage />
			</Route>
			<Redirect to="/" />
		</Switch>
	)
}
