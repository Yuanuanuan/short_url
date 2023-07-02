const express = require('express');
const exphbs = require('express-handlebars')
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');

app.engine('.hbs', exphbs());
app.set('view engine', '.hbs');
app.set('views', './views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const database = {};

app.get('/', (req, res) => {
  res.render('index')
});

app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url
  const existingShortUrl = Object.keys(database).find(
    (shortUrl) => database[shortUrl] === originalUrl
  )
  if (!existingShortUrl) {
    const shortUrl = generateShortUrl()
    database[shortUrl] = originalUrl
  }

  res.render('sucess')

})

app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl
  const originalUrl = database[shortUrl]

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Can't find the short URL!")
  }
})

function generateShortUrl() {
  return shortid.generate()
}
const port = 3000;
app.listen(port, () => {
  console.log(`伺服器已啟動，監聽在 http://localhost:${port}`);
});
