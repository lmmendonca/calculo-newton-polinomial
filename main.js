function interpolate(x, f) {
	var amap = function (v) { return parseFloat(v) },
		x = x.map(amap),
		f = f.map(amap),
		n = Math.min(x.length, f.length),
		a = [];
	for (var i = 0; i < n; i++) {
		a[i] = f[0];
		for (var j = 1; j < n - i; j++)
			f[j - 1] = parseFloat(((f[j] - f[j - 1]) / (x[j + i] - x[j - 1])).toFixed(7));
	}
	var pstr = a[0],
		multi = [new Poly(a[0])];
	for (var i = 1; i < a.length; i++) {
		pstr += " + " + a[i];
		var pairs = [a[i]];
		for (var j = 0; j < i; j++) {
			pstr += "(x - " + x[j] + ")";
			pairs.push([-x[j], 1]);
		}
		multi.push(Poly.multiply.apply(undefined, pairs));
	}

	var multiStr = [];
	for (var i = multi.length - 1; i >= 0; i--) {
		for (var j = multi[i].length - 1; j >= 0; j--) {
			if (!multiStr[j]) {
				multiStr[j * 2] = 0;
				multiStr[j * 2 + 1] = ((j != 0 ? " x" : "") + (j != 1 && j != 0 ? "<sup>" + j + "</sup>" : "")) + " +";
			}
			multiStr[j * 2] += multi[i].coeff[j];
		};
	};
	for (var i = multiStr.length - 2; i >= 0; i -= 2) {
		multiStr[i] = parseFloat(multiStr[i].toFixed(7));
		if (multiStr[i + 2] < 0 || !multiStr[i + 2]) multiStr[i + 1] = multiStr[i + 1].replace(/\+\s?$/, '');
	};
	var result = document.querySelector('#result');
	result.innerHTML = '<div>' + pstr + '</div><br /> <div> P(x) = ' + multiStr.join('').replace(/([\-\+])/g, ' $1 ') + '</div>';
}
/*!
 * polynomial class with multiplication 
 */
function Poly(coeff) {
	this.coeff = !(coeff instanceof Array) ? Array.prototype.slice.call(arguments) : coeff;
	this.length = this.coeff.length;
	this.multiply = function (poly) {
		if (!poly) return this;
		var totalLength = this.coeff.length + poly.coeff.length - 1,
			result = new Array(totalLength);
		for (var i = 0; i < result.length; i++) result[i] = 0;
		for (var i = 0; i < this.coeff.length; i++) {
			for (var j = 0; j < poly.coeff.length; j++) {
				result[i + j] += this.coeff[i] * poly.coeff[j];
			}
		}
		return new Poly(result);
	}
}
Poly.multiply = function () {
	var args = Array.prototype.slice.call(arguments),
		result = undefined;
	for (var i = 0; i < args.length; i++) {
		if (!(args[i] instanceof Poly)) args[i] = new Poly(args[i]);
		result = args[i].multiply(result);
	};
	return result;
}