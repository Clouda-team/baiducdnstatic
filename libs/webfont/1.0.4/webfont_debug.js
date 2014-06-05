/*
 * Copyright 2010 Small Batch, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
webfont = {};

webfont.bind = function(context, func, opt_args) {
  var args = arguments.length > 2 ?
      Array.prototype.slice.call(arguments, 2) : [];

  return function() {
    args.push.apply(args, arguments);
    return func.apply(context, args);
  };
};

webfont.DomHelper = function(doc, userAgent) {
  this.document_ = doc;
  this.userAgent_ = userAgent;
};

webfont.DomHelper.prototype.createElement = function(elem, opt_attr,
    opt_innerHtml) {
  var domElement = this.document_.createElement(elem);

  if (opt_attr) {
    for (var attr in opt_attr) {
      // protect against native prototype augmentations
      if (opt_attr.hasOwnProperty(attr)) {
        if (attr == "style" && this.userAgent_.getName() == "MSIE") {
          domElement.style.cssText = opt_attr[attr];
        } else {
          domElement.setAttribute(attr, opt_attr[attr]);
        }
      }
    }
  }
  if (opt_innerHtml) {
    domElement.appendChild(this.document_.createTextNode(opt_innerHtml));
  }
  return domElement;
};

webfont.DomHelper.prototype.insertInto = function(tagName, e) {
  var t = this.document_.getElementsByTagName(tagName)[0];

  if (!t) { // opera allows documents without a head
    t = document.documentElement;
  }

  if (t && t.lastChild) {
    // This is safer than appendChild in IE. appendChild causes random
    // JS errors in IE. Sometimes errors in other JS exectution, sometimes
    // complete 'This page cannot be displayed' errors. For our purposes,
    // it's equivalent because we don't need to insert at any specific
    // location.
    t.insertBefore(e, t.lastChild);
    return true;
  }
  return false;
};

webfont.DomHelper.prototype.whenBodyExists = function(callback) {
  var check = function() {
    if (document.body) {
      callback();
    } else {
      setTimeout(check, 0);
    }
  }
  check();
};

webfont.DomHelper.prototype.removeElement = function(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
    return true;
  }
  return false;
};

webfont.DomHelper.prototype.createCssLink = function(src) {
  return this.createElement('link', {
    'rel': 'stylesheet',
    'href': src
  });
};

webfont.DomHelper.prototype.createScriptSrc = function(src) {
  return this.createElement('script', {
    'src': src
  });
};

webfont.DomHelper.prototype.appendClassName = function(e, name) {
  var classes = e.className.split(/\s+/);
  for (var i = 0, len = classes.length; i < len; i++) {
    if (classes[i] == name) {
      return;
    }
  }
  classes.push(name);
  e.className = classes.join(' ').replace(/^\s+/, '');
};

webfont.DomHelper.prototype.removeClassName = function(e, name) {
  var classes = e.className.split(/\s+/);
  var remainingClasses = [];
  for (var i = 0, len = classes.length; i < len; i++) {
    if (classes[i] != name) {
      remainingClasses.push(classes[i]);
    }
  }
  e.className = remainingClasses.join(' ').replace(/^\s+/, '')
      .replace(/\s+$/, '');
};

webfont.UserAgent = function(name, version, engine, engineVersion, platform,
    webFontSupport) {
  this.name_ = name;
  this.version_ = version;
  this.engine_ = engine;
  this.engineVersion_ = engineVersion;
  this.platform_ = platform;
  this.webFontSupport_ = webFontSupport;
};

webfont.UserAgent.prototype.getName = function() {
  return this.name_;
};

webfont.UserAgent.prototype.getVersion = function() {
  return this.version_;
};

webfont.UserAgent.prototype.getEngine = function() {
  return this.engine_;
};

webfont.UserAgent.prototype.getEngineVersion = function() {
  return this.engineVersion_;
};

webfont.UserAgent.prototype.getPlatform = function() {
  return this.platform_;
};

webfont.UserAgent.prototype.isSupportingWebFont = function() {
  return this.webFontSupport_;
};

webfont.UserAgentParser = function(userAgent) {
  this.userAgent_ = userAgent;
};

webfont.UserAgentParser.UNKNOWN = "Unknown";

webfont.UserAgentParser.UNKNOWN_USER_AGENT = new webfont.UserAgent(webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN, webfont.UserAgentParser.UNKNOWN, false);

webfont.UserAgentParser.prototype.parse = function() {
  if (this.isIe_()) {
    return this.parseIeUserAgentString_();
  } else if (this.isOpera_()) {
    return this.parseOperaUserAgentString_();
  } else if (this.isWebKit_()) {
    return this.parseWebKitUserAgentString_();
  } else if (this.isGecko_()) {
    return this.parseGeckoUserAgentString_();
  } else {
    return webfont.UserAgentParser.UNKNOWN_USER_AGENT;
  }
};

webfont.UserAgentParser.prototype.getPlatform_ = function() {
  var mobileOs = this.getFirstMatchingGroup_(this.userAgent_,
      /(iPod|iPad|iPhone|Android)/);

  if (mobileOs != "") {
    return mobileOs;
  }
  var os = this.getFirstMatchingGroup_(this.userAgent_,
      /(Linux|Mac_PowerPC|Macintosh|Windows)/);

  if (os != "") {
    if (os == "Mac_PowerPC") {
      os = "Macintosh";
    }
    return os;
  }
  return webfont.UserAgentParser.UNKNOWN;
};

webfont.UserAgentParser.prototype.isIe_ = function() {
  return this.userAgent_.indexOf("MSIE") != -1;
};

webfont.UserAgentParser.prototype.parseIeUserAgentString_ = function() {
  var browser = this.getFirstMatchingGroup_(this.userAgent_, /(MSIE [\d\w\.]+)/);
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;

  if (browser != "") {
    var pair = browser.split(' ');
    var name = pair[0];
    var version = pair[1];

    // For IE we give MSIE as the engine name and the version of IE
    // instead of the specific Trident engine name and version
    return new webfont.UserAgent(name, version, name, version,
        this.getPlatform_(), this.getMajorVersion_(version) >= 6);
  }
  return new webfont.UserAgent("MSIE", webfont.UserAgentParser.UNKNOWN,
      "MSIE", webfont.UserAgentParser.UNKNOWN, this.getPlatform_(), false);
};

webfont.UserAgentParser.prototype.isOpera_ = function() {
  return this.userAgent_.indexOf("Opera") != -1;
};

webfont.UserAgentParser.prototype.parseOperaUserAgentString_ = function() {
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;
  var enginePair = this.getFirstMatchingGroup_(this.userAgent_,
      /(Presto\/[\d\w\.]+)/);

  if (enginePair != "") {
    var splittedEnginePair = enginePair.split('/');

    engineName = splittedEnginePair[0];
    engineVersion = splittedEnginePair[1];
  } else {
    if (this.userAgent_.indexOf("Gecko") != -1) {
      engineName = "Gecko";
    }
    var geckoVersion = this.getFirstMatchingGroup_(this.userAgent_, /rv:([^\)]+)/);

    if (geckoVersion != "") {
      engineVersion = geckoVersion;
    }
  }
  if (this.userAgent_.indexOf("Version/") != -1) {
    var version = this.getFirstMatchingGroup_(this.userAgent_, /Version\/([\d\.]+)/);

    if (version != "") {
      return new webfont.UserAgent("Opera", version, engineName, engineVersion,
          this.getPlatform_(), this.getMajorVersion_(version) >= 10);
    }
  }
  var version = this.getFirstMatchingGroup_(this.userAgent_, /Opera[\/ ]([\d\.]+)/);

  if (version != "") {
    return new webfont.UserAgent("Opera", version, engineName, engineVersion,
        this.getPlatform_(), this.getMajorVersion_(version) >= 10);
  }
  return new webfont.UserAgent("Opera", webfont.UserAgentParser.UNKNOWN,
      engineName, engineVersion, this.getPlatform_(), false);
};

webfont.UserAgentParser.prototype.isWebKit_ = function() {
  return this.userAgent_.indexOf("AppleWebKit") != -1;
};

webfont.UserAgentParser.prototype.parseWebKitUserAgentString_ = function() {
  var platform = this.getPlatform_();
  var webKitVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /AppleWebKit\/([\d\.\+]+)/);

  if (webKitVersion == "") {
    webKitVersion = webfont.UserAgentParser.UNKNOWN;
  }
  var name = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Chrome") != -1) {
    name = "Chrome";
  } else if (this.userAgent_.indexOf("Safari") != -1) {
    name = "Safari";
  }
  var version = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Version/") != -1) {
    version = this.getFirstMatchingGroup_(this.userAgent_,
        /Version\/([\d\.\w]+)/);
  } else if (name == "Chrome") {
    version = this.getFirstMatchingGroup_(this.userAgent_,
        /Chrome\/([\d\.]+)/);
  }
  var minor = this.getFirstMatchingGroup_(webKitVersion, /\d+\.(\d+)/);

  return new webfont.UserAgent(name, version, "AppleWebKit", webKitVersion,
      platform, this.getMajorVersion_(webKitVersion) >= 526 ||
      this.getMajorVersion_(webKitVersion) >= 525 && parseInt(minor) >= 13);
};

webfont.UserAgentParser.prototype.isGecko_ = function() {
  return this.userAgent_.indexOf("Gecko") != -1;
};

webfont.UserAgentParser.prototype.parseGeckoUserAgentString_ = function() {
  var name = webfont.UserAgentParser.UNKNOWN;
  var version = webfont.UserAgentParser.UNKNOWN;
  var supportWebFont = false;

  if (this.userAgent_.indexOf("Firefox") != -1) {
    name = "Firefox";
    var versionNum = this.getFirstMatchingGroup_(this.userAgent_,
        /Firefox\/([\d\w\.]+)/);

    if (versionNum != "") {
      var minor = this.getFirstMatchingGroup_(versionNum, /\d+\.(\d+)/);

      version = versionNum;
      supportWebFont = versionNum != "" && this.getMajorVersion_(versionNum) >= 3 &&
          parseInt(minor) >= 5;
    }
  } else if (this.userAgent_.indexOf("Mozilla") != -1) {
    name = "Mozilla";
  }
  var geckoVersion = this.getFirstMatchingGroup_(this.userAgent_, /rv:([^\)]+)/);

  if (geckoVersion == "") {
    geckoVersion = webfont.UserAgentParser.UNKNOWN;
  } else {
    if (!supportWebFont) {
      var majorVersion = this.getMajorVersion_(geckoVersion);
      var intMinorVersion = parseInt(this.getFirstMatchingGroup_(geckoVersion, /\d+\.(\d+)/));
      var subVersion = parseInt(this.getFirstMatchingGroup_(geckoVersion, /\d+\.\d+\.(\d+)/));

      supportWebFont = majorVersion > 1 ||
          majorVersion == 1 && intMinorVersion > 9 ||
          majorVersion == 1 && intMinorVersion == 9 && subVersion >= 2 ||
          geckoVersion.match(/1\.9\.1b[123]/) != null ||
          geckoVersion.match(/1\.9\.1\.[\d\.]+/) != null;
    }
  }
  return new webfont.UserAgent(name, version, "Gecko", geckoVersion,
      this.getPlatform_(), supportWebFont);
};

webfont.UserAgentParser.prototype.getMajorVersion_ = function(version) {
  var majorVersion = this.getFirstMatchingGroup_(version, /(\d+)/);

  if (majorVersion != "") {
    return parseInt(majorVersion);
  }
  return -1;
};

webfont.UserAgentParser.prototype.getFirstMatchingGroup_ = function(str,
    regexp) {
  var groups = str.match(regexp);

  if (groups && groups[1]) {
    return groups[1];
  }
  return "";
};

webfont.EventDispatcher = function(domHelper, htmlElement, callbacks,
    opt_namespace) {
  this.domHelper_ = domHelper;
  this.htmlElement_ = htmlElement;
  this.callbacks_ = callbacks;
  this.namespace_ = opt_namespace || webfont.EventDispatcher.DEFAULT_NAMESPACE;
  this.cssClassName_ = new webfont.CssClassName('-');
};

webfont.EventDispatcher.DEFAULT_NAMESPACE = 'wf';
webfont.EventDispatcher.LOADING = 'loading';
webfont.EventDispatcher.ACTIVE = 'active';
webfont.EventDispatcher.INACTIVE = 'inactive';
webfont.EventDispatcher.FONT = 'font';

webfont.EventDispatcher.prototype.dispatchLoading = function() {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.dispatch_(webfont.EventDispatcher.LOADING);
};

webfont.EventDispatcher.prototype.dispatchFontLoading = function(fontFamily, fontDescription) {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.LOADING, fontFamily, fontDescription);
};

webfont.EventDispatcher.prototype.dispatchFontActive = function(fontFamily, fontDescription) {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.ACTIVE));
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.ACTIVE, fontFamily, fontDescription);
};

webfont.EventDispatcher.prototype.dispatchFontInactive = function(fontFamily, fontDescription) {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.INACTIVE));
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.INACTIVE, fontFamily, fontDescription);
};

webfont.EventDispatcher.prototype.dispatchInactive = function() {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
        this.namespace_, webfont.EventDispatcher.INACTIVE));
  this.dispatch_(webfont.EventDispatcher.INACTIVE);
};

webfont.EventDispatcher.prototype.dispatchActive = function() {
  // what about inactive? maybe if all fonts failed to load?
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.ACTIVE));
  this.dispatch_(webfont.EventDispatcher.ACTIVE);
};

webfont.EventDispatcher.prototype.dispatch_ = function(event, opt_arg1, opt_arg2) {
  if (this.callbacks_[event]) {
    this.callbacks_[event](opt_arg1, opt_arg2);
  }
};

webfont.FontModuleLoader = function() {
  this.modules_ = {};
};

webfont.FontModuleLoader.prototype.addModuleFactory = function(name, factory) {
  this.modules_[name] = factory;
};

webfont.FontModuleLoader.prototype.getModules = function(configuration) {
  var modules = [];

  for (var key in configuration) {
    if (configuration.hasOwnProperty(key)) {
      var moduleFactory = this.modules_[key];

      if (moduleFactory) {
        modules.push(moduleFactory(configuration[key]));
      }
    }
  }
  return modules;
};

webfont.FontWatcher = function(domHelper, eventDispatcher, fontSizer,
    asyncCall, getTime) {
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.currentlyWatched_ = 0;
  this.last_ = false;
  this.success_ = false;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
};

webfont.FontWatcher.DEFAULT_FONT = '_,arial,helvetica';
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

webfont.FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions, last) {
  var length = fontFamilies.length;

  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];
    if (!fontDescriptions[fontFamily]) {
      fontDescriptions[fontFamily] = [webfont.FontWatcher.DEFAULT_VARIATION];
    }
    this.currentlyWatched_ += fontDescriptions[fontFamily].length;
  }

  if (last) {
    this.last_ = last;
  }

  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];
    var descriptions = fontDescriptions[fontFamily];

    for (var j = 0, len = descriptions.length; j < len; j++) {
      var fontDescription = descriptions[j];
      var originalSize = this.getDefaultFontSize_(fontDescription);

      this.watch_(fontFamily, fontDescription, originalSize);
    }
  }
};

webfont.FontWatcher.prototype.watch_ = function(fontFamily, fontDescription, originalSize) {
  this.eventDispatcher_.dispatchFontLoading(fontFamily, fontDescription);
  var requestedFont = this.createHiddenElementWithFont_(this.nameHelper_.quote(fontFamily),
      fontDescription);
  var size = this.fontSizer_.getWidth(requestedFont);

  if (originalSize != size) {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else {
    this.asyncCheck_(this.getTime_(), originalSize, requestedFont,
        fontFamily, fontDescription);
  }
};

webfont.FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
  if (--this.currentlyWatched_ == 0 && this.last_) {
    if (this.success_) {
      this.eventDispatcher_.dispatchActive();
    } else {
      this.eventDispatcher_.dispatchInactive();
    }
  }
};

webfont.FontWatcher.prototype.check_ = function(started, originalSize,
    requestedFont, fontFamily, fontDescription) {
  var size = this.fontSizer_.getWidth(requestedFont);

  if (originalSize != size) {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else if ((this.getTime_() - started) < 5000) {
    this.asyncCheck_(started, originalSize, requestedFont, fontFamily, fontDescription);
  } else {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFontInactive(fontFamily, fontDescription);
    this.decreaseCurrentlyWatched_();
  }
};

webfont.FontWatcher.prototype.asyncCheck_ = function(started, originalSize,
    requestedFont, fontFamily, fontDescription) {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context, started, originalSize, requestedFont, fontFamily, fontDescription);
    }
  }(this, this.check_), 50);
};

webfont.FontWatcher.prototype.getDefaultFontSize_ = function(fontDescription) {
  var defaultFont = this.createHiddenElementWithFont_(
      webfont.FontWatcher.DEFAULT_FONT, fontDescription);
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

webfont.FontWatcher.prototype.createHiddenElementWithFont_ = function(
    fontFamily, fontDescription) {
  var variationCss = this.fvd_.expand(fontDescription);
  var styleString = "position:absolute;top:-999px;font-size:300px;font-family:" +
      fontFamily + "," + webfont.FontWatcher.DEFAULT_FONT + ";" + variationCss;
  var span = this.domHelper_.createElement('span', { 'style': styleString }, 'Mm');

  this.domHelper_.insertInto('body', span);
  return span;
};

webfont.WebFont = function(domHelper, fontModuleLoader, htmlElement, asyncCall,
    userAgent) {
  this.domHelper_ = domHelper;
  this.fontModuleLoader_ = fontModuleLoader;
  this.htmlElement_ = htmlElement;
  this.asyncCall_ = asyncCall;
  this.userAgent_ = userAgent;
  this.moduleLoading_ = 0;
  this.moduleFailedLoading_ = 0;
};

webfont.WebFont.prototype.addModule = function(name, factory) {
  this.fontModuleLoader_.addModuleFactory(name, factory);
};

webfont.WebFont.prototype.load = function(configuration) {
  var eventDispatcher = new webfont.EventDispatcher(
      this.domHelper_, this.htmlElement_, configuration);

  if (this.userAgent_.isSupportingWebFont()) {
    this.load_(eventDispatcher, configuration);
  } else {
    eventDispatcher.dispatchInactive();
  }
};

webfont.WebFont.prototype.isModuleSupportingUserAgent_ = function(module, eventDispatcher,
    fontWatcher, support) {
  if (!support) {
    var allModulesLoaded = --this.moduleLoading_ == 0;

    this.moduleFailedLoading_--;
    if (allModulesLoaded) {
      if (this.moduleFailedLoading_ == 0) {
        eventDispatcher.dispatchInactive();
      } else {
        eventDispatcher.dispatchLoading();
      }
    }
    fontWatcher.watch([], {}, allModulesLoaded);
    return;
  }
  module.load(webfont.bind(this, this.onModuleReady_, eventDispatcher,
      fontWatcher));
};

webfont.WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher,
    fontFamilies, opt_fontDescriptions) {
  var allModulesLoaded = --this.moduleLoading_ == 0;

  if (allModulesLoaded) {
    eventDispatcher.dispatchLoading();
  }
  this.asyncCall_(webfont.bind(this, function(_fontWatcher, _fontFamilies,
      _fontDescriptions, _allModulesLoaded) {
    _fontWatcher.watch(_fontFamilies, _fontDescriptions || {}, _allModulesLoaded);
  }, fontWatcher, fontFamilies, opt_fontDescriptions, allModulesLoaded));
};

webfont.WebFont.prototype.load_ = function(eventDispatcher, configuration) {
  var modules = this.fontModuleLoader_.getModules(configuration),
      self = this;

  this.moduleFailedLoading_ = this.moduleLoading_ = modules.length;

  var fontWatcher = new webfont.FontWatcher(this.domHelper_,
      eventDispatcher, {
        getWidth: function(elem) {
          return elem.offsetWidth;
        }}, self.asyncCall_, function() {
          return new Date().getTime();
        });

  for (var i = 0, len = modules.length; i < len; i++) {
    var module = modules[i];

    module.supportUserAgent(this.userAgent_,
        webfont.bind(this, this.isModuleSupportingUserAgent_, module,
        eventDispatcher, fontWatcher));
  }
};

webfont.CssClassName = function(opt_joinChar) {
  this.joinChar_ = opt_joinChar || webfont.CssClassName.DEFAULT_JOIN_CHAR;
};

webfont.CssClassName.DEFAULT_JOIN_CHAR = '-';

webfont.CssClassName.prototype.sanitize = function(name) {
  return name.replace(/[\W_]+/g, '').toLowerCase();
};

webfont.CssClassName.prototype.build = function(__args__) {
  var parts = []
  for (var i = 0; i < arguments.length; i++) {
    parts.push(this.sanitize(arguments[i]));
  }
  return parts.join(this.joinChar_);
};


webfont.CssFontFamilyName = function() {
  this.quote_ = '"';
};

webfont.CssFontFamilyName.prototype.quote = function(name) {
  var quoted = [];
  var split = name.split(/,\s*/);
  for (var i = 0; i < split.length; i++) {
    var part = split[i].replace(/['"]/g, '');
    if (part.indexOf(' ') == -1) {
      quoted.push(part);
    } else {
      quoted.push(this.quote_ + part + this.quote_);
    }
  }
  return quoted.join(',');
};

webfont.FontVariationDescription = function() {
  this.properties_ = webfont.FontVariationDescription.PROPERTIES;
  this.values_ = webfont.FontVariationDescription.VALUES;
};

webfont.FontVariationDescription.PROPERTIES = [
  'font-style',
  'font-weight'
];

webfont.FontVariationDescription.VALUES = {
  'font-style': [
    ['n', 'normal'],
    ['i', 'italic'],
    ['o', 'oblique']
  ],
  'font-weight': [
    ['1', '100'],
    ['2', '200'],
    ['3', '300'],
    ['4', '400'],
    ['5', '500'],
    ['6', '600'],
    ['7', '700'],
    ['8', '800'],
    ['9', '900'],
    ['4', 'normal'],
    ['7', 'bold']
  ]
};

webfont.FontVariationDescription.Item = function(index, property, values) {
  this.index_ = index;
  this.property_ = property;
  this.values_ = values;
}

webfont.FontVariationDescription.Item.prototype.compact = function(output, value) {
  for (var i = 0; i < this.values_.length; i++) {
    if (value == this.values_[i][1]) {
      output[this.index_] = this.values_[i][0];
      return;
    }
  }
}

webfont.FontVariationDescription.Item.prototype.expand = function(output, value) {
  for (var i = 0; i < this.values_.length; i++) {
    if (value == this.values_[i][0]) {
      output[this.index_] = this.property_ + ':' + this.values_[i][1];
      return;
    }
  }
}

webfont.FontVariationDescription.prototype.compact = function(input) {
  var result = ['n', '4'];
  var descriptors = input.split(';');

  for (var i = 0, len = descriptors.length; i < len; i++) {
    var pair = descriptors[i].replace(/\s+/g, '').split(':');
    if (pair.length == 2) {
      var property = pair[0];
      var value = pair[1];
      var item = this.getItem_(property);
      if (item) {
        item.compact(result, value);
      }
    }
  }

  return result.join('');
};

webfont.FontVariationDescription.prototype.expand = function(fvd) {
  if (fvd.length != 2) {
    return null;
  }

  var result = [null, null];

  for (var i = 0, len = this.properties_.length; i < len; i++) {
    var property = this.properties_[i];
    var key = fvd.substr(i, 1);
    var values = this.values_[property];
    var item = new webfont.FontVariationDescription.Item(i, property, values);
    item.expand(result, key);
  }

  if (result[0] && result[1]) {
    return result.join(';') + ';';
  } else {
    return null;
  }
}

webfont.FontVariationDescription.prototype.getItem_ = function(property) {
  for (var i = 0; i < this.properties_.length; i++) {
    if (property == this.properties_[i]) {
      var values = this.values_[property];
      return new webfont.FontVariationDescription.Item(i, property, values);
    }
  }

  return null;
};

// Name of the global object.
var globalName = 'WebFont';

// Provide an instance of WebFont in the global namespace.
window[globalName] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  var asyncCall = function(func, timeout) { setTimeout(func, timeout); };

  return new webfont.WebFont(domHelper, new webfont.FontModuleLoader(),
      document.documentElement, asyncCall, userAgent);
})();

