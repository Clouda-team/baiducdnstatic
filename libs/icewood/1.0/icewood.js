if (typeof String.prototype.startsWith != "function") {
    String.prototype.startsWith = function(prefix) {
        return this.slice(0, prefix.length) === prefix;
    };
}

if (typeof String.prototype.endsWith != "function") {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (typeof String.prototype.trim != "function") {
    String.prototype.trim = function() {
        return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    };
}

if (typeof String.prototype.trimLeft != "function") {
    String.prototype.trimLeft = function() {
        return this.replace(/^\s\s*/, "");
    };
}

if (typeof String.prototype.trimRight != "function") {
    String.prototype.trimRight = function() {
        return this.replace(/\s\s*$/, "");
    };
}

if (typeof String.prototype.includes != "function") {
    String.prototype.includes = function(subStr) {
        return this.indexOf(subStr) != -1;
    };
}

if (typeof String.prototype.repeat != "function") {
    String.prototype.repeat = function(num) {
        var sum = "";
        for (var i = 0; i < num; i++) {
            sum += "" + this;
        }
        return sum;
    };
}

if (location.origin === undefined) {
    location.origin = location.protocol + "//";
}

if (typeof Date.prototype.toISOString != "function") {
    Date.prototype.toISOString = function(suffix) {
        var now = new Date();
        var sum = "";
        var year = now.getFullYear();
        var month = now.getMonth();
        var date = now.getDate();
        var hour = now.getHours() + now.getTimezoneOffset()/60;
        var mintue = now.getMinutes();
        var second = now.getSeconds();
        var millisecond = now.getMilliseconds();
        sum += year;
        sum += "-";
        month++;
        if (month < 10) {
            sum += "0";
        }
        sum += month;
        sum += "-";
        if (date < 10) {
            sum += "0";
        }
        sum += date;
        sum += "T";
        if (hour < 10) {
            sum += "0";
        }
        sum += hour;
        sum += ":";
        if (mintue < 10) {
            sum += "0";
        }
        sum += mintue;
        sum += ":";
        if (second < 10) {
            sum += "0";
        }
        sum += second;
        sum += ".";
        if (millisecond < 10) {
            sum += "00";
        } else if (millisecond < 100) {
            sum += "0";
        }
        sum += millisecond;
        sum += "Z";
        return sum;
    };
}

if (typeof Array.prototype.indexOf != "function") {
    Array.prototype.indexOf = function(obj) {
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            if (cur == obj) {
                return i;
            }
        }
        return -1;
    };
}

if (typeof Array.prototype.lastIndexOf != "function") {
    Array.prototype.lastIndexOf = function(obj) {
        for (var i = this.length - 1; i >= 0; i--) {
            var cur = this[i];
            if (cur == obj) {
                return i;
            }
        }
        return -1;
    };
}

if (typeof Array.prototype.every != "function") {
    Array.prototype.every = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            var flag = fun(cur, i, this);
            if (!flag) {
                return false;
            }
        }
        return true;
        ;
    };
}
if (typeof Array.prototype.some != "function") {
    Array.prototype.some = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            var flag = fun(cur, i, this);
            if (flag) {
                return true;
            }
        }
        return false;
        ;
    };
}
if (typeof Array.prototype.forEach != "function") {
    Array.prototype.forEach = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            fun(cur, i, this);
        }
        return undefined;
        ;
    };
}
if (typeof Array.prototype.map != "function") {
    Array.prototype.map = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        var list = [];
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            var curResult = fun(cur, i, this);
            list.push(curResult);
        }
        return list;
    };
}
if (typeof Array.prototype.filter != "function") {
    Array.prototype.filter = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        var list = [];
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            var curResult = fun(cur, i, this);
            if (curResult) {
                list.push(cur);
            }
        }
        return list;
    };
}
if (typeof Array.prototype.reduce != "function") {
    Array.prototype.reduce = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        if (this.length == 0) {
            throw new Error(
                    "Uncaught TypeError: Reduce of empty array with no initial value");
        }
        var sum = this[0];
        for (var i = 1; i < this.length; i++) {
            var cur = this[i];
            sum = fun(sum, cur, i, this);
        }
        return sum;
    };
}

