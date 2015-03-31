function arrayMax(arr) {
  var max = arr[0];
  for (var i = 0; i < arr.length; i++) {
    max = Math.max(max, arr[i]);
  }
  return max;
}

/**
 * Mozilla's decimal adjustment of a number.
 *
 * @param   {String}    type    The type of adjustment.
 * @param   {Number}    value   The number.
 * @param   {Number}    exp     The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number}            The adjusted value.
 */
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
  Math.round10 = function (value, exp) {
    return decimalAdjust('round', value, exp);
  };
}
// Decimal floor
if (!Math.floor10) {
  Math.floor10 = function (value, exp) {
    return decimalAdjust('floor', value, exp);
  };
}
// Decimal ceil
if (!Math.ceil10) {
  Math.ceil10 = function (value, exp) {
    return decimalAdjust('ceil', value, exp);
  };
}

// A special purpose bound floor. This function returns a non-inclusive floor (0.1-->0, 0.5-->0, 0.9-->0, 1-->0,
// 1.1-->0), unless the number is the maximum, in which case it returns that maximum.
Math.specialBoundFloor10 = function (value, exp, maxVal) {
  var result = decimalAdjust('floor', value, exp);
  if (result == value && result != maxVal) {
    return value - Math.pow(10, exp);
  } else {
    return result;
  }
};
