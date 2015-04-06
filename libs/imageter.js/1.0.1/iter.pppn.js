/*****************************************************
 *Config
 ****************************************************/
var configp = {
	"app_style":1,
	"app_location":2, 
	"service":"",
	"creative":
	{
		"type":0,
		"w":0,
		"h":0,
		"code":"0",
		"click":"",
		"material":"",
		"click":"",
		"third_show_url":"",
		"third_click_url":"",
		"cookiemapping_url":"",
		"cb_code":"",
	    "cb_show_monitor":""
	},
	ads_handler : "s",
	news_handler : "x",
	record_handler : "x",
	timer: 1000
}; 
	var isxad; 
var isIE = !! window.ActiveXObject;
//var sizeList = [250, 250, 200, 200];
//var cssList = ["/css/imageter.ppp.css"];
var appUrl="";
var scriptUrlSub = "iter.pppn.js";
	var closeWidth = 40;
	var closeHeight = 13;

	var logoWidth = 24;		
	var logoHeight = 18;
	var biglogoWidth = 131;		
	var biglogoHeight = 18;

	var appWidth = 0;
	var appHeight = 0;
	var appLoc = 11;
var scriptUrlHeader="";
var allUrlHeader="";
var ev = {
	bind: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	remove: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.datachEvent) {
			element.datachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},
	importFile: function(type, name) {
		var ele;
		switch (type) {
			case "js":
				ele = document.createElement('script');
				ele.src = name;
				ele.charset = "utf-8";
				ele.type = "text/javascript";
				break;
			case "css":
				ele = document.createElement("link");
				ele.type = "text/css";
				ele.rel = "stylesheet";
				ele.href = name;
				break;
		}
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(ele);
	}
};
function checkClickUrl(clickUrl){
	var checkRs = 0;
	if(clickUrl.length>0){
		var idx11 = clickUrl.indexOf('url=');
		var len11 = clickUrl.length;
		if(idx11<0){
			checkRs = 0;
		}else{
			if((idx11+4)==len11){
				checkRs = 0;
			}else{
				checkRs = 1;
			}
		}
	}else{
		checkRs = 0;
	}
	return checkRs;
};
	function getAdsClickUrl(clickUrl){
		var checkRs = '';
		if(clickUrl.length>0){
			var idx11 = clickUrl.indexOf('&url=');
			var len11 = clickUrl.length;
			if(idx11>0)
				checkRs = clickUrl.substring(idx11+5,len11);
		} 
		return checkRs;
	};
	function getMonitorUrl(clickUrl){
		var checkRs = '';
		if(clickUrl.length>0){
			var idx11 = clickUrl.indexOf('&url=');
			if(idx11>0)
				checkRs = clickUrl.substring(0,idx11);
		} 
		return checkRs;
	};
	
	function checkImfImtUrl(tempUrl,imfHeader){
		if(tempUrl.indexOf(imfHeader)<0){ 
			return ;
		}  
		var idxEnd = tempUrl.indexOf(">");
		if(idxEnd<=0){ 
			return ;
		}
		var imfStr = tempUrl.substring(1,idxEnd);
		var httpStr = tempUrl.substring(idxEnd+1,tempUrl.length); 
		var lowTime = 1000;
		var mastIime =500;
		var imfArr = new Array();
		imfArr = imfStr.split("-");
		for(i=0;i<imfArr.length;i++){
			var tempImf = imfArr[i];
			//document.write(i+':'+tempImf+'</br>');
			if(i==1 && tempImf.length>0 && !isNaN(tempImf)){
				lowTime = parseInt(tempImf);
			}
			if(i==2 && tempImf.length>0 && !isNaN(tempImf)){
				mastIime = parseInt(tempImf);
			}
		} 
		return {
			lowTime:lowTime,
			mastIime:mastIime,
			httpStr:httpStr
		};
	};
	var imfCount=0;
	function sendReqMsg(urls){
		var imfHeader="<im";
		var tempUrls = urls+'';
		if(tempUrls.length==0){
			return ;
		}
		var strArr = new Array();
		strArr = tempUrls.split(";");
		var tempImfUrlStr = "";
		var tempImtUrlStr = "";
		for(i=0;i<strArr.length;i++){
			var tempUrl = strArr[i];
			if(tempUrl.length>0 && tempUrl.toLowerCase()!="http://" && tempUrl.indexOf(imfHeader)<0){
				ev.importFile('js',tempUrl);
			}
			if(tempUrl.indexOf("<imf")>=0){ 
				tempImfUrlStr = tempUrl+"";
			}
			if(tempUrl.indexOf("<imt")>=0){ 
				tempImtUrlStr = tempUrl+"";
			}
		}
		if(tempImfUrlStr.length>0){
			var lowTimeF = 1000;
			var mastTimeF = 500;
			var httpUrlF = "";
			var lowTimeT = 1000;
			var mastTimeT = 500;
			var httpUrlT = "";
			var retunF = checkImfImtUrl(tempImfUrlStr,"<imf");
			if("undefined"!= typeof(retunF)){
				lowTimeF = retunF.lowTime;
				mastTimeF = retunF.mastIime;
				httpUrlF = retunF.httpStr;
			}else{
				return ;
			}
			var retunT = checkImfImtUrl(tempImtUrlStr,"<imt");
			if("undefined"!= typeof(retunT)){
				lowTimeT = retunT.lowTime;
				mastTimeT = retunT.mastIime;
				httpUrlT = retunT.httpStr;
			}
			
			if(httpUrlF.length>0){
				if(httpUrlT.length>0){
					var tempIfm = document.createElement('iframe');
					tempIfm.id="tmphIfrm"+imfCount;
					imfCount = imfCount +1;
					tempIfm.style.display="none"; 
					tempIfm.src=httpUrlF;
					tempIfm.width="0px";
					tempIfm.height="0px";
					isx.container.appendChild(tempIfm);

					var tempTimeF = lowTimeF+parseInt(mastTimeF*Math.random());
					var mftimer = setInterval(function(){
						tempIfm.src = httpUrlT;
						clearInterval(mftimer);;
					}, tempTimeF); 
					
					var tempTimeT = lowTimeF+lowTimeT+parseInt((mastTimeF+mastTimeT)*Math.random());
					var mttimer = setInterval(function(){ 
						clearInterval(mttimer);
						tempIfm.src = 'about:blank';
					}, tempTimeT); 

				}else{						
					var tempIfm = document.createElement('iframe');
					tempIfm.id="tmphIfrm"+imfCount;
					imfCount = imfCount +1;
					tempIfm.style.display="none";  
					tempIfm.src=httpUrlF;
					isx.container.appendChild(tempIfm);

					var tempTimeF = lowTimeF+parseInt(mastTimeF*Math.random());
					var mftimer = setInterval(function(){ 
						tempIfm.src = 'about:blank';
							clearInterval(mftimer);
					}, tempTimeF); 

				}
			}
		}
	};

