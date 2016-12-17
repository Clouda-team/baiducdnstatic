//>>built
define("dojox/charting/plot2d/commonStacked",["dojo/_base/lang","dojox/lang/functional","./common"],function(_1,df,_2){
var _3=_1.getObject("dojox.charting.plot2d.commonStacked",true);
return _1.mixin(_3,{collectStats:function(_4,_5){
var _6=_1.delegate(_2.defaultStats);
for(var i=0;i<_4.length;++i){
var _7=_4[i];
for(var j=0;j<_7.data.length;j++){
var x,y;
if(_7.data[j]!==null){
if(typeof _7.data[j]=="number"||!_7.data[j].hasOwnProperty("x")){
y=_3.getIndexValue(_4,i,j,_5)[0];
x=j+1;
}else{
x=_7.data[j].x;
if(x!==null){
y=_3.getValue(_4,i,x,_5)[0];
y=y!=null&&y.y?y.y:null;
}
}
_6.hmin=Math.min(_6.hmin,x);
_6.hmax=Math.max(_6.hmax,x);
_6.vmin=Math.min(_6.vmin,y);
_6.vmax=Math.max(_6.vmax,y);
}
}
}
return _6;
},rearrangeValues:function(_8,_9,_a){
var _b=df.filter(_8,"x"),n=_b.length;
if(!n){
return _8;
}
var _c={};
for(var i=0;i<n;++i){
var _d=_b[i];
for(var j=_d.min,k=_d.max;j<k;++j){
_d[j]=(_d[j]||0)+(_c[j]||0);
}
_c=_d;
}
for(i=0;i<n;++i){
_d=_b[i];
for(j=_d.min,k=_d.max;j<k;++j){
_d[j]=this.isNullValue(_d[j])?0:_9(_d[j])-_a;
}
}
if(this.opt.minWidth){
var _e=this.opt.minWidth;
for(i=n-1;i;--i){
_d=_b[i];
_c=_b[i-1];
for(j=_d.min,k=_d.max;j<k;++j){
_d[j]=_d[j]-_c[j];
}
}
var _f=_d.min,max=_d.max;
for(var j=_f;j<max;++j){
var sum=0,_10=0;
for(i=0;i<n;++i){
var _11=_b[i][j];
if(_11>0){
sum+=_11;
++_10;
}
}
if(sum<=_10*_e){
for(i=0;i<n;++i){
_11=_b[i][j];
if(_11>0){
_b[i][j]=_e;
}
}
continue;
}
var _12=0;
for(i=0;i<n;++i){
_d=_b[i];
_11=_d[j];
if(_11>0){
if(_11<_e){
_12+=_e-_11;
_d[j]=_e;
}else{
if(_12>0){
var _13=_d[j]-_e;
if(_13>=_12){
_d[j]-=_12;
_12=0;
}else{
if(_13>0){
_d[j]=_e;
_12-=_13;
}
}
}
}
}
}
if(_12>0){
for(i=n-1;i>=0;--i){
_d=_b[i];
_11=_d[j];
if(_11>0){
_13=_d[j]-_e;
if(_13>=_12){
_d[j]-=_12;
break;
}else{
if(_13>0){
_d[j]=_e;
_12-=_13;
}
}
}
}
}
}
for(i=1;i<n;++i){
_d=_b[i];
_c=_b[i-1];
for(j=_d.min,k=_d.max;j<k;++j){
_d[j]=_d[j]+_c[j];
}
}
}
return _8;
},getIndexValue:function(_14,i,_15,_16){
var _17=0,v,j;
for(j=0;j<=i;++j){
v=_14[j].data[_15];
if(!_16(v)){
if(isNaN(v)){
v=v.y||0;
}
_17+=v;
}
}
return _17;
},getValue:function(_18,i,x,_19){
var _1a=null,j,z;
for(j=0;j<=i;++j){
for(z=0;z<_18[j].data.length;z++){
v=_18[j].data[z];
if(!_19(v)){
if(v.x==x){
if(!_1a){
_1a={x:x};
}
if(v.y!=null){
if(_1a.y==null){
_1a.y=0;
}
_1a.y+=v.y;
}
break;
}else{
if(v.x>x){
break;
}
}
}
}
}
return _1a;
},getIndexValue:function(_1b,i,_1c,_1d){
var _1e=0,v,j,_1f;
for(j=0;j<=i;++j){
if(_1b[j].hidden){
continue;
}
_1f=_1e;
v=_1b[j].data[_1c];
if(!_1d(v)){
if(isNaN(v)){
v=v.y||0;
}
_1e+=v;
}
}
return [_1e,_1f];
},getValue:function(_20,i,x,_21){
var _22=null,j,z,v,_23;
for(j=0;j<=i;++j){
if(_20[j].hidden){
continue;
}
for(z=0;z<_20[j].data.length;z++){
_23=_22;
v=_20[j].data[z];
if(!_21(v)){
if(v.x==x){
if(!_22){
_22={x:x};
}
if(v.y!=null){
if(_22.y==null){
_22.y=0;
}
_22.y+=v.y;
}
break;
}else{
if(v.x>x){
break;
}
}
}
}
}
return [_22,_23];
}});
});
