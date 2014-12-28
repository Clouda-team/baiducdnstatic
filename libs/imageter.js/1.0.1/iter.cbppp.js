 
 <!-- write value to adspaceWidth,adspaceHeight,adspaceFloorCode-->
//var adspaceWidth=300; 
//var adspaceHeight=250;
//var adspaceFloorCode="";

var jsloadert={
	getIFrameDOM:function(id){
		return parent.document.getElementById(id).contentDocument || parent.document.frames[id].document;
	},
	getIFrame:function(id){
		return parent.document.getElementById(id) || parent.document.frames[id];
	},
	loadjsextt:function(){ 
		var containerCrt = parent.document.getElementById("isxpcrt00");
		var containerCrt0 = parent.document.getElementById("isxpcrt01");  
		var containerContent = parent.document.getElementById("isx-contents-wrapper-p");
		if(containerCrt)
			containerCrt.style.display="none"; 
		if(containerCrt0)
			containerCrt0.style.display="block"; 
		if(window.parent.configp.creative.cb_code && window.parent.configp.creative.cb_code!='' &&
			window.parent.configp.creative.cb_show_monitor && window.parent.configp.creative.cb_show_monitor!=''){
			var ele;
			ele = parent.document.createElement('script');
			ele.src = window.parent.configp.creative.cb_show_monitor;
			ele.charset = "utf-8";
			ele.type = "text/javascript";
			parent.document.getElementsByTagName('head')[0].appendChild(ele);
		}
		var jsHtml='<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="padding:0;margin:0;border:0;background:transparent;" scroll="no">'
		           +'<div id=isxpcrt0>'+window.parent.configp.creative.cb_code+'</div>'+'<div id=test0></div></body></html>';
		var jsifm = jsloadert.getIFrame("isx-p-f2"); 
		if( jsifm.readyState && jsifm.readyState!="loaded" && jsifm.readyState!="complete" ){
			//alert("TESTINFO: iframe is loading... but something error");
			return ;
		}else{ 
				jsifm.onload = jsifm.onreadystatechange = null;
				var dc = jsloadert.getIFrameDOM("isx-p-f2") ;
				if(navigator.userAgent.indexOf("Firefox")>0 || navigator.userAgent.indexOf("Chrome")>0){ 
					dc.open();
					dc.write(jsHtml);
					dc.close();
				}else{
					dc.write(jsHtml);
				}
		} 
		
		window.parent.isxad.removeLogoEvents();

		return ;
	} 
};

