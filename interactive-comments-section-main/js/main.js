const container = document.querySelector(".container")
let commentIndex = null
let replyIndex = null
let idCounter = 0

const controlComment = async function () {
  try {
    const data = await fetch("./data.json").then((res) => res.json())

    console.log(data)
    let curUser = data.currentUser
    const comments = data.comments
    let delTarget = ""

    curUser = {
      username: curUser.username,
      image: curUser.image,
    }

    //Render UI --------------------------------------------------

    const renderComments = function (data = comments) {
      const markup = data
        .map(
          (comment) =>
            `
            <div class="feed comment" id="${comment.id}">
            <div class="feed__score--control">
              <div class="score--control">
                <img src="./images/icon-plus.svg" alt="plus" class="score--plus" />
                <span class="feed__score txt--bold txt--blue">${
                  comment.score
                }</span>
                <img
                  src="./images/icon-minus.svg"
                  alt="minus"
                  class="score--minus"
                />
              </div>
            </div>
            <div class="feed__body">
              <div class="feed__info__header">
                <div class="feed__info">
                  <img
                    src=${comment.user.image.png}
                    class="user__profile-pic"
                    alt="user's profile picture"
                  />
                  <span class="user-name txt--bold">${
                    comment.user.username
                  }</span>
                  ${
                    comment.user.username === curUser.username
                      ? `<span class="my-reply-tag">you</span>`
                      : ""
                  }
                  <span class="created-at text">${comment.createdAt}</span>
                </div>
                <div class="btn btn--group">
                  ${
                    comment.user.username === curUser.username
                      ? `
                        <button class="btn btn--del">
                          <img src="./images/icon-delete.svg" alt="delete button" />
                          <span class="btn-txt txt--bold txt--red">Delete</span>
                        </button>
                        <button class="btn btn--edit">
                          <img src="./images/icon-edit.svg" alt="edit button" />
                          <span class="btn-txt txt--bold txt--blue">Edit</span>
                        </button>
                      `
                      : `
                      <button class="btn btn--reply">
                        <img src="./images/icon-reply.svg" alt="reply button" />
                        <span class="btn-txt txt--bold txt--blue">Reply</span>
                      </button>
                    `
                  }
                </div>
              </div>
              <p class="feed__content">
                ${comment.content}
              </p>
            </div>
          </div>
          
          <!--如果有reply的話就render-->

          <ul class="feed__replies ${
            comment.replies.length === 0 ? "hidden" : ""
          }">` +
            replyMarkup(comment.replies) +
            `
          </ul>
        `
        )
        .join("")
      container.insertAdjacentHTML("afterbegin", markup)
    }

    const replyMarkup = function (data) {
      return `
      ${
        data.length === 0
          ? ""
          : data
              .map(
                (reply) => `
              <li class="feed reply" id="${reply.id}">
                <div class="feed__score--control">
                  <div class="score--control">
                    <img
                      src="./images/icon-plus.svg"
                      alt="plus"
                      class="score--plus"
                    />
                    <span class="feed__score txt--bold txt--blue">${
                      reply.score
                    }</span>
                    <img
                      src="./images/icon-minus.svg"
                      alt="minus"
                      class="score--minus"
                    />
                  </div>
                </div>
                <div class="feed__body">
                  <div class="feed__info__header">
                    <div class="feed__info">
                      <img
                        src=${reply.user.image.webp}
                        class="user__profile-pic"
                        alt="user's profile picture"
                      />
                      <span class="user-name txt--bold">${
                        reply.user.username
                      }</span>
                      ${
                        reply.user.username === curUser.username
                          ? `<span class="my-reply-tag">you</span>`
                          : ""
                      }
                      <span class="created-at text">${reply.createdAt}</span>
                    </div>
                    <div class="btn btn--group">
                    ${
                      reply.user.username === curUser.username
                        ? `
                        <button class="btn btn--del">
                          <img src="./images/icon-delete.svg" alt="delete button" />
                          <span class="btn-txt txt--bold txt--red">Delete</span>
                        </button>
                        <button class="btn btn--edit">
                          <img src="./images/icon-edit.svg" alt="edit button" />
                          <span class="btn-txt txt--bold txt--blue">Edit</span>
                        </button>
                      `
                        : `
                      <button class="btn btn--reply">
                        <img src="./images/icon-reply.svg" alt="reply button" />
                        <span class="btn-txt txt--bold txt--blue">Reply</span>
                      </button>
                    `
                    }
                    </div>
                  </div>
                  <p class="feed__content">
                    ${reply.content}
                  </p>
                </div>
              </li>`
              )
              .join("")
      }
      `
    }

    const renderInputComment = function (data = "regu") {
      const markup = `
        <div class="feed comment-area ${
          data === "regu" ? "comment-area--regu" : "replyTo"
        }">
          <img
            src=${curUser.image.webp}
            class="user__profile-pic"
            alt="Current user's profile picture"
          />
          <textarea
            name="comment"
            id="input__txt-area"
            cols="30"
            rows="5"
            class="input__txt-area"
            placeholder="Add a comment..."
          ></textarea>
          <button class="btn--regu btn--send">
            <span class="btn-txt txt--bold">send</span>
          </button>
        </div>
      `
      container.insertAdjacentHTML("beforeend", markup)
    }

    const clear = function () {
      //Becoz of the HTML structure I have to do it like this, I will fix it after first attempt!!!
      container.innerHTML = `
        <div class="overlay hidden"></div>
        <div class="del-comment-window hidden">
          <h3 class="title">Delete comment</h3>
          <p class="del-comment__content">
            Are you sure you want to delet this comment? This will remove the
            comment and can't be undone.
          </p>
          <div class="btn-wrapper">
            <button class="btn--regu btn--cancel">no, cancel</button>
            <button class="btn--regu btn--del-big">yes, delete</button>
          </div>
        </div>
      `
    }

    const render = function () {
      renderComments()
      renderInputComment("regu")
    }

    render()

    idCounter = document.querySelectorAll(".feed").length - 1

    //Function ----------------------------------------------------
    // 因為UI都係render出黎以為要係container度addEventListener
    // 最後都係用返呢個方法, 因為可以一次過套用晒btn=e.target同埋可以套用晒

    container.addEventListener("click", function (e) {
      const btn = e.target
      console.log(btn)

      //control the score
      if (
        btn.classList.contains("score--plus") ||
        btn.classList.contains("score--minus")
      )
        scoreControl(btn)

      //reply button function
      if (btn.closest(".btn--reply")) renderReplyBox(btn)

      //delete / cancel button function
      if (btn.closest(".btn--cancel")) renderDelModal()

      if (btn.closest(".btn--del")) {
        delTarget = btn.closest(".feed")
        renderDelModal()
      }

      if (btn.classList.contains("btn--del-big")) {
        delMyComment(delTarget)
      }

      if (btn.closest(".btn--send")) reply(btn)
    })

    const reply = function (target) {
      //check if the textarea is empty
      target = target.closest(".btn--send")
      const targetFeed = target.closest(".feed")
      const content = target.previousElementSibling.value
      if (!content.trim().length) return

      if (targetFeed.classList.contains("comment-area--regu")) {
        comments.push({
          id: idCounter + 1,
          replies: [],
          content: content,
          createdAt: "now",
          score: 0,
          user: curUser,
        })
        idCounter++
      }

      if (targetFeed.classList.contains("replyTo")) {
        const id = +targetFeed.previousElementSibling.getAttribute("id")
        findTargetIndex(id)
        comments[commentIndex].replies.push({
          content: content,
          createdAt: "now",
          id: idCounter + 1,
          replyingTo: targetFeed.classList.contains("replyTo")
            ? comments[commentIndex].user.username
            : comments[commentIndex].replies[replyIndex].user.username,
          score: 0,
          user: curUser,
        })
        idCounter++
        // if (targetFeed.previousElementSibling.classList.contains("comment")) {
        //   const id = +targetFeed.previousElementSibling.getAttribute("id")
        //   findTargetIndex(id)
        //   comments[commentIndex].replies.push({
        //     content: content,
        //     createdAt: "now",
        //     id: idCounter + 1,
        //     replyingTo: "maxblagun",
        //     score: 0,
        //     user: curUser,
        //   })
        //   idCounter++
        // }

        // if (targetFeed.previousElementSibling.classList.contains("reply")) {
        //   const id = +targetFeed.previousElementSibling.getAttribute("id")
        //   console.log(id)
        //   findTargetIndex(id)
        //   comments[commentIndex].replies.push({
        //     content: content,
        //     createdAt: "now",
        //     id: idCounter + 1,
        //     replyingTo: "maxblagun",
        //     score: 0,
        //     user: curUser,
        //   })
        //   idCounter++
        // }
      }

      clear()
      render()
    }

    const findTargetIndex = function (id) {
      commentIndex = null
      replyIndex = null

      commentIndex = comments.findIndex((comment) => comment.id === id)
      if (commentIndex !== -1) return

      comments.forEach((comment, i) => {
        replyIndex = comment.replies.findIndex((reply) => reply.id === id)
        if (replyIndex !== -1) commentIndex = i
      })
    }

    const delMyComment = function (target) {
      const id = +delTarget.getAttribute("id")
      findTargetIndex(id)
      if (commentIndex !== null && replyIndex !== null)
        comments[commentIndex].replies.splice(replyIndex, 1)

      if (commentIndex !== null && replyIndex === null)
        comments.splice(commentIndex, 1)

      clear()
      render()
      // console.log(
      //   `this is the comment index: ${commentIndex} and reply index: ${replyIndex}`
      // )
    }

    const scoreControl = function (target) {
      //score++
      if (
        target.classList.contains("score--plus") ||
        target.classList.contains("score--minus")
      ) {
        //update DOM
        target.classList.contains("score--plus")
          ? +target.nextElementSibling.textContent++
          : +target.nextElementSibling.textContent--

        //update data
        const id = +target.closest(".feed").getAttribute("id")
        findTargetIndex(id)
        if (commentIndex !== null && replyIndex !== null)
          target.classList.contains("score--plus")
            ? comments[commentIndex].replies[replyIndex].score++
            : comments[commentIndex].replies[replyIndex].score--

        if (commentIndex !== null && replyIndex === null)
          target.classList.contains("score--plus")
            ? comments[commentIndex].score++
            : comments[commentIndex].score--

        console.log(comments)
      }

      //score--
      // if (
      //   target.classList.contains("score--minus") &&
      //   +target.previousElementSibling.textContent > 0
      // )
      //   +target.previousElementSibling.textContent--
    }

    const renderReplyBox = function (target) {
      const hasReplyTo = document.querySelector(".replyTo")
      const nextEl = target.closest(".feed").nextElementSibling
      if (nextEl.classList.contains("replyTo")) {
        nextEl.remove()
        return
      }

      if (hasReplyTo) hasReplyTo.remove()
      const markup = `
          <div class="feed comment-area replyTo">
            <img
              src=${curUser.image.webp}
              class="user__profile-pic"
              alt="Current user's profile picture"
            />
            <textarea
              name="comment"
              id="input__txt-area"
              cols="30"
              rows="5"
              class="input__txt-area"
              placeholder="Add a comment..."
            ></textarea>
            <button class="btn--regu btn--send">
              <span class="btn-txt txt--bold">send</span>
            </button>
          </div>
      `
      target.closest(".feed").insertAdjacentHTML("afterend", markup)
    }

    const renderDelModal = function () {
      document.querySelector(".overlay").classList.toggle("hidden")
      document.querySelector(".del-comment-window").classList.toggle("hidden")
    }
  } catch (err) {
    console.error(err.message)
  }
}

controlComment()

//注意: 冇用join()會無啦啦有,
