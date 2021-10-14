import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'

export const CreatePage = () => {
	const history = useHistory() //используя хук useHistory (подключаем из react-router-dom), получаем history (для редиректа(27))
	const auth = useContext(AuthContext)
	const { request } = useHttp() //из хука получаем объект, здесь нам понадобится request
	const [link, setLink] = useState('') //создаем локальный стейт (не забываем подключить) и подвязываем к onChange input'a
	useEffect(() => {
		window.M.updateTextFields()
	}, []) //для того, чтоб красиво выглядели поля формы, не забываем подключить
	const pressHandler = async event => {
		//функция, что будет обрабатывать ентер строки input
		if (event.key === 'Enter') {
			//проверяем энтер ли был нажат, если да, делаем асинхроный запрос(потребуется хук, к-ый мы создали, что работает с http(5))
			try {
				const data = await request(
					'/api/link/generate',
					'POST',
					{ from: link },
					{
						Authorization: `Bearer ${auth.token}`, //токен(6), что хранится в объекте auth нужно добавить в хэдер
					}
				) //запрос будет на ендпойнт, к-ый уже создан,выполнять будем метод post, отправлять объект с from:link (получаем из этого объект, содержащий инфо о link)
				history.push(`/detail/${data.link._id}`) //редирект на страницу Detail с id новой ссылки
			} catch (e) {}
		}
	}

	return (
		<div className="row">
			<div className="col.s8.offset-s2" style={{ paddingTop: '2rem' }}>
				<div className="input-field">
					<input
						placeholder="Input link"
						id="link"
						type="text"
						value={link}
						onChange={e => setLink(e.target.value)}
						onKeyPress={pressHandler}
					/>
					<label htmlFor="link">Input link</label>
				</div>
			</div>
		</div>
	)
}
