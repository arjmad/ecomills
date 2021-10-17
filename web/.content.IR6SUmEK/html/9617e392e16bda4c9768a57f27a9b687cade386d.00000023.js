
/* --------------------------------------------------------
   Namespace
-------------------------------------------------------- */

if (typeof Hover == 'undefined') {
  Hover = {};
}

Hover.namespace = function(arg) {
  var ns = String(arg);
  if (!ns.length) { return null; }
  var levels = ns.split('.');
  var currentNS = Hover;
  for (var i=(levels[0] == 'Hover') ? 1 : 0; i < levels.length; i++) {
    currentNS[levels[i]] = currentNS[levels[i]] || {};
    currentNS = currentNS[levels[i]];
  }
  return currentNS;
};

Hover.namespace('util');
Hover.util = {
  setInputDefault: function(input, defValue, color, defColor) {
    if (!input)    { return; }
    if (!color)    { color = '#ccc'; }
    if (!defColor) { defColor = '#4c4c4c'; }

    if ($.trim(input.val()) == "") {
      input.val(defValue);
      input.css('color', color);
    }
    input.focus(function() {
      if (input.val() == defValue) {
        input.val("");
      }
      input.css('color', defColor);
    });
    input.blur(function() {
      if ($.trim(input.val()) == "") {
        input.val(defValue);
        input.css('color', color);
      } else {
        input.css('color', defColor);
      }
    });
  },

  resetForm: function(formId) {
    var obj = $('#'+formId);
    $(':input', obj).each(function(){
      var type = this.type;
      var tag  = this.tagName.toLowerCase();
      if (type == 'text' || type == 'password' || tag == 'textarea') {
        this.value = '';
      } else if (type == 'checkbox' || type == 'radio') {
        this.checked = false;
      } else if (tag == 'select') {
        this.selectedIndex = 0;
      }
    });
  },

  selectDomain: function(domain, cdomain) {
    location.href = '/manage/domains/select_domain?domain=' + domain;
  },

  submitByReturn: function(e, form, callback) {
    var key = e ? (e.which ? e.which : e.keyCode) : event.keyCode;
    if (key == 13) {
      if (callback) {callback();}
      if (form.onsubmit) {form.onsubmit();}
      form.submit();
    }
  },

  checkCapsLock: function(e) {
    var key = e ? (e.which ? e.which : e.keyCode) : event.keyCode;
    var msg = 'Caps Lock is On.\n\nTo prevent entering the password ' +
              'incorrectly,\nyou should press Caps Lock to turn it off.';
    if ( ((key >= 65 && key <= 90)  && !e.shiftKey) ||   // upper case, no shift
         ((key >= 97 && key <= 122) &&  e.shiftKey) )    // lower case w/shift
      { alert(msg); }
  },

  onReturn: function(e, callback) {
    if (!callback) { return; }
    var key = e ? (e.which ? e.which : e.keyCode) : event.keyCode;
    if (key == 13) { callback(); }
  },

  checkGst: function() {
    var elem = $('#warn-gst');
    if (!elem) {
      alert('GST element missing');
      return;
    }
    if ($('#state').val() == 'ON' && $('#country').val() == 'CA') {
      elem.css('display','block');
    } else {
      elem.css('display','none');
    }
  },

  formatCurrency: function(arg) {
    var num = arg.toString().replace(/\$|\,/g,'');
    if (isNaN(num)) { num = '0'; }
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    var cents = num % 100;
    num = Math.floor(num/100).toString();
    if (cents < 10) { cents = '0' + cents; }
    for (var i=0; i < Math.floor((num.length-(1+i))/3); i++) {
      num = num.substring(0,num.length-(4*i+3))+','+
                            num.substring(num.length-(4*i+3));
    }
    return (((sign)?'':'-') + num + '.' + cents);
  },

  asCurrency: function(num) {
    var value = String(num).replace(/[^\d\.]+/g,'');
    var pos = value.lastIndexOf('.');
    var dec = '', whole='', newval='';
    if (pos != -1) {
      pos++;
      dec = value.substring(pos, value.length);
      if (dec.length > 2) {
        dec = dec.substring(0,2);
      } else if (dec.length < 2) {
        while (dec.length < 2) { dec += '0'; }
      }
      whole = value.substring(0, pos - 1);
    } else {
      whole = value;
      dec = '00';
    }
    for (var i=0; i < whole.length; i++) {
      newval = whole.substring(whole.length-i-1, whole.length-i) + newval;
    }
    if (newval == '') { newval = '0'; }
    return(newval + '.' + dec);
  },

  autoCurrency: function(field) {
    var value = String($(field).val()).replace(/[^\d\.]+/g,'');
    if ((value == '') || isNaN(value)) { 
      $(field).val(''); // delete non-numeric values
      return;
    }
    $(field).val(Hover.util.asCurrency(value));
  },

  scrollToElement: function(id) {
    var x=0, y=0;
    var elem = $('#'+id)[0];
    if (!elem) { return; }
    while (elem != null) {
      x += elem.offsetLeft;
      y += elem.offsetTop;
      elem = elem.offsetParent;
    }
    window.scrollTo(x,y);
  },

  elementExists: function(elem) {
    if ((typeof(elem) == 'undefined') || (elem == null) ) {return false;}
    if ((typeof(elem) != 'object')    || !elem.length)    {return false;}
    return( (elem.length > 0) ? true : false);
  },

  arrayIncludes: function(ary, val) {
    var ret = false;
    $.each(ary, function(i, v){
      if (val == v) { ret = true; }
    });
    return ret;
  },

  getElementsByTagAndClassName: function(className, tagName) {
    if (null == tagName) {
      tagName = '*';
    }
    var children = document.getElementsByTagName(tagName) || document.all;
    if (null == children || 0 == children.length) {
      return [];
    }
    var elements = [];
    if (className == null) {
      return children;
    }
    for (var i=0; i < children.length; i++) {
      var child = children[i];
      var classNames = child.className.split(' ');
      for (var j=0; j < classNames.length; j++) {
        if (classNames[j] == className) {
          elements.push(child);
          break;
        }
      }
    }
    return elements;
  },

  copyToClipboard: function(text) {
    // IE only
    if (window.clipboardData) {  
      window.clipboardData.setData('text',text);
      return true;
    }
    return false;
  }

}; // Hover.util