// Export the public API.
window[globalName]['load'] = window[globalName].load;
window[globalName]['addModule'] = window[globalName].addModule;

/**
 *
 * WebFont.load({
 *   ascender: {
 *     key:'ec2de397-11ae-4c10-937f-bf94283a70c1',
 *     families:['AyitaPro:regular,bold,bolditalic,italic']
 *   }
 * });
 *
 */
webfont.AscenderScript = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.AscenderScript.NAME = 'ascender';

webfont.AscenderScript.VARIATIONS = {
  'regular': 'n4',
  'bold': 'n7',
  'italic': 'i4',
  'bolditalic': 'i7',
  'r': 'n4',
  'b': 'n7',
  'i': 'i4',
  'bi': 'i7'
};

webfont.AscenderScript.prototype.supportUserAgent = function(userAgent, support) {
  return support(userAgent.isSupportingWebFont());
};

webfont.AscenderScript.prototype.load = function(onReady) {
  var key = this.configuration_['key'];
  var protocol = (('https:' == document.location.protocol) ? 'https:' : 'http:');
  var url = protocol + '//webfonts.fontslive.com/css/' + key + '.css';
  this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
  var fv = this.parseFamiliesAndVariations(this.configuration_['families']);
  onReady(fv.families, fv.variations);
};