var jsloader={
	getIFrameDOM:function(id){
		return document.getElementById(id).contentDocument || document.frames[id].document;
	},
	loadjsext:function(containert, jscodes, crtWidth,crtHeight,loadFloorJs){ 
		var jsins = document.createElement('div');
		jsins.id="isxpcrt00";
		var jsifm = document.createElement('iframe');
		jsifm.id='isx-p-f1';
		jsifm.scrolling="no";
		jsifm.width=crtWidth+"px";
		jsifm.height=crtHeight+"px";
		jsifm.marginWidth="0px";
		jsifm.marginHeight="0px";
		jsifm.frameBorder="0px";
		jsifm.style.cssText="border:0px;background:none repeat scroll 0% 0% transparent;margin:0px;padding:0px;top:0px;left:0px;"; 
		var jsHtml='<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="padding:0;margin:0;border:0;background:transparent;" scroll="no">'
		           +loadFloorJs+jscodes+'</body></html>';
		
		jsifm.onload = jsifm.onreadystatechange = function(){
			if( jsifm.readyState && jsifm.readyState!="loaded" && jsifm.readyState!="complete" ){ 
				return ;
			}else{ 
				jsifm.onload = jsifm.onreadystatechange = null;
				var dc = jsloader.getIFrameDOM("isx-p-f1") ;
				if(navigator.userAgent.indexOf("Firefox")>0 || navigator.userAgent.indexOf("Chrome")>0){ 
					dc.open();
					dc.write(jsHtml);
					dc.close();
				}else{
					dc.write(jsHtml);
				}
			}
		}  
		containert.appendChild(jsins);
		jsins.appendChild(jsifm);   
		jsloader.loadjsext1(containert,crtWidth,crtHeight);
	} ,
	loadjsext1:function(containert, crtWidth,crtHeight){ 
		var jsins = document.createElement('div');
		jsins.id="isxpcrt01";
		jsins.style.display="none";
		var jsifm = document.createElement('iframe');
		jsifm.id='isx-p-f2';
		jsifm.scrolling="no";
		jsifm.width=crtWidth+"px";
		jsifm.height=crtHeight+"px";
		jsifm.marginWidth="0px";
		jsifm.marginHeight="0px";
		jsifm.frameBorder="0px";
		jsifm.style.cssText="border:0px;background:none repeat scroll 0% 0% transparent;margin:0px;padding:0px;top:0px;left:0px;"; 
		 
		containert.appendChild(jsins);
		jsins.appendChild(jsifm);   
	}
};
/*****************************************************
 *cachep object
 ****************************************************/