$('input.currency').blur(function(){Hover.util.autoCurrency(this);});


/* --------------------------------------------------------
   Browser Detection
-------------------------------------------------------- */

$(function(){
  var userAgent = navigator.userAgent.toLowerCase();
  $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase()); 
  if ($.browser.msie) {
    $('body').addClass('browserIE');
    $('body').addClass('browserIE' + $.browser.version.substring(0,1));
  }
  if ($.browser.chrome) {
    $('body').addClass('browserChrome');
    userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
    userAgent = userAgent.substring(0,1);
    $('body').addClass('browserChrome' + userAgent);
    $.browser.safari = false;
  }
  if ($.browser.safari) {
    $('body').addClass('browserSafari');
    userAgent = userAgent.substring(userAgent.indexOf('version/') +8);
    userAgent = userAgent.substring(0,1);
    $('body').addClass('browserSafari' + userAgent);
  }
  if ($.browser.mozilla) {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
      $('body').addClass('browserFirefox');
      userAgent = userAgent.substring(userAgent.indexOf('firefox/') +8);
      userAgent = userAgent.substring(0,1);
      $('body').addClass('browserFirefox' + userAgent);
    } else{
      $('body').addClass('browserMozilla');
    }
  }
  if ($.browser.opera){
    $('body').addClass('browserOpera');
  } 
});


/* --------------------------------------------------------
   Class
-------------------------------------------------------- */

