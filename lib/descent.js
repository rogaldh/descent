var descent = {
    isDefined: function (v) {
        return typeof v !== 'undefined';
    },
    isObject: function (o) {
        return( !! o) && (o.constructor == Object);
    },
    applyIf: function (D, A, overwrite) {
        var overwrite = overwrite || false;
        if(descent.isObject(A)) {

            for(var i in A) {
                var hasProperty = D.hasOwnProperty(i);

                if(overwrite && hasProperty && descent.isObject(A[i])) {
                    descent.apply(D[i], A[i], overwrite);
                } else if(overwrite || !hasProperty) {
                    D[i] = A[i];
                }
            }

        }
        return D;
    },
    apply: function (D, A) {
        return descent.applyIf(D, A, true);
    },
    __extend: function (A, options, O) {
        O = O || {};
        D = Object.create(A, O);

        options = options || {};
        if(Object.keys(options).length) {
            D.options = descent.apply(options, A.options);
        }
        
        D._super = A;
        
        return D;
    },
    _extend: function (D, A) {
        var _proto = function () {};
        _proto.prototype = A.prototype;
        D.prototype = new _proto();
        D.prototype.constructor = D;

        D.superclass = A.prototype;
    },
    extend: function (D, A, O) {
        descent._extend(D, A);
        if(descent.isDefined(O)) descent.mixin(D.prototype, O);
    },
    // deprecated
    mixin: function (dst, src) {
        var tobj = {};
        for(var x in src) {
            if((typeof tobj[x] == "undefined") || (tobj[x] != src[x])) {
                dst[x] = src[x];
            }
        }
        // toString method doesn't exist at for..in in IE
        if(document.all && !document.isOpera) {
            var p = src.toString;
            if(typeof p == "function" && p != dst.toString && p != tobj.toString &&
                p != "\nfunction toString() {\n    [native code]\n}\n") {
                dst.toString = src.toString;
            }
        }
    },

};
    
if (typeof define === 'function' && define['amd']) {
    define(function() { return descent; });
} else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = descent;
} else if (typeof this !== 'undefined') {
    this['descent'] = descent;
}