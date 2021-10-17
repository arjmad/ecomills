
/* -------------------------------------------------------------------------------
   Hover Box
--------------------------------------------------------------------------------*/

$(function(){

  // mouse over for hovers and other ".box" things
  $('.box').livequery(function(){
    $(this).hover(function() { 
      $(this).addClass('over'); 
    }, function() { 
      $(this).removeClass('over'); 
    });
    return false
  });

  // Fade the last 3 chars of long lines (Hovers only)
  $('.char_end_1').livequery(function(){
    $(this).css('opacity', 0.75);
  });
  $('.char_end_2').livequery(function(){
    $(this).css('opacity', 0.5);
  });
  $('.char_end_3').livequery(function(){
    $(this).css('opacity', 0.2);
  });

}); // ready