var cachep = {
	fetchAds: function() {
		isxad = new ISXAd(configp.creative);
		//var iu = 'test.img',imgId='0',imgWidth=250,imgHeight=250,
		//	tlu = encodeURIComponent(document.title);	
		//var	url = configp.app_ad.service + configp.ads_handler + "?tp=3" + "&isp=" + configp.isp + "&of=1" + "&img=" + iu + "&imgn=" + imgId + "&img_w=" +imgWidth + "&img_h=" + imgHeight + "&tl=" + tlu + "&cbk=hj";
		//ev.importFile('js', url);
	}
};

var ISXAd = function(data) {	
	this.container = isx.container;
	this.adData = data; 
	this.contents = null;
	this.closes = null;
	this.logos = null;
	this.biglogos = null;
	this.timerId = null;
    this.init();
};
ISXAd.prototype = {
	constructor: ISXAd,
	init: function() {
		var _this = this;
		_this.createApps();
	},
	createApps:function(){
		var _this = this;
        var creative = _this.adData;
		var contentWrapper = document.createElement("div");
		var closeWrapper = document.createElement("div");
		var redUrl = "",contentHtml="";
        //check is null
		var tesmpUrl = (creative.material+"").toLowerCase();
        if(tesmpUrl.indexOf("http://null.jpg")>=0){
			isx.container.style.display="none";
			//isx.container.parentNode.style.display="none";
			return ;
		} 

        //send show'monitor msg		
		if(_this.adData.third_show_url){
			sendReqMsg(_this.adData.third_show_url); 
		}

		if(_this.adData.cookiemapping_url){
			sendReqMsg(_this.adData.cookiemapping_url); 
		}
		contentWrapper.id = "isx-contents-wrapper-p"; 
		closeWrapper.className = "isx-close-wrapper-p";	
		closeWrapper.id= "isx-close-wrapper-p";	
		appWidth = creative.w;
		appHeight = creative.h;
		appLoc = configp.app_location;
		isx.container.appendChild(contentWrapper);
		//create ad
		if (creative.type == 0) { // image
			redUrl = (creative.click || '');
				//if(ev.checkClickUrl(redUrl)>0){
				var checkRedUrl0 = getAdsClickUrl(redUrl);  //checkClickUrl(redUrl);
				if(checkRedUrl0.length>0){
					contentHtml += "<a class='large-image' target='_blank' href='" + checkRedUrl0 +"'><img src='" + creative.material + "' alt=''  width='" + creative.w + "' height='" + creative.h+ "' border='0px'/></a>";
			    }
				else{
					contentHtml += "<img src='" + creative.material + "' alt=''  width='" + creative.w + "' height='" + creative.h+ "' border='0px'/>";
				}	
			contentWrapper.innerHTML =  contentHtml;    
		} else if (creative.type == 1) { // text
			//TODO:
		} else if (creative.type == 2) { // flash			
			redUrl = (creative.click || '');
			var checkRedUrl0 = getAdsClickUrl(redUrl);  //checkClickUrl(redUrl);
			if(checkRedUrl0.length>0){ 
			}
			contentHtml += '<div id=pppobj style="text-align:left;position:absolute;z-index:2;width:'+creative.w+'px;height:'+creative.h+'px;">';
			contentHtml += '<object id="afg-adloader" width="' + creative.w + '" height="' + creative.h + '"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
			contentHtml += '<param value="always" name="allowScriptAccess"/><param value="' + creative.material + '" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality">';
			contentHtml += '<embed width="' + creative.w + '" height="' + creative.h + '" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque" quality="high" src="' + creative.material + '"></object>';
			contentHtml += '</div>';
			if(checkRedUrl0.length>0){ 
				contentHtml += "<a id=pppa href='"+checkRedUrl0+"' target='_blank' style='display:block;width:"+creative.w+"px;height:"+creative.h+"px;position:absolute; z-index:999;background:#000;filter:alpha(opacity=0);-moz-opacity:0;opacity: 0'></a>";
			
			}
			contentWrapper.innerHTML =  contentHtml; 
		} else if (creative.type == 3) { // video
			//TODO:
		} else if (creative.type == 4) { // js, nonrtb		
			if(creative.code && creative.code.toLowerCase().indexOf('http://')==0){		
				var frame = '<iframe src="' + creative.code + '" scrolling="no" height="' + creative.h + '" width="' + creative.w + '" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
				contentHtml += frame;
				contentWrapper.innerHTML =  contentHtml; 
			}else{
				var loadFloorJs = ""; 
				if(creative.cb_code){
					configp.creative.h= creative.h;
					configp.creative.w= creative.w;
					configp.creative.cb_code= creative.cb_code+"";  
					if(creative.cb_show_monitor)
						configp.creative.cb_show_monitor=creative.cb_show_monitor;				
					var timestamp = Date.parse(new Date());
					loadFloorJs = "<script type='text/javascript' src='"+scriptUrlHeader+"iter.cbppp.js?v="+timestamp+"'></script>";
				}
				jsloader.loadjsext(contentWrapper,creative.code,creative.w,creative.h,loadFloorJs);
			}
		} 	 
		var contentLenStr="width:"+ (creative.w+0) + "px;" +"height:"+ (creative.h+0) + "px;";
		var contentLoc = _this.getLocXY(appWidth+20,appHeight+20);
		contentWrapper.style.left = contentLoc.locX +"px";
		contentWrapper.style.top = contentLoc.locY +"px";		
		contentWrapper.style.cssText="position: absolute;z-index:2147483500;float:right;margin-left:0px !important;text-align:left;overflow:hidden;border:0px solid #BBB;display:block;"+contentLenStr;

		//create close		
		closeHtml = '<a title="关闭" href="javascript:;" class="isx-close">&nbsp;&nbsp;&nbsp;</a>';
		closeWrapper.innerHTML = closeHtml; 
		closeWrapper.style.left = (contentLoc.locX + appWidth -closeWidth - 3)  +"px"; 
		closeWrapper.style.top = (contentLoc.locY + appHeight -closeHeight - 3)+"px";
		var closeCssText=" background-color:#F1F3F5;position:absolute;filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9;background:url("+allUrlHeader+"/images/isx-close.png) no-repeat;color: #555555;font:normal 10px/12px Arial,Microsoft Yahei;";
            closeCssText = closeCssText+"text-align: center;z-index:2147483647;border: 0px solid #BBB;";  
		    closeCssText= closeCssText + "width:"+ closeWidth + "px;" +"height:"+ closeHeight + "px;";
		closeWrapper.style.cssText=closeCssText;
        //append to	
		isx.container.appendChild(closeWrapper);

		_this.contents = contentWrapper;
		_this.closes = closeWrapper; 
        
		_this.relocXY();
		_this.bindClosesEvents();
		_this.bindAdsEvents(); 
		_this.bindLogoEvents(); 
	},
	getLocXY:function(divWidth,divHeight){
		var scrollTopP = document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeftP = document.documentElement.scrollLeft || document.body.scrollLeft;
		var x=0,y=0;
		if(appLoc==10){			
			x = scrollLeftP;
			y = document.documentElement.clientHeight- divHeight +scrollTopP;
		}else if(appLoc==11){
			x = (document.documentElement.clientWidth - divWidth + scrollLeftP);
			y = (document.documentElement.clientHeight- divHeight +scrollTopP);
		}else if(appLoc==12){
			x = (document.documentElement.clientWidth - divWidth)/2  + scrollLeftP;
			y = (document.documentElement.clientHeight- divHeight)/2 + scrollTopP;
		}else if(appLoc==13){
			x = scrollLeftP;
			y = scrollTopP;
		}else if(appLoc==14){
			x = document.documentElement.clientWidth - divWidth + scrollLeftP;
			y = scrollTopP;
		}else{
			x = document.documentElement.clientWidth - divWidth + scrollLeftP;
			y = document.documentElement.clientHeight- divHeight +scrollTopP;
		}
		return {
			locX: x,
			locY: y
		};
		
	},
	relocXY:function(){
		var _this = this;
		 var scrollTopP = document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeftP = document.documentElement.scrollLeft || document.body.scrollLeft;
		var x=0,y=0;
		if(appLoc==10){			
			x = scrollLeftP;
			y = document.documentElement.clientHeight- _this.contents.offsetHeight +scrollTopP;
		}else if(appLoc==11){
			x = document.documentElement.clientWidth - _this.contents.offsetWidth + scrollLeftP;
			y = document.documentElement.clientHeight - _this.contents.offsetHeight +scrollTopP;
		}else if(appLoc==12){
			x = (document.documentElement.clientWidth - _this.contents.offsetWidth)/2 + scrollLeftP;
			y = (document.documentElement.clientHeight- _this.contents.offsetHeight)/2 + scrollTopP;
		}else if(appLoc==13){
			x = scrollLeftP;
			y = scrollTopP;
		}else if(appLoc==14){
			x = document.documentElement.clientWidth - _this.contents.offsetWidth + scrollLeftP;
			y = scrollTopP;
		}else{
			x = document.documentElement.clientWidth - _this.contents.offsetWidth + scrollLeftP;
			y = document.documentElement.clientHeight- _this.contents.offsetHeight +scrollTopP;
		}
		
        _this.contents.style.left = (x-0) +"px";
		_this.contents.style.top = (y-0) +"px";
		_this.closes.style.left = (x + appWidth -closeWidth- 3)  +"px"; 
		_this.closes.style.top = (y + 3)+"px"; 
	},
	closeApp: function() {
		var _this = this;
		_this.contents.style.display = "none";
		_this.closes.style.display = "none";
		if(document.getElementById("pppobj")){
			var pppobj = document.getElementById("pppobj");
			pppobj.style.display = "none";
		}		
		if(document.getElementById("pppa")){
			var pppa = document.getElementById("pppa");
			pppa.style.display = "none";
		}
	},
	bindLogoEvents: function() {
		var _this = this;
		ev.bind(_this.contents, 'mouseover', function() {
			clearTimeout(_this.timerId);
		});
		ev.bind(_this.contents, 'mouseout', function() {
			clearTimeout(_this.timerId);
		});
	},
	removeLogoEvents: function() {
		var _this = this;
		ev.remove(_this.contents, 'mouseover', function() {
			clearTimeout(_this.timerId);
		});
		ev.remove(_this.contents, 'mouseout', function() {
			clearTimeout(_this.timerId);
		});
	},
	bindClosesEvents: function() {
		var _this = this;
		ev.bind(_this.closes, 'mousedown', function() {
			_this.closeApp();
		});
	},
	bindAdsEvents:function(){
		var _this = this;
		var list = _this.contents.children;
		if(list.length>0){
			if(list.length==2){
				var ads0 = list[1];
				ev.bind(ads0, 'mousedown', function() { 
					_this.sendAdsClickMsg(); 
				});			
			}
			else{
				var ads0 = list[0];
				ev.bind(ads0, 'mousedown', function() { 
					_this.sendAdsClickMsg(); 
				});			
			}
		}
	},
	sendAdsClickMsg:function(){
		var _this = this;
		var tempClick = _this.adData.click +'';
		var testUrl = getMonitorUrl(tempClick);
		if(testUrl.length>0)
			ev.importFile('js',testUrl);
		if(_this.adData.third_click_url){
			sendReqMsg(_this.adData.third_click_url); 
		}
	}
};
/*****************************************************
 *Mix config
 ****************************************************/
