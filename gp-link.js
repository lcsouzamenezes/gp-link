/*
  Get Param Link Change - jQuery Plugin (https://github.com/ucoder92/gp-link)
  Copyright (c) 2019 Ulugbek Nuriddinov (ucoder92@gmail.com)
  Licensed under the MIT license 
  Version: 1.0.1
*/
(function ($) {
  var current_url = location.protocol + '//' + location.host + location.pathname;

  $.fn.gplink = function (configs) {
    this.click(function(e) {
      e.preventDefault();
      var type = ''; 
      var link = '';
      var config = {};
      var href = $(this).attr('href');
      var thisParam = $(this).attr('data-gplink-param');
      var param = '';
      var thisValue = $(this).attr('data-gplink-value');
      var value = '';
      var thisFull = $(this).attr('data-gplink-full');
      var full = '';
      
      if(typeof configs === 'object') {
        config = configs;
      }

      if(config.type != undefined && config.type) {
        type = config.type;
      }

      if(href != undefined && href != '' && gplinkCheckURL(href)) {
        link = href;
      } else if(config.href != undefined && config.href != '' && gplinkCheckURL(config.href)) {
        link = config.href;
      } else if(config.default != undefined && config.default != '' && gplinkCheckURL(config.default)) {
        link = config.default;
      }
      
      if(thisParam != undefined && thisParam != '') {
        param = thisParam;
      }

      if(thisValue != undefined && thisValue != '') {
        value = thisValue;
      }

      if(thisFull != undefined && thisFull != '') {
        full = thisFull;

        if(!type && (!thisValue || !thisValue)) {
          type = 'full';
        }
      }

      if(link && type == 'full') {
        window.history.pushState({path:link}, '', link);
      } else if(param && value) {
        if(full == 'current') {
          var setURL = current_url + '?' + param + '=' + value;
          window.history.pushState({path:setURL}, '', setURL);
        } else if(gplinkCheckURL(full)) {
          var setURL = full + '?' + param + '=' + value;
          window.history.pushState({path:setURL}, '', setURL);
        } else {
          var location_href = window.location.href;
          var checkQuery = gplinkCheckGetQuery(param);
          
          if (checkQuery === false) {
            if (location.search) {
              var url = location_href + '&' + param + '=' + value;
              window.history.pushState({path:url}, '', url);
            } else {
              var url = location_href + '?' + param + '=' + value;
              window.history.pushState({path:url}, '', url);
            }
          } else {
            var newUrl = location.href.replace(param + "=" + checkQuery, param + "=" + value);
            window.history.pushState({path:newUrl}, '', newUrl);
          }
        }
      }
      
    });
  };

  var $find = $('[data-gplink-param], [data-gplink-full]');
  
  if($find != undefined && $find.length > 0) {
    $find.gplink();
  }

  function gplinkCheckURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
      '((\\d{1,3}\\.){3}\\d{1,3}))'+
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
      '(\\?[;&a-z\\d%_.~+=-]*)?'+
      '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(str);
  }

  function gplinkCheckGetQuery(name) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
  
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
  
      if (pair[0] == name) {
        return pair[1];
      } else if (pair[1] == "") {
        return true;
      }
    }
  
    return (false);
  }
}(jQuery));