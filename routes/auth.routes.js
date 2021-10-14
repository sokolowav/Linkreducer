const { Router } = require('express') //подключаем роуты и роутеры из Express'а
const bcrypt = require('bcryptjs') //присоединяем библиотеку для хеширования паролей user (помимо хеширования позволяет пароли и сравнивать)
const jwt = require('jsonwebtoken') //присоединяем библиотеку для создания токена
const config = require('config') //получаем доступ до секретного jwt
const { check, validationResult } = require('express-validator') //присоединяем библиотеку валидации// метод check и функция validationResult
const User = require('../models/User') //подключаем модель User
const router = Router()

// реализуем обрабтку 2х post-запросов (end-point), первый аргумент = хвостик пути, второй = функция, что принимает в себя реквест и респонс
// /api/auth уже есть в префиксе, конкотенируем с.../register
router.post(
	'/register',
	[
		check('email', 'Email isnt correct.').isEmail(),
		check('password', 'Minimal lenght of password is 6 characters.').isLength({
			min: 6,
		}), //встроенный валидатор - функция, принимающая в себя объект
	], //мидлвеар, необходимый для валидации
	async (req, res) => {
		try {
			const errors = validationResult(req) //обработка экспресс-валидатора

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Invalid data for registration.',
				})
			} //Если есть ошибки валидации, возвращаем на фронт

			const { email, password } = req.body //получаем поля почты и пароля из объекта реквест //данные, что будут прилетать с front'а

			const candidate = await User.findOne({ email }) //переменная, в которую после проверки моделью пользователя по почте, будет добавлен пользователь // через метод FindOne по объекту email

			if (candidate) {
				return res.status(400).json({ message: 'This user does already exist' }) //сообщение по результату проверки мыла на уникальность
			}

			const hashedPassword = await bcrypt.hash(password, 12) //переменная для хранения хешированных паролей = метод хеш библиотеки bcrypt с параметрами пароль с фронтенда и некоторый солд
			const user = new User({ email, password: hashedPassword }) //если проверки пройдены, создаем нового пользователя через конструктор User

			await user.save() //ждем пока данные нового пользователя сохрянятся в БД

			res.status(201).json({ message: 'User was created.' }) //дождавшись, отвечаем фронту
		} catch (e) {
			res
				.status(500)
				.json({ message: 'Something goes wrong, try again later.' }) //c помощью объекта response, задаем статус для ответа 500 - серверная ошибка // с помощью метода json - возвращаем сообщение об ошибке
		}
	}
)
// api/auth - уже есть в префиксе, конкотенируем c.../login
router.post(
	'/login',
	[
		check('email', 'Введите корректный email').normalizeEmail().isEmail(),
		check('password', 'Введите пароль').exists(),
	],
	async (req, res) => {
		//обработка экспресс-валидатора
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Incorrect data for enter.',
				}) //Если есть ошибки валидации, возвращаем на фронт
			}

			const { email, password } = req.body

			const user = await User.findOne({ email }) //ищем есть ли такой емэйл среди зарегестрированных пользователей

			if (!user) {
				return res
					.status(400)
					.json({ message: 'User with entered data doesnt exists' })
			}

			const isMatch = await bcrypt.compare(password, user.password) //проверка на соответствие пароля с БД

			if (!isMatch) {
				return res
					.status(400)
					.json({ message: 'Password is incorrect, please try again.' }) //если пароль не совпадает
			}

			const token = jwt.sign(
				{ userId: user.id }, //обращаемся к библиотеке jwt и через метод sign создаем токен и передаем в него набор параметров. Первый объект, в котором будут данные, что будут шифроваться Токеном
				config.get('jwtSecret'), //второй параметр - некий секретный код(создадим его в config/default), в конечном итоге это будет просто строкой

				{
					expiresIn: '1h', //третий параметр - объект, с методом expair (срок действия пароля, допустим, час)
				}
			)

			res.json({ token, userId: user.id }) // если все хорошо, отвечаем пользователю и наш логин завершен
		} catch (e) {
			res
				.status(500)
				.json({ message: 'Something goes wrong, try again later.' }) //c помощью объекта response, задаем статус для ответа 500 - серверная ошибка // с помощью метода json - возвращаем сообщение об ошибке
		}
	}
)

module.exports = router //экспортируем из модуля роутер