if (typeof Array.prototype.reduceRight != "function") {
    Array.prototype.reduceRight = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        if (this.length == 0) {
            throw new Error(
                    "Uncaught TypeError: Reduce of empty array with no initial value");
        }
        var aryLength = this.length;
        var sum = this[aryLength - 1];
        for (var i = aryLength - 2; i >= 0; i--) {
            var cur = this[i];
            sum = fun(sum, cur, i, this);
        }
        return sum;
    };
}
if (typeof Array.prototype.find != "function") {
    Array.prototype.find = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            var curResult = fun(cur, i, this);
            if (curResult) {
                return cur;
            }
        }
        return undefined;
    };
}
if (typeof Array.prototype.findIndex != "function") {
    Array.prototype.findIndex = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            var curResult = fun(cur, i, this);
            if (curResult) {
                return i;
            }
        }
        return -1;
    };
}
if (typeof Array.prototype.fill != "function") {
    Array.prototype.fill = function(val, startIndex, endIndex) {
        if (startIndex == null || isNaN(parseInt(startIndex))) {
            startIndex = 0;
        }
        if (endIndex == null || isNaN(parseInt(endIndex))) {
            endIndex = this.length;
        }
        if (startIndex % 1 != 0) {
            startIndex = parseInt(startIndex);
        }
        if (endIndex % 1 != 0) {
            endIndex = parseInt(endIndex);
        }
        var aryLength = this.length;
        if (startIndex < 0) {
            startIndex = startIndex + aryLength;
        }
        if (endIndex < 0) {
            endIndex = endIndex + aryLength;
        }
        if (startIndex > aryLength) {
            startIndex = aryLength;
        }
        if (endIndex > aryLength) {
            endIndex = aryLength;
        }
        for (var i = startIndex; i < endIndex; i++) {
            this[i] = val;
        }
        return this;
    };
}
if (typeof Array.prototype.sort != "function") {
    Array.prototype.sort = function(fun) {
        if (fun === undefined) {
            throw new Error("Uncaught TypeError: undefined is not a function");
        } else if (typeof fun != "function") {
            throw new Error("Uncaught TypeError: " + fun + " is not a function");
        }
        for (var i = 0; i < this.length - 1; i++) {
            for (var j = i + 1; j < this.length; j++) {
                if (fun(this[i], this[j]) > 0) {
                    var temp = this[i];
                    this[i] = this[j];
                    this[j] = temp;
                }
            }
        }
        return this;
    };
}
if (typeof Array.prototype.copyWithin != "function") {
    Array.prototype.copyWithin = function(targetIndex, srcStart, srcEnd) {
        if (this == null) {
            throw new Error(
                    "Uncaught TypeError: Cannot read property 'copyWithin' of null");
        }
        if (this === "") {
            throw new Error(
                    "Uncaught TypeError: \"\".copyWithin is not a function");
        }
        if (this.length == null) {
            throw new Error("Uncaught TypeError: " + fun
                    + ".copyWithin is not a function");
        }
        var aryLength = this.length;
        if (targetIndex == null) {
            targetIndex = 0;
        } else if (targetIndex < 0) {
            targetIndex = aryLength + targetIndex;
        }
        if (srcStart == null) {
            srcStart = 0;
        } else if (srcStart < 0) {
            srcStart = aryLength + srcStart;
        }
        if (srcEnd == null) {
            srcEnd = aryLength;
        } else if (srcEnd < 0) {
            srcStart = aryLength + srcEnd;
        }
        if (srcStart >= srcEnd) {
            return this;
        }
        var list = [];
        for (var i = srcStart; i < srcEnd; i++) {
            list.push(this[i]);
        }
        var newLength = targetIndex + list.length;
        if (newLength > aryLength) {
            newLength = aryLength;
        }
        var j = 0;
        for (var i = targetIndex; i < newLength; i++) {
            this[i] = list[j++];
        }
        return this;
    };
}
if (typeof Array.prototype.keys != "function") {
    Array.prototype.keys = function() {
        var ArrayIterator = function() {

        }
        var p = new ArrayIterator();
        var inner;
        if (inner == null) {
            inner = {
                value : -1,
                done : false
            };
        }
        var _this = this;
        p.length = function() {
            return _this.length;
        }
        p.next = function() {
            if (inner.value != null) {
                inner.value++;
            }
            if (inner.value >= this.length()) {
                inner.done = true;
                inner.value = undefined;
            }
            return inner;
        }
        return p;
    }
}
if (typeof Array.prototype.entries != "function") {
    Array.prototype.entries = function() {
        var ArrayIterator = function() {

        }
        var p = new ArrayIterator();
        var inner;
        if (inner == null) {
            inner = {
                value : [ -1, undefined ],
                done : false
            };
        }
        var _this = this;
        p.length = function() {
            return _this.length;
        }
        p.cur = function(index) {
            return _this[index];
        }
        p.next = function() {
            if (inner.value != null) {
                if (inner.value[0] != null) {
                    inner.value[0]++;
                    inner.value[1] = this.cur(inner.value[0]);
                }
                if (inner.value[0] >= this.length()) {
                    inner.done = true;
                    inner.value = undefined;
                }
            }
            return inner;
        }
        return p;
    }
}
if (typeof Object.is != "function") {
    Object.prototype.is = function(obj1, obj2) {
        if(obj1 === 0 && obj2 === -0){
            return false;
        }
        if(obj1 === -0 && obj2===0){
            return false;
        }
        if(obj1 === 0 && obj2 === +0){
            return true;
        }
        if(obj1 === +0 && obj2 === -0){
            return false;
        }
        if(obj1 === -0 && obj2 === +0){
            return false;
        }
        if(obj1 === +0 && obj2 === 0){
            return true;
        }
        if(obj1 === 0 && obj2 === 0){
            return true;
        }
        if(obj1 == 0 && obj2 == 0){
            return true;
        }
        if((typeof obj1 == "string") && (typeof obj2 == "string")){
            if(obj1.length != obj2.length){
                return false;
            }
            for(var i = 0;i < obj1.length; i++){
                var asc1 = obj1.charCodeAt(i);
                var asc2 = obj2.charCodeAt(i);
                if(asc1 !== asc2){
                    return false;
                }
            }
            return true;
        }
        if(typeof obj1 == "number" && typeof obj2 == "number" && isNaN(obj1) && isNaN(obj2)){
            return true;
        }
        return obj1 === obj2;
    }
}
if (typeof Object.keys != "function") {
    Object.prototype.keys = function(obj) {
    	if(obj == null){
    		throw new Error("Uncaught TypeError: Cannot convert undefined or null to object");
    	}
    	if(typeof obj == "number" ){
            return [];
    	}
    	if(typeof obj == "string"){
            var result = [];
            for(var i = 0; i < obj.length; i++){
            	result.push(i + "");
            }
            return result;
    	}
        var list = [];
        for(var key in obj){
        	if(key != "is" && key != "keys" ){
        		list.push(key);
        	}
        }
        return list;
    }
}
if (Object.name === undefined) {
	Object.name = "Object";
}