webfont.AscenderScript.prototype.parseFamiliesAndVariations = function(providedFamilies){
  var families, variations, fv;
  families = [];
  variations = {};
  for(var i = 0, len = providedFamilies.length; i < len; i++){
    fv = this.parseFamilyAndVariations(providedFamilies[i]);
    families.push(fv.family);
    variations[fv.family] = fv.variations;
  }
  return { families:families, variations:variations };
};

webfont.AscenderScript.prototype.parseFamilyAndVariations = function(providedFamily){
  var family, variations, parts;
  parts = providedFamily.split(':');
  family = parts[0];
  variations = [];
  if(parts[1]){
    variations = this.parseVariations(parts[1]);
  }else{
    variations = ['n4'];
  }
  return { family:family, variations:variations };
};

webfont.AscenderScript.prototype.parseVariations = function(source){
  var providedVariations = source.split(',');
  var variations = [];
  for(var i = 0, len = providedVariations.length; i < len; i++){
    var pv = providedVariations[i];
    if(pv){
      var v = webfont.AscenderScript.VARIATIONS[pv];
      variations.push(v ? v : pv);
    }
  }
  return variations;
};

WebFont.addModule(webfont.AscenderScript.NAME, function(configuration) {
  return new webfont.AscenderScript(new webfont.DomHelper(document),
      configuration);
});