var Class = {
  extend: function(parent, def) {
    if (arguments.length == 1) def = parent, parent = null;
    var func = function() {
      if (!Class.extending) this.initialize.apply(this, arguments);
    };
    if (typeof(parent) == 'function') {
      Class.extending = true;
      func.prototype = new parent();
      delete Class.extending;
    }
    var mixins = [];
    if (def && def.include) {
      if (def.include.reverse) {
        // methods defined in later mixins should override prior
        mixins = mixins.concat(def.include.reverse());
      } else {
        mixins.push(def.include);
      }
      delete def.include; // clean syntax sugar
    }
    if (def) Class.inherit(func.prototype, def);
    for (var i = 0; (mixin = mixins[i]); i++) {
      Class.mixin(func.prototype, mixin);
    }
    return func;
  },

  mixin: function (dest) {
    for (var i = 1; (src = arguments[i]); i++) {
      if (typeof(src) != 'undefined' && src !== null) {
        for (var prop in src) {
          if (!dest[prop] && typeof(src[prop]) == 'function') {
            // only mixin functions, if they don't previously exist
            dest[prop] = src[prop];
          }
        }
      }
    }
    return dest;
  },

  inherit: function(dest, src, fname) {
    if (arguments.length == 3) {
      var ancestor = dest[fname], descendent = src[fname], method = descendent;
      descendent = function() {
        var ref = this.parent; this.parent = ancestor;
        var result = method.apply(this, arguments);
        ref ? this.parent = ref : delete this.parent;
        return result;
      };
      // mask the underlying method
      descendent.valueOf = function() { return method; };
      descendent.toString = function() { return method.toString(); };
      dest[fname] = descendent;
    } else {
      for (var prop in src) {
        if (dest[prop] && typeof(src[prop]) == 'function') {
          Class.inherit(dest, src, prop);
        } else {
          dest[prop] = src[prop];
        }
      }
    }
    return dest;
  }
};

Class.create = function() {
  return Class.extend.apply(this, arguments);
};

/* --------------------------------------------------------
   Event
-------------------------------------------------------- */

var Event = {
  listeners: [],

  add: function(elem, eventType, fn, scope) {
    if (Event.isCollection(elem)) {
      var ok = true;
      for (var i=0; i < elem.length; i++) {
        ok = (Event.add(elem[i], eventType, fn, scope) && ok);
      }
      return ok;
    } else if (typeof elem == "string") {
      elem = document.getElementById(elem);
    }
    if (!elem) { return false; }
    var wrappedFn = function(e) {
      return fn.call(elem, e, scope);
    }
    Event.listeners[Event.listeners.length] = [elem,eventType,fn,wrappedFn,scope];
    if (elem.addEventListener) {
      elem.addEventListener(eventType, wrappedFn, false);
    } else if (elem.attachEvent) {
      elem.attachEvent("on"+eventType, wrappedFn);
    }
    wrappedFn = null;
    return true;
  },

  remove: function(elem, eventType, fn) {
    if (Event.isCollection(elem)) {
      var ok = true;
      for (var i=0; i < elem.length; i++) {
        ok = (Event.remove(elem[i], eventType, fn, scope) && ok);
      }
      return ok;
    } else if (typeof elem == "string") {
      elem = document.getElementById(elem);
    }
    var cacheItem = null;
    var index = Event.getCacheIndex(elem, eventType, fn);
    if (index >= 0) {
      cacheItem = Event.listeners[index];
    }
    if (!elem || !cacheItem) {
      return false;
    }
    var cachedFunction = cacheItem[3];
    if (elem.removeEventListener) {
      elem.removeEventListener(eventType, cachedFunction, false);
    } else if (elem.detachEvent) {
      elem.detachEvent("on" + eventType, cachedFunction);
    }
    delete Event.listeners[index][3];
    delete Event.listeners[index][2];
    delete Event.listeners[index];
    return true;
  },

  stop: function(event) {
    Event.stopPropagation(event);
    Event.preventDefault(event);
  },

  stopPropagation: function(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  preventDefault: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },

  removeAll: function(elem, obj) {
    if (Event.listeners && Event.listeners.length > 0) {
      var listener;
      for (var i=0; i < Event.listeners.length; ++i) {
        listener = Event.listeners[i];
        if (listener) {
          obj.removeEvent(listener[0], listener[1], listener[2]);
        }
      }
      Event.listeners = [];
    }
  },

  getListeners: function() {
    return Event.listeners;
  },

  getCacheIndex: function(elem, sType, fn) {
    var listener;
    for (var i=0; i < Event.listeners.length; ++i) {
      listener = Event.listeners[i];
      if (listener             &&
          listener[2] == fn    &&
          listener[0] == elem  &&
          listener[1] == sType) {
          return i;
      }
    }
    return -1;
  },

  isCollection: function(obj) {
    return (obj                    && 
            obj.length             && 
            typeof obj != "string" && 
            !obj.tagName           && 
            !obj.alert             && 
            typeof obj[0] != "undefined");
  }
}; // Event


/* --------------------------------------------------------
   Bubble
-------------------------------------------------------- */

