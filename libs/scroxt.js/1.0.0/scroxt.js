/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = isDOM;
/**
 * @param {Element} ele:判断元素
 * @returns {Boolean} true:是元素节点，false:不是
 * @example
 *
 * isDOM(document.body)
 */
function isDOM(ele) {
    if (ele && ele.nodeType) {
        return ele.nodeType === 1;
    }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * 设置定时器profix
 *
 * 例子：
 *
 * setTimeTask(function(){
 *     console.log(1)
 * });
 *
 */
var setTimeTask = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
/* harmony default export */ __webpack_exports__["default"] = (setTimeTask);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = getEleAttr;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isDOM__ = __webpack_require__(0);

/**
 * @param {any} css selector
 * @param {string} element attribute
 * @returns {string} attribute value
 * @example
 *
 * getEleAttr(".container","width") // => "200px"
 * getEleAttr(document.body,"height") // => "left"
 *
 */
function getEleAttr(ele, attr) {
    if (Object(__WEBPACK_IMPORTED_MODULE_0__isDOM__["default"])(ele)) {
        return window.getComputedStyle(ele, null).getPropertyValue(attr);
    }
    else if (typeof ele === 'string' && document.querySelector(ele)) {
        return window.getComputedStyle(document.querySelector(ele), null).getPropertyValue(attr);
    }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * class root
 * @param {string} target: 插入滚动弹幕的元素
 * @param {Array<string>} data: 弹幕内容
 * @param {number} speed: 弹幕移动的速度  取值[1-10]
 * @returns voild
 * @example
 *
 * class initital extend root
 *         or
 * new root({
 *     target:"body",
 *     data: ["第一条","第二条","第三条"],
 *     speed:-5
 * })
 *
 */
var root = /** @class */ (function () {
    function root(_a) {
        var target = _a.target, data = _a.data, speed = _a.speed;
        /**
         * [options 构造函数参数]
         * @type {Options}
         */
        this.options = {
            target: "",
            data: [],
            speed: 5
        };
        this.extendOpt(arguments[0]);
        this.targetElement = document.querySelector(this.options.target);
    }
    /**
     * @param {Object} 构造函数参数赋值
     */
    root.prototype.extendOpt = function (opt) {
        var that = this;
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                that.options[key] = opt[key];
            }
        }
    };
    /**
     * [createElement 生成滚动元素]
     * @param {string = ""} className [滚动元素类名]
     * @return {Array<HTMLElement>} divBox [滚动元素数组]
     */
    root.prototype.createElement = function (className) {
        if (className === void 0) { className = ""; }
        // const scope = ~~(Math.random()*100) + (+new Date());
        var target = this.targetElement;
        var divBox = [];
        var divWrapElement = document.querySelector(".scroxt-wrapper");
        if (!divWrapElement) {
            divWrapElement = document.createElement('div');
            divWrapElement.className = "scroxt-wrapper";
            target.appendChild(divWrapElement);
        }
        for (var i = 0, len = this.options.data.length; i < len; i++) {
            var div = document.createElement('div');
            div.className = className;
            var text = document.createTextNode(this.options.data[i]);
            div.appendChild(text);
            divWrapElement.appendChild(div);
            divBox.push(div);
        }
        return divBox;
    };
    return root;
}());
/* harmony default export */ __webpack_exports__["default"] = (root);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = removeElement;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isDOM__ = __webpack_require__(0);

/**
 * @param {Element} ele:删除的元素的css选择器
 * @example
 *
 * removeElement(".content")
 
 * removeElement("[data-id='2014']")
 */
