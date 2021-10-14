const express = require('express')//подключаем express через глобальную функцию для подключения пакетов в Node (require)
const config = require('config')//поключаем константы из default.json
const path = require('path')//модуль, чтоб указать путь
const mongoose = require('mongoose')//подключаем пакет для работы с Mongodb

const app = express()//результат работы ф-ии express(), app - будующий сервер

app.use(express.json({ extended: true }))//подключаем миддлвеар для того, чтобы Node.js корректно парсил наш body// в него добавим параметр extended в значении true

app.use('/api/auth', require('./routes/auth.routes'))// регистрируем роуты, к-ые будут по-разному обрабатывать Api запросы с нашего frontend'а через метод use(), где первый аргумент (в случае регистрации роутов) = строчка, которая будет префиксом для будующего пути, второй параметр = сам роут (новая папка и файл auth.routes.js)
app.use('/api/link', require('./routes/link.routes'))// аналогично
app.use('/t', require('./routes/redirect.routes'))// для редиректа

//Так как при запуске сервера необходимо не только формировать API, но и отдавать фронт-енд
if (process.env.NODE_ENV === 'production') {//если системная переменная NODE_ENV есть продакшен (скрипт, что мы добавляли  в package.json 7стр), то отдаем статику
	//т.е если запрос идет на корень приложения, добавляем мидлвеар express.static(), чтобы указать нашу статическую  папку
	app.use('/', express.static(path.join(__dirname, 'client', 'build')))// добавляем __dirname (- текущая директория) в папку client/build (где вся статика)

  app.get('*', (req, res) => {//при любом другом get запросе (*) отправляем файл в client/build/index.html
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}//тем самым будет работать и фронд и бэк одновременно

const PORT = config.get('port') || 5000//получаем значение константы из default.json 'port'

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {//подключаемся к Монго через метод коннект, добавляем await, чтобы дождаться выполнения промиса. Первый аргумент = адресс Uri БД, второй - набор опций
      useNewUrlParser: true, //!!!!!!!!!!!!!!!!!!!!!2 строки далее коментировать!!!!!!!!!!!!!!!!!!!
      //useUnifiedTopology: true,
      //useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))//метод listen будующего сервера, где 1-ый аргумент = порт, второй = колл-бэк ф-ия //только после того, как БД подсоединится, будем запускать сервер
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)//выход из процесса Node с помощью глобального объекта process
  }
}// async оболочка для промиса, к-ый возвращает метод connect, предоставляющий доступ к БД

start()