/**
 * icewood提供了javascript操作的基础函数 <br/>
 * 
 * @author IceWater <br/>
 * @Email zxcyhn@126.com <br/>
 * @date 2017-03-02 <br/>
 * @version 1.0 <br/>
 */
var Ice = {
    /**
     * 替换字符串中的指定字符
     * 
     * @param str 原始字符串
     * @param oldStr 需要替换的旧字符
     * @param newStr 替换成的新字符
     * @return 替换后的字符
     */
    replace : function(str, oldStr, newStr) {
        if (str == null) {
            return null;
        }
        if (str === "" || oldStr == "" || oldStr == null || newStr == null) {
            return str;
        }
        var len = str.length - oldStr.length;
        var oldLength = oldStr.length;
        var sum = "";
        var end = false;
        for (var i = 0; i < str.length; i++) {
            if (i + oldLength <= str.length) {
                var strSub = str.substring(i, i + oldLength);
                if (strSub == oldStr) {
                    sum += newStr;
                    i += oldLength - 1;
                } else {
                    sum += str.charAt(i);
                }
            } else {
                sum += str.charAt(i);
            }
        }
        return sum;
    },
    /**
     * 根据 yyyy-MM-dd 形式的日期字符串创建日期
     * 
     * @param dateStr 日期字符串
     * @return 转换后的日期
     */
    newDate : function(dateStr) {
        return new Date(dateStr.replace(/-/g, "/"));
    },
    /**
     * 判断字符串是否为空
     * 
     * @param str 原始字符串
     * @return 字符串是否为空
     */
    isEmpty : function(str) {
        if (str == null || str == "") {
            return true;
        } else if (typeof str == "string") {
            return false;
        } else if (typeof str == "object" && typeof str.pop == "function") {
            if (str.length == 0) {
                return true;
            }
        }
        return false;
    },
    /**
     * 判断字符串是否不是为空
     * 
     * @param str 原始字符串
     * @return 字符串是否不是为空
     */
    isNotEmpty : function(str) {
        if (str == null || str == "") {
            return false;
        } else if (typeof str == "string") {
            return true;
        } else if (typeof str == "object" && typeof str.pop == "function") {
            if (str.length == 0) {
                return false;
            }
        }
        return true;
    },
    /**
     * 判断字符串是否为空白
     * 
     * @param str 原始字符串
     * @return 字符串是否为空白
     */
    isBlank : function(str) {
        if (str == null || str == "") {
            return true;
        } else {
            return new RegExp("^\\s+$").test(str);
        }
    },
    /**
     * 判断字符串是否不是空白
     * 
     * @param str 原始字符串
     * @return 字符串是否不是空白
     */
    isNotBlank : function(str) {
        if (str == null || str == "") {
            return false;
        } else {
            return !new RegExp("^\\s+$").test(str);
        }
    },
    /**
     * 移除指定字符串开始的字符串
     * 
     * @param str 原始字符串
     * @param prefix 指定的开始字符串
     * @return 去掉开始字符串后的字符串
     */
    removeStart : function(str, prefix) {
        if (str.length >= prefix.length) {
            var first = str.substring(0, prefix.length);
            if (first == prefix) {
                return str.substring(prefix.length);
            }
        }
        return str;
    },
    /**
     * 移除指定字符串结尾的字符串
     * 
     * @param str 原始字符串
     * @param suffix 指定的结束字符串
     * @return 去掉结束字符串后的字符串
     */
    removeEnd : function(str, suffix) {
        var endLength = suffix.length;
        var strLength = str.length;
        if (str.length >= endLength) {
            var last = str.substring(strLength - endLength);
            if (last == suffix) {
                return str.substring(0, strLength - endLength);
            }
        }
        return str;
    },
    /**
     * 使用逗号拆分字符串,并去掉每个字符串前后的空格
     * 
     * @param str 原始字符串
     * @return 拆分后的字符串
     */
    splitTrim : function(str) {
        if (str == null) {
            return null;
        }
        if (str == "") {
            return "";
        }
        var ary = str.split(",");
        var aryLength = ary.length;
        var result = new Array(aryLength);
        for (var i = 0; i < aryLength; i++) {
            var simple = ary[i];
            result[i] = simple.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        }
        return result;
    },
    /**
     * 判断url是否以http或https开头
     * 
     * @param str 原始字符串
     * @return 字符串是否以 http 或 https 开头
     */
    startHttp : function(str) {
        if (str == null) {
            return false;
        }
        if (str.length < 7) {// "http://".length
            return false;
        }
        if (str == "http://") {
            return true;
        }
        if (str.length == 7) {
            return false;
        }
        if (str.substring(0, 7) == "http://") {
            return true;
        }
        if (str.substring(0, 8) == "https://") {
            return true;
        }
        return false;
    },
    /**
     * 两个数字相加(传入的参数可以是字符串形式)
     * 
     * @param num1 第一个加数
     * @param num2 第二个加数
     * @return 两个数字相加的和
     */
    add : function(num1, num2) {
        function toNum(numStr) {
            if (numStr == null) {
                return 0;
            }
            if (typeof numStr == "number") {
                return numStr;
            } else if (typeof numStr == "string") {
                if (numStr.indexOf(".")) {
                    if (new RegExp(/^(-?\d+)(\.\d+)?$/).test(numStr)) {
                        return parseFloat(numStr);
                    } else {
                        return numStr;
                    }
                } else {
                    if (new RegExp(/^-?\d+$/).test(numStr)) {
                        return parseInt(numStr);
                    } else {
                        return numStr;
                    }
                }
            } else {
                return "";
            }
        }
        if (num1 == null) {
            if (num2 == null) {
                return null;
            } else {
                return toNum(num2);
            }
        } else {
            if (num2 == null) {
                return toNum(num1);
            } else {
                return toNum(num1) + toNum(num2);
            }
        }
    },
    /**
     * 判断字符串是否为数字
     * 
     * @param numStr 原始字符串
     * @return 字符串是否为数字
     */
    isNum : function(numStr) {
        if (typeof numStr == "string") {
            return new RegExp(/^\d+$/).test(numStr);
        } else if (typeof numStr == "number") {
            return numStr >= 0 && numStr != Infinity
                    && (numStr + "").indexOf(".") == -1;
        } else {
            return false;
        }
    },
    /**
     * 数组去除重复
     * 
     * @param ary 原始数组
     * @return 去除重复后的数组
     */
    distinct : function(ary) {
        if (ary == null) {
            return null;
        }
        if (typeof ary == "string") {
            return ary;
        }
        if (ary.length == null) {
            return ary;
        }
        var result = [];
        for (var i = 0; i < ary.length; i++) {
            var has = false;
            var cur = ary[i];
            for (var j = 0; j < result.length; j++) {
                if (cur == result[j]) {
                    has = true;
                }
            }
            if (!has) {
                result.push(cur);
            }
        }
        return result;
    },
    /**
     * 取出数组中所有元素的指定属性
     * 
     * @param ary 原始数组
     * @param key 属性名称
     * @return 所有元素指定属性形成的新数组
     */
    prop : function(ary, key) {
        if (ary == null) {
            return null;
        }
        if (typeof ary == "string" || typeof ary == "number") {
            return null;
        }
        if (typeof ary == "object" && ary.length == null) {
            return ary[key];
        }
        var result = [];
        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            if (cur == null) {
                result.push(null);
            } else if (typeof cur == "object") {
                result.push(cur[key]);
            } else {
                result.push(null);
            }
        }
        return result;
    },
    /**
     * 去除数组中的所有空元素
     * 
     * @param ary 原始数组
     * @return 去除空元素后的数组
     */
    removeEmpty : function(ary) {
        if (ary == null) {
            return null;
        }
        if (typeof ary == "string" || typeof ary == "number"
                || ary.length == null) {
            return ary;
        }
        var result = [];
        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            if (cur != null && cur != "") {
                result.push(cur);
            }
        }
        return result;
    },
    /**
     * 对数组进行排序(按照空在前,数字在中间,字符串在最后的顺序)
     * 
     * @param ary 原始数组
     * @return 排序后的数组
     */
    sort : function(ary) {
        if (ary == null) {
            return null;
        }
        if (typeof ary == "string" || typeof ary == "number"
                || ary.length == null) {
            return ary;
        }
        function isDouble(numStr) {
            return new RegExp(/^(-?\d+)(\.\d+)?$/).test(numStr);
        }
        for (var i = 0; i < ary.length - 1; i++) {
            for (j = i + 1; j < ary.length; j++) {
                var curOut = ary[i];
                var curIn = ary[j];
                var swap = false;
                if (curOut === undefined && curIn === null) {
                    swap = true;
                } else if (curOut != null && curIn == null) {
                    swap = true;
                } else if (isDouble(curOut) && isDouble(curIn)) {
                    var num1 = parseFloat(curOut);
                    var num2 = parseFloat(curIn);
                    if (num1 > num2) {
                        swap = true;
                    }
                } else if (curOut == null && isDouble(curIn)) {
                    swap = false;
                } else if (curOut == "" && isDouble(curIn)) {
                    swap = false;
                } else if (!isDouble(curOut) && isDouble(curIn)) {
                    swap = true;
                } else if (isDouble(curOut) && curIn == null) {
                    swap = true;
                } else if (isDouble(curOut) && curIn == "") {
                    swap = true;
                } else if (curOut == null && isDouble(curIn)) {
                    swap = false;
                } else if (isDouble(curOut) && !isDouble(curIn)) {
                    swap = false;
                } else if (curOut > curIn) {
                    swap = true;
                }
                if (swap) {
                    var temp = curOut;
                    ary[i] = curIn;
                    ary[j] = temp;
                }
            }
        }
        return ary;
    },
    /**
     * 复制数组
     * 
     * @param ary 原始数组
     * @return 复制后的新数组
     */
    copy : function(ary) {
        if (ary == null) {
            return null;
        }
        if (typeof ary == "string" || typeof ary == "number"
                || ary.length == null) {
            return ary;
        }
        var len = ary.length;
        var result = new Array(len);
        for (var i = 0; i < len; i++) {
            result[i] = ary[i];
        }
        return result;
    },
    /**
     * 取出数组中的第一个元素
     * 
     * @param ary 原始数组
     * @return 数组中的第一个元素
     */
    first : function(ary) {
        if (ary == null) {
            return null;
        }
        if (typeof ary == "string" || typeof ary == "number"
                || ary.length == null) {
            return ary;
        }
        if (ary.length > 0) {
            return ary[0];
        } else {
            return null;
        }
    },
    /**
     * 获取当前时间(格式: yyyy-MM-dd HH:mm:ss)
     * 
     * @return 当前时间字符串
     */
    now : function() {
        var now = new Date();
        var sum = "";
        var year = now.getFullYear();
        var month = now.getMonth();
        var date = now.getDate();
        var hour = now.getHours();
        var mintue = now.getMinutes();
        var second = now.getSeconds();
        var millisecond = now.getMilliseconds();
        sum += year;
        sum += "-";
        month++;
        if (month < 10) {
            sum += "0";
        }
        sum += month;
        sum += "-";
        if (date < 10) {
            sum += "0";
        }
        sum += date;
        sum += " ";
        if (hour < 10) {
            sum += "0";
        }
        sum += hour;
        sum += ":";
        if (mintue < 10) {
            sum += "0";
        }
        sum += mintue;
        sum += ":";
        if (second < 10) {
            sum += "0";
        }
        sum += second;
        return sum;
    },
    /**
     * 获取从左边查找指定字符串左边的字符串
     * 
     * @param str 指定字符串
     * @param sub 需要查找的字符串
     * @return 截取后的新字符串
     */
    getLeftFromLeft : function(str, sub) {
        if (str == null || str == "" || sub == null || sub == "") {
            return str;
        }
        var index = str.indexOf(sub);
        if (index != -1) {
            return str.substring(0, index);
        } else {
            return str;
        }
    },
    /**
     * 获取从右边查找指定字符串左边的字符串
     * 
     * @param str 指定字符串
     * @param sub 需要查找的字符串
     * @return 截取后的新字符串
     */
    getLeftFromRight : function(str, sub) {
        if (str == null || str == "" || sub == null || sub == "") {
            return str;
        }
        var index = str.lastIndexOf(sub);
        if (index != -1) {
            return str.substring(0, index);
        } else {
            return str;
        }
    },
    /**
     * 获取从左边查找指定字符串右边的字符串
     * 
     * @param str 指定字符串
     * @param sub 需要查找的字符串
     * @return 截取后的新字符串
     */
    getRightFromLeft : function(str, sub) {
        if (str == null || str == "" || sub == null || sub == "") {
            return str;
        }
        var index = str.indexOf(sub);
        if (index != -1) {
            return str.substring(index + sub.length);
        } else {
            return str;
        }
    },
    /**
     * 获取从右边查找指定字符串右边的字符串
     * 
     * @param str 指定字符串
     * @param sub 需要查找的字符串
     * @return 截取后的新字符串
     */
    getRightFromRight : function(str, sub) {
        if (str == null || str == "" || sub == null || sub == "") {
            return str;
        }
        var index = str.lastIndexOf(sub);
        if (index != -1) {
            return str.substring(index + sub.length);
        } else {
            return str;
        }
    },
    /**
     * 查找指定的两个字符串中间的字符串(左边分隔符从左找,右边分隔符从右找)
     * 
     * @param str 原始字符串
     * @param left 左边分隔符
     * @param right 右边分隔符
     * @return 截取的中间的字符串
     */
    between : function(str, left, right) {
        if (str == null || str == "") {
            return str;
        }
        if (left == null || left == "") {
            return str;
        }
        if (right == null || right == "") {
            return str;
        }
        var leftIndex = str.indexOf(left);
        var rightIndex = str.lastIndexOf(right);
        if (leftIndex == -1) {
            if (rightIndex == -1) {
                return str;
            } else {
                return str.substring(0, rightIndex);
            }
        } else {
            if (rightIndex == -1) {
                return str.substring(leftIndex + left.length);
            } else {
                return str.substring(leftIndex + left.length, rightIndex);
            }
        }
    },
    /**
     * 时间(HH:mm:ss格式)转换为秒数
     * 
     * @param timeStr 时间字符串
     * @return 转换后的秒数
     */
    time2second : function(timeStr) {
        if (timeStr == null || timeStr == "") {
            return 0;
        }
        var ary = timeStr.split(":");
        var aryLength = ary.length;
        var hour = 0;
        var minute = 0;
        var second = 0;
        if (aryLength == 2) {
            minute = parseInt(ary[0]);
            second = parseInt(ary[1]);
        } else if (aryLength >= 3) {
            hour = parseInt(ary[aryLength - 3]);
            minute = parseInt(ary[aryLength - 2]);
            second = parseInt(ary[aryLength - 1]);
        } else if (aryLength == 1) {
            second = parseInt(ary[0]);
        }
        return hour * 3600 + minute * 60 + second;
    },
    /**
     * 秒数转为时间字符串
     * 
     * @param seconds 需要转换的秒数
     * @return 转换后的时间字符串(HH:mm:ss格式)
     */
    second2time : function(seconds) {
        if (seconds == null || seconds == "") {
            return "00:00:00";
        }
        var hour = parseInt(seconds / 3600);
        var minute = parseInt(seconds % 3600 / 60);
        var second = seconds % 60;
        var sum = "";
        if (hour < 10) {
            sum += "0";
        }
        sum += hour;
        sum += ":";
        if (minute < 10) {
            sum += "0";
        }
        sum += minute;
        sum += ":";
        if (second < 10) {
            sum += "0";
        }
        if (second % 1 == 0) {
            sum += second;
        } else {
            sum += second.toFixed(3);
        }
        return sum;
    },
    /**
     * 根据id获取html对象(#号可以省略)
     * 
     * @param mark html元素标示(一般为id)
     * @return 获取的html对象
     */
    getEle : function(mark) {
        if (mark == null || mark == "") {
            return null;
        }
        var firstChar = mark.charAt(0);
        if (firstChar == "#") {
            var id = mark.substring(1);
            return document.getElementById(id);
        } else if (firstChar == ".") {
            var clas = mark.substring(1);
            if (typeof document.getElementsByClassName == "function") {
                return document.getElementsByClassName(clas);
            } else {
                var all = document.getElementsByTagName("*");
                var list = [];
                for (var i = 0; i < all.length; i++) {
                    var cur = all[i];
                    if (cur.nodeType == 1) {
                        var ary = cur.className.split(/\s+/);
                        for (var j = 0; j < ary.length; j++) {
                            if (clas == ary[j]) {
                                list.push(cur);
                            }
                        }
                    }
                }
                return list;
            }
        } else {
            var obj = document.getElementById(mark);
            if (obj != null) {
                return obj;
            } else {
                return document.getElementsByTagName(mark);
            }
        }
    },
    /**
     * 获取url的扩展名
     * 
     * @param url 原始路径
     * @return 从路径中获取的扩展名
     */
    getExtension : function(url) {
        if (url == null || url == "") {
            return null;
        }
        var slashIndex = url.lastIndexOf("/");
        var pointIndex = url.lastIndexOf(".");
        if (slashIndex == -1) {
            if (pointIndex == -1) {
                return null;
            } else {
                return url.substring(pointIndex + 1);
            }
        } else {
            if (pointIndex == -1) {
                return null;
            } else {
                if (pointIndex < slashIndex) {
                    return null;
                } else {
                    return url.substring(pointIndex + 1);
                }
            }
        }
    },
    /**
     * 将url转为map对象
     * 
     * @param url 原始路径
     * @return 转换后的参数map对象
     */
    param2map: function(url){
        if(url == null){
            return null;
        }
        if(url == ""){
            return "";
        }
        var questionIndex = url.indexOf("?");
        var paramStr = url;
        if(questionIndex != -1){
            paramStr = url.substring(questionIndex + 1);
        }
        var pairs = paramStr.split("&");
        var map = {};
        for(var i = 0; i < pairs.length; i++){
            var pair = pairs[i];
            if(pair != null && pair != ""){
                var equalsIndex = pair.indexOf("=");
                var key = null;
                var value = null;
                if(equalsIndex != -1){
                    key = pair.substring(0, equalsIndex);
                    value = pair.substring(equalsIndex + 1);
                }
                if(key != null && key != ""){
                    key = key.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
                }
                if(value != null && value != ""){
                    value = value.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
                }
                if(key != null && key != ""){
                    map[key] = value;
                }
            }
        }
        return map;
    }
};
