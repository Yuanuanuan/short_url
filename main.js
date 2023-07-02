// const copy = document.querySelector('.copy');
// const link = document.querySelector('.short_url');

// copy.addEventListener('click', e => {
//   e.preventDefault(); // 阻止按鈕的預設行為

//   const textToCopy = link.textContent;

//   navigator.clipboard.writeText(textToCopy)
//     .then(() => {
//       console.log('copied');
//       // 在複製成功後執行相應的邏輯，例如顯示成功訊息等
//     })
//     .catch(error => {
//       console.error('error', error);
//       // 在複製失敗後執行相應的邏輯，例如顯示錯誤訊息等
//     });
// });
function copy() {
  const URL = document.getElementById("URL")
  navigator.clipboard.writeText(URL.innerText)
    .then(() => alert('copied'))
    .catch(error => console.log(error))
}