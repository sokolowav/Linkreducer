import { useState, useCallback } from 'react'

export const useHttp = () => {
	//экспортируем хук useHttp, к-ый будет позволять работать с асинхронными запросами на сервер, используя нативный Api Fetch
	const [loading, setLoading] = useState(false) //создаем стэйт loading, по умолчанию в False с ф-ией setLoading// таким образом в хуке useHttp будем сами определять, грузится ли что-либо или нет и в компонентах, будем просто взаимодействовать с этим флагом
	const [error, setError] = useState(null) //аналогичный стейт по ошибкам, с null по умолчанию
	const request = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			//здесь useHttp принимает body, как  строку, отсюда косяк с [object Object]
			setLoading(true) //нужно правильно отобразить loading, начинаем делать запрос (true)//loading пошел
			try {
				if (body) {
					body = JSON.stringify(body) //проверяем, есть ли body, если да, то приводим к строке, не, то по умолчанию null (body не учитывается)
					headers['Content-Type'] = 'application/json' //явно указываем, что передаем json файл
				}
				const response = await fetch(url, {
					method,
					body,
					headers,
				}) //обращаемся к браузерному методу Fetch, 1-ый параметр = url, 2-ой = набор опций (в данном случае специально названы таким образом, чтобы совпадали с Api)// когда дождались ответ с сервера - получаем объект response
				const data = await response.json() //дальше необходимо ответ распарсить, приводим в формат json

				if (!response.ok) {
					throw new Error(data.message || `Something's going wrong way:[`)
				} //далее проверяем поле .ok на falsy, и если есть ошибка, её выкидываем через data.message (по-умолчанию также прописываем)
				setLoading(false) //запрос прошёл, даже если с ошибкой, вызываем loading с false
				return data //если все хорошо и ошибок нет, возвращаем data которая прилетела с сервера
			} catch (e) {
				setLoading(false) //даже если у нас ошибка, значение false, так как запрос отработал
				setError(e.message) //выдает ошибку из инстанса 'new Error(data.message || `Something's going wrong way:[`)'
				throw e //выкидываем ошибку, чтобы обрабатывать ее в компонентах
			}
		},
		[]
	) //чтобы реакт не входил в рекурсию, оборачиваем асинхронную функцию в хук useCallback, что принимает в себя юрл, метод(по умолчанию get), бади (null) и хэдерс (пустой объект) в коллбэк функцию, для корректной работы //первый параметр - асинхронная функция, второй = набор зависимостей (пока что пустой массив)
	const clearError = useCallback(() => setError(null), []) //функция, что будет чистить ошибки
	return { loading, request, error, clearError } //Возвращать будем объект, где флаг loading, ф-ия request
}
//хук готов, можем использовать (в AuthPage)
