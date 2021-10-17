
/* -------------------------------------------------------------------------------
   Util
--------------------------------------------------------------------------------*/

$(function(){

  Hover.namespace('util.input');
  Hover.util.input = {

    setSelectionRange: function(input, start, end) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(start, end);
      } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
      }
    },

    setCaretToEnd: function(input) {
      var len = input.value.length;
      Hover.util.input.setSelectionRange(input, len, len);
    },

    setCaretToBegin: function(input) {
      Hover.util.input.setSelectionRange(input, 0, 0);
    },

    setCaretToPos: function(input, pos) {
      Hover.util.input.setSelectionRange(input, pos, pos);
    },

    selectString: function(input, string) {
      var match = new RegExp(string, "i").exec(input.value);
      if (match) {
        var start = match.index;
        var end   = match.index + match[0].length;
        Hover.util.input.setSelectionRange(input, start, end);
      }
    },

    replaceSelection: function(input, str) {
      if (input.setSelectionRange) {
        var start   = input.selectionStart;
        var end     = input.selectionEnd;
        input.value = input.value.substring(0,start) + str + 
                      input.value.substring(end);
        if (start != end) {
          // has there been a selection
          Hover.util.input.setSelectionRange(input, start, start + str.length);
        } else {
          Hover.util.input.setCaretToPos(input, start + str.length);
        }
      } else if (document.selection) {
        var range = document.selection.createRange();
        if (range.parentElement() == input) {
          var isCollapsed = range.text == '';
          range.text = replaceString;
          if (!isCollapsed) { 
            // there has been a selection
            range.moveStart('character', -replaceString.length);
            range.select();
          }
        }
      }
    }
  };  // Hover.util.input

  Hover.namespace('util.constrain');
  Hover.util.constrain = {
    hoverName: function(obj) {
      obj.value = obj.value.replace(/[\W]/, '');
    }
  };

  Hover.namespace('util.upgradePop');
  Hover.util.upgradePop = {
    init: function() {
      var elem = $('#upgrade_link');
      if (elem.length > 0) {
        elem.click(function() {
          Hover.util.popLayer.show();
        });
      }
      elem = $('#close_pop_link');
      if (elem.length > 0) {
        elem.click(function() {
          Hover.util.popLayer.closePop();
        });
      }
    }
  };

  Hover.namespace('util.hoverThisHelp');
  Hover.util.hoverThisHelp = {
    show : function () {
		  $('#hover_tips').css('display', 'none');	
		  $('#hoverthis-help').css('display', 'block');
	  },
		
	  hide : function () {
		  $('#hover_tips').css('display', 'block');	
		  $('#hoverthis-help').css('display', 'none');
	  }
  };

  Hover.namespace('util.alertMessage');
  Hover.util.alertMessage = {
    init: function() {
      $('#alert_close_link').click(function() {
        Hover.util.alertMessage.closeMessage();
      });
    },

    closeMessage: function() {
      $('#alert_message').css('opacity', 1);
      $('#alert_message').animate({
			  height: 0,
			  paddingTop: 0,
			  opacity: 0
		  }, 200, 'easeOutQuad');
    }
  };

  Hover.namespace('util.ajaxMessage');
  Hover.util.ajaxMessage = {
    notice: function(msg) {
      $('#dlg-error').css('display','none');
      $('#notice_text').html(msg);
      $('#dlg-notice').css('display', 'block');
    },

    error: function(msg) {
      $('#dlg-notice').css('display','none');
      $('#error_text').html(msg);
      $('#dlg-error').css('display', 'block');
    },

    clear: function() {
      $('#dlg-error').css('display','none');
      $('#dlg-notice').css('display','none');
    }
  };

  Hover.namespace('util.hoverThisHelp');
  Hover.util.hoverThisHelp = {
    show : function () {
      $('#hover_tips').css('display', 'none');	
      $('#hoverthis-help').css('display', 'block');
    },
		
    hide : function () {
      $('#hover_tips').css('display', 'block');	
      $('#hoverthis-help').css('display', 'none');
    }
  };

  Hover.namespace('util.popupWindow');
  Hover.util.popupWindow = {
    obj : null,
    open: function(url, name, opts) {
      var url  = url  || '#';
      var name = name || '';
      var options = jQuery.extend({
        status:      'no',
        toolbar:     'no',
        location:    'no',
        menubar:     'no',
        directories: 'no',
        resizable:   'no',
        scrollbars:  'no',
        width:       500,
        height:      450
      }, opts || {});
      var winleft  = (screen.width  - options.width)  / 2;
      var wintop   = (screen.height - options.height) / 2;
      var features = [];
      for (var i in options) {
        features.push(i+'='+options[i]);
      }
      features.push('left='+winleft);
      features.push('top='+wintop);
      Hover.util.popupWindow.obj = window.open(url, name, features.join(','));
      if (!Hover.util.popupWindow.obj) {
        return false;
      }
      if (parseInt(navigator.appVersion) >= 4) {
        Hover.util.popupWindow.obj.window.focus();
      }
      return true;
    }
  };

  Hover.namespace('util.popLayer');
  Hover.util.popLayer = {
    show: function() {
      var popLayerDiv       = $('#pop_layer');
      var popLayerContent   = $('#pop_content');
      var intContentWidth   = popLayerContent.width();
      var intScrollWidth    = $(document).width();
      var intScrollHeight   = $(document).height();
      var intWindowWidth    = $(window).width();
      var intWindowHeight   = $(window).height();
      var intContentTopPos  = $(window).scrollTop() + 165;
      var intContentLeftPos = (intWindowWidth / 2) - (intContentWidth / 2);
      popLayerDiv.css({
        'display':'block',
        'width':intScrollWidth,
        'height':intScrollHeight
      });
      popLayerContent.css({
        'margin-top': intContentTopPos,
        'left': intContentLeftPos
      });	
      if ($.browser.msie) {
        Hover.util.popLayer.toggleHideSelectLists();	
      }
      // Turn on display
      popLayerDiv.css('display','block');
      popLayerContent.css('display','block');
    },

    closePop: function() {
      if ($.browser.msie) {
        Hover.util.popLayer.toggleHideSelectLists();	
      }
      $('#pop_layer').css('display','none');
    },

    fadeClosePop: function() {
      $('#pop_layer').effect('opacity').start(0);
      if ($.browser.msie) {
        Hover.util.popLayer.toggleHideSelectLists();	
      }
    },

    // Hides select list in IE because they take the highest 
    // layer and hover over top of the popLayer
    toggleHideSelectLists: function() { 
      return;
    }
  };

}); // ready