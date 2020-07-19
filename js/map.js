'use strict';

(function () {
  var PinSetting = {
    HEIGHT: 75,
    HALF_WIDTH: 33,
    HALF_HEIGHT: 33,
    TAIL_HEIGHT: 16
  };

  var rect = document.querySelector('.map__overlay').getBoundingClientRect();

  // Границы доступной области для перемещения метки
  var MIN_COORD = {
    X: rect.left - PinSetting.HEIGHT - PinSetting.HALF_HEIGHT,
    Y: 130 - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
  };

  var MAX_COORD = {
    X: rect.width - PinSetting.HALF_HEIGHT,
    Y: 630 - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinButtonMain = document.querySelector('.map__pin--main');
  var isActive = false;

  // Стартовые координаты главной метки
  var startMainPinPosition = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mapPinButtonMain.offsetLeft + PinSetting.HALF_HEIGHT;
      y = mapPinButtonMain.offsetTop + PinSetting.HALF_HEIGHT + PinSetting.TAIL_HEIGHT;
    } else {
      x = mapPinButtonMain.offsetLeft + PinSetting.HALF_WIDTH;
      y = mapPinButtonMain.offsetTop + PinSetting.HALF_HEIGHT;
    }
    window.form.putMainPinPositionToAddress(x, y);
  };

  // функция добавления для одной метки обработчика события.
  var addMarkEventHeandlers = function (pin, mark) {
    pin.addEventListener('click', function () {
      window.card.renderPopup(mark);
    });
  };

  // Функция для перевода страницы в активное состояние
  var activateMap = function (marks) {
    isActive = true;
    map.classList.remove('map--faded');
    window.pin.renderMarks(marks);
    startMainPinPosition();
    window.form.changeStateForm();
  };

  // Навешивание обработчиков событий
  var initMainPinEvents = function (marks) {
    mapPinButtonMain.addEventListener('mousedown', function (evt) {
      if (window.utils.isMouseLeftEvent(evt)) {
        activateMap(marks);
      }
    });

    // Обработчикоткрытия закрытия окна по нажатию на Enter
    mapPinButtonMain.addEventListener('keydown', function (evt) {
      if (window.utils.isEnterEvent(evt)) {
        activateMap(marks);
      }
    });
  };

  // функцию внутри этого модуля для соблюдения принципа инкапсуляции для DOM элемента map.
  var addMarksFragment = function (fragment) {
    mapPins.appendChild(fragment);
  };

  // Перетаскиваем метку
  mapPinButtonMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordinates = {
        x: mapPinButtonMain.offsetLeft - shift.x,
        y: mapPinButtonMain.offsetTop - shift.y
      };

      if (coordinates.x < MIN_COORD.X) {
        coordinates.x = MIN_COORD.X;
      } else if (coordinates.x > MAX_COORD.X) {
        coordinates.x = MAX_COORD.X;
      }

      if (coordinates.y < MIN_COORD.Y) {
        coordinates.y = MIN_COORD.Y;
      } else if (coordinates.y > MAX_COORD.Y) {
        coordinates.y = MAX_COORD.Y;
      }

      mapPinButtonMain.style.top = coordinates.y + 'px';
      mapPinButtonMain.style.left = coordinates.x + 'px';

      startMainPinPosition(coordinates.x, coordinates.y);
    };

    // Удаление обработчиков событий с mousemove, mouseup
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  window.map = {
    startMainPinPosition: startMainPinPosition,
    addMarksFragment: addMarksFragment,
    initMainPinEvents: initMainPinEvents,
    addMarkEventHeandlers: addMarkEventHeandlers
  };
})();
