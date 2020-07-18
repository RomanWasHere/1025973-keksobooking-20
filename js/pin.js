'use strict';

(function () {
  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66
  };

  var TWO = 2;

  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Отрисовываем метки на карте, клонирование
  var getMarkFragment = function (mark) {
    var mapPoint = mapPinTemplate.cloneNode(true);
    mapPoint.style.top = (mark.location.y - PinSize.HEIGHT) + 'px';
    mapPoint.style.left = mark.location.x - (PinSize.WIDTH / 2) + 'px';
    mapPoint.querySelector('img').src = mark.author.avatar;
    mapPoint.querySelector('img').alt = mark.offer.title;
    return mapPoint;
  };

  // Записываем все метки во fragment
  var renderMarks = function (marks) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < marks.length; i++) {
      var mark = marks[i];
      var pin = getMarkFragment(mark);
      pin.tabIndex = i + TWO;
      fragment.appendChild(pin);
      window.map.addMarkEventHeandlers(pin, mark);
    }
    window.map.addMarksFragment(fragment);
  };

  window.pin = {
    renderMarks: renderMarks
  };
})();

