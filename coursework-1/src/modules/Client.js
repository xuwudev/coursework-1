import { root, button, ajax, changeButtonsValue, config } from "./config.js"
import Modal from "./Modal.js"
import Dashboard from "./Dashboard.js"

export default class Client {
  constructor(body) {
    this.body = body
  }

  auth() {
    try {
      const thread = new Promise((resolve, reject) => {
        this.login().then((res) => {
          resolve(localStorage.setItem("token", res))
          new Dashboard().update()
        })
        button.removeEventListener("click", this.setup)
        button.addEventListener("click", () => new Dashboard().createVisit())
      })
      thread.then(() => changeButtonsValue())
      thread.catch((err) =>
        console.log(`${err} \n >>> Promise "thread" error: login failure `)
      )
    } catch (err) {
      throw new Error(err)
    }
  }

  setup() {
    if (document.getElementById("auth-form") === null) {
      const auth = new Modal({
        place: root,
        id: "auth-form",
        title: "Авторизація",
      })
      const form = auth.add()
      auth.input({ id: "auth-email", type: "text", placeholder: "Пошта" })
      auth.input({
        id: "auth-password",
        type: "password",
        placeholder: "Пароль",
      })
      const div = auth.wrap("button-wrapper")
      config.authorize.place = div
      config.cancel.place = div
      auth.button(config.authorize).addEventListener(
        "click",
        () => {
          document.getElementById("welcome").remove()
        },
        { once: true }
      )
      auth.button(config.cancel)
    }
  }

  login() {
    try {
      return fetch(`${ajax.url}login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(ajax.account),
      }).then((res) => res.text())
    } catch (err) {
      console.log(new Error(err))
    }
  }

  async get() {
    try {
      const req = await fetch(ajax.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token()}`,
        },
      })
      return await req.json()
    } catch (err) {
      console.log(new Error(err))
    }
  }

  async card(id) {
    try {
      const req = await fetch(`${ajax.url}${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token()}`,
        },
      })
      return await req.json()
    } catch (err) {
      console.log(new Error(err))
    }
  }

  async post() {
    try {
      const req = await fetch(ajax.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token()}`,
        },
        body: JSON.stringify(this.body),
      })
      return await req.json()
    } catch (err) {
      console.log(new Error(err))
    }
  }

  async put(id) {
    try {
      const req = await fetch(`${ajax.url}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token()}`,
        },
        body: JSON.stringify(this.body),
      })
      return await req.json()
    } catch (err) {
      console.log(new Error(err))
    }
  }

  async delete(id) {
    try {
      const req = await fetch(`${ajax.url}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${config.token()}` },
      })
      return await req.text()
    } catch (err) {
      console.log(new Error(err))
    }
  }
}
