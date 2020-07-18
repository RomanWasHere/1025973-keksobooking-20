'use strict';

(function () {

  var PinLimit = {
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 130,
    MAX_Y: 600,
  };

  var TITLE = [
    'Уютное гнездышко для молодоженов',
    'Милая, уютная квартирка в центре Токио',
    'Большая уютная квартира'
  ];

  var PriseLimit = {
    MIN: 1000,
    MAX: 1000000
  };

  var DESCRIPTION = [
    'Маленькая чистая квартира на краю города',
    'Большая квартира из трех комнат в центре города',
    'Однушка у парка'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'elevator',
    'conditioner'
  ];

  var TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  // Переводим название типов жилья на русский
  // Не получлось через объект = (
  var translateType = function (type) {
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
  };

  // Функция, возвращающая случайное число в диапазоне
  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Функция, возвращающая случайный элемемент массива
  var getRandomItem = function (items) {
    for (var i = 0; i < items.length; i++) {
      var randomIndex = getRandomValue(0, items.length);
    }
    var randomItem = items[randomIndex];
    return randomItem;
  };

  // Функция, возвращающая случайную длину массива
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

  // Функция, возвращающая одну метку объявлений, заполенной данными
  var getMark = function (index, countUsers) {

    for (var i = 0; i < countUsers; i++) {
      var mark = {
        author: {
          avatar: generateAvatar(index),
        },
        offer: {
          title: getRandomItem(TITLE),
          address: '600, 350',
          price: getRandomValue(PriseLimit.MIN, PriseLimit.MAX),
          rooms: getRandomValue(window.form.RoomLimit.MIN, window.form.RoomLimit.MAX),
          type: translateType(window.form.TYPES),
          guests: getRandomValue(window.form.GuestLimit.MIN, window.form.GuestLimit.MAX),
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
      var mark = getMark(i, count);
      marks.push(mark);
    }
    return marks;
  };

  window.data = {
    translateType: translateType,
    getMarks: getMarks
  };
})();
