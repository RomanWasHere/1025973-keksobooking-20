'use strict';

(function () {
  var map = document.querySelector('.map');
  var addressInput = document.querySelector('input[name="address"]');
  var mapPinButtonMain = document.querySelector('.map__pin--main');
  var isActive = false;

  var updateAddress = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mapPinButtonMain.offsetLeft + window.utils.PinSetting.HALF_HEIGHT;
      y = mapPinButtonMain.offsetTop + window.utils.PinSetting.HALF_HEIGHT + window.utils.PinSetting.TAIL_HEIGHT;
    } else {
      x = mapPinButtonMain.offsetLeft + window.utils.PinSetting.HALF_WIDTH;
      y = mapPinButtonMain.offsetTop + window.utils.PinSetting.HALF_HEIGHT;
    }
    addressInput.value = x + ', ' + y;
  };

  var addPinClick = function (pin, mark) {
    pin.addEventListener('click', function () {
      window.card.renderPopup(mark);
      window.pin.addActivate(pin);
    });
  };

  var defaultMainPinPosition = {
    top: null,
    left: null,
  };

  var saveStartPosition = function () {
    defaultMainPinPosition.top = mapPinButtonMain.style.top;
    defaultMainPinPosition.left = mapPinButtonMain.style.left;
  };

  var loadStartPosition = function () {
    mapPinButtonMain.style.top = defaultMainPinPosition.top;
    mapPinButtonMain.style.left = defaultMainPinPosition.left;
  };

  var activate = function (pins) {
    isActive = true;
    map.classList.remove('map--faded');
    window.filter.updatePins(pins);
    updateAddress();
    window.form.activate();
    window.filter.activate();
  };

  var deactivate = function () {
    isActive = false;
    map.classList.add('map--faded');
    window.form.deactivate();
    loadStartPosition();
    updateAddress();
    window.pin.removeElements();
    window.card.removePopup();
    window.filter.deactivate();
    window.photo.remove();
    window.filter.pins = [];
  };

  var initMainPinEvents = function () {

    var minCoord = window.utils.getMinCoord();
    var maxCoord = window.utils.getMaxCoord();

    mapPinButtonMain.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      if (!isActive && window.utils.isMouseLeftEvent(evt)) {
        window.backend.load(activate, window.form.showErrorPopup);
      }

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

        if (coordinates.x < minCoord.x) {
          coordinates.x = minCoord.x;
        } else if (coordinates.x > maxCoord.x) {
          coordinates.x = maxCoord.x;
        }

        if (coordinates.y < minCoord.y) {
          coordinates.y = minCoord.y;
        } else if (coordinates.y > maxCoord.y) {
          coordinates.y = maxCoord.y;
        }

        mapPinButtonMain.style.top = coordinates.y + 'px';
        mapPinButtonMain.style.left = coordinates.x + 'px';

        updateAddress(coordinates.x, coordinates.y);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    mapPinButtonMain.addEventListener('keydown', function (evt) {
      if (!isActive && window.utils.isEnterEvent(evt)) {
        window.backend.load(activate);
      }
    });
  };

  var prepare = function () {
    updateAddress();
    saveStartPosition();
    initMainPinEvents();
  };

  window.map = {
    prepare: prepare,
    addPinClick: addPinClick,
    deactivate: deactivate
  };
})();
