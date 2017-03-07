/*Browser detection patch*/
//"use strict";

function getBrowserInfo(){
  var nAgt = navigator.userAgent;
  var browserInfo = {};

  function isTouchSupported() {
  	var msTouchEnabled = nAgt.msMaxTouchPoints;
  	var generalTouchEnabled = "ontouchstart" in document.createElement("div");

  	if (msTouchEnabled || generalTouchEnabled) {
  		return true;
  	}
  	return false;
  }


  browserInfo.mozilla = false;
  browserInfo.webkit = false;
  browserInfo.opera = false;
  browserInfo.safari = false;
  browserInfo.chrome = false;
  browserInfo.androidStock = false;
  browserInfo.msie = false;

  browserInfo.hasTouch = isTouchSupported();

  browserInfo.ua = nAgt;

  browserInfo.name  = navigator.appName;
  browserInfo.fullVersion  = ''+parseFloat(navigator.appVersion);
  browserInfo.majorVersion = parseInt(navigator.appVersion,10);
  var nameOffset,verOffset,ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
  	browserInfo.opera = true;
  	browserInfo.name = "Opera";
  	browserInfo.fullVersion = nAgt.substring(verOffset+6);
  	if ((verOffset=nAgt.indexOf("Version"))!=-1)
  		browserInfo.fullVersion = nAgt.substring(verOffset+8);
  }

  // In Opera > 20 the true version is after "OPR"
  else if ((verOffset=nAgt.indexOf("OPR"))!=-1) {
  	browserInfo.opera = true;
  	browserInfo.name = "Opera";
  	browserInfo.fullVersion = nAgt.substring(verOffset+4);
  }

  // In MSIE < 11, the true version is after "MSIE" in userAgent
  else if ( (verOffset=nAgt.indexOf("MSIE"))!=-1) {
  	browserInfo.msie = true;
  	browserInfo.name = "Microsoft Internet Explorer";
  	browserInfo.fullVersion = nAgt.substring(verOffset+5);
  }

  // In TRIDENT (IE11) => 11, the true version is after "rv:" in userAgent
  else if (nAgt.indexOf("Trident")!=-1 ||  nAgt.indexOf("Edge") != -1) {
  	browserInfo.msie = true;
  	browserInfo.name = "Microsoft Internet Explorer";
  	var start = nAgt.indexOf("rv:")+3;
  	var end = start+4;
  	browserInfo.fullVersion = nAgt.substring(start,end);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
  	browserInfo.webkit = true;
  	browserInfo.chrome = true;
  	browserInfo.name = "Chrome";
  	browserInfo.fullVersion = nAgt.substring(verOffset+7);
  }

  // Android stock browser
  else if ( ((nAgt.indexOf('mozilla/5.0') > -1 && nAgt.indexOf('android ') > -1 && nAgt.indexOf('applewebkit') > -1) && !(nAgt.indexOf('chrome') > -1)) ) {

  	verOffset=nAgt.indexOf("Chrome");
  	browserInfo.webkit = true;
  	browserInfo.androidStock = true;
  	browserInfo.name = "androidStock";
  	browserInfo.fullVersion = nAgt.substring(verOffset+7);
  }

  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
  	browserInfo.webkit = true;
  	browserInfo.safari = true;
  	browserInfo.name = "Safari";
  	browserInfo.fullVersion = nAgt.substring(verOffset+7);
  	if ((verOffset=nAgt.indexOf("Version"))!=-1)
  		browserInfo.fullVersion = nAgt.substring(verOffset+8);
  }

  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset=nAgt.indexOf("AppleWebkit"))!=-1) {
  	browserInfo.webkit = true;
  	browserInfo.safari = true;
  	browserInfo.name = "Safari";
  	browserInfo.fullVersion = nAgt.substring(verOffset+7);
  	if ((verOffset=nAgt.indexOf("Version"))!=-1)
  		browserInfo.fullVersion = nAgt.substring(verOffset+8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
  	browserInfo.mozilla = true;
  	browserInfo.name = "Firefox";
  	browserInfo.fullVersion = nAgt.substring(verOffset+8);
  }

  // In most other browsers, "name/version" is at the end of userAgent
  else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ){
  	browserInfo.name = nAgt.substring(nameOffset,verOffset);
  	browserInfo.fullVersion = nAgt.substring(verOffset+1);
  	if (browserInfo.name.toLowerCase()==browserInfo.name.toUpperCase()) {
  		browserInfo.name = navigator.appName;
  	}
  }

  // trim the fullVersion string at semicolon/space if present
  if ((ix=browserInfo.fullVersion.indexOf(";"))!=-1)
  	browserInfo.fullVersion=browserInfo.fullVersion.substring(0,ix);
  if ((ix=browserInfo.fullVersion.indexOf(" "))!=-1)
  	browserInfo.fullVersion=browserInfo.fullVersion.substring(0,ix);

  browserInfo.majorVersion = parseInt(''+browserInfo.fullVersion,10);
  if (isNaN(browserInfo.majorVersion)) {
  	browserInfo.fullVersion  = ''+parseFloat(navigator.appVersion);
  	browserInfo.majorVersion = parseInt(navigator.appVersion,10);
  }
  browserInfo.version = browserInfo.majorVersion;

  /*Check all mobile environments*/
  browserInfo.android = (/Android/i).test(nAgt);
  browserInfo.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt);
  browserInfo.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt);
  browserInfo.operaMobile = (/Opera Mini/i).test(nAgt);
  browserInfo.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt);
  browserInfo.kindle = /Kindle|Silk/i.test(nAgt);

  browserInfo.mobile = browserInfo.android || browserInfo.blackberry || browserInfo.ios || browserInfo.windowsMobile || browserInfo.operaMobile || browserInfo.kindle;

  //$.isMobile = browserInfo.mobile;
  //$.isTablet = browserInfo.mobile && $(window).width() > 765;

  //$.isAndroidDefault = browserInfo.android && !(/chrome/i).test(nAgt);

  return browserInfo;
};
