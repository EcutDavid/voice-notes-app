!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);n(1);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(n,!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i=document.querySelector("#loginBtn"),a=document.querySelector("#logoutBtn"),u=document.querySelector("#noteForm"),l=document.querySelector("#submitTextBtn"),s=document.querySelector("#submitTextSpinner"),d=document.querySelector(".cover-heading h2"),p=document.querySelector("#homeTabTextPrompt"),y=document.querySelector("#titleInput"),f=document.querySelector("#contentInput"),m=document.querySelector("#notes"),b=document.querySelector("#notesSpinner"),h=document.querySelector("audio"),v="https://davidguan.app",g="https://voice-notes-app.s3-ap-southeast-2.amazonaws.com",S=["homeTab","noteSubmitTab"],O=document.querySelector("#homeTabContent"),k=document.querySelector("#homeTabLink");function j(e){var t=e.acc,n={};return t&&(n.Authorization="Bearer ".concat(t)),n}function T(e){e.isAuthenticated().then((function(t){i.disabled=t,a.disabled=!t,t&&(O.style.display="block",e.getTokenSilently().then((function(e){!function(e){u.style.display="block",l.addEventListener("click",(function(t){t.preventDefault();var n=y.value,o=f.value,c=JSON.stringify({title:n,content:o});s.style.display="inline-block",l.style.display="none",fetch("".concat(v,"/voice-notes"),{method:"POST",headers:r({},j({acc:e}),{"Content-Type":"application/json"}),body:c}).then((function(){l.style.display="inline-block",y.value="",f.value="",s.style.display="none"}))})),fetch("".concat(v,"/voice-notes"),{headers:r({},j({acc:e}))}).then((function(e){return 200!=e.status&&(b.style.display="none",p.innerText="Sorry, this app is in the early test stage, only a small list of accounts are allowed to interacting with the APIs, please ask davidguandev@gmail.com to add your account, if you are interested to give it a go, thanks!"),e.json()})).then((function(e){Array.isArray(e)&&(b.style.display="none",0!=e.length?(h.style.display="block",e.forEach((function(e){var t=document.createElement("button");t.innerText=e.name,t.className="btn btn-outline-primary note";var n="".concat(g,"/").concat(e.key);t.addEventListener("click",(function(){h.src=n,h.play()})),m.append(t)}))):p.innerText='Thanks for using this app, please click "submit new note" to create your first note :)')}))}(e)})),e.getUser().then((function(e){e.nickname&&(d.innerText="Hello, ".concat(e.nickname))})))}))}!function(){for(var e=function(){var e=n[t],o=document.querySelector("#".concat(e,"Link")),r=document.querySelector("#".concat(e,"Content"));o.addEventListener("click",(function(){O.style.display="none",(O=r).style.display="block",k.classList.remove("active"),(k=o).classList.add("active")}))},t=0,n=S;t<n.length;t++)e()}(),createAuth0Client({domain:"davidguan.auth0.com",client_id:"luC7PVwEEmjBTCC3HUenRepY5U3Zgrru",audience:"https://davidguan.app/voice-notes-app/api"}).then((function(e){T(e);var t=location.origin+location.pathname;i.addEventListener("click",(function(){e.loginWithRedirect({redirect_uri:t})})),a.addEventListener("click",(function(){e.logout({returnTo:t})}));var n=location.search;n.includes("code=")&&n.includes("state=")&&e.handleRedirectCallback().then((function(){history.replaceState({},document.title,t),T(e)}))}))},function(e,t,n){}]);