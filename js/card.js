'use strict';

(function () {
  var mapCardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCard = null;

  // Обработчик закрытия окна по нажатию на ESC
  var onPopupPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
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

  // Заполняем объявление на карте. Клонирование
  var renderMapPopup = function (mark) {
    removePopup();
    mapCard = mapCardPopupTemplate.cloneNode(true);
    mapCard.querySelector('.popup__title').textContent = mark.offer.title;
    mapCard.querySelector('.popup__text--address').textContent = mark.offer.address;
    mapCard.querySelector('.popup__text--price').textContent = mark.offer.price + ' ₽/ночь';
    mapCard.querySelector('.popup__type').textContent = window.data.translateType[mark.offer.type];
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
    var firstImage = popupPhotos.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();
    firstImage.remove();

    for (var i = 0; i < photos.length; i++) {
      var cloneImage = firstImage.cloneNode(true);
      cloneImage.src = photos[i];
      fragment.appendChild(cloneImage);
    }
    popupPhotos.appendChild(fragment);
  };

  // EXPORT
  window.card = {
    renderPopup: renderMapPopup
  };
})();
