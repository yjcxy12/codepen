$(function () {
  var CARD_HEIGHT = 128;
  var ini_y, diff_y, init_height, initial_index, final_index;

  $('.panel').each(function (i, ele) {
    $(ele).prop('index', i);
  });
  
  $('.panel').on('mousedown', function (e) {
    $(this).css('cursor', '-webkit-grabbing')
      .css('cursor', 'grabbing')
      .css('z-index', '1');
    
    ini_y = e.pageY;
    init_height = parseFloat($(this).css('top') === 'auto'? 0 : $(this).css('top'));
    initial_index = $(this).prop('index');
    $(this).prop('index', 'none');
    final_index = initial_index;
    
    $(this).on('mousemove', function (e) {
      diff_y = e.pageY - ini_y;
      $(this).css('top',  diff_y + init_height + 'px');

      final_index = initial_index + Math.floor((diff_y - CARD_HEIGHT / 2) / CARD_HEIGHT + 1);
      $(document).trigger('slide:index_changed', [final_index]);
    })

    .on('mouseup', function (e) {
      $(this).off('mousemove').off('mouseup');
      $(this).css('cursor', '-webkit-grab')
        .css('cursor', 'grab');

      reorder(initial_index, final_index, $(this));
      
    });

    
  });

  $(document).on('slide:index_changed', function (e, index) {
    var $prev, $next, new_index;
    var $ele = $('.panel').filter(function (i, panel) {
      return $(panel).prop('index') === index;
    });
    if ($ele.length === 0) {
      return;
    }

    $prev = $('.panel').filter(function (i, panel) {
      return $(panel).prop('index') === index - 1;
    });
    $next = $('.panel').filter(function (i, panel) {
      return $(panel).prop('index') === index + 1;
    });

    if ($prev.length === 0 && index > 0) {
      new_index = +index - 1;
      $ele.prop('index', new_index);
      $ele.animate({top: '-=' + CARD_HEIGHT + 'px'}, 200);
    }
    else if ($next.length === 0) {
      new_index = +index + 1;
      $ele.prop('index', new_index);
      $ele.animate({top: '+=' + CARD_HEIGHT + 'px'}, 200);
    }
  });

  function reorder(initial_index, final_index, $ele) {
    var $prev, $next;
    $ele.animate({top: CARD_HEIGHT * (final_index - initial_index) + 'px'}, 200, function () {
      if (final_index > 0) {
        $prev = $('.panel').filter(function (i, panel) {
          return $(panel).prop('index') === final_index - 1;
        });
        $ele.insertAfter($prev);
      }
      else {
        $next = $('.panel').filter(function (i, panel) {
          return $(panel).prop('index') === final_index + 1;
        });
        $ele.insertBefore($next);
      }
      $('.panel').css({
        'top': 0,
        'z-index': ''
      });
      $('.panel').each(function (i, ele) {
        $(ele).prop('index', i);
      });
    });
  }

  function matrixToArray(str) {
    return str.match(/(-?[0-9\.]+)/g);
  }

  function arrayToMatrix(arr) {
    return 'matrix(' + arr.join(', ') + ')';
  }
});