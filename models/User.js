const { Schema, model, Types } = require('mongoose') //для создания модели пользователя, работаем с Монгузом и забираем 2 поля Schema и ф-ию model

const schema = new Schema({
	//создаем schema через конструктор Schema
	email: { type: String, required: true, unique: true }, //задаем поля, к-ые будут // String - класс JS; флаг, что поле необходимо; и флаг, что почта уникальна
	password: { type: String, required: true },
	links: [{ type: Types.ObjectId, ref: 'Link' }], //у каждого пользователя будет свой массив ссылок, и для того, чтобы каждый пользователь видел только свои данные, задаем массив с типом Type.ObjectId - связка модели пользователя и определенных записай в БД; и привязку к коллекции Link, что создадим далее
})

module.exports = model('User', schema) // экспортируем из файла результат работы ф-ии model, где даем название нашей модели, в данном случае User, и схему, по к-ой она будет работать - объкт schema
