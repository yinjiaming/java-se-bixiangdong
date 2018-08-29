//----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
//----------------------------------------------------------
// MicrosoftAjaxWebForms.js
Type._registerScript("MicrosoftAjaxWebForms.js", ["MicrosoftAjaxCore.js", "MicrosoftAjaxSerialization.js", "MicrosoftAjaxNetwork.js", "MicrosoftAjaxComponentModel.js"]);
Type.registerNamespace("Sys.WebForms");
Sys.WebForms.BeginRequestEventArgs = function(c, b, a) {
    Sys.WebForms.BeginRequestEventArgs.initializeBase(this);
    this._request = c;
    this._postBackElement = b;
    this._updatePanelsToUpdate = a
};
Sys.WebForms.BeginRequestEventArgs.prototype = {
    get_postBackElement: function() {
        return this._postBackElement
    },
    get_request: function() {
        return this._request
    },
    get_updatePanelsToUpdate: function() {
        return this._updatePanelsToUpdate ? Array.clone(this._updatePanelsToUpdate) : []
    }
};
Sys.WebForms.BeginRequestEventArgs.registerClass("Sys.WebForms.BeginRequestEventArgs", Sys.EventArgs);
Sys.WebForms.EndRequestEventArgs = function(c, a, b) {
    Sys.WebForms.EndRequestEventArgs.initializeBase(this);
    this._errorHandled = false;
    this._error = c;
    this._dataItems = a || {};
    this._response = b
};
Sys.WebForms.EndRequestEventArgs.prototype = {
    get_dataItems: function() {
        return this._dataItems
    },
    get_error: function() {
        return this._error
    },
    get_errorHandled: function() {
        return this._errorHandled
    },
    set_errorHandled: function(a) {
        this._errorHandled = a
    },
    get_response: function() {
        return this._response
    }
};
Sys.WebForms.EndRequestEventArgs.registerClass("Sys.WebForms.EndRequestEventArgs", Sys.EventArgs);
Sys.WebForms.InitializeRequestEventArgs = function(c, b, a) {
    Sys.WebForms.InitializeRequestEventArgs.initializeBase(this);
    this._request = c;
    this._postBackElement = b;
    this._updatePanelsToUpdate = a
};
Sys.WebForms.InitializeRequestEventArgs.prototype = {
    get_postBackElement: function() {
        return this._postBackElement
    },
    get_request: function() {
        return this._request
    },
    get_updatePanelsToUpdate: function() {
        return this._updatePanelsToUpdate ? Array.clone(this._updatePanelsToUpdate) : []
    },
    set_updatePanelsToUpdate: function(a) {
        this._updated = true;
        this._updatePanelsToUpdate = a
    }
};
Sys.WebForms.InitializeRequestEventArgs.registerClass("Sys.WebForms.InitializeRequestEventArgs", Sys.CancelEventArgs);
Sys.WebForms.PageLoadedEventArgs = function(b, a, c) {
    Sys.WebForms.PageLoadedEventArgs.initializeBase(this);
    this._panelsUpdated = b;
    this._panelsCreated = a;
    this._dataItems = c || {}
};
Sys.WebForms.PageLoadedEventArgs.prototype = {
    get_dataItems: function() {
        return this._dataItems
    },
    get_panelsCreated: function() {
        return this._panelsCreated
    },
    get_panelsUpdated: function() {
        return this._panelsUpdated
    }
};
Sys.WebForms.PageLoadedEventArgs.registerClass("Sys.WebForms.PageLoadedEventArgs", Sys.EventArgs);
Sys.WebForms.PageLoadingEventArgs = function(b, a, c) {
    Sys.WebForms.PageLoadingEventArgs.initializeBase(this);
    this._panelsUpdating = b;
    this._panelsDeleting = a;
    this._dataItems = c || {}
};
Sys.WebForms.PageLoadingEventArgs.prototype = {
    get_dataItems: function() {
        return this._dataItems
    },
    get_panelsDeleting: function() {
        return this._panelsDeleting
    },
    get_panelsUpdating: function() {
        return this._panelsUpdating
    }
};
Sys.WebForms.PageLoadingEventArgs.registerClass("Sys.WebForms.PageLoadingEventArgs", Sys.EventArgs);
Sys._ScriptLoader = function() {
    this._scriptsToLoad = null;
    this._sessions = [];
    this._scriptLoadedDelegate = Function.createDelegate(this, this._scriptLoadedHandler)
};
Sys._ScriptLoader.prototype = {
    dispose: function() {
        this._stopSession();
        this._loading = false;
        if (this._events) delete this._events;
        this._sessions = null;
        this._currentSession = null;
        this._scriptLoadedDelegate = null
    },
    loadScripts: function(d, b, c, a) {
        var e = {
            allScriptsLoadedCallback: b,
            scriptLoadFailedCallback: c,
            scriptLoadTimeoutCallback: a,
            scriptsToLoad: this._scriptsToLoad,
            scriptTimeout: d
        };
        this._scriptsToLoad = null;
        this._sessions[this._sessions.length] = e;
        if (!this._loading) this._nextSession()
    },
    queueCustomScriptTag: function(a) {
        if (!this._scriptsToLoad) this._scriptsToLoad = [];
        Array.add(this._scriptsToLoad, a)
    },
    queueScriptBlock: function(a) {
        if (!this._scriptsToLoad) this._scriptsToLoad = [];
        Array.add(this._scriptsToLoad, {
            text: a
        })
    },
    queueScriptReference: function(a, b) {
        if (!this._scriptsToLoad) this._scriptsToLoad = [];
        Array.add(this._scriptsToLoad, {
            src: a,
            fallback: b
        })
    },
    _createScriptElement: function(c) {
        var a = document.createElement("script");
        a.type = "text/javascript";
        for (var b in c) a[b] = c[b];
        return a
    },
    _loadScriptsInternal: function() {
        var c = this._currentSession;
        if (c.scriptsToLoad && c.scriptsToLoad.length > 0) {
            var b = Array.dequeue(c.scriptsToLoad),
            f = this._scriptLoadedDelegate;
            if (b.fallback) {
                var g = b.fallback;
                delete b.fallback;
                var d = this;
                f = function(b, a) {
                    a ||
                    function() {
                        var a = d._createScriptElement({
                            src: g
                        });
                        d._currentTask = new Sys._ScriptLoaderTask(a, d._scriptLoadedDelegate);
                        d._currentTask.execute()
                    } ()
                }
            }
            var a = this._createScriptElement(b);
            if (a.text && Sys.Browser.agent === Sys.Browser.Safari) {
                a.innerHTML = a.text;
                delete a.text
            }
            if (typeof b.src === "string") {
                this._currentTask = new Sys._ScriptLoaderTask(a, f);
                this._currentTask.execute()
            } else {
                document.getElementsByTagName("head")[0].appendChild(a);
                Sys._ScriptLoaderTask._clearScript(a);
                this._loadScriptsInternal()
            }
        } else {
            this._stopSession();
            var e = c.allScriptsLoadedCallback;
            if (e) e(this);
            this._nextSession()
        }
    },
    _nextSession: function() {
        if (this._sessions.length === 0) {
            this._loading = false;
            this._currentSession = null;
            return
        }
        this._loading = true;
        var a = Array.dequeue(this._sessions);
        this._currentSession = a;
        if (a.scriptTimeout > 0) this._timeoutCookie = window.setTimeout(Function.createDelegate(this, this._scriptLoadTimeoutHandler), a.scriptTimeout * 1000);
        this._loadScriptsInternal()
    },
    _raiseError: function() {
        var b = this._currentSession.scriptLoadFailedCallback,
        a = this._currentTask.get_scriptElement();
        this._stopSession();
        if (b) {
            b(this, a);
            this._nextSession()
        } else {
            this._loading = false;
            throw Sys._ScriptLoader._errorScriptLoadFailed(a.src)
        }
    },
    _scriptLoadedHandler: function(a, b) {
        if (b) {
            Array.add(Sys._ScriptLoader._getLoadedScripts(), a.src);
            this._currentTask.dispose();
            this._currentTask = null;
            this._loadScriptsInternal()
        } else this._raiseError()
    },
    _scriptLoadTimeoutHandler: function() {
        var a = this._currentSession.scriptLoadTimeoutCallback;
        this._stopSession();
        if (a) a(this);
        this._nextSession()
    },
    _stopSession: function() {
        if (this._timeoutCookie) {
            window.clearTimeout(this._timeoutCookie);
            this._timeoutCookie = null
        }
        if (this._currentTask) {
            this._currentTask.dispose();
            this._currentTask = null
        }
    }
};
Sys._ScriptLoader.registerClass("Sys._ScriptLoader", null, Sys.IDisposable);
Sys._ScriptLoader.getInstance = function() {
    var a = Sys._ScriptLoader._activeInstance;
    if (!a) a = Sys._ScriptLoader._activeInstance = new Sys._ScriptLoader;
    return a
};
Sys._ScriptLoader.isScriptLoaded = function(b) {
    var a = document.createElement("script");
    a.src = b;
    return Array.contains(Sys._ScriptLoader._getLoadedScripts(), a.src)
};
Sys._ScriptLoader.readLoadedScripts = function() {
    if (!Sys._ScriptLoader._referencedScripts) {
        var c = Sys._ScriptLoader._referencedScripts = [],
        d = document.getElementsByTagName("script");
        for (var b = d.length - 1; b >= 0; b--) {
            var e = d[b],
            a = e.src;
            if (a.length) if (!Array.contains(c, a)) Array.add(c, a)
        }
    }
};
Sys._ScriptLoader._errorScriptLoadFailed = function(b) {
    var a;
    a = Sys.Res.scriptLoadFailed;
    var d = "Sys.ScriptLoadFailedException: " + String.format(a, b),
    c = Error.create(d, {
        name: "Sys.ScriptLoadFailedException",
        "scriptUrl": b
    });
    c.popStackFrame();
    return c
};
Sys._ScriptLoader._getLoadedScripts = function() {
    if (!Sys._ScriptLoader._referencedScripts) {
        Sys._ScriptLoader._referencedScripts = [];
        Sys._ScriptLoader.readLoadedScripts()
    }
    return Sys._ScriptLoader._referencedScripts
};
Sys.WebForms.PageRequestManager = function() {
    this._form = null;
    this._activeDefaultButton = null;
    this._activeDefaultButtonClicked = false;
    this._updatePanelIDs = null;
    this._updatePanelClientIDs = null;
    this._updatePanelHasChildrenAsTriggers = null;
    this._asyncPostBackControlIDs = null;
    this._asyncPostBackControlClientIDs = null;
    this._postBackControlIDs = null;
    this._postBackControlClientIDs = null;
    this._scriptManagerID = null;
    this._pageLoadedHandler = null;
    this._additionalInput = null;
    this._onsubmit = null;
    this._onSubmitStatements = [];
    this._originalDoPostBack = null;
    this._originalDoPostBackWithOptions = null;
    this._originalFireDefaultButton = null;
    this._originalDoCallback = null;
    this._isCrossPost = false;
    this._postBackSettings = null;
    this._request = null;
    this._onFormSubmitHandler = null;
    this._onFormElementClickHandler = null;
    this._onWindowUnloadHandler = null;
    this._asyncPostBackTimeout = null;
    this._controlIDToFocus = null;
    this._scrollPosition = null;
    this._processingRequest = false;
    this._scriptDisposes = {};
    this._transientFields = ["__VIEWSTATEENCRYPTED", "__VIEWSTATEFIELDCOUNT"];
    this._textTypes = /^(text|password|hidden|search|tel|url|email|number|range|color|datetime|date|month|week|time|datetime-local)$/i
};
Sys.WebForms.PageRequestManager.prototype = {
    _get_eventHandlerList: function() {
        if (!this._events) this._events = new Sys.EventHandlerList;
        return this._events
    },
    get_isInAsyncPostBack: function() {
        return this._request !== null
    },
    add_beginRequest: function(a) {
        this._get_eventHandlerList().addHandler("beginRequest", a)
    },
    remove_beginRequest: function(a) {
        this._get_eventHandlerList().removeHandler("beginRequest", a)
    },
    add_endRequest: function(a) {
        this._get_eventHandlerList().addHandler("endRequest", a)
    },
    remove_endRequest: function(a) {
        this._get_eventHandlerList().removeHandler("endRequest", a)
    },
    add_initializeRequest: function(a) {
        this._get_eventHandlerList().addHandler("initializeRequest", a)
    },
    remove_initializeRequest: function(a) {
        this._get_eventHandlerList().removeHandler("initializeRequest", a)
    },
    add_pageLoaded: function(a) {
        this._get_eventHandlerList().addHandler("pageLoaded", a)
    },
    remove_pageLoaded: function(a) {
        this._get_eventHandlerList().removeHandler("pageLoaded", a)
    },
    add_pageLoading: function(a) {
        this._get_eventHandlerList().addHandler("pageLoading", a)
    },
    remove_pageLoading: function(a) {
        this._get_eventHandlerList().removeHandler("pageLoading", a)
    },
    abortPostBack: function() {
        if (!this._processingRequest && this._request) {
            this._request.get_executor().abort();
            this._request = null
        }
    },
    beginAsyncPostBack: function(c, a, f, d, e) {
        if (d && typeof Page_ClientValidate === "function" && !Page_ClientValidate(e || null)) return;
        this._postBackSettings = this._createPostBackSettings(true, c, a);
        var b = this._form;
        b.__EVENTTARGET.value = a || "";
        b.__EVENTARGUMENT.value = f || "";
        this._isCrossPost = false;
        this._additionalInput = null;
        this._onFormSubmit()
    },
    _cancelPendingCallbacks: function() {
        for (var a = 0,
        e = window.__pendingCallbacks.length; a < e; a++) {
            var c = window.__pendingCallbacks[a];
            if (c) {
                if (!c.async) window.__synchronousCallBackIndex = -1;
                window.__pendingCallbacks[a] = null;
                var d = "__CALLBACKFRAME" + a,
                b = document.getElementById(d);
                if (b) b.parentNode.removeChild(b)
            }
        }
    },
    _commitControls: function(a, b) {
        if (a) {
            this._updatePanelIDs = a.updatePanelIDs;
            this._updatePanelClientIDs = a.updatePanelClientIDs;
            this._updatePanelHasChildrenAsTriggers = a.updatePanelHasChildrenAsTriggers;
            this._asyncPostBackControlIDs = a.asyncPostBackControlIDs;
            this._asyncPostBackControlClientIDs = a.asyncPostBackControlClientIDs;
            this._postBackControlIDs = a.postBackControlIDs;
            this._postBackControlClientIDs = a.postBackControlClientIDs
        }
        if (typeof b !== "undefined" && b !== null) this._asyncPostBackTimeout = b * 1000
    },
    _createHiddenField: function(c, d) {
        var b, a = document.getElementById(c);
        if (a) if (!a._isContained) a.parentNode.removeChild(a);
        else b = a.parentNode;
        if (!b) {
            b = document.createElement("span");
            b.style.cssText = "display:none !important";
            this._form.appendChild(b)
        }
        b.innerHTML = "<input type='hidden' />";
        a = b.childNodes[0];
        a._isContained = true;
        a.id = a.name = c;
        a.value = d
    },
    _createPageRequestManagerTimeoutError: function() {
        var b = "Sys.WebForms.PageRequestManagerTimeoutException: " + Sys.WebForms.Res.PRM_TimeoutError,
        a = Error.create(b, {
            name: "Sys.WebForms.PageRequestManagerTimeoutException"
        });
        a.popStackFrame();
        return a
    },
    _createPageRequestManagerServerError: function(a, d) {
        var c = "Sys.WebForms.PageRequestManagerServerErrorException: " + (d || String.format(Sys.WebForms.Res.PRM_ServerError, a)),
        b = Error.create(c, {
            name: "Sys.WebForms.PageRequestManagerServerErrorException",
            httpStatusCode: a
        });
        b.popStackFrame();
        return b
    },
    _createPageRequestManagerParserError: function(b) {
        var c = "Sys.WebForms.PageRequestManagerParserErrorException: " + String.format(Sys.WebForms.Res.PRM_ParserError, b),
        a = Error.create(c, {
            name: "Sys.WebForms.PageRequestManagerParserErrorException"
        });
        a.popStackFrame();
        return a
    },
    _createPanelID: function(e, b) {
        var c = b.asyncTarget,
        a = this._ensureUniqueIds(e || b.panelsToUpdate),
        d = a instanceof Array ? a.join(",") : a || this._scriptManagerID;
        if (c) d += "|" + c;
        return encodeURIComponent(this._scriptManagerID) + "=" + encodeURIComponent(d) + "&"
    },
    _createPostBackSettings: function(d, a, c, b) {
        return {
            async: d,
            asyncTarget: c,
            panelsToUpdate: a,
            sourceElement: b
        }
    },
    _convertToClientIDs: function(a, f, e, d) {
        if (a) for (var b = 0,
        h = a.length; b < h; b += d ? 2 : 1) {
            var c = a[b],
            g = (d ? a[b + 1] : "") || this._uniqueIDToClientID(c);
            Array.add(f, c);
            Array.add(e, g)
        }
    },
    dispose: function() {
        if (this._form) {
            Sys.UI.DomEvent.removeHandler(this._form, "submit", this._onFormSubmitHandler);
            Sys.UI.DomEvent.removeHandler(this._form, "click", this._onFormElementClickHandler);
            Sys.UI.DomEvent.removeHandler(window, "unload", this._onWindowUnloadHandler);
            Sys.UI.DomEvent.removeHandler(window, "load", this._pageLoadedHandler)
        }
        if (this._originalDoPostBack) {
            window.__doPostBack = this._originalDoPostBack;
            this._originalDoPostBack = null
        }
        if (this._originalDoPostBackWithOptions) {
            window.WebForm_DoPostBackWithOptions = this._originalDoPostBackWithOptions;
            this._originalDoPostBackWithOptions = null
        }
        if (this._originalFireDefaultButton) {
            window.WebForm_FireDefaultButton = this._originalFireDefaultButton;
            this._originalFireDefaultButton = null
        }
        if (this._originalDoCallback) {
            window.WebForm_DoCallback = this._originalDoCallback;
            this._originalDoCallback = null
        }
        this._form = null;
        this._updatePanelIDs = null;
        this._updatePanelClientIDs = null;
        this._asyncPostBackControlIDs = null;
        this._asyncPostBackControlClientIDs = null;
        this._postBackControlIDs = null;
        this._postBackControlClientIDs = null;
        this._asyncPostBackTimeout = null;
        this._scrollPosition = null;
        this._activeElement = null
    },
    _doCallback: function(d, b, c, f, a, e) {
        if (!this.get_isInAsyncPostBack()) this._originalDoCallback(d, b, c, f, a, e)
    },
    _doPostBack: function(a, k) {
        var f = window.event;
        if (!f) {
            var d = arguments.callee ? arguments.callee.caller: null;
            if (d) {
                var j = 30;
                while (d.arguments.callee.caller && --j) d = d.arguments.callee.caller;
                f = j && d.arguments.length ? d.arguments[0] : null
            }
        }
        this._additionalInput = null;
        var h = this._form;
        if (a === null || typeof a === "undefined" || this._isCrossPost) {
            this._postBackSettings = this._createPostBackSettings(false);
            this._isCrossPost = false
        } else {
            var c = this._masterPageUniqueID,
            l = this._uniqueIDToClientID(a),
            g = document.getElementById(l);
            if (!g && c) if (a.indexOf(c + "$") === 0) g = document.getElementById(l.substr(c.length + 1));
            if (!g) if (Array.contains(this._asyncPostBackControlIDs, a)) this._postBackSettings = this._createPostBackSettings(true, null, a);
            else if (Array.contains(this._postBackControlIDs, a)) this._postBackSettings = this._createPostBackSettings(false);
            else {
                var e = this._findNearestElement(a);
                if (e) this._postBackSettings = this._getPostBackSettings(e, a);
                else {
                    if (c) {
                        c += "$";
                        if (a.indexOf(c) === 0) e = this._findNearestElement(a.substr(c.length))
                    }
                    if (e) this._postBackSettings = this._getPostBackSettings(e, a);
                    else {
                        var b;
                        try {
                            b = f ? f.target || f.srcElement: null
                        } catch(n) {}
                        b = b || this._activeElement;
                        var m = /__doPostBack\(|WebForm_DoPostBackWithOptions\(/;
                        function i(b) {
                            b = b ? b.toString() : "";
                            return m.test(b) && b.indexOf("'" + a + "'") !== -1 || b.indexOf('"' + a + '"') !== -1
                        }
                        if (b && (b.name === a || i(b.href) || i(b.onclick) || i(b.onchange))) this._postBackSettings = this._getPostBackSettings(b, a);
                        else this._postBackSettings = this._createPostBackSettings(false)
                    }
                }
            } else this._postBackSettings = this._getPostBackSettings(g, a)
        }
        if (!this._postBackSettings.async) {
            h.onsubmit = this._onsubmit;
            this._originalDoPostBack(a, k);
            h.onsubmit = null;
            return
        }
        h.__EVENTTARGET.value = a;
        h.__EVENTARGUMENT.value = k;
        this._onFormSubmit()
    },
    _doPostBackWithOptions: function(a) {
        this._isCrossPost = a && a.actionUrl;
        var d = true;
        if (a.validation) if (typeof Page_ClientValidate == "function") d = Page_ClientValidate(a.validationGroup);
        if (d) {
            if (typeof a.actionUrl != "undefined" && a.actionUrl != null && a.actionUrl.length > 0) theForm.action = a.actionUrl;
            if (a.trackFocus) {
                var c = theForm.elements["__LASTFOCUS"];
                if (typeof c != "undefined" && c != null) if (typeof document.activeElement == "undefined") c.value = a.eventTarget;
                else {
                    var b = document.activeElement;
                    if (typeof b != "undefined" && b != null) if (typeof b.id != "undefined" && b.id != null && b.id.length > 0) c.value = b.id;
                    else if (typeof b.name != "undefined") c.value = b.name
                }
            }
        }
        if (a.clientSubmit) this._doPostBack(a.eventTarget, a.eventArgument)
    },
    _elementContains: function(b, a) {
        while (a) {
            if (a === b) return true;
            a = a.parentNode
        }
        return false
    },
    _endPostBack: function(a, d, f) {
        if (this._request === d.get_webRequest()) {
            this._processingRequest = false;
            this._additionalInput = null;
            this._request = null
        }
        var e = this._get_eventHandlerList().getHandler("endRequest"),
        b = false;
        if (e) {
            var c = new Sys.WebForms.EndRequestEventArgs(a, f ? f.dataItems: {},
            d);
            e(this, c);
            b = c.get_errorHandled()
        }
        if (a && !b) throw a
    },
    _ensureUniqueIds: function(a) {
        if (!a) return a;
        a = a instanceof Array ? a: [a];
        var c = [];
        for (var b = 0,
        f = a.length; b < f; b++) {
            var e = a[b],
            d = Array.indexOf(this._updatePanelClientIDs, e);
            c.push(d > -1 ? this._updatePanelIDs[d] : e)
        }
        return c
    },
    _findNearestElement: function(a) {
        while (a.length > 0) {
            var d = this._uniqueIDToClientID(a),
            c = document.getElementById(d);
            if (c) return c;
            var b = a.lastIndexOf("$");
            if (b === -1) return null;
            a = a.substring(0, b)
        }
        return null
    },
    _findText: function(b, a) {
        var c = Math.max(0, a - 20),
        d = Math.min(b.length, a + 20);
        return b.substring(c, d)
    },
    _fireDefaultButton: function(a, d) {
        if (a.keyCode === 13) {
            var c = a.srcElement || a.target;
            if (!c || c.tagName.toLowerCase() !== "textarea") {
                var b = document.getElementById(d);
                if (b && typeof b.click !== "undefined") {
                    this._activeDefaultButton = b;
                    this._activeDefaultButtonClicked = false;
                    try {
                        b.click()
                    } finally {
                        this._activeDefaultButton = null
                    }
                    a.cancelBubble = true;
                    if (typeof a.stopPropagation === "function") a.stopPropagation();
                    return false
                }
            }
        }
        return true
    },
    _getPageLoadedEventArgs: function(n, c) {
        var m = [],
        l = [],
        k = c ? c.version4: false,
        d = c ? c.updatePanelData: null,
        e,
        g,
        h,
        b;
        if (!d) {
            e = this._updatePanelIDs;
            g = this._updatePanelClientIDs;
            h = null;
            b = null
        } else {
            e = d.updatePanelIDs;
            g = d.updatePanelClientIDs;
            h = d.childUpdatePanelIDs;
            b = d.panelsToRefreshIDs
        }
        var a, f, j, i;
        if (b) for (a = 0, f = b.length; a < f; a += k ? 2 : 1) {
            j = b[a];
            i = (k ? b[a + 1] : "") || this._uniqueIDToClientID(j);
            Array.add(m, document.getElementById(i))
        }
        for (a = 0, f = e.length; a < f; a++) if (n || Array.indexOf(h, e[a]) !== -1) Array.add(l, document.getElementById(g[a]));
        return new Sys.WebForms.PageLoadedEventArgs(m, l, c ? c.dataItems: {})
    },
    _getPageLoadingEventArgs: function(f) {
        var j = [],
        i = [],
        c = f.updatePanelData,
        k = c.oldUpdatePanelIDs,
        l = c.oldUpdatePanelClientIDs,
        n = c.updatePanelIDs,
        m = c.childUpdatePanelIDs,
        d = c.panelsToRefreshIDs,
        a,
        e,
        b,
        g,
        h = f.version4;
        for (a = 0, e = d.length; a < e; a += h ? 2 : 1) {
            b = d[a];
            g = (h ? d[a + 1] : "") || this._uniqueIDToClientID(b);
            Array.add(j, document.getElementById(g))
        }
        for (a = 0, e = k.length; a < e; a++) {
            b = k[a];
            if (Array.indexOf(d, b) === -1 && (Array.indexOf(n, b) === -1 || Array.indexOf(m, b) > -1)) Array.add(i, document.getElementById(l[a]))
        }
        return new Sys.WebForms.PageLoadingEventArgs(j, i, f.dataItems)
    },
    _getPostBackSettings: function(a, c) {
        var d = a,
        b = null;
        while (a) {
            if (a.id) {
                if (!b && Array.contains(this._asyncPostBackControlClientIDs, a.id)) b = this._createPostBackSettings(true, null, c, d);
                else if (!b && Array.contains(this._postBackControlClientIDs, a.id)) return this._createPostBackSettings(false);
                else {
                    var e = Array.indexOf(this._updatePanelClientIDs, a.id);
                    if (e !== -1) if (this._updatePanelHasChildrenAsTriggers[e]) return this._createPostBackSettings(true, [this._updatePanelIDs[e]], c, d);
                    else return this._createPostBackSettings(true, null, c, d)
                }
                if (!b && this._matchesParentIDInList(a.id, this._asyncPostBackControlClientIDs)) b = this._createPostBackSettings(true, null, c, d);
                else if (!b && this._matchesParentIDInList(a.id, this._postBackControlClientIDs)) return this._createPostBackSettings(false)
            }
            a = a.parentNode
        }
        if (!b) return this._createPostBackSettings(false);
        else return b
    },
    _getScrollPosition: function() {
        var a = document.documentElement;
        if (a && (this._validPosition(a.scrollLeft) || this._validPosition(a.scrollTop))) return {
            x: a.scrollLeft,
            y: a.scrollTop
        };
        else {
            a = document.body;
            if (a && (this._validPosition(a.scrollLeft) || this._validPosition(a.scrollTop))) return {
                x: a.scrollLeft,
                y: a.scrollTop
            };
            else if (this._validPosition(window.pageXOffset) || this._validPosition(window.pageYOffset)) return {
                x: window.pageXOffset,
                y: window.pageYOffset
            };
            else return {
                x: 0,
                y: 0
            }
        }
    },
    _initializeInternal: function(f, g, a, b, e, c, d) {
        if (this._prmInitialized) throw Error.invalidOperation(Sys.WebForms.Res.PRM_CannotRegisterTwice);
        this._prmInitialized = true;
        this._masterPageUniqueID = d;
        this._scriptManagerID = f;
        this._form = Sys.UI.DomElement.resolveElement(g);
        this._onsubmit = this._form.onsubmit;
        this._form.onsubmit = null;
        this._onFormSubmitHandler = Function.createDelegate(this, this._onFormSubmit);
        this._onFormElementClickHandler = Function.createDelegate(this, this._onFormElementClick);
        this._onWindowUnloadHandler = Function.createDelegate(this, this._onWindowUnload);
        Sys.UI.DomEvent.addHandler(this._form, "submit", this._onFormSubmitHandler);
        Sys.UI.DomEvent.addHandler(this._form, "click", this._onFormElementClickHandler);
        Sys.UI.DomEvent.addHandler(window, "unload", this._onWindowUnloadHandler);
        this._originalDoPostBack = window.__doPostBack;
        if (this._originalDoPostBack) window.__doPostBack = Function.createDelegate(this, this._doPostBack);
        this._originalDoPostBackWithOptions = window.WebForm_DoPostBackWithOptions;
        if (this._originalDoPostBackWithOptions) window.WebForm_DoPostBackWithOptions = Function.createDelegate(this, this._doPostBackWithOptions);
        this._originalFireDefaultButton = window.WebForm_FireDefaultButton;
        if (this._originalFireDefaultButton) window.WebForm_FireDefaultButton = Function.createDelegate(this, this._fireDefaultButton);
        this._originalDoCallback = window.WebForm_DoCallback;
        if (this._originalDoCallback) window.WebForm_DoCallback = Function.createDelegate(this, this._doCallback);
        this._pageLoadedHandler = Function.createDelegate(this, this._pageLoadedInitialLoad);
        Sys.UI.DomEvent.addHandler(window, "load", this._pageLoadedHandler);
        if (a) this._updateControls(a, b, e, c, true)
    },
    _matchesParentIDInList: function(c, b) {
        for (var a = 0,
        d = b.length; a < d; a++) if (c.startsWith(b[a] + "_")) return true;
        return false
    },
    _onFormElementActive: function(a, d, e) {
        if (a.disabled) return;
        this._activeElement = a;
        this._postBackSettings = this._getPostBackSettings(a, a.name);
        if (a.name) {
            var b = a.tagName.toUpperCase();
            if (b === "INPUT") {
                var c = a.type;
                if (c === "submit") this._additionalInput = encodeURIComponent(a.name) + "=" + encodeURIComponent(a.value);
                else if (c === "image") this._additionalInput = encodeURIComponent(a.name) + ".x=" + d + "&" + encodeURIComponent(a.name) + ".y=" + e
            } else if (b === "BUTTON" && a.name.length !== 0 && a.type === "submit") this._additionalInput = encodeURIComponent(a.name) + "=" + encodeURIComponent(a.value)
        }
    },
    _onFormElementClick: function(a) {
        this._activeDefaultButtonClicked = a.target === this._activeDefaultButton;
        this._onFormElementActive(a.target, a.offsetX, a.offsetY)
    },
    _onFormSubmit: function(i) {
        var f, x, h = true,
        z = this._isCrossPost;
        this._isCrossPost = false;
        if (this._onsubmit) h = this._onsubmit();
        if (h) for (f = 0, x = this._onSubmitStatements.length; f < x; f++) if (!this._onSubmitStatements[f]()) {
            h = false;
            break
        }
        if (!h) {
            if (i) i.preventDefault();
            return
        }
        var w = this._form;
        if (z) return;
        if (this._activeDefaultButton && !this._activeDefaultButtonClicked) this._onFormElementActive(this._activeDefaultButton, 0, 0);
        if (!this._postBackSettings || !this._postBackSettings.async) return;
        var b = new Sys.StringBuilder,
        s = w.elements,
        B = s.length,
        t = this._createPanelID(null, this._postBackSettings);
        b.append(t);
        for (f = 0; f < B; f++) {
            var e = s[f],
            g = e.name;
            if (typeof g === "undefined" || g === null || g.length === 0 || g === this._scriptManagerID) continue;
            var n = e.tagName.toUpperCase();
            if (n === "INPUT") {
                var p = e.type;
                if (this._textTypes.test(p) || (p === "checkbox" || p === "radio") && e.checked) {
                    b.append(encodeURIComponent(g));
                    b.append("=");
                    b.append(encodeURIComponent(e.value));
                    b.append("&")
                }
            } else if (n === "SELECT") {
                var A = e.options.length;
                for (var q = 0; q < A; q++) {
                    var u = e.options[q];
                    if (u.selected) {
                        b.append(encodeURIComponent(g));
                        b.append("=");
                        b.append(encodeURIComponent(u.value));
                        b.append("&")
                    }
                }
            } else if (n === "TEXTAREA") {
                b.append(encodeURIComponent(g));
                b.append("=");
                b.append(encodeURIComponent(e.value));
                b.append("&")
            }
        }
        b.append("__ASYNCPOST=true&");
        if (this._additionalInput) {
            b.append(this._additionalInput);
            this._additionalInput = null
        }
        var c = new Sys.Net.WebRequest,
        a = w.action;
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            var r = a.indexOf("#");
            if (r !== -1) a = a.substr(0, r);
            var o = "",
            v = "",
            m = a.indexOf("?");
            if (m !== -1) {
                v = a.substr(m);
                a = a.substr(0, m)
            }
            if (/^https?\:\/\/.*$/gi.test(a)) {
                var y = a.indexOf("//") + 2,
                l = a.indexOf("/", y);
                if (l === -1) {
                    o = a;
                    a = ""
                } else {
                    o = a.substr(0, l);
                    a = a.substr(l)
                }
            }
            a = o + encodeURI(decodeURI(a)) + v
        }
        c.set_url(a);
        c.get_headers()["X-MicrosoftAjax"] = "Delta=true";
        c.get_headers()["Cache-Control"] = "no-cache";
        c.set_timeout(this._asyncPostBackTimeout);
        c.add_completed(Function.createDelegate(this, this._onFormSubmitCompleted));
        c.set_body(b.toString());
        var j, d, k = this._get_eventHandlerList().getHandler("initializeRequest");
        if (k) {
            j = this._postBackSettings.panelsToUpdate;
            d = new Sys.WebForms.InitializeRequestEventArgs(c, this._postBackSettings.sourceElement, j);
            k(this, d);
            h = !d.get_cancel()
        }
        if (!h) {
            if (i) i.preventDefault();
            return
        }
        if (d && d._updated) {
            j = d.get_updatePanelsToUpdate();
            c.set_body(c.get_body().replace(t, this._createPanelID(j, this._postBackSettings)))
        }
        this._scrollPosition = this._getScrollPosition();
        this.abortPostBack();
        k = this._get_eventHandlerList().getHandler("beginRequest");
        if (k) {
            d = new Sys.WebForms.BeginRequestEventArgs(c, this._postBackSettings.sourceElement, j || this._postBackSettings.panelsToUpdate);
            k(this, d)
        }
        if (this._originalDoCallback) this._cancelPendingCallbacks();
        this._request = c;
        this._processingRequest = false;
        c.invoke();
        if (i) i.preventDefault()
    },
    _onFormSubmitCompleted: function(c) {
        this._processingRequest = true;
        if (c.get_timedOut()) {
            this._endPostBack(this._createPageRequestManagerTimeoutError(), c, null);
            return
        }
        if (c.get_aborted()) {
            this._endPostBack(null, c, null);
            return
        }
        if (!this._request || c.get_webRequest() !== this._request) return;
        if (c.get_statusCode() !== 200) {
            this._endPostBack(this._createPageRequestManagerServerError(c.get_statusCode()), c, null);
            return
        }
        var a = this._parseDelta(c);
        if (!a) return;
        var b, e;
        if (a.asyncPostBackControlIDsNode && a.postBackControlIDsNode && a.updatePanelIDsNode && a.panelsToRefreshNode && a.childUpdatePanelIDsNode) {
            var r = this._updatePanelIDs,
            n = this._updatePanelClientIDs,
            i = a.childUpdatePanelIDsNode.content,
            p = i.length ? i.split(",") : [],
            m = this._splitNodeIntoArray(a.asyncPostBackControlIDsNode),
            o = this._splitNodeIntoArray(a.postBackControlIDsNode),
            q = this._splitNodeIntoArray(a.updatePanelIDsNode),
            g = this._splitNodeIntoArray(a.panelsToRefreshNode),
            h = a.version4;
            for (b = 0, e = g.length; b < e; b += h ? 2 : 1) {
                var j = (h ? g[b + 1] : "") || this._uniqueIDToClientID(g[b]);
                if (!document.getElementById(j)) {
                    this._endPostBack(Error.invalidOperation(String.format(Sys.WebForms.Res.PRM_MissingPanel, j)), c, a);
                    return
                }
            }
            var f = this._processUpdatePanelArrays(q, m, o, h);
            f.oldUpdatePanelIDs = r;
            f.oldUpdatePanelClientIDs = n;
            f.childUpdatePanelIDs = p;
            f.panelsToRefreshIDs = g;
            a.updatePanelData = f
        }
        a.dataItems = {};
        var d;
        for (b = 0, e = a.dataItemNodes.length; b < e; b++) {
            d = a.dataItemNodes[b];
            a.dataItems[d.id] = d.content
        }
        for (b = 0, e = a.dataItemJsonNodes.length; b < e; b++) {
            d = a.dataItemJsonNodes[b];
            a.dataItems[d.id] = Sys.Serialization.JavaScriptSerializer.deserialize(d.content)
        }
        var l = this._get_eventHandlerList().getHandler("pageLoading");
        if (l) l(this, this._getPageLoadingEventArgs(a));
        Sys._ScriptLoader.readLoadedScripts();
        Sys.Application.beginCreateComponents();
        var k = Sys._ScriptLoader.getInstance();
        this._queueScripts(k, a.scriptBlockNodes, true, false);
        this._processingRequest = true;
        k.loadScripts(0, Function.createDelegate(this, Function.createCallback(this._scriptIncludesLoadComplete, a)), Function.createDelegate(this, Function.createCallback(this._scriptIncludesLoadFailed, a)), null)
    },
    _onWindowUnload: function() {
        this.dispose()
    },
    _pageLoaded: function(a, c) {
        var b = this._get_eventHandlerList().getHandler("pageLoaded");
        if (b) b(this, this._getPageLoadedEventArgs(a, c));
        if (!a) Sys.Application.raiseLoad()
    },
    _pageLoadedInitialLoad: function() {
        this._pageLoaded(true, null)
    },
    _parseDelta: function(h) {
        var c = h.get_responseData(),
        d,
        i,
        E,
        F,
        D,
        b = 0,
        e = null,
        k = [];
        while (b < c.length) {
            d = c.indexOf("|", b);
            if (d === -1) {
                e = this._findText(c, b);
                break
            }
            i = parseInt(c.substring(b, d), 10);
            if (i % 1 !== 0) {
                e = this._findText(c, b);
                break
            }
            b = d + 1;
            d = c.indexOf("|", b);
            if (d === -1) {
                e = this._findText(c, b);
                break
            }
            E = c.substring(b, d);
            b = d + 1;
            d = c.indexOf("|", b);
            if (d === -1) {
                e = this._findText(c, b);
                break
            }
            F = c.substring(b, d);
            b = d + 1;
            if (b + i >= c.length) {
                e = this._findText(c, c.length);
                break
            }
            D = c.substr(b, i);
            b += i;
            if (c.charAt(b) !== "|") {
                e = this._findText(c, b);
                break
            }
            b++;
            Array.add(k, {
                type: E,
                id: F,
                content: D
            })
        }
        if (e) {
            this._endPostBack(this._createPageRequestManagerParserError(String.format(Sys.WebForms.Res.PRM_ParserErrorDetails, e)), h, null);
            return null
        }
        var x = [],
        w = [],
        q = [],
        j = [],
        t = [],
        C = [],
        A = [],
        z = [],
        v = [],
        s = [],
        m,
        p,
        u,
        n,
        o,
        r,
        y,
        g;
        for (var l = 0,
        G = k.length; l < G; l++) {
            var a = k[l];
            switch (a.type) {
            case "#":
                g = a;
                break;
            case "updatePanel":
                Array.add(x, a);
                break;
            case "hiddenField":
                Array.add(w, a);
                break;
            case "arrayDeclaration":
                Array.add(q, a);
                break;
            case "scriptBlock":
                Array.add(j, a);
                break;
            case "fallbackScript":
                j[j.length - 1].fallback = a.id;
            case "scriptStartupBlock":
                Array.add(t, a);
                break;
            case "expando":
                Array.add(C, a);
                break;
            case "onSubmit":
                Array.add(A, a);
                break;
            case "asyncPostBackControlIDs":
                m = a;
                break;
            case "postBackControlIDs":
                p = a;
                break;
            case "updatePanelIDs":
                u = a;
                break;
            case "asyncPostBackTimeout":
                n = a;
                break;
            case "childUpdatePanelIDs":
                o = a;
                break;
            case "panelsToRefreshIDs":
                r = a;
                break;
            case "formAction":
                y = a;
                break;
            case "dataItem":
                Array.add(z, a);
                break;
            case "dataItemJson":
                Array.add(v, a);
                break;
            case "scriptDispose":
                Array.add(s, a);
                break;
            case "pageRedirect":
                if (g && parseFloat(g.content) >= 4) a.content = unescape(a.content);
                if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
                    var f = document.createElement("a");
                    f.style.display = "none";
                    f.attachEvent("onclick", B);
                    f.href = a.content;
                    this._form.parentNode.insertBefore(f, this._form);
                    f.click();
                    f.detachEvent("onclick", B);
                    this._form.parentNode.removeChild(f);
                    function B(a) {
                        a.cancelBubble = true
                    }
                } else window.location.href = a.content;
                return null;
            case "error":
                this._endPostBack(this._createPageRequestManagerServerError(Number.parseInvariant(a.id), a.content), h, null);
                return null;
            case "pageTitle":
                document.title = a.content;
                break;
            case "focus":
                this._controlIDToFocus = a.content;
                break;
            default:
                this._endPostBack(this._createPageRequestManagerParserError(String.format(Sys.WebForms.Res.PRM_UnknownToken, a.type)), h, null);
                return null
            }
        }
        return {
            version4: g ? parseFloat(g.content) >= 4 : false,
            executor: h,
            updatePanelNodes: x,
            hiddenFieldNodes: w,
            arrayDeclarationNodes: q,
            scriptBlockNodes: j,
            scriptStartupNodes: t,
            expandoNodes: C,
            onSubmitNodes: A,
            dataItemNodes: z,
            dataItemJsonNodes: v,
            scriptDisposeNodes: s,
            asyncPostBackControlIDsNode: m,
            postBackControlIDsNode: p,
            updatePanelIDsNode: u,
            asyncPostBackTimeoutNode: n,
            childUpdatePanelIDsNode: o,
            panelsToRefreshNode: r,
            formActionNode: y
        }
    },
    _processUpdatePanelArrays: function(e, q, r, f) {
        var d, c, b;
        if (e) {
            var i = e.length,
            j = f ? 2 : 1;
            d = new Array(i / j);
            c = new Array(i / j);
            b = new Array(i / j);
            for (var g = 0,
            h = 0; g < i; g += j, h++) {
                var p, a = e[g],
                k = f ? e[g + 1] : "";
                p = a.charAt(0) === "t";
                a = a.substr(1);
                if (!k) k = this._uniqueIDToClientID(a);
                b[h] = p;
                d[h] = a;
                c[h] = k
            }
        } else {
            d = [];
            c = [];
            b = []
        }
        var n = [],
        l = [];
        this._convertToClientIDs(q, n, l, f);
        var o = [],
        m = [];
        this._convertToClientIDs(r, o, m, f);
        return {
            updatePanelIDs: d,
            updatePanelClientIDs: c,
            updatePanelHasChildrenAsTriggers: b,
            asyncPostBackControlIDs: n,
            asyncPostBackControlClientIDs: l,
            postBackControlIDs: o,
            postBackControlClientIDs: m
        }
    },
    _queueScripts: function(scriptLoader, scriptBlockNodes, queueIncludes, queueBlocks) {
        for (var i = 0,
        l = scriptBlockNodes.length; i < l; i++) {
            var scriptBlockType = scriptBlockNodes[i].id;
            switch (scriptBlockType) {
            case "ScriptContentNoTags":
                if (!queueBlocks) continue;
                scriptLoader.queueScriptBlock(scriptBlockNodes[i].content);
                break;
            case "ScriptContentWithTags":
                var scriptTagAttributes;
                eval("scriptTagAttributes = " + scriptBlockNodes[i].content);
                if (scriptTagAttributes.src) {
                    if (!queueIncludes || Sys._ScriptLoader.isScriptLoaded(scriptTagAttributes.src)) continue
                } else if (!queueBlocks) continue;
                scriptLoader.queueCustomScriptTag(scriptTagAttributes);
                break;
            case "ScriptPath":
                var script = scriptBlockNodes[i];
                if (!queueIncludes || Sys._ScriptLoader.isScriptLoaded(script.content)) continue;
                scriptLoader.queueScriptReference(script.content, script.fallback)
            }
        }
    },
    _registerDisposeScript: function(a, b) {
        if (!this._scriptDisposes[a]) this._scriptDisposes[a] = [b];
        else Array.add(this._scriptDisposes[a], b)
    },
    _scriptIncludesLoadComplete: function(e, b) {
        if (b.executor.get_webRequest() !== this._request) return;
        this._commitControls(b.updatePanelData, b.asyncPostBackTimeoutNode ? b.asyncPostBackTimeoutNode.content: null);
        if (b.formActionNode) this._form.action = b.formActionNode.content;
        var a, d, c;
        for (a = 0, d = b.updatePanelNodes.length; a < d; a++) {
            c = b.updatePanelNodes[a];
            var j = document.getElementById(c.id);
            if (!j) {
                this._endPostBack(Error.invalidOperation(String.format(Sys.WebForms.Res.PRM_MissingPanel, c.id)), b.executor, b);
                return
            }
            this._updatePanel(j, c.content)
        }
        for (a = 0, d = b.scriptDisposeNodes.length; a < d; a++) {
            c = b.scriptDisposeNodes[a];
            this._registerDisposeScript(c.id, c.content)
        }
        for (a = 0, d = this._transientFields.length; a < d; a++) {
            var g = document.getElementById(this._transientFields[a]);
            if (g) {
                var k = g._isContained ? g.parentNode: g;
                k.parentNode.removeChild(k)
            }
        }
        for (a = 0, d = b.hiddenFieldNodes.length; a < d; a++) {
            c = b.hiddenFieldNodes[a];
            this._createHiddenField(c.id, c.content)
        }
        if (b.scriptsFailed) throw Sys._ScriptLoader._errorScriptLoadFailed(b.scriptsFailed.src, b.scriptsFailed.multipleCallbacks);
        this._queueScripts(e, b.scriptBlockNodes, false, true);
        var i = "";
        for (a = 0, d = b.arrayDeclarationNodes.length; a < d; a++) {
            c = b.arrayDeclarationNodes[a];
            i += "Sys.WebForms.PageRequestManager._addArrayElement('" + c.id + "', " + c.content + ");\r\n"
        }
        var h = "";
        for (a = 0, d = b.expandoNodes.length; a < d; a++) {
            c = b.expandoNodes[a];
            h += c.id + " = " + c.content + "\r\n"
        }
        if (i.length) e.queueScriptBlock(i);
        if (h.length) e.queueScriptBlock(h);
        this._queueScripts(e, b.scriptStartupNodes, true, true);
        var f = "";
        for (a = 0, d = b.onSubmitNodes.length; a < d; a++) {
            if (a === 0) f = "Array.add(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, function() {\r\n";
            f += b.onSubmitNodes[a].content + "\r\n"
        }
        if (f.length) {
            f += "\r\nreturn true;\r\n});\r\n";
            e.queueScriptBlock(f)
        }
        e.loadScripts(0, Function.createDelegate(this, Function.createCallback(this._scriptsLoadComplete, b)), null, null)
    },
    _scriptIncludesLoadFailed: function(d, c, b, a) {
        a.scriptsFailed = {
            src: c.src,
            multipleCallbacks: b
        };
        this._scriptIncludesLoadComplete(d, a)
    },
    _scriptsLoadComplete: function(f, c) {
        var e = c.executor;
        if (window.__theFormPostData) window.__theFormPostData = "";
        if (window.__theFormPostCollection) window.__theFormPostCollection = [];
        if (window.WebForm_InitCallback) window.WebForm_InitCallback();
        if (this._scrollPosition) {
            if (window.scrollTo) window.scrollTo(this._scrollPosition.x, this._scrollPosition.y);
            this._scrollPosition = null
        }
        Sys.Application.endCreateComponents();
        this._pageLoaded(false, c);
        this._endPostBack(null, e, c);
        if (this._controlIDToFocus) {
            var a, d;
            if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
                var b = $get(this._controlIDToFocus);
                a = b;
                if (b && !WebForm_CanFocus(b)) a = WebForm_FindFirstFocusableChild(b);
                if (a && typeof a.contentEditable !== "undefined") {
                    d = a.contentEditable;
                    a.contentEditable = false
                } else a = null
            }
            WebForm_AutoFocus(this._controlIDToFocus);
            if (a) a.contentEditable = d;
            this._controlIDToFocus = null
        }
    },
    _splitNodeIntoArray: function(b) {
        var a = b.content,
        c = a.length ? a.split(",") : [];
        return c
    },
    _uniqueIDToClientID: function(a) {
        return a.replace(/\$/g, "_")
    },
    _updateControls: function(d, a, c, b, e) {
        this._commitControls(this._processUpdatePanelArrays(d, a, c, e), b)
    },
    _updatePanel: function(updatePanelElement, rendering) {
        for (var updatePanelID in this._scriptDisposes) if (this._elementContains(updatePanelElement, document.getElementById(updatePanelID))) {
            var disposeScripts = this._scriptDisposes[updatePanelID];
            for (var i = 0,
            l = disposeScripts.length; i < l; i++) eval(disposeScripts[i]);
            delete this._scriptDisposes[updatePanelID]
        }
        Sys.Application.disposeElement(updatePanelElement, true);
        updatePanelElement.innerHTML = rendering
    },
    _validPosition: function(a) {
        return typeof a !== "undefined" && a !== null && a !== 0
    }
};
Sys.WebForms.PageRequestManager.getInstance = function() {
    var a = Sys.WebForms.PageRequestManager._instance;
    if (!a) a = Sys.WebForms.PageRequestManager._instance = new Sys.WebForms.PageRequestManager;
    return a
};
Sys.WebForms.PageRequestManager._addArrayElement = function(a) {
    if (!window[a]) window[a] = [];
    for (var b = 1,
    c = arguments.length; b < c; b++) Array.add(window[a], arguments[b])
};
Sys.WebForms.PageRequestManager._initialize = function() {
    var a = Sys.WebForms.PageRequestManager.getInstance();
    a._initializeInternal.apply(a, arguments)
};
Sys.WebForms.PageRequestManager.registerClass("Sys.WebForms.PageRequestManager");
Sys.UI._UpdateProgress = function(a) {
    Sys.UI._UpdateProgress.initializeBase(this, [a]);
    this._displayAfter = 500;
    this._dynamicLayout = true;
    this._associatedUpdatePanelId = null;
    this._beginRequestHandlerDelegate = null;
    this._startDelegate = null;
    this._endRequestHandlerDelegate = null;
    this._pageRequestManager = null;
    this._timerCookie = null
};
Sys.UI._UpdateProgress.prototype = {
    get_displayAfter: function() {
        return this._displayAfter
    },
    set_displayAfter: function(a) {
        this._displayAfter = a
    },
    get_dynamicLayout: function() {
        return this._dynamicLayout
    },
    set_dynamicLayout: function(a) {
        this._dynamicLayout = a
    },
    get_associatedUpdatePanelId: function() {
        return this._associatedUpdatePanelId
    },
    set_associatedUpdatePanelId: function(a) {
        this._associatedUpdatePanelId = a
    },
    get_role: function() {
        return "status"
    },
    _clearTimeout: function() {
        if (this._timerCookie) {
            window.clearTimeout(this._timerCookie);
            this._timerCookie = null
        }
    },
    _getUniqueID: function(b) {
        var a = Array.indexOf(this._pageRequestManager._updatePanelClientIDs, b);
        return a === -1 ? null: this._pageRequestManager._updatePanelIDs[a]
    },
    _handleBeginRequest: function(f, e) {
        var b = e.get_postBackElement(),
        a = true,
        d = this._associatedUpdatePanelId;
        if (this._associatedUpdatePanelId) {
            var c = e.get_updatePanelsToUpdate();
            if (c && c.length) a = Array.contains(c, d) || Array.contains(c, this._getUniqueID(d));
            else a = false
        }
        while (!a && b) {
            if (b.id && this._associatedUpdatePanelId === b.id) a = true;
            b = b.parentNode
        }
        if (a) this._timerCookie = window.setTimeout(this._startDelegate, this._displayAfter)
    },
    _startRequest: function() {
        if (this._pageRequestManager.get_isInAsyncPostBack()) {
            var a = this.get_element();
            if (this._dynamicLayout) a.style.display = "block";
            else a.style.visibility = "visible";
            if (this.get_role() === "status") a.setAttribute("aria-hidden", "false")
        }
        this._timerCookie = null
    },
    _handleEndRequest: function() {
        var a = this.get_element();
        if (this._dynamicLayout) a.style.display = "none";
        else a.style.visibility = "hidden";
        if (this.get_role() === "status") a.setAttribute("aria-hidden", "true");
        this._clearTimeout()
    },
    dispose: function() {
        if (this._beginRequestHandlerDelegate !== null) {
            this._pageRequestManager.remove_beginRequest(this._beginRequestHandlerDelegate);
            this._pageRequestManager.remove_endRequest(this._endRequestHandlerDelegate);
            this._beginRequestHandlerDelegate = null;
            this._endRequestHandlerDelegate = null
        }
        this._clearTimeout();
        Sys.UI._UpdateProgress.callBaseMethod(this, "dispose")
    },
    initialize: function() {
        Sys.UI._UpdateProgress.callBaseMethod(this, "initialize");
        if (this.get_role() === "status") this.get_element().setAttribute("aria-hidden", "true");
        this._beginRequestHandlerDelegate = Function.createDelegate(this, this._handleBeginRequest);
        this._endRequestHandlerDelegate = Function.createDelegate(this, this._handleEndRequest);
        this._startDelegate = Function.createDelegate(this, this._startRequest);
        if (Sys.WebForms && Sys.WebForms.PageRequestManager) this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
        if (this._pageRequestManager !== null) {
            this._pageRequestManager.add_beginRequest(this._beginRequestHandlerDelegate);
            this._pageRequestManager.add_endRequest(this._endRequestHandlerDelegate)
        }
    }
};
Sys.UI._UpdateProgress.registerClass("Sys.UI._UpdateProgress", Sys.UI.Control);
Type.registerNamespace('Sys.WebForms');
Sys.WebForms.Res = {
    "PRM_UnknownToken": "未知标记:“{0}”。",
    "PRM_MissingPanel": "未能找到 ID 为“{0}”的 UpdatePanel。如果要动态更新该 UpdatePanel，则它必须位于另一个 UpdatePanel 内部。",
    "PRM_ServerError": "在服务器上处理请求时出现未知错误。服务器返回的状态码为: {0}",
    "PRM_ParserError": "未能分析从服务器收到的消息。之所以出现此错误，常见的原因是: 在通过调用 Response.Write() 修改响应时，将启用响应筛选器、HttpModule 或服务器跟踪。\r\n详细信息: {0}",
    "PRM_TimeoutError": "服务器请求超时。",
    "PRM_ParserErrorDetails": "分析附近的“{0}”时出错。",
    "PRM_CannotRegisterTwice": "不能初始化 PageRequestManager 多次。"
};