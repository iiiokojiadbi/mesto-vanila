import { togglePopup } from './index.js';

// создаем класс для валидации форм
class FormValidator {
  constructor(form, option) {
    this._form = form;
    this._inputSelector = option.inputSelector;
    this._submitButtonSelector = option.submitButtonSelector;
    this._inactiveButtonClass = option.inactiveButtonClass;
    this._inputErrorClass = option.inputErrorClass;
    this._errorClass = option.errorClass;
    this._buttonCloseSelector = option.buttonCloseSelector;
    this._buttonSubmit = this._form.querySelector(this._submitButtonSelector);
    this._buttonClose = this._form.querySelector(this._buttonCloseSelector);
    this._inputList = Array.from(
      this._form.querySelectorAll(this._inputSelector)
    );
  }
  // метод проверки валидности инпутов
  _hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }
  // показ ошибки
  _showInputError(inputElement) {
    const errorElement = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(this._inputErrorClass);
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(this._errorClass);
  }
  // скрытие ошибки
  _hideInputError(inputElement) {
    const errorElement = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(this._inputErrorClass);
    errorElement.classList.remove(this._errorClass);
    errorElement.textContent = '';
  }
  // метод вызов необходимого метода скрытия или показа ошибки
  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement);
    } else {
      this._hideInputError(inputElement);
    }
  }
  // метод переключения "доступности" кнопки сабмита
  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._buttonSubmit.classList.add(this._inactiveButtonClass);
    } else {
      this._buttonSubmit.classList.remove(this._inactiveButtonClass);
    }
  }
  // метод для управления поведением сабмита при отправке формы
  _submitForm(evt) {
    evt.preventDefault();
    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
      this._toggleButtonState();
    });
  }
  // метод для объявления слушателей события валидации формы
  _setEventListeners() {
    this._form.addEventListener('submit', (evt) => this._submitForm(evt));
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    });
  }
  // "публичный" метод активации валидации
  enableValidation() {
    this._toggleButtonState();
    this._setEventListeners();
  }
}

// изменяем поведение стандартного класса валидации
// форма edit на странице ведет себя иначе
// при закрытии формы отображение ошибок инпута должны быть скрыты
// кнопка сабмита при открытии попапа с формой должна быть активна
class EditFormValidator extends FormValidator {
  constructor(form, option) {
    super(form, option);
    this._popupSelector = option.popupSelector;
    this._popup = this._form.closest(this._popupSelector);
  }
  // переопределяем стандартный метод для управления поведением сабмита при отправке формы
  _toggleButtonState(state = true) {
    if (state && this._hasInvalidInput()) {
      this._buttonSubmit.classList.add(this._inactiveButtonClass);
    } else {
      this._buttonSubmit.classList.remove(this._inactiveButtonClass);
    }
  }
  // метод скрытия ошибок инпута при закрытии формы
  // кнопка теперь активна при открытии формы edit
  _closeForm() {
    togglePopup(this._popup);
    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
      this._toggleButtonState(false);
    });
  }
  // расширяем метод объявления слушателей
  _setEventListeners() {
    this._buttonClose.addEventListener('click', () => this._closeForm());
    window.addEventListener('keydown', (evt) =>
      evt.key === 'Escape' && !this._popup.classList.contains('popup_disabled')
        ? this._closeForm()
        : null
    );
    super._setEventListeners();
  }
}

export { FormValidator, EditFormValidator };
