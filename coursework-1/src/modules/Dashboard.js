import { config, root, button, ajax, welcome } from "./config.js"
import VisitCardiologist from "./VisitCardiologist.js"
import VisitDentist from "./VisitDentist.js"
import VisitTherapist from "./VisitTherapist.js"
import { Input, Select, TextArea, Button } from "./components.js"
import Client from "./Client.js"
import Modal from "./Modal.js"
import Visit from "./Visit.js"

export default class Dashboard {
  constructor() {
    root.addEventListener("click", this.escape)
    root.addEventListener("click", (ev) => {
      if (document.getElementById("edit-form") === null) {
        return
      } else {
        ev.target.id === "filter" ||
        ev.target.id === "dashboard" ||
        ev.target.className === "modal-title" ||
        ev.target.className === "card" ||
        ev.target.id === "delete" ||
        ev.target.className === "card-title" ||
        ev.target.id === "filter-urgency" ||
        ev.target.id === "filter-doctor" ||
        ev.target.id === "filter-purpose" ||
        ev.target.id === "filter-urgency-label" ||
        ev.target.id === "filter-doctor-label" ||
        ev.target.id === "filter-purpose-label"
          ? document.getElementById("edit-form").remove()
          : false
      }
    })
  }

  init() {
    const client = new Client({})
    config.token()
      ? (button.textContent = "Створити візит")
      : button.addEventListener("click", client.setup)
    if (config.token() && button.textContent === "Створити візит") {
      button.addEventListener("click", this.createVisit)
      this.update()
    } else {
      welcome()
    }
  }

  createVisit() {
    if (document.getElementById("visit-form") === null) {
      ajax.unset()
      new VisitCardiologist({})
      new VisitDentist({})
      new VisitTherapist({})
    } else {
      return
    }
  }

  filter() {
    const modal = new Modal({
      title: "Фільтрувати візити за",
      id: "filter",
      place: root,
    })
    const filter = modal.add()
    new Select({ id: "filter-doctor-select", place: filter })
      .filterBy(config.filterValues.doctor, filter)
      .addEventListener("click", (ev) => {
        ev.target.value === "Всі"
          ? (config.searchValues.doctor.all = true)
          : (config.searchValues.doctor.all = false)
        config.searchValues.doctor.picked = ev.target.value
      })
    new Select({ id: "filter-urgency-select", place: filter })
      .filterBy(config.filterValues.urgency, filter)
      .addEventListener("click", (ev) => {
        ev.target.value === "Всі"
          ? (config.searchValues.urgency.all = true)
          : (config.searchValues.urgency.all = false)
        config.searchValues.urgency.picked = ev.target.value
      })
    new Input({ place: filter, type: "text", id: "filter-purpose" })
      .filter(config.filterValues)
      .addEventListener("blur", (ev) => {
        config.searchValues.purpose.value = ev.target.value
        ev.target.value === undefined || ev.target.value === ""
          ? (config.searchValues.purpose.content = false)
          : (config.searchValues.purpose.content = true)
      })
    const wrapper = modal.wrap("button-wrapper", "div")
    config.search.place = wrapper
    config.reset.place = wrapper
    new Button(config.search)
    new Button(config.reset)
  }

  search(cards, dashboard) {
    cards
      .map((card) => {
        if (
          card.children[0].textContent !== config.searchValues.doctor.picked
        ) {
          return card
        }
      })
      .map((card) => {
        if (card === undefined) {
          return
        } else {
          if (
            card.children[1].children[2].lastElementChild.textContent !==
            config.searchValues.urgency.picked
          ) {
            return card
          }
        }
      })
      .map((card) => {
        if (card === undefined) {
          return
        } else {
          if (
            card.children[1].children[1].lastElementChild.textContent !==
            config.searchValues.purpose.value
          ) {
            return card
          }
        }
      })
      .forEach((card) => {
        if (card === undefined) {
          return
        } else {
          card.remove()
          config.searchValues.clear()
          if (dashboard.length <= 1) {
            alert("Збігів не знайдено")
            this.reload()
          }
        }
      })
  }

  update() {
    this.filter()
    if (document.getElementById("dashboard") === null) {
      const dashboard = new Modal({
        place: root,
        id: "dashboard",
        title: "Створені візити",
      })
      const form = dashboard.add()
      new Client({}).get().then((res) => {
        if (res.length === 0) {
          this.empty(form)
        } else {
          res.forEach((visit) => this.card(form, visit))
        }
      })
    } else {
      document.getElementById("dashboard").children[1] === undefined
        ? this.empty(document.getElementById("dashboard"))
        : false
    }
  }

  card(place, visit) {
    localStorage.setItem(`${visit.id}`, JSON.stringify(visit))
    place.insertAdjacentHTML(
      "beforeend",
      `
          <div id="${visit.id}" class="card">
            <header class="card-title">${visit.doctor}</header>
            <ul>
              <li>Ім'я<p>${visit.name}</p></li>
              <li>Мета візиту<p>${visit.purpose}</p></li>
              <li>Терміновість<p>${visit.urgency}</p></li>
            </ul>
          </div>`
    )
    const wrapper = new Modal({}).wrap(
      "button-wrapper",
      "div",
      document.getElementById(`${visit.id}`)
    )
    new Button({
      type: "button",
      value: "Розгорнути",
      id: `folding-${visit.id}`,
      className: "folding",
      place: wrapper,
    })
    new Button({
      type: "button",
      value: "Редагувати",
      id: `edit-${visit.id}`,
      className: "edit",
      place: wrapper,
    })
    new Button({
      type: "button",
      value: "&#x274C",
      id: `delete-${visit.id}`,
      className: "delete",
      place: document.getElementById(`${visit.id}`),
    })
  }