webfont.FontApiUrlBuilder = function(apiUrl) {
  if (apiUrl) {
    this.apiUrl_ = apiUrl;
  } else {
    var protocol = 'https:' == window.location.protocol ? 'https:' : 'http:';

    this.apiUrl_ = protocol + webfont.FontApiUrlBuilder.DEFAULT_API_URL;
  }  
  this.fontFamilies_ = null;
};

webfont.FontApiUrlBuilder.DEFAULT_API_URL = '//fonts.googleapis.com/css';

webfont.FontApiUrlBuilder.prototype.setFontFamilies = function(fontFamilies) {
  // maybe clone?
  this.fontFamilies_ = fontFamilies;
};

webfont.FontApiUrlBuilder.prototype.webSafe = function(string) {
  return string.replace(/ /g, '+');
};

webfont.FontApiUrlBuilder.prototype.build = function() {
  if (!this.fontFamilies_) {
    throw new Error('No fonts to load !');
  }
  var length = this.fontFamilies_.length;
  var sb = [];

  for (var i = 0; i < length; i++) {
    sb.push(this.webSafe(this.fontFamilies_[i]));
  }
  var url = this.apiUrl_ + '?family=' + sb.join('%7C'); // '|' escaped.

  return url;
};

webfont.FontApiParser = function(fontFamilies) {
  this.fontFamilies_ = fontFamilies;
  this.parsedFontFamilies_ = [];
  this.variations_ = {};
  this.fvd_ = new webfont.FontVariationDescription();
};

