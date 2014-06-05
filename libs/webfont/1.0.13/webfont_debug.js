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
var webfont = {};

/**
 * @param {Object} context
 * @param {function(...[*])} func
 * @param {...*} opt_args
 */
webfont.bind = function(context, func, opt_args) {
  var args = arguments.length > 2 ?
      Array.prototype.slice.call(arguments, 2) : [];

  return function() {
    args.push.apply(args, arguments);
    return func.apply(context, args);
  };
};

/**
 * Handles common DOM manipulation tasks. The aim of this library is to cover
 * the needs of typical font loading. Not more, not less.
 * @param {HTMLDocument} doc The HTML document we'll manipulate.
 * @param {webfont.UserAgent} userAgent The current user agent.
 * @constructor
 */
webfont.DomHelper = function(doc, userAgent) {
  this.document_ = doc;
  this.userAgent_ = userAgent;
};

/**
 * Creates an element.
 * @param {string} elem The element type.
 * @param {Object=} opt_attr A hash of attribute key/value pairs.
 * @param {string=} opt_innerHtml Contents of the element.
 * @return {Element} the new element.
 */
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

/**
 * Inserts an element into the document. This is intended for unambiguous
 * elements such as html, body, head.
 * @param {string} tagName The element name.
 * @param {Element} e The element to append.
 * @return {boolean} True if the element was inserted.
 */
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

/**
 * Calls a function when the body tag exists.
 * @param {function()} callback The function to call.
 */
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

/**
 * Removes an element from the DOM.
 * @param {Element} node The element to remove.
 * @return {boolean} True if the element was removed.
 */
webfont.DomHelper.prototype.removeElement = function(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
    return true;
  }
  return false;
};

/**
 * Creates a link to a CSS document.
 * @param {string} src The URL of the stylesheet.
 * @return {Element} a link element.
 */
webfont.DomHelper.prototype.createCssLink = function(src) {
  return this.createElement('link', {
    'rel': 'stylesheet',
    'href': src
  });
};

/**
 * Creates a link to a javascript document.
 * @param {string} src The URL of the script.
 * @return {Element} a script element.
 */
webfont.DomHelper.prototype.createScriptSrc = function(src) {
  return this.createElement('script', {
    'src': src
  });
};

/**
 * Appends a name to an element's class attribute.
 * @param {Element} e The element.
 * @param {string} name The class name to add.
 */
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

/**
 * Removes a name to an element's class attribute.
 * @param {Element} e The element.
 * @param {string} name The class name to remove.
 */
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

/**
 * @param {string} name
 * @param {string} version
 * @param {string} engine
 * @param {string} engineVersion
 * @param {string} platform
 * @param {string} platformVersion
 * @param {number|undefined} documentMode
 * @param {boolean} webFontSupport
 * @constructor
 */