var Bubble = {
  container : 'bubble-box', 
  defaultWidth : '183px',
  specialWidthClass : 'custom-', 
  pointer : 'bubble-pointer', 
  pointerDefaultLeft : '-26px', 
  pointerDefaultTop : '5px', 
  linkClassName : 'bubble-link', 

  get: function(arg) {
    if (typeof arg == 'string') {
      return document.getElementById(arg);
    }
    return arg;
  },

  getEventTarget: function(event) {
    var target = null;
    if (typeof event.target != 'undefined') {
      target = event.target;
    } else {
      target = event.srcElement;
    }
    while (target.nodeType == 3 && target.parentNode != null) {
      target = target.parentNode;
    }
    return target;
  },

  getElementsByTagAndClassName: function(className, tagName) {
    if (null == tagName) {
      tagName = '*';
    }
    var children = document.getElementsByTagName(tagName) || document.all;
    if (null == children || 0 == children.length) {
      return [];
    }
    var elements = [];
    if (className == null) {
      return children;
    }
    for (var i=0; i < children.length; i++) {
      var child = children[i];
      var classNames = child.className.split(' ');
      for (var j=0; j < classNames.length; j++) {
        if (classNames[j] == className) {
          elements.push(child);
          break;
        }
      }
    }
    return elements;
  },

  stopEvent: function(event) {
    if (typeof event.stopPropagation != 'undefined') {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  attachEventListener: function(obj, evType, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(evType, fn, true);
      return true;
    } 
    else if (obj.attachEvent) {
      var r = obj.attachEvent('on'+evType, fn);
      return r;
    }
    else {
      return false;
    }
  },

  getUA: function() {
    var detect = navigator.userAgent.toLowerCase();
    var ua = ['konqueror','safari','omniweb','opera','msie','icab','compatible'];
    var browser='', version='';
    for (var i=0; i < ua.length; i++) {
      var place = detect.indexOf(ua[i]) + 1;
      if (place) {
        if (ua[i] == 'compatible') {
          browser = 'netscape';
          version = detect.charAt(8);
        } else {
          browser = ua[i];
          version = detect.charAt(place + ua[i]);
        }
        break;
      }
    }
    return [browser, version];
  },

  setWidth: function(obj) {
    if (!obj) { return false; }
    var container = Bubble.get(Bubble.container);
    var classes   = obj.className.split(' ');
    var width;
    for (var x=0, y=classes.length; x < y; x++) {
      if (classes[x].indexOf(Bubble.specialWidthClass) != -1) {
        width = classes[x].replace(Bubble.specialWidthClass, '');
        break;
      }
    }
    container.style.width = width ? width + 'px' : Bubble.defaultWidth;
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return [valueL, valueT];
  },

  positionBubble : function(obj) {
    var mc = Bubble.get('master_container');
    var pc = Bubble.get('pro-tools-container');
    var offsets   = Bubble.cumulativeOffset(mc || pc);
    var idToUse   = obj.getAttribute('showInfo') || obj.id;
    var objPos    = Bubble.cumulativeOffset(obj); 
    var objLength = obj.offsetWidth;
    var container = Bubble.get(idToUse + '-bubble');
    var pointer   = Bubble.get(idToUse + '-pointer');
    pointer.className = '';
    var ow = container.offsetWidth;
    var oh = container.offsetHeight;
    var totalPos = parseInt(ow + 16 + (objPos[0]-offsets[0]) + objLength);
    if (totalPos >= 900) {
      container.style.left = parseInt(objPos[0] - ow + 33) + 'px';
      container.style.top  = parseInt(objPos[1] - oh - 15) + 'px';
      pointer.style.top    = parseInt(oh - 2) + 'px';
      pointer.style.left   = parseInt(ow - 30) + 'px';
      pointer.className    = 'bubble-pointer-down';
      pointer.style.height = '16px';
      pointer.style.width  = '12px';
    } else {
      var left = parseInt(Bubble.cumulativeOffset(obj)[0] + obj.offsetWidth + 15);
      container.style.left = left + 'px';
      container.style.top  = parseInt(objPos[1] - 12) + 'px';
      pointer.style.left   = '-15px';
      pointer.style.top    = '11px';
      pointer.className    = 'bubble-pointer-horizontal';
    }
    var boxHeight = container.offsetHeight;
    var thePageY  = (parseInt(objPos[1]) - (boxHeight));
    if (thePageY <= 0 ) {
      container.style.top = objPos[1];
    }
  },

  displayBubble: function(event) { 
    if (!event) { event = window.event; }
    Bubble.stopEvent(event);
    Bubble.show(Bubble.getEventTarget(event));
  },

  show: function(obj) {
    if (!obj) { return false; }
    var container;
    if (obj.getAttribute('showInfo')) {
      if (!Bubble.get(obj.getAttribute('showInfo') + '-bubble')) {
        Bubble.injectBubbles(obj.getAttribute('showInfo'))
      }
      container = Bubble.get(obj.getAttribute('showInfo') + '-bubble');
    } else {
      container = Bubble.get(obj.id + '-bubble');
    }
    if (container && obj) { 
      container.style.display = 'none';
      container.style.display = 'block';
      Bubble.positionBubble(obj);
    }
    return false;
  },

  hideBubble: function(event) { 
    if (!event) { event = window.event; }
    var target = Bubble.getEventTarget(event);
    Bubble.hide(target);
  },

  hide: function(obj) {
    if (!obj) { return false; }
    var idToUse   = obj.getAttribute('showInfo') || obj.id;
    var container = Bubble.get(idToUse + '-bubble');
    if (container && (container.style.display != 'none')) {
      container.style.display = 'none';
    }
  },

  init: function() {
    var elements = Bubble.getElementsByTagAndClassName(Bubble.linkClassName);
    for (var x=0,y=elements.length; x < y; x++) {
      Bubble.attachEventListener(elements[x], 'mouseover', Bubble.displayBubble);
      Bubble.attachEventListener(elements[x], 'mouseout', Bubble.hideBubble);
      Bubble.injectBubbles(elements[x]);
    }
    elements = document.getElementsByTagName('input');
    for (var x=0,y=elements.length; x < y; x++) {
      if (elements[x].getAttribute('bindto')) {
        Bubble.attachEventListener(elements[x], 'focus', Bubble.fieldHandler);
        Bubble.attachEventListener(elements[x], 'blur', Bubble.fieldHandler);
      }
    }
    elements = document.getElementsByTagName('textarea');
    for (var x=0,y=elements.length; x < y; x++) {
      if (elements[x].getAttribute('bindto')) {
        Bubble.attachEventListener(elements[x], 'focus', Bubble.fieldHandler);
        Bubble.attachEventListener(elements[x], 'blur', Bubble.fieldHandler);
      }
    }
    elements = document.getElementsByTagName('select');
    for (var x=0,y=elements.length; x < y; x++) {
      if (elements[x].getAttribute('bindto')) {
        Bubble.attachEventListener(elements[x], 'focus', Bubble.fieldHandler);
        Bubble.attachEventListener(elements[x], 'blur', Bubble.fieldHandler);
      }
    }
  },

  injectBubbles: function(arg) {
    if (!arg) { return false; }
    var id   = Bubble.get(arg).id;
    var elem = Bubble.get(id + '-bubble');
    if (elem) { return false; } // only add box once
    var content = Bubble.get(id + '-content');
    if (!content) { return false; }

    var node = content.cloneNode(true);
    content.parentNode.removeChild(content);
    node.className = 'bubble-inner-content';

    var box = document.createElement('div');
    box.id = id + '-bubble';
    box.style.display  = 'none';
    box.style.position = 'absolute';

    var innerWrap = document.createElement('div');
    innerWrap.className = 'bubble-top';
    box.appendChild(innerWrap);

    var contentBox = document.createElement('div');
    contentBox.className = 'content-box';
    contentBox.style.position = 'relative';
    contentBox.appendChild(node);
    innerWrap.appendChild(contentBox);

    var bubblePointer = document.createElement('div');
    bubblePointer.className = 'bubble-pointer';
    bubblePointer.id = id + '-pointer';
    bubblePointer.style.position = 'absolute';
    innerWrap.appendChild(bubblePointer);

    var bubbleBottom = document.createElement('div');
    bubbleBottom.className = 'bubble-bottom';
    bubbleBottom.style.clear = 'both';
    box.appendChild(bubbleBottom);

    var ua = Bubble.getUA();
    if (ua[0] == 'msie' && ua[1] < '7') {
      var ieIframe = document.createElement('iframe');
      ieIframe.src = 'empty.html';
      ieIframe.className = 'shim';
      box.appendChild(ieIframe);
    }
    document.getElementsByTagName('body')[0].appendChild(box);
  },

  fieldHandler: function(obj) {
    if (!obj) { return false; }
    switch (obj.type) {
      case 'focus':
        Bubble.fieldFocus(Bubble.getEventTarget(obj));
        break;
      case 'blur':
        Bubble.fieldLoseFocus(Bubble.getEventTarget(obj));
        break;
      default :
        return false;
    }
  },

  fieldFocus: function(field) {
    if (field.getAttribute('bindTo')) { 
      var image = Bubble.get(field.getAttribute('bindTo'));
      if (image) {
        Bubble.show(image);
        if (typeof image.detachEvent == 'undefined') {
          image['onmouseover'] = null;
          image['onmouseout']  = null;
        } else {
          image.detachEvent('onmouseover', Bubble.displayBubble);
          image.detachEvent('onmouseout', Bubble.hideBubble);
        }
      }
    }
  },

  fieldLoseFocus: function(field) {   
    if (field.getAttribute('bindTo')) { 
      var image = Bubble.get(field.getAttribute('bindTo'));
      Bubble.hide(image);
      Bubble.attachEventListener(image, 'mouseover', Bubble.displayBubble);
      Bubble.attachEventListener(image, 'mouseout', Bubble.hideBubble);
    }
  }

}; // Bubble

Event.add(window, 'load', function(){Bubble.init();});


/* --------------------------------------------------------
   Pagination
-------------------------------------------------------- */

var Pagination = {

  firstOver: function(that) {
    that.parentNode.style.backgroundPosition = 'bottom right';
  },

  firstOut: function(that) {
    that.parentNode.style.backgroundPosition = 'top left';
  },

  prevOver: function(that) {
    that.parentNode.style.backgroundPosition = 'bottom left';
  },

  prevOut: function(that) {
    that.parentNode.style.backgroundPosition = 'top left';
  },

  nextOver: function(that) {
    that.parentNode.style.backgroundPosition = 'bottom right';
  },

  nextOut: function(that) {
    that.parentNode.style.backgroundPosition = 'top left';
  },

  lastOver: function(that) {
    that.parentNode.style.backgroundPosition = 'bottom left';
  },

  lastOut: function(that) {
    that.parentNode.style.backgroundPosition = 'top left';
  }

}; // Pagination


/* --------------------------------------------------------
   SpinnerOverlay
-------------------------------------------------------- */

var SpinnerOverlay = Class.extend({

  initialize: function(options) {
    this.options = $.extend({
      base: null,
      fadeSpeed: 'normal',
      blockMode: 'full', // full or base
      imageDir: '/resources/img/icons',
      background: {css:'white', opacity:0.75},
      baseImg: {file:'so_base.png', width:130, height:98},
      spinnerImg: {file:'so_spinner.gif', width:32, height:32}
    }, options);
    this.count = 0;
    var date = new Date();
    this.containerId = '_spinner_overlay_' + date.getTime();
    this.baseImg     = this.preloadImage(this.options.baseImg);
    this.spinnerImg  = this.preloadImage(this.options.spinnerImg);
  },

  preloadImage: function(attr) {
    var obj = new Image();
    obj.src = this.options.imageDir +'/'+ attr.file
    var img = $(obj);
    if (attr.width == 'auto' || attr.width == undefined) {
      attr.width = img.get(0).width;
    }
    if (attr.height == 'auto' || attr.height == undefined) {
      attr.height = img.get(0).height;
    }
    return img;
  },

  containerExists: function() {
    if ($('body > div#' + this.containerId).length == 0) {
      return false;
    }
    return true;
  },

  show: function() {
    this.count++;
    if ( this.containerExists() ) { return; }

    var container = $('<div></div>');
    container.attr('id', this.containerId);
    container.css({
      position: 'absolute',
      'z-index': 1000,
      top: 0,
      left: 0,
      overflow: 'hidden',
      width: $(document).width(),
      height: $(document).height()
    });

    if (this.options.blockMode == 'base') {
      // full: start at baseObj.top and cover whole screen
      // base: only block a specific object
      var elem = $('#'+this.options.base);
      var pos  = elem.offset();
      container.css({
        top: pos.top,
        left: pos.left,
        width: elem.width(),
        height: elem.height()
      }) ;
    } else {
      window.scrollTo(0,0);
    }
    container.hide();

    var background = $('<div></div>');
    background.css({
      position: 'absolute',
      width: $(document).width(),
      height: $(document).height(),
      background: this.options.background.css,
      opacity: this.options.background.opacity
    });
    container.append(background);

    var base = $('<div></div>');
    base.css({
      position: 'relative',
      background: 'url("' + this.baseImg.attr('src') + '") no-repeat',
      width: this.options.baseImg.width,
      height: this.options.baseImg.height
    });

    var spinner = this.spinnerImg;
    spinner.css({
      background: 'transparent',
      position: 'relative',
      left: this.options.baseImg.width / 2 - this.options.spinnerImg.width / 2,
      top: this.options.baseImg.height / 2 - this.options.spinnerImg.height / 2 - 2
    });
    spinner.mousedown(function(){return false;});

    base.append(spinner);
    container.append(base);
    $('body').append(container);

    // position the base
    if (this.options.blockMode == 'base') {
      base.css('left', container.width() / 2 - this.options.baseImg.width / 2 );
      base.css('top', container.height() / 2 - this.options.baseImg.height / 2 );
    } else {
      base.css('left', $(window).width() / 2 - this.options.baseImg.width / 2 );
      base.css('top', $(window).height() / 2 - this.options.baseImg.height / 2 );
    }

    container.mousedown(function(){return false;});
    container.fadeIn(this.options.fadeSpeed);
  },

  hide: function() {
    if ( !this.containerExists() ) { return; }
    this.count = Math.max(0, this.count - 1);
    if (this.count > 0) { return; }
    $('body > div#' + this.containerId).fadeOut(this.options.fadeSpeed, function(){
      $(this).remove();
    });
  }

});


/* --------------------------------------------------------
   modalBox
-------------------------------------------------------- */

Hover.namespace('modalBox');
Hover.modalBox = {
  selectControls: [],

  show: function(options) {
    var layer      = $('<div></div>').attr('id','pop_layer');
    var container  = $('<div></div>').attr('id','pop_content');
    var topSection = $('<div></div>').addClass('top_section');
    var midSection = $('<div></div>').addClass('mid_section');
    var botSection = $('<div></div>').addClass('bottom_section');

    if (options.close) {
      var closeElem  = $('<div></div>').addClass('close_pop');
      var closeLink  = $('<a href="#"></a>').attr('id','close_pop_link');
      var closeImage = $('<img alt="close" />');
      closeImage.attr('src', '/resources/img/buttons/btn_x_white_off.gif');
      closeLink.click(function(){ Hover.modalBox.hide(); });
      closeLink.html('close ');
      closeLink.append(closeImage);
      closeElem.append(closeLink);
      midSection.append(closeElem);
    }

    if (options.header) {
      var headerDiv = $('<div></div>').addClass('pop_header');
      var headerH1  = $('<h1></h1>').html(options.header);
      headerDiv.append(headerH1);
      midSection.append(headerDiv);
    }

    var contentDiv = $('<div></div>').attr('id','cc_popup_layer_content');
    contentDiv.html(options.content);
    midSection.append(contentDiv);

    if (options.buttons) {
      var buttonDiv = $('<div></div>').addClass('buttons').html(options.buttons);
      midSection.append(buttonDiv);
    }

    topSection.html('&nbsp;');
    botSection.html('&nbsp;');
    container.append(topSection).append(midSection).append(botSection);
    layer.append(container);

    var intContentWidth   = 1000;
    var intScrollWidth    = $(document).width();
    var intScrollHeight   = $(document).height();
    var intWindowWidth    = $(window).width();
    var intWindowHeight   = $(window).height();
    var intContentTopPos  = $(window).scrollTop() + 235;
    var intContentLeftPos = (intWindowWidth / 2) - (intContentWidth / 2);

    container.css({
      'margin-top': intContentTopPos,
      'left': intContentLeftPos
    });
    layer.css({
      'display': 'block',
      'width': intScrollWidth,
      'height': intScrollHeight
    });
    Hover.modalBox.toggleSelects();
    document.getElementsByTagName('body')[0].appendChild(layer[0]);
  },

  hide: function() {
    Hover.modalBox.toggleSelects();
    $('#pop_layer').remove();
  },

  toggleSelects: function() {
    if ($.browser.msie && ($.browser.version > 5) && ($.browser.version < 7)) {
      if (Hover.modalBox.selectControls.length > 0) {
        $.each(Hover.modalBox.selectControls, function(idx, val){
          $(val).css('visibility','visible');
        });
        Hover.modalBox.selectControls = [];
      } else {
        Hover.modalBox.selectControls = $('select');
        if (0 == Hover.modalBox.selectControls.length) { return; }
        $.each(Hover.modalBox.selectControls, function(idx, val){
          $(val).css('visibility','hidden');
        });
      }
    }
  }

}; // Hover.modalBox

$(function(){
  $('#link-menu-help').click(function(){
    var header  = 'Need help?';
    var content = '<p>Enable access to our Customer Service Center by ' +
                  'verifying your new email address. If you never received a ' +
                  'verification email, request a new one by clicking ' +
                  '<strong>Submit</strong>.</p>';
    var buttons = '<a href="/register/sendverify" ' +
                  'onclick="Hover.modalBox.hide();">' +
                  '<img src="/resources/img/buttons/btn_submit_off.png" ' +
                  'alt="Continue" /></a>';
    Hover.modalBox.show({header:header, content:content, buttons:buttons});
  });
});

/* --------------------------------------------------------
   Environment
-------------------------------------------------------- */

var Env = {
  windowSize: function() {
    var d = document.documentElement;
    var w = (window.innerWidth    || 
             self.innerWidth      || 
             (d && d.clientWidth) || 
             document.body.clientWidth);
    var h = (window.innerHeight    ||
             self.innerHeight      ||
             (d && d.clientHeight) ||
             document.body.clientHeight);
    return {width:w,height:h};
  },

  scrollPos: function() {
    if (self.pageYOffset !== undefined) {
      return {x:self.pageXOffset, y:self.pageYOffset};
    }
    var d = document.documentElement;
    return {x:d.scrollLeft, y:d.scrollTop};
  }
}; // Env

/* --------------------------------------------------------
   jquery plugins
-------------------------------------------------------- */

jQuery.fn.formToDict = function() {
  var h={}, ary = this.serializeArray();
  for (var i=0; i < ary.length; i++) {
    h[ary[i].name] = ary[i].value;
  }
  return h;
};

jQuery.fn.disable = function() {
  this.attr('disabled','disabled');
  return this;
};

jQuery.fn.enable = function(arg) {
  if (arguments.length && !arg){
    this.attr('disabled','disabled');
  } else {
    this.removeAttr('disabled');
  }
  return this;
};

jQuery.fn.makeExpandable = function(maxLen, callback, height) {
  var newHeight = height || '5em';
  this.keypress(function(e){
    if (e.keyCode == 13 && callback) {
      callback(this);
      return false;
    }
    if ((this.value.length >= maxLen) && (e.charCode > 8) && (e.charCode < 63200)) { 
      return false;
    }
    if (this.style.height != newHeight) {
      var that = this;
      setTimeout(function(){
        if ((that.value.indexOf('\n') != -1) || 
            (that.scrollTop > 0)             || 
            (that.scrollLeft > 0)            || 
            (that.scrollHeight > that.offsetHeight)) 
        {
          that.style.height = newHeight;
          if (window.updateFrameSize) {
            window.updateFrameSize()
          }
        }
      },10);
    }
  });
  return this;
};

jQuery.fn.hint = function() {
  return this.each(function(){
    var that = $(this);
    var text = that.attr('title');
    if (!text) {
      return;
    }
    that.blur(function(){
      if (!that.val() || that.val() == text) {
        that.addClass('blur');
        that.val(text);
      }
    });
    that.focus(function(){
      if (that.val() == text) {
        that.val('');
      }
      that.removeClass('blur');
    });
    that.parents('form:first()').submit(function(){
      if (that.val() == text) {
        that.val('');
        that.removeClass('blur');
      }
    });
    that.blur();
  });
};

jQuery.fn.center = function(widthBuf, heightBuf, flush){
  var win = Env.windowSize();
  var scrollPos = flush ? {x:0, y:0} : Env.scrollPos();
  for (var i=0; i < this.length; i++){
    var wOffset = Math.max(0, win.width-this[i].offsetWidth);
    var hOffset = Math.max(0, win.height-this[i].offsetHeight);
    $(this[i]).css({
      top: scrollPos.y + hOffset*(heightBuf !== undefined ? heightBuf : 0.5),
      left:scrollPos.x + wOffset*(widthBuf !== undefined ? widthBuf : 0.5)
    });
  }
  return this;
};
