'use strict';

var OFFERS_NUMBER = 8;
var MAP_WIDTH = 1200;
var MAP_TOP_Y = 130;
var MAP_BOTTOM_Y = 630;
var PIN_OFFSET_X = -25; // Отрицательный отступ метки на половину ширины
var PIN_OFFSET_Y = -35; // Отрицательный отступ метки на половину высоты

var PROPERTIES_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

// var PROPERTIES_TYPE_RU = {
//   palace: 'Дворец',
//   flat: 'Квартира',
//   house: 'Дом',
//   bungalo: 'Бунгало'
// };

var CHECKIN_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECKOUT_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

// var FEATURES_RU = {
//   wifi: 'Беспроводной интернет',
//   dishwasher: 'Посудомойка',
//   parking: 'Парковка',
//   washer: 'Стиральная машина',
//   elevator: 'Лифт',
//   conditioner: 'Кондиционер',
// };

var AMOUNT = {
  ROOM: {
    MAX: 5,
    MIN: 1
  },
  GUEST: {
    MAX: 8,
    MIN: 1
  }
};

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// Получаем случайное число и возвращаем его
// Служебная функция ?
var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Получаем случайное число из минимальных и максимальных значений
// Служебная функция ?
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Получим фичи доступные в жилье
var generateFeatures = function () {
  var features = [];
  var numberOfFeatures = getRandomIntInclusive(1, FEATURES.length);
  var feature = getRandomElement(FEATURES);

  for (var i = 0; i < numberOfFeatures; i++) {
    while (features.includes(feature)) {
      feature = getRandomElement(FEATURES);
    }
    features[i] = feature;
  }

  return features;
};
// Лучше сделай что бы функция принимала параметром количество фич, а это делай до вызова и передавай результат в аргумент функции
// Чет я не понял как это сделать = (

// Создаем массив объектов исходя из количества жилья
var getListOfOffers = function () {
  var offers = [];
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    offers[i] = createOffer(i);
  }

  return offers;
};

// Создаем объект исходя из порядкогового номера массива
var createOffer = function (offerNumber) {
  var locationX = getRandomIntInclusive(0, MAP_WIDTH);
  var locationY = getRandomIntInclusive(MAP_TOP_Y, MAP_BOTTOM_Y);

  var offer = {
    author: {
      avatar: 'img/avatars/user0' + (offerNumber + 1) + '.png'
    },
    offer: {
      title: 'строка, заголовок предложения',
      address: locationX + ', ' + locationY,
      price: 1000,
      type: getRandomElement(PROPERTIES_TYPE),
      rooms: getRandomIntInclusive(AMOUNT.ROOM.MIN, AMOUNT.ROOM.MAX),
      guests: getRandomIntInclusive(AMOUNT.GUEST.MIN, AMOUNT.GUEST.MAX),
      checkin: getRandomElement(CHECKIN_TIME),
      checkout: getRandomElement(CHECKOUT_TIME),
      features: generateFeatures(),
      description: 'строка с описанием',
      photos: PHOTOS
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return offer;
};

// Убираем размытие с карты
var map = document.querySelector('.map');
var activateMap = function (element) {
  element.classList.remove('map--faded');

  // Рендерим пины на карте
  var offers = getListOfOffers();
  renderPins(offers);
};

// Создаем пин
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var createPin = function (offer) {
  var pin = pinTemplate.cloneNode(true);
  var pinX = offer.location.x + PIN_OFFSET_X;
  var pinY = offer.location.y + PIN_OFFSET_Y;
  pin.style = 'left: ' + pinX + 'px; top: ' + pinY + 'px;';

  var pinAvatar = pin.querySelector('img');
  pinAvatar.src = offer.author.avatar;
  pinAvatar.alt = offer.offer.title;

  return pin;
};

// Рендерим пин
var pin = document.querySelector('.map__pins');
var renderPins = function (offers) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < offers.length; j++) {
    fragment.appendChild(createPin(offers[j]));
  }
  pin.appendChild(fragment);
};

// Подрезаем окончания строк у типа жилья, фич
// var translateArray = function (words, dictionary) {
//   var stringSlice = -2;
//   var translatedString = '';

//   for (var i = 0; i < words.length; i++) {
//     translatedString += dictionary[words[i]] + ', ';
//   }
//   return translatedString.slice(0, stringSlice);
// };

// Изменение окончаний для "Комнта"
// var getEndingsRooms = function (number) {
//   if (number === 1) {
//     return 'a';
//   }

//   return (number >= 2 && number <= 4) ? 'ы' : '';
// };

// Изменение окончаний для "Гостей"
// var getEndingsGuests = function (number) {
//   return number === 1 ? 'я' : 'ей';
// };

// Склейка текста для комнат и гостей
// var generateInfoText = function (rooms, guests) {
//   var endingWordRooms = getEndingsRooms(rooms);
//   var endingWordGuests = getEndingsGuests(guests);

//   var text = rooms + ' комнат' + endingWordRooms + ' для ' + guests + ' гост' + endingWordGuests;

//   return text;
// };

// Функция на вывод фотографий жилья
// var generatePhotos = function (photos) {
//   var imgTags = '';
//   for (var i = 0; i < photos.length; i++) {
//     imgTags += '<img src="' + photos[i] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
//   }

//   return imgTags;
// };

