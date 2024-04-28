import { Form, Input, Select, TextArea, Button } from "./components.js"
import { config } from "./config.js"

export default class Modal {
  constructor({ place, id, title }) {
    this.place = place
    this.id = id
    this.title = title
    this.form = null
  }

  add() {
    const form = new Form(this.place, this.id).add()
    form.insertAdjacentHTML(
      "beforeend",
      `<header class="modal-title">${this.title}</header>`
    )
    this.form = form
    config.submit.place = this.form
    return form
  }

  wrap(className, element = "div", place = this.form, value = "") {
    const wrapper = document.createElement(element)
    wrapper.className = className
    wrapper.textContent = value
    place.append(wrapper)

    return wrapper
  }

  input({ place = this.form, id, type, placeholder, name, className }) {
    return new Input({
      id: id,
      place: place,
      type: type,
      name: name,
      className: className,
      placeholder: placeholder,
    }).add()
  }

  selectDoctor({ place = this.form, labelFor = this.id, id, text }) {
    return new Select({
      id: id,
      place: place,
      forForm: labelFor,
      textDoctor: text,
    }).addDoctorSelect()
  }

  selectUrgency({ id, place = this.form, labelFor = this.id, text }) {
    return new Select({
      id: id,
      place: place,
      forForm: labelFor,
      textUrgency: text,
    }).addUrgencySelect()
  }

  textArea({ id, place = this.form }) {
    return new TextArea({ id: id, place: place }).add()
  }

  button(attrObject) {
    return new Button(attrObject)
  }
}
