//создаем мидлвеар, чтобы решить задачу с определением Id текущего пользователя// мидлвеар по сути - функция, которая перехватывает определенные данные и делает определенную логику
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
	//принимаем стандартные параметры = req,res и метод next(к-ый позволяет дальнейшее выполнение запроса)
	if (req.method === 'OPTIONS') {
		//специальная метод, который присутствует в restApi и по сути проверяет доступность сервера
		return next() //если опшенс, то ничего делать не нужно и продолжаем дальше осуществлять запрос
	}
	//если запрос post или get, будем обрабатывать через try/catch
	try {
		const token = req.headers.authorization.split(' ')[1] // это строка, которую будем передавать с frontа и выглядит она типа Bearer TOKEN, поэтому можем распарсить и получить сам токен//разбиваем по пробелу splitом и забираем из получившегося массива вторую часть
		if (!token) {
			//если токена нет, значит пользователь не авторизован
			return res.status(401).json({ message: 'Autherization is needed.' }) //401  -  ошибка авторизации, методом json даем соответствующее сообщение, return чтобы код дальше не выполнялся
		}
		//если токен есть, необходимо его раскодировать, подключим библ-у jwttoken и создадим переменную
		const decoded = jwt.verify(token, config.get('jwtSecret')) //метод первым параметром берет токен, а второй имя кода, что дали при формировании токена (в default.json)= jwtSecret//config не забываем подключать
		req.user = decoded //положим раскодированный токен в поле user
		next()
	} catch (e) {
		return res.status(401).json({ message: 'Autherization is needed.' }) //если ошибка выдаем такую же 401ую ошибку
	}
}
/*
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next()
	}

	try {
		const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

		if (!token) {
			return res.status(401).json({ message: 'Нет авторизации' })
		}

		const decoded = jwt.verify(token, config.get('jwtSecret'))
		req.user = decoded
		next()
	} catch (e) {
		res.status(401).json({ message: 'Нет авторизации' })
	}
}
*/