webfont.FontApiParser.VARIATIONS = {
  'ultralight': 'n2',
  'light': 'n3',
  'regular': 'n4',
  'bold': 'n7',
  'italic': 'i4',
  'bolditalic': 'i7',
  'ul': 'n2',
  'l': 'n3',
  'r': 'n4',
  'b': 'n7',
  'i': 'i4',
  'bi': 'i7'
};

webfont.FontApiParser.prototype.parse = function() {
  var length = this.fontFamilies_.length;

  for (var i = 0; i < length; i++) {
    var pair = this.fontFamilies_[i].split(":");
    var fontFamily = pair[0];
    var variations = null;

    if (pair.length == 2) {
      var fvds = this.parseVariations_(pair[1]);

      if (fvds.length > 0) {
        variations = fvds;
      }
    } else {
      variations = ['n4'];
    }
    this.parsedFontFamilies_.push(fontFamily);
    this.variations_[fontFamily] = variations;
  }
};

webfont.FontApiParser.prototype.generateFontVariationDescription_ = function(variation) {
  if (!variation.match(/^[\w ]+$/)) {
    return '';
  }

  var fvd = webfont.FontApiParser.VARIATIONS[variation];

  if (fvd) {
    return fvd;
  } else {
    var groups = variation.match(/^(\d*)(\w*)$/);
    var numericMatch = groups[1];
    var styleMatch = groups[2];
    var s = styleMatch ? styleMatch : 'n';
    var w = numericMatch ? numericMatch.substr(0, 1) : '4';
    var css = this.fvd_.expand([s, w].join(''));
    if (css) {
      return this.fvd_.compact(css);
    } else {
      return null;
    }
  }
};

