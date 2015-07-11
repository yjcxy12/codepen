$(function () {
  $('#new-quote').on('click', ajaxCall);
  ajaxCall();
  twttr.ready(createTwtBtn);
});

function ajaxCall() {
  return $.ajax({
    url: 'http://api.forismatic.com/api/1.0/', 
    type: 'POST', 
    data: {
      method: 'getQuote',
      format: 'jsonp',
      lang: 'en',
      jsonp: 'callback'
    },
    dataType: 'jsonp'
  });
}

function callback(response) {
  $('#quote-text').empty();
  var $h4 = $('<h4 class=quote-body></h4>');
  var $author = $('<h4 class="quote-author"></h4>');
  $h4.text(response.quoteText);
  $author.text('-- ' + (response.quoteAuthor === ''? 'Anonymous': response.quoteAuthor));
  $h4.appendTo('#quote-text');
  $author.appendTo('#quote-text');
  
  createTwtBtn();
}

function createTwtBtn() {
  twttr.widgets.createShareButton(
    '',
    $('#tweet-btn')[0],
    {
      text: $('#quote-text').find('.quote-body').text() + ' ' + $('#quote-text').find('.quote-author').text(),
      count: 'none',
      size: 'large'
    }
  ).then(function (el) {
    $('#tweet-btn').find('iframe').each(function (i, ele) {
      if (el !== ele) {
        $(ele).remove();
      }
    });
  });
}