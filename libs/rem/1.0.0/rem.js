;(function(undefined) {
        "use strict"
        var _global;
        // 工具函数
        // 对象合并函数
        function extend(o,n,override) {   
            for(var key in n){
                if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
                    o[key]=n[key];
                }
            }
            return o;     
        };
         // 插件构造函数 - 返回数组结构
        function Rem(opt){
            // console.log(this.init)
            this.init(opt);
        };
           //以后内部变量统一前面加 _例如def这个只有内部的变量  ,
        Rem.prototype = {
            constructor: this,
            init:function(opt){
                // 默认参数
                var rem = {
                    doc : document,
                    win : window,
                    desinWidth:750,
                    num : 100
                };
                this.rem = extend(rem,opt,true);
                // console.log(this.settings)
                var r = this.rem.win.document;
                var m = r.createElement("meta");
                m.setAttribute("name", "viewport");
                m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=" + 1 + ",maximum-scale=" + 1 + ",minimum-scale=" + 1 +",minimal-ui");
                r.head.appendChild(m);

                var docEl = this.rem.doc.documentElement;
                var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
                var _self = this;
                console.log(_self.rem.desinWidth);
                console.log(_self.rem.num)
                var recalc = function() {
                    var clientWidth = docEl.clientWidth;
                    if (!clientWidth) return;
                    if (clientWidth >= _self.rem.desinWidth) { //750这个值，根据设计师的psd宽度来修改，是多少就写多少，现在手机端一般是750px的设计稿，如果设计师给的1920的psd，自己用Photoshop等比例缩小
                        docEl.style.fontSize = '100px';
                    } else {
                        docEl.style.fontSize = _self.rem.num * (clientWidth / _self.rem.desinWidth) + 'px'; //750这个值，根据设计师的psd宽度来修改，是多少就写多少，现在手机端一般是750px的设计稿，如果设计师给的1920的psd，自己用Photoshop等比例缩小
                    }
                };

                if (!_self.rem.doc.addEventListener) return;
                this.rem.win.addEventListener(resizeEvt, recalc, false);
                this.rem.doc.addEventListener('DOMContentLoaded', recalc, false);
            }
        }

       // 最后将插件对象暴露给全局对象
        _global = (function(){ return this || (0, eval)('this'); }());
        if (typeof module !== "undefined" && module.exports) {
            module.exports = Rem;
        } else if (typeof define === "function" && define.amd) {
            define(function(){return Rem;});
        } else {
            !('Rem' in _global) && (_global.Rem = Rem);
        }
    }());