webfont.FontApiParser.prototype.parseVariations_ = function(variations) {
  var finalVariations = [];
  var providedVariations = variations.split(",");
  var length = providedVariations.length;

  for (var i = 0; i < length; i++) {
    var variation = providedVariations[i];
    var fvd = this.generateFontVariationDescription_(variation);

    if (fvd) {
      finalVariations.push(fvd);
    }
  }
  return finalVariations;
};

webfont.FontApiParser.prototype.getFontFamilies = function() {
  return this.parsedFontFamilies_;
};

webfont.FontApiParser.prototype.getVariations = function() {
  return this.variations_;
};

webfont.GoogleFontApi = function(userAgent, domHelper, configuration) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.GoogleFontApi.NAME = 'google';

webfont.GoogleFontApi.prototype.supportUserAgent = function(userAgent, support) {
  if (userAgent.getPlatform().match(/iPad|iPod|iPhone/) != null) {
    support(false);
  }
  return support(userAgent.isSupportingWebFont());
};

webfont.GoogleFontApi.prototype.load = function(onReady) {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder(
      this.configuration_['api']);
  var fontFamilies = this.configuration_['families'];
  var domHelper = this.domHelper_;
  var nonBlockingIe = this.userAgent_.getName() == 'MSIE' &&
      this.configuration_['blocking'] != true;

  fontApiUrlBuilder.setFontFamilies(fontFamilies);

  if (nonBlockingIe) {
    domHelper.whenBodyExists(function() {
      domHelper.insertInto('head', domHelper.createCssLink(
          fontApiUrlBuilder.build()));
    });
  } else {
    domHelper.insertInto('head', domHelper.createCssLink(
        fontApiUrlBuilder.build()));
  }
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  onReady(fontApiParser.getFontFamilies(), fontApiParser.getVariations());
};

