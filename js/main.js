'use strict';

var COUNT_USERS = 8;
var TITLE = [
  'Уютное гнездышко для молодоженов',
  'Милая, уютная квартирка в центре Токио',
  'Большая уютная квартира'
];

var PriseLimit = {
  MIN: 1000,
  MAX: 1000000
};

var TYPES = {
  PALACE: 'palace',
  FLAT: 'flat',
  HOUSE: 'house',
  BUNGALO: 'bungalo'
};

var PriceNight = {
  ZERO: '0',
  ONE_THOUSAND: '1000',
  FIVE_THOUSAND: '5000',
  TEN_THOUSAND: '10000'
};

var RoomLimit = {
  MIN: 1,
  MAX: 100
};

var GuestLimit = {
  MIN: 1,
  MAX: 20
};

var PinSize = {
  WIDTH: 66,
  HEIGHT: 66,
  TAIL_HEIGHT: 16
};

var PinLimit = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 130,
  MAX_Y: 600,
};

var KEY_CODE = {
  ENTER: 13,
  ESC: 27,
  MOUSE_LEFT: 1
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

var TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var DESCRIPTION = [
  'Маленькая чистая квартира на краю города',
  'Большая квартира из трех комнат в центре города',
  'Однушка у парка'
];

var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var form = document.querySelector('.ad-form');
var mapPinButtonMain = document.querySelector('.map__pin.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapCardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
var fieldsets = document.querySelectorAll('fieldset');
var selects = document.querySelectorAll('select');
var inputs = document.querySelectorAll('input');
var addressInput = document.querySelector('input[name="address"]');
var isActive = false;
var mapCard = null;

var offerTitle = form.querySelector('#title');
var offerPrice = form.querySelector('#price');
var offerRoomNumber = form.querySelector('#room_number');
var offerCapacity = form.querySelector('#capacity');
var timeOut = form.querySelector('#timeout');
var timeIn = document.querySelector('#timein');
var offerType = form.querySelector('#type');

// Переводим название типов жилья на русский
function translateType(type) {
  switch (type) {
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    default:
      return type;
  }
}
// Функция, возвращающая случайное число в диапазоне
// UTILS
var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Функция, возвращающая случайный элемемент массива
// UTILS
var getRandomItem = function (items) {
  for (var i = 0; i < items.length; i++) {
    var randomIndex = getRandomValue(0, items.length);
  }
  var randomItem = items[randomIndex];
  return randomItem;
};

// Функция, возвращающая случайную длину массива
// UTILS
var getRandomItems = function (count, items) {
  var randomItems = [];

  for (var i = 0; i < count; i++) {
    var randomIndex = getRandomValue(0, items.length);
    var randomItem = items[randomIndex];
    randomItems.push(randomItem);
  }
  return randomItems;
};

// Функция, возращающая массив строк случайной длины из предложенных
var getRandomFeatures = function (items) {
  var iterationCount = getRandomValue(0, items.length);
  var randomItems = [];

  for (var i = 0; i < iterationCount; i++) {
    randomItems.push(items[i]);
  }
  return randomItems;
};

// Работаем с массивом аватарок
var generateAvatar = function (index) {
  return 'img/avatars/user0' + (index + 1) + '.png';
};

// Функция, возвращающая метки объявлений
var getMark = function (index) {
  for (var i = 0; i < COUNT_USERS; i++) {
    var mark = {
      author: {
        avatar: generateAvatar(index),
      },
      offer: {
        title: getRandomItem(TITLE),
        address: '600, 350',
        price: getRandomValue(PriseLimit.MIN, PriseLimit.MAX),
        rooms: getRandomValue(RoomLimit.MIN, RoomLimit.MAX),
        type: translateType(TYPES),
        guests: getRandomValue(GuestLimit.MIN, GuestLimit.MAX),
        checkin: getRandomItem(TIMES),
        checkout: getRandomItem(TIMES),
        features: getRandomFeatures(4, FEATURES),
        description: getRandomItem(DESCRIPTION),
        photos: getRandomItems(4, PHOTOS)
      },
      location: {
        y: getRandomValue(PinLimit.MIN_Y, PinLimit.MAX_Y),
        x: getRandomValue(PinLimit.MIN_X, PinLimit.MAX_X)
      }
    };
  }
  return mark;
};

// Создаем массив заполненных данными маркеров
var getMarks = function (count) {
  var marks = [];

  for (var i = 0; i < count; i++) {
    var mark = getMark(i);
    marks.push(mark);
  }
  return marks;
};

// Отрисовываем метки на карте, клонирование
var getMarkFragment = function (mark) {
  var mapPoint = mapPinTemplate.cloneNode(true);
  mapPoint.style.top = (mark.location.y - PinSize.HEIGHT) + 'px';
  mapPoint.style.left = mark.location.x - (PinSize.WIDTH / 2) + 'px';
  mapPoint.querySelector('img').src = mark.author.avatar;
  mapPoint.querySelector('img').alt = mark.offer.title;
  return mapPoint;
};

// Записываем все метки во fragment
var renderMarks = function (marks) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < marks.length; i++) {
    var mark = marks[i];
    var pin = getMarkFragment(mark);
    fragment.appendChild(pin);
    addMarkEventHeandlers(pin, mark);
  }
  mapPins.appendChild(fragment);
};

