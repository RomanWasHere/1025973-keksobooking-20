'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13,
    MOUSE_LEFT: 1
  };

  var isEscEvent = function (evt) {
    return evt.keyCode === KeyCode.ESC;
  };

  var isEnterEvent = function (evt) {
    return evt.keyCode === KeyCode.ENTER;
  };

  var isMouseLeftEvent = function (evt) {
    return evt.which === KeyCode.MOUSE_LEFT;
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isMouseLeftEvent: isMouseLeftEvent
  };
})();

