"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=(()=>{function a(b,c){for(var i=0,d;i<c.length;i++){d=c[i];d.enumerable=d.enumerable||!1;d.configurable=!0;if("value"in d)d.writable=!0;Object.defineProperty(b,d.key,d)}}return(b,c,d)=>{if(c)a(b.prototype,c);if(d)a(b,d);return b}})(),_jsonProcessor=require("./json-processor"),_jsonProcessor2=_interopRequireDefault(_jsonProcessor),_invertedIndex=require("../inverted-index"),_invertedIndex2=_interopRequireDefault(_invertedIndex);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b)){throw new TypeError("Cannot call a class as a function")}}var invertedIndex=new _invertedIndex2.default,index=void 0,Controller=function(){function a(){_classCallCheck(this,a)}_createClass(a,null,[{key:"createIndex",value:(b,c)=>{try{var d=b.headers["content-type"].indexOf("application/json"),e=b.headers["content-type"].indexOf("multipart/form-data");if(d>-1){var f=b.body;index=_jsonProcessor2.default.processRaw(f,invertedIndex);return c.send(index)}else if(e>-1){var g=b.files;index=_jsonProcessor2.default.processFiles(g,invertedIndex);return c.send(index)}}catch(error){return c.send("invalid json file")}}},{key:"searchIndex",value:(b,c)=>{try{var d=b.body,e={};if(!index){return c.send("Please create an index. See documentation")}if(Array.isArray(d)){e=invertedIndex.searchIndex(index,void 0,d);return c.send(e)}var f=Object.keys(d);f.forEach(g=>{var h=d[g],j=invertedIndex.searchIndex(index,g,h);e[g]=j[g]});return c.send(e)}catch(error){return c.send("Invalid javascript object")}}}]);return a}();exports.default=Controller;