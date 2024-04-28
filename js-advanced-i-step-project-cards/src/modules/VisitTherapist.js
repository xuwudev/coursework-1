import { root, button, ajax, changeButtonsValue, config } from "./config.js"
import { Form, Input, Select, TextArea, Button } from "./components.js"
import Modal from "./Modal.js"
import Visit from "./Visit.js"

export default class VisitTherapist extends Visit {
  constructor() {
    super({})
    super.setup()
    if (document.getElementById("visit-form") !== null) {
      this.form = document.getElementById("visit-form")
      this.select = this.form.children[1].children[0]
      this.select.addEventListener(
        "click",
        (ev) => {
          if (ev.target.value === "Терапевт") {
            document.getElementById("cancel").parentElement.remove()
            super.name()
            super.purpose()
            super.description()
            super.urgency()
            config.visitValues.therapist.age.place = this.form
            new Input(config.visitValues.therapist.age).add()
            super.buttons(this.form)
            ev.target.parentElement.remove()
            this.form.children[0].textContent = "Створення візиту: Терапевт"
          } else {
            return
          }
        },
        { once: true }
      )
    }
  }
}
