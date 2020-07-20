'use strict';

(function () {
  var SERVER_URL = 'https://javascript.pages.academy/keksobooking/data';

  var Status = {
    SUCCESS: 200,
    INVALID_REQUEST: 400,
    NOT_AUTHORIZED: 401,
    ERROR_NOT_FOUND: 404,
    SERVER_ERROR: 500,
    TIMEOUT_TIME: 10000
  };

  // Загрузка объявлений с сервера
  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Status.SUCCESS:
          onSuccess(xhr.response);
          break;

        case Status.INVALID_REQUEST:
          error = 'Неверный запрос';
          break;
        case Status.NOT_AUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case Status.ERROR_NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        case Status.SERVER_ERROR:
          error = 'Во время обращения к серверу произошла ошибка. Пожалуйста, проверьте ваше интернет-соединение и обновите страницу';
          break;
        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = Status.TIMEOUT_TIME; // 10s

    xhr.open('GET', SERVER_URL);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();