WebFont.addModule(webfont.GoogleFontApi.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  return new webfont.GoogleFontApi(userAgent,
      new webfont.DomHelper(document), configuration);
});

/**
 *
 * WebFont.load({
 *   custom: {
 *     families: ['Font1', 'Font2'],
 *    urls: [ 'http://moo', 'http://meuh' ] }
 * });
 */
webfont.CustomCss = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.CustomCss.NAME = 'custom';

webfont.CustomCss.prototype.load = function(onReady) {
  var urls = this.configuration_['urls'] || [];
  var families = this.configuration_['families'] || [];

  for (var i = 0, len = urls.length; i < len; i++) {
    var url = urls[i];

    this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
  }
  onReady(families);
};

webfont.CustomCss.prototype.supportUserAgent = function(userAgent, support) {
  return support(userAgent.isSupportingWebFont());
};

WebFont.addModule(webfont.CustomCss.NAME, function(configuration) {
  return new webfont.CustomCss(new webfont.DomHelper(document),
      configuration);
});

webfont.TypekitScript = function(global, domHelper, configuration) {
  this.global_ = global;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
};

webfont.TypekitScript.NAME = 'typekit';
webfont.TypekitScript.HOOK = '__webfonttypekitmodule__';

webfont.TypekitScript.prototype.getScriptSrc = function(kitId) {
  var api = this.configuration_['api'] || 'http://use.typekit.com';
  return api + '/' + kitId + '.js';
};

