/*! For license information please see 3.88c061eb.chunk.js.LICENSE.txt */
(this.webpackJsonpUrbanMiner_Admin=this.webpackJsonpUrbanMiner_Admin||[]).push([[3],{215:function(t,e,r){"use strict";r.r(e);var n=r(2),o=r(8),a=r(0),i=r.n(a),c=r(33),l=r(9),u=r(7),s=r(16),h=r(55),f=r(18),p=r(22),v=Object(s.a)((function(t){return{container:{backgroundColor:"#FFFFFF",border:"1px solid ".concat(t.color.lightGrayishBlue2),borderRadius:4,cursor:"pointer",maxWidth:350,padding:"16px 32px 16px 32px","&:hover":{borderColor:t.color.lightBlue,"&:nth-child(n) > span":{color:t.color.lightBlue}}},title:Object(p.a)(Object(p.a)({},t.typography.cardTitle),{},{color:t.color.grayishBlue2,marginBottom:12,minWidth:102,textAlign:"center"}),value:{color:t.color.veryDarkGrayishBlue,fontWeight:"bold",fontSize:40,letterSpacing:"1px",lineHeight:"50px",textAlign:"center"}}}));var d=function(t){var e=t.className,r=void 0===e?"":e,n=t.title,o=t.value,a=Object(h.c)(),l=v({theme:a}),u=[l.container,r].join(" ");return i.a.createElement(c.Column,{flexGrow:1,className:u,horizontal:"center",vertical:"center"},i.a.createElement("span",{className:l.title},n),i.a.createElement("span",{className:l.value},o))};function m(){m=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,n=Object.defineProperty||function(t,e,r){t[e]=r.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(_){l=function(t,e,r){return t[e]=r}}function u(t,e,r,o){var a=e&&e.prototype instanceof f?e:f,i=Object.create(a.prototype),c=new S(o||[]);return n(i,"_invoke",{value:j(t,r,c)}),i}function s(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(_){return{type:"throw",arg:_}}}t.wrap=u;var h={};function f(){}function p(){}function v(){}var d={};l(d,a,(function(){return this}));var g=Object.getPrototypeOf,y=g&&g(g(N([])));y&&y!==e&&r.call(y,a)&&(d=y);var b=v.prototype=f.prototype=Object.create(d);function w(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){var o;n(this,"_invoke",{value:function(n,a){function i(){return new e((function(o,i){!function n(o,a,i,c){var l=s(t[o],t,a);if("throw"!==l.type){var u=l.arg,h=u.value;return h&&"object"==typeof h&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){n("next",t,i,c)}),(function(t){n("throw",t,i,c)})):e.resolve(h).then((function(t){u.value=t,i(u)}),(function(t){return n("throw",t,i,c)}))}c(l.arg)}(n,a,o,i)}))}return o=o?o.then(i,i):i()}})}function j(t,e,r){var n="suspendedStart";return function(o,a){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw a;return T()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var c=x(i,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var l=s(t,e,r);if("normal"===l.type){if(n=r.done?"completed":"suspendedYield",l.arg===h)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(n="completed",r.method="throw",r.arg=l.arg)}}}function x(t,e){var r=e.method,n=t.iterator[r];if(void 0===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=void 0,x(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),h;var o=s(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,h;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function S(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function N(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:T}}function T(){return{value:void 0,done:!0}}return p.prototype=v,n(b,"constructor",{value:v,configurable:!0}),n(v,"constructor",{value:p,configurable:!0}),p.displayName=l(v,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===p||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,l(t,c,"GeneratorFunction")),t.prototype=Object.create(b),t},t.awrap=function(t){return{__await:t}},w(O.prototype),l(O.prototype,i,(function(){return this})),t.AsyncIterator=O,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var i=new O(u(e,r,n,o),a);return t.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},w(b),l(b,c,"Generator"),l(b,a,(function(){return this})),l(b,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},t.values=N,S.prototype={constructor:S,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return i.type="throw",i.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),l=r.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,h):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:N(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},t}var g=Object(s.a)({cardsContainer:{marginRight:-30,marginTop:-30},cardRow:{marginTop:30,"@media (max-width: 768px)":{marginTop:0}},miniCardContainer:{flexGrow:1,marginRight:30,"@media (max-width: 768px)":{marginTop:30,maxWidth:"none"}},todayTrends:{marginTop:30},lastRow:{marginTop:30},unresolvedTickets:{marginRight:30,"@media (max-width: 1024px)":{marginRight:0}},tasks:{marginTop:0,"@media (max-width: 1024px)":{marginTop:30}}});var y=function(){var t=Object(a.useState)(""),e=Object(o.a)(t,2),r=e[0],s=e[1],p=Object(a.useState)(""),v=Object(o.a)(p,2),y=v[0],b=v[1],w=Object(a.useState)(""),O=Object(o.a)(w,2),j=O[0],x=O[1],E=Object(a.useState)(""),L=Object(o.a)(E,2),S=L[0],N=L[1],T=Object(a.useState)(""),_=Object(o.a)(T,2),k=_[0],C=_[1],I=Object(a.useState)(1),G=Object(o.a)(I,2),R=G[0],F=G[1],A=Object(a.useState)([]),U=Object(o.a)(A,2),B=U[0],P=(U[1],function(){var t=Object(n.a)(m().mark((function t(){var e,r,n,o,a,i;return m().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,localStorage.getItem("userID");case 3:e=t.sent,r=Object(u.c)(l.a,"/ADMIN/USERS/".concat(e)),Object(u.b)(r,(function(t){F(t.val().adminLevel)})),n=Object(u.c)(l.a,"/ADMIN/USERS/".concat(e,"/SUB_USERS")),Object(u.b)(n,(function(t){var e=t.val();t.forEach((function(t){t.val()&&B.push(t.val().ID)})),b(Object(f.a)(e).length)})),o=Object(u.c)(l.a,"/USERS"),Object(u.b)(o,(function(t){var e=t.val();s(Object(f.a)(e).length)})),a=Object(u.c)(l.a,"/INVOICE_LIST"),Object(u.b)(a,(function(t){var e=t.val();Object(f.a)(e).map((function(t){console.log("total invoices",t.userId)})),C(Object(f.a)(e).filter((function(t){return B.includes(t.userId)})).length),N(Object(f.a)(e).length)})),i=Object(u.c)(l.a,"/ADMIN/ITEM"),Object(u.b)(i,(function(t){var e=t.val();x(Object(f.a)(e).length)})),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(0),console.log(t.t0);case 19:case"end":return t.stop()}}),t,null,[[0,16]])})));return function(){return t.apply(this,arguments)}}());Object(a.useEffect)((function(){P()}),[]);var D=Object(h.c)(),M=g(D);return i.a.createElement(c.Column,null,i.a.createElement(c.Row,{className:M.cardsContainer,wrap:!0,flexGrow:1,horizontal:"space-between",breakpoints:{768:"column"}},i.a.createElement(c.Row,{className:M.cardRow,wrap:!0,flexGrow:1,horizontal:"space-between",breakpoints:{384:"column"}},i.a.createElement(d,{className:M.miniCardContainer,title:"AdminLevel",value:R}),i.a.createElement(d,{className:M.miniCardContainer,title:"Total User",value:1==R?r:y}),i.a.createElement(d,{className:M.miniCardContainer,title:"Total Items",value:j})),i.a.createElement(d,{className:M.miniCardContainer,title:"TotalInvoice",value:1==R?S:k})))};e.default=y}}]);
//# sourceMappingURL=3.88c061eb.chunk.js.map