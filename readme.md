1. создаем repo на heroku

2. npm init, создаем package.json

3. устанавливаем модули 
npm install --save body-parser express express-handlebars mongodb mongoose

4. подключаем все зависимости в server.js

5. создаем БД, добавляем User и подключаем
mongoose.connect('mongodb://<dbuser>:<dbpassword>...');

6. устанавливаем порт, корневыю директорию и парсер
app.set('port', process.env.PORT || 8080);
все href и src отталкиваются от папки /public
app.use(express.static(__dirname + '/public'));	
app.use(bodyParser.json());

7. в самый конец добавляем 404, 500, app.listen()

8. добавляем post и get

9. добавляем модель поста (на сервере к YOUR-COLLECTOIONS-NAME добавляется s если ее там нет)
var Post = mongoose.model('YOUR-COLLECTOIONS-NAME', { 
	title: String,
	text: String 
});

10. mkdir views/layouts public/{css,img} my_modules -p

11.	touch views/layouts/main.handlebars views/{404.handlebars,500.handlebars,index.handlebars,blog.handlebars} public/css/style.css my_modules/db.js .gitignore


npm install --save bcryptjs connect-flash cookie-parser express-messages express-session express-validator passport passport-http passport-local

12. touch Procfile
	web: node server.js
