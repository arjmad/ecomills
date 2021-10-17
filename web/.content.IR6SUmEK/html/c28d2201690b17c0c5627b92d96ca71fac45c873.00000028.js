
/* -------------------------------------------------------------------------------
   Rating
--------------------------------------------------------------------------------*/

$(function(){

  var currentRating = 0;

  $('#feedback_content .rating_icon').hover(function() {
    var ndx = $('LI.rating_icon').index(this) + 1;
    var img = '/resources/img/icons/icn_rating_blue.gif';
    $('LI.rating_icon').slice(0,ndx).children('img').attr('src', img).end();
  }, function () {
    var val = currentRating;
    var img ='/resources/img/icons/icn_rating_grey.gif';
    $('LI.rating_icon').slice(val).children('img').attr('src', img).end();
  });

  $('#feedback_content .rating_icon').click(function() {
    var ndx = $('LI.rating_icon').index(this) + 1;
    currentRating = ndx;
    var img = '/resources/img/icons/icn_rating_grey.gif';
    var val = currentRating;
    $('LI.rating_icon').slice(val).children('img').attr('src', img).end();
    $('#rating').val(val);
  });

}); // ready
