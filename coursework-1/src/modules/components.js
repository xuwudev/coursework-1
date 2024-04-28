import { config, ajax } from "./config.js"
import Client from "./Client.js"
import Dashboard from "./Dashboard.js"

class Form {
  constructor(place, id) {
    this.id = id
    this.place = place
  }

  add() {
    this.place.insertAdjacentHTML(
      "beforeend",
      `
      <form id="${this.id}" class="modal"></form>`
    )

    return document.getElementById(this.id)
  }

  create() {
    const form = document.createElement("form")
    form.id = this.id
    this.place.append(form)

    return form
  }
}

class Input {
  constructor({ place, type, name, className, placeholder, id }) {
    this.type = type
    this.placeHolder = placeholder
    this.id = id
    this.name = name
    this.place = place
    this.className = className
  }

  add(place = this.place, id = this.id) {
    if (document.getElementById(id) !== null) {
      return document.getElementById(id)
    } else {
      place.insertAdjacentHTML(
        "beforeend",
        `
        <input type="${this.type}"
        class="${this.className}"
        id="${this.id}" name="${this.name}"
        placeholder="${this.placeHolder}" required="true">`
      )

      document.getElementById(id).addEventListener("blur", this.listen)

      return document.getElementById(id)
    }
  }

  filter(
    values,
    place = this.place,
    id = this.id,
    filterType = values.purpose
  ) {
    if (document.getElementById(id) !== null) {
      return document.getElementById(id)
    } else {
      place.insertAdjacentHTML(
        "beforeend",
        `
      <label id="${filterType.label.id}">${filterType.text}
        <input type="${this.type}" class="${this.className}" id="${this.id}" name="${this.name}" >
      </label>`
      )

      return document.getElementById(this.id)
    }
  }

  listen(event) {
    if (event.target.parentElement.id === "filter-purpose") {
      config.searchValues.purpose = event.target.value
    }

    if (
      event.target.value !== undefined ||
      event.target.value !== null ||
      event.target.value !== ""
    ) {
      switch (event.target.id) {
        case config.visitValues.name.id:
          ajax.cardiologist.name = event.target.value
          ajax.dentist.name = event.target.value
          ajax.therapist.name = event.target.value
          break
        case config.visitValues.purpose.id:
          ajax.cardiologist.purpose = event.target.value
          ajax.dentist.purpose = event.target.value
          ajax.therapist.purpose = event.target.value
          break
        case config.visitValues.cardiologist.age.id:
          ajax.cardiologist.age = event.target.value
          ajax.therapist.age = event.target.value
          break
        case config.visitValues.cardiologist.pressure.id:
          ajax.cardiologist.pressure = event.target.value
          break
        case config.visitValues.dentist.lastVisitDate.id:
          ajax.dentist.lastVisitDate = event.target.value
          break
        case config.visitValues.cardiologist.heartDiseases.id:
          ajax.cardiologist.heartDiseases = event.target.value
          break
        case config.visitValues.cardiologist.bodyMassIndex.id:
          ajax.cardiologist.bodyMassIndex = event.target.value
          break
      }
    } else {
      return
    }
  }
}

class Select {
  constructor({
    id,
    place,
    forForm,
    textUrgency = "Терміновість",
    textDoctor = "Виберіть лікаря",
  }) {
    this.id = id
    this.labelFor = forForm
    this.place = place
    this.textDoctor = textDoctor
    this.textUrgency = textUrgency
  }

  addUrgencySelect(place = this.place, id = this.id, labelFor = this.labelFor) {
    place.insertAdjacentHTML(
      "beforeend",
      `
      <label for="${labelFor}">${this.textUrgency}
          <select id="${id}">
              <option>Звичайна</option>
              <option>Важлива</option>
              <option>Невідкладна</option>Звичайна
          </select>
      </label>`
    )
    document.getElementById(id).addEventListener("click", (ev) => {
      ajax.cardiologist.urgency = ev.target.value
      ajax.dentist.urgency = ev.target.value
      ajax.therapist.urgency = ev.target.value
    })
    return document.getElementById(`${id}`)
  }

