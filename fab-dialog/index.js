var $fab = $('#fab');
var isExpanded = false;

$fab.on('click', function () {
  if (!isExpanded) {
    $fab.addClass('is-expanding');
    
    setTimeout(function () {
      $fab.find('.fa').removeClass('fa-plus').addClass('fa-close expand-close');
      $fab.removeClass('is-expanding').addClass('expanded');
      isExpanded = true;
      $fab.trigger('expanded');
    }, 500);
  }
});

$fab.on('click', '.expand-close', function (e) {
  var $close = $(this);
  e.stopPropagation();
  $fab.find('.inner-content').remove();
  $fab.removeClass('expanded').addClass('is-closing');

  setTimeout(function () {
    $close.removeClass('fa-close pull-right expand-close').addClass('fa-plus');
    $fab.removeClass('is-closing');
    isExpanded = false;
  }, 500);
});

$fab.on('expanded', function () {
  $fab.append('<h1 class="inner-content">Content<h1/>');
});
