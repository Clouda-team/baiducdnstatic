/**
 * Simple AMD Loader
 * A subset of Asynchronous Module Definition (AMD) API
 * Baidu LightApp Loader Provider
 *
 * @create: 2014.11.3
 * @update: 2014.12.4
 * @author: enimo <enimong@gmail.com>
 * @see: define, require, requirejs
 * AMD Draft: https://github.com/amdjs/amdjs-api/wiki/AMD
 * @formatter & jslint: fecs xx.js --check
 */

(function(win, doc) {

    var require;
    var define;
    var _op = Object.prototype;
    var _os = _op.toString;

    var _moduleMap = {};
    var _loadedMap = {};
    var _loadingMap = {};
    var _definedStack = [];
    var _anonymousId = 0;
    var env = {debug: 1, ts: 0};

    if (typeof win._define_ !== 'undefined' && typeof win._require_ !== 'undefined') {
        return;
    }

    /**
     * @description Define function implement
     *
     * @param {string} id 模块名
     * @param {Array} deps 依赖模块
     * @param {Function} factory 模块函数
     * @access public
    **/
    define = function(id, deps, factory) {
        if (hasProp(_moduleMap, id)) {
            return;
        }
        if (isFunction(id) || isArray(id) || isObject(id)) {
            var modName = '_anonymous_mod_' + _anonymousId++;
            if (arguments.length === 1) {
                factory = id;
                deps = null;
            } else if (arguments.length === 2) {
                factory = deps;
                deps = id;
            }
            id = modName;
        } else if (isFunction(deps) && arguments.length === 2) {
            factory = deps;
            deps = null;
        }
        _moduleMap[id] = {
            id: id,
            deps: deps,
            factory: factory
        };
        _definedStack.push(id);

    };

    /**
     * @description require function implement
     *
     * @param {Array} deps 依赖模块
     * @param {Function} callback 回调函数
     * @access public
     * @return {Void}
    **/
    require = function(deps, callback) {
        if (typeof deps === 'string') {
            deps = [deps];
        }
        if (deps.length === 1 && arguments.length === 1) {
            return require.sync(deps.join(''));
        }

        var loadDeps = filterLoadDeps(deps);
        var depsLen = loadDeps.length;
        var loadCount = depsLen;
        if (depsLen) {
            for (var i = 0; i < depsLen; i++) {
                var depModName = loadDeps[i];
                loadResources(depModName, modResolved);
            }
        }
        else {
            allResolved();
        }

        function modResolved(modName) {
            var mod = getModule(modName) || {};
            var filterDeps = [];
            var filterLen = 0;
            if (hasProp(mod, 'deps') && mod.deps) {
                filterDeps = filterLoadDeps(mod.deps);
                filterLen = filterDeps.length;
            }
            if (filterLen > 0) {
                loadCount += filterLen - 1;
                for (var i = 0; i < filterLen; i++) {
                    var dep = filterDeps[i];
                    loadResources(dep, arguments.callee);
                }
            }
            else {
                if (--loadCount <= 0) {
                    allResolved();
                }
            }
        }

        function allResolved() {
            var exports = [];
            for (var index = 0; index < depsLen; index++) {
                exports.push(require.sync(deps[index]));
            }
            callback && callback.apply(undefined, exports);
            exports = null;
        }
    };

    /**
     * @description require function implement
     * 兼容CMD同步调用:
     *    var mod = require.sync("mod");
     *
     * @param {string} id 依赖模块
     * @access public
     * @return {Void}
    **/
    require.sync = function(id) {
        var module;
        var exports;
        var deps;
        var args = [];

        if (!hasProp(_moduleMap, id)) {
            throw new Error('Required unknown module, id: "' + id + '"');
        }

        module = getModule(id) || {};
        if (hasProp(module, 'exports')) {
            return module.exports;
        }
        module.exports = exports = {};
        deps =  module.deps;
        if (deps) {
            for (var depsLen = deps.length, i = 0; i < depsLen; i++) {
                var dep = deps[i];
                args.push(dep === 'require' ?
                    require : (dep === 'module' ?
                        module : (dep === 'exports' ? exports : require.sync(dep))
                    )
                );
            }
        }

        if (isObject(module.factory)) {
            module.exports = module.factory;
        }
        else if (isFunction(module.factory)) {
            var ret = module.factory.apply(undefined, args);
            if (ret !== undefined && ret !== exports) {
                module.exports = ret;
            }
        }
        return module.exports;
    };


    /**
     * @description 根据唯一的url地址加载js文件
     * @param {string} url load script uri
     * @param {Function} callback callback after loaded
    **/
    function loadScript(url, callback) {
        if (hasProp(_loadedMap, url)) {
            callback && callback();
        }
        else if (hasProp(_loadingMap, url)) {
            _loadingMap[url] = _loadingMap[url] || [];
            _loadingMap[url].push(callback);
        }
        else {
            _loadingMap[url] = [];
            var _head = doc.getElementsByTagName('head')[0];
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.setAttribute('_md_', '_anymoore_' + url);
            _head.appendChild(script);

            if (isFunction(callback)) {
                if (doc.addEventListener) {
                    script.addEventListener('load', onload, false);
                }
                else {
                    script.onreadystatechange = function() {
                        if (/loaded|complete/.test(script.readyState)) {
                            script.onreadystatechange = null;
                            onload();
                        }
                    };
                }
            }
        }

        function onload() {
            _loadedMap[url] = true;
            if (!env.debug) {
                _head.removeChild(script);
            }

            var pathId = url.slice(0, -3);
            var modName = _definedStack.pop();
            var mod = _moduleMap[modName];

            if (mod && pathId !== modName) {
                _moduleMap[pathId] = {alias: modName};
            }
            script = null;

            var cbStack = _loadingMap[url] || [];
            var cb = null;
            if (cbStack.length > 0) {
                while (cb = cbStack.shift()) {
                    cb && cb();
                }
                _loadingMap[url] = null;
            }
            callback && callback();
        }
    }

    /**
     * @description 根据给出depModName模块名，加载对应资源，根据是否在clouda环境中使用不同加载方式以及是否处理合并关系
     * @param {string} depModName Depends module name
     * @param {Function} callback callbak after loaded
    **/
    function loadResources(depModName, callback) {
        var url = null;
        if (depModName) {
            var realId = realpath(depModName);
            url = (realId.slice(-3) !== '.js') ? (realId + '.js') : realId;
        }
        url && loadScript(url, function() {
            callback(depModName);
        });
    }

    /**
     * @description 加载deps资源时过滤保留id: module, require, exports
     * @param {Array} depsMod Depends modules
     * @return {Array} filterDeps
    **/
    function filterLoadDeps(depsMod) {
        var filterDeps = [];
        if (depsMod && depsMod.length > 0) {
            for (var i = 0, len = depsMod.length; i < len; i++) {
                if (depsMod[i] !== 'require' && depsMod[i] !== 'exports' && depsMod[i] !== 'module') {
                    filterDeps.push(depsMod[i]);
                }
            }
        }
        return filterDeps;
    }

    /**
     * @description 根据模块id获取模块实体对象
     * @param {string} id mod id
     * @return {Object} module
    **/
    function getModule(id) {
        if (!id || !hasProp(_moduleMap, id)) {
            log('%c_moduleMap中不存在该模块: "' + id + '"', 'color:red');
            return false;
        }
        var module = _moduleMap[id];
        if (hasProp(module, 'alias')) {
            module = _moduleMap[module.alias];
        }
        return module;
    }

    /**
     * @description Same as php realpath, 生成绝对路径
     * @param {string} path relative path
     * @return {string} realpath
    **/
    function realpath(path) {
        var arr = [];
        if (path.indexOf('://') !== -1) {
            return path;
        }
        arr = path.split('/');
        path = [];
        for (var k = 0, len = arr.length; k < len; k++) {
            if (arr[k] === '.') {
                continue;
            }
            if (arr[k] === '..') {
                if (path.length >= 2) {
                    path.pop();
                }
            }
            else {
                if (!path.length || (arr[k] !== '')) {
                    path.push(arr[k]);
                }
            }
        }
        path = path.join('/');
        /* return path.indexOf('/') === 0 ? path : '/' + path; //暂时不在path前加'/' */
        return path;
    }

    /**
     * @description Helper function, same as: 1,prop in obj; 2,key_exists(); 3.obj[prop]
     * @param {Object} obj original object
     * @param {string} prop property to check
     * @return {boolean}
    **/
    function hasProp(obj, prop) {
        return _op.hasOwnProperty.call(obj, prop);
    }

    function isFunction(obj) {
        return _os.call(obj) === '[object Function]';
    }

    function isArray(obj) {
        return _os.call(obj) === '[object Array]';
    }

    function isObject(obj) {
        return _os.call(obj) === '[object Object]';
    }

    function log() {
        if (!env.debug) {
            return;
        }
        var apc = Array.prototype.slice;
        win.console && win.console.log.apply(console, apc.call(arguments));
    }

    /*防止污染用户后加载的AMD/CMD加载器，统一先使用: _define_, _require_*/
    win._define_ = define;
    win._require_ = require;

    /*测试阶段，如果没有加载过requirejs之类，可直接暴露到window*/
    if (env.debug && typeof win.define === 'undefined') {
        win.define = win._define_;
        win.require = win._require_;
    }

    define.amd = {};
    define.version = '0.9.0';

})(window, document);
