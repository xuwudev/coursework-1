const root = document.getElementById("root")

const button = document.getElementById("button")

function changeButtonsValue() {
  button.textContent = "Вхід"
    ? (button.textContent = "Створити візит")
    : (button.textContent = "Вхід")
}

const config = {
  confirm: {
    type: "submit",
    place: root,
    id: "confirm",
    className: "send",
    value: "Вхід",
  },
  cancel: {
    type: "button",
    place: root,
    id: "cancel",
    className: "cancel",
    value: "Відмінити",
  },
  newVisitModal: {
    place: document.getElementById("root"),
    id: "visit-form",
    title: "Створення візиту",
  },
  authorize: {
    type: "submit",
    place: root,
    id: "authorization",
    className: "send",
    value: "Вхід",
  },
  submit: {
    type: "submit",
    id: "submit",
    value: "Створити",
  },
  edit: {
    type: "button",
    id: "edit",
    value: "Редагувати",
  },
  search: {
    type: "button",
    id: "search",
    value: "Фільтрувати",
  },
  reset: {
    type: "button",
    id: "reset",
    value: "Скинути",
  },
  visitValues: {
    place: root,
    name: {
      place: root,
      type: "text",
      placeholder: "ПІБ",
      id: "visit-form-name",
      className: undefined,
      name: undefined,
    },
    purpose: {
      place: root,
      type: "text",
      placeholder: "Мета вашого візиту",
      id: "visit-form-purpose",
      className: undefined,
      name: undefined,
    },
    description: {
      place: root,
      placeholder: "Короткий опис візиту",
      id: "visit-form-description",
    },
    urgency: {
      place: root,
      id: "visit-form-urgency",
      forForm: undefined,
    },
    cardiologist: {
      pressure: {
        place: root,
        type: "text",
        placeholder: "Тиск зазвичай",
        id: "visit-form-pressure",
        className: undefined,
        name: undefined,
      },
      heartDiseases: {
        place: root,
        type: "text",
        placeholder: "Перенесені хворови серця",
        id: "visit-form-diseases",
        className: undefined,
        name: undefined,
      },
      bodyMassIndex: {
        place: root,
        type: "number",
        placeholder: "Індекс маси тіла",
        id: "visit-form-body-mass-index",
        className: undefined,
        name: undefined,
      },
      age: {
        place: root,
        type: "number",
        placeholder: "Вік",
        id: "visit-form-age",
        className: undefined,
        name: undefined,
      },
    },
    dentist: {
      lastVisitDate: {
        place: root,
        type: "date",
        placeholder: undefined,
        id: "visit-form-date",
        className: undefined,
      },
    },
    therapist: {
      age: {
        place: root,
        type: "number",
        placeholder: "Вік",
        id: "visit-form-age",
        className: undefined,
      },
    },
  },

  filterValues: {
    doctor: {
      id: "filter-doctor",
      label: {
        className: "filter-doctor-label",
        text: "Заголовком",
      },
      option: ["Всі", "Кардіолог", "Дантист", "Терапевт"],
    },
    urgency: {
      id: "filter-urgency",
      label: {
        className: "filter-urgency-label",
        text: "Терміновістю",
      },
      option: ["Всі", "Звичайна", "Важлива", "Невідкладна"],
    },
    purpose: {
      id: "filter-purpose",
      label: { id: "filter-purpose-label" },
      text: "Метою візиту",
    },
  },
  searchValues: {
    all: true,
    doctor: {
      all: true,
      picked: "Всі",
    },
    urgency: {
      all: true,
      picked: "Всі",
    },
    purpose: {
      content: false,
      value: "",
    },
    clear() {
      this.all = true
      this.doctor.all = true
      this.doctor.picked = "Всі"
      this.urgency.all = true
      this.urgency.picked = "Всі"
      this.purpose.content = false
      this.purpose.value = ""
    },
  },
  cardValues: {
    place: root,
    id: undefined,
    title: undefined,
  },

  buttonWrapper(place, className) {
    const div = document.createElement("div")
    div.className = `${className}`
    place.append(div)

    return div
  },
  token() {
    return localStorage.getItem("token")
  },

  element(id) {
    return document.getElementById(id)
  },
}

const ajax = {
  account: {
    email: "doctor@medical.com",
    password: "1111",
  },

  url: "https://ajax.test-danit.com/api/v2/cards/",

  doctor: "Кардіолог",
  cardiologist: {
    doctor: "Кардіолог",
    name: "",
    purpose: "",
    description: "",
    urgency: "Звичайна",
    pressure: "",
    bodyMassIndex: "",
    heartDiseases: "",
    age: "",
  },
  dentist: {
    doctor: "Дантист",
    name: "",
    purpose: "",
    description: "",
    urgency: "Звичайна",
    lastVisitDate: "",
  },
  therapist: {
    doctor: "Терапевт",
    name: "",
    purpose: "",
    description: "",
    urgency: "Звичайна",
    age: "",
  },

  define() {
    if (this.doctor === "Дантист") {
      return this.dentist
    } else if (this.doctor === "Терапевт") {
      return this.therapist
    } else {
      return this.cardiologist
    }
  },

  unset() {
    for (let prop in this.cardiologist) {
      this.cardiologist[prop] = ""
    }
    this.cardiologist.doctor = "Кардіолог"
    this.cardiologist.urgency = "Звичайна"
    for (let prop in this.dentist) {
      this.dentist[prop] = ""
    }
    this.dentist.doctor = "Дантист"
    this.dentist.urgency = "Звичайна"
    for (let prop in this.therapist) {
      this.therapist[prop] = ""
    }
    this.therapist.doctor = "Терапевт"
    this.therapist.urgency = "Звичайна"
  },
}

function welcome() {
  root.insertAdjacentHTML(
    "beforeend",
    `
  <div id="welcome">
  <h2>Вітаємо! Раді, що завітали!</h2>
  <h3>Для подальшої роботи ви маєте бути авторизовані</h3>
  </div>`
  )
  return document.getElementById("welcome")
}

export { root, button, changeButtonsValue, config, ajax, welcome }
