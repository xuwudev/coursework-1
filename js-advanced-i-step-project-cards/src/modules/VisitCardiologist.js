import { root, button, ajax, changeButtonsValue, config } from "./config.js"
import { Form, Input, Select, TextArea, Button } from "./components.js"
import Visit from "./Visit.js"
import Dashboard from "./Dashboard.js"

export default class VisitCardiologist extends Visit {
  constructor() {
    super({})
    super.setup()
    if (document.getElementById("visit-form") !== null) {
      this.form = document.getElementById("visit-form")
      this.select = this.form.children[1].children[0]
      this.select.addEventListener(
        "click",
        (ev) => {
          config.visitValues.cardiologist.pressure.place = this.form
          config.visitValues.cardiologist.bodyMassIndex.place = this.form
          config.visitValues.cardiologist.age.place = this.form
          config.visitValues.cardiologist.pressure.place = this.form
          config.visitValues.cardiologist.bodyMassIndex.place = this.form
          config.visitValues.cardiologist.age.place = this.form
          config.visitValues.cardiologist.heartDiseases.place = this.form

          if (
            ev.target.value === null ||
            ev.target.value === undefined ||
            ev.target.value === "Кардіолог"
          ) {
            document.getElementById("cancel").parentElement.remove()
            super.setup()
            super.name()
            super.purpose()
            super.description()
            super.urgency()
            new Input(config.visitValues.cardiologist.pressure).add()
            new Input(config.visitValues.cardiologist.heartDiseases).add()
            new Input(config.visitValues.cardiologist.bodyMassIndex).add()
            new Input(config.visitValues.cardiologist.age).add()
            super.buttons(this.form)
            ev.target.parentElement.remove()
            this.form.children[0].textContent = "Створення візиту: Кардіолог"
          } else {
            return
          }
        },
        { once: true }
      )
    }
  }
}
