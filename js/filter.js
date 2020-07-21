'use strict';
(function () {
  var PINS_COUNT = 5;
  var ZERO = 0;

  var PriceRange = {
    LOWER: 10000,
    UPPER: 50000
  };

  var BorderPrice = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGHT: 'high'
  };

  var filterForm = document.querySelector('.map__filters');
  var filtersSelect = filterForm.querySelectorAll('select');
  var housingType = filterForm.querySelector('#housing-type');
  var housingPrice = filterForm.querySelector('#housing-price');
  var housingRooms = filterForm.querySelector('#housing-rooms');
  var housingGuests = filterForm.querySelector('#housing-guests');
  var housingFeatures = filterForm.querySelector('#housing-features');

  var pins = [];

  var activate = function () {
    filtersSelect.forEach(function (it) {
      it.disabled = false;
    });
    housingFeatures.disabled = false;
  };

  var deactivate = function () {
    filterForm.reset();
    filtersSelect.forEach(function (it) {
      it.disabled = true;
    });
    housingFeatures.disabled = true;
  };

  var getIsAnyType = function (value) {
    return value === 'any';
  };

  // Общая функция для фильтрации полей с параметрами: выбранное значение, текущий элемент и ключ
  var filterItem = function (it, item, key) {
    return getIsAnyType(it.value) || it.value === item[key].toString();
  };

  // фильтруем по типу жилья
  var filtrationByType = function (item) {
    return filterItem(housingType, item.offer, 'type');
  };

  // фильтруем по цене
  var filtrationByPrice = function (item) {
    switch (housingPrice.value) {
      case BorderPrice.LOW:
        return item.offer.price < PriceRange.LOWER;
      case BorderPrice.MIDDLE:
        return item.offer.price >= PriceRange.LOWER && item.offer.price <= PriceRange.UPPER;
      case BorderPrice.HIGHT:
        return item.offer.price > PriceRange.UPPER;

      default:
        return true;
    }
  };

  // Сортировка по кол-ву комнат
  var filtrationByRooms = function (item) {
    return filterItem(housingRooms, item.offer, 'rooms');
  };

  // Сортировка по кол-ву гостей
  var filtrationByGuests = function (item) {
    return filterItem(housingGuests, item.offer, 'guests');
  };

  // Сортировка по фичам
  var filtrationByFeatures = function (item) {
    var checkedFeaturesItems = housingFeatures.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  // функция для сохранения исходного массива меток, она вызывается один раз при загрузке данных
  var updatePins = function (items) {
    pins = items;
    filterPins();
  };

  var filterPins = function () {
    var filterItems = pins.filter(function (pin) {
      return filtrationByType(pin) && filtrationByPrice(pin) && filtrationByRooms(pin) && filtrationByGuests(pin) && filtrationByFeatures(pin);
    });
    var displayPins = filterItems.length > PINS_COUNT ? filterItems.slice(ZERO, PINS_COUNT) : filterItems;
    window.pin.renderPins(displayPins);
  };

  var onFilterChange = function () {
    window.pin.removePins();
    window.card.removePopup();
    filterPins();
  };

  filterForm.addEventListener('change', onFilterChange);


  window.filter = {
    activate: activate,
    deactivate: deactivate,
    updatePins: updatePins,
    pins: []
  };
})();
