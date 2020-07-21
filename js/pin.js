'use strict';

(function () {
  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66
  };

  var pins = [];
  var TWO = 2;

  var mapPins = document.querySelector('.map .map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Отрисовываем метки на карте, клонирование
  var getPin = function (mark) {
    var pinItem = pinTemplate.cloneNode(true);
    pinItem.style.top = mark.location.y - PinSize.HEIGHT + 'px';
    pinItem.style.left = mark.location.x - (PinSize.WIDTH / 2) + 'px';
    pinItem.querySelector('img').src = mark.author.avatar;
    pinItem.querySelector('img').alt = mark.offer.title;
    return pinItem;
  };

  var deactivatePin = function () {
    var mapActivePin = document.querySelector('.map__pin--active');
    if (mapActivePin) {
      mapActivePin.classList.remove('map__pin--active');
    }
  };

  // Записываем все метки во fragment
  var renderPins = function (marks) {
    var fragment = document.createDocumentFragment();

    marks.forEach(function (mark, index) {
      var pin = getPin(mark);
      pin.tabIndex = index + TWO;
      pins.push(pin);

      fragment.appendChild(pin);
      window.map.addPinClick(pin, mark);
    });
    mapPins.appendChild(fragment);
  };

  // функция для удаления меток из массива
  var removePins = function () {
    pins.forEach(function (pin) {
      pin.remove();
    });
    pins = [];
  };

  window.pin = {
    renderPins: renderPins,
    removePins: removePins,
    deactivatePin: deactivatePin,
    getPin: getPin
  };
})();
