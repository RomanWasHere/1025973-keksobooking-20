'use strict';

(function () {
  var PriceNight = {
    ZERO: '0',
    ONE_THOUSAND: '1000',
    FIVE_THOUSAND: '5000',
    TEN_THOUSAND: '10000'
  };

  var RoomtType = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    HUNDERT: '100'
  };

  var GuestType = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    NOT_FOR_GUEST: '100'
  };

  var TYPES = {
    PALACE: 'palace',
    FLAT: 'flat',
    HOUSE: 'house',
    BUNGALO: 'bungalo'
  };

  var form = document.querySelector('.ad-form');
  var main = document.querySelector('main');
  var successPopup = document.querySelector('#success').content.querySelector('.success');
  var errorPopup = document.querySelector('#error').content.querySelector('.error');
  var error = document.querySelector('#error');
  var closeButtonError = document.querySelector('.error__button');
  var resetBtn = document.querySelector('.ad-form__reset');
  var offerTitle = form.querySelector('#title');
  var offerPrice = form.querySelector('#price');
  var offerRoomNumber = form.querySelector('#room_number');
  var offerCapacity = form.querySelector('#capacity');
  var timeOut = form.querySelector('#timeout');
  var timeIn = document.querySelector('#timein');
  var offerType = form.querySelector('#type');
  var selects = document.querySelectorAll('select');
  var inputs = document.querySelectorAll('input');
  var fieldsets = document.querySelectorAll('fieldset');

  // Функция для проверки состояния активации формы (fieldset)
  var changeFormState = function (isActive) {

    Array.from(fieldsets).forEach(function (fieldset) {
      fieldset.disabled = !isActive;
    });
    Array.from(selects).forEach(function (select) {
      select.disabled = !isActive;
    });
    Array.from(inputs).forEach(function (input) {
      input.disabled = !isActive;
    });

    if (isActive) {
      form.classList.remove('ad-form--disabled');
    } else {
      form.classList.add('ad-form--disabled');
      form.reset();
    }
  };

  var addFormEvents = function () {
    resetBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      changeFormState(false);
      window.map.deactivate();
    });

    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      window.backend.upload(new FormData(form), onFormSuccessSubmit, onError);
    });

    form.addEventListener('change', function (evt) {
      var targetId = evt.target.id;
      switch (targetId) {
        case offerRoomNumber.id:
        case offerCapacity.id:
          validateCapacity();
          break;
        case offerTitle.id:
          validateTitle();
          break;
        case offerPrice.id:
          validatePrice();
          break;
        case offerType.id:
          updatePriceLmit();
          validatePrice();
          break;
        default: break;
      }
      updateTimes(targetId);
    });
  };

  // Прописываем условия для правильного заполнения заголовка
  var validateTitle = function () {
    if (offerTitle.validity.tooShort) {
      offerTitle.setCustomValidity('Заголовок должно состоять минимум из 30 символов');
    } else if (offerTitle.validity.tooLong) {
      offerTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (offerTitle.validity.valueMissing) {
      offerTitle.setCustomValidity('Введите, пожалуйста, заголовок объявления. Это обязательно поле для заполнения');
    } else {
      offerTitle.setCustomValidity('');
    }
  };

  // Проверяем соотвествие колличества гостей и комнат
  var validateCapacity = function () {
    var capacityValue = offerCapacity.value;
    var roomNumber = offerRoomNumber.value;

    var message = '';

    if (roomNumber === RoomtType.ONE) {
      if (capacityValue !== GuestType.ONE) {
        message = 'Выберите не более 1 гостя';
      }
    } else if (roomNumber === RoomtType.TWO) {
      if (capacityValue !== GuestType.ONE && capacityValue !== GuestType.TWO) {
        message = 'Выберите не более 1 гостя или 2 гостей';
      }
    } else if (roomNumber === RoomtType.THREE) {
      if (capacityValue !== GuestType.ONE && capacityValue !== GuestType.TWO && capacityValue !== GuestType.THREE) {
        message = 'Выберите 3 гостей или 2 гостей или 1 гостя';
      }
    } else if (roomNumber === RoomtType.HUNDERT) {
      if (capacityValue !== GuestType.NOT_FOR_GUEST) {
        message = 'Не предназначены для гостей';
      }
    }
    offerCapacity.setCustomValidity(message);
  };

  var updateTimes = function (elementId) {
    switch (elementId) {
      case timeIn.id:
        timeOut.value = timeIn.value;
        break;
      case timeOut.id:
        timeIn.value = timeOut.value;
        break;
    }
  };

  // Функция для обновления плейсхолдера и нижней границы стоимости проживания
  var updatePriceLmit = function () {
    var housingTypeValue = offerType.value;
    switch (housingTypeValue) {
      case TYPES.BUNGALO:
        offerPrice.placeholder = PriceNight.ZERO;
        offerPrice.min = PriceNight.ZERO;
        break;
      case TYPES.FLAT:
        offerPrice.placeholder = PriceNight.ONE_THOUSAND;
        offerPrice.min = PriceNight.ONE_THOUSAND;
        break;
      case TYPES.HOUSE:
        offerPrice.placeholder = PriceNight.FIVE_THOUSAND;
        offerPrice.min = PriceNight.FIVE_THOUSAND;
        break;
      case TYPES.PALACE:
        offerPrice.placeholder = PriceNight.TEN_THOUSAND;
        offerPrice.min = PriceNight.TEN_THOUSAND;
        break;
      default: break;
    }
  };

  // Прописываем условия для правильного заполнения поля с ценой жилья
  var validatePrice = function () {
    var housingTypeValue = offerType.value;

    var message = '';

    if (offerPrice.validity.rangeUnderflow) {
      switch (housingTypeValue) {
        case TYPES.BUNGALO: message = 'Цена должна быть не менее 0 руб.'; break;
        case TYPES.FLAT: message = 'Цена должна быть не менее 1000 руб.'; break;
        case TYPES.HOUSE: message = 'Цена должна быть не менее 5000 руб.'; break;
        case TYPES.PALACE: message = 'Цена должна быть не менее 10000 руб.'; break;
        default: message = ''; break;
      }
    } else if (offerPrice.validity.rangeOverflow) {
      message = 'Цена должна быть не более 1 000 000 руб.';
    }
    offerPrice.setCustomValidity(message);
  };

  // Функция закрытия сообщения по клику мышки и на Esk
  var removeSuccessPopup = function () {
    successPopup.remove();
    successPopup.removeEventListener('click', onSuccessPopupClick);
    document.removeEventListener('keydown', onDocumentKeyDownSuccess);
  };

  // Сообщение должно исчезать по клику на произвольную область экрана.
  var onSuccessPopupClick = function () {
    removeSuccessPopup();
  };

  // функция по закрытию успешного сообщения на Esk
  var onDocumentKeyDownSuccess = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      removeSuccessPopup();
    }
  };

  // покажем сообщение об успешной отправке
  var showSuccessPopup = function () {
    main.insertAdjacentElement('afterbegin', successPopup);
    successPopup.addEventListener('click', onSuccessPopupClick);
    document.addEventListener('keydown', onDocumentKeyDownSuccess);
  };

  var closeError = function () {
    error.remove();
    document.removeEventListener('keydown', onDocumentKeyDownError);
  };

  // Сообщение должно исчезать по клику на произвольную область экрана.
  var onErrorClick = function () {
    closeError();
  };

  // функция по закрытию неуспешного сообщения на Esk
  var onDocumentKeyDownError = function (evt) {
    window.utils.isEscEvent(evt, closeError);
  };

  // Описываем неуспешную отправку данных серверу
  var onError = function () {
    main.insertAdjacentElement('afterbegin', errorPopup);
    closeButtonError.addEventListener('click', onErrorClick);
    errorPopup.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onDocumentKeyDownError);
  };

  var onFormSuccessSubmit = function () {
    showSuccessPopup();
    changeFormState(false);
    window.map.deactivate();
  };

  var prepare = function () {
    changeFormState();
    addFormEvents();
    validateTitle();
    validatePrice();
    validateCapacity();
    updateTimes(timeIn.id);
  };

  window.form = {
    prepare: prepare,
    changeFormState: changeFormState
  };
})();

