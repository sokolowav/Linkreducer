import React, {useState, useContext, useCallback, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LinksList} from '../components/LinksList'

export const LinksPage = () => {
	const [links, setLinks] = useState([])// потребуется юзСтэйт(пустой масив, т.к здесь уже будет работа с ссылками)
	const {loading, request} = useHttp()//потребуется loading и request из хука useHttp
	const {token} = useContext(AuthContext)//т.к потребуется контекст с авторизацией, здесь сразу получаем токен
	
	const fetchLinks = useCallback(async () => {//фунция, которая позволит загрузить нам наш список
		try {
			const fetched = await request('/api/link', 'GET', null, {//создаем fetched ссылок и ждем, пока реквест сделает запрос на api/link
				Authorization: `Bearer ${token}`
			})
			setLinks(fetched)//когда сссылки загрузятся
		} catch(e) {}
	},[token, request])

	useEffect (() => {
		fetchLinks()
	}, [fetchLinks])//в юзЭффекте работаем в зависимости с fetchLinks и вызываем fetchLinks()

	//проверка с Лоудером
	if (loading) {
		return <Loader />
	}
	//иначе в основном ретерне возвращаем фрагмент, где, если не лоадинг, то показываем компонент LinksList в который передадим параметр links={links}, к-ый и сделаем
	return (
		<>
		{!loading && <LinksList links={links}/>}
		</>
	)
}
