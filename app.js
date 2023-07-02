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

// key值為短網址，value值為原網址
const database = {};

app.get('/', (req, res) => {
  res.render('index')
});

// 接收使用者請求
app.get('/:shortUrl', (req, res) => {
  // 將請求中的網址丟進變數shortUrl中
  // 將shortUrl當作變數來查找database裡有無對應的原網址，並丟進變數originalUrl中
  const shortUrl = req.params.shortUrl
  const originalUrl = database[shortUrl]

  // 若有找到，就將頁面導向原網址，若沒有，則回應狀態碼404
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Can't find the short URL!")
  }
})

// 當用戶點擊Shorten時判斷網址，輸入相同網址時，產生一樣的短網址
app.post('/shorten', (req, res) => {
  // 將用戶輸入網址丟掉變數originalUrl裡面
  // 在資料庫比對有無跟使用者輸入的網址匹配的資料
  const originalUrl = req.body.url
  const existingShortUrl = Object.keys(database).find(
    (shortUrl) => database[shortUrl] === originalUrl
  )
  // 如果找不到，就產生一個新的短網址，並存進資料庫裡
  // 如果找到，就將資料庫裡的短網址拿出來給使用者
  if (!existingShortUrl) {
    const shortUrl = generateShortUrl()
    database[shortUrl] = originalUrl
    res.render('success', { shortUrl })
  } else {
    res.render('success', { shortUrl: existingShortUrl });
  }

})

// 產生隨機五個亂數
function generateShortUrl() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ''
  const length = 5;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  // 避免不同原網址產生一樣的短網址
  // 產生後先去資料庫比對，若重複就重新產生
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
