(function (exports) {
'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var inDOM = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
module.exports = exports['default'];
});

var requestAnimationFrame = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inDOM = inDOM;

var _inDOM2 = _interopRequireDefault(_inDOM);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var vendors = ['', 'webkit', 'moz', 'o', 'ms'];
var cancel = 'clearTimeout';
var raf = fallback;
var compatRaf = void 0;

var getKey = function getKey(vendor, k) {
  return vendor + (!vendor ? k : k[0].toUpperCase() + k.substr(1)) + 'AnimationFrame';
};

if (_inDOM2.default) {
  vendors.some(function (vendor) {
    var rafKey = getKey(vendor, 'request');

    if (rafKey in window) {
      cancel = getKey(vendor, 'cancel');
      return raf = function raf(cb) {
        return window[rafKey](cb);
      };
    }
  });
}

/* https://github.com/component/raf */
var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime(),
      ms = Math.max(0, 16 - (curr - prev)),
      req = setTimeout(fn, ms);

  prev = curr;
  return req;
}

compatRaf = function compatRaf(cb) {
  return raf(cb);
};
compatRaf.cancel = function (id) {
  window[cancel] && typeof window[cancel] === 'function' && window[cancel](id);
};
exports.default = compatRaf;
module.exports = exports['default'];
});

var animationFrame = unwrapExports(requestAnimationFrame);

var regex = new RegExp('[0-9]+');

var animalGroup = function animalGroup(animals) {
  return Promise.all(animals);
};

var nextFrame = function nextFrame() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve) {
    animationFrame(resolve.apply(undefined, args));
  });
};

var delay = function delay() {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      nextFrame().then(function () {
        return resolve.apply(undefined, [ms].concat(args));
      });
    }, ms);
  });
};

var animal = function animal(target, props, duration, easing) {
  return new Promise(function (resolve, reject) {
    var keys = Object.keys(props);
    var propertyName = keys[0];
    console.log(propertyName);
    var attributeIndex = keys.indexOf('attribute');
    var isAttribute = attributeIndex > -1 ? keys[attributeIndex] : false;
    var initialValue = props.from || (isAttribute ? parseFloat(regex.exec(target.getAttribute(propertyName))[0], 10) : parseFloat(target[propertyName], 10) || 0);
    console.log('initialValue', initialValue, target[propertyName]);
    var round = !!props.round;
    var onUpdate = props.onUpdate || function () {};
    var finalValue = props[propertyName];

    var prefix = null;
    var suffix = null;

    if (typeof finalValue === 'string') {
      var parsedValue = parseFloat(finalValue, 10);
      if (isNaN(parsedValue)) {
        parsedValue = regex.exec(finalValue)[0];
      }
      var splitted = finalValue.split('' + parsedValue);
      suffix = splitted.length > 1 ? splitted[1] : splitted[0];
      prefix = splitted.length > 1 ? splitted[0] : null;
      finalValue = parsedValue;
    }
    var endTime = Date.now() + duration;
    var valueDelta = finalValue - initialValue;

    var render = function render() {
      var progress = Math.min((duration - (endTime - Date.now())) / duration, 1);
      var easingProgress = easing ? easing(progress) : progress;

      var nextValue = initialValue + valueDelta * easingProgress;
      if (round) {
        nextValue = Math.round(nextValue);
      }
      if (suffix) {
        nextValue = '' + nextValue + suffix;
      }
      if (prefix) {
        nextValue = '' + prefix + nextValue;
      }

      onUpdate(nextValue);

      if (isAttribute) {
        target.setAttribute(propertyName, nextValue);
      } else {
        target[propertyName] = nextValue;
      }

      if (progress < 1) {
        animationFrame(render);
      } else {
        resolve();
      }
    };
    animationFrame(render);
  });
};

exports.animalGroup = animalGroup;
exports.nextFrame = nextFrame;
exports.delay = delay;
exports['default'] = animal;

}((this.animal = this.animal || {})));