// функция добавления для одной метки обработчика события.
var addMarkEventHeandlers = function (pin, mark) {
  pin.addEventListener('click', function () {
    renderMapPopup(mark);
  });
};

// Обработчик закрытия окна по нажатию на ESC
var onPopupPress = function (evt) {
  if (mapCard !== null && evt.keyCode === KEY_CODE.ESC) {
    evt.preventDefault();
    removePopup();
  }
};

// Удаляем со страницы попап
var removePopup = function () {
  if (mapCard !== null) {
    mapCard.remove();
    document.removeEventListener('keydown', onPopupPress);
  }
};

// Заполняем объявление на карте
var renderMapPopup = function (mark) {
  removePopup();
  mapCard = mapCardPopupTemplate.cloneNode(true);
  mapCard.querySelector('.popup__title').textContent = mark.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = mark.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = mark.offer.price + ' ₽/ночь';
  mapCard.querySelector('.popup__type').textContent = translateType[mark.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = mark.offer.rooms + ' комнаты для ' + mark.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + mark.offer.checkin + ', выезд до ' + mark.offer.checkout;
  mapCard.querySelector('.popup__features').textContent = mark.offer.description;
  mapCard.querySelector('.popup__avatar').src = mark.author.avatar;
  renderPhotoContainer(mapCard, mark.offer.photos);
  mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);

  var closePopupButton = mapCard.querySelector('.popup__close');
  document.addEventListener('keydown', onPopupPress);
  closePopupButton.addEventListener('click', removePopup);
};

// Функция проверки конейнера с фотографиями на наличие фото
var renderPhotoContainer = function (ad, imgs) {
  var adCardPhotos = ad.querySelector('.popup__photos');
  if (adCardPhotos.length === 0) {
    adCardPhotos.remove();
  } else {
    renderPhotos(adCardPhotos, imgs);
  }
};

// Колонируем фотографии в их контейнер
var renderPhotos = function (popupPhotos, photos) {
  var firstImage = popupPhotos.querySelector('.popup__photo'); // Шаблон
  var fragment = document.createDocumentFragment();
  firstImage.remove(); // очистить контэйнер

  for (var i = 0; i < photos.length; i++) {
    var cloneImage = firstImage.cloneNode(true);
    cloneImage.src = photos[i];
    fragment.appendChild(cloneImage);
  }
  popupPhotos.appendChild(fragment);
};

// Функция для перевода страницы в активное состояние
var activateMap = function (marks) {
  isActive = true;
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  renderMarks(marks);
  startMainPinPosition();
  checkActivationStatus();
};

// Функция для проверки состояния активации формы (fieldset)
var checkActivationStatus = function () {
  Array.from(fieldsets).forEach(function (fieldset) {
    fieldset.disabled = !isActive;
  });
  Array.from(selects).forEach(function (select) {
    select.disabled = !isActive;
  });
  Array.from(inputs).forEach(function (input) {
    input.disabled = !isActive;
  });
};

// Навешивание обработчиков событий
var initEvents = function (marks) {
  mapPinButtonMain.addEventListener('mousedown', function (evt) {
    if (evt.which === KEY_CODE.MOUSE_LEFT) {
      evt.preventDefault();
      activateMap(marks);
    }
  });

  mapPinButtonMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_CODE.ENTER) {
      evt.preventDefault();
      activateMap(marks);
    }
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

// Валидация заполнения заголовка
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

// Функция для обновления времени
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

// Валидация поля с ценой жилья
var validatePrice = function () {
  var housingTypeValue = offerType.value; // взять значение c DOM элемента
  var message = '';

  if (offerPrice.validity.rangeUnderflow) {
    switch (housingTypeValue) {
      case TYPES.BUNGALO: message = 'Цена должна быть не менее 0 руб.';
        break;
      case TYPES.FLAT: message = 'Цена должна быть не менее 1000 руб.';
        break;
      case TYPES.HOUSE: message = 'Цена должна быть не менее 5000 руб.';
        break;
      case TYPES.PALACE: message = 'Цена должна быть не менее 10000 руб.';
        break;
      default: message = '';
        break;
    }
  } else if (offerPrice.validity.rangeOverflow) {
    message = 'Цена должна быть не более 1 000 000 руб.';
  }

  offerPrice.setCustomValidity(message);
};

// Стартовые координаты главной метки
var startMainPinPosition = function () {
  var x = 0;
  var y = 0;

  if (isActive) {
    x = mapPinButtonMain.offsetLeft + (PinSize.HEIGHT / 2);
    y = mapPinButtonMain.offsetTop + (PinSize.HEIGHT / 2) + PinSize.TAIL_HEIGHT;
  } else {
    x = mapPinButtonMain.offsetLeft + (PinSize.WIDTH / 2);
    y = mapPinButtonMain.offsetTop + PinSize.HEIGHT / 2;
  }
  putMainPinPositionToAddress(x, y);
};

// Стартовые координаты в поле с именем address
var putMainPinPositionToAddress = function (x, y) {
  addressInput.value = x + ', ' + y;
};

// Собираем все функции для формы
var startingPage = function () {
  checkActivationStatus();
  startMainPinPosition();
  validateTitle();
  validatePrice();
  validateCapacity();
  updateTimes(timeIn.Id);
};
startingPage();

var marks = getMarks(COUNT_USERS);
initEvents(marks);
