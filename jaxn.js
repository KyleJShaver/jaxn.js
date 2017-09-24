var jaxn = jaxn || function(selector) {
	return document.querySelectorAll(selector);
};

jaxn.extend = jaxn.extend || function(obj, args) {
	for (i in args) {
		obj[i] = args[i];
	}
	return obj;
}

jaxn.extend(jaxn, {
	'cache': {},
	'clearCache': function() {
		this.cache = {};
	},
	'httpHeaders': {},
	'clearHttpHeaders': function() {
		this.httpHeaders = {};
	},
	'xhr': function (method, url) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		for (i in this.httpHeaders) {
			xhr.setRequestHeader(i, this.httpHeaders[i]);
		}
		return xhr;
	},
	'httpRequest': function(method, url, postParams, callback, error) {
		error = error || function(message) {
			console.log(message);
		}
		postParams = postParams || {};
		var postString = '';
		if (typeof postParams === 'string') {
			postString = postParams;
		} else {
			postString = this.toUrlParam(postParams);
		}
		if (method.toUpperCase() === 'GET' && postString.length > 0) {
			url += (url.search(/\?/) >= 0 ? "&" : "?") + postString; 
		}
		var xhr = this.xhr(method, url);
		xhr.onload = function() {
			if (xhr.status === 200) {
				callback(xhr.responseText);
			} else {
				error('HTTP status code ' + xhr.status + ' returned');
			}
		};
		xhr.send(postString);
	},
	'get': function(url, urlParams, callback, error) {
		if (typeof urlParams === 'function') {
			error = callback;
			callback = urlParams;
			urlParams = null;
		}
		this.httpRequest('GET', url, urlParams, callback, error);
	},
	'post': function(url, postParams, callback, error) {
		this.httpRequest('POST', url, postParams, callback, error);
	},
	'urlParam': function (parameter) {
		if (this.cache['urlParam'] === undefined) {
			this.cache['urlParam'] = (new URL(document.location)).searchParams;
		}
		return this.cache['urlParam'].get(parameter);
	},
	'toUrlParam': function(obj, encode) {
		encode = encode !== false ? true : false;
		var urlParamString = "";
		for (i in obj) {
			if (urlParamString !== "") {
				urlParamString += "&"
			}
			urlParamString += encode ? encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]) : i + "=" + obj[i];
		}
		return urlParamString;
	},
	get $() {return "version 0.0.1 - Kyle Shaver"}
});