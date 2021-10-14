const {Router} = require('express')// получаем роутер из экспресса
const Link = require('../models/Link')//так же понадобится модель ссылки
const router = Router()//создание объекта Роутера

//реализуем метод через ГЕТ, где будем получать динамический код code, (здесь мидлвеар проверки авторизации не нужен, т.к нужно, чтобы любой пользователь мог перейти по ссылке)
router.get('/:code', async (req, res) => {
  try {//здесь необходимо получить ту ссылку, по которой работаем с code

    const link = await Link.findOne({ code: req.params.code })//ищем единственную ссылку у которой код совпадает с нужным ключом через объект params
    //дальше делаем логику, если в ссылке что-то есть
    if (link) {//аналитика у нас будет считать количество кликов по ссылке
      link.clicks++
      await link.save()//сохраняем счетчик
      return res.redirect(link.from)//redirect на оригинальную ссылку
    }

    res.status(404).json('Link does not exist.')//если в ссылке ничего нет возвращаем статус 404

  } catch (e) {
    res.status(500).json({ message: 'Something goes wrong, try again later.' })//c помощью объекта response, задаем статус для ответа 500 - серверная ошибка // с помощью метода json - возвращаем сообщение об ошибке
  }
})


module.exports = router//экспортируем роутер, и подключаем его в app.js