webfont.TypekitScript.prototype.supportUserAgent = function(userAgent, support) {
  var kitId = this.configuration_['id'];
  var configuration = this.configuration_;
  var self = this;

  if (kitId) {
    // Provide data to Typekit for processing.
    if (!this.global_[webfont.TypekitScript.HOOK]) {
      this.global_[webfont.TypekitScript.HOOK] = {};
    }

    // Typekit will call 'init' to indicate whether it supports fonts
    // and what fonts will be provided.
    this.global_[webfont.TypekitScript.HOOK][kitId] = function(callback) {
      var init = function(typekitSupports, fontFamilies, fontVariations) {
        self.fontFamilies_ = fontFamilies;
        self.fontVariations_ = fontVariations;
        support(typekitSupports);
      };
      callback(userAgent, configuration, init);
    };

    // Load the Typekit script.
    var script = this.domHelper_.createScriptSrc(this.getScriptSrc(kitId))
    this.domHelper_.insertInto('head', script);

  } else {
    support(true);
  }
};

webfont.TypekitScript.prototype.load = function(onReady) {
  onReady(this.fontFamilies_, this.fontVariations_);
};

WebFont.addModule(webfont.TypekitScript.NAME, function(configuration) {
  return new webfont.TypekitScript(window, new webfont.DomHelper(document), configuration);
});

if (window['WebFontConfig']) {
  window['WebFont']['load'](window['WebFontConfig']);
}

