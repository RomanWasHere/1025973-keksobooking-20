'use strict';

(function () {

  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCard = null;

  // Обработчик закрытия окна по нажатию на ESC
  var onDocumentKeyDown = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      removePopup();
    }
  };

  // Удаляем со страницы попап
  var removePopup = function () {
    if (mapCard !== null) {
      mapCard.remove();
      window.pin.deactivatePin();
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  };

  // создаем фрагмент с фитчами и записываем его во фрагмент
  var createFeatureFragment = function (mark) {
    var featureFragment = document.createDocumentFragment();
    mark.offer.features.forEach(function (item) {
      var featureItem = document.createElement('li');
      featureItem.className = 'popup__feature popup__feature--' + item;
      featureFragment.appendChild(featureItem);
    });

    return featureFragment;
  };

  // Заполняем объявление на карте. Клонирование
  var renderPopup = function (mark) {
    removePopup();
    mapCard = popupTemplate.cloneNode(true);
    mapCard.querySelector('.popup__title').textContent = mark.offer.title;
    mapCard.querySelector('.popup__text--address').textContent = mark.offer.address;
    mapCard.querySelector('.popup__text--price').textContent = mark.offer.price + ' ₽/ночь';
    mapCard.querySelector('.popup__text--capacity').textContent = mark.offer.rooms + ' комнаты для ' + mark.offer.guests + ' гостей';
    mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + mark.offer.checkin + ', выезд до ' + mark.offer.checkout;
    mapCard.querySelector('.popup__type').textContent = window.form.TYPES[mark.offer.type.toUpperCase()];
    mapCard.querySelector('.popup__description').textContent = mark.offer.description;
    mapCard.querySelector('.popup__avatar').src = mark.author.avatar;
    mapCard.querySelector('.popup__features').innerHTML = '';
    mapCard.querySelector('.popup__features').appendChild(createFeatureFragment(mark));
    renderPhotos(mark.offer.photos);
    mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);

    var closePopupButton = mapCard.querySelector('.popup__close');
    document.addEventListener('keydown', onDocumentKeyDown);
    closePopupButton.addEventListener('click', removePopup);
  };

  // Функция проверки конейнера с фотографиями на наличие фото
  var renderPhotos = function (imgs) {
    var popupPhoto = mapCard.querySelector('.popup__photos');
    if (imgs.length === 0) {
      popupPhoto.remove();
    } else {
      renderPhotosImages(popupPhoto, imgs);
    }
  };

  // Колонируем фотографии в их контейнер
  var renderPhotosImages = function (popupPhotos, photos) {
    var firstImage = popupPhotos.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();
    firstImage.remove();

    photos.forEach(function (photo) {
      var cloneImage = firstImage.cloneNode(true);
      cloneImage.src = photo;
      fragment.appendChild(cloneImage);
    });

    firstImage.remove();
    popupPhotos.appendChild(fragment);
  };

  // EXPORT
  window.card = {
    renderPopup: renderPopup,
    removePopup: removePopup
  };
})();
