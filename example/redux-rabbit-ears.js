var ReduxRabbitEars=function(n){"use strict";var e="@@redux-rabbit-ears/CHANNEL",t=(n=n&&n.hasOwnProperty("default")?n.default:n).browser||n.chrome,r=Object.assign||function(n){for(var e=1;arguments.length>e;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},o="@@redux-rabbit-ears/BROADCAST";return{CHANNEL:e,createExtensionMiddleware:function(n,i){return t&&t.runtime?"string"!=typeof n?(console.error("Expected extensionId"),function(){return function(n){return function(e){return n(e)}}}):function(c){var a=t.runtime.connect(n,{name:e}),s=!0;return a.onMessage.addListener(function(n){console.log(n),n.meta&&n.meta.type===o&&c.dispatch(n)}),a.onDisconnect.addListener(function(){s=!1,console.warn("redux-rabbit-ears has disconnected from chrome-extension://"+n)}),i&&i(a),function(n){return function(e){return s&&!(e.meta&&e.meta.type===o)&&a.postMessage(r({},e,{meta:{type:o}})),n(e)}}}:(console.error("Expected {browser, chrome}.runtime to exist"),function(){return function(n){return function(e){return n(e)}}})},createExtensionBackgroundProxy:function(){var n=[];t.runtime.onConnect.addListener(function(t){t.name===e&&(n.push(t),t.onDisconnect.addListener(function(){var e=n.indexOf(t);n.splice(e,1)}),t.onMessage.addListener(function(e){n.forEach(function(n){n!==t&&n.postMessage(e)})}))})}}}(window);