var mixConfig = function(c) {
	if (c && typeof c == "object") {
		for (var i in c) {
			configp[i] = c[i];
		}
		var actionUrl = configp.service.toLowerCase();
		var idx = actionUrl.indexOf("/actions");
		if(idx>=0){
			appUrl = actionUrl.substring(0,idx);
		}else{
			appUrl = actionUrl;
		}
		//appUrl
	} else {
		return;
	}
};

var isx = {
	init: function() {
		if(typeof configp.isp == "undefined") return; 
		appLoc = configp.app_location;
		var scripts = document.getElementsByTagName('script'); 
		for (var i = 0, len = scripts.length; i < len; i++) {
			var scri = scripts[i];
			var scriSrc = scri.src;			
			if("undefined"!= typeof(scriSrc)){
				var tenpl = scriSrc.indexOf(scriptUrlSub);
				if(tenpl>0){ 				
						scriptUrlHeader = scriSrc.substring(0,tenpl);
						allUrlHeader = scriptUrlHeader.substring(0,scriptUrlHeader.length-1);
						var temp3 = allUrlHeader.lastIndexOf("/");
						allUrlHeader = allUrlHeader.substring(0,temp3);
				}
			}
		}
		isx.createContainer();
	},
	createContainer: function() {
		var container = document.createElement('div');
		container.id = "isx-plugin-container-p";
		var tempLoc = isx.getLocXY(configp.creative.w,configp.creative.h);
		container.style.left=tempLoc.locX + 'px';
		container.style.top=tempLoc.locY + 'px'; 
		container.style.cssText="border: 0px solid #BBB;";
		isx.container = container;
		document.body.children && document.body.insertBefore(container, document.body.lastChild.nextSibling);
			//document.body.insertBefore(container, document.body.lastChild);
	},
	getLocXY:function(divWidth,divHeight){
		var scrollTopP = document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeftP = document.documentElement.scrollLeft || document.body.scrollLeft;
		var x=0,y=0;
		if(appLoc==10){			
			x = scrollLeftP;
			y = document.documentElement.clientHeight- divHeight +scrollTopP;
		}else if(appLoc==11){
			x = (document.documentElement.clientWidth - divWidth + scrollLeftP);
			y = (document.documentElement.clientHeight- divHeight +scrollTopP);
		}else if(appLoc==12){
			x = (document.documentElement.clientWidth - divWidth)/2  + scrollLeftP;
			y = (document.documentElement.clientHeight- divHeight)/2 + scrollTopP;
		}else if(appLoc==13){
			x = scrollLeftP;
			y = scrollTopP;
		}else if(appLoc==14){
			x = document.documentElement.clientWidth - divWidth + scrollLeftP;
			y = scrollTopP;
		}else{
			x = document.documentElement.clientWidth - divWidth + scrollLeftP;
			y = document.documentElement.clientHeight- divHeight +scrollTopP;
		}
		return {
			locX: x,
			locY: y
		};
		
	}
};
/*****************************************************
	 *extern DomReady
	 ****************************************************/
	var readylist = [];
	var run = function() {
		for (var i = 0; i < readylist.length; i++) readylist[i] && readylist[i]();
	};
	var doScrollCheck = function() {
		try {
			document.documentElement.doScroll('left');
		} catch (err) {
			//setTimeout(doScrollCheck, 1);
			//return;
		}
		run();
	};
	document.DomReady = function(fn) {

		if (document.readyState === "complete") {
			readylist.push(fn);
			run();
			return;
		}
		if (readylist.push(fn) > 1) 
			return;
		if (document.addEventListener) 
			return document.addEventListener('DOMContentLoaded', run, false);

		if (isIE) {
			doScrollCheck();
		}

	};

