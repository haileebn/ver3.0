require('dotenv').config();


let port = process.env.PORT;
let host = process.env.HOST;
let express = require('express');
let appController = require('./controllers/appController');

let app = express();
app.set('view engine', 'ejs');
app.set('view engine', 'pug');


app.use(express.static('./public'));


appController(app);

app.listen(port, function() {
    console.log("Example app listening at http://%s:%s", host, port);
});