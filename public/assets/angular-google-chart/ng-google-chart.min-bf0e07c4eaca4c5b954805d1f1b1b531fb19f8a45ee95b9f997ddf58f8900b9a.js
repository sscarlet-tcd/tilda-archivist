!function(){function a(a,b){angular.element(b).bind("resize",function(){a.$emit("resizeMsg")})}angular.module("googlechart",[]).run(a),a.$inject=["$rootScope","$window"]}(),function(){function a(){function a(a){function b(a,b){var c,d;for(d in a)if(a.hasOwnProperty(d))for(c=0;c<g.iFormats[d].length;c++)a[d][c].columnNum<b.getNumberOfColumns()&&g.iFormats[d][c].format(b,a[d][c].columnNum)}function c(a,b,c){var d;if(angular.isArray(c[a])&&!angular.equals(c[a],h[a]))if(h[a]=c[a],g.iFormats[a]=[],"color"===a)e(c);else for(d=0;d<c[a].length;d++)g.iFormats[a].push(new b(c[a][d]))}function d(a,d,e){var g,h,i=!1;if(!angular.isDefined(d)||!angular.isDefined(a))return{requiresHtml:!1};for(g in d)if(d.hasOwnProperty(g)){if(h=f(g,e),!angular.isFunction(h))continue;c(g,h,d),("arrow"===g||"bar"===g||"color"===g)&&(i=!0)}return b(d,a),{requiresHtml:i}}function e(b){var c,d,e,f,h="color";for(c=0;c<b[h].length;c++){for(d=new a.visualization.ColorFormat,e=0;e<b[h][c].formats.length;e++)f=b[h][c].formats[e],"undefined"!=typeof f.fromBgColor&&"undefined"!=typeof f.toBgColor?d.addGradientRange(f.from,f.to,f.color,f.fromBgColor,f.toBgColor):d.addRange(f.from,f.to,f.color,f.bgcolor);g.iFormats[h].push(d)}}function f(b,c){var d=b.charAt(0).toUpperCase()+b.slice(1).toLowerCase()+"Format";return a.visualization.hasOwnProperty(d)?google.visualization[d]:angular.isDefined(c)&&c.hasOwnProperty(b)?c[b]:void 0}var g=this,h={};g.iFormats={},g.applyFormats=d}return a}angular.module("googlechart").factory("FormatManager",a)}(),function(){function a(a,b,c,d,e,f,g,h){function i(){q()}function j(){j.triggered||void 0===s.chart?void 0!==s.chart&&(e.cancel(j.recallTimeout),j.recallTimeout=e(j,10)):(j.triggered=!0,e(n,0,!0))}function k(){r.getReadyPromise().then(j)}function l(){r.draw(),j.triggered=!1}function m(){r=new h,s.registerChartListener=r.registerChartListener,s.registerWrapperListener=r.registerWrapperListener,s.registerServiceListener=r.registerServiceListener,a.$watch(p,o,!0),q=g.$on("resizeMsg",k),a.$on("$destroy",i)}function n(){r.setup(b,s.chart.type,s.chart.data,s.chart.view,s.chart.options,s.chart.formatters,s.chart.customFormatters),e(l)}function o(){s.chart=a.$eval(c.chart),k()}function p(){var b=a.$eval(c.chart);return angular.isDefined(b)&&angular.isObject(b)?{customFormatters:b.customFormatters,data:b.data,formatters:b.formatters,options:b.options,type:b.type,view:b.view}:void 0}var q,r,s=this;m()}angular.module("googlechart").controller("GoogleChartController",a),a.$inject=["$scope","$element","$attrs","$injector","$timeout","$window","$rootScope","GoogleChartService"]}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b){a.$apply(function(){a.$eval(c.agcBeforeDraw,{chartWrapper:b})})}e.$inject=["chartWrapper"],d.registerServiceListener("beforeDraw",e,this)}}}angular.module("googlechart").directive("agcBeforeDraw",a)}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b,d,e){a.$apply(function(){a.$eval(c.agcOnClick,{args:b,chart:d,chartWrapper:e})})}e.$inject=["args","chart","chartWrapper"],d.registerChartListener("click",e,this)}}}angular.module("googlechart").directive("agcOnClick",a)}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b,d,e){var f={chartWrapper:b,chart:d,args:e,error:e[0],err:e[0],id:e[0].id,message:e[0].message};a.$apply(function(){a.$eval(c.agcOnError,f)})}e.$inject=["chartWrapper","chart","args"],d.registerWrapperListener("error",e,this)}}}angular.module("googlechart").directive("agcOnError",a)}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b,d,e){var f={chartWrapper:e,chart:d,args:b,column:b[0].column,row:b[0].row};a.$apply(function(){a.$eval(c.agcOnMouseout,f)})}e.$inject=["args","chart","chartWrapper"],d.registerChartListener("onmouseout",e,this)}}}angular.module("googlechart").directive("agcOnMouseout",a)}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b,d,e){var f={chartWrapper:e,chart:d,args:b,column:b[0].column,row:b[0].row};a.$apply(function(){a.$eval(c.agcOnMouseover,f)})}e.$inject=["args","chart","chartWrapper"],d.registerChartListener("onmouseover",e,this)}}}angular.module("googlechart").directive("agcOnMouseover",a)}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b){a.$apply(function(){a.$eval(c.agcOnReady,{chartWrapper:b})})}e.$inject=["chartWrapper"],d.registerWrapperListener("ready",e,this)}}}angular.module("googlechart").directive("agcOnReady",a)}(),function(){function a(){return{restrict:"A",scope:!1,require:"googleChart",link:function(a,b,c,d){function e(b,d){var e={selectedItems:d.getSelection()};e.selectedItem=e.selectedItems[0],e.chartWrapper=b,e.chart=d,a.$apply(function(){a.$eval(c.agcOnSelect,e)})}e.$inject=["chartWrapper","chart"],d.registerWrapperListener("select",e,this)}}}angular.module("googlechart").directive("agcOnSelect",a)}(),function(){function a(){return{restrict:"A",scope:!1,controller:"GoogleChartController"}}angular.module("googlechart").directive("googleChart",a),a.$inject=[]}(),function(){angular.module("googlechart").value("googleChartApiConfig",{version:"1",optionalSettings:{packages:["corechart"]}})}(),function(){function a(a,b,c,d){c.optionalSettings=c.optionalSettings||{};var e=b.defer(),f=function(){var b={callback:function(){var b=c.optionalSettings.callback;a.$apply(function(){e.resolve(google)}),angular.isFunction(b)&&b.call(this)}};b=angular.extend({},c.optionalSettings,b),window.google.load("visualization",c.version,b)},g=document.getElementsByTagName("head")[0],h=document.createElement("script");return h.setAttribute("type","text/javascript"),h.src=d,h.addEventListener?h.addEventListener("load",f,!1):h.onreadystatechange=function(){("loaded"===h.readyState||"complete"===h.readyState)&&(h.onreadystatechange=null,f())},g.appendChild(h),e.promise}angular.module("googlechart").factory("googleChartApiPromise",a),a.$inject=["$rootScope","$q","googleChartApiConfig","googleJsapiUrl"]}(),function(){function a(a,b,c,d){function e(){function e(a){var b;if(angular.isArray(W[a]))for(b=0;b<W[a].length;b++)W[a][b]()}function f(a){return a}function g(a){return H=a,J=!0,U.resolve(),a}function h(){angular.isDefined(K)?(K.setChartType(M),K.setDataTable(N),K.setView(O),K.setOptions(P)):(K=new H.visualization.ChartWrapper({chartType:M,dataTable:N,view:O,options:P,containerId:L[0]}),m(K,X)),S||(S=new d(H)),S.applyFormats(K.getDataTable(),Q,T).requiresHtml&&K.setOption("allowHtml",!0),V=!1}function i(a,b,c){for(var d=b?b.split("."):[];d.length&&a;){var e=d.shift();new RegExp("(.+)\\[([0-9]*)\\]").exec(e);c&&(void 0===a[e]&&(a[e]={}),0===d.length&&(a[e]=c)),a=a[e]}return a}function j(){R!==K.getChart()&&(R=K.getChart(),m(R,Y))}function k(){J=!1,U=c.defer(),I=a.then(g)["catch"](f),z("ready",j,G)}function l(a,c,d,e){var f=function(){var a={chartWrapper:K,chart:K.getChart(),args:arguments};b.invoke(d,e||this,a)};return angular.isDefined(a)&&angular.isObject(a)?(angular.isArray(a[c])||(a[c]=[]),a[c].push(f),function(){angular.isDefined(f.googleListenerHandle)&&H.visualization.events.removeListener(f.googleListenerHandle);var b=a[c].indexOf(f);a[c].splice(b,1),0===a[c].length&&(a[c]=void 0)}):void 0}function m(a,b){for(var c in b)if(b.hasOwnProperty(c)&&angular.isArray(b[c]))for(var d=0;d<b[c].length;d++)angular.isFunction(b[c][d])&&(b[c][d].googleListenerHandle=H.visualization.events.addListener(a,c,b[c][d]))}function n(){e("beforeDraw"),K.draw()}function o(){V&&(I=I.then(h)),I=I.then(n())}function p(){return K}function q(){var a=N||{};return angular.copy(a)}function r(){return L}function s(a){var b=P||{};return i(b,a)}function t(){var a=P||{};return angular.copy(a)}function u(){return U.promise}function v(){var a=O||{};return angular.copy(a)}function w(){return J}function x(a,b,c){return l(Y,a,b,c)}function y(a,b,c){return l(W,a,b,c)}function z(a,b,c){return l(X,a,b,c)}function A(a){angular.isDefined(a)&&(N=angular.copy(a),V=!0)}function B(a){angular.isElement(a)&&L!==a&&(L=a,K=null,V=!0)}function C(a,b){P=P||{},i(P,a,angular.copy(b)),V=!0}function D(a){angular.isDefined(a)&&(P=angular.copy(a),V=!0)}function E(a,b,c,d,e,f,g){L=a||L,M=b||M,N=c||N,O=d||O,P=e||P,Q=f||Q,T=g||T,I=I.then(h)}function F(a){O=angular.copy(a)}var G=this;G.draw=o,G.getChartWrapper=p,G.getData=q,G.getElement=r,G.getOption=s,G.getOptions=t,G.getView=v,G.getReadyPromise=u,G.isApiReady=w,G.registerChartListener=x,G.registerServiceListener=y,G.registerWrapperListener=z,G.setData=A,G.setElement=B,G.setOption=C,G.setOptions=D,G.setup=E,G.setView=F;var H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V=!0,W={},X={},Y={};k()}return e}angular.module("googlechart").factory("GoogleChartService",a),a.$inject=["googleChartApiPromise","$injector","$q","FormatManager"]}(),function(){function a(){var a="https:",b="//www.google.com/jsapi";this.setProtocol=function(b){a=b},this.setUrl=function(a){b=a},this.$get=function(){return(a?a:"")+b}}angular.module("googlechart").provider("googleJsapiUrl",a)}();