'use strict';

var OFFERS_NUMBER = 8;
var MIN_AMOUNT_ROOM = 1;
var MAX_AMOUNT_ROOM = 5;
var MIN_AMOUNT_GUEST = 1;
var MAX_AMOUNT_GUEST = 10;
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

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// Получаем случайное число и возвращаем его
var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Получаем случайное число из минимальных и максимальных значений
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Создаем массив объектов исходя из количества жилья
var getListOfOffers = function () {
  var offers = [];

  for (var i = 0; i < OFFERS_NUMBER; i++) {
    offers[i] = createOffer(i);
  }

  return offers;
};

// Создаем объект исходя из номера массива
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
      rooms: getRandomIntInclusive(MIN_AMOUNT_ROOM, MAX_AMOUNT_ROOM),
      guests: getRandomIntInclusive(MIN_AMOUNT_GUEST, MAX_AMOUNT_GUEST),
      checkin: getRandomElement(CHECKIN_TIME),
      checkout: getRandomElement(CHECKOUT_TIME),
      features: getRandomElement(FEATURES),
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
};
activateMap(map);

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

// Получаем количество доступного жилья
var offers = getListOfOffers();

// Рендерим пины на карте
renderPins(offers);
