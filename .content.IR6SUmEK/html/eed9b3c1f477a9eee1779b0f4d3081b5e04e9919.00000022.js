
/* -------------------------------------------------------------------------------
   Feedback
--------------------------------------------------------------------------------*/

$(function(){

  $('#feedback_show_link').click(function() {
    $('#feedback_button').css('display', 'none');	
    $('#feedback_form').css('display', 'block');
  });

  $('#feedback_close_link').click(function() {
    $('#feedback_button').css('display', 'block');	
    $('#feedback_form').css('display', 'none');
  });
  
  $('#improve').change(function() {
    if (this.value == 'other') {
      $('#feedback_content').addClass('expanded');		
      $('#feedback_area').addClass('expanded');			
    } else {
      $('#feedback_content').removeClass('expanded');		
      $('#feedback_area').removeClass('expanded');						
    }
  });

}); // ready
