//роут, к-ый будет отвечать за генерацию "сокращаемых" ссылок
const { Router } = require('express') //подключаем роуты c express
const config = require('config') //подключаем конфиг
const shortid = require('shortid')
const Link = require('../models/Link') //подключаем модель
const auth = require('../middleware/auth.middleware') //подключаем мидлвеар и добавляем в роутер Гет
const router = Router() //создаем роутер, где необходимо оформить несколько запросов

router.post('/generate', auth, async (req, res) => {
	try {
		const baseUrl = config.get('baseUrl') //получаем конфиг с baseUrl (из default.json)
		const { from } = req.body //получаем с фронтенда объект from

		const code = shortid.generate() //получаем уникальный код в Code методом generate

		const existing = await Link.findOne({ from }) //проверим есть ли у нас в базе такая ссылка from, если такая ссылка есть, значит по ней мы данные формировали и нет смысла их снова формировать

		if (existing) {
			return res.json({ link: existing }) //return чтобы код дальше не шел
		}

		const to = baseUrl + '/t/' + code //создаем ту ссылку, что будет сокращенной и работать на нашем сервисе // t - сокращенно от to

		const link = new Link({
			code,
			to,
			from,
			owner: req.user.userId, //чтоб данный формат был доступен, не забываем в router.post добавить мидлвеар auth, чтобы неавторизованные пользователи не могли создавать ссылки
		})

		await link.save() //сохраняем link, метод вернет нам промис

		res.status(201).json({ link }) //(201 статус = created) в jsonе передаем линк
	} catch (e) {
		res.status(500).json({ message: 'Something goes wrong, try again later.' }) //c помощью объекта response, задаем статус для ответа 500 - серверная ошибка // с помощью метода json - возвращаем сообщение об ошибке
	}
}) //в-первую очередь пост с запросом, чтобы обрабатывала ссылку generate, который и будет генерировать эту ссылку

router.get('/', auth, async (req, res) => {
	try {
		//получаем объект Линкс и ждем пока модель найдет все ссылки, которые относятся к данному пользователю
		const links = await Link.find({ owner: req.user.userId }) // пока ставим null, нужно решить задачу, как передавать сюда конкретного текущего пользователя, знаем, что в jwt token мы включили userId, соответственно используем это - создадим мидлвеар auth.middlewear.js
		res.json(links)
	} catch (e) {
		res.status(500).json({ message: 'Something goes wrong, try again later.' }) //c помощью объекта response, задаем статус для ответа 500 - серверная ошибка // с помощью метода json - возвращаем сообщение об ошибке
	}
}) //во-вторую гет запрос для обработки всех ссылок

router.get('/:id', auth, async (req, res) => {
	try {
		//получаем объект Линк и ждем пока модель найдет все ссылки, которые относятся к данному пользователю
		const link = await Link.findById(req.params.id) // нужно решить задачу, как передавать сюда конкретного текущего пользователя, делаем через метод req.params.id
		res.json(link) //если все хорошо получаем Link
	} catch (e) {
		res.status(500).json({ message: 'Something goes wrong, try again later.' }) //c помощью объекта response, задаем статус для ответа 500 - серверная ошибка // с помощью метода json - возвращаем сообщение об ошибке
	}
}) //в-третьих гет запрос для получения ссылки по ID

module.exports = router //экспортируем роутер
