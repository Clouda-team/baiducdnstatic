//var sizeList = [250, 250, 200, 200];
//var cssList = ["/css/imageter.hrd.css"];
var appUrl="";
var scriptUrlSub = "iter.hrdn.js";
var scriptUrlHeader="";
var allUrlHeader="";
	var ad;
/****
* load js
***/ 
/*****************************************************
 *Config
 ****************************************************/
 var locxx=0;
 var locyy=0;
 var timerIdtestId;
var configh = {
	"app_style":1,
	"app_location":2, 
	"service":"",
	"container_id":"",
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
	var logoWidth = 24;		
	var logoHeight = 18;
	var biglogoWidth = 131;		
	var biglogoHeight = 18;  
	  
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
	},
	getXY: function(obj) {
		var x = 0,
			y = 0;
		if (obj.getBoundingClientRect) {
			var box = obj.getBoundingClientRect();
			var D = document.documentElement;
			x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
			y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
		} else {
			for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {};
		};
		return {
			x: x,
			y: y
		}
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
			if(i==1 && tempImf.length>0 &&  !isNaN(tempImf)){
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
					tempIfm.width="1280px";
					tempIfm.height="800px";
					isx.container.appendChild(tempIfm);

					var tempTimeF = lowTimeF+parseInt(mastTimeF*Math.random());
					var mftimer = setInterval(function(){ 
						tempIfm.src = httpUrlT;
						/*
						var jsHtml="<script>window.location.href='"+httpUrlT+"';</script>";
						//tempIfmd.location.href=httpUrlT;
						var tempIfmd = tempIfm.contentDocument || tempIfm.document; 
						tempIfmd.write(jsHtml); 
						*/
						clearInterval(mftimer);
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
var timmmid;
var jsloader={
	getIFrameDOM:function(id){
		return document.getElementById(id).contentDocument || document.frames[id].document;
	},
	loadjsext:function(containert, jscodes, crtWidth,crtHeight,loadFloorJs){ 
		var jsins = document.createElement('div');
		jsins.id="isxhcrt00"; 
		var jsifm = document.createElement('iframe');
		jsifm.id='isx-h-f1';
		jsifm.scrolling="no";
		jsifm.width=crtWidth+"px";
		jsifm.height=crtHeight+"px";
		jsifm.marginWidth="0px";
		jsifm.marginHeight="0px";
		jsifm.frameBorder="0px";
		jsifm.style.cssText="border:0px;background:none repeat scroll 0% 0%;margin:0px;padding:0px;top:0px;left:0px;"; 
		var jsHtml='<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="border:0;background:transparent;" scroll="no">'
		           +loadFloorJs+jscodes+'</body></html>';
		
		jsifm.onload = jsifm.onreadystatechange = function(){
			if( jsifm.readyState && jsifm.readyState!="loaded" && jsifm.readyState!="complete" ){ 
				return ;
			}else{ 
				jsifm.onload = jsifm.onreadystatechange = null;
				var dc = jsloader.getIFrameDOM("isx-h-f1") ;
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
		jsins.id="isxhcrt01";
		jsins.style.display="none"; 
		var jsifm = document.createElement('iframe');
		jsifm.id='isx-h-f2';
		jsifm.scrolling="no";
		jsifm.width=crtWidth+"px";
		jsifm.height=crtHeight+"px";
		jsifm.frameBorder="0px";
		jsifm.marginWidth="0px";
		jsifm.marginHeight="0px";
		jsifm.frameBorder="0px";
		jsifm.style.cssText="border:0px;background:none repeat scroll 0% 0% transparent;margin:0px;padding:0px;top:0px;left:0px;"; 
		 
		containert.appendChild(jsins);
		jsins.appendChild(jsifm);   
	} 
};
/*****************************************************
 *cacheh object
 ****************************************************/
var cacheh = {
	fetchAds: function() {
		ad = new ISXAd(configh.creative);
		//var iu = 'test.img',imgId='0',imgWidth=250,imgHeight=250,
		//	tlu = encodeURIComponent(document.title);	
		//var	url = config.app_ad.service + config.ads_handler + "?tp=3" + "&isp=" + config.isp + "&of=1" + "&img=" + iu + "&imgn=" + imgId + "&img_w=" +imgWidth + "&img_h=" + imgHeight + "&tl=" + tlu + "&cbk=hj";
		//ev.importFile('js', url);
	}
};


var ISXAd = function(data) {	
	this.container = isx.container;
	this.adData = data; 
	this.contents = null;
	this.logos = null;
	this.biglogos = null;
	this.timerId = null;
    this.init();
};
ISXAd.prototype = {
	init: function() {
		var _this = this;
		_this.createApps();
	},
	createApps:function(){
		var _this = this;
        var creative = _this.adData;
		var redUrl = "",contentHtml="";
        //check is null
		var tesmpUrl = (creative.material+"").toLowerCase();
        if(tesmpUrl.indexOf("http://null.jpg")>=0){
			isx.container.style.display="none";
			isx.container.parentNode.style.display="none";
			return ;
		} 
        
		var contentWrapper = document.createElement("div");
        //send show msg 
		if(_this.adData.third_show_url){
			sendReqMsg(_this.adData.third_show_url);
			/*var tempClick0 = _this.adData.third_show_url +'';
			if(tempClick0.length>0 && tempClick0.toLowerCase()!="http://"){
				ev.importFile('js',tempClick0);
			}*/
		}
		if(_this.adData.cookiemapping_url){
			sendReqMsg(_this.adData.cookiemapping_url);
			//var tempClick0 = _this.adData.cookiemapping_url +'';
			//if(tempClick0.length>0 && tempClick0.toLowerCase()!="http://"){
			//	ev.importFile('js',tempClick0);
			//}
		}
		//create ad		
		isx.container.appendChild(contentWrapper);
		contentWrapper.className = "isx-ad"; 
		contentWrapper.style.width = creative.w +"px";
		contentWrapper.style.height = creative.h +"px"; 
		
		var locxxxx = ev.getXY(isx.container); 
			locxx=locxxxx.x;
			locyy=locxxxx.y
		if (creative.type == 0) { // image
			redUrl = (creative.click || '');
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
			contentHtml += '<div id="hrdobj" style="text-align:left;position:absolute; z-index:2;width:'+creative.w+'px;height:'+creative.h+'px;top:'+locxxxx.y+'px;left:'+locxxxx.x+'px;">';
			contentHtml += '<object id="afg-adloader" width="' + creative.w + '" height="' + creative.h + '"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
			contentHtml += '<param value="always" name="allowScriptAccess"/><param value="' + creative.material + '" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality">';
			contentHtml += '<embed width="' + creative.w + '" height="' + creative.h + '" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque"  quality="high" src="' + creative.material + '"></object>';
			contentHtml += '</div>';
			if(checkRedUrl0.length>0){
				//contentHtml += '<a class="flash-cover" href="' + checkRedUrl0 + '" target="_blank">'; 
				//contentHtml += '</a>';
				//margin-top:-"+creative.h+"px;
				contentHtml += "<a id='hrda' href='"+checkRedUrl0+"' target='_blank' style='display:block;width:"+creative.w+"px;height:"+creative.h+"px;position:absolute; z-index:999;background:#000;filter:alpha(opacity=0);-moz-opacity:0;opacity: 0;top:"+locxxxx.y+"px;left:"+locxxxx.x+"px;'></a>";
			
			}			
			contentWrapper.innerHTML =  contentHtml;
		} else if (creative.type == 3) { // video
			//TODO:
		} else if (creative.type == 4) { // js, nonrtb				
			//var frame = '<iframe src="' + creative.code + '" scrolling="no" height="' + creative.h + '" width="' + creative.w + '" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
			//contentHtml += frame;			
			//contentWrapper.innerHTML =  contentHtml;
			if(creative.code && creative.code.toLowerCase().indexOf('http://')==0){
				var frame = '<iframe src="' + creative.code + '" scrolling="no" height="' + creative.h + '" width="' + creative.w + '" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
			    contentHtml += frame;			
			    contentWrapper.innerHTML =  contentHtml;
			}else{
				var loadFloorJs = "";
				if(creative.cb_code && creative.cb_code!=''){
					configh.creative.h= creative.h;
					configh.creative.w= creative.w;
					configh.creative.cb_code= creative.cb_code+""; 
					if(creative.cb_show_monitor)
						configh.creative.cb_show_monitor=creative.cb_show_monitor;					
					var timestamp = Date.parse(new Date());
					loadFloorJs = "<script type='text/javascript' src='"+scriptUrlHeader+"iter.cbhrd.js?v="+timestamp+"'></script>";
				}
				jsloader.loadjsext(contentWrapper,creative.code,creative.w,creative.h,loadFloorJs);
			}
		} 		
  
 
        
		_this.contents = contentWrapper;
		_this.bindAdsEvents(); 
		_this.bindLogoEvents(); 
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
	sendAdsClickMsg:function(){
		var _this = this; 
		//ev.importFile('js',_this.adData.third_click_url);
		if(_this.adData.third_click_url){ 
			sendReqMsg(_this.adData.third_click_url);
			//var tempClick0 = _this.adData.third_click_url +'';
			//if(tempClick0.length>0 && tempClick0.toLowerCase()!="http://"){
			//	ev.importFile('js',tempClick0);
			//}
		}
		var tempClick = _this.adData.click +'';
		var testUrl = getMonitorUrl(tempClick);
		if(testUrl.length>0)
			ev.importFile('js',testUrl);
		
	},
	relocXY:function(){
		var _this = this; 
		var locxxxx = ev.getXY(isx.container); 
		if(locxx!=locxxxx.x || locyy!=locxxxx.y){
			locxx=locxxxx.x;
			locyy=locxxxx.y
			if(document.getElementById("hrdobj")){
				var objhrd = document.getElementById("hrdobj");
				objhrd.style.left=locxxxx.x+"px";
				objhrd.style.top=locxxxx.y+"px";
			}
			if(document.getElementById("hrda")){
				var objhrd = document.getElementById("hrda");
				objhrd.style.left=locxxxx.x+"px";
				objhrd.style.top=locxxxx.y+"px";
			}

		
				clearInterval(timerIdtestId);
		}

	}
};
/*****************************************************
 *Mix config
 ****************************************************/
var mixConfig = function(c) {
	if (c && typeof c == "object") {
		/*for (var i in c) {
			configh[i] = c[i];
		}*/
		if(c.app_style)
			configh.app_style=c.app_style;
		if(c.app_location)
			configh.app_location=c.app_location;
		if(c.service)
			configh.service=c.service;
		if(c.creative)
			configh.creative=c.creative;
		if(c.container_id)
			configh.container_id=c.container_id; 
		if(c.isp)
			configh.isp = c.isp;
		var actionUrl = configh.service.toLowerCase();
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
		if(typeof configh.isp == "undefined") return; 
		isx.createContainer();
		if(configh.container_id && configh.container_id.length>0 && document.getElementById(configh.container_id)){
			document.getElementById(configh.container_id).appendChild(isx.container);
		}else{
			var scripts = document.getElementsByTagName('script');
			var getScript = 0 ;
			for (var i = 0, len = scripts.length; i < len; i++) {
				var scri = scripts[i];
				var scriSrc = scri.src;		
				if("undefined"!= typeof(scriSrc)){
					var tenpl = scriSrc.indexOf(scriptUrlSub);
					if(tenpl>0){
						if(scri.parentElement){
							scri.parentElement.appendChild(isx.container); 
							getScript = 1;
						}
						scriptUrlHeader = scriSrc.substring(0,tenpl);
						allUrlHeader = scriptUrlHeader.substring(0,scriptUrlHeader.length-1);
						var temp3 = allUrlHeader.lastIndexOf("/");
						allUrlHeader = allUrlHeader.substring(0,temp3);

					}
				}
			}
			if(getScript==0){
				document.body.children && document.body.insertBefore(isx.container, document.body.firstChild);
			}
		}
	},
	createContainer: function() {
		var container = document.createElement('div');
		container.id = "isx-plugin-container-h";
		isx.container = container;
		//document.body.children && document.body.insertBefore(container, document.body.firstChild);
	}
};
 
/*****************************************************
 *init function
 ****************************************************/
function init(data) { 
	var isx_config_h1 = data;
	if (typeof isx_config_h1 != "undefined") {
		mixConfig(isx_config_h1);
	}else{
		return ;
	}
    isx.init();
	//ev.importFile('css', appUrl+cssList[0]);
	cacheh.fetchAds(); 
	
	ev.bind(document, 'resize', function() {
		//alert('document resize');
		ad.relocXY();
	});
	ev.bind(window, 'resize', function() {
		//alert('window resize');
		ad.relocXY();
	}); 
	
	timerIdtestId = setInterval(function() {
	  ad.relocXY()
	}, 50);
};
 window['isx_config_h'] = function(data) {
	//lert(data);
	init(data);
 }
 //callAction(); 
/**************************************
* 页面同时投放几个硬广？
****************************************/