  folding(card, folding, fold = false) {
    if (localStorage.getItem(`${card.id}`) !== null) {
      folding.textContent = "Згорнути"
      const visit = JSON.parse(localStorage.getItem(`${card.id}`))
      if (visit.doctor === "Кардіолог") {
        card.children[1].insertAdjacentHTML(
          "beforeend",
          `
        <li>Опис візиту<p>${visit.description}</p></li>
        <li>Тиск зазвичай<p>${visit.pressure}</p></li>
        <li>Перенесені хвороби серця<p>${visit.heartDiseases}</p></li>
        <li>Індекс маси тіла<p>${visit.bodyMassIndex}</p></li>
        <li>Вік<p>${visit.age}</p></li>`
        )
      } else if (visit.doctor === "Дантист") {
        card.children[1].insertAdjacentHTML(
          "beforeend",
          `
        <li>Опис візиту<p>${visit.description}</p></li>
        <li>Дата останнього візиту<p>${visit.lastVisitDate}</p></li>`
        )
      } else if (visit.doctor === "Терапевт") {
        card.children[1].insertAdjacentHTML(
          "beforeend",
          `
        <li>Опис візиту<p>${visit.description}</p></li>
        <li>Вік<p>${visit.age}</p></li>`
        )
      }
    } else {
      folding.textContent = "Згорнути"
      new Client({}).card(card.id).then((visit) => {
        localStorage.setItem(`${visit.id}`, JSON.stringify(visit))
        if (visit.doctor === "Кардіолог") {
          card.children[1].insertAdjacentHTML(
            "beforeend",
            `
          <li>Опис візиту<p>${visit.description}</p></li>
          <li>Тиск зазвичай<p>${visit.pressure}</p></li>
          <li>Перенесені хвороби серця<p>${visit.heartDiseases}</p></li>
          <li>Індекс маси тіла<p>${visit.bodyMassIndex}</p></li>
          <li>Вік<p>${visit.age}</p></li>`
          )
        } else if (visit.doctor === "Дантист") {
          card.children[1].insertAdjacentHTML(
            "beforeend",
            `
          <li>Опис візиту<p>${visit.description}</p></li>
          <li>Дата останнього візиту<p>${visit.lastVisitDate}</p></li>`
          )
        } else if (visit.doctor === "Терапевт") {
          card.children[1].insertAdjacentHTML(
            "beforeend",
            `
          <li>Опис візиту<p>${visit.description}</p></li>
          <li>Вік<p>${visit.age}</p></li>`
          )
        }
      })
    }
    if (fold) {
      const [, , , ...list] = card.children[1].children
      list.forEach((li) => li.remove())
      folding.textContent = "Розгорнути"
    }
  }

  edit(card) {
    if (localStorage.getItem(`${card.id}`) !== null) {
      const visit = JSON.parse(localStorage.getItem(`${card.id}`))
      ajax.doctor = visit.doctor
      new Promise((resolve) => {
        const edit = new Visit({ id: "edit-form", visit: visit }).edit()
        resolve(edit)
      }).then((edit) => {
        edit.addEventListener(
          "click",
          (ev) => {
            new Client(ajax.define()).put(card.id).then(() => {
              ev.target.parentElement.parentElement.remove()
              this.reload()
              card.remove()
            })
          },
          { once: true }
        )
      })
    } else {
      new Client({}).card(card.id).then((visit) => {
        localStorage.setItem(`${visit.id}`, JSON.stringify(visit))
        ajax.doctor = visit.doctor
        new Promise((resolve) => {
          const edit = new Visit({ id: "edit-form", visit: visit }).edit()
          resolve(edit)
        }).then((edit) => {
          edit.addEventListener(
            "click",
            (ev) => {
              new Client(ajax.define()).put(card.id).then(() => {
                ev.target.parentElement.parentElement.remove()
                this.reload()
                card.remove()
              })
            },
            { once: true }
          )
        })
      })
    }
  }

  empty(place) {
    const msg = document.createElement("p")
    msg.textContent = "Жодного візиту не було створено"
    msg.id = "empty"
    place.append(msg)

    return empty
  }

  reload() {
    document.getElementById("filter").remove()
    document.getElementById("dashboard").remove()
    this.update()
    config.searchValues.clear()
  }

  escape(event) {
    if (document.getElementById("visit-form") === null) {
      return
    } else {
      event.target.id === "root" ||
      event.target.id === "filter" ||
      event.target.id === "dashboard" ||
      event.target.className === "modal-title" ||
      event.target.className === "card" ||
      event.target.id === "delete" ||
      event.target.className === "card-title" ||
      event.target.id === "filter-urgency" ||
      event.target.id === "filter-doctor" ||
      event.target.id === "filter-purpose" ||
      event.target.id === "filter-urgency-label" ||
      event.target.id === "filter-doctor-label" ||
      event.target.id === "filter-purpose-label"
        ? document.getElementById("visit-form").remove()
        : false
    }
  }
}

export function main() {
  new Dashboard().init()
}
