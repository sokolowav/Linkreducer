import React, {useCallback, useState, useContext, useEffect} from 'react'
import {useParams} from 'react-router-dom' //для решения задачи с извлечением сокращенной ссылки - хвостика адреса страницы
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LinkCard} from '../components/LinkCard'


export const DetailPage = () => {
	const {token} = useContext(AuthContext) //получаем токен хуком юзКонтекст
	const {request, loading} = useHttp() //для задачи извлечения сокращенной ссылки
	const [link, setLink] = useState(null) //подгружаем саму ссылку(т.е то, что получим с бэка), через хук useState (по умолчанию, null)
	const linkId = useParams().id //забираем ID хвоста (ключ берем из routs.js)

	//создаем отдельный метод, что позволит получить саму ссылку, метод оборачиваем в хук useCallback (пока что с пустыми параметрами), не забываем подключить
	const getLink = useCallback( async () => {//в методе будет ассинхронная функция, где в блоке try catch делаем запрос
		try {
			const fetched = await request(`/api/link/${linkId}`, 'GET', null, { //на выходе получаем объект фетчед, к-ый по факту является непосредственной ссылкой
				Authorization: `Bearer ${token}` //забираем именно токен, т.к в данном случае, он нужен в зависимости
			}) //делаем запрос, что возвращает промисс, в нем сначала определяем сссылку (в link.routes endpoint router.get()), второй параметр метод ГЕТ, т.к бади не нужен, передаем Null, и поле с ключом Ауторизыйшен и токеном (т.к нужна авторизация)
			setLink(fetched)//вызываем метод с объектом-ссылкой
		} catch(e) {}
	},[token, linkId, request])

	useEffect (() => {//когда сследует делать запрос, можем определить в useEffect
		getLink()
	}, [getLink]) //получаем ссылку методом и обозначаем гетЛинк как зависимость

	if (loading) {
		return <Loader/> //если флаг лодинг = тру, возвращаем лоадер
	}

	return (//если лоадинг фолси, и уже присутствует ссылка, то будем показывать компонент ЛинкКард, который необходимо создать
		<>
			{!loading && link && <LinkCard link={link}/>}
		</>
	)
}