// Создание карточки с информацией о жилье
// var createCard = function (advertisement) {
//   var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
//   var card = cardTemplate.cloneNode(true);

//   var title = card.querySelector('.popup__title');
//   title.textContent = advertisement.offer.title;

//   var address = card.querySelector('.popup__text--address');
//   address.textContent = advertisement.offer.address;

//   var price = card.querySelector('.popup__text--price');
//   price.textContent = advertisement.offer.price + ' ₽/ночь';

//   var type = card.querySelector('.popup__type');
//   var offerType = [];
//   offerType.push(advertisement.offer.type);
//   type.textContent = translateArray(offerType, PROPERTIES_TYPE_RU);

//   var capacity = card.querySelector('.popup__text--capacity');
//   var textRoomsAndGuests = generateInfoText(advertisement.offer.rooms, advertisement.offer.guests);
//   capacity.textContent = textRoomsAndGuests;

//   var time = card.querySelector('.popup__text--time');
//   time.textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;

//   var features = card.querySelector('.popup__features');
//   features.textContent = translateArray(advertisement.offer.features, FEATURES_RU);

//   var description = card.querySelector('.popup__description');
//   description.textContent = advertisement.offer.description;

//   var photos = card.querySelector('.popup__photos');
//   photos.innerHTML = generatePhotos(advertisement.offer.photos);

//   var avatar = card.querySelector('.popup__avatar');
//   avatar.src = advertisement.author.avatar;

//   return card;
// };

// Вывод карточки с жильем
// var renderCard = function (card) {
//   var mapFiltersContainer = map.querySelector('.map__filters-container');
//   map.insertBefore(card, mapFiltersContainer);
// };
// var card = createCard(offers[0]);
// renderCard(card);

var ENTER_KEY = 'Enter';

var PX_CUT = -2;

var VALIDITY_TEXT = {
  1: '1 комната — «для 1 гостя»',
  2: '2 комнаты — «для 2 гостей» или «для 1 гостя»',
  3: '3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
  100: AMOUNT.ROOM.MAX + ' комнат — «не для гостей»'
};

var notice = document.querySelector('.notice');
var adForm = document.querySelector('.ad-form');
var fieldsets = notice.querySelectorAll('fieldset');
var inputs = adForm.querySelectorAll('input');
var selects = adForm.querySelectorAll('select');
var mapPinMain = document.querySelector('.map__pin--main');
var mapFilters = document.querySelector('.map__filters');
var address = document.querySelector('#address');
var numberOfRoomsSelect = notice.querySelector('#room_number');
var numberOfGuestsSelect = notice.querySelector('#capacity');
var submitButton = notice.querySelector('.ad-form__submit');
var roomsNumber = numberOfRoomsSelect.value;
var guestsNumber = numberOfGuestsSelect.value;

// Отключаем форму
var disableForm = function () {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute('disabled', 'disabled');
  }
  for (i = 0; i < inputs.length; i++) {
    inputs[i].setAttribute('disabled', 'disabled');
  }
  for (i = 0; i < selects.length; i++) {
    selects[i].setAttribute('disabled', 'disabled');
  }
  mapFilters.setAttribute('disabled', 'disabled');
};
disableForm();

// Включаем форму
var activateForm = function () {
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled');
  }
  for (i = 0; i < inputs.length; i++) {
    inputs[i].removeAttribute('disabled');
  }
  for (i = 0; i < selects.length; i++) {
    selects[i].removeAttribute('disabled');
  }
  mapFilters.removeAttribute('disabled');
};

// Получаем адрес
var setAddress = function (x, y) {
  address.value = x + ', ' + y;
};

// Включаем страницу
var activatePage = function () {
  activateMap(map);
  activateForm();
};

// Получаем координаты пина по X
var getPinCoordinateX = function () {
  return mapPinMain.style.left.slice(0, PX_CUT) - PIN_OFFSET_Y;
};

// Получаем координаты пина по У
var getPinCoordinateY = function () {
  return mapPinMain.style.top.slice(0, PX_CUT) - PIN_OFFSET_X;
};

// Валидируем количество комнат для гостей
var validateRoomsCapacity = function (rooms, guests) {
  if ((guests > rooms && rooms !== AMOUNT.ROOM.MAX) || (rooms !== AMOUNT.ROOM.MAX && guests === 0) || (rooms === 100 && guests > 0)) {
    numberOfGuestsSelect.setCustomValidity(VALIDITY_TEXT[rooms]);
  } else {
    numberOfGuestsSelect.setCustomValidity('');
  }
};

// События при клике на пин
mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activatePage();

    var x = getPinCoordinateX();
    var y = getPinCoordinateY();

    setAddress(x, y);
  }
});

// События при нажатии 'Enter' на пин
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    activatePage();

    var x = getPinCoordinateX();
    var y = getPinCoordinateY();

    setAddress(x, y);
  }
});

// События при при изменении выбранного количества комнат
numberOfRoomsSelect.addEventListener('change', function () {
  roomsNumber = parseInt(numberOfRoomsSelect.value, 10);
});

// События при при изменении выбранного количества гостей
numberOfGuestsSelect.addEventListener('change', function () {
  guestsNumber = parseInt(numberOfGuestsSelect.value, 10);
  numberOfGuestsSelect.setCustomValidity('');
});

// Валидация при сабмите формы
submitButton.addEventListener('click', function () {
  validateRoomsCapacity(roomsNumber, guestsNumber);
});
