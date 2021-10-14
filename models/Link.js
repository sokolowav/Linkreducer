//аналогично User.js//модель для ссылок пользователя
const { Schema, model, Types } = require('mongoose') //для создания модели пользователя, работаем с Монгузом и забираем 2 поля Schema и ф-ию model

const schema = new Schema({
	//создаем schema через конструктор Schema
	from: { type: String, required: true }, //поле, чтобы понимать откуда ссылка идет
	to: { type: String, required: true, unique: true }, //поле, чтобы понимать куда ссылка идет, сделаем уникальной
	code: { type: String, required: true, unique: true },
	date: { type: Date, default: Date.now }, //дата, когда ссылка создана, по умолчанию передаем метод Date.now, не вызывая его
	clicks: { type: Number, default: 0 }, //аналитика кликов, по умолчанию 0
	owner: { type: Types.ObjectId, ref: 'User' }, //связываем ссылки с пользователем, который их создал ('User' совпадает с module.exports в User.js)
})

module.exports = model('Link', schema) // экспортируем из файла результат работы ф-ии model, где даем название нашей модели, в данном случае Линкс, и схему, по к-ой она будет работать - объкт schema