webfont.UserAgent = function(name, version, engine, engineVersion, platform,
    platformVersion, documentMode, webFontSupport) {
  this.name_ = name;
  this.version_ = version;
  this.engine_ = engine;
  this.engineVersion_ = engineVersion;
  this.platform_ = platform;
  this.platformVersion_ = platformVersion;
  this.documentMode_ = documentMode;
  this.webFontSupport_ = webFontSupport;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getName = function() {
  return this.name_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getVersion = function() {
  return this.version_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getEngine = function() {
  return this.engine_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getEngineVersion = function() {
  return this.engineVersion_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getPlatform = function() {
  return this.platform_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getPlatformVersion = function() {
  return this.platformVersion_;
};

/**
 * @return {number|undefined}
 */
webfont.UserAgent.prototype.getDocumentMode = function() {
  return this.documentMode_;
};

/**
 * @return {boolean}
 */
webfont.UserAgent.prototype.isSupportingWebFont = function() {
  return this.webFontSupport_;
};

/**
 * @param {string} userAgent The browser userAgent string to parse.
 * @constructor
 */
webfont.UserAgentParser = function(userAgent, doc) {
  this.userAgent_ = userAgent;
  this.doc_ = doc;
};

/**
 * @const
 * @type {string}
 */
webfont.UserAgentParser.UNKNOWN = "Unknown";

/**
 * @const
 * @type {webfont.UserAgent}
 */
webfont.UserAgentParser.UNKNOWN_USER_AGENT = new webfont.UserAgent(
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    undefined,
    false);

/**
 * Parses the user agent string and returns an object.
 * @return {webfont.UserAgent}
 */
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

/**
 * @private
 */
webfont.UserAgentParser.prototype.getPlatform_ = function() {
  var mobileOs = this.getMatchingGroup_(this.userAgent_,
      /(iPod|iPad|iPhone|Android)/, 1);

  if (mobileOs != "") {
    return mobileOs;
  }
  var os = this.getMatchingGroup_(this.userAgent_,
      /(Linux|Mac_PowerPC|Macintosh|Windows)/, 1);

  if (os != "") {
    if (os == "Mac_PowerPC") {
      os = "Macintosh";
    }
    return os;
  }
  return webfont.UserAgentParser.UNKNOWN;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getPlatformVersion_ = function() {
  var macVersion = this.getMatchingGroup_(this.userAgent_,
      /(OS X|Windows NT|Android) ([^;]+)/, 2);
  if (macVersion) {
    return macVersion;
  }
  var iVersion = this.getMatchingGroup_(this.userAgent_,
      /(iPhone )?OS ([\d_]+)/, 2);
  if (iVersion) {
    return iVersion;
  }
  var linuxVersion = this.getMatchingGroup_(this.userAgent_,
      /Linux ([i\d]+)/, 1);
  if (linuxVersion) {
    return linuxVersion;
  }

  return webfont.UserAgentParser.UNKNOWN;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isIe_ = function() {
  return this.userAgent_.indexOf("MSIE") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseIeUserAgentString_ = function() {
  var browser = this.getMatchingGroup_(this.userAgent_, /(MSIE [\d\w\.]+)/, 1);
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;

  if (browser != "") {
    var pair = browser.split(' ');
    var name = pair[0];
    var version = pair[1];

    // For IE we give MSIE as the engine name and the version of IE
    // instead of the specific Trident engine name and version
    return new webfont.UserAgent(name, version, name, version,
        this.getPlatform_(), this.getPlatformVersion_(),
        this.getDocumentMode_(this.doc_), this.getMajorVersion_(version) >= 6);
  }
  return new webfont.UserAgent("MSIE", webfont.UserAgentParser.UNKNOWN,
      "MSIE", webfont.UserAgentParser.UNKNOWN,
      this.getPlatform_(), this.getPlatformVersion_(),
      this.getDocumentMode_(this.doc_), false);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isOpera_ = function() {
  return this.userAgent_.indexOf("Opera") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseOperaUserAgentString_ = function() {
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;
  var enginePair = this.getMatchingGroup_(this.userAgent_,
      /(Presto\/[\d\w\.]+)/, 1);

  if (enginePair != "") {
    var splittedEnginePair = enginePair.split('/');

    engineName = splittedEnginePair[0];
    engineVersion = splittedEnginePair[1];
  } else {
    if (this.userAgent_.indexOf("Gecko") != -1) {
      engineName = "Gecko";
    }
    var geckoVersion = this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1);

    if (geckoVersion != "") {
      engineVersion = geckoVersion;
    }
  }
  if (this.userAgent_.indexOf("Version/") != -1) {
    var version = this.getMatchingGroup_(this.userAgent_, /Version\/([\d\.]+)/, 1);

    if (version != "") {
      return new webfont.UserAgent("Opera", version, engineName, engineVersion,
          this.getPlatform_(), this.getPlatformVersion_(),
          this.getDocumentMode_(this.doc_), this.getMajorVersion_(version) >= 10);
    }
  }
  var version = this.getMatchingGroup_(this.userAgent_, /Opera[\/ ]([\d\.]+)/, 1);

  if (version != "") {
    return new webfont.UserAgent("Opera", version, engineName, engineVersion,
        this.getPlatform_(), this.getPlatformVersion_(),
        this.getDocumentMode_(this.doc_), this.getMajorVersion_(version) >= 10);
  }
  return new webfont.UserAgent("Opera", webfont.UserAgentParser.UNKNOWN,
      engineName, engineVersion, this.getPlatform_(),
      this.getPlatformVersion_(), this.getDocumentMode_(this.doc_), false);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isWebKit_ = function() {
  return this.userAgent_.indexOf("AppleWebKit") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseWebKitUserAgentString_ = function() {
  var platform = this.getPlatform_();
  var platformVersion = this.getPlatformVersion_();
  var webKitVersion = this.getMatchingGroup_(this.userAgent_,
      /AppleWebKit\/([\d\.\+]+)/, 1);

  if (webKitVersion == "") {
    webKitVersion = webfont.UserAgentParser.UNKNOWN;
  }
  var name = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Chrome") != -1) {
    name = "Chrome";
  } else if (this.userAgent_.indexOf("Safari") != -1) {
    name = "Safari";
  } else if (this.userAgent_.indexOf("AdobeAIR") != -1) {
    name = "AdobeAIR";
  }
  var version = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Version/") != -1) {
    version = this.getMatchingGroup_(this.userAgent_,
        /Version\/([\d\.\w]+)/, 1);
  } else if (name == "Chrome") {
    version = this.getMatchingGroup_(this.userAgent_,
        /Chrome\/([\d\.]+)/, 1);
  } else if (name == "AdobeAIR") {
    version = this.getMatchingGroup_(this.userAgent_,
        /AdobeAIR\/([\d\.]+)/, 1);
  }
  var supportWebFont = false;
  if (name == "AdobeAIR") {
    var minor = this.getMatchingGroup_(version, /\d+\.(\d+)/, 1);
    supportWebFont = this.getMajorVersion_(version) > 2 ||
      this.getMajorVersion_(version) == 2 && parseInt(minor, 10) >= 5;
  } else {
    var minor = this.getMatchingGroup_(webKitVersion, /\d+\.(\d+)/, 1);
    supportWebFont = this.getMajorVersion_(webKitVersion) >= 526 ||
      this.getMajorVersion_(webKitVersion) >= 525 && parseInt(minor, 10) >= 13;
  }

  return new webfont.UserAgent(name, version, "AppleWebKit", webKitVersion,
      platform, platformVersion, this.getDocumentMode_(this.doc_), supportWebFont);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isGecko_ = function() {
  return this.userAgent_.indexOf("Gecko") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseGeckoUserAgentString_ = function() {
  var name = webfont.UserAgentParser.UNKNOWN;
  var version = webfont.UserAgentParser.UNKNOWN;
  var supportWebFont = false;

  if (this.userAgent_.indexOf("Firefox") != -1) {
    name = "Firefox";
    var versionNum = this.getMatchingGroup_(this.userAgent_,
        /Firefox\/([\d\w\.]+)/, 1);

    if (versionNum != "") {
      var minor = this.getMatchingGroup_(versionNum, /\d+\.(\d+)/, 1);

      version = versionNum;
      supportWebFont = versionNum != "" && this.getMajorVersion_(versionNum) >= 3 &&
          parseInt(minor, 10) >= 5;
    }
  } else if (this.userAgent_.indexOf("Mozilla") != -1) {
    name = "Mozilla";
  }
  var geckoVersion = this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1);

  if (geckoVersion == "") {
    geckoVersion = webfont.UserAgentParser.UNKNOWN;
  } else {
    if (!supportWebFont) {
      var majorVersion = this.getMajorVersion_(geckoVersion);
      var intMinorVersion = parseInt(this.getMatchingGroup_(geckoVersion, /\d+\.(\d+)/, 1), 10);
      var subVersion = parseInt(this.getMatchingGroup_(geckoVersion, /\d+\.\d+\.(\d+)/, 1), 10);

      supportWebFont = majorVersion > 1 ||
          majorVersion == 1 && intMinorVersion > 9 ||
          majorVersion == 1 && intMinorVersion == 9 && subVersion >= 2 ||
          geckoVersion.match(/1\.9\.1b[123]/) != null ||
          geckoVersion.match(/1\.9\.1\.[\d\.]+/) != null;
    }
  }
  return new webfont.UserAgent(name, version, "Gecko", geckoVersion,
      this.getPlatform_(), this.getPlatformVersion_(), this.getDocumentMode_(this.doc_),
      supportWebFont);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getMajorVersion_ = function(version) {
  var majorVersion = this.getMatchingGroup_(version, /(\d+)/, 1);

  if (majorVersion != "") {
    return parseInt(majorVersion, 10);
  }
  return -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getMatchingGroup_ = function(str,
    regexp, index) {
  var groups = str.match(regexp);

  if (groups && groups[index]) {
    return groups[index];
  }
  return "";
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getDocumentMode_ = function(doc) {
  if (doc.documentMode) return doc.documentMode;
  return undefined;
};

/**
 * @param {webfont.DomHelper} domHelper
 * @param {HTMLElement} htmlElement
 * @param {Object} callbacks
 * @param {string=} opt_namespace
 * @constructor
 */
webfont.EventDispatcher = function(domHelper, htmlElement, callbacks,
    opt_namespace) {
  this.domHelper_ = domHelper;
  this.htmlElement_ = htmlElement;
  this.callbacks_ = callbacks;
  this.namespace_ = opt_namespace || webfont.EventDispatcher.DEFAULT_NAMESPACE;
  this.cssClassName_ = new webfont.CssClassName('-');
};

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.DEFAULT_NAMESPACE = 'wf';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.LOADING = 'loading';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.ACTIVE = 'active';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.INACTIVE = 'inactive';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.FONT = 'font';

webfont.EventDispatcher.prototype.dispatchLoading = function() {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.dispatch_(webfont.EventDispatcher.LOADING);
};

/**
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
webfont.EventDispatcher.prototype.dispatchFontLoading = function(fontFamily, fontDescription) {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.LOADING, fontFamily, fontDescription);
};

/**
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
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

/**
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
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
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
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

/**
 * @param {string} event
 * @param {string=} opt_arg1
 * @param {string=} opt_arg2
 */
webfont.EventDispatcher.prototype.dispatch_ = function(event, opt_arg1, opt_arg2) {
  if (this.callbacks_[event]) {
    this.callbacks_[event](opt_arg1, opt_arg2);
  }
};

/**
 * @constructor
 */
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

/**
 * @constructor
 */
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

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_FONT = '_,arial,helvetica';

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

/**
 * Watches a set of font families.
 * @param {Array.<string>} fontFamilies The font family names to watch.
 * @param {Object.<string, Array.<string>>} fontDescriptions The font variations
 *    of each family to watch. Described with FVD.
 * @param {boolean} last True if this is the last set of families to watch.
 */
webfont.FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions,
    fontTestStrings, last) {
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
    var fontTestString  = fontTestStrings[fontFamily] || 'Mm';

    for (var j = 0, len = descriptions.length; j < len; j++) {
      var fontDescription = descriptions[j];
      var originalSize = this.getDefaultFontSize_(fontDescription,
          fontTestString);

      this.watch_(fontFamily, fontDescription, fontTestString, originalSize);
    }
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.watch_ = function(fontFamily, fontDescription,
    fontTestString, originalSize) {
  this.eventDispatcher_.dispatchFontLoading(fontFamily, fontDescription);
  var requestedFont = this.createHiddenElementWithFont_(this.nameHelper_.quote(fontFamily),
      fontDescription, fontTestString);
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

/**
 * @private
 */
webfont.FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
  if (--this.currentlyWatched_ == 0 && this.last_) {
    if (this.success_) {
      this.eventDispatcher_.dispatchActive();
    } else {
      this.eventDispatcher_.dispatchInactive();
    }
  }
};

/**
 * @private
 */
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

/**
 * @private
 */
webfont.FontWatcher.prototype.asyncCheck_ = function(started, originalSize,
    requestedFont, fontFamily, fontDescription) {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context, started, originalSize, requestedFont, fontFamily, fontDescription);
    }
  }(this, this.check_), 50);
};

/**
 * @private
 */
webfont.FontWatcher.prototype.getDefaultFontSize_ = function(fontDescription,
    fontTestString) {
  var defaultFont = this.createHiddenElementWithFont_(
      webfont.FontWatcher.DEFAULT_FONT, fontDescription, fontTestString);
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

/**
 * @private
 */
webfont.FontWatcher.prototype.createHiddenElementWithFont_ = function(
    fontFamily, fontDescription, fontTestString) {
  var variationCss = this.fvd_.expand(fontDescription);
  var styleString = "position:absolute;top:-999px;font-size:300px;font-family:" +
      fontFamily + "," + webfont.FontWatcher.DEFAULT_FONT + ";" + variationCss;
  var span = this.domHelper_.createElement('span', { 'style': styleString },
      fontTestString);

  this.domHelper_.insertInto('body', span);
  return span;
};

/**
 * @constructor
 */
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
    fontWatcher.watch([], {}, {}, allModulesLoaded);
    return;
  }
  module.load(webfont.bind(this, this.onModuleReady_, eventDispatcher,
      fontWatcher));
};

webfont.WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher,
    fontFamilies, opt_fontDescriptions, opt_fontTestStrings) {
  var allModulesLoaded = --this.moduleLoading_ == 0;

  if (allModulesLoaded) {
    eventDispatcher.dispatchLoading();
  }
  this.asyncCall_(webfont.bind(this, function(_fontWatcher, _fontFamilies,
    _fontDescriptions, _fontTestStrings, _allModulesLoaded) {
    _fontWatcher.watch(_fontFamilies, _fontDescriptions || {},
    _fontTestStrings || {}, _allModulesLoaded);
  }, fontWatcher, fontFamilies, opt_fontDescriptions, opt_fontTestStrings,
      allModulesLoaded));
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

/**
 * Handles sanitization and construction of css class names.
 * @param {string=} opt_joinChar The character to join parts of the name on.
 *    Defaults to '-'.
 * @constructor
 */
webfont.CssClassName = function(opt_joinChar) {
  /** @type {string} */
  this.joinChar_ = opt_joinChar || webfont.CssClassName.DEFAULT_JOIN_CHAR;
};

/**
 * @const
 * @type {string}
 */
webfont.CssClassName.DEFAULT_JOIN_CHAR = '-';

/**
 * Sanitizes a string for use as a css class name. Removes non-word and
 * underscore characters.
 * @param {string} name The string.
 * @return {string} The sanitized string.
 */
webfont.CssClassName.prototype.sanitize = function(name) {
  return name.replace(/[\W_]+/g, '').toLowerCase();
};

/**
 * Builds a complete css class name given a variable number of parts.
 * Sanitizes, then joins the parts together.
 * @param {...string} var_args The parts to join.
 * @return {string} The sanitized and joined string.
 */
webfont.CssClassName.prototype.build = function(var_args) {
  var parts = []
  for (var i = 0; i < arguments.length; i++) {
    parts.push(this.sanitize(arguments[i]));
  }
  return parts.join(this.joinChar_);
};


/**
 * Handles quoting rules for a font family name in css.
 * @constructor
 */
webfont.CssFontFamilyName = function() {
  /** @type {string} */
  this.quote_ = '"';
};

/**
 * Quotes the name.
 * @param {string} name The name to quote.
 * @return {string} The quoted name.
 */
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

/**
 * @constructor
 */
webfont.FontVariationDescription = function() {
  this.properties_ = webfont.FontVariationDescription.PROPERTIES;
  this.values_ = webfont.FontVariationDescription.VALUES;
};

/**
 * @const
 */
webfont.FontVariationDescription.PROPERTIES = [
  'font-style',
  'font-weight'
];

/**
 * @const
 */
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

/**
 * @private
 * @constructor
 */
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

/**
 * Compacts CSS declarations into an FVD.
 * @param {string} input A string of CSS declarations such as
 *    'font-weight:normal;font-style:italic'.
 * @return {string} The equivalent FVD such as 'n4'.
 */
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

/**
 * Expands a FVD string into equivalent CSS declarations.
 * @param {string} fvd The FVD string, such as 'n4'.
 * @return {?string} The equivalent CSS such as
 *    'font-weight:normal;font-style:italic' or null if it cannot be parsed.
 */
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

/**
 * @private
 */
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
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  var asyncCall = function(func, timeout) { setTimeout(func, timeout); };

  return new webfont.WebFont(domHelper, new webfont.FontModuleLoader(),
      document.documentElement, asyncCall, userAgent);
})();

// Export the public API.
window[globalName]['load'] = window[globalName].load;
window[globalName]['addModule'] = window[globalName].addModule;

// Export the UserAgent API because we pass this object to external modules.
webfont.UserAgent.prototype['getName'] = webfont.UserAgent.prototype.getName;
webfont.UserAgent.prototype['getVersion'] = webfont.UserAgent.prototype.getVersion;
webfont.UserAgent.prototype['getEngine'] = webfont.UserAgent.prototype.getEngine;
webfont.UserAgent.prototype['getEngineVersion'] = webfont.UserAgent.prototype.getEngineVersion;
webfont.UserAgent.prototype['getPlatform'] = webfont.UserAgent.prototype.getPlatform;
webfont.UserAgent.prototype['getPlatformVersion'] = webfont.UserAgent.prototype.getPlatformVersion;
webfont.UserAgent.prototype['getDocumentMode'] = webfont.UserAgent.prototype.getDocumentMode;
webfont.UserAgent.prototype['isSupportingWebFont'] = webfont.UserAgent.prototype.isSupportingWebFont;

/**
 *
 * WebFont.load({
 *   ascender: {
 *     key:'ec2de397-11ae-4c10-937f-bf94283a70c1',
 *     families:['AyitaPro:regular,bold,bolditalic,italic']
 *   }
 * });
 *
 * @constructor
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

window['WebFont'].addModule(webfont.AscenderScript.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  return new webfont.AscenderScript(domHelper, configuration);
});

/**
 * @constructor
 */
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
  if (this.apiUrl_.indexOf("kit=") != -1) {
    return this.apiUrl_;
  }
  var length = this.fontFamilies_.length;
  var sb = [];

  for (var i = 0; i < length; i++) {
    sb.push(this.webSafe(this.fontFamilies_[i]));
  }
  var url = this.apiUrl_ + '?family=' + sb.join('%7C'); // '|' escaped.

  return url;
};

/**
 * @constructor
 */
webfont.FontApiParser = function(fontFamilies) {
  this.fontFamilies_ = fontFamilies;
  this.parsedFontFamilies_ = [];
  this.variations_ = {};
  this.fontTestStrings_ = {};
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

webfont.FontApiParser.INT_FONTS = {
  'Hanuman': '&#x1780;&#x1781;&#x1782;'
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
    var fontTestString = webfont.FontApiParser.INT_FONTS[fontFamily];

    if (fontTestString) {
      this.fontTestStrings_[fontFamily] = fontTestString;
    }
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

webfont.FontApiParser.prototype.getFontTestStrings = function() {
  return this.fontTestStrings_;
};

/**
 * @constructor
 */
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
  onReady(fontApiParser.getFontFamilies(), fontApiParser.getVariations(),
      fontApiParser.getFontTestStrings());
};

window['WebFont'].addModule(webfont.GoogleFontApi.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  return new webfont.GoogleFontApi(userAgent,
      new webfont.DomHelper(document, userAgent), configuration);
});

/**
 *
 * WebFont.load({
 *   custom: {
 *     families: ['Font1', 'Font2'],
 *    urls: [ 'http://moo', 'http://meuh' ] }
 * });
 *
 * @constructor
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

window['WebFont'].addModule(webfont.CustomCss.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  return new webfont.CustomCss(domHelper, configuration);
});

/**
 * @constructor
 */
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

window['WebFont'].addModule(webfont.TypekitScript.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  return new webfont.TypekitScript(window, domHelper, configuration);
});


if (window['WebFontConfig']) {
  window['WebFont']['load'](window['WebFontConfig']);
}