function removeElement(ele) {
    if (Object(__WEBPACK_IMPORTED_MODULE_0__isDOM__["default"])(ele)) {
        ele.parentNode.removeChild(ele);
    }
    else if (typeof ele === 'string' && document.querySelector(ele)) {
        var element = document.querySelector(ele);
        element.parentNode.removeChild(element);
    }
    else {
        console.error("参数错误");
    }
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * 取消定时器profix
 *
 * 例子
 *
 * clearTimeTask(st);
 */
var clearTimeTask = (function () {
    return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.clearTimeout;
})();
/* harmony default export */ __webpack_exports__["default"] = (clearTimeTask);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * 事件
 *
 * 例子
 *
 * clearTimeTask(st);
 */
var Event = /** @class */ (function () {
    function Event() {
        /**
         * [event 事件容器]
         * @type {EventInterface}
         */
        this.events = {};
    }
    /**
     * [on 添加事件]
     * @param {[type]} type [事件名]
     * @param {[type]} foo  [执行函数]
     */
    Event.prototype.on = function (type, foo) {
        if (!this.events[type]) {
            this.events[type] = [foo];
        }
        else {
            this.events[type].push(foo);
        }
    };
    /**
     * [off 删除事件函数]
     * @param {[type]} type [事件名]
     * @param {[type]} foo  [执行函数]
     */
    Event.prototype.off = function (type, foo) {
        this.events[type].splice(this.events[type].indexOf(foo), 1);
    };
    /**
     * [empty 清空事件函数]
     * @param {[type]} type [事件名]
     */
    Event.prototype.empty = function (type) {
        this.events[type] = [];
    };
    /**
     * [triggle 触发执行事件]
     * @param {[type]} type [事件名]
     */
    Event.prototype.triggle = function (type) {
        var foo = this.events[type];
        foo.forEach(function (value) {
            value();
        });
    };
    return Event;
}());
/* harmony default export */ __webpack_exports__["default"] = (Event);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = addStyleCSS;
/**
 * @param {string} cssText css文本字符串
 * @returns void
 * @example
 *
 * addStyleCSS("body{display:block}");
 *
 */
function addStyleCSS(cssText) {
    var style = document.createElement('style'), head = document.head || document.getElementsByTagName('head')[0];
    style.type = 'text/css';
    if (style.styleSheet) {
        var func = function () {
            try {
                style.styleSheet.cssText = cssText;
            }
            catch (e) {
                console.error(e);
            }
        };
        //如果当前styleSheet不能用，则异步
        if (style.styleSheet.disabled) {
            setTimeout(func, 10);
        }
        else {
            func();
        }
    }
    else {
        var textNode = document.createTextNode(cssText);
        style.appendChild(textNode);
    }
    head.appendChild(style);
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_setTimeTask__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_clearTimeTask__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_Event__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_addStyleCSS__ = __webpack_require__(7);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





/**
 * class Barrage
 * @returns voild
 */
var Barrage = /** @class */ (function (_super) {
    __extends(Barrage, _super);
    function Barrage(_a) {
        var video = _a.video, dataTime = _a.dataTime;
        var _this = _super.call(this) || this;
        /**
         * [currentTime 当前时间 \s]
         * @type {number}
         */
        _this.currentTime = 0;
        /**
         * [sumTime 播放了的时间 \s]
         * @type {number}
         */
        _this.sumTime = 0;
        /**
         * [videoEnd 视频播放结束状态 true为播放结束]
         * @type {Boolean}
         */
        _this.videoEnd = false;
        /**
         * [barrageWrap 弹幕的索引]
         * @type {Array<Element>}
         */
        // private barrageWrap:Array<Element> = [];
        // private barrageWrap: Element[] = [];
        _this.barrageWrap = [];
        /**
         * [readyShowBarrage 准备出场的弹幕]
         * @type {Array<String>}
         */
        _this.readyShowBarrage = [];
        /**
         * [createStaticBarrage 静止的弹幕]
         */
        _this.staticBarrageST = null;
        /**
         * 开始播放
         */
        _this.runST = 0;
        _this.video = video;
        _this.scroxtVideo = document.querySelector(_this.video);
        _this.dataTime = _this.quickSort(dataTime);
        console.log(_this.dataTime);
        _this.tempDataTime = JSON.parse(JSON.stringify(_this.dataTime));
        _this.lineHeight = 28;
        _this.videoWidth = parseInt(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(_this.video, "width"));
        _this.MAX_LINE = ~~(parseInt(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(_this.video, "height")) / _this.lineHeight);
        _this.MAX_NUM = 50;
        _this.distance = -5;
        _this.colorFont = ['#ffff38', '#c80115', '#189add'];
        _this.createStyle();
        _this.startRun();
        return _this;
    }
    /**
     * [quickSort 快速排序]
     * @param {number}[]} dataTime [description]
     */
    Barrage.prototype.quickSort = function (dataTime) {
        if (dataTime.length <= 1)
            return dataTime;
        var numValue = dataTime.splice(Math.floor(dataTime.length / 2), 1)[0];
        var left = [];
        var right = [];
        for (var i = 0, len = dataTime.length; i < len; i++) {
            if (dataTime[i]['time'] < numValue['time']) {
                left.push(dataTime[i]);
            }
            else {
                right.push(dataTime[i]);
            }
        }
        return this.quickSort(left).concat(numValue, this.quickSort(right));
    };
    /**
     * [createStyle 创建内嵌css]
     */
    Barrage.prototype.createStyle = function () {
        Object(__WEBPACK_IMPORTED_MODULE_4__internal_addStyleCSS__["default"])("\n            .scroxt-video-barrage{\n                position: relative;\n                width: 600px;\n                height: 600px;\n                margin: 0 auto;\n                overflow: hidden;\n            }\n            .scroxt-video{\n                display: block;\n                width: 100%;\n                height: auto;\n                cursor: pointer;\n            }\n            .multi-barrage-line{\n              position: absolute;\n              display: inline-block;\n              top: 0;\n              user-select:none;\n              white-space: pre;\n              color: #fff;\n              font-size: 25px;\n              font-family:SimHei, \"Microsoft JhengHei\", Arial, Helvetica, sans-serif;\n              font-weight:bold;\n              line-height: 1.125;\n              text-shadow:rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;\n              transition:-webkit-transform 0s linear;\n              z-index: 1;\n              pointer-events: none;\n            }\n            .static-barrage-line{\n              position: absolute;\n              left: 50%;\n              transform:translateX(-50%);\n              -webkit-transform:translateX(-50%);\n              top: 0;\n              z-index: 2;\n            }\n        ");
    };
    Barrage.prototype.startRun = function () {
        //添加类名：scroxt-video
        var className = this.scroxtVideo.className;
        this.scroxtVideo.className = className.indexOf('scroxt-video') > -1 ? className : className + ' scroxt-video';
        this.playEvent();
    };
    /**
     * 视频重播
     */
    Barrage.prototype.restart = function () {
        this.sumTime = 0;
        this.tempDataTime = JSON.parse(JSON.stringify(this.dataTime));
    };
    /**
     * 视频加载到可以播放，点击播放
     */
    Barrage.prototype.playEvent = function () {
        var that = this;
        if (this.scroxtVideo.readyState == 4) {
            that.videoClickEvent();
        }
        else {
            this.scroxtVideo.addEventListener("canplaythrough", function () {
                that.videoClickEvent();
            }, false);
            this.scroxtVideo.load(); // 需要主动触发下，不然不会加载
        }
    };
    /**
     * [videoClickEvent videoElement绑定点击事件]
     */
    Barrage.prototype.videoClickEvent = function () {
        var that = this;
        that.scroxtVideo.addEventListener("click", function (e) {
            e.stopImmediatePropagation();
            if (that.videoEnd) {
                that.videoEnd = false;
                that.restart();
            }
            that.videoStatusMethod();
        }, false);
        that.scroxtVideo.addEventListener("ended", function () {
            that.videoEnd = true;
            that.readyShowBarrage = [];
        });
    };
    /**
     * 视频播放暂停
     */
    Barrage.prototype.videoStatusMethod = function () {
        if (this.scroxtVideo.paused) {
            this.currentTime = +new Date();
            this.scroxtVideo.play();
            this.intervalRun();
        }
        else {
            this.scroxtVideo.pause();
            this.intervalStop();
        }
    };
    /**
     * [timeUpdate 播放时间更新]
     */
    Barrage.prototype.timeUpdate = function () {
        this.sumTime += ((+new Date()) - this.currentTime) / 1000;
        this.currentTime = +new Date();
        this.distribution(this.sumTime);
    };
    /**
    * 分配弹幕，决定弹幕出场
    */
    Barrage.prototype.distribution = function (sumTime) {
        var len = this.tempDataTime.length;
        var i = 0;
        while (len !== 0) {
            if (this.tempDataTime[i].time < sumTime) {
                this.readyShowBarrage.push(this.tempDataTime[i]["data"]);
                this.tempDataTime.shift();
                len = this.tempDataTime.length;
            }
            else {
                break;
            }
        }
    };
    /**
     * [createBarrage 创建弹幕from readyShowBarrage]
     */
    Barrage.prototype.createBarrage = function () {
        var len = this.readyShowBarrage.length;
        if (!len || this.barrageWrap.length > this.MAX_NUM)
            return;
        for (var i = 0; i < len; i++) {
            if (i > this.MAX_LINE) {
                if (len > 20 && !this.staticBarrageST) {
                    this.createStaticBarrage(this.readyShowBarrage.splice(0, this.MAX_LINE));
                }
                break;
            }
            var lineIndex = i % this.MAX_LINE;
            //当前行最后一个元素是否完全出场
            var currentLineArr = document.querySelectorAll("[data-line='" + lineIndex + "']");
            var currentLineLength = currentLineArr.length;
            var currentLineLastElement = void 0;
            if (currentLineLength > 0) {
                currentLineLastElement = currentLineArr[currentLineLength - 1];
                var width = +currentLineLastElement.getAttribute('data-width');
                var move = +currentLineLastElement.getAttribute('data-move');
                if (Math.abs(move) + width > this.videoWidth) {
                    continue;
                }
            }
            var showCurrent = this.readyShowBarrage.shift();
            var refer = Math.floor(Math.random() * 1000) + (+new Date()) + i;
            var translatePosition = i % 2 === 0 ? 10 : 0;
            var div = document.createElement('div');
            div.className = "multi-barrage-line";
            var textNode = document.createTextNode("" + showCurrent);
            div.appendChild(textNode);
            this.scroxtVideo.parentNode.appendChild(div);
            var refWidth = parseInt(window.getComputedStyle(div, null).getPropertyValue("width"));
            var distance = refWidth / 600 >= 0.5 ? 0.5 : refWidth / 600;
            //超长随机颜色
            var color = "#fff";
            if (distance === 0.5) {
                color = this.colorFont[~~(Math.random() * this.colorFont.length)];
            }
            this.barrageWrap.push({
                element: div,
                scroxt: refer,
                line: lineIndex,
                move: this.videoWidth + translatePosition + 10,
                width: refWidth,
                distance: distance,
                color: color
            });
        }
    };
    Barrage.prototype.createStaticBarrage = function (dataTime) {
        var _loop_1 = function (i, len) {
            var lineIndex = i % this_1.MAX_LINE;
            var div = document.createElement('div');
            div.className = "multi-barrage-line static-barrage-line";
            div.style.top = lineIndex * this_1.lineHeight + "px";
            div.style.color = this_1.colorFont[~~(Math.random() * this_1.colorFont.length)];
            var textNode = document.createTextNode("" + dataTime[i]);
            div.appendChild(textNode);
            this_1.staticBarrageST = setTimeout(function () {
                this.staticBarrageST = null;
                this.scroxtVideo.parentNode.removeChild(div);
            }.bind(this_1), 3000);
            this_1.scroxtVideo.parentNode.appendChild(div);
        };
        var this_1 = this;
        for (var i = 0, len = dataTime.length; i < len; i++) {
            _loop_1(i, len);
        }
    };
    /**
     * [moveLine 页面弹幕移动]
     */
    Barrage.prototype.moveLine = function () {
        for (var i = 0; i < this.barrageWrap.length; i++) {
            var barrage = this.barrageWrap[i];
            var scroxt = barrage['element'];
            var refer = barrage['scroxt'];
            var line = barrage['line'];
            var move = barrage['move'];
            var width = barrage['width'];
            var distance = barrage['distance'];
            var color = barrage['color'];
            if (move <= -width) {
                this.barrageWrap.splice(i, 1);
                i--;
                var parentElement = scroxt.parentNode;
                if (parentElement)
                    parentElement.removeChild(scroxt);
                continue;
            }
            var setMove = move + this.distance * distance + this.distance / 10;
            this.barrageWrap[i]['move'] = setMove;
            scroxt.style.cssText = "color:" + color + ";transform:translate3d(" + setMove + "px," + line * this.lineHeight + "px,0);";
        }
    };
    Barrage.prototype.intervalRun = function () {
        this.runST = Object(__WEBPACK_IMPORTED_MODULE_0__internal_setTimeTask__["default"])(function () {
            this.createBarrage();
            this.moveLine();
            if (!this.scroxtVideo.paused) {
                this.timeUpdate();
            }
            this.intervalRun();
        }.bind(this));
    };
    /**
     * 停止播放
     */
    Barrage.prototype.intervalStop = function () {
        Object(__WEBPACK_IMPORTED_MODULE_1__internal_clearTimeTask__["default"])(this.runST);
    };
    return Barrage;
}(__WEBPACK_IMPORTED_MODULE_3__internal_Event__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Barrage);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_setTimeTask__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_removeElement__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_addStyleCSS__ = __webpack_require__(7);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





/**
 * class Horizontal
 * @returns voild
 */
var Horizontal = /** @class */ (function (_super) {
    __extends(Horizontal, _super);
    function Horizontal(opt) {
        var _this = _super.call(this, opt) || this;
        /**
         * [sumWidth 水平滚动元素总宽度]
         * @type {number}
         */
        _this.sumWidth = 0;
        /**
         * [scroxtGap 水平滚动元素的间隔]
         * @type {number}
         */
        _this.scroxtGap = 10;
        /**
         * [distance 移动的距离]
         * @type {number}
         */
        _this.distance = 0;
        /**
         * [targetWidth target宽度]
         * @type {number}
         */
        _this.targetWidth = 0;
        /**
         * [divWrapElementWidth 元素总宽度]
         * @type {number}
         */
        _this.divWrapElementWidth = 0;
        /**
         * [targetElementBorderWidth target border width]
         * @type {number}
         */
        _this.targetElementBorderWidth = 0;
        _this.createStyle();
        _this.init();
        return _this;
    }
    /**
     * [createStyle 创建内嵌css]
     */
    Horizontal.prototype.createStyle = function () {
        Object(__WEBPACK_IMPORTED_MODULE_4__internal_addStyleCSS__["default"])("\n            .scroxt-wrapper{\n              width: 1000px;\n            }\n            .scroxt-wrapper::after{\n                display: block;\n                content: \"\";\n                clear: both;\n            }\n            .scroxt-horizontal{\n                float: left;\n                margin-right: 10px;\n            }\n        ");
    };
    /**
     * [init 入口]
     */
    Horizontal.prototype.init = function () {
        this.targetWidth = parseFloat(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(this.targetElement, 'width'));
        this.targetElementBorderWidth = parseFloat(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(this.targetElement, 'border-width'));
        this.createHorizontal();
        this.STRun();
    };
    /**
     * [createHorizontal 创建水平滚动元素]
     * @returns {HTMLElement} divWrapElement:水平滚动元素集
     */
    Horizontal.prototype.createHorizontal = function () {
        Object(__WEBPACK_IMPORTED_MODULE_3__internal_removeElement__["default"])(".scroxt-wrapper");
        var ElementArr1 = this.createElement("scroxt-horizontal");
        var ElementArr2 = this.createElement("scroxt-horizontal");
        var ElementArr = ElementArr1.concat(ElementArr2);
        this.divWrapElementWidth = this.computeWidth(ElementArr) + ElementArr.length * this.scroxtGap;
        var divWrapElement = document.querySelector(".scroxt-wrapper");
        divWrapElement.style.width = this.divWrapElementWidth + 'px';
        return divWrapElement;
    };
    /**
     * [computeWidth 计算元素宽度]
     * @param {Array<HTMLElement>} ElementArr [元素集合]
     */
    Horizontal.prototype.computeWidth = function (ElementArr) {
        var width = 0;
        for (var i = 0, len = ElementArr.length; i < len; i++) {
            width += Math.ceil(+(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(ElementArr[i], "width").replace("px", "")));
        }
        return width;
    };
    /**
     * [STRun 定时运行]
     */
    Horizontal.prototype.STRun = function () {
        this.STMove();
        Object(__WEBPACK_IMPORTED_MODULE_1__internal_setTimeTask__["default"])(function () {
            this.STRun();
        }.bind(this));
    };
    /**
     * [STMove 单位帧移动]
     */
    Horizontal.prototype.STMove = function () {
        var divWrapElement = document.querySelector(".scroxt-wrapper");
        var rectObj = divWrapElement.getBoundingClientRect();
        var divWrapElementHalfPosition = rectObj.left + (rectObj.right - rectObj.left) / 2;
        var targetRect = this.targetElement.getBoundingClientRect();
        if (this.options.speed < 0) {
            var targetLeftPosition = targetRect.left + this.targetElementBorderWidth;
            if (divWrapElementHalfPosition + this.options.speed * 0.1 <= targetLeftPosition) {
                this.distance = 0;
                divWrapElement = this.createHorizontal();
                divWrapElement.style.left = "0px";
                divWrapElement.style.marginLeft = "0px";
            }
        }
        else {
            var targetRightPosition = targetRect.right - this.targetElementBorderWidth * 2;
            if (divWrapElementHalfPosition + this.options.speed * 0.1 >= targetRightPosition) {
                this.distance = -this.divWrapElementWidth + this.targetWidth;
                divWrapElement = this.createHorizontal();
                divWrapElement.style.right = "0px";
                divWrapElement.style.marginRight = "0px";
            }
        }
        divWrapElement.style.transform = "translate3d(" + this.distance + "px, 0px, 0px)";
        divWrapElement.style.webkitTransform = "translate3d(" + this.distance + "px, 0px, 0px)";
        this.distance += this.options.speed * 0.1;
    };
    return Horizontal;
}(__WEBPACK_IMPORTED_MODULE_0__root__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Horizontal);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_setTimeTask__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_removeElement__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_addStyleCSS__ = __webpack_require__(7);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





/**
 * class Vertical   垂直滚动
 * @returns voild
 */
var Vertical = /** @class */ (function (_super) {
    __extends(Vertical, _super);
    function Vertical(opt) {
        var _this = _super.call(this, opt) || this;
        /**
         * [targetHeight target高度]
         * @type {number}
         */
        _this.targetHeight = 0;
        /**
         * [divWrapElementHeight 元素总宽度]
         * @type {number}
         */
        _this.divWrapElementHeight = 0;
        /**
         * [distance 移动的距离]
         * @type {number}
         */
        _this.distance = 0;
        _this.targetHeight = parseFloat(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(_this.targetElement, 'height'));
        _this.createStyle();
        _this.startRun();
        return _this;
    }
    /**
     * [createStyle 创建内嵌css]
     */
    Vertical.prototype.createStyle = function () {
        Object(__WEBPACK_IMPORTED_MODULE_4__internal_addStyleCSS__["default"])("\n    \t\t\n    \t");
    };
    Vertical.prototype.startRun = function () {
        this.divWrapElementHeight = this.createVertical();
        this.STRun();
    };
    /**
     * [createVertical 创建水平滚动元素]
     * @returns {HTMLElement} divWrapElement:垂直滚动元素集
     */
    Vertical.prototype.createVertical = function () {
        Object(__WEBPACK_IMPORTED_MODULE_3__internal_removeElement__["default"])(".scroxt-wrapper");
        var verticalArr1 = this.createElement("scroxt-vertical");
        var verticalArr2 = this.createElement("scroxt-vertical");
        this.divWrapElement = document.querySelector(".scroxt-wrapper");
        var divWrapElementHeight = this.computeHeight(verticalArr1.concat(verticalArr2));
        return divWrapElementHeight;
    };
    /**
     * [computeWidth 计算元素宽度]
     * @param {Array<HTMLElement>} ElementArr [元素集合]
     */
    Vertical.prototype.computeHeight = function (ElementArr) {
        var height = 0;
        for (var i = 0, len = ElementArr.length; i < len; i++) {
            height += Math.ceil(+(Object(__WEBPACK_IMPORTED_MODULE_2__internal_getEleAttr__["default"])(ElementArr[i], "height").replace("px", "")));
        }
        return height;
    };
    /**
     * [STRun 定时器]
     */
    Vertical.prototype.STRun = function () {
        this.STMove();
        Object(__WEBPACK_IMPORTED_MODULE_1__internal_setTimeTask__["default"])(function () {
            this.STRun();
        }.bind(this));
    };
    /**
     * [STMove 一帧移动]
     */
    Vertical.prototype.STMove = function () {
        if (this.options.speed < 0) {
            if (this.distance <= -this.divWrapElementHeight / 2) {
                this.createVertical();
                this.distance = 0;
            }
        }
        else {
            if (this.distance >= this.targetHeight - this.divWrapElementHeight / 2) {
                this.createVertical();
                this.distance = this.targetHeight - this.divWrapElementHeight;
            }
        }
        this.divWrapElement.style.transform = "translate3d(0px, " + this.distance + "px, 0px)";
        this.divWrapElement.style.webkitTransform = "translate3d(0px, " + this.distance + "px, 0px)";
        this.distance += this.options.speed * 0.1;
    };
    return Vertical;
}(__WEBPACK_IMPORTED_MODULE_0__root__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Vertical);


/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__horizontal__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vertical__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__barrage__ = __webpack_require__(8);



/**
 * [scroxt scroxt全局对象]
 * @type {any}
 */
var scroxt = {};
/**
 * class Horizontal 水平滚动
 * @param {target:string,data:string[],speed:number} obj 类构造参数
 * target:target目标容器的css选择器。data:数据的数组，speed：弹幕滚动速度[0-10]
 * @returns voild
 * @example
 *
 * new scroxt.Horizontal({
 *     target: ".my-ele",
 *     data: ['第一条','第2条','第3条'],
 *     speed: -5
 * });
 */
scroxt.Horizontal = __WEBPACK_IMPORTED_MODULE_0__horizontal__["default"];
/**
 * class Vertical 垂直滚动
 * @param {target:string,data:string[],speed:number} obj 类构造参数
 * target:target目标容器的css选择器。data:数据的数组，speed：弹幕滚动速度[0-10]
 * @returns voild
 * @example
 *
 * new scroxt.Vertical({
 *     target: ".my-ele",
 *     data: ['第一条','第2条','第3条'],
 *     speed: -5
 * });
 */
scroxt.Vertical = __WEBPACK_IMPORTED_MODULE_1__vertical__["default"];
/**
 * class Barrage
 * @param {video: string,dataTime: {data:string,time:number}[]} obj 类构造参数
 * video:video标签的css选择器。dataTime:数据的数组对象，data:弹幕的内容，time弹幕出现的时间(单位/秒)
 * @returns voild
 * @example
 *
 * new scroxt.Barrage({
 *     video: "#my-video",
 *     dataTime: [{
 *         data:"第一条",  // 第一条弹幕
 *         time:1          // 第一条弹幕出现的时间 1秒
 *     },{
 *         data:"第二条",  // 第二条弹幕
 *         time:1		   // 第一条弹幕出现的时间 1秒
 *     },{
 *         data:"第三条",  // 第三条弹幕
 *         time:2          // 第一条弹幕出现的时间 2秒
 *     }]
 * });
 */
scroxt.Barrage = __WEBPACK_IMPORTED_MODULE_2__barrage__["default"];
window.scroxt = scroxt;


/***/ })
/******/ ]);