/*****************************************************
 *init function
 ****************************************************/
function init(data) {
	var isx_config_p1 = data;
	if (typeof isx_config_p1 != "undefined") {
		mixConfig(isx_config_p1);
	}else{
		return ;
	}
    isx.init();
	//ev.importFile('css', appUrl+cssList[0]);
	cachep.fetchAds();
};
/*document.DomReady(function() {
	init();
	
	ev.bind(document, 'resize', function() {
		//alert('document resize');
		isxad.relocXY();
	});
	ev.bind(window, 'resize', function() {
		//alert('window resize');
		isxad.relocXY();
	});
	ev.bind(document, 'scroll', function() {
		//alert('window resize');
		isxad.relocXY();
	});
	ev.bind(window, 'scroll', function() {
		//alert('window resize');
		isxad.relocXY();
	});
}); 
*/
 window['isx_config_p'] = function(data) {
	//lert(data);
	init(data);
	
	ev.bind(document, 'resize', function() {
		//alert('document resize');
		isxad.relocXY();
	});
	ev.bind(window, 'resize', function() {
		//alert('window resize');
		isxad.relocXY();
	});
	ev.bind(document, 'scroll', function() {
		//alert('window resize');
		isxad.relocXY();
	});
	ev.bind(window, 'scroll', function() {
		//alert('window resize');
		isxad.relocXY();
	});
 }
/**************************************
*
****************************************/