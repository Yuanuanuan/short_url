const express = require('express');
const { engine } = require('express-handlebars')
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs');
app.set('views', './views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const database = {};

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl
  const originalUrl = database[shortUrl]

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Can't find the short URL!")
  }
})

app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url
  const existingShortUrl = Object.keys(database).find(
    (shortUrl) => database[shortUrl] === originalUrl
  )
  if (!existingShortUrl) {
    const shortUrl = generateShortUrl()
    database[shortUrl] = originalUrl
    res.render('success', { shortUrl })
  } else {
    res.render('success', { shortUrl: existingShortUrl });
  }

})

app.get('/back', (req, res) => {
  res.redirect('/')
})

function generateShortUrl() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ''
  const length = 5;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  if (database[result]) {
    return generateShortUrl();
  } else {
    return result;
  }
}

const port = 3000;
app.listen(port, () => {
  console.log(`伺服器已啟動，監聽在 http://localhost:${port}`);
});
