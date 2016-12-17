//>>built
define("dojox/gfx/_base",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/Color","dojo/_base/sniff","dojo/_base/window","dojo/_base/array","dojo/dom","dojo/dom-construct","dojo/dom-geometry"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){
var g=_2.getObject("dojox.gfx",true),b=g._base={};
g._hasClass=function(_a,_b){
var _c=_a.getAttribute("className");
return _c&&(" "+_c+" ").indexOf(" "+_b+" ")>=0;
};
g._addClass=function(_d,_e){
var _f=_d.getAttribute("className")||"";
if(!_f||(" "+_f+" ").indexOf(" "+_e+" ")<0){
_d.setAttribute("className",_f+(_f?" ":"")+_e);
}
};
g._removeClass=function(_10,_11){
var cls=_10.getAttribute("className");
if(cls){
_10.setAttribute("className",cls.replace(new RegExp("(^|\\s+)"+_11+"(\\s+|$)"),"$1$2"));
}
};
b._getFontMeasurements=function(){
var _12={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};
var p,_13;
if(_4("ie")){
_13=_5.doc.documentElement.style.fontSize||"";
if(!_13){
_5.doc.documentElement.style.fontSize="100%";
}
}
var div=_8.create("div",{style:{position:"absolute",left:"0",top:"-100px",width:"30px",height:"1000em",borderWidth:"0",margin:"0",padding:"0",outline:"none",lineHeight:"1",overflow:"hidden"}},_5.body());
for(p in _12){
div.style.fontSize=p;
_12[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;
}
if(_4("ie")){
_5.doc.documentElement.style.fontSize=_13;
}
_5.body().removeChild(div);
return _12;
};
var _14=null;
b._getCachedFontMeasurements=function(_15){
if(_15||!_14){
_14=b._getFontMeasurements();
}
return _14;
};
var _16=null,_17={};
b._getTextBox=function(_18,_19,_1a){
var m,s,al=arguments.length;
var i,box;
if(!_16){
_16=_8.create("div",{style:{position:"absolute",top:"-10000px",left:"0",visibility:"hidden"}},_5.body());
}
m=_16;
m.className="";
s=m.style;
s.borderWidth="0";
s.margin="0";
s.padding="0";
s.outline="0";
if(al>1&&_19){
for(i in _19){
if(i in _17){
continue;
}
s[i]=_19[i];
}
}
if(al>2&&_1a){
m.className=_1a;
}
m.innerHTML=_18;
if(m.getBoundingClientRect){
var bcr=m.getBoundingClientRect();
box={l:bcr.left,t:bcr.top,w:bcr.width||(bcr.right-bcr.left),h:bcr.height||(bcr.bottom-bcr.top)};
}else{
box=_9.getMarginBox(m);
}
m.innerHTML="";
return box;
};
b._computeTextLocation=function(_1b,_1c,_1d,_1e){
var loc={},_1f=_1b.align;
switch(_1f){
case "end":
loc.x=_1b.x-_1c;
break;
case "middle":
loc.x=_1b.x-_1c/2;
break;
default:
loc.x=_1b.x;
break;
}
var c=_1e?0.75:1;
loc.y=_1b.y-_1d*c;
return loc;
};
b._computeTextBoundingBox=function(s){
if(!g._base._isRendered(s)){
return {x:0,y:0,width:0,height:0};
}
var loc,_20=s.getShape(),_21=s.getFont()||g.defaultFont,w=s.getTextWidth(),h=g.normalizedLength(_21.size);
loc=b._computeTextLocation(_20,w,h,true);
return {x:loc.x,y:loc.y,width:w,height:h};
};
b._isRendered=function(s){
var p=s.parent;
while(p&&p.getParent){
p=p.parent;
}
return p!==null;
};
var _22=0;
b._getUniqueId=function(){
var id;
do{
id=_1._scopeName+"xUnique"+(++_22);
}while(_7.byId(id));
return id;
};
var _23=_4("pointer-events")?"touchAction":_4("MSPointer")?"msTouchAction":null;
b._fixMsTouchAction=_23?function(_24){
_24.rawNode.style[_23]="none";
}:function(){
};
_2.mixin(g,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},getDefault:(function(){
var _25={};
return function(_26){
var t=_25[_26];
if(t){
return new t();
}
t=_25[_26]=new Function();
t.prototype=g["default"+_26];
return new t();
};
})(),normalizeColor:function(_27){
return (_27 instanceof _3)?_27:new _3(_27);
},normalizeParameters:function(_28,_29){
var x;
if(_29){
var _2a={};
for(x in _28){
if(x in _29&&!(x in _2a)){
_28[x]=_29[x];
}
}
}
return _28;
},makeParameters:function(_2b,_2c){
var i=null;
if(!_2c){
return _2.delegate(_2b);
}
var _2d={};
for(i in _2b){
if(!(i in _2d)){
_2d[i]=_2.clone((i in _2c)?_2c[i]:_2b[i]);
}
}
return _2d;
},formatNumber:function(x,_2e){
var val=x.toString();
if(val.indexOf("e")>=0){
val=x.toFixed(4);
}else{
var _2f=val.indexOf(".");
if(_2f>=0&&val.length-_2f>5){
val=x.toFixed(4);
}
}
if(x<0){
return val;
}
return _2e?" "+val:val;
},makeFontString:function(_30){
return _30.style+" "+_30.variant+" "+_30.weight+" "+_30.size+" "+_30.family;
},splitFontString:function(str){
var _31=g.getDefault("Font");
var t=str.split(/\s+/);
do{
if(t.length<5){
break;
}
_31.style=t[0];
_31.variant=t[1];
_31.weight=t[2];
var i=t[3].indexOf("/");
_31.size=i<0?t[3]:t[3].substring(0,i);
var j=4;
if(i<0){
if(t[4]=="/"){
j=6;
}else{
if(t[4].charAt(0)=="/"){
j=5;
}
}
}
if(j<t.length){
_31.family=t.slice(j).join(" ");
}
}while(false);
return _31;
},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){
return g._base._getCachedFontMeasurements()["12pt"]/12;
},pt2px:function(len){
return len*g.px_in_pt();
},px2pt:function(len){
return len/g.px_in_pt();
},normalizedLength:function(len){
if(len.length===0){
return 0;
}
if(len.length>2){
var _32=g.px_in_pt();
var val=parseFloat(len);
switch(len.slice(-2)){
case "px":
return val;
case "pt":
return val*_32;
case "in":
return val*72*_32;
case "pc":
return val*12*_32;
case "mm":
return val*g.mm_in_pt*_32;
case "cm":
return val*g.cm_in_pt*_32;
}
}
return parseFloat(len);
},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-DF-Za-df-z])|([-+]?\d*[.]?\d+(?:[eE][-+]?\d+)?)/g,equalSources:function(a,b){
return a&&b&&a===b;
},switchTo:function(_33){
var ns=typeof _33=="string"?g[_33]:_33;
if(ns){
_6.forEach(["Group","Rect","Ellipse","Circle","Line","Polyline","Image","Text","Path","TextPath","Surface","createSurface","fixTarget"],function(_34){
g[_34]=ns[_34];
});
if(typeof _33=="string"){
g.renderer=_33;
}else{
_6.some(["svg","vml","canvas","canvasWithEvents","silverlight"],function(r){
return (g.renderer=g[r]&&g[r].Surface===g.Surface?r:null);
});
}
}
}});
return g;
});
