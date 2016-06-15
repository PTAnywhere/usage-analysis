angular.module('dashboardApp')
  .filter('simpleUuid', [function() {
    function hex2a(hexx) {
        var hex = hexx.toString(); // force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    return function(uuid) {
        var hex = uuid.replace(/-/g, ''); // remove dashes
        var base64url = btoa( hex2a(hex) );
        // Y64 variant
        return base64url.replace(/\+/g, '.')
                        .replace(/\//g, '_')
                        .replace(/=/g, '-');
    };
  }])
  .filter('momentDate', [function() {
    return function(moment, format) {
        return moment.format(format);
    };
  }]);