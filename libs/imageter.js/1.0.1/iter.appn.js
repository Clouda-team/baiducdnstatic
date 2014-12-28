
(function(window, undefined) {
	var isIE = !! window.ActiveXObject;
	var horizontalMargin = 0;
    var navigateType = 'notchrome';
	var document = window.document,
		navigator = window.navigator,
		location = window.location,
		imgs = [],
		readylist = [],
		imageApps = [],
		isFirst = true,
		sizeList = [250, 250, 200, 200],
		cssList = ["/css/imageter.app0.css","/css/imageter.app1.css","","/css/imageter.app3.css"],
		adMaxNum=0,
		screenWidth = document.body.clientWidth,
		screenHeight = document.body.clientHeight;
	var tabWidth = 23;
	var closeWidth = 10;
	var closeHeight = 10;
	var appUrl="";	
    var winLocPre = "";
    var winLocCur = "";
    var showAppSize = 0;
	var imgLocPre = "";
	var imgLocCur = "";
	var imgWidthHeightCur = "";
	var imgWidthHeightPre = "";
	var imgLocXYCur = "";
	var imgLocXYPre = "";
	var imgChangeTrue = "false";
	var urlChange = "false";
	var currentImageUrl = "";
	var timerIdImgUrl = null;
	var timerIdUrl = null; 
	var timerIdImgSize = null;
	var timerIdImgLoc = null;	
    /*****************************************************
	 *Config  click_monitor
	 ****************************************************/
	var config = {
		"app_style":1,
		"app_location":3, 
		"img_w":400,  
		"img_h":300, 
		"screen_w":1024, 
		"screen_h":768, 
		"bar_hide":false, 
		"isp":"",
		"app_ad":{ 
			"app_id":1, 
			"service":"http://localhost/actions/", 
			"first_display":true, 
			"adimg_max":3, 
			"Rw":250, 
			"Rh":250 
		},
		ads_handler : "s",
		news_handler : "x",
		record_handler : "x",
		timer: 2000,
		autoShowTimer:15000
	};
    var ImageApp = function(){
		this.appImg = 0;
		this.appData = {
			"img_id":"",
			"imgn":0,
			"tag_ads":[],
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
				"cookiemapping_url":""
			}
		};
		imgLocX  =  0;
		imgLocY  =  0;
		imgRightLocX  =  0;
		imgRightLocY  =  0;
		imgLeftBootomLocX  =  0;
		imgLeftBootomLocY  =  0;
		imgWidth = 0;
		imgHeight = 0;
		imgLeftWidth = 0;
		imgRightWidth = 0;
		tabLocX  =  0;
		tabLocY  =  0;
		appLocX  =  0;
		appLocY  =  0;
		closeLocX  =  0;
		closeLocY  =  0;
		currentImgUrl  =  0;
	};
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
		getEvent: function(event) {
			return event ? event : window.event;
		},
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		stopPropagation: function(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		getRelatedTarget: function(event) {
			if (event.relatedTarget) {
				return event.relatedTarget;
			} else if (event.type == "mouseover") {
				return event.fromElement;
			} else if (event.type == "mouseout") {
				return event.toElement;
			} else {
				return null;
			}
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
		},
	    getImageRealSize:function(obj){
			var x = 0,
				y = 0;
            var OriginImage=new Image();
			if(OriginImage.src!=obj.src)
				OriginImage.src=obj.src;
			x = OriginImage.width;
			y = OriginImage.height;
			return {
				w: x,
				h: y
			}

		},
		$: function(parentNode, tagName, className) {
			var parent = parentNode || document;
			if (document.getElementsByClassName) return parent.getElementsByClassName(className);
			var arr = [];
			var tag = tagName || '*';
			tag = tag.toUpperCase();
			var elements = parent.getElementsByTagName(tag);
			for (var l = elements.length, i = l; i--;) {
				var ele = elements[i];
				if (ele.className) {
					var cn = ele.className.replace(/\s/g, '|').split('|');
					for (var len = cn.length, j = len; j--;) {
						if (cn[j] == className) {
							arr.push(ele);
							break;
						}
					}
				}
			}
			return arr;
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
		importJsAsync:function( name) {
			var ele;
			ele = document.createElement('script');
			ele.src = name;
			ele.charset = "utf-8";
			ele.type = "text/javascript";
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(ele);
		},
		loadScript:function(url, callback){ 
			var script = document.createElement("script") 
			script.type = "text/javascript"; 
			script.charset = "utf-8";
			if (script.readyState){ //IE 
				script.onreadystatechange = function(){ 
					if (script.readyState == "loaded" || 
						script.readyState == "complete"){ 
						script.onreadystatechange = null; 
						callback(); 
					} 
				}; 
			} else { //Others: Firefox, Safari, Chrome, and Opera 
				script.onload = function(){ 
					callback(); 
				}; 
			} 
			script.src = url; 
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(script); 
		},
		isVisible: function(obj) {
			if (obj == document) return true;

			if (!obj) return false;
			if (!obj.parentNode) return false;
			if (obj.style) {
				if (obj.style.display == 'none') return false;
				if (obj.style.visibility == 'hidden') return false;
			}

			if (window.getComputedStyle) {
				var style = window.getComputedStyle(obj, "");
				if (style.display == 'none') return false;
				if (style.visibility == 'hidden') return false;
			}

			var style = obj.currentStyle;
			if (style) {
				if (style.display == 'none') return false;
				if (style.visibility == 'hidden') return false;
			}

			return ev.isVisible(obj.parentNode);
		}
	};
	var $ = function(id) {
		return document.getElementById(id);
	},
	each = function(arrs, handler) {
		if (arrs.length) {
			for (var i = 0, len = arrs.length; i < len; i++) {
				handler.call(arrs[i], i);
			}
		} else {
			handler.call(arrs, 0);
		}
	},
	hide = function(elem) {
		each(elem, function() {
			this.style.display = "none";
		});
	},
	show = function(elem) {
		each(elem, function() {
			this.style.display = "block";
		});
	};
    
    function testCallBack(){
		//alert('ddd');
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
	}
    function getAdsClickUrl(clickUrl){
		var checkRs = '';
		if(clickUrl.length>0){
			var idx11 = clickUrl.indexOf('&url=');
			var len11 = clickUrl.length;
			if(idx11>0)
				checkRs = clickUrl.substring(idx11+5,len11);
		} 
		return checkRs;
	}
	function getMonitorUrl(clickUrl){
		var checkRs = '';
		if(clickUrl.length>0){
			var idx11 = clickUrl.indexOf('&url=');
			if(idx11>0)
				checkRs = clickUrl.substring(0,idx11);
		} 
		return checkRs;
	}
	function sendReqMsg(urls){
		var tempUrls = urls+'';
		if(tempUrls.length==0){
			return ;
		}
		var strArr = new Array();
		strArr = tempUrls.split(";");
		for(i=0;i<strArr.length;i++){
			var tempUrl = strArr[i];
			if(tempUrl.length>0 && tempUrl.toLowerCase()!="http://"){
				ev.importFile('js',tempUrl);
			}
		}
	};
	
var jsloadera={
	getIFrameDOM:function(id){
		return document.getElementById(id).contentDocument || document.frames[id].document;
	},
	loadjsext:function(containert, jscodes, crtWidth,crtHeight){ 
		var jsins = document.createElement('div');
		jsins.id="isxpcrt00";
		var jsifm = document.createElement('iframe');
		jsifm.id='isx-a-f1';
		jsifm.scrolling="no";
		jsifm.width=crtWidth+"px";
		jsifm.height=crtHeight+"px";
		jsifm.frameBorder="0px";
		jsifm.marginWidth="0px";
		jsifm.marginHeight="0px";
		jsifm.style.cssText="border:0px;background:none repeat scroll 0% 0% transparent;margin:0px;padding:0px;top:0px;left:0px;"; 
		var jsHtml='<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="padding:0;margin:0;border:0;background:transparent;" scroll="no">'
		           +jscodes+'</body></html>';
		
		jsifm.onload = jsifm.onreadystatechange = function(){
			if( jsifm.readyState && jsifm.readyState!="loaded" && jsifm.readyState!="complete" ){ 
				return ;
			}else{ 
				jsifm.onload = jsifm.onreadystatechange = null;
				var dc = jsloader.getIFrameDOM("isx-a-f1") ;
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
		//jsloader.loadjsext1(containert,crtWidth,crtHeight);
	},
	loadjsext1:function(containert, jscodes, crtWidth,crtHeight){
		var jsins = document.createElement('ins');
		jsins.border="0px";
		jsins.style.cssText="display:inline; zoom:1;border:0px;margin:0px;padding:0px;position:relative;visibility:visible;width:"+crtWidth+"px; height:"+crtHeight+"px;";
		
		var jsifm = document.createElement('iframe');
		jsifm.scrolling="no";
		jsifm.width=crtWidth+"px";
		jsifm.height=crtHeight+"px";
		jsifm.frameBorder="0px";
		jsifm.marginWidth="0px";
		jsifm.marginHeight="0px";
		jsifm.style.cssText="border:0px;background:none repeat scroll 0% 0% transparent;margin:0px;padding:0px;position:absolute;top:0px;left:0px;";

		var jsHtml='<html style="text-align:center;"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="padding:0;margin:0;border:0;background:transparent;display:inline-block;" scroll="no">'+jscodes+'</body></html>';
		containert.appendChild(jsins);
		jsins.appendChild(jsifm);
		var testContw = jsifm.contentWindow;
		testContw.document.open();
		testContw.document.write(jsHtml);
		testContw.document.close();
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
			setTimeout(doScrollCheck, 1);
			return;
		}
		run();
	};

	/*****************************************************
	 *TimerTick
	 ****************************************************/
	var TimerTick = (function() {
		var timerId = null;
		return function(arr) {
			timerId = setInterval(function() {
				for (var i = 0; i < arr.length; i++) {
					arr[i] && arr[i].detect();
				}
			}, 500);
		};
	})();
	/*****************************************************
	 *cache object
	 ****************************************************/
	var currentApp;
	var cache = {
		adsArray: [],
		initData: function() {
			var images = document.getElementsByTagName('img');
			var imageNo = 0;
			imageApps = [];
			if (typeof config.app_ad.adimg_max == "number" && config.app_ad.adimg_max <= 0) {
				return;
			}
			for (var i = 0, len = images.length; i < len; i++) {
				var imgInit = images[i];
                if (imgInit.clientWidth >= config.img_w && imgInit.clientHeight >= config.img_h && adMaxNum>0) {
					//alert(img.src);
					//imgs[imageNo] = img;
					imgInit.insId = imageNo;
					imgInit.setAttribute("isx_img_id", imageNo);
					var imageAppTemp = new ImageApp();
                    imageApps[imageNo] = imageAppTemp;
                    imageAppTemp.appImg = imgInit;
                    var imageLoc = ev.getXY(imgInit);
                    imageAppTemp.imgLocX = imageLoc.x;
                    imageAppTemp.imgLocY = imageLoc.y;
					imageAppTemp.imgWidth = imgInit.offsetWidth;
					imageAppTemp.imageHeight = imgInit.clientHeight;
					imageAppTemp.currentImgUrl = encodeURIComponent(imgInit.src);
					imgLocCur = imgInit.src;
                    imgLocPre = imgLocCur+'';
					currentApp = imageAppTemp;
					cache.onImageLoad(imgInit);
					imageNo++;
					adMaxNum--;
				}	
				
			}
		},
		onImageLoad: function(imgLoad) {
			if (imgLoad.complete) { 
				cache.fetchAds(imgLoad);
			} else {
				imgLoad.onload = function() {
					var obj = this;
					obj.onload = null; 
					cache.fetchAds(imgLoad);
				}
			}
		},
		initChangeData: function() {
			var images = document.getElementsByTagName('img');
			var imageNo = 0;
			imageApps = [];
			if (typeof config.app_ad.adimg_max == "number" && config.app_ad.adimg_max <= 0) {
				return;
			}
			adMaxNum = config.app_ad.adimg_max;
			for (var i = 0, len = images.length; i < len; i++) {
				var imgChange = images[i];
                if (imgChange.clientWidth >= config.img_w && imgChange.clientHeight >= config.img_h && adMaxNum>0) {
					//alert(img.src);
					//imgs[imageNo] = img;
					imgChange.insId = imageNo;
					imgChange.setAttribute("isx_img_id", imageNo);
					imgLocCur = imgChange.src;
				    var imageLocTemp = ev.getXY(imgChange);

					//alert(imgLocCur);
					//alert(imgLocPre);
                    //var imgLocCurS = encodeURIComponent(imgLocCur);
                    //var imgLocPreS = encodeURIComponent(imgLocPre);
					//var	url = config.app_ad.service + config.ads_handler + "?tp=0" + "&imgLocCur=" + imgLocCur + "&imgLocPre="+imgLocPre;
					//ev.importFile('js', url);

					if(imgLocCur == imgLocPre){
						imgChangeTrue="false";
						break ;
					}else{ 
						//clearInterval(timerIdImgUrl);
						imgLocPre = imgLocCur+'';
						imgWidthHeightPre = imgChange.offsetWidth+'-'+imgChange.clientHeight;
						imgLocXYPre = imageLocTemp.x + '-' +imageLocTemp.y;
						imgChangeTrue="true";
						cache.onImageChangeLoad(imgChange,imageNo);
						//setTimeout(cache.onImageChangeLoad(imgChange,imageNo), 100); 
						imageNo++;
						adMaxNum--;
					} 
				}	
				
			}
			//alert(imageNo);
			//alert(adMaxNum);
			if(imageNo==0){
				imgLocCur = "";
				//imgLocPre = "";
			}
		},
		onImageChangeLoad: function(imgChangeLoad,imageNo) {
			/*var appname = navigator.appName.toLowerCase();
			if (appname.indexOf("netscape") == -1)
			{
				//ie
				imgChangeLoad.onreadystatechange = function () {
					if (imgChangeLoad.readyState == "complete")
					{						 
						var imageAppTemp = new ImageApp();
						imageAppTemp.appImg = imgChangeLoad;
						var imageLoc = ev.getXY(imgChangeLoad);
						imageAppTemp.imgLocX = imageLoc.x;
						imageAppTemp.imgLocY = imageLoc.y;
						imageAppTemp.imgWidth = imgChangeLoad.offsetWidth;
						imageAppTemp.imageHeight = imgChangeLoad.clientHeight;
						currentApp = imageAppTemp;
						imageApps[imageNo] = imageAppTemp;
						cache.fetchAds(imgChangeLoad);
					}
				};
			} else {
				//firefox
				imgChangeLoad.onload = function () {
					//if (imgChangeLoad.complete == true)
					//{
						var obj = this;
						obj.onload = null;
						var imageAppTemp = new ImageApp();
						imageAppTemp.appImg = imgChangeLoad;
						var imageLoc = ev.getXY(imgChangeLoad);
						imageAppTemp.imgLocX = imageLoc.x;
						imageAppTemp.imgLocY = imageLoc.y;
						imageAppTemp.imgWidth = imgChangeLoad.offsetWidth;
						imageAppTemp.imageHeight = imgChangeLoad.clientHeight;
						currentApp = imageAppTemp;
						imageApps[imageNo] = imageAppTemp;
						cache.fetchAds(imgChangeLoad);						 
					//}
				};
			}*/
			if (imgChangeLoad.complete) {
				var imageAppTemp = new ImageApp();
				imageAppTemp.appImg = imgChangeLoad;
				var imageLoc = ev.getXY(imgChangeLoad);
				imageAppTemp.imgLocX = imageLoc.x;
				imageAppTemp.imgLocY = imageLoc.y;
				imageAppTemp.imgWidth = imgChangeLoad.offsetWidth;
				imageAppTemp.imageHeight = imgChangeLoad.clientHeight;				
				imageAppTemp.currentImgUrl = encodeURIComponent(imgChangeLoad.src);
				currentApp = imageAppTemp;
				imageApps[imageNo] = imageAppTemp;
				//alert(imageLoc.x);
				//alert(imageLoc.y);
				//alert(img.offsetWidth);
				//alert(img.clientHeight);
				//alert(imageAppTemp.imgLocX);
				//alert(imageAppTemp.imgLocY);
				//alert(imageAppTemp.imgWidth);
				//alert(imageAppTemp.imageHeight);
				cache.fetchAds(imgChangeLoad);
				//setTimeout(cache.fetchAds(imgChangeLoad), 50); 
			} else {
				imgChangeLoad.onload = function() {
					var obj = this;
					obj.onload = null;
					var imageAppTemp = new ImageApp();
                    imageAppTemp.appImg = imgChangeLoad;
                    var imageLoc = ev.getXY(imgChangeLoad);
                    imageAppTemp.imgLocX = imageLoc.x;
                    imageAppTemp.imgLocY = imageLoc.y;
					imageAppTemp.imgWidth = imgChangeLoad.offsetWidth;
					imageAppTemp.imageHeight = imgChangeLoad.clientHeight;			
				    imageAppTemp.currentImgUrl = encodeURIComponent(imgChangeLoad.src);
					currentApp = imageAppTemp;
                    imageApps[imageNo] = imageAppTemp;
					cache.fetchAds(imgChangeLoad);
				}
			}
		},
		fetchAds: function(imgAds) {
			var iu = encodeURIComponent(imgAds.src),
				tlu = encodeURIComponent(document.title);	
			//currentImageUrl = iu+'';
			var testSize = ev.getImageRealSize(imgAds);
            //var	url1 = config.app_ad.service + config.ads_handler + "?tp=31&width:"+testSize.w+"&height="+testSize.h;
			//ev.importFile('js', url1);
			//var	url = config.app_ad.service + config.ads_handler + "?tp=3" + "&isp=" + config.isp + "&of=1" + "&img=" + iu + "&imgn=" + imgAds.insId + "&img_w=" + imgAds.offsetWidth + "&img_h=" + imgAds.clientHeight + "&tl=" + tlu + "&cbk=hj";
			var	url = config.app_ad.service + config.ads_handler + "?tp=3" + "&isp=" + config.isp + "&of=1" + "&img=" + iu + "&imgn=" + imgAds.insId + "&img_w=" + testSize.w + "&img_h=" + testSize.h + "&tl=" + tlu + "&cbk=hj";
			ev.importFile('js', url);
		}
	};
    
    window['hj'] = function(data) {

			var index = data.imgn;
			var imageAppTemp = imageApps[index];
			var	img = null;
			try{
				img = imageAppTemp.appImg;
			}catch(err){
				imageApps = [];
				return ;
			}
			img.setAttribute('isx_data_ready', true);
			img.img_id = data.img_id;
			var iudd = encodeURIComponent(img.src);
			var	urlddd = imageAppTemp.currentImgUrl;
				//config.app_ad.service + config.ads_handler + "?tp=31" + "&iuimg=" + iudd+"&iuimg0=" + currentImageUrl;
			//ev.importFile('js', urlddd);
            if(iudd!=urlddd){
				return ;
			}
			if (data && typeof data == "object") {
				var tesmpUrl = (data.creative.material+"").toLowerCase();
				if(tesmpUrl.indexOf("http://null.jpg")>=0){ 
					return ;
				} 
                imageAppTemp.appData.img_id = data.img_id;
                imageAppTemp.appData.imgn = data.imgn;
                imageAppTemp.appData.tag_ads = data.tag_ads;
                imageAppTemp.appData.creative.type = data.creative.type;
                imageAppTemp.appData.creative.w = data.creative.w;
                imageAppTemp.appData.creative.h = data.creative.h;
				if(data.creative.code)
					imageAppTemp.appData.creative.code = data.creative.code;
				if(data.creative.material)
					imageAppTemp.appData.creative.material = data.creative.material;
				if(data.creative.click)
					imageAppTemp.appData.creative.click = data.creative.click;
				if(data.creative.third_show_url){
					imageAppTemp.appData.creative.third_show_url = data.creative.third_show_url;
					//var tempClick0 = imageAppTemp.appData.creative.third_show_url +'';
					//if(tempClick0.length>0 && tempClick0.toLowerCase()!="http://"){
					//	ev.importFile('js',tempClick0);
					//} 
					sendReqMsg(imageAppTemp.appData.creative.third_show_url);
				}
				if(data.creative.third_click_url)
					imageAppTemp.appData.creative.third_click_url = data.creative.third_click_url;
				if(data.creative.cookiemapping_url){
					imageAppTemp.appData.creative.cookiemapping_url = data.creative.cookiemapping_url;					
					sendReqMsg(imageAppTemp.appData.creative.cookiemapping_url);
					//var tempClick0 = imageAppTemp.appData.creative.cookiemapping_url +'';
					//if(tempClick0.length>0 && tempClick0.toLowerCase()!="http://"){
						//ev.importFile('js',tempClick0);
					//}
				}
				var imageLoc = ev.getXY(img);
				imageAppTemp.imgLocX = imageLoc.x;
				imageAppTemp.imgLocY = imageLoc.y;
				//alert(imageAppTemp.imgLocX);
				//alert(imageAppTemp.imgLocY);
				//alert(img.offsetWidth);
				//alert(img.clientHeight);
				if (config.app_location == 0) {
					imageAppTemp.tabLocX = imageAppTemp.imgLocX-tabWidth;
					imageAppTemp.tabLocY = imageAppTemp.imgLocY;
					imageAppTemp.appLocX = imageAppTemp.tabLocX-imageAppTemp.appData.creative.w;   //config.app_ad.Rw config.app_ad.Rh 
					//imageAppTemp.appLocX = imageAppTemp.tabLocX-config.app_ad.Rw;
					imageAppTemp.appLocY = imageAppTemp.imgLocY;
					imageAppTemp.closeLocX = imageAppTemp.appLocX+3;
					imageAppTemp.closeLocY = imageAppTemp.appLocY+imageAppTemp.appData.creative.h-closeHeight-3;
					//imageAppTemp.closeLocY = imageAppTemp.appLocY+config.app_ad.Rh-closeHeight-3;
				}
				if (config.app_location == 1) {
					imageAppTemp.tabLocX = imageAppTemp.imgLocX + img.offsetWidth;
					imageAppTemp.tabLocY = imageAppTemp.imgLocY;
					imageAppTemp.appLocX = imageAppTemp.tabLocX + tabWidth;
					imageAppTemp.appLocY = imageAppTemp.imgLocY ;
					imageAppTemp.closeLocX = imageAppTemp.appLocX + imageAppTemp.appData.creative.w -closeWidth- 3;
					imageAppTemp.closeLocY = imageAppTemp.appLocY+imageAppTemp.appData.creative.h-closeHeight-3;
					//imageAppTemp.closeLocX = imageAppTemp.appLocX + config.app_ad.Rw -closeWidth- 3;
					//imageAppTemp.closeLocY = imageAppTemp.appLocY+ config.app_ad.Rh -closeHeight-3;
				}
				if (config.app_location == 2) {
					//to do
				}
				if (config.app_location == 3) {
					var tabLocX1 = imageAppTemp.imgLocX;
					var tabLocY2 = imageAppTemp.imgLocY + img.clientHeight;
					imageAppTemp.appLocX = imageAppTemp.imgLocX;
					imageAppTemp.appLocY = tabLocY2 - imageAppTemp.appData.creative.h;				

				    imageAppTemp.tabLocX = imageAppTemp.appLocX + img.offsetWidth  -33;
				    imageAppTemp.tabLocY = imageAppTemp.appLocY +imageAppTemp.appData.creative.h-33;

					//imageAppTemp.appLocY = imageAppTemp.tabLocY - config.app_ad.Rh;
					imageAppTemp.closeLocX = imageAppTemp.appLocX + img.offsetWidth  -closeWidth- 3;
					imageAppTemp.closeLocY = imageAppTemp.appLocY + 1;
					//imageAppTemp.closeLocY = imageAppTemp.appLocY + config.app_ad.Rh -closeHeight-3;
				}
				var ad = new ISXAd(imageAppTemp);
				cache.adsArray[index] = ad;
		    } 
	};

    /***************************************
	 *isx app
	 ****************************************/
    var isxApp = {
		init: function() {
			for(i in imageApps){
				imageAppTemp = imageApps[i];

			    ISXAd.init(imageAppTemp);
			}
		}
	};
    /*****************************************************
	 *class ISXAd
	 ****************************************************/
	var ISXAd = function(imageAppTemp) {
		this.container = isx.container;
		this.imageAppTemp = imageAppTemp;	
		this.img = imageAppTemp.appImg;		
		this.adWrapper = null;
		this.tabs = null;
		this.contents = null;
		this.ads = null;
		this.closes = null;
		this.timerId = null;
		this.init(imageAppTemp);
	};

	ISXAd.prototype = {
		constructor: ISXAd,
		init: function(imageAppTemp) {
			var _this = this;
            _this.createApps(imageAppTemp);
			_this.bindEvents();
        },
		createApps:function(imageAppTemp){
			var _this = this;
			var test = 0;
			var adWrapper = document.createElement("div");
			var tabWrapper = document.createElement("div");
			var contentWrapper = document.createElement("div");
			var closeWrapper = document.createElement("div");
			var imgApps  = imageAppTemp.appImg;
			adWrapper.className = "isx-ad-wrapper";            
			tabWrapper.className = "isx-tabs-wrapper";
			contentWrapper.className = "isx-contents-wrapper"; 
			closeWrapper.className = "isx-close-wrapper";
			isx.container.appendChild(adWrapper);
			adWrapper.appendChild(tabWrapper);
			adWrapper.appendChild(contentWrapper);
			adWrapper.appendChild(closeWrapper);
            
			//if add tag,must modify this todo
			var resTemp = _this.adApp(imageAppTemp,contentWrapper);
			tabWrapper.appendChild(resTemp.tabs);
			//contentWrapper.appendChild(resTemp.contents);
			closeHtml = '<a title="关闭" href="javascript:;" class="isx-close">&nbsp;&nbsp;&nbsp;</a>';
			closeWrapper.innerHTML = closeHtml;
			//closeWrapper.appendChild(resTemp.closes);	

            tabWrapper.style.top = imageAppTemp.tabLocY + "px";
			tabWrapper.style.left = imageAppTemp.tabLocX + "px";
			contentWrapper.style.top = imageAppTemp.appLocY + "px";
			contentWrapper.style.left = imageAppTemp.appLocX + "px";
			closeWrapper.style.top = imageAppTemp.closeLocY + "px";
			closeWrapper.style.left = imageAppTemp.closeLocX + "px";
			if (config.app_location == 3) {
			    contentWrapper.style.width = (imgApps.offsetWidth) + "px";
				contentWrapper.style.height = imageAppTemp.appData.creative.h + "px";
			}
			else{
			    contentWrapper.style.width = (imageAppTemp.appData.creative.w+0) + "px";
				contentWrapper.style.height = (imageAppTemp.appData.creative.h+0) + "px";
			}
			if(config.app_location == 3) { 
				contentWrapper.style.border = "0px solid #BBB";
			}else{
				contentWrapper.style.border = "2px solid #BBB";
			}
            //import css
			
			if (config.app_location == 0) {
				ev.importFile('css', appUrl+cssList[0]);
			}
			if (config.app_location == 1) {
				ev.importFile('css', appUrl+cssList[1]);
			}
			if (config.app_location == 2) {
				ev.importFile('css', appUrl+cssList[2]);
			}
			if (config.app_location == 3) { 
				ev.importFile('css', appUrl+cssList[3]);
				//tabWrapper.style.cssText="position: absolute;z-index:2147483501;";
				//contentWrapper.style.cssText="position: absolute;z-index:2147483500;";
				//closeWrapper.style.cssText="position: absolute;z-index:2147483501;";
			}

			
			_this.adWrapper = adWrapper;
			_this.tabs = tabWrapper;
			_this.contents = contentWrapper;
			_this.ads = resTemp.contents;
			_this.closes = closeWrapper;

			
			//show or not
			if(config.app_ad.first_display==false){
				_this.contents.style.border = "0px";
				hide(_this.contents.children);
				hide(_this.closes);
			}else{
				//hidden app after times
				 setTimeout(function() {
					_this.closeApp()
				}, config.autoShowTimer);
			}
		},
		adApp: function(obj,contentWrapper) {
			var _this = this;
            var tabs,contents,closes;
            var tabHtml = "",contentHtml = "",closeHtml = "";
			var creative;
            creative = obj.appData.creative;
            //tab
			tabs = document.createElement("div");
			
			if (config.app_location == 3) {	
				
				//tabHtml = '<a class="isx-ad focus" href="javascript:;"><table width="80px"><tr><td style="width:17px;"><span></span></td><td style="" nowrap><em>热力呈现</em></td></tr></table></a>';
				tabHtml = '<div class="isx-ad focus"><img src="'+appUrl+'/images/isx-logo.png"></div>';
			}else{
				tabHtml = '<a class="isx-ad focus" href="javascript:;"><span></span>';
				tabHtml += '<em>热力呈现</em></a>';
			}
			//<table width="80px"><tr><td style="width:17px;"><span></span></td>';
			//		            tabHtml += '<td style="" nowrap><em>热力呈现</em></td></tr></table>
			tabs.innerHTML =  tabHtml;
			tabs.className = "isx-tab";
            //app
			contents = document.createElement("div");
			contentWrapper.appendChild(contents);
			redUrl = ""; 
			var checkAddDiv="N";
			if (creative.type == 0) { // image
				redUrl = (creative.click || '');
			    var checkRedUrl0 = getAdsClickUrl(redUrl);  //checkClickUrl(redUrl);
				if(checkRedUrl0.length>0){
					contentHtml += "<a class='large-image' target='_blank' href='" + checkRedUrl0 +"'><img src='" + creative.material + "' alt=''  width='" + creative.w + "' height='" + creative.h+ "' border='0px'/></a>";
			    }
				else{
					contentHtml += "<img src='" + creative.material + "' alt=''  width='" + creative.w + "' height='" + creative.h+ "' border='0px'/>";
				}
				contents.innerHTML =  contentHtml;
			} else if (creative.type == 1) { // text
				//TODO:
			} else if (creative.type == 2) { // flash				
					redUrl = (creative.click || '');
					var checkRedUrl0 = getAdsClickUrl(redUrl);  //checkClickUrl(redUrl);
					if(checkRedUrl0.length>0){
						if (config.app_location == 3){ 
							 checkAddDiv="Y";
							 contentHtml += '<div style="background-color: #F1F3F5;filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9;text-align:center;position:absolute;z-index:2;width:'+obj.appImg.offsetWidth+'px;height:'+creative.h+'px;">';	
						}else{
							 contentHtml += '<div style="background-color: #F1F3F5;filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9;position:absolute;z-index:2;width:'+creative.w+'px;height:'+creative.h+'px;">';	
						}
					}
					contentHtml += '<object id="afg-adloader" width="' + creative.w + '" height="' + creative.h + '"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
					contentHtml += '<param value="always" name="allowScriptAccess"/><param value="' + creative.material + '" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality">';
					contentHtml += '<embed width="' + creative.w + '" height="' + creative.h + '" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque" quality="high" src="' + creative.material + '"></object>';
					
					if(checkRedUrl0.length>0){
						contentHtml += '</div>';
						//contentHtml += '<a class="flash-cover" href="' + checkRedUrl0 + '" target="_blank">';
						//contentHtml += '</a>';
						if (config.app_location == 3){
							contentHtml += "<a href='"+checkRedUrl0+"' target='_blank' style='display:block;width:"+obj.appImg.offsetWidth+"px;height:"+creative.h+"px;position:absolute;z-index:999;background:#000;filter:alpha(opacity=0);-moz-opacity:0;opacity: 0'></a>";
						}else{
							
							contentHtml += "<a href='"+checkRedUrl0+"' target='_blank' style='display:block;width:"+creative.w+"px;height:"+creative.h+"px;position:absolute;z-index:999;background:#000;filter:alpha(opacity=0);-moz-opacity:0;opacity: 0'></a>";
						}
					}
					contents.innerHTML =  contentHtml;
			} else if (creative.type == 3) { // video
				//TODO:
			} else if (creative.type == 4) { // js, nonrtb			
				if(creative.code.toLowerCase().indexOf('http://')==0){	
					var frame = '<iframe src="' + creative.code + '" scrolling="no" height="' + creative.h + '" width="' + creative.w + '" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
					contentHtml += frame;
					contents.innerHTML =  contentHtml;
				}else{ 
					jsloadera.loadjsext(contents,creative.code,creative.w,creative.h); 
				}
			} 		
			contents.className = "isx-ad";
			if( checkAddDiv=="Y"){
				contents.style.textAlign = "left";
			}
            //contents.style.width = creative.w + 'px';
            //contents.style.height = creative.h + 'px';
			
			//close			
			//closes = document.createElement("div");
            //closeHtml = '<a title="关闭" href="javascript:;" class="isx-close">×关闭</a>';		
			//closes.innerHTML =  closeHtml;
            
			return {
				tabs: tabs,
				contents: contents,
				closes: closes
			};
		},
		createTab:function(type, text, flag) {
			var _this = this;
			var tab = document.createElement("li");
			tab.className = "clearfix tab";
			tab.className += flag ? " " + flag : "";
			tab.innerHTML = "<a class='" + type + "' href='javascript:;'><span></span><em>" + text + "</em></a>";
			return tab;
		},
		bindEvents: function() {
			var _this = this,
				list = _this.tabs.children,
				contents = _this.contents.children,
                closes = _this.closes,
				imgs = _this.img;
			_this.bindImgEvents(_this.img); 
			_this.bindTagsEvents();
			_this.bindContentsEvents();
			_this.bindClosesEvents();
			_this.bindTabListEvents();
			_this.bindAdsEvents();
		},
		bindAdsEvents:function(){
			var _this = this;
			var list = _this.ads.children;
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
		bindImgEvents: function(img) {
			var _this = this;
			ev.bind(img, 'mouseover', function() {
				clearTimeout(_this.timerId);
				_this.showApp();
				_this.recordShow(10);
			});
			ev.bind(img, 'mouseout', function() {
				_this.timerId = setTimeout(function() {
					_this.closeApp()
				}, config.timer);
			});
			ev.bind(img, 'onchange', function() {
				//alert('resize');
				_this.locate();
			});
		},
		bindTagsEvents: function() {
			var _this = this;			
			ev.bind(_this.tabs, 'mouseover', function() {
				clearTimeout(_this.timerId);
			});
			ev.bind(_this.tabs, 'mouseout', function() {
				_this.timerId = setTimeout(function() {
					_this.closeApp()
				}, config.timer);
			});
		},
		bindContentsEvents: function() {
			var _this = this;			
			ev.bind(_this.contents, 'mouseover', function() {
				clearTimeout(_this.timerId);
			});
			ev.bind(_this.contents, 'mouseout', function() {
				_this.timerId = setTimeout(function() {
					_this.closeApp()
				}, config.timer);
			});
		},
		bindClosesEvents: function() {
			var _this = this;			
			ev.bind(_this.closes, 'mouseover', function() {
				clearTimeout(_this.timerId);
			});
			ev.bind(_this.closes, 'mouseout', function() {
				_this.timerId = setTimeout(function() {
					_this.closeApp()
				}, config.timer);
			});
			ev.bind(_this.closes, 'click', function() {
				_this.closeApp();
			});
		},
		bindTabListEvents: function() {
			var _this = this;
			var list = _this.tabs.children;
			for (var i = 0, len = list.length; i < len; i++) {
				var tab = list[i];
				tab.onmouseover = function() {
				    clearTimeout(_this.timerId);
					if (this.className.match(" focus")) {
						return;
					}
					var type = this.lastChild.className;
					_this.showApp(this);
					if (type.match("ad") || type.match("shop")) {
						_this.recordShow(9);
					}

				};
			}
		},
		hideApps: function() {
			
			var _this = this;
			var list = _this.tabs.children;
			//find focus tab
			for (var j = list.length; j--;) {
				if (list[j].className.match("focus")) {
					list[j].className = list[j].className.replace(" focus", "");
				}
			}
			_this.contents.style.border = "0px";
			hide(_this.contents.children);
			hide(_this.closes);
		},
		closeApp: function() {
			this.hideApps();
		},
		showApp: function(tab) {
			var _this = this,
				list = _this.tabs.children,
				type, app, width;
			if (!tab) {
				tab = list[0];
				
			}
			type = 'ad';
			var tabType = tab.lastChild.className;
			if(tabType.length>0){
				var indx = tabType.indexOf(' ');
				if(indx<0){
					type = tabType.substring(0,tabType.length);
				}else{
					type = tabType.substring(0,indx);
				}
			}
			_this.hideApps();
			tab.className += " focus";
			if(config.app_location != 3){
			_this.contents.style.border = "2px solid #BBB";
		    }
			var tempDiv = ev.$(_this.contents, 'div', type);
            show(tempDiv);
			show(_this.closes);
		},
		// mouseover image, recorded
		recordShow: function(flag) {

			var _this = this,
				img = _this.img,
				ul = config.app_ad.service + config.record_handler;
			ul += "?tp=4&isp=" + config.isp + "&img_id=" + img.img_id;
			ev.importFile('js', ul);
		},
		sendAdsClickMsg:function(){
			var _this = this;
			var tempClick = _this.imageAppTemp.appData.creative.click +'';
			var testUrl = getMonitorUrl(tempClick);
			if(testUrl.length>0){
				ev.importFile('js',testUrl);
				//ev.importJsAsync(testUrl);
				//testUrl = '';
				//ev.loadScript(testUrl,testCallBack);
			}
			var tempClick0 = _this.imageAppTemp.appData.creative.third_click_url +'';
			if(tempClick0.length>0 && tempClick0.toLowerCase()!="http://"){
				//ev.importFile('js',tempClick0);
				sendReqMsg(tempClick0);
			}
		},
		locate: function() {
             
			var _this = this,
				imageAppTemp = _this.imageAppTemp,
				img = imageAppTemp.appImg;
			 

            var imageLoc = ev.getXY(img);
			imageAppTemp.imgLocX = imageLoc.x;
			imageAppTemp.imgLocY = imageLoc.y;
			imageAppTemp.imgWidth = img.clientWidth;
			imageAppTemp.imageHeight = img.clientHeight;

			
			var adWrapperTemp = _this.adWrapper;
			var tabWrapperTemp = _this.tabs;
			var contentWrapperTemp = _this.contents;
			var closeWrapperTemp = _this.closes;
 
			if (config.app_location == 0) {
				imageAppTemp.tabLocX = imageAppTemp.imgLocX-tabWidth;
				imageAppTemp.tabLocY = imageAppTemp.imgLocY;
				imageAppTemp.appLocX = imageAppTemp.tabLocX-imageAppTemp.appData.creative.w;
				imageAppTemp.appLocY = imageAppTemp.imgLocY;
				imageAppTemp.closeLocX = imageAppTemp.appLocX+3;
				imageAppTemp.closeLocY = imageAppTemp.appLocY+imageAppTemp.appData.creative.h-closeHeight-3;
			}
			if (config.app_location == 1) {
				imageAppTemp.tabLocX = imageAppTemp.imgLocX + img.offsetWidth;
				imageAppTemp.tabLocY = imageAppTemp.imgLocY;
				imageAppTemp.appLocX = imageAppTemp.tabLocX + tabWidth;
				imageAppTemp.appLocY = imageAppTemp.imgLocY ;
				imageAppTemp.closeLocX = imageAppTemp.appLocX + imageAppTemp.appData.creative.w -closeWidth- 3;
				imageAppTemp.closeLocY = imageAppTemp.appLocY+imageAppTemp.appData.creative.h-closeHeight-3;
			}
			if (config.app_location == 2) {
				//to doif (config.app_location == 3) {
			    //contentWrapper.style.width = (imgApps.offsetWidth) + "px";
			} 
			if (config.app_location == 3) {
				/*
				imageAppTemp.tabLocX = imageAppTemp.imgLocX;
				imageAppTemp.tabLocY = imageAppTemp.imgLocY + img.clientHeight;
				contentWrapperTemp.style.width = (img.offsetWidth) + "px";
				imageAppTemp.appLocX = imageAppTemp.imgLocX;
				imageAppTemp.appLocY = imageAppTemp.tabLocY - imageAppTemp.appData.creative.h;
				imageAppTemp.closeLocX = imageAppTemp.appLocX + img.offsetWidth  -closeWidth- 3;
				imageAppTemp.closeLocY = imageAppTemp.appLocY +imageAppTemp.appData.creative.h-closeHeight-3;
				*/
				
					var tabLocX1 = imageAppTemp.imgLocX;
					var tabLocY2 = imageAppTemp.imgLocY + img.clientHeight;
					imageAppTemp.appLocX = imageAppTemp.imgLocX;
					imageAppTemp.appLocY = tabLocY2 - imageAppTemp.appData.creative.h;		
					contentWrapperTemp.style.width = (img.offsetWidth) + "px";		

				    imageAppTemp.tabLocX = imageAppTemp.appLocX + img.offsetWidth  -33;
				    imageAppTemp.tabLocY = imageAppTemp.appLocY +imageAppTemp.appData.creative.h-33;

					//imageAppTemp.appLocY = imageAppTemp.tabLocY - config.app_ad.Rh;
					imageAppTemp.closeLocX = imageAppTemp.appLocX + img.offsetWidth  -closeWidth- 3;
					imageAppTemp.closeLocY = imageAppTemp.appLocY + 1;
			} 

			tabWrapperTemp.style.top = imageAppTemp.tabLocY + "px";
			tabWrapperTemp.style.left = imageAppTemp.tabLocX + "px";
			contentWrapperTemp.style.top = imageAppTemp.appLocY + "px";
			contentWrapperTemp.style.left = imageAppTemp.appLocX + "px";
			closeWrapperTemp.style.top = imageAppTemp.closeLocY + "px";
			closeWrapperTemp.style.left = imageAppTemp.closeLocX + "px";      
				 
		}
	}
    
    
	ISXAd.reLocate = function() {

		var adsArray = cache.adsArray;

		for (i in adsArray) {

			var adObj = adsArray[i];
			adObj.locate && adObj.locate();
            //alert('reload');
		}
	};
	/***************************************
	 *isx object
	 ****************************************/
	var isx = {
		init: function() {
			if(typeof config.isp == "undefined") return;
			isx.createContainer();
		},
		createContainer: function() {
			if(document.getElementById("isx-plugin-container")){
				document.body.removeChild(document.getElementById("isx-plugin-container"));
			}
			var container = document.createElement('div');
			container.id = "isx-plugin-container";
			isx.container = container;
			document.body.children && document.body.insertBefore(container, document.body.lastChild.nextSibling);
			//document.body.insertBefore(container, document.body.lastChild);
		}
	};
    
	/*****************************************************
	 *Mix config
	 ****************************************************/
	 /*20140626
	var mixConfig = function(c) {
		if (c && typeof c == "object") {
			for (var i in c) {
				config[i] = c[i];
			}
			var actionUrl = config.app_ad.service.toLowerCase();
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
    */
	/*****************************************************
	 *init function
	 ****************************************************/
	 /*20140626
	function init() {
		if (typeof isx_config != "undefined") {
			mixConfig(isx_config);
			adMaxNum = config.app_ad.adimg_max;
		}else{
			return ;
		}
   
	};
    */
	function imgAllInit(){     
		isx.init();        
		if (true)
		{
			cache.initData();			
			ev.bind(window, 'resize', function() {
				ISXAd.reLocate();
			});
		}
	};
	
    function onImageLocXYChange(){
		if(imageApps.length>0){
			var imageAppTemp = imageApps[0];
			var imgCheck = imageAppTemp.appImg;
            var imageLoc = ev.getXY(img);
			imgLocXYCur = imageLoc.x+'-'+imageLoc.y;
			if( imgLocXYCur!=imgLocXYPre){ 
				imgLocXYPre = imgLocXYCur+'';
				//imageAppTemp.appData.creative.w
				
				//imageAppTemp.appData.creative.hvar	
				//var testurl = config.app_ad.service + config.ads_handler + "?tp=131&imgLocXYCur="+imgLocXYCur+"&imgLocXYPre="+imgLocXYPre;
				// ev.importFile('js', testurl);
				ISXAd.reLocate();
				clearInterval(timerIdImgLoc);

			}
		}
	};
    function onImageSizeChange(){
		if(imageApps.length>0){
			var imageAppTemp = imageApps[0];
			var imgCheck = imageAppTemp.appImg; 
			imgWidthHeightCur = imgCheck.offsetWidth+'-'+imgCheck.clientHeight; 
			if(imgWidthHeightCur != imgWidthHeightPre){
				imgWidthHeightPre = imgWidthHeightCur+''; 
				//imageAppTemp.appData.creative.w
				
				//imageAppTemp.appData.creative.hvar	
				//var testurl = config.app_ad.service + config.ads_handler + "?tp=121&curSize="+imgWidthHeightCur+"&preSize="+imgWidthHeightPre;
				// ev.importFile('js', testurl);
				ISXAd.reLocate();
				clearInterval(timerIdImgSize);
				
				//timerIdImgLoc = setInterval(function() {
				//  onImageLocXYChange()
				//}, 50);
			}
		}
	};
    var imgChangeInitTimes = 0;
    function imgChangeInit(){     
		isx.init();        
		if (true)
		{
			//timerIdImgUrl = = setInterval(function() {
			//	  cache.initChangeData()
			//	}, 50);	
			imgChangeInitTimes++;
			cache.initChangeData();	
			if(imgChangeInitTimes>40){
				clearInterval(timerIdImgUrl);
				imgChangeInitTimes = 0;
			}
			if(imgChangeTrue=='true'){
				clearInterval(timerIdImgUrl);
				ev.bind(window, 'resize', function() {
					ISXAd.reLocate();
				});
			}
		}
	};
	function clearApp(){
		//container.id = "isx-plugin-container";
			//alert('remove');
        if(document.getElementById("isx-plugin-container")){
            document.body.removeChild(document.getElementById("isx-plugin-container"));
		}
	}; 
	function clearApps(){
		//container.id = "isx-plugin-container";
        if(document.getElementById("isx-plugin-container")){
            document.getElementById("isx-plugin-container").removeChild(document.getElementById("isx-plugin-container").children);
		}
	}; 
	function winonload(){
				imgAllInit();
				/*
		var oldLoad = window.onload;
		if(typeof window.onload!='function'){
			window.onload = function(){ 
				imgInit();
			}
		}else{
			window.onload = function(){
				oldLoad();
				imgInit();
			}
		}*/
	}		
	function reloadAdNew(){	 
		isx.init();
		cache.initData();
		ev.bind(window, 'resize', function() {
						ISXAd.reLocate();
					});
		/*for(var ii=0; ii<60;
		ii++){
			setTimeout(function() {
				cache.initData();
			}, 50);
			if(imgChange=="true"){      
				if (true)
				{					
					ev.bind(window, 'resize', function() {
						ISXAd.reLocate();
					});
				}
			}		
		}*/
	}
	var imgChangeUrlTimes = 0;
	function checkUrlChange(){	 
			winLocCur = window.location.hash;  
			
			if(imgChangeUrlTimes>40){
				clearInterval(timerIdUrl);
				imgChangeInitTimes = 0;
			}
			if(winLocCur!=winLocPre){  
				urlChange='true';
				winLocPre = winLocCur+'';
				urlChange='true';
				clearInterval(timerIdUrl);
                clearApp(); 
				clearInterval(timerIdImgUrl);
				imgChangeInitTimes = 0;
					timerIdImgUrl = setInterval(function() {
					  imgChangeInit()
					}, 50); 
				//imgChangeInit();
				timerIdImgSize = setInterval(function() {
				  onImageSizeChange()
				}, 50);
                
				  
			} else{
				urlChange='false';
				//document.write("url change false");
			}
	}
	/*****************************************************
	 * document ready
	 ****************************************************/
	window['isx_config_i'] = function(data) {		
		if (data && typeof data == "object") {			
		  if(data.app_style)
			config.app_style=data.app_style;	 
		  config.app_location=data.app_location;		
		  if(data.img_w)
			config.img_w=data.img_w;			
		  if(data.img_h)
			config.app_style=data.img_h;			
		  if(data.screen_w)
			config.screen_w=data.screen_w;			
		  if(data.screen_h)
			config.screen_h=data.screen_h;			
		  if(data.bar_hide)
			config.bar_hide=data.bar_hide;			
		  if(data.isp)
			config.isp=data.isp;		
		  if(data.app_ad && typeof data.app_ad == "object") {	
			  if(data.app_ad.app_id)
				config.app_ad.app_id=data.app_ad.app_id;		
			  if(data.app_ad.service)
				config.app_ad.service=data.app_ad.service;	
			  if(data.app_ad.first_display)
				config.app_ad.first_display=data.app_ad.first_display;	
			  if(data.app_ad.adimg_max)
				config.app_ad.adimg_max=data.app_ad.adimg_max;	
			  if(data.app_ad.Rw)
				config.app_ad.Rw=data.app_ad.Rw;		
			  if(data.app_ad.Rh)
				config.app_ad.Rh=data.app_ad.Rh;		
		  }
		  
			var actionUrl = config.app_ad.service.toLowerCase();
			var idx = actionUrl.indexOf("/actions");
			if(idx>=0){
				appUrl = actionUrl.substring(0,idx);
			}else{
				appUrl = actionUrl;
			}
			adMaxNum = config.app_ad.adimg_max;
			checkDomReady();
		}
		 
	}

	function checkDomReady(){
	 
		document.DomReady = function(fn) {

			if (document.readyState == "complete") {
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

		document.DomReady(function() {
			urlChange = "false";
			imgChange = "false";
			//init();
			showAppSize = config.app_ad.adimg_max;
			winonload();
			winLocCur = window.location.hash;
			if(winLocPre==""){
				winLocPre = winLocCur+'';
			} 
			if(imgLocPre==""){
				imgLocPre = imgLocCur + '';
			}
			ev.bind(document, 'click', function() {	
				//checkUrlChange();
				   
					clearInterval(timerIdUrl);
					imgChangeUrlTimes = 0;
				   timerIdUrl = setInterval(function() {
						checkUrlChange()
					}, 50);
					//clearInterval(timerIdUrl);
				/*for(var ii=0;ii<10;ii++){
				   timerIdUrl = setInterval(function() {
						checkUrlChange()
					}, 50); 
					//alert(urlChange);
					if(urlChange=='true'){
						alert('change');
						clearInterval(timerIdUrl);
						alert('change');
						clearApp();
						break ;
					} 				
				}
				setTimeout(function() {
						reloadAdNew()
					}, 500);
				winLocCur = window.location;
				if(winLocCur!=winLocPre){
					clearApp();
					config.app_ad.adimg_max = showAppSize;
					adMaxNum = showAppSize;
					setTimeout(function() {
						imgInit()
					}, 500);				
					winLocPre = winLocCur+'';
				}*/
			});
		}); 

	 }
})(window); 