const container = document.querySelector(".container")

//call api
const insertHTML = function (markup) {
  container.innerHTML = ""
  container.insertAdjacentHTML("afterbegin", markup)
}

const renderError = function (err) {
  const markup = `
  <p class="advice__quote">Something went wrong
  ${err.message}
  Please try again!
  </p>
  <button class="btn-change">
    <img src="./images/icon-dice.svg" alt="" />
  </button>
  `
  insertHTML(markup)
}

const getAPI = async function () {
  const advice = fetch("https://api.adviceslip.com/advice")
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(
        ".advice__number"
      ).textContent = `Advice #${data.slip.id}`
      document.querySelector(".advice__quote").textContent = data.slip.advice
    })
    .catch((err) => renderError(err))
}
// const getAPI = async function () {
//   const advice = fetch("https://api.adviceslip.com/advice")
//     .then((res) => res.json())
//     .then((data) => {
//       const markup = `
//         <h4 class="advice__number">Advice #${data.slip.id}</h4>
//         <p class="advice__quote">"${data.slip.advice}"</p>
//         <img src="./images/pattern-divider-mobile.svg" alt="" />
//         <button id="btn-change" aria-label="Button to render new advice">
//           <img src="./images/icon-dice.svg" alt="" />
//         </button>
//       `
//       insertHTML(markup)
//     })
//     .catch((err) => renderError(err))
// }

window.addEventListener("load", getAPI)

//button addEventlistener get another advice
container.addEventListener("click", function (e) {
  const btnChange = e.target.closest("#btn-change")
  console.log("click")
  getAPI()
})