  addDoctorSelect(place = this.place, id = this.id, labelFor = this.labelFor) {
    place.insertAdjacentHTML(
      "beforeend",
      `
      <label class="doctor-modal-select" for="${labelFor}">${this.textDoctor}
          <select id="${id}">
              <option>Кардіолог</option>
              <option>Дантист</option>
              <option>Терапевт</option>
          </select>
          </label>`
    )
    document.getElementById(id).addEventListener("click", (ev) => {
      ajax.doctor = ev.target.value
    })

    return document.getElementById(id)
  }

  filterBy(values, place = this.form) {
    place.insertAdjacentHTML(
      "beforeend",
      `
      <label class="${values.label.className}" for="${this.id}">${values.label.text}
          <select id="${values.id}">
              <option>${values.option[0]}</option>
              <option>${values.option[1]}</option>
              <option>${values.option[2]}</option>
              <option>${values.option[3]}</option>
          </select>
          </label>`
    )
    return document.getElementById(values.id)
  }
}

class TextArea {
  constructor({ id, place }) {
    this.id = id
    this.place = place
  }

  add(id = this.id, place = this.place) {
    place.insertAdjacentHTML(
      "beforeend",
      `
    <textarea id="${id}" rows="4" cols="22" placeholder="Опис візиту"></textarea>`
    )
    document.getElementById(id).addEventListener("blur", this.listen)

    return document.getElementById(id)
  }

  listen(event) {
    if (
      event.target.value !== undefined ||
      event.target.value !== null ||
      event.target.value !== ""
    ) {
      ajax.cardiologist.description = event.target.value
      ajax.dentist.description = event.target.value
      ajax.therapist.description = event.target.value
    }
  }
}

class Button {
  constructor({ type, value, id, className, place }) {
    this.type = type
    this.value = value
    this.id = id
    this.className = className
    this.place = place
    const click = this.add()
    this.eventType = "click"
    this.type === "submit" ? (this.eventType = "submit") : false
    click.parentElement.parentElement.addEventListener(
      this.eventType,
      this.enableClick
    )
    click.addEventListener("click", this.cardEvents)
    click.addEventListener("click", this.filter)

    return click
  }

  add() {
    this.place.insertAdjacentHTML(
      "beforeend",
      `
        <button type="${this.type}" id="${this.id}" class="${this.className}">${this.value}</button>`
    )

    return document.getElementById(this.id)
  }

  enableClick(event) {
    event.preventDefault()
    event.target.id === "cancel"
      ? event.target.parentElement.parentElement.remove()
      : false

    if (event.target.id === "authorization") {
      new Client({}).auth()
      event.target.parentElement.parentElement.remove()
    } else if (event.target.id === "submit") {
      new Client(ajax.define()).post().then(() => {
        new Dashboard().reload()
      })
      event.target.parentElement.parentElement.remove()
    }
  }

  cardEvents(event) {
    if (event.target.className === "folding") {
      const dashboard = new Dashboard()
      event.target.parentElement.parentElement.children[1].children.length === 3
        ? dashboard.folding(
            event.target.parentElement.parentElement,
            event.target
          )
        : dashboard.folding(
            event.target.parentElement.parentElement,
            event.target,
            true
          )
    } else if (event.target.className === "edit") {
      document.getElementById("edit-form") === null
        ? new Dashboard().edit(event.target.parentElement.parentElement)
        : false
    } else if (event.target.className === "delete") {
      new Client({}).delete(event.target.id.substr(7)).then(() => {
        event.target.parentElement.remove()
        document.getElementById("dashboard").children.length === 1
          ? new Dashboard().empty(document.getElementById("dashboard"))
          : false
      })
    }
  }

  filter(event) {
    if (event.target.id === "search") {
      if (
        config.searchValues.doctor.all === true &&
        config.searchValues.doctor.all === true &&
        config.searchValues.purpose.value === ""
      ) {
        return
      } else {
        const [, ...cards] = document.getElementById("dashboard").children

        new Dashboard().search(cards, document.getElementById("dashboard"))
      }
    } else if (event.target.id === "reset") {
      new Dashboard().reload()
    }
  }
}

export { Form, Input, Select, TextArea, Button }
