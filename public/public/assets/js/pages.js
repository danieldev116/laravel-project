/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FrameElement: () => (/* binding */ FrameElement),
/* harmony export */   FrameLoadingStyle: () => (/* binding */ FrameLoadingStyle),
/* harmony export */   FrameRenderer: () => (/* binding */ FrameRenderer),
/* harmony export */   PageRenderer: () => (/* binding */ PageRenderer),
/* harmony export */   PageSnapshot: () => (/* binding */ PageSnapshot),
/* harmony export */   StreamActions: () => (/* binding */ StreamActions),
/* harmony export */   StreamElement: () => (/* binding */ StreamElement),
/* harmony export */   StreamSourceElement: () => (/* binding */ StreamSourceElement),
/* harmony export */   cache: () => (/* binding */ cache),
/* harmony export */   clearCache: () => (/* binding */ clearCache),
/* harmony export */   connectStreamSource: () => (/* binding */ connectStreamSource),
/* harmony export */   disconnectStreamSource: () => (/* binding */ disconnectStreamSource),
/* harmony export */   navigator: () => (/* binding */ navigator$1),
/* harmony export */   registerAdapter: () => (/* binding */ registerAdapter),
/* harmony export */   renderStreamMessage: () => (/* binding */ renderStreamMessage),
/* harmony export */   session: () => (/* binding */ session),
/* harmony export */   setConfirmMethod: () => (/* binding */ setConfirmMethod),
/* harmony export */   setFormMode: () => (/* binding */ setFormMode),
/* harmony export */   setProgressBarDelay: () => (/* binding */ setProgressBarDelay),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   visit: () => (/* binding */ visit)
/* harmony export */ });
/*
Turbo 7.3.0
Copyright © 2023 37signals LLC
 */
(function () {
    if (window.Reflect === undefined ||
        window.customElements === undefined ||
        window.customElements.polyfillWrapFlushCallback) {
        return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
        HTMLElement: function HTMLElement() {
            return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
        },
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
})();

/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019 Javan Makhmali
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(prototype) {
  if (typeof prototype.requestSubmit == "function") return

  prototype.requestSubmit = function(submitter) {
    if (submitter) {
      validateSubmitter(submitter, this);
      submitter.click();
    } else {
      submitter = document.createElement("input");
      submitter.type = "submit";
      submitter.hidden = true;
      this.appendChild(submitter);
      submitter.click();
      this.removeChild(submitter);
    }
  };

  function validateSubmitter(submitter, form) {
    submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
    submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
    submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
  }

  function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name)
  }
})(HTMLFormElement.prototype);

const submittersByForm = new WeakMap();
function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
}
function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
        submittersByForm.set(submitter.form, submitter);
    }
}
(function () {
    if ("submitter" in Event.prototype)
        return;
    let prototype = window.Event.prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
        prototype = window.SubmitEvent.prototype;
    }
    else if ("SubmitEvent" in window) {
        return;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
        get() {
            if (this.type == "submit" && this.target instanceof HTMLFormElement) {
                return submittersByForm.get(this.target);
            }
        },
    });
})();

var FrameLoadingStyle;
(function (FrameLoadingStyle) {
    FrameLoadingStyle["eager"] = "eager";
    FrameLoadingStyle["lazy"] = "lazy";
})(FrameLoadingStyle || (FrameLoadingStyle = {}));
class FrameElement extends HTMLElement {
    static get observedAttributes() {
        return ["disabled", "complete", "loading", "src"];
    }
    constructor() {
        super();
        this.loaded = Promise.resolve();
        this.delegate = new FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
        this.delegate.connect();
    }
    disconnectedCallback() {
        this.delegate.disconnect();
    }
    reload() {
        return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
        if (name == "loading") {
            this.delegate.loadingStyleChanged();
        }
        else if (name == "complete") {
            this.delegate.completeChanged();
        }
        else if (name == "src") {
            this.delegate.sourceURLChanged();
        }
        else {
            this.delegate.disabledChanged();
        }
    }
    get src() {
        return this.getAttribute("src");
    }
    set src(value) {
        if (value) {
            this.setAttribute("src", value);
        }
        else {
            this.removeAttribute("src");
        }
    }
    get loading() {
        return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
        if (value) {
            this.setAttribute("loading", value);
        }
        else {
            this.removeAttribute("loading");
        }
    }
    get disabled() {
        return this.hasAttribute("disabled");
    }
    set disabled(value) {
        if (value) {
            this.setAttribute("disabled", "");
        }
        else {
            this.removeAttribute("disabled");
        }
    }
    get autoscroll() {
        return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
        if (value) {
            this.setAttribute("autoscroll", "");
        }
        else {
            this.removeAttribute("autoscroll");
        }
    }
    get complete() {
        return !this.delegate.isLoading;
    }
    get isActive() {
        return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
        var _a, _b;
        return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
}
function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
        case "lazy":
            return FrameLoadingStyle.lazy;
        default:
            return FrameLoadingStyle.eager;
    }
}

function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
}
function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
        return url.hash.slice(1);
    }
    else if ((anchorMatch = url.href.match(/#(.*)$/))) {
        return anchorMatch[1];
    }
}
function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
}
function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
}
function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
}
function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
}
function locationIsVisitable(location, rootLocation) {
    return isPrefixedBy(location, rootLocation) && isHTML(location);
}
function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
}
function toCacheKey(url) {
    return getRequestURL(url);
}
function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
}
function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
}
function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
}
function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
}
function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
}

class FetchResponse {
    constructor(response) {
        this.response = response;
    }
    get succeeded() {
        return this.response.ok;
    }
    get failed() {
        return !this.succeeded;
    }
    get clientError() {
        return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
        return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
        return this.response.redirected;
    }
    get location() {
        return expandURL(this.response.url);
    }
    get isHTML() {
        return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
        return this.response.status;
    }
    get contentType() {
        return this.header("Content-Type");
    }
    get responseText() {
        return this.response.clone().text();
    }
    get responseHTML() {
        if (this.isHTML) {
            return this.response.clone().text();
        }
        else {
            return Promise.resolve(undefined);
        }
    }
    header(name) {
        return this.response.headers.get(name);
    }
}

function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
    }
    else {
        const createdScriptElement = document.createElement("script");
        const cspNonce = getMetaContent("csp-nonce");
        if (cspNonce) {
            createdScriptElement.nonce = cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
    }
}
function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
        destinationElement.setAttribute(name, value);
    }
}
function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}
function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
        cancelable,
        bubbles: true,
        composed: true,
        detail,
    });
    if (target && target.isConnected) {
        target.dispatchEvent(event);
    }
    else {
        document.documentElement.dispatchEvent(event);
    }
    return event;
}
function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
}
function nextMicrotask() {
    return Promise.resolve();
}
function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
}
function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
}
function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] == undefined ? "" : values[i];
        return result + string + value;
    }, "");
}
function uuid() {
    return Array.from({ length: 36 })
        .map((_, i) => {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            return "-";
        }
        else if (i == 14) {
            return "4";
        }
        else if (i == 19) {
            return (Math.floor(Math.random() * 4) + 8).toString(16);
        }
        else {
            return Math.floor(Math.random() * 15).toString(16);
        }
    })
        .join("");
}
function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
        if (typeof value == "string")
            return value;
    }
    return null;
}
function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
}
function markAsBusy(...elements) {
    for (const element of elements) {
        if (element.localName == "turbo-frame") {
            element.setAttribute("busy", "");
        }
        element.setAttribute("aria-busy", "true");
    }
}
function clearBusyState(...elements) {
    for (const element of elements) {
        if (element.localName == "turbo-frame") {
            element.removeAttribute("busy");
        }
        element.removeAttribute("aria-busy");
    }
}
function waitForLoad(element, timeoutInMilliseconds = 2000) {
    return new Promise((resolve) => {
        const onComplete = () => {
            element.removeEventListener("error", onComplete);
            element.removeEventListener("load", onComplete);
            resolve();
        };
        element.addEventListener("load", onComplete, { once: true });
        element.addEventListener("error", onComplete, { once: true });
        setTimeout(resolve, timeoutInMilliseconds);
    });
}
function getHistoryMethodForAction(action) {
    switch (action) {
        case "replace":
            return history.replaceState;
        case "advance":
        case "restore":
            return history.pushState;
    }
}
function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
}
function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
}
function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
}
function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
}
function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
}
function findClosestRecursively(element, selector) {
    var _a;
    if (element instanceof Element) {
        return (element.closest(selector) ||
            findClosestRecursively(element.assignedSlot || ((_a = element.getRootNode()) === null || _a === void 0 ? void 0 : _a.host), selector));
    }
}

var FetchMethod;
(function (FetchMethod) {
    FetchMethod[FetchMethod["get"] = 0] = "get";
    FetchMethod[FetchMethod["post"] = 1] = "post";
    FetchMethod[FetchMethod["put"] = 2] = "put";
    FetchMethod[FetchMethod["patch"] = 3] = "patch";
    FetchMethod[FetchMethod["delete"] = 4] = "delete";
})(FetchMethod || (FetchMethod = {}));
function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
        case "get":
            return FetchMethod.get;
        case "post":
            return FetchMethod.post;
        case "put":
            return FetchMethod.put;
        case "patch":
            return FetchMethod.patch;
        case "delete":
            return FetchMethod.delete;
    }
}
class FetchRequest {
    constructor(delegate, method, location, body = new URLSearchParams(), target = null) {
        this.abortController = new AbortController();
        this.resolveRequestPromise = (_value) => { };
        this.delegate = delegate;
        this.method = method;
        this.headers = this.defaultHeaders;
        this.body = body;
        this.url = location;
        this.target = target;
    }
    get location() {
        return this.url;
    }
    get params() {
        return this.url.searchParams;
    }
    get entries() {
        return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
        this.abortController.abort();
    }
    async perform() {
        const { fetchOptions } = this;
        this.delegate.prepareRequest(this);
        await this.allowRequestToBeIntercepted(fetchOptions);
        try {
            this.delegate.requestStarted(this);
            const response = await fetch(this.url.href, fetchOptions);
            return await this.receive(response);
        }
        catch (error) {
            if (error.name !== "AbortError") {
                if (this.willDelegateErrorHandling(error)) {
                    this.delegate.requestErrored(this, error);
                }
                throw error;
            }
        }
        finally {
            this.delegate.requestFinished(this);
        }
    }
    async receive(response) {
        const fetchResponse = new FetchResponse(response);
        const event = dispatch("turbo:before-fetch-response", {
            cancelable: true,
            detail: { fetchResponse },
            target: this.target,
        });
        if (event.defaultPrevented) {
            this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
        }
        else if (fetchResponse.succeeded) {
            this.delegate.requestSucceededWithResponse(this, fetchResponse);
        }
        else {
            this.delegate.requestFailedWithResponse(this, fetchResponse);
        }
        return fetchResponse;
    }
    get fetchOptions() {
        var _a;
        return {
            method: FetchMethod[this.method].toUpperCase(),
            credentials: "same-origin",
            headers: this.headers,
            redirect: "follow",
            body: this.isSafe ? null : this.body,
            signal: this.abortSignal,
            referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href,
        };
    }
    get defaultHeaders() {
        return {
            Accept: "text/html, application/xhtml+xml",
        };
    }
    get isSafe() {
        return this.method === FetchMethod.get;
    }
    get abortSignal() {
        return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
        this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async allowRequestToBeIntercepted(fetchOptions) {
        const requestInterception = new Promise((resolve) => (this.resolveRequestPromise = resolve));
        const event = dispatch("turbo:before-fetch-request", {
            cancelable: true,
            detail: {
                fetchOptions,
                url: this.url,
                resume: this.resolveRequestPromise,
            },
            target: this.target,
        });
        if (event.defaultPrevented)
            await requestInterception;
    }
    willDelegateErrorHandling(error) {
        const event = dispatch("turbo:fetch-request-error", {
            target: this.target,
            cancelable: true,
            detail: { request: this, error: error },
        });
        return !event.defaultPrevented;
    }
}

class AppearanceObserver {
    constructor(delegate, element) {
        this.started = false;
        this.intersect = (entries) => {
            const lastEntry = entries.slice(-1)[0];
            if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
                this.delegate.elementAppearedInViewport(this.element);
            }
        };
        this.delegate = delegate;
        this.element = element;
        this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.intersectionObserver.observe(this.element);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.intersectionObserver.unobserve(this.element);
        }
    }
}

class StreamMessage {
    static wrap(message) {
        if (typeof message == "string") {
            return new this(createDocumentFragment(message));
        }
        else {
            return message;
        }
    }
    constructor(fragment) {
        this.fragment = importStreamElements(fragment);
    }
}
StreamMessage.contentType = "text/vnd.turbo-stream.html";
function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
        const streamElement = document.importNode(element, true);
        for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
            inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
        }
        element.replaceWith(streamElement);
    }
    return fragment;
}

var FormSubmissionState;
(function (FormSubmissionState) {
    FormSubmissionState[FormSubmissionState["initialized"] = 0] = "initialized";
    FormSubmissionState[FormSubmissionState["requesting"] = 1] = "requesting";
    FormSubmissionState[FormSubmissionState["waiting"] = 2] = "waiting";
    FormSubmissionState[FormSubmissionState["receiving"] = 3] = "receiving";
    FormSubmissionState[FormSubmissionState["stopping"] = 4] = "stopping";
    FormSubmissionState[FormSubmissionState["stopped"] = 5] = "stopped";
})(FormSubmissionState || (FormSubmissionState = {}));
var FormEnctype;
(function (FormEnctype) {
    FormEnctype["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype["multipart"] = "multipart/form-data";
    FormEnctype["plain"] = "text/plain";
})(FormEnctype || (FormEnctype = {}));
function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
        case FormEnctype.multipart:
            return FormEnctype.multipart;
        case FormEnctype.plain:
            return FormEnctype.plain;
        default:
            return FormEnctype.urlEncoded;
    }
}
class FormSubmission {
    static confirmMethod(message, _element, _submitter) {
        return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter, mustRedirect = false) {
        this.state = FormSubmissionState.initialized;
        this.delegate = delegate;
        this.formElement = formElement;
        this.submitter = submitter;
        this.formData = buildFormData(formElement, submitter);
        this.location = expandURL(this.action);
        if (this.method == FetchMethod.get) {
            mergeFormDataEntries(this.location, [...this.body.entries()]);
        }
        this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
        this.mustRedirect = mustRedirect;
    }
    get method() {
        var _a;
        const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
        return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
        var _a;
        const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
        if ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.hasAttribute("formaction")) {
            return this.submitter.getAttribute("formaction") || "";
        }
        else {
            return this.formElement.getAttribute("action") || formElementAction || "";
        }
    }
    get body() {
        if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
            return new URLSearchParams(this.stringFormData);
        }
        else {
            return this.formData;
        }
    }
    get enctype() {
        var _a;
        return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isSafe() {
        return this.fetchRequest.isSafe;
    }
    get stringFormData() {
        return [...this.formData].reduce((entries, [name, value]) => {
            return entries.concat(typeof value == "string" ? [[name, value]] : []);
        }, []);
    }
    async start() {
        const { initialized, requesting } = FormSubmissionState;
        const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
        if (typeof confirmationMessage === "string") {
            const answer = await FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
            if (!answer) {
                return;
            }
        }
        if (this.state == initialized) {
            this.state = requesting;
            return this.fetchRequest.perform();
        }
    }
    stop() {
        const { stopping, stopped } = FormSubmissionState;
        if (this.state != stopping && this.state != stopped) {
            this.state = stopping;
            this.fetchRequest.cancel();
            return true;
        }
    }
    prepareRequest(request) {
        if (!request.isSafe) {
            const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
            if (token) {
                request.headers["X-CSRF-Token"] = token;
            }
        }
        if (this.requestAcceptsTurboStreamResponse(request)) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted(_request) {
        var _a;
        this.state = FormSubmissionState.waiting;
        (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
        this.setSubmitsWith();
        dispatch("turbo:submit-start", {
            target: this.formElement,
            detail: { formSubmission: this },
        });
        this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
        this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
        if (response.clientError || response.serverError) {
            this.delegate.formSubmissionFailedWithResponse(this, response);
        }
        else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
            const error = new Error("Form responses must redirect to another location");
            this.delegate.formSubmissionErrored(this, error);
        }
        else {
            this.state = FormSubmissionState.receiving;
            this.result = { success: true, fetchResponse: response };
            this.delegate.formSubmissionSucceededWithResponse(this, response);
        }
    }
    requestFailedWithResponse(request, response) {
        this.result = { success: false, fetchResponse: response };
        this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error) {
        this.result = { success: false, error };
        this.delegate.formSubmissionErrored(this, error);
    }
    requestFinished(_request) {
        var _a;
        this.state = FormSubmissionState.stopped;
        (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
        this.resetSubmitterText();
        dispatch("turbo:submit-end", {
            target: this.formElement,
            detail: Object.assign({ formSubmission: this }, this.result),
        });
        this.delegate.formSubmissionFinished(this);
    }
    setSubmitsWith() {
        if (!this.submitter || !this.submitsWith)
            return;
        if (this.submitter.matches("button")) {
            this.originalSubmitText = this.submitter.innerHTML;
            this.submitter.innerHTML = this.submitsWith;
        }
        else if (this.submitter.matches("input")) {
            const input = this.submitter;
            this.originalSubmitText = input.value;
            input.value = this.submitsWith;
        }
    }
    resetSubmitterText() {
        if (!this.submitter || !this.originalSubmitText)
            return;
        if (this.submitter.matches("button")) {
            this.submitter.innerHTML = this.originalSubmitText;
        }
        else if (this.submitter.matches("input")) {
            const input = this.submitter;
            input.value = this.originalSubmitText;
        }
    }
    requestMustRedirect(request) {
        return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
        return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
        var _a;
        return (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("data-turbo-submits-with");
    }
}
function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name) {
        formData.append(name, value || "");
    }
    return formData;
}
function getCookieValue(cookieName) {
    if (cookieName != null) {
        const cookies = document.cookie ? document.cookie.split("; ") : [];
        const cookie = cookies.find((cookie) => cookie.startsWith(cookieName));
        if (cookie) {
            const value = cookie.split("=").slice(1).join("=");
            return value ? decodeURIComponent(value) : undefined;
        }
    }
}
function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
}
function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
        if (value instanceof File)
            continue;
        searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
}

class Snapshot {
    constructor(element) {
        this.element = element;
    }
    get activeElement() {
        return this.element.ownerDocument.activeElement;
    }
    get children() {
        return [...this.element.children];
    }
    hasAnchor(anchor) {
        return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
        return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
        return this.element.isConnected;
    }
    get firstAutofocusableElement() {
        const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
        for (const element of this.element.querySelectorAll("[autofocus]")) {
            if (element.closest(inertDisabledOrHidden) == null)
                return element;
            else
                continue;
        }
        return null;
    }
    get permanentElements() {
        return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
        return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
        const permanentElementMap = {};
        for (const currentPermanentElement of this.permanentElements) {
            const { id } = currentPermanentElement;
            const newPermanentElement = snapshot.getPermanentElementById(id);
            if (newPermanentElement) {
                permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
            }
        }
        return permanentElementMap;
    }
}
function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
}
function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
}

class FormSubmitObserver {
    constructor(delegate, eventTarget) {
        this.started = false;
        this.submitCaptured = () => {
            this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
            this.eventTarget.addEventListener("submit", this.submitBubbled, false);
        };
        this.submitBubbled = ((event) => {
            if (!event.defaultPrevented) {
                const form = event.target instanceof HTMLFormElement ? event.target : undefined;
                const submitter = event.submitter || undefined;
                if (form &&
                    submissionDoesNotDismissDialog(form, submitter) &&
                    submissionDoesNotTargetIFrame(form, submitter) &&
                    this.delegate.willSubmitForm(form, submitter)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.delegate.formSubmitted(form, submitter);
                }
            }
        });
        this.delegate = delegate;
        this.eventTarget = eventTarget;
    }
    start() {
        if (!this.started) {
            this.eventTarget.addEventListener("submit", this.submitCaptured, true);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
            this.started = false;
        }
    }
}
function submissionDoesNotDismissDialog(form, submitter) {
    const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
    return method != "dialog";
}
function submissionDoesNotTargetIFrame(form, submitter) {
    if ((submitter === null || submitter === void 0 ? void 0 : submitter.hasAttribute("formtarget")) || form.hasAttribute("target")) {
        const target = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formtarget")) || form.target;
        for (const element of document.getElementsByName(target)) {
            if (element instanceof HTMLIFrameElement)
                return false;
        }
        return true;
    }
    else {
        return true;
    }
}

class View {
    constructor(delegate, element) {
        this.resolveRenderPromise = (_value) => { };
        this.resolveInterceptionPromise = (_value) => { };
        this.delegate = delegate;
        this.element = element;
    }
    scrollToAnchor(anchor) {
        const element = this.snapshot.getElementForAnchor(anchor);
        if (element) {
            this.scrollToElement(element);
            this.focusElement(element);
        }
        else {
            this.scrollToPosition({ x: 0, y: 0 });
        }
    }
    scrollToAnchorFromLocation(location) {
        this.scrollToAnchor(getAnchor(location));
    }
    scrollToElement(element) {
        element.scrollIntoView();
    }
    focusElement(element) {
        if (element instanceof HTMLElement) {
            if (element.hasAttribute("tabindex")) {
                element.focus();
            }
            else {
                element.setAttribute("tabindex", "-1");
                element.focus();
                element.removeAttribute("tabindex");
            }
        }
    }
    scrollToPosition({ x, y }) {
        this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
        this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
        return window;
    }
    async render(renderer) {
        const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
        if (shouldRender) {
            try {
                this.renderPromise = new Promise((resolve) => (this.resolveRenderPromise = resolve));
                this.renderer = renderer;
                await this.prepareToRenderSnapshot(renderer);
                const renderInterception = new Promise((resolve) => (this.resolveInterceptionPromise = resolve));
                const options = { resume: this.resolveInterceptionPromise, render: this.renderer.renderElement };
                const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
                if (!immediateRender)
                    await renderInterception;
                await this.renderSnapshot(renderer);
                this.delegate.viewRenderedSnapshot(snapshot, isPreview);
                this.delegate.preloadOnLoadLinksForView(this.element);
                this.finishRenderingSnapshot(renderer);
            }
            finally {
                delete this.renderer;
                this.resolveRenderPromise(undefined);
                delete this.renderPromise;
            }
        }
        else {
            this.invalidate(renderer.reloadReason);
        }
    }
    invalidate(reason) {
        this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
        this.markAsPreview(renderer.isPreview);
        await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
        if (isPreview) {
            this.element.setAttribute("data-turbo-preview", "");
        }
        else {
            this.element.removeAttribute("data-turbo-preview");
        }
    }
    async renderSnapshot(renderer) {
        await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
        renderer.finishRendering();
    }
}

class FrameView extends View {
    missing() {
        this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
        return new Snapshot(this.element);
    }
}

class LinkInterceptor {
    constructor(delegate, element) {
        this.clickBubbled = (event) => {
            if (this.respondsToEventTarget(event.target)) {
                this.clickEvent = event;
            }
            else {
                delete this.clickEvent;
            }
        };
        this.linkClicked = ((event) => {
            if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
                if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
                    this.clickEvent.preventDefault();
                    event.preventDefault();
                    this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
                }
            }
            delete this.clickEvent;
        });
        this.willVisit = ((_event) => {
            delete this.clickEvent;
        });
        this.delegate = delegate;
        this.element = element;
    }
    start() {
        this.element.addEventListener("click", this.clickBubbled);
        document.addEventListener("turbo:click", this.linkClicked);
        document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
        this.element.removeEventListener("click", this.clickBubbled);
        document.removeEventListener("turbo:click", this.linkClicked);
        document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
        const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
        return element && element.closest("turbo-frame, html") == this.element;
    }
}

class LinkClickObserver {
    constructor(delegate, eventTarget) {
        this.started = false;
        this.clickCaptured = () => {
            this.eventTarget.removeEventListener("click", this.clickBubbled, false);
            this.eventTarget.addEventListener("click", this.clickBubbled, false);
        };
        this.clickBubbled = (event) => {
            if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
                const target = (event.composedPath && event.composedPath()[0]) || event.target;
                const link = this.findLinkFromClickTarget(target);
                if (link && doesNotTargetIFrame(link)) {
                    const location = this.getLocationForLink(link);
                    if (this.delegate.willFollowLinkToLocation(link, location, event)) {
                        event.preventDefault();
                        this.delegate.followedLinkToLocation(link, location);
                    }
                }
            }
        };
        this.delegate = delegate;
        this.eventTarget = eventTarget;
    }
    start() {
        if (!this.started) {
            this.eventTarget.addEventListener("click", this.clickCaptured, true);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.eventTarget.removeEventListener("click", this.clickCaptured, true);
            this.started = false;
        }
    }
    clickEventIsSignificant(event) {
        return !((event.target && event.target.isContentEditable) ||
            event.defaultPrevented ||
            event.which > 1 ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey);
    }
    findLinkFromClickTarget(target) {
        return findClosestRecursively(target, "a[href]:not([target^=_]):not([download])");
    }
    getLocationForLink(link) {
        return expandURL(link.getAttribute("href") || "");
    }
}
function doesNotTargetIFrame(anchor) {
    if (anchor.hasAttribute("target")) {
        for (const element of document.getElementsByName(anchor.target)) {
            if (element instanceof HTMLIFrameElement)
                return false;
        }
        return true;
    }
    else {
        return true;
    }
}

class FormLinkClickObserver {
    constructor(delegate, element) {
        this.delegate = delegate;
        this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
        this.linkInterceptor.start();
    }
    stop() {
        this.linkInterceptor.stop();
    }
    willFollowLinkToLocation(link, location, originalEvent) {
        return (this.delegate.willSubmitFormLinkToLocation(link, location, originalEvent) &&
            link.hasAttribute("data-turbo-method"));
    }
    followedLinkToLocation(link, location) {
        const form = document.createElement("form");
        const type = "hidden";
        for (const [name, value] of location.searchParams) {
            form.append(Object.assign(document.createElement("input"), { type, name, value }));
        }
        const action = Object.assign(location, { search: "" });
        form.setAttribute("data-turbo", "true");
        form.setAttribute("action", action.href);
        form.setAttribute("hidden", "");
        const method = link.getAttribute("data-turbo-method");
        if (method)
            form.setAttribute("method", method);
        const turboFrame = link.getAttribute("data-turbo-frame");
        if (turboFrame)
            form.setAttribute("data-turbo-frame", turboFrame);
        const turboAction = getVisitAction(link);
        if (turboAction)
            form.setAttribute("data-turbo-action", turboAction);
        const turboConfirm = link.getAttribute("data-turbo-confirm");
        if (turboConfirm)
            form.setAttribute("data-turbo-confirm", turboConfirm);
        const turboStream = link.hasAttribute("data-turbo-stream");
        if (turboStream)
            form.setAttribute("data-turbo-stream", "");
        this.delegate.submittedFormLinkToLocation(link, location, form);
        document.body.appendChild(form);
        form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
        requestAnimationFrame(() => form.requestSubmit());
    }
}

class Bardo {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
        const bardo = new this(delegate, permanentElementMap);
        bardo.enter();
        await callback();
        bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
        this.delegate = delegate;
        this.permanentElementMap = permanentElementMap;
    }
    enter() {
        for (const id in this.permanentElementMap) {
            const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
            this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
            this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
        }
    }
    leave() {
        for (const id in this.permanentElementMap) {
            const [currentPermanentElement] = this.permanentElementMap[id];
            this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
            this.replacePlaceholderWithPermanentElement(currentPermanentElement);
            this.delegate.leavingBardo(currentPermanentElement);
        }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
        const placeholder = createPlaceholderForPermanentElement(permanentElement);
        permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
        const clone = permanentElement.cloneNode(true);
        permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
        const placeholder = this.getPlaceholderById(permanentElement.id);
        placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
        return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
        return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
}
function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
}

class Renderer {
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
        this.activeElement = null;
        this.currentSnapshot = currentSnapshot;
        this.newSnapshot = newSnapshot;
        this.isPreview = isPreview;
        this.willRender = willRender;
        this.renderElement = renderElement;
        this.promise = new Promise((resolve, reject) => (this.resolvingFunctions = { resolve, reject }));
    }
    get shouldRender() {
        return true;
    }
    get reloadReason() {
        return;
    }
    prepareToRender() {
        return;
    }
    finishRendering() {
        if (this.resolvingFunctions) {
            this.resolvingFunctions.resolve();
            delete this.resolvingFunctions;
        }
    }
    async preservingPermanentElements(callback) {
        await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
        const element = this.connectedSnapshot.firstAutofocusableElement;
        if (elementIsFocusable(element)) {
            element.focus();
        }
    }
    enteringBardo(currentPermanentElement) {
        if (this.activeElement)
            return;
        if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
            this.activeElement = this.currentSnapshot.activeElement;
        }
    }
    leavingBardo(currentPermanentElement) {
        if (currentPermanentElement.contains(this.activeElement) && this.activeElement instanceof HTMLElement) {
            this.activeElement.focus();
            this.activeElement = null;
        }
    }
    get connectedSnapshot() {
        return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
        return this.currentSnapshot.element;
    }
    get newElement() {
        return this.newSnapshot.element;
    }
    get permanentElementMap() {
        return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
}
function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
}

class FrameRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        var _a;
        const destinationRange = document.createRange();
        destinationRange.selectNodeContents(currentElement);
        destinationRange.deleteContents();
        const frameElement = newElement;
        const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
        if (sourceRange) {
            sourceRange.selectNodeContents(frameElement);
            currentElement.appendChild(sourceRange.extractContents());
        }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
        super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
        this.delegate = delegate;
    }
    get shouldRender() {
        return true;
    }
    async render() {
        await nextAnimationFrame();
        this.preservingPermanentElements(() => {
            this.loadFrameElement();
        });
        this.scrollFrameIntoView();
        await nextAnimationFrame();
        this.focusFirstAutofocusableElement();
        await nextAnimationFrame();
        this.activateScriptElements();
    }
    loadFrameElement() {
        this.delegate.willRenderFrame(this.currentElement, this.newElement);
        this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
        if (this.currentElement.autoscroll || this.newElement.autoscroll) {
            const element = this.currentElement.firstElementChild;
            const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
            const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
            if (element) {
                element.scrollIntoView({ block, behavior });
                return true;
            }
        }
        return false;
    }
    activateScriptElements() {
        for (const inertScriptElement of this.newScriptElements) {
            const activatedScriptElement = activateScriptElement(inertScriptElement);
            inertScriptElement.replaceWith(activatedScriptElement);
        }
    }
    get newScriptElements() {
        return this.currentElement.querySelectorAll("script");
    }
}
function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
        return value;
    }
    else {
        return defaultValue;
    }
}
function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
        return value;
    }
    else {
        return defaultValue;
    }
}

class ProgressBar {
    static get defaultCSS() {
        return unindent `
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    constructor() {
        this.hiding = false;
        this.value = 0;
        this.visible = false;
        this.trickle = () => {
            this.setValue(this.value + Math.random() / 100);
        };
        this.stylesheetElement = this.createStylesheetElement();
        this.progressElement = this.createProgressElement();
        this.installStylesheetElement();
        this.setValue(0);
    }
    show() {
        if (!this.visible) {
            this.visible = true;
            this.installProgressElement();
            this.startTrickling();
        }
    }
    hide() {
        if (this.visible && !this.hiding) {
            this.hiding = true;
            this.fadeProgressElement(() => {
                this.uninstallProgressElement();
                this.stopTrickling();
                this.visible = false;
                this.hiding = false;
            });
        }
    }
    setValue(value) {
        this.value = value;
        this.refresh();
    }
    installStylesheetElement() {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
        this.progressElement.style.width = "0";
        this.progressElement.style.opacity = "1";
        document.documentElement.insertBefore(this.progressElement, document.body);
        this.refresh();
    }
    fadeProgressElement(callback) {
        this.progressElement.style.opacity = "0";
        setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
        if (this.progressElement.parentNode) {
            document.documentElement.removeChild(this.progressElement);
        }
    }
    startTrickling() {
        if (!this.trickleInterval) {
            this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
        }
    }
    stopTrickling() {
        window.clearInterval(this.trickleInterval);
        delete this.trickleInterval;
    }
    refresh() {
        requestAnimationFrame(() => {
            this.progressElement.style.width = `${10 + this.value * 90}%`;
        });
    }
    createStylesheetElement() {
        const element = document.createElement("style");
        element.type = "text/css";
        element.textContent = ProgressBar.defaultCSS;
        if (this.cspNonce) {
            element.nonce = this.cspNonce;
        }
        return element;
    }
    createProgressElement() {
        const element = document.createElement("div");
        element.className = "turbo-progress-bar";
        return element;
    }
    get cspNonce() {
        return getMetaContent("csp-nonce");
    }
}
ProgressBar.animationDuration = 300;

class HeadSnapshot extends Snapshot {
    constructor() {
        super(...arguments);
        this.detailsByOuterHTML = this.children
            .filter((element) => !elementIsNoscript(element))
            .map((element) => elementWithoutNonce(element))
            .reduce((result, element) => {
            const { outerHTML } = element;
            const details = outerHTML in result
                ? result[outerHTML]
                : {
                    type: elementType(element),
                    tracked: elementIsTracked(element),
                    elements: [],
                };
            return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
        }, {});
    }
    get trackedElementSignature() {
        return Object.keys(this.detailsByOuterHTML)
            .filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked)
            .join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
        return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
        return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
        return Object.keys(this.detailsByOuterHTML)
            .filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML))
            .map((outerHTML) => this.detailsByOuterHTML[outerHTML])
            .filter(({ type }) => type == matchedType)
            .map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
        return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
            const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
            if (type == null && !tracked) {
                return [...result, ...elements];
            }
            else if (elements.length > 1) {
                return [...result, ...elements.slice(1)];
            }
            else {
                return result;
            }
        }, []);
    }
    getMetaValue(name) {
        const element = this.findMetaElementByName(name);
        return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
        return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
            const { elements: [element], } = this.detailsByOuterHTML[outerHTML];
            return elementIsMetaElementWithName(element, name) ? element : result;
        }, undefined);
    }
}
function elementType(element) {
    if (elementIsScript(element)) {
        return "script";
    }
    else if (elementIsStylesheet(element)) {
        return "stylesheet";
    }
}
function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
}
function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
}
function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
}
function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || (tagName == "link" && element.getAttribute("rel") == "stylesheet");
}
function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
}
function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
        element.setAttribute("nonce", "");
    }
    return element;
}

class PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
        return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
        return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
        return new this(body, new HeadSnapshot(head));
    }
    constructor(element, headSnapshot) {
        super(element);
        this.headSnapshot = headSnapshot;
    }
    clone() {
        const clonedElement = this.element.cloneNode(true);
        const selectElements = this.element.querySelectorAll("select");
        const clonedSelectElements = clonedElement.querySelectorAll("select");
        for (const [index, source] of selectElements.entries()) {
            const clone = clonedSelectElements[index];
            for (const option of clone.selectedOptions)
                option.selected = false;
            for (const option of source.selectedOptions)
                clone.options[option.index].selected = true;
        }
        for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
            clonedPasswordInput.value = "";
        }
        return new PageSnapshot(clonedElement, this.headSnapshot);
    }
    get headElement() {
        return this.headSnapshot.element;
    }
    get rootLocation() {
        var _a;
        const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
        return expandURL(root);
    }
    get cacheControlValue() {
        return this.getSetting("cache-control");
    }
    get isPreviewable() {
        return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
        return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
        return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
        return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
}

var TimingMetric;
(function (TimingMetric) {
    TimingMetric["visitStart"] = "visitStart";
    TimingMetric["requestStart"] = "requestStart";
    TimingMetric["requestEnd"] = "requestEnd";
    TimingMetric["visitEnd"] = "visitEnd";
})(TimingMetric || (TimingMetric = {}));
var VisitState;
(function (VisitState) {
    VisitState["initialized"] = "initialized";
    VisitState["started"] = "started";
    VisitState["canceled"] = "canceled";
    VisitState["failed"] = "failed";
    VisitState["completed"] = "completed";
})(VisitState || (VisitState = {}));
const defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => { },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false,
};
var SystemStatusCode;
(function (SystemStatusCode) {
    SystemStatusCode[SystemStatusCode["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode[SystemStatusCode["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode[SystemStatusCode["contentTypeMismatch"] = -2] = "contentTypeMismatch";
})(SystemStatusCode || (SystemStatusCode = {}));
class Visit {
    constructor(delegate, location, restorationIdentifier, options = {}) {
        this.identifier = uuid();
        this.timingMetrics = {};
        this.followedRedirect = false;
        this.historyChanged = false;
        this.scrolled = false;
        this.shouldCacheSnapshot = true;
        this.acceptsStreamResponse = false;
        this.snapshotCached = false;
        this.state = VisitState.initialized;
        this.delegate = delegate;
        this.location = location;
        this.restorationIdentifier = restorationIdentifier || uuid();
        const { action, historyChanged, referrer, snapshot, snapshotHTML, response, visitCachedSnapshot, willRender, updateHistory, shouldCacheSnapshot, acceptsStreamResponse, } = Object.assign(Object.assign({}, defaultOptions), options);
        this.action = action;
        this.historyChanged = historyChanged;
        this.referrer = referrer;
        this.snapshot = snapshot;
        this.snapshotHTML = snapshotHTML;
        this.response = response;
        this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
        this.visitCachedSnapshot = visitCachedSnapshot;
        this.willRender = willRender;
        this.updateHistory = updateHistory;
        this.scrolled = !willRender;
        this.shouldCacheSnapshot = shouldCacheSnapshot;
        this.acceptsStreamResponse = acceptsStreamResponse;
    }
    get adapter() {
        return this.delegate.adapter;
    }
    get view() {
        return this.delegate.view;
    }
    get history() {
        return this.delegate.history;
    }
    get restorationData() {
        return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
        return this.isSamePage;
    }
    start() {
        if (this.state == VisitState.initialized) {
            this.recordTimingMetric(TimingMetric.visitStart);
            this.state = VisitState.started;
            this.adapter.visitStarted(this);
            this.delegate.visitStarted(this);
        }
    }
    cancel() {
        if (this.state == VisitState.started) {
            if (this.request) {
                this.request.cancel();
            }
            this.cancelRender();
            this.state = VisitState.canceled;
        }
    }
    complete() {
        if (this.state == VisitState.started) {
            this.recordTimingMetric(TimingMetric.visitEnd);
            this.state = VisitState.completed;
            this.followRedirect();
            if (!this.followedRedirect) {
                this.adapter.visitCompleted(this);
                this.delegate.visitCompleted(this);
            }
        }
    }
    fail() {
        if (this.state == VisitState.started) {
            this.state = VisitState.failed;
            this.adapter.visitFailed(this);
        }
    }
    changeHistory() {
        var _a;
        if (!this.historyChanged && this.updateHistory) {
            const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
            const method = getHistoryMethodForAction(actionForHistory);
            this.history.update(method, this.location, this.restorationIdentifier);
            this.historyChanged = true;
        }
    }
    issueRequest() {
        if (this.hasPreloadedResponse()) {
            this.simulateRequest();
        }
        else if (this.shouldIssueRequest() && !this.request) {
            this.request = new FetchRequest(this, FetchMethod.get, this.location);
            this.request.perform();
        }
    }
    simulateRequest() {
        if (this.response) {
            this.startRequest();
            this.recordResponse();
            this.finishRequest();
        }
    }
    startRequest() {
        this.recordTimingMetric(TimingMetric.requestStart);
        this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
        this.response = response;
        if (response) {
            const { statusCode } = response;
            if (isSuccessful(statusCode)) {
                this.adapter.visitRequestCompleted(this);
            }
            else {
                this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
            }
        }
    }
    finishRequest() {
        this.recordTimingMetric(TimingMetric.requestEnd);
        this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
        if (this.response) {
            const { statusCode, responseHTML } = this.response;
            this.render(async () => {
                if (this.shouldCacheSnapshot)
                    this.cacheSnapshot();
                if (this.view.renderPromise)
                    await this.view.renderPromise;
                if (isSuccessful(statusCode) && responseHTML != null) {
                    await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender, this);
                    this.performScroll();
                    this.adapter.visitRendered(this);
                    this.complete();
                }
                else {
                    await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
                    this.adapter.visitRendered(this);
                    this.fail();
                }
            });
        }
    }
    getCachedSnapshot() {
        const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
        if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
            if (this.action == "restore" || snapshot.isPreviewable) {
                return snapshot;
            }
        }
    }
    getPreloadedSnapshot() {
        if (this.snapshotHTML) {
            return PageSnapshot.fromHTMLString(this.snapshotHTML);
        }
    }
    hasCachedSnapshot() {
        return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
        const snapshot = this.getCachedSnapshot();
        if (snapshot) {
            const isPreview = this.shouldIssueRequest();
            this.render(async () => {
                this.cacheSnapshot();
                if (this.isSamePage) {
                    this.adapter.visitRendered(this);
                }
                else {
                    if (this.view.renderPromise)
                        await this.view.renderPromise;
                    await this.view.renderPage(snapshot, isPreview, this.willRender, this);
                    this.performScroll();
                    this.adapter.visitRendered(this);
                    if (!isPreview) {
                        this.complete();
                    }
                }
            });
        }
    }
    followRedirect() {
        var _a;
        if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
            this.adapter.visitProposedToLocation(this.redirectedToLocation, {
                action: "replace",
                response: this.response,
                shouldCacheSnapshot: false,
                willRender: false,
            });
            this.followedRedirect = true;
        }
    }
    goToSamePageAnchor() {
        if (this.isSamePage) {
            this.render(async () => {
                this.cacheSnapshot();
                this.performScroll();
                this.changeHistory();
                this.adapter.visitRendered(this);
            });
        }
    }
    prepareRequest(request) {
        if (this.acceptsStreamResponse) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted() {
        this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) { }
    async requestSucceededWithResponse(request, response) {
        const responseHTML = await response.responseHTML;
        const { redirected, statusCode } = response;
        if (responseHTML == undefined) {
            this.recordResponse({
                statusCode: SystemStatusCode.contentTypeMismatch,
                redirected,
            });
        }
        else {
            this.redirectedToLocation = response.redirected ? response.location : undefined;
            this.recordResponse({ statusCode: statusCode, responseHTML, redirected });
        }
    }
    async requestFailedWithResponse(request, response) {
        const responseHTML = await response.responseHTML;
        const { redirected, statusCode } = response;
        if (responseHTML == undefined) {
            this.recordResponse({
                statusCode: SystemStatusCode.contentTypeMismatch,
                redirected,
            });
        }
        else {
            this.recordResponse({ statusCode: statusCode, responseHTML, redirected });
        }
    }
    requestErrored(_request, _error) {
        this.recordResponse({
            statusCode: SystemStatusCode.networkFailure,
            redirected: false,
        });
    }
    requestFinished() {
        this.finishRequest();
    }
    performScroll() {
        if (!this.scrolled && !this.view.forceReloaded) {
            if (this.action == "restore") {
                this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
            }
            else {
                this.scrollToAnchor() || this.view.scrollToTop();
            }
            if (this.isSamePage) {
                this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
            }
            this.scrolled = true;
        }
    }
    scrollToRestoredPosition() {
        const { scrollPosition } = this.restorationData;
        if (scrollPosition) {
            this.view.scrollToPosition(scrollPosition);
            return true;
        }
    }
    scrollToAnchor() {
        const anchor = getAnchor(this.location);
        if (anchor != null) {
            this.view.scrollToAnchor(anchor);
            return true;
        }
    }
    recordTimingMetric(metric) {
        this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
        return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
        switch (action) {
            case "replace":
                return history.replaceState;
            case "advance":
            case "restore":
                return history.pushState;
        }
    }
    hasPreloadedResponse() {
        return typeof this.response == "object";
    }
    shouldIssueRequest() {
        if (this.isSamePage) {
            return false;
        }
        else if (this.action == "restore") {
            return !this.hasCachedSnapshot();
        }
        else {
            return this.willRender;
        }
    }
    cacheSnapshot() {
        if (!this.snapshotCached) {
            this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
            this.snapshotCached = true;
        }
    }
    async render(callback) {
        this.cancelRender();
        await new Promise((resolve) => {
            this.frame = requestAnimationFrame(() => resolve());
        });
        await callback();
        delete this.frame;
    }
    cancelRender() {
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            delete this.frame;
        }
    }
}
function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
}

class BrowserAdapter {
    constructor(session) {
        this.progressBar = new ProgressBar();
        this.showProgressBar = () => {
            this.progressBar.show();
        };
        this.session = session;
    }
    visitProposedToLocation(location, options) {
        this.navigator.startVisit(location, (options === null || options === void 0 ? void 0 : options.restorationIdentifier) || uuid(), options);
    }
    visitStarted(visit) {
        this.location = visit.location;
        visit.loadCachedSnapshot();
        visit.issueRequest();
        visit.goToSamePageAnchor();
    }
    visitRequestStarted(visit) {
        this.progressBar.setValue(0);
        if (visit.hasCachedSnapshot() || visit.action != "restore") {
            this.showVisitProgressBarAfterDelay();
        }
        else {
            this.showProgressBar();
        }
    }
    visitRequestCompleted(visit) {
        visit.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit, statusCode) {
        switch (statusCode) {
            case SystemStatusCode.networkFailure:
            case SystemStatusCode.timeoutFailure:
            case SystemStatusCode.contentTypeMismatch:
                return this.reload({
                    reason: "request_failed",
                    context: {
                        statusCode,
                    },
                });
            default:
                return visit.loadResponse();
        }
    }
    visitRequestFinished(_visit) {
        this.progressBar.setValue(1);
        this.hideVisitProgressBar();
    }
    visitCompleted(_visit) { }
    pageInvalidated(reason) {
        this.reload(reason);
    }
    visitFailed(_visit) { }
    visitRendered(_visit) { }
    formSubmissionStarted(_formSubmission) {
        this.progressBar.setValue(0);
        this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
        this.progressBar.setValue(1);
        this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
        this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
        this.progressBar.hide();
        if (this.visitProgressBarTimeout != null) {
            window.clearTimeout(this.visitProgressBarTimeout);
            delete this.visitProgressBarTimeout;
        }
    }
    showFormProgressBarAfterDelay() {
        if (this.formProgressBarTimeout == null) {
            this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
        }
    }
    hideFormProgressBar() {
        this.progressBar.hide();
        if (this.formProgressBarTimeout != null) {
            window.clearTimeout(this.formProgressBarTimeout);
            delete this.formProgressBarTimeout;
        }
    }
    reload(reason) {
        var _a;
        dispatch("turbo:reload", { detail: reason });
        window.location.href = ((_a = this.location) === null || _a === void 0 ? void 0 : _a.toString()) || window.location.href;
    }
    get navigator() {
        return this.session.navigator;
    }
}

class CacheObserver {
    constructor() {
        this.selector = "[data-turbo-temporary]";
        this.deprecatedSelector = "[data-turbo-cache=false]";
        this.started = false;
        this.removeTemporaryElements = ((_event) => {
            for (const element of this.temporaryElements) {
                element.remove();
            }
        });
    }
    start() {
        if (!this.started) {
            this.started = true;
            addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
        }
    }
    get temporaryElements() {
        return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
        const elements = document.querySelectorAll(this.deprecatedSelector);
        if (elements.length) {
            console.warn(`The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`);
        }
        return [...elements];
    }
}

class FrameRedirector {
    constructor(session, element) {
        this.session = session;
        this.element = element;
        this.linkInterceptor = new LinkInterceptor(this, element);
        this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
    }
    stop() {
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
    }
    shouldInterceptLinkClick(element, _location, _event) {
        return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
        const frame = this.findFrameElement(element);
        if (frame) {
            frame.delegate.linkClickIntercepted(element, url, event);
        }
    }
    willSubmitForm(element, submitter) {
        return (element.closest("turbo-frame") == null &&
            this.shouldSubmit(element, submitter) &&
            this.shouldRedirect(element, submitter));
    }
    formSubmitted(element, submitter) {
        const frame = this.findFrameElement(element, submitter);
        if (frame) {
            frame.delegate.formSubmitted(element, submitter);
        }
    }
    shouldSubmit(form, submitter) {
        var _a;
        const action = getAction(form, submitter);
        const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
        const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
        return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
        const isNavigatable = element instanceof HTMLFormElement
            ? this.session.submissionIsNavigatable(element, submitter)
            : this.session.elementIsNavigatable(element);
        if (isNavigatable) {
            const frame = this.findFrameElement(element, submitter);
            return frame ? frame != element.closest("turbo-frame") : false;
        }
        else {
            return false;
        }
    }
    findFrameElement(element, submitter) {
        const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
        if (id && id != "_top") {
            const frame = this.element.querySelector(`#${id}:not([disabled])`);
            if (frame instanceof FrameElement) {
                return frame;
            }
        }
    }
}

class History {
    constructor(delegate) {
        this.restorationIdentifier = uuid();
        this.restorationData = {};
        this.started = false;
        this.pageLoaded = false;
        this.onPopState = (event) => {
            if (this.shouldHandlePopState()) {
                const { turbo } = event.state || {};
                if (turbo) {
                    this.location = new URL(window.location.href);
                    const { restorationIdentifier } = turbo;
                    this.restorationIdentifier = restorationIdentifier;
                    this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
                }
            }
        };
        this.onPageLoad = async (_event) => {
            await nextMicrotask();
            this.pageLoaded = true;
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            addEventListener("popstate", this.onPopState, false);
            addEventListener("load", this.onPageLoad, false);
            this.started = true;
            this.replace(new URL(window.location.href));
        }
    }
    stop() {
        if (this.started) {
            removeEventListener("popstate", this.onPopState, false);
            removeEventListener("load", this.onPageLoad, false);
            this.started = false;
        }
    }
    push(location, restorationIdentifier) {
        this.update(history.pushState, location, restorationIdentifier);
    }
    replace(location, restorationIdentifier) {
        this.update(history.replaceState, location, restorationIdentifier);
    }
    update(method, location, restorationIdentifier = uuid()) {
        const state = { turbo: { restorationIdentifier } };
        method.call(history, state, "", location.href);
        this.location = location;
        this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
        return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
        const { restorationIdentifier } = this;
        const restorationData = this.restorationData[restorationIdentifier];
        this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
        var _a;
        if (!this.previousScrollRestoration) {
            this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
            history.scrollRestoration = "manual";
        }
    }
    relinquishControlOfScrollRestoration() {
        if (this.previousScrollRestoration) {
            history.scrollRestoration = this.previousScrollRestoration;
            delete this.previousScrollRestoration;
        }
    }
    shouldHandlePopState() {
        return this.pageIsLoaded();
    }
    pageIsLoaded() {
        return this.pageLoaded || document.readyState == "complete";
    }
}

class Navigator {
    constructor(delegate) {
        this.delegate = delegate;
    }
    proposeVisit(location, options = {}) {
        if (this.delegate.allowsVisitingLocationWithAction(location, options.action)) {
            if (locationIsVisitable(location, this.view.snapshot.rootLocation)) {
                this.delegate.visitProposedToLocation(location, options);
            }
            else {
                window.location.href = location.toString();
            }
        }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
        this.stop();
        this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
        this.currentVisit.start();
    }
    submitForm(form, submitter) {
        this.stop();
        this.formSubmission = new FormSubmission(this, form, submitter, true);
        this.formSubmission.start();
    }
    stop() {
        if (this.formSubmission) {
            this.formSubmission.stop();
            delete this.formSubmission;
        }
        if (this.currentVisit) {
            this.currentVisit.cancel();
            delete this.currentVisit;
        }
    }
    get adapter() {
        return this.delegate.adapter;
    }
    get view() {
        return this.delegate.view;
    }
    get history() {
        return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
        if (typeof this.adapter.formSubmissionStarted === "function") {
            this.adapter.formSubmissionStarted(formSubmission);
        }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
        if (formSubmission == this.formSubmission) {
            const responseHTML = await fetchResponse.responseHTML;
            if (responseHTML) {
                const shouldCacheSnapshot = formSubmission.isSafe;
                if (!shouldCacheSnapshot) {
                    this.view.clearSnapshotCache();
                }
                const { statusCode, redirected } = fetchResponse;
                const action = this.getActionForFormSubmission(formSubmission);
                const visitOptions = {
                    action,
                    shouldCacheSnapshot,
                    response: { statusCode, responseHTML, redirected },
                };
                this.proposeVisit(fetchResponse.location, visitOptions);
            }
        }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            if (fetchResponse.serverError) {
                await this.view.renderError(snapshot, this.currentVisit);
            }
            else {
                await this.view.renderPage(snapshot, false, true, this.currentVisit);
            }
            this.view.scrollToTop();
            this.view.clearSnapshotCache();
        }
    }
    formSubmissionErrored(formSubmission, error) {
        console.error(error);
    }
    formSubmissionFinished(formSubmission) {
        if (typeof this.adapter.formSubmissionFinished === "function") {
            this.adapter.formSubmissionFinished(formSubmission);
        }
    }
    visitStarted(visit) {
        this.delegate.visitStarted(visit);
    }
    visitCompleted(visit) {
        this.delegate.visitCompleted(visit);
    }
    locationWithActionIsSamePage(location, action) {
        const anchor = getAnchor(location);
        const currentAnchor = getAnchor(this.view.lastRenderedLocation);
        const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
        return (action !== "replace" &&
            getRequestURL(location) === getRequestURL(this.view.lastRenderedLocation) &&
            (isRestorationToTop || (anchor != null && anchor !== currentAnchor)));
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
        this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
        return this.history.location;
    }
    get restorationIdentifier() {
        return this.history.restorationIdentifier;
    }
    getActionForFormSubmission({ submitter, formElement }) {
        return getVisitAction(submitter, formElement) || "advance";
    }
}

var PageStage;
(function (PageStage) {
    PageStage[PageStage["initial"] = 0] = "initial";
    PageStage[PageStage["loading"] = 1] = "loading";
    PageStage[PageStage["interactive"] = 2] = "interactive";
    PageStage[PageStage["complete"] = 3] = "complete";
})(PageStage || (PageStage = {}));
class PageObserver {
    constructor(delegate) {
        this.stage = PageStage.initial;
        this.started = false;
        this.interpretReadyState = () => {
            const { readyState } = this;
            if (readyState == "interactive") {
                this.pageIsInteractive();
            }
            else if (readyState == "complete") {
                this.pageIsComplete();
            }
        };
        this.pageWillUnload = () => {
            this.delegate.pageWillUnload();
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            if (this.stage == PageStage.initial) {
                this.stage = PageStage.loading;
            }
            document.addEventListener("readystatechange", this.interpretReadyState, false);
            addEventListener("pagehide", this.pageWillUnload, false);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            document.removeEventListener("readystatechange", this.interpretReadyState, false);
            removeEventListener("pagehide", this.pageWillUnload, false);
            this.started = false;
        }
    }
    pageIsInteractive() {
        if (this.stage == PageStage.loading) {
            this.stage = PageStage.interactive;
            this.delegate.pageBecameInteractive();
        }
    }
    pageIsComplete() {
        this.pageIsInteractive();
        if (this.stage == PageStage.interactive) {
            this.stage = PageStage.complete;
            this.delegate.pageLoaded();
        }
    }
    get readyState() {
        return document.readyState;
    }
}

class ScrollObserver {
    constructor(delegate) {
        this.started = false;
        this.onScroll = () => {
            this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            addEventListener("scroll", this.onScroll, false);
            this.onScroll();
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            removeEventListener("scroll", this.onScroll, false);
            this.started = false;
        }
    }
    updatePosition(position) {
        this.delegate.scrollPositionChanged(position);
    }
}

class StreamMessageRenderer {
    render({ fragment }) {
        Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => document.documentElement.appendChild(fragment));
    }
    enteringBardo(currentPermanentElement, newPermanentElement) {
        newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() { }
}
function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
        const { id } = permanentElementInDocument;
        for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
            const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
            if (elementInStream) {
                permanentElementMap[id] = [permanentElementInDocument, elementInStream];
            }
        }
    }
    return permanentElementMap;
}

class StreamObserver {
    constructor(delegate) {
        this.sources = new Set();
        this.started = false;
        this.inspectFetchResponse = ((event) => {
            const response = fetchResponseFromEvent(event);
            if (response && fetchResponseIsStream(response)) {
                event.preventDefault();
                this.receiveMessageResponse(response);
            }
        });
        this.receiveMessageEvent = (event) => {
            if (this.started && typeof event.data == "string") {
                this.receiveMessageHTML(event.data);
            }
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            this.started = true;
            addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
        }
    }
    connectStreamSource(source) {
        if (!this.streamSourceIsConnected(source)) {
            this.sources.add(source);
            source.addEventListener("message", this.receiveMessageEvent, false);
        }
    }
    disconnectStreamSource(source) {
        if (this.streamSourceIsConnected(source)) {
            this.sources.delete(source);
            source.removeEventListener("message", this.receiveMessageEvent, false);
        }
    }
    streamSourceIsConnected(source) {
        return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
        const html = await response.responseHTML;
        if (html) {
            this.receiveMessageHTML(html);
        }
    }
    receiveMessageHTML(html) {
        this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
}
function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
        return fetchResponse;
    }
}
function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
}

class ErrorRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        const { documentElement, body } = document;
        documentElement.replaceChild(newElement, body);
    }
    async render() {
        this.replaceHeadAndBody();
        this.activateScriptElements();
    }
    replaceHeadAndBody() {
        const { documentElement, head } = document;
        documentElement.replaceChild(this.newHead, head);
        this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
        for (const replaceableElement of this.scriptElements) {
            const parentNode = replaceableElement.parentNode;
            if (parentNode) {
                const element = activateScriptElement(replaceableElement);
                parentNode.replaceChild(element, replaceableElement);
            }
        }
    }
    get newHead() {
        return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
        return document.documentElement.querySelectorAll("script");
    }
}

class PageRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        if (document.body && newElement instanceof HTMLBodyElement) {
            document.body.replaceWith(newElement);
        }
        else {
            document.documentElement.appendChild(newElement);
        }
    }
    get shouldRender() {
        return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
        if (!this.newSnapshot.isVisitable) {
            return {
                reason: "turbo_visit_control_is_reload",
            };
        }
        if (!this.trackedElementsAreIdentical) {
            return {
                reason: "tracked_element_mismatch",
            };
        }
    }
    async prepareToRender() {
        await this.mergeHead();
    }
    async render() {
        if (this.willRender) {
            await this.replaceBody();
        }
    }
    finishRendering() {
        super.finishRendering();
        if (!this.isPreview) {
            this.focusFirstAutofocusableElement();
        }
    }
    get currentHeadSnapshot() {
        return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
        return this.newSnapshot.headSnapshot;
    }
    get newElement() {
        return this.newSnapshot.element;
    }
    async mergeHead() {
        const mergedHeadElements = this.mergeProvisionalElements();
        const newStylesheetElements = this.copyNewHeadStylesheetElements();
        this.copyNewHeadScriptElements();
        await mergedHeadElements;
        await newStylesheetElements;
    }
    async replaceBody() {
        await this.preservingPermanentElements(async () => {
            this.activateNewBody();
            await this.assignNewBody();
        });
    }
    get trackedElementsAreIdentical() {
        return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
        const loadingElements = [];
        for (const element of this.newHeadStylesheetElements) {
            loadingElements.push(waitForLoad(element));
            document.head.appendChild(element);
        }
        await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
        for (const element of this.newHeadScriptElements) {
            document.head.appendChild(activateScriptElement(element));
        }
    }
    async mergeProvisionalElements() {
        const newHeadElements = [...this.newHeadProvisionalElements];
        for (const element of this.currentHeadProvisionalElements) {
            if (!this.isCurrentElementInElementList(element, newHeadElements)) {
                document.head.removeChild(element);
            }
        }
        for (const element of newHeadElements) {
            document.head.appendChild(element);
        }
    }
    isCurrentElementInElementList(element, elementList) {
        for (const [index, newElement] of elementList.entries()) {
            if (element.tagName == "TITLE") {
                if (newElement.tagName != "TITLE") {
                    continue;
                }
                if (element.innerHTML == newElement.innerHTML) {
                    elementList.splice(index, 1);
                    return true;
                }
            }
            if (newElement.isEqualNode(element)) {
                elementList.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    removeCurrentHeadProvisionalElements() {
        for (const element of this.currentHeadProvisionalElements) {
            document.head.removeChild(element);
        }
    }
    copyNewHeadProvisionalElements() {
        for (const element of this.newHeadProvisionalElements) {
            document.head.appendChild(element);
        }
    }
    activateNewBody() {
        document.adoptNode(this.newElement);
        this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
        for (const inertScriptElement of this.newBodyScriptElements) {
            const activatedScriptElement = activateScriptElement(inertScriptElement);
            inertScriptElement.replaceWith(activatedScriptElement);
        }
    }
    async assignNewBody() {
        await this.renderElement(this.currentElement, this.newElement);
    }
    get newHeadStylesheetElements() {
        return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
        return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
        return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
        return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
        return this.newElement.querySelectorAll("script");
    }
}

class SnapshotCache {
    constructor(size) {
        this.keys = [];
        this.snapshots = {};
        this.size = size;
    }
    has(location) {
        return toCacheKey(location) in this.snapshots;
    }
    get(location) {
        if (this.has(location)) {
            const snapshot = this.read(location);
            this.touch(location);
            return snapshot;
        }
    }
    put(location, snapshot) {
        this.write(location, snapshot);
        this.touch(location);
        return snapshot;
    }
    clear() {
        this.snapshots = {};
    }
    read(location) {
        return this.snapshots[toCacheKey(location)];
    }
    write(location, snapshot) {
        this.snapshots[toCacheKey(location)] = snapshot;
    }
    touch(location) {
        const key = toCacheKey(location);
        const index = this.keys.indexOf(key);
        if (index > -1)
            this.keys.splice(index, 1);
        this.keys.unshift(key);
        this.trim();
    }
    trim() {
        for (const key of this.keys.splice(this.size)) {
            delete this.snapshots[key];
        }
    }
}

class PageView extends View {
    constructor() {
        super(...arguments);
        this.snapshotCache = new SnapshotCache(10);
        this.lastRenderedLocation = new URL(location.href);
        this.forceReloaded = false;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit) {
        const renderer = new PageRenderer(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
        if (!renderer.shouldRender) {
            this.forceReloaded = true;
        }
        else {
            visit === null || visit === void 0 ? void 0 : visit.changeHistory();
        }
        return this.render(renderer);
    }
    renderError(snapshot, visit) {
        visit === null || visit === void 0 ? void 0 : visit.changeHistory();
        const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
        return this.render(renderer);
    }
    clearSnapshotCache() {
        this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
        if (snapshot.isCacheable) {
            this.delegate.viewWillCacheSnapshot();
            const { lastRenderedLocation: location } = this;
            await nextEventLoopTick();
            const cachedSnapshot = snapshot.clone();
            this.snapshotCache.put(location, cachedSnapshot);
            return cachedSnapshot;
        }
    }
    getCachedSnapshotForLocation(location) {
        return this.snapshotCache.get(location);
    }
    get snapshot() {
        return PageSnapshot.fromElement(this.element);
    }
}

class Preloader {
    constructor(delegate) {
        this.selector = "a[data-turbo-preload]";
        this.delegate = delegate;
    }
    get snapshotCache() {
        return this.delegate.navigator.view.snapshotCache;
    }
    start() {
        if (document.readyState === "loading") {
            return document.addEventListener("DOMContentLoaded", () => {
                this.preloadOnLoadLinksForView(document.body);
            });
        }
        else {
            this.preloadOnLoadLinksForView(document.body);
        }
    }
    preloadOnLoadLinksForView(element) {
        for (const link of element.querySelectorAll(this.selector)) {
            this.preloadURL(link);
        }
    }
    async preloadURL(link) {
        const location = new URL(link.href);
        if (this.snapshotCache.has(location)) {
            return;
        }
        try {
            const response = await fetch(location.toString(), { headers: { "VND.PREFETCH": "true", Accept: "text/html" } });
            const responseText = await response.text();
            const snapshot = PageSnapshot.fromHTMLString(responseText);
            this.snapshotCache.put(location, snapshot);
        }
        catch (_) {
        }
    }
}

class Session {
    constructor() {
        this.navigator = new Navigator(this);
        this.history = new History(this);
        this.preloader = new Preloader(this);
        this.view = new PageView(this, document.documentElement);
        this.adapter = new BrowserAdapter(this);
        this.pageObserver = new PageObserver(this);
        this.cacheObserver = new CacheObserver();
        this.linkClickObserver = new LinkClickObserver(this, window);
        this.formSubmitObserver = new FormSubmitObserver(this, document);
        this.scrollObserver = new ScrollObserver(this);
        this.streamObserver = new StreamObserver(this);
        this.formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
        this.frameRedirector = new FrameRedirector(this, document.documentElement);
        this.streamMessageRenderer = new StreamMessageRenderer();
        this.drive = true;
        this.enabled = true;
        this.progressBarDelay = 500;
        this.started = false;
        this.formMode = "on";
    }
    start() {
        if (!this.started) {
            this.pageObserver.start();
            this.cacheObserver.start();
            this.formLinkClickObserver.start();
            this.linkClickObserver.start();
            this.formSubmitObserver.start();
            this.scrollObserver.start();
            this.streamObserver.start();
            this.frameRedirector.start();
            this.history.start();
            this.preloader.start();
            this.started = true;
            this.enabled = true;
        }
    }
    disable() {
        this.enabled = false;
    }
    stop() {
        if (this.started) {
            this.pageObserver.stop();
            this.cacheObserver.stop();
            this.formLinkClickObserver.stop();
            this.linkClickObserver.stop();
            this.formSubmitObserver.stop();
            this.scrollObserver.stop();
            this.streamObserver.stop();
            this.frameRedirector.stop();
            this.history.stop();
            this.started = false;
        }
    }
    registerAdapter(adapter) {
        this.adapter = adapter;
    }
    visit(location, options = {}) {
        const frameElement = options.frame ? document.getElementById(options.frame) : null;
        if (frameElement instanceof FrameElement) {
            frameElement.src = location.toString();
            frameElement.loaded;
        }
        else {
            this.navigator.proposeVisit(expandURL(location), options);
        }
    }
    connectStreamSource(source) {
        this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
        this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
        this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
        this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
        this.progressBarDelay = delay;
    }
    setFormMode(mode) {
        this.formMode = mode;
    }
    get location() {
        return this.history.location;
    }
    get restorationIdentifier() {
        return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier) {
        if (this.enabled) {
            this.navigator.startVisit(location, restorationIdentifier, {
                action: "restore",
                historyChanged: true,
            });
        }
        else {
            this.adapter.pageInvalidated({
                reason: "turbo_disabled",
            });
        }
    }
    scrollPositionChanged(position) {
        this.history.updateRestorationData({ scrollPosition: position });
    }
    willSubmitFormLinkToLocation(link, location) {
        return this.elementIsNavigatable(link) && locationIsVisitable(location, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() { }
    willFollowLinkToLocation(link, location, event) {
        return (this.elementIsNavigatable(link) &&
            locationIsVisitable(location, this.snapshot.rootLocation) &&
            this.applicationAllowsFollowingLinkToLocation(link, location, event));
    }
    followedLinkToLocation(link, location) {
        const action = this.getActionForLink(link);
        const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
        this.visit(location.href, { action, acceptsStreamResponse });
    }
    allowsVisitingLocationWithAction(location, action) {
        return this.locationWithActionIsSamePage(location, action) || this.applicationAllowsVisitingLocation(location);
    }
    visitProposedToLocation(location, options) {
        extendURLWithDeprecatedProperties(location);
        this.adapter.visitProposedToLocation(location, options);
    }
    visitStarted(visit) {
        if (!visit.acceptsStreamResponse) {
            markAsBusy(document.documentElement);
        }
        extendURLWithDeprecatedProperties(visit.location);
        if (!visit.silent) {
            this.notifyApplicationAfterVisitingLocation(visit.location, visit.action);
        }
    }
    visitCompleted(visit) {
        clearBusyState(document.documentElement);
        this.notifyApplicationAfterPageLoad(visit.getTimingMetrics());
    }
    locationWithActionIsSamePage(location, action) {
        return this.navigator.locationWithActionIsSamePage(location, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
        this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
        const action = getAction(form, submitter);
        return (this.submissionIsNavigatable(form, submitter) &&
            locationIsVisitable(expandURL(action), this.snapshot.rootLocation));
    }
    formSubmitted(form, submitter) {
        this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
        this.view.lastRenderedLocation = this.location;
        this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
        this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
        this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
        this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
        var _a;
        if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
            this.notifyApplicationBeforeCachingSnapshot();
        }
    }
    allowsImmediateRender({ element }, options) {
        const event = this.notifyApplicationBeforeRender(element, options);
        const { defaultPrevented, detail: { render }, } = event;
        if (this.view.renderer && render) {
            this.view.renderer.renderElement = render;
        }
        return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
        this.view.lastRenderedLocation = this.history.location;
        this.notifyApplicationAfterRender();
    }
    preloadOnLoadLinksForView(element) {
        this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
        this.adapter.pageInvalidated(reason);
    }
    frameLoaded(frame) {
        this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
        this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location, ev) {
        const event = this.notifyApplicationAfterClickingLinkToLocation(link, location, ev);
        return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location) {
        const event = this.notifyApplicationBeforeVisitingLocation(location);
        return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location, event) {
        return dispatch("turbo:click", {
            target: link,
            detail: { url: location.href, originalEvent: event },
            cancelable: true,
        });
    }
    notifyApplicationBeforeVisitingLocation(location) {
        return dispatch("turbo:before-visit", {
            detail: { url: location.href },
            cancelable: true,
        });
    }
    notifyApplicationAfterVisitingLocation(location, action) {
        return dispatch("turbo:visit", { detail: { url: location.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
        return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
        return dispatch("turbo:before-render", {
            detail: Object.assign({ newBody }, options),
            cancelable: true,
        });
    }
    notifyApplicationAfterRender() {
        return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
        return dispatch("turbo:load", {
            detail: { url: this.location.href, timing },
        });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
        dispatchEvent(new HashChangeEvent("hashchange", {
            oldURL: oldURL.toString(),
            newURL: newURL.toString(),
        }));
    }
    notifyApplicationAfterFrameLoad(frame) {
        return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
        return dispatch("turbo:frame-render", {
            detail: { fetchResponse },
            target: frame,
            cancelable: true,
        });
    }
    submissionIsNavigatable(form, submitter) {
        if (this.formMode == "off") {
            return false;
        }
        else {
            const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
            if (this.formMode == "optin") {
                return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
            }
            else {
                return submitterIsNavigatable && this.elementIsNavigatable(form);
            }
        }
    }
    elementIsNavigatable(element) {
        const container = findClosestRecursively(element, "[data-turbo]");
        const withinFrame = findClosestRecursively(element, "turbo-frame");
        if (this.drive || withinFrame) {
            if (container) {
                return container.getAttribute("data-turbo") != "false";
            }
            else {
                return true;
            }
        }
        else {
            if (container) {
                return container.getAttribute("data-turbo") == "true";
            }
            else {
                return false;
            }
        }
    }
    getActionForLink(link) {
        return getVisitAction(link) || "advance";
    }
    get snapshot() {
        return this.view.snapshot;
    }
}
function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
}
const deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
        get() {
            return this.toString();
        },
    },
};

class Cache {
    constructor(session) {
        this.session = session;
    }
    clear() {
        this.session.clearCache();
    }
    resetCacheControl() {
        this.setCacheControl("");
    }
    exemptPageFromCache() {
        this.setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
        this.setCacheControl("no-preview");
    }
    setCacheControl(value) {
        setMetaContent("turbo-cache-control", value);
    }
}

const StreamActions = {
    after() {
        this.targetElements.forEach((e) => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling); });
    },
    append() {
        this.removeDuplicateTargetChildren();
        this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
        this.targetElements.forEach((e) => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e); });
    },
    prepend() {
        this.removeDuplicateTargetChildren();
        this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
        this.targetElements.forEach((e) => e.remove());
    },
    replace() {
        this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
        this.targetElements.forEach((targetElement) => {
            targetElement.innerHTML = "";
            targetElement.append(this.templateContent);
        });
    },
};

const session = new Session();
const cache = new Cache(session);
const { navigator: navigator$1 } = session;
function start() {
    session.start();
}
function registerAdapter(adapter) {
    session.registerAdapter(adapter);
}
function visit(location, options) {
    session.visit(location, options);
}
function connectStreamSource(source) {
    session.connectStreamSource(source);
}
function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
}
function renderStreamMessage(message) {
    session.renderStreamMessage(message);
}
function clearCache() {
    console.warn("Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`");
    session.clearCache();
}
function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
}
function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
}
function setFormMode(mode) {
    session.setFormMode(mode);
}

var Turbo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session: session,
    cache: cache,
    PageRenderer: PageRenderer,
    PageSnapshot: PageSnapshot,
    FrameRenderer: FrameRenderer,
    start: start,
    registerAdapter: registerAdapter,
    visit: visit,
    connectStreamSource: connectStreamSource,
    disconnectStreamSource: disconnectStreamSource,
    renderStreamMessage: renderStreamMessage,
    clearCache: clearCache,
    setProgressBarDelay: setProgressBarDelay,
    setConfirmMethod: setConfirmMethod,
    setFormMode: setFormMode,
    StreamActions: StreamActions
});

class TurboFrameMissingError extends Error {
}

class FrameController {
    constructor(element) {
        this.fetchResponseLoaded = (_fetchResponse) => { };
        this.currentFetchRequest = null;
        this.resolveVisitPromise = () => { };
        this.connected = false;
        this.hasBeenLoaded = false;
        this.ignoredAttributes = new Set();
        this.action = null;
        this.visitCachedSnapshot = ({ element }) => {
            const frame = element.querySelector("#" + this.element.id);
            if (frame && this.previousFrameElement) {
                frame.replaceChildren(...this.previousFrameElement.children);
            }
            delete this.previousFrameElement;
        };
        this.element = element;
        this.view = new FrameView(this, this.element);
        this.appearanceObserver = new AppearanceObserver(this, this.element);
        this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
        this.linkInterceptor = new LinkInterceptor(this, this.element);
        this.restorationIdentifier = uuid();
        this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    connect() {
        if (!this.connected) {
            this.connected = true;
            if (this.loadingStyle == FrameLoadingStyle.lazy) {
                this.appearanceObserver.start();
            }
            else {
                this.loadSourceURL();
            }
            this.formLinkClickObserver.start();
            this.linkInterceptor.start();
            this.formSubmitObserver.start();
        }
    }
    disconnect() {
        if (this.connected) {
            this.connected = false;
            this.appearanceObserver.stop();
            this.formLinkClickObserver.stop();
            this.linkInterceptor.stop();
            this.formSubmitObserver.stop();
        }
    }
    disabledChanged() {
        if (this.loadingStyle == FrameLoadingStyle.eager) {
            this.loadSourceURL();
        }
    }
    sourceURLChanged() {
        if (this.isIgnoringChangesTo("src"))
            return;
        if (this.element.isConnected) {
            this.complete = false;
        }
        if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
            this.loadSourceURL();
        }
    }
    sourceURLReloaded() {
        const { src } = this.element;
        this.ignoringChangesToAttribute("complete", () => {
            this.element.removeAttribute("complete");
        });
        this.element.src = null;
        this.element.src = src;
        return this.element.loaded;
    }
    completeChanged() {
        if (this.isIgnoringChangesTo("complete"))
            return;
        this.loadSourceURL();
    }
    loadingStyleChanged() {
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
            this.appearanceObserver.start();
        }
        else {
            this.appearanceObserver.stop();
            this.loadSourceURL();
        }
    }
    async loadSourceURL() {
        if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
            this.element.loaded = this.visit(expandURL(this.sourceURL));
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
        }
    }
    async loadResponse(fetchResponse) {
        if (fetchResponse.redirected || (fetchResponse.succeeded && fetchResponse.isHTML)) {
            this.sourceURL = fetchResponse.response.url;
        }
        try {
            const html = await fetchResponse.responseHTML;
            if (html) {
                const document = parseHTMLDocument(html);
                const pageSnapshot = PageSnapshot.fromDocument(document);
                if (pageSnapshot.isVisitable) {
                    await this.loadFrameResponse(fetchResponse, document);
                }
                else {
                    await this.handleUnvisitableFrameResponse(fetchResponse);
                }
            }
        }
        finally {
            this.fetchResponseLoaded = () => { };
        }
    }
    elementAppearedInViewport(element) {
        this.proposeVisitIfNavigatedWithAction(element, element);
        this.loadSourceURL();
    }
    willSubmitFormLinkToLocation(link) {
        return this.shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
        const frame = this.findFrameElement(link);
        if (frame)
            form.setAttribute("data-turbo-frame", frame.id);
    }
    shouldInterceptLinkClick(element, _location, _event) {
        return this.shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location) {
        this.navigateFrame(element, location);
    }
    willSubmitForm(element, submitter) {
        return element.closest("turbo-frame") == this.element && this.shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
        if (this.formSubmission) {
            this.formSubmission.stop();
        }
        this.formSubmission = new FormSubmission(this, element, submitter);
        const { fetchRequest } = this.formSubmission;
        this.prepareRequest(fetchRequest);
        this.formSubmission.start();
    }
    prepareRequest(request) {
        var _a;
        request.headers["Turbo-Frame"] = this.id;
        if ((_a = this.currentNavigationElement) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-turbo-stream")) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted(_request) {
        markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
        this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
        await this.loadResponse(response);
        this.resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
        await this.loadResponse(response);
        this.resolveVisitPromise();
    }
    requestErrored(request, error) {
        console.error(error);
        this.resolveVisitPromise();
    }
    requestFinished(_request) {
        clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
        markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
        const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
        frame.delegate.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
        frame.delegate.loadResponse(response);
        if (!formSubmission.isSafe) {
            session.clearCache();
        }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
        this.element.delegate.loadResponse(fetchResponse);
        session.clearCache();
    }
    formSubmissionErrored(formSubmission, error) {
        console.error(error);
    }
    formSubmissionFinished({ formElement }) {
        clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender({ element: newFrame }, options) {
        const event = dispatch("turbo:before-frame-render", {
            target: this.element,
            detail: Object.assign({ newFrame }, options),
            cancelable: true,
        });
        const { defaultPrevented, detail: { render }, } = event;
        if (this.view.renderer && render) {
            this.view.renderer.renderElement = render;
        }
        return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) { }
    preloadOnLoadLinksForView(element) {
        session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() { }
    willRenderFrame(currentElement, _newElement) {
        this.previousFrameElement = currentElement.cloneNode(true);
    }
    async loadFrameResponse(fetchResponse, document) {
        const newFrameElement = await this.extractForeignFrameElement(document.body);
        if (newFrameElement) {
            const snapshot = new Snapshot(newFrameElement);
            const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
            if (this.view.renderPromise)
                await this.view.renderPromise;
            this.changeHistory();
            await this.view.render(renderer);
            this.complete = true;
            session.frameRendered(fetchResponse, this.element);
            session.frameLoaded(this.element);
            this.fetchResponseLoaded(fetchResponse);
        }
        else if (this.willHandleFrameMissingFromResponse(fetchResponse)) {
            this.handleFrameMissingFromResponse(fetchResponse);
        }
    }
    async visit(url) {
        var _a;
        const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
        (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
        this.currentFetchRequest = request;
        return new Promise((resolve) => {
            this.resolveVisitPromise = () => {
                this.resolveVisitPromise = () => { };
                this.currentFetchRequest = null;
                resolve();
            };
            request.perform();
        });
    }
    navigateFrame(element, url, submitter) {
        const frame = this.findFrameElement(element, submitter);
        frame.delegate.proposeVisitIfNavigatedWithAction(frame, element, submitter);
        this.withCurrentNavigationElement(element, () => {
            frame.src = url;
        });
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
        this.action = getVisitAction(submitter, element, frame);
        if (this.action) {
            const pageSnapshot = PageSnapshot.fromElement(frame).clone();
            const { visitCachedSnapshot } = frame.delegate;
            frame.delegate.fetchResponseLoaded = (fetchResponse) => {
                if (frame.src) {
                    const { statusCode, redirected } = fetchResponse;
                    const responseHTML = frame.ownerDocument.documentElement.outerHTML;
                    const response = { statusCode, redirected, responseHTML };
                    const options = {
                        response,
                        visitCachedSnapshot,
                        willRender: false,
                        updateHistory: false,
                        restorationIdentifier: this.restorationIdentifier,
                        snapshot: pageSnapshot,
                    };
                    if (this.action)
                        options.action = this.action;
                    session.visit(frame.src, options);
                }
            };
        }
    }
    changeHistory() {
        if (this.action) {
            const method = getHistoryMethodForAction(this.action);
            session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
        }
    }
    async handleUnvisitableFrameResponse(fetchResponse) {
        console.warn(`The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`);
        await this.visitResponse(fetchResponse.response);
    }
    willHandleFrameMissingFromResponse(fetchResponse) {
        this.element.setAttribute("complete", "");
        const response = fetchResponse.response;
        const visit = async (url, options = {}) => {
            if (url instanceof Response) {
                this.visitResponse(url);
            }
            else {
                session.visit(url, options);
            }
        };
        const event = dispatch("turbo:frame-missing", {
            target: this.element,
            detail: { response, visit },
            cancelable: true,
        });
        return !event.defaultPrevented;
    }
    handleFrameMissingFromResponse(fetchResponse) {
        this.view.missing();
        this.throwFrameMissingError(fetchResponse);
    }
    throwFrameMissingError(fetchResponse) {
        const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
        throw new TurboFrameMissingError(message);
    }
    async visitResponse(response) {
        const wrapped = new FetchResponse(response);
        const responseHTML = await wrapped.responseHTML;
        const { location, redirected, statusCode } = wrapped;
        return session.visit(location, { response: { redirected, statusCode, responseHTML } });
    }
    findFrameElement(element, submitter) {
        var _a;
        const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
        return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
        let element;
        const id = CSS.escape(this.id);
        try {
            element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
            if (element) {
                return element;
            }
            element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
            if (element) {
                await element.loaded;
                return await this.extractForeignFrameElement(element);
            }
        }
        catch (error) {
            console.error(error);
            return new FrameElement();
        }
        return null;
    }
    formActionIsVisitable(form, submitter) {
        const action = getAction(form, submitter);
        return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
        const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
        if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
            return false;
        }
        if (!this.enabled || id == "_top") {
            return false;
        }
        if (id) {
            const frameElement = getFrameElementById(id);
            if (frameElement) {
                return !frameElement.disabled;
            }
        }
        if (!session.elementIsNavigatable(element)) {
            return false;
        }
        if (submitter && !session.elementIsNavigatable(submitter)) {
            return false;
        }
        return true;
    }
    get id() {
        return this.element.id;
    }
    get enabled() {
        return !this.element.disabled;
    }
    get sourceURL() {
        if (this.element.src) {
            return this.element.src;
        }
    }
    set sourceURL(sourceURL) {
        this.ignoringChangesToAttribute("src", () => {
            this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
        });
    }
    get loadingStyle() {
        return this.element.loading;
    }
    get isLoading() {
        return this.formSubmission !== undefined || this.resolveVisitPromise() !== undefined;
    }
    get complete() {
        return this.element.hasAttribute("complete");
    }
    set complete(value) {
        this.ignoringChangesToAttribute("complete", () => {
            if (value) {
                this.element.setAttribute("complete", "");
            }
            else {
                this.element.removeAttribute("complete");
            }
        });
    }
    get isActive() {
        return this.element.isActive && this.connected;
    }
    get rootLocation() {
        var _a;
        const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
        const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
        return expandURL(root);
    }
    isIgnoringChangesTo(attributeName) {
        return this.ignoredAttributes.has(attributeName);
    }
    ignoringChangesToAttribute(attributeName, callback) {
        this.ignoredAttributes.add(attributeName);
        callback();
        this.ignoredAttributes.delete(attributeName);
    }
    withCurrentNavigationElement(element, callback) {
        this.currentNavigationElement = element;
        callback();
        delete this.currentNavigationElement;
    }
}
function getFrameElementById(id) {
    if (id != null) {
        const element = document.getElementById(id);
        if (element instanceof FrameElement) {
            return element;
        }
    }
}
function activateElement(element, currentURL) {
    if (element) {
        const src = element.getAttribute("src");
        if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
            throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
        }
        if (element.ownerDocument !== document) {
            element = document.importNode(element, true);
        }
        if (element instanceof FrameElement) {
            element.connectedCallback();
            element.disconnectedCallback();
            return element;
        }
    }
}

class StreamElement extends HTMLElement {
    static async renderElement(newElement) {
        await newElement.performAction();
    }
    async connectedCallback() {
        try {
            await this.render();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            this.disconnect();
        }
    }
    async render() {
        var _a;
        return ((_a = this.renderPromise) !== null && _a !== void 0 ? _a : (this.renderPromise = (async () => {
            const event = this.beforeRenderEvent;
            if (this.dispatchEvent(event)) {
                await nextAnimationFrame();
                await event.detail.render(this);
            }
        })()));
    }
    disconnect() {
        try {
            this.remove();
        }
        catch (_a) { }
    }
    removeDuplicateTargetChildren() {
        this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
        var _a;
        const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
        const newChildrenIds = [...(((_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children) || [])].filter((c) => !!c.id).map((c) => c.id);
        return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
        if (this.action) {
            const actionFunction = StreamActions[this.action];
            if (actionFunction) {
                return actionFunction;
            }
            this.raise("unknown action");
        }
        this.raise("action attribute is missing");
    }
    get targetElements() {
        if (this.target) {
            return this.targetElementsById;
        }
        else if (this.targets) {
            return this.targetElementsByQuery;
        }
        else {
            this.raise("target or targets attribute is missing");
        }
    }
    get templateContent() {
        return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
        if (this.firstElementChild === null) {
            const template = this.ownerDocument.createElement("template");
            this.appendChild(template);
            return template;
        }
        else if (this.firstElementChild instanceof HTMLTemplateElement) {
            return this.firstElementChild;
        }
        this.raise("first child element must be a <template> element");
    }
    get action() {
        return this.getAttribute("action");
    }
    get target() {
        return this.getAttribute("target");
    }
    get targets() {
        return this.getAttribute("targets");
    }
    raise(message) {
        throw new Error(`${this.description}: ${message}`);
    }
    get description() {
        var _a, _b;
        return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
        return new CustomEvent("turbo:before-stream-render", {
            bubbles: true,
            cancelable: true,
            detail: { newStream: this, render: StreamElement.renderElement },
        });
    }
    get targetElementsById() {
        var _a;
        const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
        if (element !== null) {
            return [element];
        }
        else {
            return [];
        }
    }
    get targetElementsByQuery() {
        var _a;
        const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
        if (elements.length !== 0) {
            return Array.prototype.slice.call(elements);
        }
        else {
            return [];
        }
    }
}

class StreamSourceElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.streamSource = null;
    }
    connectedCallback() {
        this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
        connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
        if (this.streamSource) {
            disconnectStreamSource(this.streamSource);
        }
    }
    get src() {
        return this.getAttribute("src") || "";
    }
}

FrameElement.delegateConstructor = FrameController;
if (customElements.get("turbo-frame") === undefined) {
    customElements.define("turbo-frame", FrameElement);
}
if (customElements.get("turbo-stream") === undefined) {
    customElements.define("turbo-stream", StreamElement);
}
if (customElements.get("turbo-stream-source") === undefined) {
    customElements.define("turbo-stream-source", StreamSourceElement);
}

(() => {
    let element = document.currentScript;
    if (!element)
        return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
        return;
    element = element.parentElement;
    while (element) {
        if (element == document.body) {
            return console.warn(unindent `
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
        }
        element = element.parentElement;
    }
})();

window.Turbo = Turbo;
start();




/***/ }),

/***/ "./node_modules/alpinejs/dist/alpine.js":
/*!**********************************************!*\
  !*** ./node_modules/alpinejs/dist/alpine.js ***!
  \**********************************************/
/***/ (function(module) {

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  // Thanks @stimulus:
  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
  function domReady() {
    return new Promise(resolve => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }
  function arrayUnique(array) {
    return Array.from(new Set(array));
  }
  function isTesting() {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function warnIfMalformedTemplate(el, directive) {
    if (el.tagName.toLowerCase() !== 'template') {
      console.warn(`Alpine: [${directive}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${directive}`);
    } else if (el.content.childElementCount !== 1) {
      console.warn(`Alpine: <template> tag with [${directive}] encountered with an unexpected number of root elements. Make sure <template> has a single root element. `);
    }
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase();
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function walk(el, callback) {
    if (callback(el) === false) return;
    let node = el.firstElementChild;

    while (node) {
      walk(node, callback);
      node = node.nextElementSibling;
    }
  }
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleError = (el, expression, error) => {
    console.warn(`Alpine Error: "${error}"\n\nExpression: "${expression}"\nElement:`, el);

    if (!isTesting()) {
      Object.assign(error, {
        el,
        expression
      });
      throw error;
    }
  };

  function tryCatch(cb, {
    el,
    expression
  }) {
    try {
      const value = cb();
      return value instanceof Promise ? value.catch(e => handleError(el, expression, e)) : value;
    } catch (e) {
      handleError(el, expression, e);
    }
  }

  function saferEval(el, expression, dataContext, additionalHelperVariables = {}) {
    return tryCatch(() => {
      if (typeof expression === 'function') {
        return expression.call(dataContext);
      }

      return new Function(['$data', ...Object.keys(additionalHelperVariables)], `var __alpine_result; with($data) { __alpine_result = ${expression} }; return __alpine_result`)(dataContext, ...Object.values(additionalHelperVariables));
    }, {
      el,
      expression
    });
  }
  function saferEvalNoReturn(el, expression, dataContext, additionalHelperVariables = {}) {
    return tryCatch(() => {
      if (typeof expression === 'function') {
        return Promise.resolve(expression.call(dataContext, additionalHelperVariables['$event']));
      }

      let AsyncFunction = Function;
      /* MODERN-ONLY:START */

      AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      /* MODERN-ONLY:END */
      // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
      // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.

      if (Object.keys(dataContext).includes(expression)) {
        let methodReference = new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables));

        if (typeof methodReference === 'function') {
          return Promise.resolve(methodReference.call(dataContext, additionalHelperVariables['$event']));
        } else {
          return Promise.resolve();
        }
      }

      return Promise.resolve(new AsyncFunction(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables)));
    }, {
      el,
      expression
    });
  }
  const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/;
  function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name);
    return xAttrRE.test(name);
  }
  function getXAttrs(el, component, type) {
    let directives = Array.from(el.attributes).filter(isXAttr).map(parseHtmlAttribute); // Get an object of directives from x-spread.

    let spreadDirective = directives.filter(directive => directive.type === 'spread')[0];

    if (spreadDirective) {
      let spreadObject = saferEval(el, spreadDirective.expression, component.$data); // Add x-spread directives to the pile of existing directives.

      directives = directives.concat(Object.entries(spreadObject).map(([name, value]) => parseHtmlAttribute({
        name,
        value
      })));
    }

    if (type) return directives.filter(i => i.type === type);
    return sortDirectives(directives);
  }

  function sortDirectives(directives) {
    let directiveOrder = ['bind', 'model', 'show', 'catch-all'];
    return directives.sort((a, b) => {
      let typeA = directiveOrder.indexOf(a.type) === -1 ? 'catch-all' : a.type;
      let typeB = directiveOrder.indexOf(b.type) === -1 ? 'catch-all' : b.type;
      return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
    });
  }

  function parseHtmlAttribute({
    name,
    value
  }) {
    const normalizedName = replaceAtAndColonWithStandardSyntax(name);
    const typeMatch = normalizedName.match(xAttrRE);
    const valueMatch = normalizedName.match(/:([a-zA-Z0-9\-:]+)/);
    const modifiers = normalizedName.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map(i => i.replace('.', '')),
      expression: value
    };
  }
  function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = ['disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected', 'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen', 'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer', 'nomodule'];
    return booleanAttributes.includes(attrName);
  }
  function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
      return name.replace('@', 'x-on:');
    } else if (name.startsWith(':')) {
      return name.replace(':', 'x-bind:');
    }

    return name;
  }
  function convertClassStringToArray(classList, filterFn = Boolean) {
    return classList.split(' ').filter(filterFn);
  }
  const TRANSITION_TYPE_IN = 'in';
  const TRANSITION_TYPE_OUT = 'out';
  const TRANSITION_CANCELLED = 'cancelled';
  function transitionIn(el, show, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show();

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_IN) {
      // there is already a similar transition going on, this was probably triggered by
      // a change in a different property, let's just leave the previous one doing its job
      return;
    }

    const attrs = getXAttrs(el, component, 'transition');
    const showAttr = getXAttrs(el, component, 'show')[0]; // If this is triggered by a x-show.transition.

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers; // If x-show.transition.out, we'll skip the "in" transition.

      if (modifiers.includes('out') && !modifiers.includes('in')) return show();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out'); // If x-show.transition.in...out... only use "in" related modifiers for this transition.

      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers;
      transitionHelperIn(el, modifiers, show, reject); // Otherwise, we can assume x-transition:enter.
    } else if (attrs.some(attr => ['enter', 'enter-start', 'enter-end'].includes(attr.value))) {
      transitionClassesIn(el, component, attrs, show, reject);
    } else {
      // If neither, just show that damn thing.
      show();
    }
  }
  function transitionOut(el, hide, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return hide();

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_OUT) {
      // there is already a similar transition going on, this was probably triggered by
      // a change in a different property, let's just leave the previous one doing its job
      return;
    }

    const attrs = getXAttrs(el, component, 'transition');
    const showAttr = getXAttrs(el, component, 'show')[0];

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers;
      if (modifiers.includes('in') && !modifiers.includes('out')) return hide();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out');
      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers;
      transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide, reject);
    } else if (attrs.some(attr => ['leave', 'leave-start', 'leave-end'].includes(attr.value))) {
      transitionClassesOut(el, component, attrs, hide, reject);
    } else {
      hide();
    }
  }
  function transitionHelperIn(el, modifiers, showCallback, reject) {
    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
      duration: modifierValue(modifiers, 'duration', 150),
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      },
      second: {
        opacity: 1,
        scale: 100
      }
    };
    transitionHelper(el, modifiers, showCallback, () => {}, reject, styleValues, TRANSITION_TYPE_IN);
  }
  function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback, reject) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition ? modifierValue(modifiers, 'duration', 150) : modifierValue(modifiers, 'duration', 150) / 2;
    const styleValues = {
      duration: duration,
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 1,
        scale: 100
      },
      second: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      }
    };
    transitionHelper(el, modifiers, () => {}, hideCallback, reject, styleValues, TRANSITION_TYPE_OUT);
  }

  function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback; // If it IS present, grab the value after it: x-show.transition.duration.500ms

    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue) return fallback;

    if (key === 'scale') {
      // Check if the very next value is NOT a number and return the fallback.
      // If x-show.transition.scale, we'll use the default scale value.
      // That is how a user opts out of the opacity transition.
      if (!isNumeric(rawValue)) return fallback;
    }

    if (key === 'duration') {
      // Support x-show.transition.duration.500ms && duration.500
      let match = rawValue.match(/([0-9]+)ms/);
      if (match) return match[1];
    }

    if (key === 'origin') {
      // Support chaining origin directions: x-show.transition.top.right
      if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ');
      }
    }

    return rawValue;
  }

  function transitionHelper(el, modifiers, hook1, hook2, reject, styleValues, type) {
    // clear the previous transition if exists to avoid caching the wrong styles
    if (el.__x_transition) {
      el.__x_transition.cancel && el.__x_transition.cancel();
    } // If the user set these style values, we'll put them back when we're done with them.


    const opacityCache = el.style.opacity;
    const transformCache = el.style.transform;
    const transformOriginCache = el.style.transformOrigin; // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.

    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale');
    const transitionOpacity = noModifiers || modifiers.includes('opacity');
    const transitionScale = noModifiers || modifiers.includes('scale'); // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.

    const stages = {
      start() {
        if (transitionOpacity) el.style.opacity = styleValues.first.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.first.scale / 100})`;
      },

      during() {
        if (transitionScale) el.style.transformOrigin = styleValues.origin;
        el.style.transitionProperty = [transitionOpacity ? `opacity` : ``, transitionScale ? `transform` : ``].join(' ').trim();
        el.style.transitionDuration = `${styleValues.duration / 1000}s`;
        el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
      },

      show() {
        hook1();
      },

      end() {
        if (transitionOpacity) el.style.opacity = styleValues.second.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`;
      },

      hide() {
        hook2();
      },

      cleanup() {
        if (transitionOpacity) el.style.opacity = opacityCache;
        if (transitionScale) el.style.transform = transformCache;
        if (transitionScale) el.style.transformOrigin = transformOriginCache;
        el.style.transitionProperty = null;
        el.style.transitionDuration = null;
        el.style.transitionTimingFunction = null;
      }

    };
    transition(el, stages, type, reject);
  }

  const ensureStringExpression = (expression, el, component) => {
    return typeof expression === 'function' ? component.evaluateReturnExpression(el, expression) : expression;
  };

  function transitionClassesIn(el, component, directives, showCallback, reject) {
    const enter = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter') || {
      expression: ''
    }).expression, el, component));
    const enterStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-start') || {
      expression: ''
    }).expression, el, component));
    const enterEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-end') || {
      expression: ''
    }).expression, el, component));
    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {}, TRANSITION_TYPE_IN, reject);
  }
  function transitionClassesOut(el, component, directives, hideCallback, reject) {
    const leave = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave') || {
      expression: ''
    }).expression, el, component));
    const leaveStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-start') || {
      expression: ''
    }).expression, el, component));
    const leaveEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-end') || {
      expression: ''
    }).expression, el, component));
    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback, TRANSITION_TYPE_OUT, reject);
  }
  function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2, type, reject) {
    // clear the previous transition if exists to avoid caching the wrong classes
    if (el.__x_transition) {
      el.__x_transition.cancel && el.__x_transition.cancel();
    }

    const originalClasses = el.__x_original_classes || [];
    const stages = {
      start() {
        el.classList.add(...classesStart);
      },

      during() {
        el.classList.add(...classesDuring);
      },

      show() {
        hook1();
      },

      end() {
        // Don't remove classes that were in the original class attribute.
        el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)));
        el.classList.add(...classesEnd);
      },

      hide() {
        hook2();
      },

      cleanup() {
        el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)));
        el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)));
      }

    };
    transition(el, stages, type, reject);
  }
  function transition(el, stages, type, reject) {
    const finish = once(() => {
      stages.hide(); // Adding an "isConnected" check, in case the callback
      // removed the element from the DOM.

      if (el.isConnected) {
        stages.cleanup();
      }

      delete el.__x_transition;
    });
    el.__x_transition = {
      // Set transition type so we can avoid clearing transition if the direction is the same
      type: type,
      // create a callback for the last stages of the transition so we can call it
      // from different point and early terminate it. Once will ensure that function
      // is only called one time.
      cancel: once(() => {
        reject(TRANSITION_CANCELLED);
        finish();
      }),
      finish,
      // This store the next animation frame so we can cancel it
      nextFrame: null
    };
    stages.start();
    stages.during();
    el.__x_transition.nextFrame = requestAnimationFrame(() => {
      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;

      if (duration === 0) {
        duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000;
      }

      stages.show();
      el.__x_transition.nextFrame = requestAnimationFrame(() => {
        stages.end();
        setTimeout(el.__x_transition.finish, duration);
      });
    });
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  } // Thanks @vuejs
  // https://github.com/vuejs/vue/blob/4de4649d9637262a9b007720b59f80ac72a5620c/src/shared/util.js

  function once(callback) {
    let called = false;
    return function () {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      }
    };
  }

  function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfMalformedTemplate(templateEl, 'x-for');
    let iteratorNames = typeof expression === 'function' ? parseForExpression(component.evaluateReturnExpression(templateEl, expression)) : parseForExpression(expression);
    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars); // As we walk the array, we'll also walk the DOM (updating/creating as we go).

    let currentEl = templateEl;
    items.forEach((item, index) => {
      let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items, extraVars());
      let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables);
      let nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(currentEl.nextElementSibling, currentKey); // If we haven't found a matching key, insert the element at the current position.

      if (!nextEl) {
        nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl); // And transition it in if it's not the first page load.

        transitionIn(nextEl, () => {}, () => {}, component, initialUpdate);
        nextEl.__x_for = iterationScopeVariables;
        component.initializeElements(nextEl, () => nextEl.__x_for); // Otherwise update the element we found.
      } else {
        // Temporarily remove the key indicator to allow the normal "updateElements" to work.
        delete nextEl.__x_for_key;
        nextEl.__x_for = iterationScopeVariables;
        component.updateElements(nextEl, () => nextEl.__x_for);
      }

      currentEl = nextEl;
      currentEl.__x_for_key = currentKey;
    });
    removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component);
  } // This was taken from VueJS 2.* core. Thanks Vue!

  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\(|\)$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = String(expression).match(forAliasRE);
    if (!inMatch) return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].trim().replace(stripParensRE, '');
    let iteratorMatch = item.match(forIteratorRE);

    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, '').trim();
      res.index = iteratorMatch[1].trim();

      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }

    return res;
  }

  function getIterationScopeVariables(iteratorNames, item, index, items, extraVars) {
    // We must create a new object, so each iteration has a new scope
    let scopeVariables = extraVars ? _objectSpread2({}, extraVars) : {};
    scopeVariables[iteratorNames.item] = item;
    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }

  function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    let bindKeyAttribute = getXAttrs(el, component, 'bind').filter(attr => attr.value === 'key')[0]; // If the dev hasn't specified a key, just return the index of the iteration.

    if (!bindKeyAttribute) return index;
    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables);
  }

  function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, component, 'if')[0];

    if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
      return [];
    }

    let items = component.evaluateReturnExpression(el, iteratorNames.items, extraVars); // This adds support for the `i in n` syntax.

    if (isNumeric(items) && items >= 0) {
      items = Array.from(Array(items).keys(), i => i + 1);
    }

    return items;
  }

  function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true);
    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
    return currentEl.nextElementSibling;
  }

  function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    if (!nextEl) return; // If we are already past the x-for generated elements, we don't need to look ahead.

    if (nextEl.__x_for_key === undefined) return; // If the the key's DO match, no need to look ahead.

    if (nextEl.__x_for_key === currentKey) return nextEl; // If they don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.

    let tmpNextEl = nextEl;

    while (tmpNextEl) {
      if (tmpNextEl.__x_for_key === currentKey) {
        return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
      }

      tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined ? tmpNextEl.nextElementSibling : false;
    }
  }

  function removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component) {
    var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined ? currentEl.nextElementSibling : false;

    while (nextElementFromOldLoop) {
      let nextElementFromOldLoopImmutable = nextElementFromOldLoop;
      let nextSibling = nextElementFromOldLoop.nextElementSibling;
      transitionOut(nextElementFromOldLoop, () => {
        nextElementFromOldLoopImmutable.remove();
      }, () => {}, component);
      nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== undefined ? nextSibling : false;
    }
  }

  function handleAttributeBindingDirective(component, el, attrName, expression, extraVars, attrType, modifiers) {
    var value = component.evaluateReturnExpression(el, expression, extraVars);

    if (attrName === 'value') {
      if (Alpine.ignoreFocusedForValueBinding && document.activeElement.isSameNode(el)) return; // If nested model key is undefined, set the default value to empty string.

      if (value === undefined && String(expression).match(/\./)) {
        value = '';
      }

      if (el.type === 'radio') {
        // Set radio value from x-bind:value, if no "value" attribute exists.
        // If there are any initial state values, radio will have a correct
        // "checked" value since x-bind:value is processed before x-model.
        if (el.attributes.value === undefined && attrType === 'bind') {
          el.value = value;
        } else if (attrType !== 'bind') {
          el.checked = checkedAttrLooseCompare(el.value, value);
        }
      } else if (el.type === 'checkbox') {
        // If we are explicitly binding a string to the :value, set the string,
        // If the value is a boolean, leave it alone, it will be set to "on"
        // automatically.
        if (typeof value !== 'boolean' && ![null, undefined].includes(value) && attrType === 'bind') {
          el.value = String(value);
        } else if (attrType !== 'bind') {
          if (Array.isArray(value)) {
            // I'm purposely not using Array.includes here because it's
            // strict, and because of Numeric/String mis-casting, I
            // want the "includes" to be "fuzzy".
            el.checked = value.some(val => checkedAttrLooseCompare(val, el.value));
          } else {
            el.checked = !!value;
          }
        }
      } else if (el.tagName === 'SELECT') {
        updateSelect(el, value);
      } else {
        if (el.value === value) return;
        el.value = value;
      }
    } else if (attrName === 'class') {
      if (Array.isArray(value)) {
        const originalClasses = el.__x_original_classes || [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '));
      } else if (typeof value === 'object') {
        // Sorting the keys / class names by their boolean value will ensure that
        // anything that evaluates to `false` and needs to remove classes is run first.
        const keysSortedByBooleanValue = Object.keys(value).sort((a, b) => value[a] - value[b]);
        keysSortedByBooleanValue.forEach(classNames => {
          if (value[classNames]) {
            convertClassStringToArray(classNames).forEach(className => el.classList.add(className));
          } else {
            convertClassStringToArray(classNames).forEach(className => el.classList.remove(className));
          }
        });
      } else {
        const originalClasses = el.__x_original_classes || [];
        const newClasses = value ? convertClassStringToArray(value) : [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '));
      }
    } else {
      attrName = modifiers.includes('camel') ? camelCase(attrName) : attrName; // If an attribute's bound value is null, undefined or false, remove the attribute

      if ([null, undefined, false].includes(value)) {
        el.removeAttribute(attrName);
      } else {
        isBooleanAttr(attrName) ? setIfChanged(el, attrName, attrName) : setIfChanged(el, attrName, value);
      }
    }
  }

  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }

  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => {
      return value + '';
    });
    Array.from(el.options).forEach(option => {
      option.selected = arrayWrappedValue.includes(option.value || option.text);
    });
  }

  function handleTextDirective(el, output, expression) {
    // If nested model key is undefined, set the default value to empty string.
    if (output === undefined && String(expression).match(/\./)) {
      output = '';
    }

    el.textContent = output;
  }

  function handleHtmlDirective(component, el, expression, extraVars) {
    el.innerHTML = component.evaluateReturnExpression(el, expression, extraVars);
  }

  function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    const hide = () => {
      el.style.display = 'none';
      el.__x_is_shown = false;
    };

    const show = () => {
      if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style');
      } else {
        el.style.removeProperty('display');
      }

      el.__x_is_shown = true;
    };

    if (initialUpdate === true) {
      if (value) {
        show();
      } else {
        hide();
      }

      return;
    }

    const handle = (resolve, reject) => {
      if (value) {
        if (el.style.display === 'none' || el.__x_transition) {
          transitionIn(el, () => {
            show();
          }, reject, component);
        }

        resolve(() => {});
      } else {
        if (el.style.display !== 'none') {
          transitionOut(el, () => {
            resolve(() => {
              hide();
            });
          }, reject, component);
        } else {
          resolve(() => {});
        }
      }
    }; // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.
    // If x-show.immediate, foregoe the waiting.


    if (modifiers.includes('immediate')) {
      handle(finish => finish(), () => {});
      return;
    } // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).


    if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
      component.executeAndClearRemainingShowDirectiveStack();
    }

    component.showDirectiveStack.push(handle);
    component.showDirectiveLastElement = el;
  }

  function handleIfDirective(component, el, expressionResult, initialUpdate, extraVars) {
    warnIfMalformedTemplate(el, 'x-if');
    const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

    if (expressionResult && (!elementHasAlreadyBeenAdded || el.__x_transition)) {
      const clone = document.importNode(el.content, true);
      el.parentElement.insertBefore(clone, el.nextElementSibling);
      transitionIn(el.nextElementSibling, () => {}, () => {}, component, initialUpdate);
      component.initializeElements(el.nextElementSibling, extraVars);
      el.nextElementSibling.__x_inserted_me = true;
    } else if (!expressionResult && elementHasAlreadyBeenAdded) {
      transitionOut(el.nextElementSibling, () => {
        el.nextElementSibling.remove();
      }, () => {}, component, initialUpdate);
    }
  }

  function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
    const options = {
      passive: modifiers.includes('passive')
    };

    if (modifiers.includes('camel')) {
      event = camelCase(event);
    }

    let handler, listenerTarget;

    if (modifiers.includes('away')) {
      listenerTarget = document;

      handler = e => {
        // Don't do anything if the click came from the element or within it.
        if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

        if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
        // is from outside it, let's run the expression.

        runListenerHandler(component, expression, e, extraVars);

        if (modifiers.includes('once')) {
          document.removeEventListener(event, handler, options);
        }
      };
    } else {
      listenerTarget = modifiers.includes('window') ? window : modifiers.includes('document') ? document : el;

      handler = e => {
        // Remove this global event handler if the element that declared it
        // has been removed. It's now stale.
        if (listenerTarget === window || listenerTarget === document) {
          if (!document.body.contains(el)) {
            listenerTarget.removeEventListener(event, handler, options);
            return;
          }
        }

        if (isKeyEvent(event)) {
          if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
            return;
          }
        }

        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('stop')) e.stopPropagation(); // If the .self modifier isn't present, or if it is present and
        // the target element matches the element we are registering the
        // event on, run the handler

        if (!modifiers.includes('self') || e.target === el) {
          const returnValue = runListenerHandler(component, expression, e, extraVars);
          returnValue.then(value => {
            if (value === false) {
              e.preventDefault();
            } else {
              if (modifiers.includes('once')) {
                listenerTarget.removeEventListener(event, handler, options);
              }
            }
          });
        }
      };
    }

    if (modifiers.includes('debounce')) {
      let nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait';
      let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250;
      handler = debounce(handler, wait);
    }

    listenerTarget.addEventListener(event, handler, options);
  }

  function runListenerHandler(component, expression, e, extraVars) {
    return component.evaluateCommandExpression(e.target, expression, () => {
      return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        '$event': e
      });
    });
  }

  function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event);
  }

  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
      return !['window', 'document', 'prevent', 'stop'].includes(i);
    });

    if (keyModifiers.includes('debounce')) {
      let debounceIndex = keyModifiers.indexOf('debounce');
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    } // If no modifier is specified, we'll call it a press.


    if (keyModifiers.length === 0) return false; // If one is passed, AND it matches the key pressed, we'll call it a press.

    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false; // The user is listening for key combinations.

    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter(i => !selectedSystemKeyModifiers.includes(i));

    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
        // Alias "cmd" and "super" to "meta"
        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta';
        return e[`${modifier}Key`];
      }); // If all the modifiers selected are pressed, ...

      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        // AND the remaining key is pressed as well. It's a press.
        if (keyModifiers[0] === keyToModifier(e.key)) return false;
      }
    } // We'll call it NOT a valid keypress.


    return true;
  }

  function keyToModifier(key) {
    switch (key) {
      case '/':
        return 'slash';

      case ' ':
      case 'Spacebar':
        return 'space';

      default:
        return key && kebabCase(key);
    }
  }

  function registerModelListener(component, el, modifiers, expression, extraVars) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = el.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(el.type) || modifiers.includes('lazy') ? 'change' : 'input';
    const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    registerListener(component, el, event, modifiers, listenerExpression, () => {
      return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
      });
    });
  }

  function generateModelAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
      // Radio buttons only work properly when they share a name attribute.
      // People might assume we take care of that for them, because
      // they already set a shared "x-model" attribute.
      if (!el.hasAttribute('name')) el.setAttribute('name', expression);
    }

    return (event, currentValue) => {
      // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
      if (event instanceof CustomEvent && event.detail) {
        return event.detail;
      } else if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle its value inside the array.
        if (Array.isArray(currentValue)) {
          const newValue = modifiers.includes('number') ? safeParseNumber(event.target.value) : event.target.value;
          return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => !checkedAttrLooseCompare(el, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        return modifiers.includes('number') ? Array.from(event.target.selectedOptions).map(option => {
          const rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        }) : Array.from(event.target.selectedOptions).map(option => {
          return option.value || option.text;
        });
      } else {
        const rawValue = event.target.value;
        return modifiers.includes('number') ? safeParseNumber(rawValue) : modifiers.includes('trim') ? rawValue.trim() : rawValue;
      }
    };
  }

  function safeParseNumber(rawValue) {
    const number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric(number) ? number : rawValue;
  }

  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */
  const { isArray } = Array;
  const { getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty, } = Object;
  const { push: ArrayPush, concat: ArrayConcat, map: ArrayMap, } = Array.prototype;
  function isUndefined(obj) {
      return obj === undefined;
  }
  function isFunction(obj) {
      return typeof obj === 'function';
  }
  function isObject(obj) {
      return typeof obj === 'object';
  }
  const proxyToValueMap = new WeakMap();
  function registerProxy(proxy, value) {
      proxyToValueMap.set(proxy, value);
  }
  const unwrap = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */
  function unwrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = unwrap(descriptor.value);
      }
      return descriptor;
  }
  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
      const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      targetKeys.forEach((key) => {
          let descriptor = getOwnPropertyDescriptor(originalTarget, key);
          // We do not need to wrap the descriptor if configurable
          // Because we can deal with wrapping it when user goes through
          // Get own property descriptor. There is also a chance that this descriptor
          // could change sometime in the future, so we can defer wrapping
          // until we need to
          if (!descriptor.configurable) {
              descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
          }
          ObjectDefineProperty(shadowTarget, key, descriptor);
      });
      preventExtensions(shadowTarget);
  }
  class ReactiveProxyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getProxy(value);
      }
      set(shadowTarget, key, value) {
          const { originalTarget, membrane: { valueMutated } } = this;
          const oldValue = originalTarget[key];
          if (oldValue !== value) {
              originalTarget[key] = value;
              valueMutated(originalTarget, key);
          }
          else if (key === 'length' && isArray(originalTarget)) {
              // fix for issue #236: push will add the new index, and by the time length
              // is updated, the internal length is already equal to the new length value
              // therefore, the oldValue is equal to the value. This is the forking logic
              // to support this use case.
              valueMutated(originalTarget, key);
          }
          return true;
      }
      deleteProperty(shadowTarget, key) {
          const { originalTarget, membrane: { valueMutated } } = this;
          delete originalTarget[key];
          valueMutated(originalTarget, key);
          return true;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      isExtensible(shadowTarget) {
          const shadowIsExtensible = isExtensible(shadowTarget);
          if (!shadowIsExtensible) {
              return shadowIsExtensible;
          }
          const { originalTarget, membrane } = this;
          const targetIsExtensible = isExtensible(originalTarget);
          if (!targetIsExtensible) {
              lockShadowTarget(membrane, shadowTarget, originalTarget);
          }
          return targetIsExtensible;
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getPrototypeOf(shadowTarget) {
          const { originalTarget } = this;
          return getPrototypeOf(originalTarget);
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = this.membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value, setter or getter (if available) cannot observe
          // mutations, just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapValue);
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          const { originalTarget, membrane } = this;
          lockShadowTarget(membrane, shadowTarget, originalTarget);
          preventExtensions(originalTarget);
          return true;
      }
      defineProperty(shadowTarget, key, descriptor) {
          const { originalTarget, membrane } = this;
          const { valueMutated } = membrane;
          const { configurable } = descriptor;
          // We have to check for value in descriptor
          // because Object.freeze(proxy) calls this method
          // with only { configurable: false, writeable: false }
          // Additionally, method will only be called with writeable:false
          // if the descriptor has a value, as opposed to getter/setter
          // So we can just check if writable is present and then see if
          // value is present. This eliminates getter and setter descriptors
          if (hasOwnProperty.call(descriptor, 'writable') && !hasOwnProperty.call(descriptor, 'value')) {
              const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
              descriptor.value = originalDescriptor.value;
          }
          ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
          if (configurable === false) {
              ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
          }
          valueMutated(originalTarget, key);
          return true;
      }
  }

  function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }
  class ReadOnlyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { membrane, originalTarget } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getReadOnlyProxy(value);
      }
      set(shadowTarget, key, value) {
          return false;
      }
      deleteProperty(shadowTarget, key) {
          return false;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value or getter (if available) cannot be observed,
          // just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);
          if (hasOwnProperty.call(desc, 'set')) {
              desc.set = undefined; // readOnly membrane does not allow setters
          }
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          return false;
      }
      defineProperty(shadowTarget, key, descriptor) {
          return false;
      }
  }
  function createShadowTarget(value) {
      let shadowTarget = undefined;
      if (isArray(value)) {
          shadowTarget = [];
      }
      else if (isObject(value)) {
          shadowTarget = {};
      }
      return shadowTarget;
  }
  const ObjectDotPrototype = Object.prototype;
  function defaultValueIsObservable(value) {
      // intentionally checking for null
      if (value === null) {
          return false;
      }
      // treat all non-object types, including undefined, as non-observable values
      if (typeof value !== 'object') {
          return false;
      }
      if (isArray(value)) {
          return true;
      }
      const proto = getPrototypeOf(value);
      return (proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null);
  }
  const defaultValueObserved = (obj, key) => {
      /* do nothing */
  };
  const defaultValueMutated = (obj, key) => {
      /* do nothing */
  };
  const defaultValueDistortion = (value) => value;
  function wrapDescriptor(membrane, descriptor, getValue) {
      const { set, get } = descriptor;
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = getValue(membrane, descriptor.value);
      }
      else {
          if (!isUndefined(get)) {
              descriptor.get = function () {
                  // invoking the original getter with the original target
                  return getValue(membrane, get.call(unwrap(this)));
              };
          }
          if (!isUndefined(set)) {
              descriptor.set = function (value) {
                  // At this point we don't have a clear indication of whether
                  // or not a valid mutation will occur, we don't have the key,
                  // and we are not sure why and how they are invoking this setter.
                  // Nevertheless we preserve the original semantics by invoking the
                  // original setter with the original target and the unwrapped value
                  set.call(unwrap(this), membrane.unwrapProxy(value));
              };
          }
      }
      return descriptor;
  }
  class ReactiveMembrane {
      constructor(options) {
          this.valueDistortion = defaultValueDistortion;
          this.valueMutated = defaultValueMutated;
          this.valueObserved = defaultValueObserved;
          this.valueIsObservable = defaultValueIsObservable;
          this.objectGraph = new WeakMap();
          if (!isUndefined(options)) {
              const { valueDistortion, valueMutated, valueObserved, valueIsObservable } = options;
              this.valueDistortion = isFunction(valueDistortion) ? valueDistortion : defaultValueDistortion;
              this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
              this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
              this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
          }
      }
      getProxy(value) {
          const unwrappedValue = unwrap(value);
          const distorted = this.valueDistortion(unwrappedValue);
          if (this.valueIsObservable(distorted)) {
              const o = this.getReactiveState(unwrappedValue, distorted);
              // when trying to extract the writable version of a readonly
              // we return the readonly.
              return o.readOnly === value ? value : o.reactive;
          }
          return distorted;
      }
      getReadOnlyProxy(value) {
          value = unwrap(value);
          const distorted = this.valueDistortion(value);
          if (this.valueIsObservable(distorted)) {
              return this.getReactiveState(value, distorted).readOnly;
          }
          return distorted;
      }
      unwrapProxy(p) {
          return unwrap(p);
      }
      getReactiveState(value, distortedValue) {
          const { objectGraph, } = this;
          let reactiveState = objectGraph.get(distortedValue);
          if (reactiveState) {
              return reactiveState;
          }
          const membrane = this;
          reactiveState = {
              get reactive() {
                  const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue);
                  // caching the reactive proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'reactive', { value: proxy });
                  return proxy;
              },
              get readOnly() {
                  const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue);
                  // caching the readOnly proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'readOnly', { value: proxy });
                  return proxy;
              }
          };
          objectGraph.set(distortedValue, reactiveState);
          return reactiveState;
      }
  }
  /** version: 0.26.0 */

  function wrap(data, mutationCallback) {

    let membrane = new ReactiveMembrane({
      valueMutated(target, key) {
        mutationCallback(target, key);
      }

    });
    return {
      data: membrane.getProxy(data),
      membrane: membrane
    };
  }
  function unwrap$1(membrane, observable) {
    let unwrappedData = membrane.unwrapProxy(observable);
    let copy = {};
    Object.keys(unwrappedData).forEach(key => {
      if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return;
      copy[key] = unwrappedData[key];
    });
    return copy;
  }

  class Component {
    constructor(el, componentForClone = null) {
      this.$el = el;
      const dataAttr = this.$el.getAttribute('x-data');
      const dataExpression = dataAttr === '' ? '{}' : dataAttr;
      const initExpression = this.$el.getAttribute('x-init');
      let dataExtras = {
        $el: this.$el
      };
      let canonicalComponentElementReference = componentForClone ? componentForClone.$el : this.$el;
      Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
        Object.defineProperty(dataExtras, `$${name}`, {
          get: function get() {
            return callback(canonicalComponentElementReference);
          }
        });
      });
      this.unobservedData = componentForClone ? componentForClone.getUnobservedData() : saferEval(el, dataExpression, dataExtras);
      // Construct a Proxy-based observable. This will be used to handle reactivity.

      let {
        membrane,
        data
      } = this.wrapDataInObservable(this.unobservedData);
      this.$data = data;
      this.membrane = membrane; // After making user-supplied data methods reactive, we can now add
      // our magic properties to the original data for access.

      this.unobservedData.$el = this.$el;
      this.unobservedData.$refs = this.getRefsProxy();
      this.nextTickStack = [];

      this.unobservedData.$nextTick = callback => {
        this.nextTickStack.push(callback);
      };

      this.watchers = {};

      this.unobservedData.$watch = (property, callback) => {
        if (!this.watchers[property]) this.watchers[property] = [];
        this.watchers[property].push(callback);
      };
      /* MODERN-ONLY:START */
      // We remove this piece of code from the legacy build.
      // In IE11, we have already defined our helpers at this point.
      // Register custom magic properties.


      Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
        Object.defineProperty(this.unobservedData, `$${name}`, {
          get: function get() {
            return callback(canonicalComponentElementReference, this.$el);
          }
        });
      });
      /* MODERN-ONLY:END */

      this.showDirectiveStack = [];
      this.showDirectiveLastElement;
      componentForClone || Alpine.onBeforeComponentInitializeds.forEach(callback => callback(this));
      var initReturnedCallback; // If x-init is present AND we aren't cloning (skip x-init on clone)

      if (initExpression && !componentForClone) {
        // We want to allow data manipulation, but not trigger DOM updates just yet.
        // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
        this.pauseReactivity = true;
        initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression);
        this.pauseReactivity = false;
      } // Register all our listeners and set all our attribute bindings.
      // If we're cloning a component, the third parameter ensures no duplicate
      // event listeners are registered (the mutation observer will take care of them)


      this.initializeElements(this.$el, () => {}, componentForClone); // Use mutation observer to detect new elements being added within this component at run-time.
      // Alpine's just so darn flexible amirite?

      this.listenForNewElementsToInitialize();

      if (typeof initReturnedCallback === 'function') {
        // Run the callback returned from the "x-init" hook to allow the user to do stuff after
        // Alpine's got it's grubby little paws all over everything.
        initReturnedCallback.call(this.$data);
      }

      componentForClone || setTimeout(() => {
        Alpine.onComponentInitializeds.forEach(callback => callback(this));
      }, 0);
    }

    getUnobservedData() {
      return unwrap$1(this.membrane, this.$data);
    }

    wrapDataInObservable(data) {
      var self = this;
      let updateDom = debounce(function () {
        self.updateElements(self.$el);
      }, 0);
      return wrap(data, (target, key) => {
        if (self.watchers[key]) {
          // If there's a watcher for this specific key, run it.
          self.watchers[key].forEach(callback => callback(target[key]));
        } else if (Array.isArray(target)) {
          // Arrays are special cases, if any of the items change, we consider the array as mutated.
          Object.keys(self.watchers).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // Ignore length mutations since they would result in duplicate calls.
            // For example, when calling push, we would get a mutation for the item's key
            // and a second mutation for the length property.

            if (key === 'length') return;
            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData[part])) {
                self.watchers[fullDotNotationKey].forEach(callback => callback(target));
              }

              return comparisonData[part];
            }, self.unobservedData);
          });
        } else {
          // Let's walk through the watchers with "dot-notation" (foo.bar) and see
          // if this mutation fits any of them.
          Object.keys(self.watchers).filter(i => i.includes('.')).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // If this dot-notation watcher's last "part" doesn't match the current
            // key, then skip it early for performance reasons.

            if (key !== dotNotationParts[dotNotationParts.length - 1]) return; // Now, walk through the dot-notation "parts" recursively to find
            // a match, and call the watcher if one's found.

            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData)) {
                // Run the watchers.
                self.watchers[fullDotNotationKey].forEach(callback => callback(target[key]));
              }

              return comparisonData[part];
            }, self.unobservedData);
          });
        } // Don't react to data changes for cases like the `x-created` hook.


        if (self.pauseReactivity) return;
        updateDom();
      });
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {}) {
      walk(el, el => {
        // We've hit a component.
        if (el.hasAttribute('x-data')) {
          // If it's not the current one.
          if (!el.isSameNode(this.$el)) {
            // Initialize it if it's not.
            if (!el.__x) initializeComponentCallback(el); // Now we'll let that sub-component deal with itself.

            return false;
          }
        }

        return callback(el);
      });
    }

    initializeElements(rootEl, extraVars = () => {}, componentForClone = false) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop
        if (el.__x_for_key !== undefined) return false; // Don't touch spawns from if directives

        if (el.__x_inserted_me !== undefined) return false;
        this.initializeElement(el, extraVars, componentForClone ? false : true);
      }, el => {
        if (!componentForClone) el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack();
      this.executeAndClearNextTickStack(rootEl);
    }

    initializeElement(el, extraVars, shouldRegisterListeners = true) {
      // To support class attribute merging, we have to know what the element's
      // original class attribute looked like for reference.
      if (el.hasAttribute('class') && getXAttrs(el, this).length > 0) {
        el.__x_original_classes = convertClassStringToArray(el.getAttribute('class'));
      }

      shouldRegisterListeners && this.registerListeners(el, extraVars);
      this.resolveBoundAttributes(el, true, extraVars);
    }

    updateElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
        if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) return false;
        this.updateElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack();
      this.executeAndClearNextTickStack(rootEl);
    }

    executeAndClearNextTickStack(el) {
      // Skip spawns from alpine directives
      if (el === this.$el && this.nextTickStack.length > 0) {
        // We run the tick stack after the next frame to allow any
        // running transitions to pass the initial show stage.
        requestAnimationFrame(() => {
          while (this.nextTickStack.length > 0) {
            this.nextTickStack.shift()();
          }
        });
      }
    }

    executeAndClearRemainingShowDirectiveStack() {
      // The goal here is to start all the x-show transitions
      // and build a nested promise chain so that elements
      // only hide when the children are finished hiding.
      this.showDirectiveStack.reverse().map(handler => {
        return new Promise((resolve, reject) => {
          handler(resolve, reject);
        });
      }).reduce((promiseChain, promise) => {
        return promiseChain.then(() => {
          return promise.then(finishElement => {
            finishElement();
          });
        });
      }, Promise.resolve(() => {})).catch(e => {
        if (e !== TRANSITION_CANCELLED) throw e;
      }); // We've processed the handler stack. let's clear it.

      this.showDirectiveStack = [];
      this.showDirectiveLastElement = undefined;
    }

    updateElement(el, extraVars) {
      this.resolveBoundAttributes(el, false, extraVars);
    }

    registerListeners(el, extraVars) {
      getXAttrs(el, this).forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'on':
            registerListener(this, el, value, modifiers, expression, extraVars);
            break;

          case 'model':
            registerModelListener(this, el, modifiers, expression, extraVars);
            break;
        }
      });
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
      let attrs = getXAttrs(el, this);
      attrs.forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'model':
            handleAttributeBindingDirective(this, el, 'value', expression, extraVars, type, modifiers);
            break;

          case 'bind':
            // The :key binding on an x-for is special, ignore it.
            if (el.tagName.toLowerCase() === 'template' && value === 'key') return;
            handleAttributeBindingDirective(this, el, value, expression, extraVars, type, modifiers);
            break;

          case 'text':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleTextDirective(el, output, expression);
            break;

          case 'html':
            handleHtmlDirective(this, el, expression, extraVars);
            break;

          case 'show':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleShowDirective(this, el, output, modifiers, initialUpdate);
            break;

          case 'if':
            // If this element also has x-for on it, don't process x-if.
            // We will let the "x-for" directive handle the "if"ing.
            if (attrs.some(i => i.type === 'for')) return;
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleIfDirective(this, el, output, initialUpdate, extraVars);
            break;

          case 'for':
            handleForDirective(this, el, expression, initialUpdate, extraVars);
            break;

          case 'cloak':
            el.removeAttribute('x-cloak');
            break;
        }
      });
    }

    evaluateReturnExpression(el, expression, extraVars = () => {}) {
      return saferEval(el, expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    evaluateCommandExpression(el, expression, extraVars = () => {}) {
      return saferEvalNoReturn(el, expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    getDispatchFunction(el) {
      return (event, detail = {}) => {
        el.dispatchEvent(new CustomEvent(event, {
          detail,
          bubbles: true
        }));
      };
    }

    listenForNewElementsToInitialize() {
      const targetNode = this.$el;
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          // Filter out mutations triggered from child components.
          const closestParentComponent = mutations[i].target.closest('[x-data]');
          if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) continue;

          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
            const xAttr = mutations[i].target.getAttribute('x-data') || '{}';
            const rawData = saferEval(this.$el, xAttr, {
              $el: this.$el
            });
            Object.keys(rawData).forEach(key => {
              if (this.$data[key] !== rawData[key]) {
                this.$data[key] = rawData[key];
              }
            });
          }

          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              if (node.nodeType !== 1 || node.__x_inserted_me) return;

              if (node.matches('[x-data]') && !node.__x) {
                node.__x = new Component(node);
                return;
              }

              this.initializeElements(node);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    }

    getRefsProxy() {
      var self = this;
      var refObj = {};
      // One of the goals of this is to not hold elements in memory, but rather re-evaluate
      // the DOM when the system needs something from it. This way, the framework is flexible and
      // friendly to outside DOM changes from libraries like Vue/Livewire.
      // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.

      return new Proxy(refObj, {
        get(object, property) {
          if (property === '$isAlpineProxy') return true;
          var ref; // We can't just query the DOM because it's hard to filter out refs in
          // nested components.

          self.walkAndSkipNestedComponents(self.$el, el => {
            if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
              ref = el;
            }
          });
          return ref;
        }

      });
    }

  }

  const Alpine = {
    version: "2.8.2",
    pauseMutationObserver: false,
    magicProperties: {},
    onComponentInitializeds: [],
    onBeforeComponentInitializeds: [],
    ignoreFocusedForValueBinding: false,
    start: async function start() {
      if (!isTesting()) {
        await domReady();
      }

      this.discoverComponents(el => {
        this.initializeComponent(el);
      }); // It's easier and more performant to just support Turbolinks than listen
      // to MutationObserver mutations at the document level.

      document.addEventListener("turbolinks:load", () => {
        this.discoverUninitializedComponents(el => {
          this.initializeComponent(el);
        });
      });
      this.listenForNewUninitializedComponentsAtRunTime();
    },
    discoverComponents: function discoverComponents(callback) {
      const rootEls = document.querySelectorAll('[x-data]');
      rootEls.forEach(rootEl => {
        callback(rootEl);
      });
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(callback, el = null) {
      const rootEls = (el || document).querySelectorAll('[x-data]');
      Array.from(rootEls).filter(el => el.__x === undefined).forEach(rootEl => {
        callback(rootEl);
      });
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime() {
      const targetNode = document.querySelector('body');
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        if (this.pauseMutationObserver) return;

        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              // Discard non-element nodes (like line-breaks)
              if (node.nodeType !== 1) return; // Discard any changes happening within an existing component.
              // They will take care of themselves.

              if (node.parentElement && node.parentElement.closest('[x-data]')) return;
              this.discoverUninitializedComponents(el => {
                this.initializeComponent(el);
              }, node.parentElement);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    },
    initializeComponent: function initializeComponent(el) {
      if (!el.__x) {
        // Wrap in a try/catch so that we don't prevent other components
        // from initializing when one component contains an error.
        try {
          el.__x = new Component(el);
        } catch (error) {
          setTimeout(() => {
            throw error;
          }, 0);
        }
      }
    },
    clone: function clone(component, newEl) {
      if (!newEl.__x) {
        newEl.__x = new Component(newEl, component);
      }
    },
    addMagicProperty: function addMagicProperty(name, callback) {
      this.magicProperties[name] = callback;
    },
    onComponentInitialized: function onComponentInitialized(callback) {
      this.onComponentInitializeds.push(callback);
    },
    onBeforeComponentInitialized: function onBeforeComponentInitialized(callback) {
      this.onBeforeComponentInitializeds.push(callback);
    }
  };

  if (!isTesting()) {
    window.Alpine = Alpine;

    if (window.deferLoadingAlpine) {
      window.deferLoadingAlpine(function () {
        window.Alpine.start();
      });
    } else {
      window.Alpine.start();
    }
  }

  return Alpine;

})));


/***/ }),

/***/ "./resources/assets/js/account/account.js":
/*!************************************************!*\
  !*** ./resources/assets/js/account/account.js ***!
  \************************************************/
/***/ (() => {

listenClick(".addBankAccount", function () {
  $("#addBankAccountForm")[0].reset();
  $("#addBankAccountModel").appendTo("body").modal("show");
});
listenSubmit("#addBankAccountForm", function (e) {
  e.preventDefault();
  if (isDoubleClicked($(this))) return;
  $.ajax({
    url: route("accounts.store"),
    type: "POST",
    data: new FormData(this),
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#addBankAccountModel").modal("hide");
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#bankAccountTbl").DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick(".account-edit-btn", function (event) {
  var accountId = $(event.currentTarget).attr("data-id");
  taxRenderData(accountId);
});
function taxRenderData(accountId) {
  $.ajax({
    url: route("accounts.edit", accountId),
    type: "GET",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#editAccountHolderName").val(result.data.holder_name);
        $("#editBankAccountName").val(result.data.bank_name);
        $("#editAccountNumber").val(result.data.account_number);
        $("#editBalance").val(result.data.balance);
        $("#editAddress").val(result.data.address);
        $("#bankAccountId").val(result.data.id);
        $("#editBankAccountModel").appendTo("body").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
listenSubmit("#editBankAccountForm", function (event) {
  event.preventDefault();
  var accountId = $("#bankAccountId").val();
  $.ajax({
    url: route("accounts.update", accountId),
    type: "put",
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $("#editBankAccountModel").modal("hide");
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#bankAccountTbl").DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick(".account-delete-btn", function (event) {
  var account = $(event.currentTarget).attr("data-id");
  deleteItem(route("accounts.destroy", account), "#bankAccountTbl", Lang.get("messages.accounts.account"));
});

/***/ }),

/***/ "./resources/assets/js/adjustment/adjustment.js":
/*!******************************************************!*\
  !*** ./resources/assets/js/adjustment/adjustment.js ***!
  \******************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditQuote);
function loadCreateEditQuote() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditQuote();
  momentFormat = convertToMomentFormat(currentDateFormat);
}
function initializeSelect2CreateEditQuote() {
  $("#warehouse_id").select2();
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  $("#adjustment_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
}
window.qtyUpdate = function (obj) {
  livewire.emit('qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};
listenClick("#saveAdjustmentForm", function (event) {
  event.preventDefault();
  var frm = $(this).parents('form');
  $('#warehouse_id').removeAttr('disabled');
  screenLock();
  $.ajax({
    url: frm.attr('action'),
    type: "POST",
    dataType: "json",
    data: $('#' + frm.attr('id')).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      displaySuccessMessage(res.result.message);
      Turbo.visit(route("adjustments.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick('.adjustment-delete-btn', function (event) {
  var adjustment_id = $(event.currentTarget).attr('data-id');
  deleteItem(route('adjustments.destroy', adjustment_id), 'adjustmentTable', 'adjustment');
});

/***/ }),

/***/ "./resources/assets/js/adjustment/create-edit.js":
/*!*******************************************************!*\
  !*** ./resources/assets/js/adjustment/create-edit.js ***!
  \*******************************************************/
/***/ (() => {

// document.addEventListener("turbo:load", loadCreateEditAdjustment);
// var adjustment_product=[]

// function tb_product(data) {

//     $('.adjustment-item-container').append(`
//     <tr class="tax-tr">
//         <td class="text-center item-number align-center">${data['id']}</td>
//         <td class="table__item-desc w-25">
//             <h4 class="fs-6 mb-0">${data['name']}</h4>
//         </td>
//         <td class="table__qty">
//             <h4 class="fs-6 mb-0">${data['code']}</h4>
//         </td>

//         <td>
//             <span class="badge bg-light-warning"><span>${data['stock_alert']}&nbsp;k</span></span>
//         </td>

//         <td class="table__item-desc w-25">
//         <input class="form-control qty-adjustment form-control-solid" required="" name="quantity[]" type="number" min="0" step="1" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
//         </td>

//         <td class="table__item-desc w-25">
//             <select class="form-control" id="adjustment_method_${data['id']}">
//             <option value="1">Addition</option>
//             <option value="2">Subtraction</option>
//             </select>
//         </td>

//         <td class="text-end">
//             <button type="button" title="Delete" id="action_${data['id']}" 
//                 class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-adjustment-item">
//                 <i class="fa-solid fa-trash"></i>
//             </button>
//         </td>
//     </tr> 
// `)
// }
// function loadCreateEditAdjustment() {
//     $('input:text:not([readonly="readonly"])').first().blur();
//     initializeSelect2CreateEditAdjustment();
// }   

// function initializeSelect2CreateEditAdjustment() {
//     $("#adjustment_warehouse_id").select2({
//         placeholder: "Select Warehouse",
//         tags: true,
//     });
//     $("#adjustment_date").flatpickr({
//         defaultDate: new Date(),
//         dateFormat: currentDateFormat,
//         maxDate: new Date(),
//         locale: getUserLanguages,
//     });

//     $('#id_search_by_product_code').on('input', function(){
//         if($('#adjustment_warehouse_id').val()==''){
//             $('#adjustment_warehouse_warning').css('visibility', 'visible');
//             return 
//         }
//         $('#adjustment_warehouse_warning').css('visibility', 'hidden');
//             let productId = $(this).val();
//             $.ajax({
//                 url: route("adjustments.get-product", productId),
//                 type: "get",
//                 dataType: "json",
//                 success: function (result) {
//                     if (result.data) {
//                         $('#adjustment_warehouse_id').prop('disabled', true);
//                         let data=result.data[0];
//                         console.log(data)

//                         if(adjustment_product.length==0){
//                             adjustment_product.push(data)
//                             tb_product(data)

//                             resetAdjustmentItemIndex();
//                         }
//                         else {
//                             if (adjustment_product.some(item => item.id === data['id'])) {
//                                 displayErrorMessage('Already Added');
//                             }
//                             else
//                             {
//                                 adjustment_product.push(data)
//                                 tb_product(data);

//                                 resetAdjustmentItemIndex();
//                             }
//                         }
//                     }
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//             });
//     });

//     listenClick("#saveAsDraftadjustment", function (event) {
//         event.preventDefault();
//             let warehouse_id=$('#adjustment_warehouse_id').val()
//             let adjustment_date=$('#adjustment_date').val()
//             var data=[]
//             $('#id_adjustment_tbody tr').each(function(){

//                 var rowData = {};
//                 $(this).find('td').each(function(index){
//                     if(index === 0) {
//                         rowData['product_id'] = $(this).text();
//                     }  else if(index === 4) {
//                         rowData['quantity'] = Number($(this).find('input').val());
//                     } else if(index === 5) {
//                         rowData['method_type'] = $(this).find('select').val();
//                     }
//                 });
//                 data.push(rowData);
//             })

//             let formData={}
//             formData['warehouse_id']=warehouse_id
//             formData['date']=new Date(adjustment_date).toISOString()
//             formData['adjustment_items']=data
//             screenLock();
//             $.ajax({
//                 url: route("adjustments.store"),
//                 type: "POST",
//                 dataType: "json",
//                 data: formData,
//                 beforeSend: function () {
//                     startLoader();
//                 },
//                 success: function (result) {
//                     adjustment_product=[]
//                     displaySuccessMessage(result.message)
//                     Turbo.visit(route("adjustments.index"));
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//                 complete: function () {
//                     stopLoader();
//                     screenUnLock();
//                 },
//             });
//     });

//     // ****************edit**************
//     //show the datepicker of edit
//     let editQuoteDueDateVal = moment($("#id_edit_adjustment_date").val()).format(
//         convertToMomentFormat(currentDateFormat)
//     );

//     $("#edit_adjustment_date").flatpickr({
//         dateFormat: currentDateFormat,
//         defaultDate: editQuoteDueDateVal,
//         locale: getUserLanguages,
//     });
//     $('#edit_warehouse_id').prop('disabled', true);

//     //get the table data of edit
//         let items_data=$('#edit_adjustment').val()?JSON.parse($('#edit_adjustment').val()):[]

//     //show the data to the table of edit 
//     if(items_data.length!=0) {
//         showEditExistData(items_data['adjustment_items']);

//         resetAdjustmentItemIndex()
//     }   

//     //edit_search_project
//     $('#edit_id_search_by_product_code').on('input', function(){
//             let productId = $(this).val();
//             $.ajax({
//                 url: route("adjustments.get-product", productId),
//                 type: "get",
//                 dataType: "json",
//                 success: function (result) {
//                     if (result.data) {
//                         $('#adjustment_warehouse_id').prop('disabled', true);
//                         let data=result.data[0];
//                         console.log(data)

//                         if(adjustment_product.length==0){
//                             adjustment_product.push(data)
//                             tb_product(data)

//                             resetAdjustmentItemIndex();
//                         }
//                         else {
//                             if (adjustment_product.some(item => item.id === data['id'])) {
//                                 displayErrorMessage('Already Added');
//                             }
//                             else
//                             {
//                                 adjustment_product.push(data)
//                                 tb_product(data);

//                                 resetAdjustmentItemIndex();
//                             }
//                         }
//                     }
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//             });
//     });

// }
// function editTableProduct(data) {
//     $('#edit_id_adjustment_tbody').append(`
//     <tr class="tax-tr">
//         <td class="text-center item-number align-center">${data['id']}</td>
//         <td class="table__item-desc w-25">
//             <h4 class="fs-6 mb-0">${data['name']}</h4>
//         </td>
//         <td class="table__qty">
//             <h4 class="fs-6 mb-0">${data['code']}</h4>
//         </td>

//         <td>
//             <span class="badge bg-light-warning"><span>${data['stock_alert']}&nbsp;k</span></span>
//         </td>

//         <td class="table__item-desc w-25">
//         <input class="form-control qty-adjustment form-control-solid" required="" name="quantity[]" type="number" min="0" step="1" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
//         </td>

//         <td class="table__item-desc w-25">
//             <select class="form-control" id="adjustment_method_${data['id']}">
//             <option value="1">Addition</option>
//             <option value="2">Subtraction</option>
//             </select>
//         </td>

//         <td class="text-end">
//             <button type="button" title="Delete" id="action_${data['id']}" 
//                 class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-adjustment-item">
//                 <i class="fa-solid fa-trash"></i>
//             </button>
//         </td>
//     </tr> 
// `)
// }
// function showEditExistData(data){

//     for(let i=0;i<data.length;i++) {
//         adjustment_product.push(data[i]['product']);
//         $('#edit_id_adjustment_tbody').append(`
//         <tr class="tax-tr">
//             <td class="text-center item-number align-center">${data[i]['id']}</td>
//             <td class="table__item-desc w-25">
//                 <h4 class="fs-6 mb-0">${data[i]['product']['name']}</h4>
//             </td>
//             <td class="table__qty">
//                 <h4 class="fs-6 mb-0">${data[i]['product']['code']}</h4>
//             </td>

//             <td>
//                 <span class="badge bg-light-warning"><span>${data[i]['product']['stock_alert']}&nbsp;k</span></span>
//             </td>

//             <td class="table__item-desc w-25">
//             <input class="form-control qty-adjustment form-control-solid" required="" value=${data[i]['quantity']} type="number" min="0" step="1" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
//             </td>

//             <td class="table__item-desc w-25">
//                 <select class="form-control" >
//                 <option value="1">Addition</option>
//                 <option value="2">Subtraction</option>
//                 </select>
//             </td>

//             <td class="text-end">
//                 <button type="button" title="Delete" 
//                     class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-adjustment-item">
//                     <i class="fa-solid fa-trash"></i>
//                 </button>
//             </td>
//         </tr> 
//     `)
//     }

// }
// // listenKeyup("#adjustmentId", function () {
// //     return $("#adjustmentId").val(this.value.toUpperCase());
// // });

// window.isNumberKey = (evt, element) => {
//     let charCode = evt.which ? evt.which : event.keyCode;

//     return !(
//         (charCode !== 46 || $(element).val().indexOf(".") !== -1) &&
//         (charCode < 48 || charCode > 57)
//     );
// };

// const resetAdjustmentItemIndex = () => {
//     let index = 1;
//     $(".adjustment-item-container>tr").each(function () {
//         $(this).find(".item-number").text(index);
//         index++;
//     });

// };
// listenClick(".delete-adjustment-item", function () {
//     var index=$(this).parents("tr").find("td:first").text()-1
//     if (index > -1 && index < adjustment_product.length) {
//         adjustment_product.splice(index, 1); // Remove the element at the found index
//     }
//     $(this).parents("tr").remove();
//     resetAdjustmentItemIndex();
// });
// listenClick('.adjustments-delete-btn', function (event) {
//     event.preventDefault();
//     let id = $(event.currentTarget).attr('data-id')
//     deleteItem(route('adjustments.destroy', id), 'adjustment',
//         Lang.get('messages.adjustments.adjustment'));
// })

// // listenClick('.base-unit-delete-btn', function (event) {
// //     let id = $(event.currentTarget).attr('data-id');
// //     deleteItem(route('adjustments.destroy', id), '#adjustment',
// //         );
// //         // Lang.get('messages.units.base_units')
// // });

// // listenChange(".product-adjustment", function () {
// //     let productId = $(this).val();
// //     if (isEmpty(productId)) {
// //         productId = 0;
// //     }
// //     let element = $(this);
// //     $.ajax({
// //         url: route("adjustments.get-product", productId),
// //         type: "get",
// //         dataType: "json",
// //         success: function (result) {
// //             if (result.success) {
// //                 let price = "";
// //                 $.each(result.data, function (id, productPrice) {
// //                     if (id === productId) price = productPrice;
// //                 });
// //                 element.parent().parent().find("td .price-adjustment").val(price);
// //                 element.parent().parent().find("td .qty-adjustment").val(1);
// //                 $(".price-adjustment").trigger("keyup");
// //             }
// //         },
// //         error: function (result) {
// //             displayErrorMessage(result.responseJSON.message);
// //         },
// //     });
// // });

// // listenKeyup(".qty-adjustment", function () {
// //     let qty = parseFloat($(this).val());
// //     let rate = $(this).parent().siblings().find(".price-adjustment").val();
// //     rate = parseFloat(removeCommas(rate));
// //     let amount = calculateAmount(qty, rate);
// //     $(this)
// //         .parent()
// //         .siblings(".adjustment-item-total")
// //         .text(addCommas(amount.toFixed(2).toString()));
// //     calculateAndSetAdjustmentAmount();
// // });

// // listenKeyup(".price-adjustment", function () {
// //     let rate = $(this).val();
// //     rate = parseFloat(removeCommas(rate));
// //     let qty = $(this).parent().siblings().find(".qty-adjustment").val();
// //     let amount = calculateAmount(qty, rate);
// //     $(this)
// //         .parent()
// //         .siblings(".adjustment-item-total")
// //         .text(addCommas(amount.toFixed(2).toString()));
// //     calculateAndSetAdjustmentAmount();
// // });

// // const calculateAmount = (qty, rate) => {
// //     if (qty > 0 && rate > 0) {
// //         let price = qty * rate;
// //         return price;
// //     } else {
// //         return 0;
// //     }
// // };

// // const calculateAndSetAdjustmentAmount = () => {
// //     let adjustmentTotalAmount = 0;
// //     $(".adjustment-item-container>tr").each(function () {
// //         let adjustmentItemTotal = $(this).find(".adjustment-item-total").text();
// //         adjustmentItemTotal = removeCommas(adjustmentItemTotal);
// //         adjustmentItemTotal = isEmpty($.trim(adjustmentItemTotal))
// //             ? 0
// //             : parseFloat(adjustmentItemTotal);
// //         adjustmentTotalAmount += adjustmentItemTotal;
// //     });

// //     adjustmentTotalAmount = parseFloat(adjustmentTotalAmount);
// //     if (isNaN(adjustmentTotalAmount)) {
// //         adjustmentTotalAmount = 0;
// //     }
// //     $("#adjustmentTotal").text(addCommas(adjustmentTotalAmount.toFixed(2)));

// //     //set hidden input value
// //     $("#adjustmentTotalAmount").val(adjustmentTotalAmount);

// //     calculateDiscount();
// // };

// // const calculateDiscount = () => {
// //     let discount = $("#discount").val();
// //     discountType = $("#discountType").val();
// //     let itemAmount = [];
// //     let i = 0;
// //     $(".adjustment-item-total").each(function () {
// //         itemAmount[i++] = $.trim(removeCommas($(this).text()));
// //     });
// //     $.sum = function (arr) {
// //         var r = 0;
// //         $.each(arr, function (i, v) {
// //             r += +v;
// //         });
// //         return r;
// //     };

// //     let totalAmount = $.sum(itemAmount);
// //     $("#adjustmentTotal").text(number_format(totalAmount));
// //     if (isEmpty(discount) || isEmpty(totalAmount)) {
// //         discount = 0;
// //     }
// //     let discountAmount = 0;
// //     let finalAmount = totalAmount - discountAmount;
// //     if (discountType == 1) {
// //         discountAmount = discount;
// //         finalAmount = totalAmount - discountAmount;
// //     } else if (discountType == 2) {
// //         discountAmount = (totalAmount * discount) / 100;
// //         finalAmount = totalAmount - discountAmount;
// //     }
// //     $("#adjustmentFinalAmount").text(number_format(finalAmount));
// //     $("#adjustmentTotalAmount").val(finalAmount.toFixed(2));
// //     $("#adjustmentDiscountAmount").text(number_format(discountAmount));
// // };

// // listen("keyup", "#discount", function () {
// //     let value = $(this).val();
// //     if (discountType == 2 && value > 100) {
// //         displayErrorMessage(
// //             "On Percentage you can only give maximum 100% discount"
// //         );
// //         $(this).val(value.slice(0, -1));

// //         return false;
// //     }
// //     calculateDiscount();
// // });

// // listenClick("#saveAsDraftAdjustment", function (event) {
// //     event.preventDefault();

// //     let adjustmentStates = $(this).data("status");
// //     let myForm = document.getElementById("adjustmentForm");
// //     let formData = new FormData(myForm);
// //     formData.append("status", adjustmentStates);
// //     screenLock();
// //     $.ajax({
// //         url: route("adjustments.store"),
// //         type: "POST",
// //         dataType: "json",
// //         data: formData,
// //         processData: false,
// //         contentType: false,
// //         beforeSend: function () {
// //             startLoader();
// //         },
// //         success: function (result) {
// //             // displaySuccessMessage(result.message)
// //             Turbo.visit(route("adjustments.index"));
// //         },
// //         error: function (result) {
// //             displayErrorMessage(result.responseJSON.message);
// //         },
// //         complete: function () {
// //             stopLoader();
// //             screenUnLock();
// //         },
// //     });
// // });

// listenClick("#editSaveAsDraftadjustment", function (event) {
//     event.preventDefault();
//             let warehouse_id=$('#edit_adjustment_warehouse').val()
//             let adjustment_date=$('#edit_adjustment_date').val()
//             var data=[]
//             $('#edit_id_adjustment_tbody tr').each(function(){

//                 var rowData = {};
//                 $(this).find('td').each(function(index){
//                     if(index === 0) {
//                         rowData['product_id'] = $(this).text();
//                     }  else if(index === 4) {
//                         rowData['quantity'] = Number($(this).find('input').val());
//                     } else if(index === 5) {
//                         rowData['method_type'] = $(this).find('select').val();
//                     }
//                 });
//                 data.push(rowData);
//             })

//             let formData={}
//             formData['warehouse_id']=warehouse_id
//             formData['date']=new Date(adjustment_date).toISOString()
//             formData['adjustment_items']=data
//             screenLock();
//             $.ajax({
//                 url: $("#adjustmentUpdateUrl").val(),
//                 type: "PUT",
//                 dataType: "json",
//                 data: formData,
//                 beforeSend: function () {
//                     startLoader();
//                 },
//                 success: function (result) {
//                     displaySuccessMessage(result.message)
//                     Turbo.visit(route("adjustments.index"));
//                     adjustment_product=[]
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//                 complete: function () {
//                     stopLoader();
//                     screenUnLock();
//                 },
//             });
// });

// // listen("input", ".qty-adjustment", function () {
// //     let quantity = $(this).val();
// //     if (quantity.length == 8) {
// //         $(this).val(quantity.slice(0, -1));
// //     }
// // });

/***/ }),

/***/ "./resources/assets/js/base-unit/base-unit.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/base-unit/base-unit.js ***!
  \****************************************************/
/***/ (() => {

listenClick('.addBaseUnit', function () {
  $('#addBaseUnitModal').appendTo('body').modal('show');
});
listenSubmit('#addBaseUnitForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('base-units.store'),
    type: 'POST',
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#addBaseUnitModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenHiddenBsModal('#addBaseUnitModal', function () {
  resetModalForm('#addBaseUnitForm', '#validationErrorsBox');
});
listenClick('.base-unit-edit-btn', function (event) {
  var baseUnitId = $(event.currentTarget).attr('data-id');
  baseUnitRenderData(baseUnitId);
});
function baseUnitRenderData(baseUnitId) {
  $.ajax({
    url: route('base-units.edit', baseUnitId),
    type: 'GET',
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editBaseUnitName').val(result.data.name);
        $('#baseUnitId').val(result.data.id);
        $('#editBaseUnitModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
;
listenSubmit('#editBaseUnitForm', function (event) {
  event.preventDefault();
  var baseUnitId = $('#baseUnitId').val();
  $.ajax({
    url: route('base-units.update', baseUnitId),
    type: 'put',
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editBaseUnitModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick('.base-unit-delete-btn', function (event) {
  var baseUnitId = $(event.currentTarget).attr('data-id');
  deleteItem(route('base-units.destroy', baseUnitId), '#baseUnitTbl', "Base Units");
  // Lang.get('messages.units.base_units')
});

/***/ }),

/***/ "./resources/assets/js/brand/brand.js":
/*!********************************************!*\
  !*** ./resources/assets/js/brand/brand.js ***!
  \********************************************/
/***/ (() => {

listenClick('.addBrand', function () {
  $('#addBrandModal').find('#brandImage').css('background-image', 'url("images/brand_logo.png")');
  $('#addBrandModal').appendTo('body').modal('show');
});
listenSubmit('#addBrandForm', function (e) {
  e.preventDefault();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: route('brand.store'),
    method: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#addBrandModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenHiddenBsModal('#addBrandModal', function () {
  resetModalForm('#addBrandForm', '#validationErrorsBox');
});
listenClick('.brand-edit-btn', function (event) {
  var brandId = $(event.currentTarget).attr('data-id');
  brandRenderData(brandId);
});
function brandRenderData(brandId) {
  $.ajax({
    url: route('brand.edit', brandId),
    type: 'GET',
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editBrandName').val(result.data.name);
        $('#brandId').val(result.data.id);
        if (result.data.image_url !== '') {
          $('#editBrandModal').find('#brandImage').css('background-image', 'url(' + result.data.image_url + ')');
        }
        $('#editBrandModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
;
listenSubmit('#editBrandForm', function (event) {
  event.preventDefault();
  var brandId = $('#brandId').val();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: route('brand.update', brandId),
    method: 'post',
    //data : $(this).serialize(),
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editBrandModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick('.brand-delete-btn', function (event) {
  var brandId = $(event.currentTarget).attr('data-id');
  deleteItem(route('brand.destroy', brandId), '#brandTbl', "Brands");
  // Lang.get('messages.units.base_units')
});

/***/ }),

/***/ "./resources/assets/js/category/category.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/category/category.js ***!
  \**************************************************/
/***/ (() => {

listenClick('.addCategory', function () {
  $('#addCategoryModal').find('#categoryImage').css('background-image', 'url("images/productCategory_logo.jpeg")');
  $('#addCategoryModal').appendTo('body').modal('show');
});
listenSubmit('#addCategoryForm', function (e) {
  e.preventDefault();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: route('category.store'),
    type: 'POST',
    //data: $(this).serialize(),
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#addCategoryModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenHiddenBsModal('#addCategoryModal', function () {
  resetModalForm('#addCategoryForm', '#validationErrorsBox');
});
listenClick('.category-edit-btn', function (event) {
  var categoryId = $(event.currentTarget).attr('data-id');
  categoryRenderData(categoryId);
});
function categoryRenderData(categoryId) {
  $.ajax({
    url: route('category.edit', categoryId),
    type: 'GET',
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editCategoryName').val(result.data.name);
        $('#categoryId').val(result.data.id);
        if (result.data.image_url !== '') {
          $('#editCategoryModal').find('#categoryImage').css('background-image', 'url(' + result.data.image_url + ')');
        }
        $('#editCategoryModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
;
listenSubmit('#editCategoryForm', function (event) {
  event.preventDefault();
  var categoryId = $('#categoryId').val();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: route('category.update', {
      category: categoryId
    }),
    type: 'post',
    //data: $(this).serialize(),
    data: formData,
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editCategoryModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick('.category-delete-btn', function (event) {
  var categoryId = $(event.currentTarget).attr('data-id');
  deleteItem(route('category.destroy', categoryId), '#categoryTbl', Lang.get('messages.category.category'));
});

/***/ }),

/***/ "./resources/assets/js/client/client.js":
/*!**********************************************!*\
  !*** ./resources/assets/js/client/client.js ***!
  \**********************************************/
/***/ (() => {

listenClick('.client-delete-btn', function (event) {
  var recordId = $(event.currentTarget).attr('data-id');
  var callFunction = arguments.length > 3 && arguments3 !== undefined ? arguments3 : null;
  header = Lang.get('messages.client.client');
  swal({
    title: Lang.get("messages.common.delete") + " !",
    text: Lang.get("messages.common.are_you_sure_delete") + ' "' + header + '" ?',
    buttons: [Lang.get("messages.common.no_cancel"), Lang.get("messages.common.yes_delete")],
    icon: sweetAlertIcon
  }).then(function (willDelete) {
    if (willDelete) {
      $.ajax({
        url: route('clients.destroy', recordId),
        type: "DELETE",
        dataType: "json",
        data: {
          clientWithInvoices: true
        },
        success: function success(obj) {
          if (obj.success) {
            window.livewire.emit("refreshDatatable");
            window.livewire.emit("resetPageTable");
          }
          swal({
            icon: "success",
            title: Lang.get("messages.common.deleted"),
            text: header + " " + Lang.get("messages.common.has_been_deleted"),
            timer: 2000,
            button: Lang.get("messages.common.ok")
          });
          if (callFunction) {
            eval(callFunction);
          }
        },
        error: function error(data) {
          swal({
            title: Lang.get("messages.common.delete") + " !",
            text: Lang.get("messages.flash.are_sure_want_to_delete_this_client_related_all_invoices"),
            buttons: [Lang.get("messages.common.no_cancel"), Lang.get("messages.common.yes_delete")],
            icon: sweetAlertIcon
          }).then(function (willDelete) {
            if (willDelete) {
              $.ajax({
                url: route('clients.destroy', recordId),
                type: "DELETE",
                dataType: "json",
                success: function success(obj) {
                  if (obj.success) {
                    window.livewire.emit("refreshDatatable");
                    window.livewire.emit("resetPageTable");
                  }
                  swal({
                    icon: "success",
                    title: Lang.get("messages.common.deleted"),
                    text: header + " " + Lang.get("messages.common.has_been_deleted"),
                    timer: 2000,
                    button: Lang.get("messages.common.ok")
                  });
                  if (callFunction) {
                    eval(callFunction);
                  }
                },
                error: function error(data) {}
              });
            }
          });
        }
      });
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/client/create-edit.js":
/*!***************************************************!*\
  !*** ./resources/assets/js/client/create-edit.js ***!
  \***************************************************/
/***/ (() => {

document.addEventListener('turbo:load', createEditClient);
function createEditClient() {
  $('.search-email-list').addClass('d-none');
  loadSelect2Dropdown();
}
function loadSelect2Dropdown() {
  var countyIdDropdownSelector = $('#countryID');
  if (!countyIdDropdownSelector.length) {
    return false;
  }
  if ($('#countryID').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#stateID').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  $('#countryID, #stateID').select2({
    width: '100%'
  });
}
listenChange('#countryId', function () {
  $.ajax({
    url: route('states-list'),
    type: 'get',
    dataType: 'json',
    data: {
      countryId: $(this).val()
    },
    success: function success(data) {
      $('#stateId').empty();
      $('#cityId').empty();
      $('#stateId').select2({
        placeholder: 'Select State',
        allowClear: false
      });
      $('#cityId').select2({
        placeholder: 'Select City',
        allowClear: false
      });
      $('#stateId').append($('<option value=""></option>').text('Select State'));
      $.each(data.data, function (i, v) {
        $('#stateId').append($('<option></option>').attr('value', i).text(v));
      });
      if ($('#isEdit').val() && $('#stateId').val()) {
        $('#stateId').val($('#stateId').val()).trigger('change');
      }
    }
  });
});
listenChange('#stateId', function () {
  $.ajax({
    url: route('cities-list'),
    type: 'get',
    dataType: 'json',
    data: {
      stateId: $(this).val(),
      country: $('#countryId').val()
    },
    success: function success(data) {
      $('#cityId').empty();
      $('#cityId').select2({
        placeholder: 'Select City',
        allowClear: false
      });
      $.each(data.data, function (i, v) {
        $('#cityId').append($('<option></option>').attr('value', i).text(v));
      });
      if ($('#isEdit').val() && $('#cityId').val()) {
        $('#cityId').val($('#cityId').val()).trigger('change');
      }
    }
  });
});
listenClick('.remove-image', function () {
  defaultAvatarImagePreview('#previewImage', 1);
});
listenSubmit('#clientForm, #editClientForm', function () {
  if ($('#error-msg').text() !== '') {
    $('#phoneNumber').focus();
    return false;
  }
});
function setEditCountryId() {
  var isEditForm = $('#isEdit');
  if (!isEditForm.length) {
    return false;
  }
  if ($('#isEdit').val() && $('#countryId').val()) {
    $('#countryId').val($('#countryId').val()).trigger('change');
  }
}
listenKeyup('.search-email', function () {
  var enterEmail = $(this).val().trim();
  var editEmail = $('.edit-time-email').val();
  if ($(this).hasClass('edit-time-search') && editEmail == enterEmail) {
    $('.search-email-list').addClass('d-none');
    $('.user-first-name, .user-last-name, .password, .c-password, .user-contact-number, .website, .postal-code, .address, .note').prop('readonly', false);
    $('.city, .state, .country').prop('disabled', false);
    if (enterEmail.length == 0) {
      $('#editUserEmail').val(editEmail);
      $('.city, .state, .country').val('').trigger('change');
    }
    return false;
  }
  if (enterEmail.length) {
    renderUserSearchEmailData(enterEmail);
  } else {
    $('.search-email-list').addClass('d-none');
    $('.user-first-name, .user-last-name, .password, .c-password, .user-contact-number, .website, .postal-code, .address, .note').prop('readonly', false);
    $('.city, .state, .country').prop('disabled', false);
    if (isEmpty($('.user-first-name').val()) || isEmpty($('.user-last-name').val())) {
      $('.user-first-name, .user-last-name').val('');
    }
    $('.password, .c-password, .user-contact-number, .website, .postal-code, .address, .note').val('');
    $('.city, .state, .country').val('').trigger('change');
  }
});
function renderUserSearchEmailData(enterEmail) {
  $('.search-email-list').html('');
  $.ajax({
    url: route('search.users', [enterEmail]),
    type: 'GET',
    success: function success(result) {
      $('.search-email-list').removeClass('d-none');
      $('.user-first-name, .user-last-name, .password, .c-password, .user-contact-number, .website, .postal-code, .address, .note').prop('readonly', false);
      $('.city, .state, .country').prop('disabled', false);
      if (result.data.length == 0) {
        if (isEmpty($('.user-first-name').val()) || isEmpty($('.user-last-name').val())) {
          $('.user-first-name, .user-last-name').val('');
        }
        $('.password, .c-password, .user-contact-number, .website, .postal-code, .address, .note').val('');
        $('.city, .state, .country').val('').trigger('change');
        $('.search-email-list').html("<li><a href=\"javascript:void(0)\" class=\"text-decoration-none cursor-default text-gray-900\" data-turbo=\"false\">No result found.</a></li>");
      } else {
        $('.user-first-name, .user-last-name, .password, .c-password, .user-contact-number, .website, .postal-code, .address, .note').prop('readonly', true);
        $('.city, .state, .country').prop('disabled', true);
        $('.search-email-list').html('');
        $.each(result.data, function (i, val) {
          $('.search-email-list').append($("<li class=\"email-confirm-popup\" data-id=\"".concat(val.id, "\"><a href=\"#\" class=\"text-decoration-none\" data-turbo=\"false\">").concat(val.email, "</a></li>")));
        });
        $('.search-email-list').show().focus().click();
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
listen('click', '.email-confirm-popup', function (event) {
  $('.search-email-list').hide();
  var userId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: route('get.user', [userId]),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var user = result.data;
        $('.user-first-name').val(user.first_name);
        $('.user-last-name').val(user.last_name);
        if (!isEmpty(user.contact)) {
          phoneNo = user.region_code + user.contact;
          $('.user-contact-number').val(user.contact).trigger('change');
          $('#prefix_code').val(user.region_code);
        }
        $('.user-email').val(user.email);
        $('.previewImage').attr('style', 'background-image:url(' + user.profile_image + ')');
        $('.website').val(user.client.website);
        $('.postal-code').val(user.client.postal_code);
        $('.address').val(user.client.address);
        $('.note').val(user.client.note);
        $('.country').val(user.client.country_id).trigger('change');
        setTimeout(function () {
          $('.state').val(user.client.state_id).trigger('change');
        }, 500);
        setTimeout(function () {
          $('.city').val(user.client.city_id).trigger('change');
        }, 1000);
        $('.search-email-list').removeClass('d-none');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.message);
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/client/invoice.js":
/*!***********************************************!*\
  !*** ./resources/assets/js/client/invoice.js ***!
  \***********************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadClientInvoicePage);
function loadClientInvoicePage() {
  if (!$('#invoices-tab').length) {
    return false;
  }
  var tabParameter = $('#activeTabOfClient').val();
  $('.nav-item button[data-bs-target="#' + tabParameter + '"]').click();
}

/***/ }),

/***/ "./resources/assets/js/client_panel/invoice/invoice.js":
/*!*************************************************************!*\
  !*** ./resources/assets/js/client_panel/invoice/invoice.js ***!
  \*************************************************************/
/***/ (() => {

document.addEventListener("turbo:load", loadCPInvoice);
function loadCPInvoice() {
  initializeSelect2CPInvoice();
  initializeSelect2Payment();

  // resetModalForm('#clientPaymentForm', '#error');
  $(".amount").hide();
  var paymentMode = 1;
  var uri = window.location.toString();
  if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?"));
    window.history.replaceState({}, document.title, clean_uri);
  }
}
listenChange("#payment_mode", function () {
  if ($(this).val() == 1) {
    $(".payment-attachment").removeClass("d-none");
  } else {
    $(".payment-attachment").addClass("d-none");
  }
});
function initializeSelect2CPInvoice() {
  if (!select2NotExists("#status_filter")) {
    return false;
  }
  removeSelect2Container(["#status_filter", "#payment_type", "#payment_mode"]);
  $("#status_filter").select2({
    placeholder: "All"
  });
  if ($("#status").val() == "") {
    $("#status_filter").val(5).trigger("change");
  }
}
function initializeSelect2Payment() {
  //Invoice Payments
  // $('#payment_type').select2();
  // $('#payment_mode').select2();
  $("#payment_type").select2({
    placeholder: selectPaymentTypeLang
    // dropdownParent: $('#clientPaymentModal'),
  });
  $("#payment_mode").select2({
    placeholder: selectPaymentModeLang
    // dropdownParent: $('#clientPaymentModal'),
  });
}
listenClick("#resetFilter", function () {
  $("#status_filter").val(5).trigger("change");
  $("#status_filter").select2({
    placeholder: "All"
  });
});
listenChange("#payment_mode", function () {
  var value = $(this).val();
  if (value == 1) {
    $("#transaction").show();
  } else {
    $("#transaction").hide();
  }
});
listenChange("#payment_type", function () {
  var value = $(this).val();
  var full_payment = $("#payable_amount").val();
  if (value == "2") {
    $(".amount").hide();
    $("#amount").val(full_payment);
    $("#amount").prop("readonly", true);
  } else if (value == "3") {
    $(".amount").show();
    $("#amount").val("");
    $("#amount").prop("readonly", false);
  } else {
    $(".amount").hide();
    $("#amount").prop("readonly", false);
  }
});
listenKeyup("#amount", function () {
  var payable_amount = parseFloat($("#payable_amount").val());
  var amount = parseFloat($("#amount").val());
  var paymentType = parseInt($("#payment_type").val());
  if (paymentType === 3 && payable_amount < amount) {
    $("#error-msg").text("Amount should be less than payable amount");
    $("#btnPay").addClass("disabled");
  } else if (paymentType === 2 && payable_amount < amount) {
    $("#error-msg").text("Amount should be less than payable amount");
    $("#btnPay").addClass("disabled");
  } else {
    $("#error-msg").text("");
    $("#btnPay").removeClass("disabled");
  }
});
listenSubmit("#clientPaymentForm", function () {
  if ($("#error-msg").text() !== "") {
    return false;
  }
});
listenChange("#payment_mode", function () {
  paymentMode = $(this).val();
  parseInt(paymentMode);
});
listenSubmit("#clientPaymentForm", function (e) {
  var _this = this;
  if ($("#payment_note").val().trim().length == 0) {
    displayErrorMessage("Note field is Required");
    return false;
  }
  e.preventDefault();
  var btnSubmitEle = $(this).find("#btnPay");
  setAdminBtnLoader(btnSubmitEle);
  var payloadData = {
    amount: parseFloat($("#amount").val()),
    invoiceId: parseInt($("#invoice_id").val()),
    notes: $("#payment_note").val()
  };
  if (paymentMode == 1) {
    $.ajax({
      url: route("client.payments.store"),
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function success(result) {
        if (result.success) {
          // $('#clientPaymentModal').modal('hide');
          displaySuccessMessage(result.message);
          livewire.emit("refreshDatatable");
          livewire.emit("resetPageTable");
          window.location.href = route("client.invoices.index");
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        setAdminBtnLoader(btnSubmitEle);
      }
    });
  } else if (paymentMode == 2) {
    $.post(invoiceStripePaymentUrl, payloadData).done(function (result) {
      var sessionId = result.data.sessionId;
      stripe.redirectToCheckout({
        sessionId: sessionId
      }).then(function (result) {
        $(this).html("Make Payment").removeClass("disabled");
        manageAjaxErrors(result);
      });
    })["catch"](function (error) {
      $(_this).html("Make Payment").removeClass("disabled");
      manageAjaxErrors(error);
    });
  } else if (paymentMode == 3) {
    $.ajax({
      type: "GET",
      url: route("client.paypal.init"),
      data: {
        amount: payloadData.amount,
        invoiceId: payloadData.invoiceId,
        notes: payloadData.notes
      },
      success: function success(result) {
        if (result.status == "CREATED") {
          var redirectTo = "";
          $.each(result.links, function (key, val) {
            if (val.rel == "approve") {
              redirectTo = val.href;
            }
          });
          location.href = redirectTo;
        } else {
          location.href = result.url;
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        setAdminBtnLoader(btnSubmitEle);
      }
    });
  } else if (paymentMode == 5) {
    $.ajax({
      type: "GET",
      url: route("razorpay.init"),
      data: $(this).serialize(),
      success: function success(result) {
        if (result.success) {
          $("#clientPaymentModal").modal("hide");
          var _result$data = result.data,
            id = _result$data.id,
            amount = _result$data.amount,
            name = _result$data.name,
            email = _result$data.email,
            invoiceId = _result$data.invoiceId,
            invoice_id = _result$data.invoice_id,
            notes = _result$data.notes;
          options.description = JSON.stringify({
            invoice_id: invoice_id,
            notes: notes
          });
          options.order_id = id;
          options.amount = amount;
          options.prefill.name = name;
          options.prefill.email = email;
          options.prefill.invoiceId = invoiceId;
          var razorPay = new Razorpay(options);
          razorPay.open();
          razorPay.on("payment.failed");
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        setAdminBtnLoader(btnSubmitEle);
      }
    });
  }
});

/***/ }),

/***/ "./resources/assets/js/client_panel/quotes/create-edit.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/client_panel/quotes/create-edit.js ***!
  \****************************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditQuote);
function loadCreateEditQuote() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditQuote();
  loadSelect2ClientData();
  momentFormat = convertToMomentFormat(currentDateFormat);
  if (!isEmpty($("#quoteNoteData").val()) || !isEmpty($("#quoteTermData").val())) {
    $("#quoteAddNote").hide();
    $("#quoteRemoveNote").show();
    $("#quoteNoteAdd").show();
    $("#quoteTermRemove").show();
  } else {
    $("#quoteRemoveNote").hide();
    $("#quoteNoteAdd").hide();
    $("#quoteTermRemove").hide();
  }
  if ($("#quoteRecurring").val() == true) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
  if ($("#discountType").val() != 0) {
    $("#discount").removeAttr("disabled");
  } else {
    $("#discount").attr("disabled", "disabled");
  }
  calculateAndSetQuoteAmount();
}
function loadSelect2ClientData() {
  if (!$("#discountType").length) {
    return;
  }
  $("#discountType,#status,#templateId").select2();
}
function initializeSelect2CreateEditQuote() {
  if (!select2NotExists(".client-product-quote")) {
    return false;
  }
  removeSelect2Container([".client-product-quote"]);
  $(".client-product-quote").select2({
    tags: true
  });
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  $("#client_id").focus();
  var todayDate = moment().format(convertToMomentFormat(currentDateFormat));
  var quoteDueDateFlatPicker = $("#clientQuoteDueDate").flatpickr({
    defaultDate: todayDate,
    dateFormat: currentDateFormat,
    locale: getUserLanguages
  });
  var editClientQuoteDueDate = moment($("#clientEditQuoteDueDate").val()).format(convertToMomentFormat(currentDateFormat));
  var clientEditQuoteDueDateFlatPicker = $("#clientEditQuoteDueDate").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editClientQuoteDueDate,
    locale: getUserLanguages
  });
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  $("#client_quote_date").flatpickr({
    defaultDate: todayDate,
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#client_quote_date").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#client_quote_date").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
  var editClientQuoteDate = moment($("#clientEditQuoteDate").val()).format(convertToMomentFormat(currentDateFormat));
  $("#clientEditQuoteDate").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editClientQuoteDate,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#clientEditQuoteDate").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#clientEditQuoteDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof clientEditQuoteDueDateFlatPicker != "undefined") {
        clientEditQuoteDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      var minDate2;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate2 = moment($("#clientEditQuoteDate").val(), convertToMomentFormat(currentDateFormat)).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      } else {
        minDate2 = moment($("#clientEditQuoteDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof clientEditQuoteDueDateFlatPicker != "undefined") {
        clientEditQuoteDueDateFlatPicker.set("minDate", minDate2);
      }
    }
  });
}
listenKeyup("#quoteId", function () {
  return $("#quoteId").val(this.value.toUpperCase());
});
listenClick("#quoteAddNote", function () {
  $("#quoteAddNote").hide();
  $("#quoteRemoveNote").show();
  $("#quoteNoteAdd").show();
  $("#quoteTermRemove").show();
});
listenClick("#quoteRemoveNote", function () {
  $("#quoteAddNote").show();
  $("#quoteRemoveNote").hide();
  $("#quoteNoteAdd").hide();
  $("#quoteTermRemove").hide();
  $("#quoteNote").val("");
  $("#quoteTerm").val("");
  $("#quoteAddNote").show();
});
listenClick("#formData_recurring-0", function () {
  if ($("#formData_recurring-0").prop("checked")) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
});
listenClick("#formData_recurring-1", function () {
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
});
listenChange("#discountType", function () {
  discountType = $(this).val();
  $("#discount").val(0);
  if (discountType == 1 || discountType == 2) {
    $("#discount").removeAttr("disabled");
    if (discountType == 2) {
      var value = $("#discount").val();
      $("#discount").val(value.substring(0, 2));
    }
  } else {
    $("#discount").attr("disabled", "disabled");
    $("#discount").val(0);
    $("#quoteDiscountAmount").text("0");
  }
  calculateDiscount();
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenClick("#addClientQuoteItem", function () {
  var data = {
    products: JSON.parse($("#products").val())
  };
  var quoteItemHtml = prepareTemplateRender("#quotesItemTemplate", data);
  $(".quote-item-container").append(quoteItemHtml);
  $(".productId").select2({
    placeholder: "Select Product or Enter free text",
    tags: true
  });
  resetQuoteItemIndex();
});
var resetQuoteItemIndex = function resetQuoteItemIndex() {
  var index = 1;
  $(".quote-item-container>tr").each(function () {
    $(this).find(".item-number").text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      products: JSON.parse($("#products").val())
    };
    var quoteItemHtml = prepareTemplateRender("#quotesItemTemplate", data);
    $(".quote-item-container").append(quoteItemHtml);
    $(".productId").select2();
  }
};
listenClick(".delete-quote-item", function () {
  $(this).parents("tr").remove();
  resetQuoteItemIndex();
  calculateAndSetQuoteAmount();
});
listenChange(".client-product-quote", function () {
  var productId = $(this).val();
  if (isEmpty(productId)) {
    productId = 0;
  }
  var element = $(this);
  $.ajax({
    url: route("quotes.get-product", productId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        var price = "";
        $.each(result.data, function (id, productPrice) {
          if (id === productId) price = productPrice;
        });
        element.parent().parent().find("td .price-quote").val(price);
        element.parent().parent().find("td .qty-quote").val(1);
        $(".price-quote").trigger("keyup");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenKeyup(".qty-quote", function () {
  var qty = parseFloat($(this).val());
  var rate = $(this).parent().siblings().find(".price-quote").val();
  rate = parseFloat(removeCommas(rate));
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".quote-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetQuoteAmount();
});
listenKeyup(".price-quote", function () {
  var rate = $(this).val();
  rate = parseFloat(removeCommas(rate));
  var qty = parseInt($(this).parent().siblings().find(".qty-quote").val());
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".quote-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetQuoteAmount();
});
var calculateAmount = function calculateAmount(qty, rate) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    return price;
  } else {
    return 0;
  }
};
var calculateAndSetQuoteAmount = function calculateAndSetQuoteAmount() {
  var quoteTotalAmount = 0;
  $(".quote-item-container>tr").each(function () {
    var quoteItemTotal = $(this).find(".quote-item-total").text();
    quoteItemTotal = removeCommas(quoteItemTotal);
    quoteItemTotal = isEmpty($.trim(quoteItemTotal)) ? 0 : parseFloat(quoteItemTotal);
    quoteTotalAmount += quoteItemTotal;
  });
  quoteTotalAmount = parseFloat(quoteTotalAmount);
  if (isNaN(quoteTotalAmount)) {
    quoteTotalAmount = 0;
  }
  $("#quoteTotal").text(addCommas(quoteTotalAmount.toFixed(2)));

  //set hidden input value
  $("#quoteTotalAmount").val(quoteTotalAmount);
  calculateDiscount();
};
var calculateDiscount = function calculateDiscount() {
  var discount = $("#discount").val();
  discountType = $("#discountType").val();
  var itemAmount = [];
  var i = 0;
  $(".quote-item-total").each(function () {
    itemAmount[i++] = $.trim(removeCommas($(this).text()));
  });
  $.sum = function (arr) {
    var r = 0;
    $.each(arr, function (i, v) {
      r += +v;
    });
    return r;
  };
  var totalAmount = $.sum(itemAmount);
  $("#quoteTotal").text(number_format(totalAmount));
  if (isEmpty(discount) || isEmpty(totalAmount)) {
    discount = 0;
  }
  var discountAmount = 0;
  var finalAmount = totalAmount - discountAmount;
  if (discountType == 1) {
    discountAmount = discount;
    finalAmount = totalAmount - discountAmount;
  } else if (discountType == 2) {
    discountAmount = totalAmount * discount / 100;
    finalAmount = totalAmount - discountAmount;
  }
  $("#quoteFinalAmount").text(number_format(finalAmount));
  $("#quoteTotalAmount").val(finalAmount.toFixed(2));
  $("#quoteDiscountAmount").text(number_format(discountAmount));
};
listen("keyup", "#discount", function () {
  var value = $(this).val();
  if (discountType == 2 && value > 100) {
    displayErrorMessage("On Percentage you can only give maximum 100% discount");
    $(this).val(value.slice(0, -1));
    return false;
  }
  calculateDiscount();
});
listenClick("#saveAsDraftClientQuote", function (event) {
  event.preventDefault();
  var quoteStates = $(this).data("status");
  var myForm = document.getElementById("clientQuoteForm");
  var formData = new FormData(myForm);
  formData.append("status", quoteStates);
  screenLock();
  $.ajax({
    url: route("client.quotes.store"),
    type: "POST",
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      Turbo.visit(route("client.quotes.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick("#editSaveClientQuote", function (event) {
  event.preventDefault();
  var quoteStatus = $(this).data("status");
  var formData = $("#clientQuoteEditForm").serialize() + "&quoteStatus=" + quoteStatus;
  screenLock();
  $.ajax({
    url: $("#clientQuoteUpdateUrl").val(),
    type: "PUT",
    dataType: "json",
    data: formData,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      Turbo.visit(route("client.quotes.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/client_panel/quotes/quote.js":
/*!**********************************************************!*\
  !*** ./resources/assets/js/client_panel/quotes/quote.js ***!
  \**********************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadQuote);
function loadQuote() {
  initializeSelect2Quote();
}
function initializeSelect2Quote() {
  if (!select2NotExists('#status_filter')) {
    return false;
  }
  removeSelect2Container(['#status_filter']);
  $('#status_filter').select2({
    placeholder: 'All'
  });
  if ($('#status').val() == '') {
    $('#status_filter').val(5).trigger('change');
  }
}
listenClick('.client-quote-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('client.quotes.destroy', id), 'quote', Lang.get('messages.quote.quote'));
});
listenClick('#resetFilter', function () {
  $('#status_filter').val(5).trigger('change');
  $('#status_filter').select2({
    placeholder: 'All'
  });
});

/***/ }),

/***/ "./resources/assets/js/client_panel/transaction/transaction.js":
/*!*********************************************************************!*\
  !*** ./resources/assets/js/client_panel/transaction/transaction.js ***!
  \*********************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadCPTransaction);
function loadCPTransaction() {
  initializeSelect2CPTransaction();
}
function initializeSelect2CPTransaction() {
  if (!select2NotExists('#paymentModeFilter')) {
    return false;
  }
  removeSelect2Container(["#paymentModeFilter"]);
}
listenClick('#resetFilter', function () {
  $('#paymentModeFilter').select2({
    placeholder: 'Select Payment Method',
    allowClear: false
  });
  $('#paymentModeFilter').val(0).trigger('change');
});

/***/ }),

/***/ "./resources/assets/js/contact_enquiry/contact_enquiry.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/contact_enquiry/contact_enquiry.js ***!
  \****************************************************************/
/***/ (() => {

"use strict";


toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': false,
  'progressBar': true,
  'positionClass': 'toast-top-right',
  'preventDuplicates': false,
  'onclick': null,
  'showDuration': '300',
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};
$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
});
$(document).on('submit', '#contactEnquiryForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('super.admin.enquiry.store'),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        toastr.success(result.message);
        $('#contactEnquiryForm')[0].reset();
      } else {
        toastr.error(result.message);
      }
    },
    error: function error(result) {
      toastr.error(result.responseJSON.message);
      $('#contactEnquiryForm')[0].reset();
    }
  });
});
$(document).on('click', '#subscribeBtn', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('subscribe.store'),
    type: 'POST',
    data: $('#subscribe-form').serialize(),
    success: function success(result) {
      if (result.success) {
        toastr.success(result.message);
        $('#subscribe-form')[0].reset();
      }
    },
    error: function error(result) {
      toastr.error(result.responseJSON.message);
      $('#subscribe-form')[0].reset();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/currency/currency.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/currency/currency.js ***!
  \**************************************************/
/***/ (() => {

listenClick('.addCurrency', function () {
  $('#addCurrencyModal').appendTo('body').modal('show');
});
listenSubmit('#addCurrencyForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('currencies.store'),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        $('#addCurrencyModal').modal('hide');
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#currencyTbl').DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenHiddenBsModal('#addCurrencyModal', function () {
  resetModalForm('#addCurrencyForm', '#validationErrorsBox');
});
listenClick('.currency-edit-btn', function (event) {
  var currencyId = $(event.currentTarget).attr('data-id');
  currencyRenderData(currencyId);
});
function currencyRenderData(currencyId) {
  $.ajax({
    url: route('currencies.edit', currencyId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#editCurrencyName').val(result.data.name);
        $('#editCurrencyIcon').val(result.data.icon);
        $('#editCurrencyCode').val(result.data.code);
        $('#currencyId').val(result.data.id);
        $('#editCurrencyModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
;
listenSubmit('#editCurrencyForm', function (event) {
  event.preventDefault();
  var id = $('#currencyId').val();
  $.ajax({
    url: route('currencies.update', {
      currency: id
    }),
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#editCurrencyModal').modal('hide');
        $('#currencyTbl').DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick('.currency-delete-btn', function (event) {
  var currencyId = $(event.currentTarget).attr('data-id');
  deleteItem(route('currencies.destroy', currencyId), '#currencyTbl', Lang.get('messages.currency.currency'));
});

/***/ }),

/***/ "./resources/assets/js/custom/custom.js":
/*!**********************************************!*\
  !*** ./resources/assets/js/custom/custom.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var source = null;
var jsrender = __webpack_require__(/*! jsrender */ "./node_modules/jsrender/jsrender.js");
__webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/alpine.js");
document.addEventListener("turbo:load", initAllComponents);
function initAllComponents() {
  refreshCsrfToken();
  select2initialize();
  modalInputFocus();
  alertInitialize();
  IOInitImageComponent();
  IOInitSidebar();
  togglePassword();
  tooltip();
  resizeWindow();
}
function togglePassword() {
  $('[data-toggle="password"]').each(function () {
    var input = $(this);
    var eye_btn = $(this).parent().find(".input-icon");
    eye_btn.css("cursor", "pointer").addClass("input-password-hide");
    eye_btn.on("click", function () {
      if (eye_btn.hasClass("input-password-hide")) {
        eye_btn.removeClass("input-password-hide").addClass("input-password-show");
        eye_btn.find(".bi").removeClass("bi-eye-slash-fill").addClass("bi-eye-fill");
        input.attr("type", "text");
      } else {
        eye_btn.removeClass("input-password-show").addClass("input-password-hide");
        eye_btn.find(".bi").removeClass("bi-eye-fill").addClass("bi-eye-slash-fill");
        input.attr("type", "password");
      }
    });
  });
}
function alertInitialize() {
  $(".alert").delay(5000).slideUp(300);
}
function select2initialize() {
  $('[data-control="select2"]').each(function () {
    $(this).select2();
  });
  $("#changeUserId").select2();
}
function refreshCsrfToken() {
  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    }
  });
}
window.addEventListener("turbo:load", function (event) {
  $('input:text:not([readonly="readonly"]):not([name="search"]):not(.front-input):not(.removeFocus)').first().focus();
});
var modalInputFocus = function modalInputFocus() {
  $(function () {
    $(".modal").on("shown.bs.modal", function () {
      if ($(this).find("input:text")[0]) {
        $(this).find("input:text")[0].focus();
      }
    });
  });
};
window.ajaxCallInProgress = function () {
  ajaxCallIsRunning = true;
};
window.ajaxCallCompleted = function () {
  ajaxCallIsRunning = false;
};
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};
window.resetModalForm = function (formId, validationBox) {
  if ($(formId)[0] == null) {
    return false;
  }
  $(formId)[0].reset();
  $("select.select2Selector").each(function (index, element) {
    var drpSelector = "#" + $(this).attr("id");
    $(drpSelector).val("");
    $(drpSelector).trigger("change");
  });
  $(validationBox).hide();
};
window.printErrorMessage = function (selector, errorResult) {
  $(selector).show().html("");
  $(selector).text(errorResult.responseJSON.message);
};
window.manageAjaxErrors = function (data) {
  var errorDivId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "editValidationErrorsBox";
  if (data.status == 404) {
    toastr.error(data.responseJSON.message);
  } else {
    printErrorMessage("#" + errorDivId, data);
  }
};
window.displaySuccessMessage = function (message) {
  toastr.success(message);
};
window.displayErrorMessage = function (message) {
  toastr.error(message);
};
window.deleteItem = function (url, tableId, header) {
  var _arguments = arguments;
  var callFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return function (callFunction) {
    var callFunction = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : null;
    swal({
      title: Lang.get("messages.common.delete") + " !",
      text: Lang.get("messages.common.are_you_sure_delete") + ' "' + header + '" ?',
      buttons: [Lang.get("messages.common.no_cancel"), Lang.get("messages.common.yes_delete")],
      icon: sweetAlertIcon
    }).then(function (willDelete) {
      if (willDelete) {
        deleteItemAjax(url, header, callFunction);
      }
    });
  }(callFunction);
};
function deleteItemAjax(url, header) {
  var callFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  $.ajax({
    url: url,
    type: "DELETE",
    dataType: "json",
    success: function success(obj) {
      if (obj.success) {
        window.livewire.emit("refreshDatatable");
        window.livewire.emit("resetPageTable");
      }
      swal({
        icon: "success",
        title: Lang.get("messages.common.deleted"),
        text: header + " " + Lang.get("messages.common.has_been_deleted"),
        timer: 2000,
        button: Lang.get("messages.common.ok")
      });
      if (callFunction) {
        eval(callFunction);
      }
    },
    error: function error(data) {
      swal({
        title: Lang.get("messages.common.error"),
        icon: "error",
        text: data.responseJSON.message,
        type: "error",
        timer: 4000,
        button: Lang.get("messages.common.ok")
      });
    }
  });
}
window.format = function (dateTime) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DD-MMM-YYYY";
  return moment(dateTime).format(format);
};
window.prepareTemplateRender = function (templateSelector, data) {
  var template = jsrender.templates(templateSelector);
  return template.render(data);
};
window.isValidFile = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split(".").pop().toLowerCase();
  if ($.inArray(ext, ["gif", "png", "jpg", "jpeg"]) == -1) {
    $(inputSelector).val("");
    $(validationMessageSelector).removeClass("d-none");
    $(validationMessageSelector).html("The image must be a file of type: jpeg, jpg, png.").show();
    $(validationMessageSelector).delay(5000).slideUp(300);
    return false;
  }
  $(validationMessageSelector).hide();
  return true;
};
window.removeCommas = function (str) {
  if (str === undefined) {
    return str;
  }
  return str.replace(/,/g, "");
};
window.DatetimepickerDefaults = function (opts) {
  return $.extend({}, {
    sideBySide: true,
    ignoreReadonly: true,
    icons: {
      close: "fa fa-times",
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down",
      previous: "fa fa-chevron-left",
      next: "fa fa-chevron-right",
      today: "fa fa-clock-o",
      clear: "fa fa-trash-o"
    }
  }, opts);
};
window.isEmpty = function (value) {
  return value === undefined || value === null || value === "";
};
window.screenLock = function () {
  $("#overlay-screen-lock").show();
  $("body").css({
    "pointer-events": "none",
    opacity: "0.6"
  });
};
window.screenUnLock = function () {
  $("body").css({
    "pointer-events": "auto",
    opacity: "1"
  });
  $("#overlay-screen-lock").hide();
};
window.processingBtn = function (selecter, btnId) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var loadingButton = $(selecter).find(btnId);
  if (state === "loading") {
    loadingButton.button("loading");
  } else {
    loadingButton.button("reset");
  }
};
window.setAdminBtnLoader = function (btnLoader) {
  if (btnLoader.attr("data-loading-text")) {
    btnLoader.html(btnLoader.attr("data-loading-text")).prop("disabled", true);
    btnLoader.removeAttr("data-loading-text");
    return;
  }
  btnLoader.attr("data-old-text", btnLoader.text());
  btnLoader.html(btnLoader.attr("data-new-text")).prop("disabled", false);
};
window.onload = function () {
  window.startLoader = function () {
    $(".infy-loader").show();
  };
  window.stopLoader = function () {
    $(".infy-loader").hide();
  };

  // infy loader js
  stopLoader();
};
$(document).ready(function () {
  // script to active parent menu if sub menu has currently active
  var hasActiveMenu = $(document).find(".nav-item.dropdown ul li").hasClass("active");
  if (hasActiveMenu) {
    $(document).find(".nav-item.dropdown ul li.active").parent("ul").css("display", "block");
    $(document).find(".nav-item.dropdown ul li.active").parent("ul").parent("li").addClass("active");
  }
  $(document).on("click", "#kt_aside_toggle", function () {
    $(".sidebar-search-box").toggleClass("show");
  });
});
window.urlValidation = function (value, regex) {
  var urlCheck = value == "" ? true : value.match(regex) ? true : false;
  if (!urlCheck) {
    return false;
  }
  return true;
};
if ($(window).width() > 992) {
  $(document).on("click", ".no-hover", function () {
    $(this).toggleClass("open");
  });
}
listen("click", "#register", function (e) {
  e.preventDefault();
  $(".open #dropdownLanguage").trigger("click");
  $(".open #dropdownLogin").trigger("click");
});
listen("click", "#language", function (e) {
  e.preventDefault();
  $(".open #dropdownRegister").trigger("click");
  $(".open #dropdownLogin").trigger("click");
});
listen("click", "#login", function (e) {
  e.preventDefault();
  $(".open #dropdownRegister").trigger("click");
  $(".open #dropdownLanguage").trigger("click");
});
window.checkSummerNoteEmpty = function (selectorElement, errorMessage) {
  var isRequired = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if ($(selectorElement).summernote("isEmpty") && isRequired === 1) {
    displayErrorMessage(errorMessage);
    $(document).find(".note-editable").html("<p><br></p>");
    return false;
  } else if (!$(selectorElement).summernote("isEmpty")) {
    $(document).find(".note-editable").contents().each(function () {
      if (this.nodeType === 3) {
        // text node
        this.textContent = this.textContent.replace(/\u00A0/g, "");
      }
    });
    if ($(document).find(".note-editable").text().trim().length == 0) {
      $(document).find(".note-editable").html("<p><br></p>");
      $(selectorElement).val(null);
      if (isRequired === 1) {
        displayErrorMessage(errorMessage);
        return false;
      }
    }
  }
  return true;
};
window.preparedTemplate = function () {
  var source = $("#actionTemplate").html();
  window.preparedTemplate = Handlebars.compile(source);
};
window.avoidSpace = function (event) {
  var k = event ? event.which : window.event.keyCode;
  if (k == 32) {
    return false;
  }
};

// Add comma into numbers
window.addCommas = function (number) {
  number += "";
  var x = number.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

// Notification
listen("click", ".notification", function (e) {
  e.stopPropagation();
  var notificationId = $(this).data("id");
  var notification = $(this);
  $('[data-toggle="tooltip"]').tooltip("hide");
  $.ajax({
    type: "get",
    url: "/notification/" + notificationId + "/read",
    success: function success() {
      notification.remove();
      var notificationCounter = document.getElementsByClassName("notification").length;
      displaySuccessMessage(Lang.get("messages.flash.notification_read"));
      $("#counter").text(notificationCounter);
      if (notificationCounter == 0) {
        $(".empty-state").removeClass("d-none");
        $("#counter").text(notificationCounter);
        $(".notification-count").addClass("d-none");
        $("#readAllNotification").parents("div").first().remove();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
window.displayDocument = function (input, selector, extension) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      if ($.inArray(extension, ["pdf", "doc", "docx"]) == -1) {
        image.src = e.target.result;
      } else {
        if (extension == "pdf") {
          $("#editPhoto").css("background-image", 'url("' + pdfDocumentImageUrl + '")');
          image.src = pdfDocumentImageUrl;
        } else {
          image.src = docxDocumentImageUrl;
        }
      }
      image.onload = function () {
        $(selector).attr("src", image.src);
        $(selector).css("background-image", 'url("' + image.src + '")');
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
listen("click", "#readAllNotification", function (e) {
  e.stopPropagation();
  $.ajax({
    type: "post",
    url: route("read.all.notification"),
    success: function success() {
      $(".notification").remove();
      var notificationCounter = document.getElementsByClassName("notification").length;
      $("#counter").text(notificationCounter);
      $(".empty-state").removeClass("d-none");
      $(".notification-count").addClass("d-none");
      $("#readAllNotification").parents("div").first().remove();
      displaySuccessMessage(Lang.get("messages.flash.all_notification_read"));
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
window.defaultAvatarImagePreview = function (imagePreviewSelector) {
  $(imagePreviewSelector).css("background-image", 'url("' + $("#defaultAvatarImageUrl").val() + '")');
};
window.defaultImagePreview = function (imagePreviewSelector) {
  $(imagePreviewSelector).css("background-image", 'url("' + $("#defaultImageUrl").val() + '")');
};
window.wc_hex_is_light = function (color) {
  var hex = color.replace("#", "");
  var c_r = parseInt(hex.substr(0, 2), 16);
  var c_g = parseInt(hex.substr(2, 2), 16);
  var c_b = parseInt(hex.substr(4, 2), 16);
  var brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 240;
};
window.number_format = function (number) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var dec_point = decimalsSeparator;
  var thousands_sep = thousandsSeparator;
  // Strip all characters but numerical ones.
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function toFixedFix(n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
};
$(document).on("focus", ".select2-selection.select2-selection--single", function (e) {
  $(this).closest(".select2-container").siblings("select:enabled").select2("open");
});
$(document).on("select2:open", function () {
  var allFound = document.querySelectorAll(".select2-container--open .select2-search__field");
  allFound[allFound.length - 1].focus();
});
window.blockSpecialChar = function (e) {
  var k;
  document.all ? k = e.keyCode : k = e.which;
  return k > 64 && k < 91 || k > 96 && k < 123 || k == 8 || k == 32 || k >= 48 && k <= 57;
};
window.isDoubleClicked = function (element) {
  //if already clicked return TRUE to indicate this click is not allowed
  if (element.data("isclicked")) return true;

  //mark as clicked for 1 second
  element.data("isclicked", true);
  setTimeout(function () {
    element.removeData("isclicked");
  }, 1000);

  //return FALSE to indicate this click was allowed
  return false;
};
window.fnc = function (value, min, max) {
  if (parseInt(value) < 0 || isNaN(value)) return 0;else if (parseInt(value) > 100) return "Number is greater than 100";else return value;
};
listen("click", ".languageSelection", function (e) {
  var languageName = $(this).data("prefix-value");
  $.ajax({
    url: "/change-language",
    type: "post",
    data: {
      languageName: languageName
    },
    success: function success() {
      location.reload();
    }
  });
});
listen("click", ".changeLanguage", function (e) {
  var languageName = $(this).data("prefix-value");
  $.ajax({
    url: route("change-language"),
    type: "post",
    data: {
      languageName: languageName
    },
    success: function success(result) {
      displaySuccessMessage(Lang.get("messages.flash.language_updated"));
      setTimeout(function () {
        location.reload();
      }, 1000);
    }
  });
});
window.convertToMomentFormat = function (format) {
  switch (format) {
    case "d-m-Y":
      return "DD-MM-YYYY";
    case "m-d-Y":
      return "MM-DD-YYYY";
    case "Y-m-d":
      return "YYYY-MM-DD";
    case "m/d/Y":
      return "MM/DD/YYYY";
    case "d/m/Y":
      return "DD/MM/YYYY";
    case "Y/m/d":
      return "YYYY/MM/DD";
    case "m.d.Y":
      return "MM.DD.YYYY";
    case "d.m.Y":
      return "DD.MM.YYYY";
    case "Y.m.d":
      return "YYYY.MM.DD";
    default:
    // code block
  }
};
window.copyToClipboard = function (element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(element).select();
  document.execCommand("copy");
  $temp.remove();
  displaySuccessMessage(Lang.get("messages.common.copied_successfully"));
};
listen("click", function (event) {
  var target = $(event.target);
  if (!target.closest(".dropdown-menu").length) {
    $(".livewire-search-box .dropdown-menu").removeClass("show");
    $(".livewire-search-box .fw-bolder").removeAttr("aria-expanded");
  }
});
listenClick(".filter-popup", function (event) {
  event.preventDefault();
  $(".livewire-search-box .dropdown-menu").addClass("show");
});
window.addEventListener("keydown", function (event) {
  if (event.keyCode == 27) {
    $(".livewire-search-box .dropdown-menu").removeClass("show");
  }
}, true);
window.select2NotExists = function (element) {
  var targetEle = $(element);
  if (!targetEle.length) {
    return false;
  }
  return true;
};
window.removeSelect2Container = function (elements) {
  elements.forEach(function (value) {
    if ($(value).hasClass("select2-hidden-accessible")) {
      $(".select2-container").remove();
    }
  });
};
listenClick(".apply-dark-mode", function (e) {
  e.preventDefault();
  $.ajax({
    url: route("update-dark-mode"),
    type: "get",
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(Lang.get("messages.flash.theme_changed"));
        setTimeout(function () {
          location.reload();
        }, 500);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
function tooltip() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
function resizeWindow() {
  $(window).resize(function () {
    if ($(window).width() < 425) {
      $(".createInvoiceBtn").html('<i class="far fa-file-alt"></i>');
    } else {
      $(".createInvoiceBtn").html(Lang.get("messages.invoice.new_invoice"));
    }
  });
  $(window).trigger("resize");
}
window.currencyAmount = function (amount) {
  if ($("#currency_position").val() == 1) {
    return " " + number_format(amount) + " " + $("#currency").val();
  }
  return " " + $("#currency").val() + " " + number_format(amount);
};
listenChange(".image-upload", function () {
  var ext = $(this).val().split(".").pop().toLowerCase();
  if ($.inArray(ext, ["png", "jpg", "jpeg"]) == -1) {
    displayErrorMessage("The image must be a file of type: jpg, png, jpeg");
    $(this).val("");
  }
});
listenChange(".change-tenant-client", function () {
  var tenantId = $(this).val();
  $.ajax({
    url: route("change.tenant.client"),
    type: "POST",
    data: {
      tenantId: tenantId
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.location.href = route("client.dashboard");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/custom/helpers.js":
/*!***********************************************!*\
  !*** ./resources/assets/js/custom/helpers.js ***!
  \***********************************************/
/***/ (() => {

window.listenWithoutTarget = function (event, callback) {
  $(document).on(event, callback);
};
window.listen = function (event, selector, callback) {
  $(document).on(event, selector, callback);
};
window.listenClick = function (selector, callback) {
  $(document).on('click', selector, callback);
};
window.listenSubmit = function (selector, callback) {
  $(document).on('submit', selector, callback);
};
window.listenHiddenBsModal = function (selector, callback) {
  $(document).on('hidden.bs.modal', selector, callback);
};
window.listenShowBsModal = function (selector, callback) {
  $(document).on('show.bs.modal', selector, callback);
};
window.listenChange = function (selector, callback) {
  $(document).on('change', selector, callback);
};
window.listenKeyup = function (selector, callback) {
  $(document).on('keyup', selector, callback);
};

/***/ }),

/***/ "./resources/assets/js/custom/phone-number-country-code.js":
/*!*****************************************************************!*\
  !*** ./resources/assets/js/custom/phone-number-country-code.js ***!
  \*****************************************************************/
/***/ (() => {

document.addEventListener("turbo:load", loadPhoneNumberCountryCode);
function loadPhoneNumberCountryCode() {
  if (!$("#phoneNumber").length) {
    return;
  }
  var input = document.querySelector("#phoneNumber"),
    errorMsg = document.querySelector("#error-msg"),
    validMsg = document.querySelector("#valid-msg");
  var errorMap = [Lang.get("messages.placeholder.invalid_number"), Lang.get("messages.placeholder.invalid_country_number"), Lang.get("messages.placeholder.too_short"), Lang.get("messages.placeholder.too_long"), Lang.get("messages.placeholder.invalid_number")];

  // initialise plugin
  var intl = window.intlTelInput(input, {
    initialCountry: "in",
    separateDialCode: true,
    preferredCountries: false,
    geoIpLookup: function geoIpLookup(success, failure) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
        var countryCode = resp && resp.country ? resp.country : "";
        success(countryCode);
      });
    },
    utilsScript: "../../public/assets/js/inttel/js/utils.min.js"
  });
  var reset = function reset() {
    input.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");
  };
  input.addEventListener("blur", function () {
    reset();
    if (input.value.trim()) {
      if (intl.isValidNumber()) {
        validMsg.classList.remove("hide");
      } else {
        input.classList.add("error");
        var errorCode = intl.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("hide");
      }
    }
  });

  // on keyup / change flag: reset
  input.addEventListener("change", reset);
  input.addEventListener("keyup", reset);
  if (typeof phoneNo != "undefined" && phoneNo !== "") {
    setTimeout(function () {
      $("#phoneNumber").trigger("change");
    }, 500);
  }
  $("#phoneNumber").on("blur keyup change countrychange", function () {
    if (typeof phoneNo != "undefined" && phoneNo !== "") {
      intl.setNumber("+" + phoneNo);
      phoneNo = "";
    }
    var getCode = intl.selectedCountryData["dialCode"];
    $("#prefix_code").val(getCode);
  });
  if ($("#isEdit").val()) {
    var getCode = intl.selectedCountryData["dialCode"];
    $("#prefix_code").val(getCode);
  }
  var getPhoneNumber = $("#phoneNumber").val();
  var removeSpacePhoneNumber = getPhoneNumber.replace(/\s/g, "");
  $("#phoneNumber").val(removeSpacePhoneNumber);
}
listen("submit", "#userCreateForm", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});
listen("submit", "#userEditForm", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});
listen("submit", "#kt_account_profile_details_form", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});
listen("submit", "#createSetting", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});
listen("submit", "#newUserSettingForm", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});
listen("submit", "#userSetting", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});
listen("submit", "#userProfileEditForm", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#phoneNumber").focus();
    return false;
  }
});

/***/ }),

/***/ "./resources/assets/js/customer/create-edit.js":
/*!*****************************************************!*\
  !*** ./resources/assets/js/customer/create-edit.js ***!
  \*****************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditCustomer);
function loadCreateEditCustomer() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditCustomer();
  loadSelect2ClientData();
  momentFormat = convertToMomentFormat(currentDateFormat);
  if ($("#customerNoteData").val() == true || $("#customerTermData").val() == true) {
    $("#customerAddNote").hide();
    $("#customerRemoveNote").show();
    $("#customerNoteAdd").show();
    $("#customerTermRemove").show();
  } else {
    $("#customerRemoveNote").hide();
    $("#customerNoteAdd").hide();
    $("#customerTermRemove").hide();
  }
  if ($("#customerRecurring").val() == true) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
  if ($("#discountType").val() != 0) {
    $("#discount").removeAttr("disabled");
  } else {
    $("#discount").attr("disabled", "disabled");
  }
  calculateAndSetCustomerAmount();
}
function loadSelect2ClientData() {
  if (!$("#client_id").length && !$("#discountType").length) {
    return;
  }
  $("#client_id,#discountType,#status,#templateId").select2();
}
function initializeSelect2CreateEditCustomer() {
  if (!select2NotExists(".product-customer")) {
    return false;
  }
  removeSelect2Container([".product-customer"]);
  $(".product-customer").select2({
    tags: true
  });
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  $(".payment-qr-code").select2();
  $("#client_id").focus();
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  var customerDueDateFlatPicker = $("#customerDueDate").flatpickr({
    defaultDate: currentDate,
    dateFormat: currentDateFormat,
    locale: getUserLanguages
  });
  var editCustomerDueDateVal = moment($("#editCustomerDueDateAdmin").val()).format(convertToMomentFormat(currentDateFormat));
  var editCustomerDueDateFlatPicker = $(".edit-customer-due-date").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editCustomerDueDateVal,
    locale: getUserLanguages
  });
  $("#customer_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#quote_date").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#quote_date").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof customerDueDateFlatPicker != "undefined") {
        customerDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      if (typeof customerDueDateFlatPicker != "undefined") {
        customerDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
  var editCustomerDate = $("#editCustomerDate").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: moment($("#editCustomerDateAdmin").val()).format(convertToMomentFormat(currentDateFormat)),
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editCustomerDate").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#editCustomerDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editcustomerDueDateFlatPicker != "undefined") {
        editcustomerDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editCustomerDateAdmin").val(), momentFormat).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      } else {
        minDate = moment($("#editCustomerDateAdmin").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editcustomerDueDateFlatPicker != "undefined") {
        editcustomerDueDateFlatPicker.set("minDate", minDate);
      }
    }
  });
}
listenKeyup("#customerId", function () {
  return $("#customerId").val(this.value.toUpperCase());
});
listenClick("#customerAddNote", function () {
  $("#customerAddNote").hide();
  $("#customerRemoveNote").show();
  $("#customerNoteAdd").show();
  $("#customerTermRemove").show();
});
listenClick("#customerRemoveNote", function () {
  $("#customerAddNote").show();
  $("#customerRemoveNote").hide();
  $("#customerNoteAdd").hide();
  $("#customerTermRemove").hide();
  $("#customerNote").val("");
  $("#customerTerm").val("");
  $("#customerAddNote").show();
});
listenClick("#formData_recurring-0", function () {
  if ($("#formData_recurring-0").prop("checked")) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
});
listenClick("#formData_recurring-1", function () {
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
});
listenChange("#discountType", function () {
  discountType = $(this).val();
  $("#discount").val(0);
  if (discountType == 1 || discountType == 2) {
    $("#discount").removeAttr("disabled");
    if (discountType == 2) {
      var value = $("#discount").val();
      $("#discount").val(value.substring(0, 2));
    }
  } else {
    $("#discount").attr("disabled", "disabled");
    $("#discount").val(0);
    $("#customerDiscountAmount").text("0");
  }
  calculateDiscount();
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenClick("#addCustomerItem", function () {
  var data = {
    products: JSON.parse($("#products").val())
  };
  var customerItemHtml = prepareTemplateRender("#customerItemTemplate", data);
  $(".customere-item-container").append(customerItemHtml);
  $(".productId").select2({
    placeholder: "Select Product or Enter free text",
    tags: true
  });
  resetCustomerItemIndex();
});
var resetCustomerItemIndex = function resetCustomerItemIndex() {
  var index = 1;
  $(".customer-item-container>tr").each(function () {
    $(this).find(".item-number").text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      products: JSON.parse($("#products").val())
    };
    var customerItemHtml = prepareTemplateRender("#customerItemTemplate", data);
    $(".customer-item-container").append(customerItemHtml);
    $(".productId").select2();
  }
};
listenClick(".delete-customer-item", function () {
  $(this).parents("tr").remove();
  resetCustomerItemIndex();
  calculateAndSetCustomerAmount();
});
listenChange(".product-customer", function () {
  var productId = $(this).val();
  if (isEmpty(productId)) {
    productId = 0;
  }
  var element = $(this);
  $.ajax({
    url: route("customer.get-product", productId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        var price = "";
        $.each(result.data, function (id, productPrice) {
          if (id === productId) price = productPrice;
        });
        element.parent().parent().find("td .price-customer").val(price);
        element.parent().parent().find("td .qty-customer").val(1);
        $(".price-customer").trigger("keyup");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenKeyup(".qty-customer", function () {
  var qty = parseFloat($(this).val());
  var rate = $(this).parent().siblings().find(".price-customer").val();
  rate = parseFloat(removeCommas(rate));
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".customer-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetcustomerAmount();
});
listenKeyup(".price-customer", function () {
  var rate = $(this).val();
  rate = parseFloat(removeCommas(rate));
  var qty = $(this).parent().siblings().find(".qty-customer").val();
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".customer-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetCustomerAmount();
});
var calculateAmount = function calculateAmount(qty, rate) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    return price;
  } else {
    return 0;
  }
};
var calculateAndSetCustomerAmount = function calculateAndSetCustomerAmount() {
  var customerTotalAmount = 0;
  $(".customer-item-container>tr").each(function () {
    var customerItemTotal = $(this).find(".customer-item-total").text();
    customerItemTotal = removeCommas(customerItemTotal);
    customerItemTotal = isEmpty($.trim(customerItemTotal)) ? 0 : parseFloat(customerItemTotal);
    customerTotalAmount += customerItemTotal;
  });
  customerTotalAmount = parseFloat(customerTotalAmount);
  if (isNaN(customerTotalAmount)) {
    customerTotalAmount = 0;
  }
  $("#customerTotal").text(addCommas(customerTotalAmount.toFixed(2)));

  //set hidden input value
  $("#customerTotalAmount").val(customerTotalAmount);
  calculateDiscount();
};
var calculateDiscount = function calculateDiscount() {
  var discount = $("#discount").val();
  discountType = $("#discountType").val();
  var itemAmount = [];
  var i = 0;
  $(".customer-item-total").each(function () {
    itemAmount[i++] = $.trim(removeCommas($(this).text()));
  });
  $.sum = function (arr) {
    var r = 0;
    $.each(arr, function (i, v) {
      r += +v;
    });
    return r;
  };
  var totalAmount = $.sum(itemAmount);
  $("#customerTotal").text(number_format(totalAmount));
  if (isEmpty(discount) || isEmpty(totalAmount)) {
    discount = 0;
  }
  var discountAmount = 0;
  var finalAmount = totalAmount - discountAmount;
  if (discountType == 1) {
    discountAmount = discount;
    finalAmount = totalAmount - discountAmount;
  } else if (discountType == 2) {
    discountAmount = totalAmount * discount / 100;
    finalAmount = totalAmount - discountAmount;
  }
  $("#customerFinalAmount").text(number_format(finalAmount));
  $("#customerTotalAmount").val(finalAmount.toFixed(2));
  $("#customerDiscountAmount").text(number_format(discountAmount));
};
listen("keyup", "#discount", function () {
  var value = $(this).val();
  if (discountType == 2 && value > 100) {
    displayErrorMessage("On Percentage you can only give maximum 100% discount");
    $(this).val(value.slice(0, -1));
    return false;
  }
  calculateDiscount();
});
listenClick("#saveAsDraftCustomer", function (event) {
  event.preventDefault();
  var myForm = document.getElementById("customerForm");
  var formData = new FormData(myForm);
  screenLock();
  $.ajax({
    url: route("customers.store"),
    type: "POST",
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      Turbo.visit(route("customers.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick("#editSavecustomer", function (event) {
  event.preventDefault();
  var formData = $("#edit_customerForm").serialize();
  screenLock();
  $.ajax({
    url: $("#customerUpdateUrl").val(),
    type: "put",
    data: formData,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      Turbo.visit(route("customers.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listen("input", ".qty-customer", function () {
  var quantity = $(this).val();
  if (quantity.length == 8) {
    $(this).val(quantity.slice(0, -1));
  }
});

/***/ }),

/***/ "./resources/assets/js/customer/customer.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/customer/customer.js ***!
  \**************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadCustomer);
function loadCustomer() {
  initializeSelect2Customer();
}
function initializeSelect2Customer() {
  if (!select2NotExists('#status_filter')) {
    return false;
  }
  removeSelect2Container(['#status_filter']);
  $('#status_filter').select2({
    placeholder: 'All'
  });
  if ($('#status').val() == '') {
    $('#status_filter').val(5).trigger('change');
  }
}
listenClick('.customer-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('customers.destroy', id), 'customer', Lang.get('messages.customer.customer'));
});
listenClick('#resetFilter', function () {
  $('#status_filter').val(5).trigger('change');
  $('#status_filter').select2({
    placeholder: 'All'
  });
});
listenClick('.convert-to-invoice', function (e) {
  e.preventDefault();
  var customerId = $(this).data('id');
  $.ajax({
    url: route('customers.convert-to-invoice'),
    type: 'GET',
    data: {
      customerId: customerId
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/dashboard/dashboard.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/dashboard/dashboard.js ***!
  \****************************************************/
/***/ (() => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var dashboardRevenueByTimeChart;
var dashboardSalesByTimeChart;
var start_date;
var end_date;
var datePicker;
var isPickerApply = false;
document.addEventListener('turbo:load', loadDashboard);
function loadDashboard() {
  initDashboardDatePicker();
}
function initDashboardDatePicker() {
  datePicker = $('#time_range');
  if (!datePicker.length) {
    return;
  }
  start_date = moment().startOf('month');
  end_date = moment().endOf('month');
  setDbDatepickerValue(start_date, end_date);
  var last_month = moment().startOf('month').subtract(1, 'days');
  datePicker.daterangepicker({
    maxDate: new Date(),
    startDate: start_date,
    endDate: end_date,
    opens: 'left',
    showDropdowns: true,
    autoUpdateInput: false,
    locale: {
      customRangeLabel: Lang.get('messages.common.custom'),
      applyLabel: Lang.get('messages.common.apply'),
      cancelLabel: Lang.get('messages.common.cancel'),
      fromLabel: Lang.get('messages.common.from'),
      toLabel: Lang.get('messages.common.to'),
      monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
      daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
    },
    ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.range.today'), [moment(), moment()]), Lang.get('messages.range.this_week'), [moment().startOf('week'), moment().endOf('week')]), Lang.get('messages.range.last_week'), [moment().startOf('week').subtract(7, 'days'), moment().startOf('week').subtract(1, 'days')]), Lang.get('messages.range.last_30'), [start_date, end_date]), Lang.get('messages.range.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.range.last_month'), [last_month.clone().startOf('month'), last_month.clone().endOf('month')])
  }, setDbDatepickerValue);
  loadYearlyIncomeChat(start_date.format('YYYY-MM-D'), end_date.format('YYYY-MM-D'));
  loadPaymentViewStatus();
  loadInvoiceViewStatus();
  datePicker.on('apply.daterangepicker', function (ev, picker) {
    isPickerApply = true;
    start_date = picker.startDate.format('YYYY-MM-D');
    end_date = picker.endDate.format('YYYY-MM-D');
    loadYearlyIncomeChat(start_date, end_date);
  });
}
function setDbDatepickerValue(start, end) {
  datePicker.val(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
}
function loadPaymentViewStatus() {
  $.ajax({
    type: 'GET',
    url: route('payment-overview'),
    cache: false
  }).done(preparePaymentViewStatusChart);
}
function loadYearlyIncomeChat(startDate, endDate) {
  $.ajax({
    type: 'GET',
    url: route('yearly-income-chart'),
    dataType: 'json',
    data: {
      start_date: startDate,
      end_date: endDate
    },
    cache: false
  }).done(prepareYearlyIncomeViewChart);
}
function loadInvoiceViewStatus() {
  $.ajax({
    type: 'GET',
    url: route('invoices-overview'),
    cache: false
  }).done(prepareInvoiceViewStatusChart);
}
function prepareYearlyIncomeViewChart(result) {
  $('#yearly_income_overview-container').html('');
  var data = result.data;
  if (data.total_records === 0) {
    $('#yearly_income_overview-container').empty();
    $('#yearly_income_overview-container').append('<div align="center" class="no-record justify-align-center">' + Lang.get('messages.admin_dashboard.no_record_found') + '</div>');
    return true;
  } else {
    $('#yearly_income_overview-container').html('');
    $('#yearly_income_overview-container').append('<canvas id="yearly_income_chart_canvas" height="200"></canvas>');
  }
  var ctx = document.getElementById('yearly_income_chart_canvas').getContext('2d');
  ctx.canvas.style.height = '500px';
  ctx.canvas.style.width = '908px';
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: data.month,
        // Name the series
        data: data.yearly_income,
        // Specify the data values array
        fill: false,
        borderColor: '#2196f3',
        // Add custom color border (Line)
        backgroundColor: '#2196f3',
        // Add custom color background (Points and Fill)
        borderWidth: 2 // Specify bar border width
      }]
    },
    options: {
      elements: {
        line: {
          tension: 0.5
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function label(context) {
              return currencyAmount(context.formattedValue);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          },
          ticks: {
            min: 0,
            // stepSize: 500,
            callback: function callback(label) {
              return currencyAmount(label);
            }
          }
        },
        x: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
}
function prepareInvoiceViewStatusChart(result) {
  $('#invoice-overview-container').html('');
  var data = result.data;
  if (data.total_paid_invoices === 0 && data.total_unpaid_invoices === 0) {
    $('#invoice-overview-container').empty();
    $('#invoice-overview-container').append('<div align="center" class="no-record justify-align-center">' + Lang.get('messages.admin_dashboard.no_record_found') + '</div>');
    return true;
  } else {
    $('#invoice-overview-container').html('');
    $('#invoice-overview-container').append('<canvas id="invoice_overview"></canvas>');
  }
  var ctx = document.getElementById('invoice_overview').getContext('2d');
  var pieChartData = {
    labels: data.labels,
    datasets: [{
      data: data.dataPoints,
      backgroundColor: ['#1100ff', '#ff0000']
    }]
  };
  window.myBar = new Chart(ctx, {
    type: 'doughnut',
    data: pieChartData,
    options: {
      legend: {
        display: true,
        position: 'bottom',
        boxWidth: 9
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function label(context) {
              return ' ' + context.formattedValue;
            }
          }
        }
      }
    }
  });
}
function preparePaymentViewStatusChart(result) {
  $('#payment-overview-container').html('');
  var data = result.data;
  if (data.total_records === 0) {
    $('#payment-overview-container').empty();
    $('#payment-overview-container').append('<div align="center" class="no-record justify-align-center">' + Lang.get('messages.admin_dashboard.no_record_found') + '</div>');
    return true;
  } else {
    $('#payment-overview-container').html('');
    $('#payment-overview-container').append('<canvas id="payment_overview"></canvas>');
  }
  var ctx = document.getElementById('payment_overview').getContext('2d');
  var pieChartData = {
    labels: data.labels,
    datasets: [{
      data: data.dataPoints,
      backgroundColor: ['#47c363', '#fc544b']
    }]
  };
  window.myBar = new Chart(ctx, {
    type: 'doughnut',
    data: pieChartData,
    options: {
      legend: {
        display: true,
        position: 'bottom',
        boxWidth: 9
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function label(context) {
              return currencyAmount(context.formattedValue);
            }
          }
        }
      }
    }
  });
}

/***/ }),

/***/ "./resources/assets/js/expense/expense.js":
/*!************************************************!*\
  !*** ./resources/assets/js/expense/expense.js ***!
  \************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditexpense);
function loadCreateEditexpense() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditexpense();
  loadSelect2ClientData();
  momentFormat = convertToMomentFormat(currentDateFormat);
}
function loadSelect2ClientData() {
  $("#expense_warehouse_id,#expense_category_id").select2();
}
function initializeSelect2CreateEditexpense() {
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  $("#expense_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
}
listenKeyup("#expenseId", function () {
  return $("#expenseId").val(this.value.toUpperCase());
});
listenClick('.expense-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('expenses.destroy', id), 'expense', Lang.get('expense'));
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenSubmit("#saveAsDraftExpense", function (event) {
  event.preventDefault();
  var myForm = document.getElementById("expenseForm");
  var formData = new FormData(myForm);
  screenLock();
  $.ajax({
    url: route("expenses.store"),
    type: "POST",
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      displaySuccessMessage("successed created");
      Turbo.visit(route("expenses.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick("#editSaveExpense", function (event) {
  event.preventDefault();
  var formData = $("#edit_expenseForm").serialize();
  screenLock();
  $.ajax({
    url: $("#expenseUpdateUrl").val(),
    type: "put",
    data: formData,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      Turbo.visit(route("expenses.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/expense_category/expense_category.js":
/*!******************************************************************!*\
  !*** ./resources/assets/js/expense_category/expense_category.js ***!
  \******************************************************************/
/***/ (() => {

listenClick('.addExpenseCategory', function () {
  $('#addExpenseCategoryModal').appendTo('body').modal('show');
});
listenSubmit('#addExpenseCategoryForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('expense_category.store'),
    type: 'POST',
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#addExpenseCategoryModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenHiddenBsModal('#addExpenseCategoryModal', function () {
  resetModalForm('#addExpenseCategoryForm', '#validationErrorsBox');
});
listenClick('.expense_category-edit-btn', function (event) {
  var UnitId = $(event.currentTarget).attr('data-id');
  UnitRenderData(UnitId);
});
function UnitRenderData(unitId) {
  $.ajax({
    url: route('expense_category.edit', unitId),
    type: 'GET',
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        console.log("result.data", result.data);
        $('#category_expenseId').val(result.data.id);
        $('#editExpenseCategoryModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
;
listenSubmit('#editExpenseCategoryForm', function (event) {
  event.preventDefault();
  var unitId = $('#category_expenseId').val();
  $.ajax({
    url: route('expense_category.update', unitId),
    type: 'put',
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editExpenseCategoryModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick('.expense_category-delete-btn', function (event) {
  var UnitId = $(event.currentTarget).attr('data-id');
  deleteItem(route('expense_category.destroy', UnitId), '#expenseCategoryTbl', "expenseCategory");
  // Lang.get('messages.units.base_units')
});

/***/ }),

/***/ "./resources/assets/js/faqs/faqs.js":
/*!******************************************!*\
  !*** ./resources/assets/js/faqs/faqs.js ***!
  \******************************************/
/***/ (() => {

listenSubmit('#addFaqForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#faqSaveBtn');
  loadingButton.button('loading');
  $('#faqSaveBtn').attr('disabled', true);
  $.ajax({
    url: route('faqs.store'),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addFaqModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#faqSaveBtn').attr('disabled', false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      $('#faqSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.faq-edit-btn', function (event) {
  var faqsId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: route('faqs.edit', faqsId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#faqsId').val(result.data.id);
        $('#editQuestion').val(result.data.question);
        $('#editAnswer').val(result.data.answer);
        $('#editFaqModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenHiddenBsModal('#addFaqModal', function () {
  resetModalForm('#addFaqForm', '#validationErrorsBox');
});
listenClick('.faq-show-btn', function (event) {
  ajaxCallInProgress();
  var faqsId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: route('faqs.show', faqsId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showQuestion').text(result.data.question);
        $('#showAnswer').text(result.data.answer);
        $('#showFaqModal').modal('show');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenSubmit('#editFaqForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#faqEditSaveBtn');
  loadingButton.button('loading');
  $('#faqEditSaveBtn').attr('disabled', true);
  var id = $('#faqsId').val();
  $.ajax({
    url: route('faqs-update', id),
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      displaySuccessMessage(result.message);
      $('#editFaqModal').modal('hide');
      livewire.emit('refreshDatatable');
      livewire.emit('resetPageTable');
      $('#faqEditSaveBtn').attr('disabled', false);
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      $('#faqEditSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.addFaqButton', function () {
  $('#addFaqModal').appendTo('body').modal('show');
});
listenHiddenBsModal('#addFaqModal', function () {
  resetModalForm('#addNewForm', '#addFaqModal #validationErrorsBox');
  $('#faqSaveBtn').attr('disabled', false);
});
listenHiddenBsModal('#editFaqModal', function () {
  resetModalForm('#editFaqForm', '#editFaqModal #editValidationErrorsBox');
  $('#faqEditSaveBtn').attr('disabled', false);
});
listenClick('.faq-delete-btn', function (event) {
  var faqsId = $(event.currentTarget).attr('data-id');
  deleteItem(route('faqs.destroy', faqsId), $('#faqsTable'), Lang.get('messages.faqs.faqs'));
});

/***/ }),

/***/ "./resources/assets/js/flatpickr_localization.js":
/*!*******************************************************!*\
  !*** ./resources/assets/js/flatpickr_localization.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flatpickr_dist_l10n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flatpickr/dist/l10n */ "./node_modules/flatpickr/dist/l10n/index.js");
/* harmony import */ var flatpickr_dist_l10n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flatpickr_dist_l10n__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./resources/assets/js/invoice/create-edit.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/invoice/create-edit.js ***!
  \****************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditInvoice);
function loadCreateEditInvoice() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditInvoice();
  loadSelect2ClientData();
  loadSelect2CurrencyData();
  loadRecurringTextBox();
  momentFormat = convertToMomentFormat(currentDateFormat);
  if ($("#invoiceNote").val() == true || $("#invoiceTerm").val() == true) {
    $("#addNote").hide();
    $("#removeNote").show();
    $("#noteAdd").show();
    $("#termRemove").show();
  } else {
    $("#removeNote").hide();
    $("#noteAdd").hide();
    $("#termRemove").hide();
  }
  if ($("#invoiceRecurring").val() == true) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
  if ($("#discountType").val() != 0) {
    $("#discount").removeAttr("disabled");
  } else {
    $("#discount").attr("disabled", "disabled");
  }
  calculateFinalAmount();
}
function loadSelect2ClientData() {
  if (!$("#client_id").length && !$("#discountType").length) {
    return;
  }
  $("#client_id,#discountType,#status,#templateId").select2();
}
function loadSelect2CurrencyData() {
  if (!$("#invoiceCurrencyType").length) {
    return;
  }
  $("#invoiceCurrencyType").select2();
}
function loadRecurringTextBox() {
  var recurringStatus = $("#recurringStatusToggle").is(":checked");
  showRecurringCycle(recurringStatus);
}
function showRecurringCycle(recurringStatus) {
  if (recurringStatus) {
    $(".recurring-cycle-content").show();
  } else {
    $(".recurring-cycle-content").hide();
  }
}
listenClick("#recurringStatusToggle", function () {
  var recurringStatus = $(this).is(":checked");
  showRecurringCycle(recurringStatus);
});
listenChange("#invoiceCurrencyType", function () {
  var currencyId = $(this).val();
  if (currencyId.length > 0) {
    $.ajax({
      url: route("invoices.get-currency", currencyId),
      type: "get",
      dataType: "json",
      success: function success(result) {
        if (result.success) {
          $(".invoice-selected-currency").text(result.data);
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      }
    });
  }
});
function initializeSelect2CreateEditInvoice() {
  if (!select2NotExists(".product")) {
    return false;
  }
  removeSelect2Container([".product"]);
  $(".product").select2({
    tags: true
  });
  $(".tax").select2({
    placeholder: Lang.get("messages.tax.select_tax")
  });
  $(".invoice-taxes").select2({
    placeholder: Lang.get("messages.tax.select_tax")
  });
  $(".payment-qr-code").select2();
  $("#client_id").focus();
  var currentDate = moment().add(1, "days").toDate();
  var dueDateFlatPicker = $("#due_date").flatpickr({
    defaultDate: moment(currentDate).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages
  });
  var editInvoiceDueDate = moment($("#editDueDate").val()).format(convertToMomentFormat(currentDateFormat));
  var editDueDateFlatPicker = $(".edit-due-date").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editInvoiceDueDate,
    locale: getUserLanguages
  });
  $("#invoice_date").flatpickr({
    defaultDate: new Date(),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#invoice_date").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#invoice_date").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof dueDateFlatPicker != "undefined") {
        dueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      var minDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      if (typeof dueDateFlatPicker != "undefined") {
        dueDateFlatPicker.set("minDate", minDate);
      }
    }
  });
  $("#editInvoiceDate").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: moment($("#editInvoiceDate").val()).format(convertToMomentFormat(currentDateFormat)),
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editInvoiceDate").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#editInvoiceDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editDueDateFlatPicker != "undefined") {
        editDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      var minDate2;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate2 = moment($("#editInvoiceDate").val(), convertToMomentFormat(currentDateFormat)).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      } else {
        minDate2 = moment($("#editInvoiceDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editDueDateFlatPicker != "undefined") {
        editDueDateFlatPicker.set("minDate", minDate2);
      }
    }
  });
}
listenKeyup("#invoiceId", function () {
  return $("#invoiceId").val(this.value.toUpperCase());
});
listenClick("#addNote", function () {
  $("#addNote").hide();
  $("#removeNote").show();
  $("#noteAdd").show();
  $("#termRemove").show();
});
listenClick("#removeNote", function () {
  $("#addNote").show();
  $("#removeNote").hide();
  $("#noteAdd").hide();
  $("#termRemove").hide();
  $("#note").val("");
  $("#term").val("");
});
listenClick("#formData_recurring-0", function () {
  if ($("#formData_recurring-0").prop("checked")) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
});
listenClick("#formData_recurring-1", function () {
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
});
listenChange("#discountType", function () {
  discountType = $(this).val();
  $("#discount").val(0);
  if (discountType == 1 || discountType == 2) {
    $("#discount").removeAttr("disabled");
    if (discountType == 2) {
      var value = $("#discount").val();
      $("#discount").val(value.substring(0, 2));
    }
  } else {
    $("#discount").attr("disabled", "disabled");
    $("#discount").val(0);
    $("#discountAmount").text("0");
  }
  calculateFinalAmount();
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenClick("#addItem", function () {
  var data = {
    products: JSON.parse($("#products").val()),
    taxes: JSON.parse($("#taxes").val())
  };
  var invoiceItemHtml = prepareTemplateRender("#invoiceItemTemplate", data);
  $(".invoice-item-container").append(invoiceItemHtml);
  $(".taxId").select2({
    placeholder: Lang.get("messages.tax.select_tax"),
    multiple: true
  });
  $(".productId").select2({
    placeholder: Lang.get("messages.quote.select_product"),
    tags: true
  });
  resetInvoiceItemIndex();
});
var resetInvoiceItemIndex = function resetInvoiceItemIndex() {
  var index = 1;
  $(".invoice-item-container>tr").each(function () {
    $(this).find(".item-number").text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      products: JSON.parse($("#products").val()),
      taxes: JSON.parse($("#taxes").val())
    };
    var invoiceItemHtml = prepareTemplateRender("#invoiceItemTemplate", data);
    $(".invoice-item-container").append(invoiceItemHtml);
    $(".productId").select2();
    $(".taxId").select2({
      placeholder: Lang.get("messages.tax.select_tax"),
      multiple: true
    });
  }
  calculateFinalAmount();
};
listenClick(".delete-invoice-item", function () {
  $(this).parents("tr").remove();
  resetInvoiceItemIndex();
  calculateFinalAmount();
});
listenChange(".product", function () {
  var productId = $(this).val();
  if (isEmpty(productId)) {
    productId = 0;
  }
  var element = $(this);
  $.ajax({
    url: route("invoices.get-product", productId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        var price = "";
        $.each(result.data, function (id, productPrice) {
          if (id === productId) price = productPrice;
        });
        element.parent().parent().find("td .price").val(price);
        element.parent().parent().find("td .qty").val(1);
        $(".price").trigger("keyup");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenChange(".tax", function () {
  calculateFinalAmount();
});
listenKeyup(".qty", function () {
  var qty = $(this).val();
  var rate = $(this).parent().siblings().find(".price").val();
  rate = parseFloat(removeCommas(rate));
  var amount = calculateAmountWithoutTax(qty, rate);
  $(this).parent().siblings(".item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateFinalAmount();
});
listenKeyup(".price", function () {
  var rate = $(this).val();
  rate = parseFloat(removeCommas(rate));
  var qty = $(this).parent().siblings().find(".qty").val();
  var amount = calculateAmountWithoutTax(qty, rate);
  $(this).parent().siblings(".item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateFinalAmount();
});
var calculateAmount = function calculateAmount(qty, rate, tax) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    var allTax = price + price * tax / 100;
    if (isNaN(allTax)) {
      return price;
    }
    return allTax;
  } else {
    return 0;
  }
};
var calculateAmountWithoutTax = function calculateAmountWithoutTax(qty, rate) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    if (isNaN(price)) {
      return 0;
    }
    return price;
  } else {
    return 0;
  }
};
var calculateFinalAmount = function calculateFinalAmount() {
  var taxData = [];
  var amount = 0;
  var itemWiseTaxes = 0;
  $(".invoice-item-container>tr").each(function () {
    var itemTotal = $(this).find(".item-total").text();
    itemTotal = removeCommas(itemTotal);
    itemTotal = isEmpty($.trim(itemTotal)) ? 0 : parseFloat(itemTotal);
    amount += itemTotal;
    $(this).find(".tax").each(function (i, element) {
      var collection = element.selectedOptions;
      var itemWiseTax = 0;
      for (var _i = 0; _i < collection.length; _i++) {
        var tax = collection[_i].value;
        if (tax > 0) {
          itemWiseTax += parseFloat(tax);
        }
      }
      itemWiseTaxes += parseFloat(itemWiseTax * itemTotal / 100);
      taxData.push(itemWiseTaxes);
    });
  });
  var totalAmount = amount;
  $("#total").text(number_format(totalAmount));
  $("#finalAmount").text(number_format(totalAmount));

  //set hidden amount input value
  $("#total_amount").val(totalAmount.toFixed(2));

  // total amount with products taxes
  var finalTotalAmt = parseFloat(totalAmount) + parseFloat(itemWiseTaxes);
  $("#totalTax").empty();
  $("#totalTax").text(number_format(itemWiseTaxes));

  // add invoice taxes
  var totalInvoiceTax = 0;
  $("option:selected", ".invoice-taxes").each(function (index, val) {
    totalInvoiceTax += parseFloat(val.getAttribute("data-tax"));
  });
  if (totalInvoiceTax > 0) {
    var amountWithTaxes = finalTotalAmt * parseFloat(totalInvoiceTax) / 100;
    var finalTotalTaxes = parseFloat(itemWiseTaxes) + parseFloat(amountWithTaxes);
    $("#totalTax").text(number_format(finalTotalTaxes));
    finalTotalAmt = finalTotalAmt + parseFloat(amountWithTaxes);
  }

  // add discount amount
  var discount = $("#discount").val();
  discountType = $("#discountType").val();
  if (isEmpty(discount) || isEmpty(totalAmount)) {
    discount = 0;
  }
  var discountAmount = 0;
  if (discountType == 1) {
    discountAmount = discount;
    finalTotalAmt = finalTotalAmt - discountAmount;
  } else if (discountType == 2) {
    discountAmount = finalTotalAmt * discount / 100;
    finalTotalAmt = finalTotalAmt - discountAmount;
  }
  $("#discountAmount").text(number_format(discountAmount));

  // final amount calculation
  $("#finalAmount").text(number_format(finalTotalAmt));
  $("#finalTotalAmt").val(finalTotalAmt.toFixed(2));
};
listen("keyup", "#discount", function () {
  var value = $(this).val();
  if (discountType == 2 && value > 100) {
    displayErrorMessage("On Percentage you can only give maximum 100% discount");
    $(this).val(value.slice(0, -1));
    return false;
  }
  calculateFinalAmount();
});
listenChange(".invoice-taxes", function () {
  calculateFinalAmount();
});
listenClick("#saveAsDraft,#saveAndSend", function (event) {
  event.preventDefault();
  var tax_id = [];
  var i = 0;
  var tax = [];
  var j = 0;
  $(".tax-tr").each(function () {
    var data = $(this).find(".tax option:selected").map(function () {
      return $(this).data("id");
    }).get();
    if (data != "") {
      tax_id[i++] = data;
    } else {
      tax_id[i++] = 0;
    }
    var val = $(this).find(".tax option:selected").map(function () {
      return $(this).val();
    }).get();
    if (val != "") {
      tax[j++] = val;
    } else {
      tax[j++] = 0;
    }
  });
  var invoiceStates = $(this).data("status");
  var myForm = document.getElementById("invoiceForm");
  var formData = new FormData(myForm);
  formData.append("status", invoiceStates);
  formData.append("tax_id", JSON.stringify(tax_id));
  formData.append("tax", JSON.stringify(tax));
  if (invoiceStates == 1) {
    swal({
      title: Lang.get("messages.invoice.send") + " " + Lang.get("messages.invoice.invoice") + " !",
      text: Lang.get("messages.invoice.Are_you_sure_to_send_invoice") + " ?",
      icon: "warning",
      buttons: {
        confirm: Lang.get("messages.tax.yes") + " " + Lang.get("messages.invoice.send"),
        cancel: Lang.get("messages.tax.no") + " " + Lang.get("messages.common.cancel")
      }
    }).then(function (willSend) {
      if (willSend) {
        screenLock();
        $.ajax({
          url: route("invoices.store"),
          type: "POST",
          dataType: "json",
          data: formData,
          processData: false,
          contentType: false,
          beforeSend: function beforeSend() {
            startLoader();
          },
          success: function success(result) {
            Turbo.visit(route("invoices.index"));
          },
          error: function error(result) {
            displayErrorMessage(result.responseJSON.message);
          },
          complete: function complete() {
            stopLoader();
            screenUnLock();
          }
        });
      }
    });
  } else {
    screenLock();
    $.ajax({
      url: route("invoices.store"),
      type: "POST",
      dataType: "json",
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function beforeSend() {
        startLoader();
      },
      success: function success(result) {
        displaySuccessMessage(result.message);
        Turbo.visit(route("invoices.index"));
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        stopLoader();
        screenUnLock();
      }
    });
  }
});
listenClick("#editSaveAndSend,#editSave", function (event) {
  event.preventDefault();
  var invoiceStatus = $(this).data("status");
  var tax_id = [];
  var i = 0;
  var tax = [];
  var j = 0;
  $(".tax-tr").each(function () {
    var data = $(this).find(".tax option:selected").map(function () {
      return $(this).data("id");
    }).get();
    if (data != "") {
      tax_id[i++] = data;
    } else {
      tax_id[i++] = 0;
    }
    var val = $(this).find(".tax option:selected").map(function () {
      return $(this).val();
    }).get();
    if (val != "") {
      tax[j++] = val;
    } else {
      tax[j++] = 0;
    }
  });
  var formData = $("#invoiceEditForm").serialize() + "&invoiceStatus=" + invoiceStatus + "&tax_id=" + JSON.stringify(tax_id) + "&tax=" + JSON.stringify(tax);
  if (invoiceStatus == 1) {
    swal({
      title: Lang.get("messages.invoice.send") + " " + Lang.get("messages.invoice.invoice") + " !",
      text: Lang.get("messages.invoice.Are_you_sure_to_send_invoice") + " ?",
      icon: "warning",
      buttons: [Lang.get("messages.tax.yes") + " " + Lang.get("messages.invoice.send"), Lang.get("messages.tax.no") + " " + Lang.get("messages.common.cancel")]
    }).then(function (willSend) {
      if (!willSend) {
        screenLock();
        $.ajax({
          url: $("#invoiceUpdateUrl").val(),
          type: "PUT",
          dataType: "json",
          data: formData,
          beforeSend: function beforeSend() {
            startLoader();
          },
          success: function success(result) {
            displaySuccessMessage(result.message);
            Turbo.visit(route("invoices.index"));
          },
          error: function error(result) {
            displayErrorMessage(result.responseJSON.message);
          },
          complete: function complete() {
            stopLoader();
            screenUnLock();
          }
        });
      }
    });
  } else if (invoiceStatus == 0) {
    screenLock();
    $.ajax({
      url: $("#invoiceUpdateUrl").val(),
      type: "PUT",
      dataType: "json",
      data: formData,
      beforeSend: function beforeSend() {
        startLoader();
      },
      success: function success(result) {
        displaySuccessMessage(result.message);
        Turbo.visit(route("invoices.index"));
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        stopLoader();
        screenUnLock();
      }
    });
  }
});
listen("input", ".qty", function () {
  var quantity = $(this).val();
  if (quantity.length == 8) {
    $(this).val(quantity.slice(0, -1));
  }
});

/***/ }),

/***/ "./resources/assets/js/invoice/invoice.js":
/*!************************************************!*\
  !*** ./resources/assets/js/invoice/invoice.js ***!
  \************************************************/
/***/ (() => {

var invoiceTableName = '';
document.addEventListener('turbo:load', loadInvoice);
function loadInvoice() {
  initializeSelect2Invoice();
  if ($('#status').val() == '') {
    $('#status_filter').val(5).trigger('change');
  }
  invoiceTableName = '#tblInvoices';
  var uri = window.location.toString();
  if (uri.indexOf('?') > 0) {
    var clean_uri = uri.substring(0, uri.indexOf('?'));
    window.history.replaceState({}, document.title, clean_uri);
  }
}
function initializeSelect2Invoice() {
  if (!select2NotExists('#status_filter')) {
    return false;
  }
  removeSelect2Container(['#status_filter']);
  $('#status_filter').select2({
    placeholder: 'All'
  });
}
listenClick('.invoice-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('invoices.destroy', id), invoiceTableName, Lang.get('messages.invoice.invoice'));
});
listenClick('#resetFilter', function () {
  $('#status_filter').val(5).trigger('change');
  $('#status_filter').select2({
    placeholder: 'All'
  });
});
listenClick('.reminder-btn', function () {
  var invoiceId = $(this).data('id');
  $.ajax({
    type: 'POST',
    url: route('invoice.payment-reminder', invoiceId),
    beforeSend: function beforeSend() {
      screenLock();
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick('.update-recurring', function (e) {
  e.preventDefault();
  var invoiceId = $(this).data('id');
  $.ajax({
    type: 'POST',
    url: route('update-recurring-status', invoiceId),
    beforeSend: function beforeSend() {
      screenLock();
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/invoice/invoice_payment_history.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/invoice/invoice_payment_history.js ***!
  \****************************************************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', invoicePaymentHistory);
function invoicePaymentHistory() {
  // payment mail in click after view payment transitions 
  if (!$('#paymentHistory-tab').length) {
    return false;
  }
  setTimeout(function () {
    var activeTab = location.href;
    var tabParameter = activeTab.substring(activeTab.indexOf("?active") + 8);
    $('.nav-item button[data-bs-target="#' + tabParameter + '"]').click();
  }, 100);
}
function searchDataTable(tbl, selector) {
  var filterSearch = document.querySelector(selector);
  filterSearch.addEventListener('keyup', function (e) {
    tbl.search(e.target.value).draw();
  });
  filterSearch.addEventListener('search', function (e) {
    tbl.search(e.target.value).draw();
  });
}

/***/ }),

/***/ "./resources/assets/js/invoice/invoice_send.js":
/*!*****************************************************!*\
  !*** ./resources/assets/js/invoice/invoice_send.js ***!
  \*****************************************************/
/***/ (() => {

listenClick(".send-btn", function (event) {
  var invoiceId = $(event.currentTarget).data("id");
  var status = 1;
  swal({
    title: Lang.get("messages.common.send_invoice") + " !",
    text: Lang.get("messages.common.are_you_sure_send"),
    icon: "warning",
    buttons: [Lang.get("messages.common.no_cancel"), Lang.get("messages.common.yes_send")]
  }).then(function (willSend) {
    if (willSend) {
      changeInvoiceStatus(invoiceId, status);
    }
  });
});
function changeInvoiceStatus(invoiceId, status) {
  $.ajax({
    url: route("send-invoice", {
      invoice: invoiceId,
      status: status
    }),
    type: "post",
    dataType: "json",
    success: function success(obj) {
      if (obj.success) {
        window.location.reload();
      }
      swal.fire({
        icon: "success",
        title: "Send!",
        confirmButtonColor: "#009ef7",
        text: header + " " + Lang.get("messages.common.successfully"),
        timer: 2000
      });
    },
    error: function error(data) {
      swal.fire({
        title: "",
        text: data.responseJSON.message,
        confirmButtonColor: "#009ef7",
        icon: "error",
        timer: 5000
      });
    }
  });
}

/***/ }),

/***/ "./resources/assets/js/jquery.toast.min.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/jquery.toast.min.js ***!
  \*************************************************/
/***/ (() => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
"function" != typeof Object.create && (Object.create = function (t) {
  function o() {}
  return o.prototype = t, new o();
}), function (t, o, i, s) {
  "use strict";

  var n = {
    _positionClasses: ["bottom-left", "bottom-right", "top-right", "top-left", "bottom-center", "top-center", "mid-center"],
    _defaultIcons: ["success", "error", "info", "warning"],
    init: function init(o, i) {
      this.prepareOptions(o, t.toast.options), this.process();
    },
    prepareOptions: function prepareOptions(o, i) {
      var s = {};
      "string" == typeof o || o instanceof Array ? s.text = o : s = o, this.options = t.extend({}, i, s);
    },
    process: function process() {
      this.setup(), this.addToDom(), this.position(), this.bindToast(), this.animate();
    },
    setup: function setup() {
      var o = "";
      if (this._toastEl = this._toastEl || t("<div></div>", {
        "class": "jq-toast-single"
      }), o += '<span class="jq-toast-loader"></span>', this.options.allowToastClose && (o += '<span class="close-jq-toast-single">&times;</span>'), this.options.text instanceof Array) {
        this.options.heading && (o += '<h2 class="jq-toast-heading">' + this.options.heading + "</h2>"), o += '<ul class="jq-toast-ul">';
        for (var i = 0; i < this.options.text.length; i++) o += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + "</li>";
        o += "</ul>";
      } else this.options.heading && (o += '<h2 class="jq-toast-heading">' + this.options.heading + "</h2>"), o += this.options.text;
      this._toastEl.html(o), !1 !== this.options.bgColor && this._toastEl.css("background-color", this.options.bgColor), !1 !== this.options.textColor && this._toastEl.css("color", this.options.textColor), this.options.textAlign && this._toastEl.css("text-align", this.options.textAlign), !1 !== this.options.icon && (this._toastEl.addClass("jq-has-icon"), -1 !== t.inArray(this.options.icon, this._defaultIcons) && this._toastEl.addClass("jq-icon-" + this.options.icon)), !1 !== this.options["class"] && this._toastEl.addClass(this.options["class"]);
    },
    position: function position() {
      "string" == typeof this.options.position && -1 !== t.inArray(this.options.position, this._positionClasses) ? "bottom-center" === this.options.position ? this._container.css({
        left: t(o).outerWidth() / 2 - this._container.outerWidth() / 2,
        bottom: 20
      }) : "top-center" === this.options.position ? this._container.css({
        left: t(o).outerWidth() / 2 - this._container.outerWidth() / 2,
        top: 20
      }) : "mid-center" === this.options.position ? this._container.css({
        left: t(o).outerWidth() / 2 - this._container.outerWidth() / 2,
        top: t(o).outerHeight() / 2 - this._container.outerHeight() / 2
      }) : this._container.addClass(this.options.position) : "object" == _typeof(this.options.position) ? this._container.css({
        top: this.options.position.top ? this.options.position.top : "auto",
        bottom: this.options.position.bottom ? this.options.position.bottom : "auto",
        left: this.options.position.left ? this.options.position.left : "auto",
        right: this.options.position.right ? this.options.position.right : "auto"
      }) : this._container.addClass("bottom-left");
    },
    bindToast: function bindToast() {
      var t = this;
      this._toastEl.on("afterShown", function () {
        t.processLoader();
      }), this._toastEl.find(".close-jq-toast-single").on("click", function (o) {
        o.preventDefault(), "fade" === t.options.showHideTransition ? (t._toastEl.trigger("beforeHide"), t._toastEl.fadeOut(function () {
          t._toastEl.trigger("afterHidden");
        })) : "slide" === t.options.showHideTransition ? (t._toastEl.trigger("beforeHide"), t._toastEl.slideUp(function () {
          t._toastEl.trigger("afterHidden");
        })) : (t._toastEl.trigger("beforeHide"), t._toastEl.hide(function () {
          t._toastEl.trigger("afterHidden");
        }));
      }), "function" == typeof this.options.beforeShow && this._toastEl.on("beforeShow", function () {
        t.options.beforeShow();
      }), "function" == typeof this.options.afterShown && this._toastEl.on("afterShown", function () {
        t.options.afterShown();
      }), "function" == typeof this.options.beforeHide && this._toastEl.on("beforeHide", function () {
        t.options.beforeHide();
      }), "function" == typeof this.options.afterHidden && this._toastEl.on("afterHidden", function () {
        t.options.afterHidden();
      });
    },
    addToDom: function addToDom() {
      var o = t(".jq-toast-wrap");
      if (0 === o.length ? (o = t("<div></div>", {
        "class": "jq-toast-wrap"
      }), t("body").append(o)) : (!this.options.stack || isNaN(parseInt(this.options.stack, 10))) && o.empty(), o.find(".jq-toast-single:hidden").remove(), o.append(this._toastEl), this.options.stack && !isNaN(parseInt(this.options.stack), 10)) {
        var i = o.find(".jq-toast-single").length - this.options.stack;
        i > 0 && t(".jq-toast-wrap").find(".jq-toast-single").slice(0, i).remove();
      }
      this._container = o;
    },
    canAutoHide: function canAutoHide() {
      return !1 !== this.options.hideAfter && !isNaN(parseInt(this.options.hideAfter, 10));
    },
    processLoader: function processLoader() {
      if (!this.canAutoHide() || !1 === this.options.loader) return !1;
      var t = this._toastEl.find(".jq-toast-loader"),
        o = (this.options.hideAfter - 400) / 1e3 + "s",
        i = this.options.loaderBg,
        s = t.attr("style") || "";
      s = s.substring(0, s.indexOf("-webkit-transition")), s += "-webkit-transition: width " + o + " ease-in;                       -o-transition: width " + o + " ease-in;                       transition: width " + o + " ease-in;                       background-color: " + i + ";", t.attr("style", s).addClass("jq-toast-loaded");
    },
    animate: function animate() {
      var t = this;
      if (this._toastEl.hide(), this._toastEl.trigger("beforeShow"), "fade" === this.options.showHideTransition.toLowerCase() ? this._toastEl.fadeIn(function () {
        t._toastEl.trigger("afterShown");
      }) : "slide" === this.options.showHideTransition.toLowerCase() ? this._toastEl.slideDown(function () {
        t._toastEl.trigger("afterShown");
      }) : this._toastEl.show(function () {
        t._toastEl.trigger("afterShown");
      }), this.canAutoHide()) {
        t = this;
        o.setTimeout(function () {
          "fade" === t.options.showHideTransition.toLowerCase() ? (t._toastEl.trigger("beforeHide"), t._toastEl.fadeOut(function () {
            t._toastEl.trigger("afterHidden");
          })) : "slide" === t.options.showHideTransition.toLowerCase() ? (t._toastEl.trigger("beforeHide"), t._toastEl.slideUp(function () {
            t._toastEl.trigger("afterHidden");
          })) : (t._toastEl.trigger("beforeHide"), t._toastEl.hide(function () {
            t._toastEl.trigger("afterHidden");
          }));
        }, this.options.hideAfter);
      }
    },
    reset: function reset(o) {
      "all" === o ? t(".jq-toast-wrap").remove() : this._toastEl.remove();
    },
    update: function update(t) {
      this.prepareOptions(t, this.options), this.setup(), this.bindToast();
    }
  };
  t.toast = function (t) {
    var o = Object.create(n);
    return o.init(t, this), {
      reset: function reset(t) {
        o.reset(t);
      },
      update: function update(t) {
        o.update(t);
      }
    };
  }, t.toast.options = {
    text: "",
    heading: "",
    showHideTransition: "fade",
    allowToastClose: !0,
    hideAfter: 3e3,
    loader: !0,
    loaderBg: "#9EC600",
    stack: 5,
    position: "bottom-left",
    bgColor: !1,
    textColor: !1,
    textAlign: "left",
    icon: !1,
    beforeShow: function beforeShow() {},
    afterShown: function afterShown() {},
    beforeHide: function beforeHide() {},
    afterHidden: function afterHidden() {}
  };
}(jQuery, window, document);

/***/ }),

/***/ "./resources/assets/js/languageChange/languageChange.js":
/*!**************************************************************!*\
  !*** ./resources/assets/js/languageChange/languageChange.js ***!
  \**************************************************************/
/***/ (() => {

listenClick('.languageSelection', function () {
  var changeLanguageName = $(this).attr('data-prefix-value');
  $.ajax({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    type: 'POST',
    url: '/language-change-name',
    data: {
      languageName: changeLanguageName
    },
    success: function success() {
      location.reload();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/payment/payment.js":
/*!************************************************!*\
  !*** ./resources/assets/js/payment/payment.js ***!
  \************************************************/
/***/ (() => {

var paymentTableName = "";
document.addEventListener("turbo:load", loadPayment);
function loadPayment() {
  initializeSelect2Payment();
  paymentDateFilter();
  paymentTableName = "#tblPayments";
}
function initializeSelect2Payment() {
  if (!select2NotExists("#adminPaymentInvoiceId")) {
    return false;
  }
  if ($("#adminPaymentInvoiceId").hasClass("select2-hidden-accessible")) {
    $("#adminPaymentInvoiceId .select2-container").remove();
  }
  $("#adminPaymentInvoiceId").select2({
    dropdownParent: $("#paymentModal")
  });
}
listenClick(".admin-payment-delete-btn", function (event) {
  var paymentId = $(event.currentTarget).attr("data-id");
  deleteItem(route("payments.destroy", paymentId), paymentTableName, Lang.get("messages.invoice.payment"));
});
listenClick(".addPayment", function () {
  var currentDtFormat = currentDateFormat;
  $.ajax({
    url: route("get-current-date-format"),
    type: "get",
    success: function success(data) {
      currentDtFormat = data;
      $("#payment_date").flatpickr({
        defaultDate: new Date(),
        dateFormat: data,
        maxDate: new Date(),
        locale: getUserLanguages
      });
      $("#paymentModal").appendTo("body").modal("show");
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
  setTimeout(function () {
    $("#adminPaymentInvoiceId").select2({
      dropdownParent: $("#paymentModal")
    });
  }, 200);
});
function getCurrentDateFormat() {
  var currentDtFormat = currentDateFormat;
  $.ajax({
    url: route("get-current-date-format"),
    type: "get",
    success: function success(data) {
      currentDtFormat = data;
      return currentDtFormat;
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      return currentDtFormat;
    }
  });
  return currentDtFormat;
}
listenHiddenBsModal("#paymentModal", function () {
  $("#adminPaymentInvoiceId").val(null).trigger("change");
  resetModalForm("#paymentForm");
});
listenSubmit("#paymentForm", function (e) {
  e.preventDefault();
  if ($("#payment_note").val().trim().length == 0) {
    displayErrorMessage("Note field is Required");
    return false;
  }
  var btnSubmitEle = $(this).find("#btnPay");
  setAdminBtnLoader(btnSubmitEle);
  $.ajax({
    url: route("client.payments.store"),
    type: "POST",
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        setAdminBtnLoader(btnSubmitEle);
        $("#paymentModal").modal("hide");
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      setAdminBtnLoader(btnSubmitEle);
    }
  });
});
listenChange(".invoice", function () {
  var invoiceId = $(this).val();
  if (isEmpty(invoiceId)) {
    $("#due_amount").val(0);
    $("#paid_amount").val(0);
    return false;
  }
  $.ajax({
    url: route("payments.get-invoiceAmount", invoiceId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        $(".invoice-currency-code").text(result.data.currencyCode);
        $("#due_amount").val(number_format(result.data.totalDueAmount));
        $("#paid_amount").val(number_format(result.data.totalPaidAmount));
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick(".admin-payment-edit-btn", function (event) {
  var paymentId = $(event.currentTarget).attr("data-id");
  paymentRenderData(paymentId);
});
function paymentRenderData(paymentId) {
  $.ajax({
    url: route("payments.edit", paymentId),
    type: "GET",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#edit_invoice_id").val(result.data.invoice.invoice_id);
        $("#edit_amount").val(result.data.amount);
        $("#edit_payment_date").flatpickr({
          defaultDate: result.data.payment_date,
          dateFormat: currentDateFormat,
          maxDate: new Date(),
          locale: getUserLanguages
        });
        $(".edit-invoice-currency-code").text(result.data.currencyCode);
        $("#edit_payment_note").val(result.data.notes);
        $("#paymentId").val(result.data.id);
        $("#transactionId").val(result.data.payment_id);
        $("#invoice").val(result.data.invoice_id);
        $("#totalDue_amount").val(number_format(result.data.DueAmount.original.data.totalDueAmount));
        $("#totalPaid_amount").val(number_format(result.data.DueAmount.original.data.totalPaidAmount));
        $("#editPaymentModal").appendTo("body").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
listenSubmit("#editPaymentForm", function (event) {
  event.preventDefault();
  var paymentId = $("#paymentId").val();
  $.ajax({
    url: route("payments.update", {
      payment: paymentId
    }),
    type: "put",
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#editPaymentModal").modal("hide");
        $("#tblPayments").DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenChange(".transaction-approve", function () {
  var id = $(this).attr("data-id");
  var status = $(this).val();
  $.ajax({
    url: route("change-transaction-status", id),
    type: "GET",
    data: {
      id: id,
      status: status
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      livewire.emit("refreshDatatable");
      livewire.emit("resetPageTable");
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenChange("#paymentAttachment", function () {
  var ext = $(this).val().split(".").pop().toLowerCase();
  if ($.inArray(ext, ["png", "jpg", "jpeg", "pdf"]) == -1) {
    displayErrorMessage("The attachment must be a file of type: jpg, png, jpeg, pdf");
    $(this).val("");
  }
  var imageSize = 0;
  for (var i = 0; i < this.files.length; i++) {
    imageSize += this.files[i].size;
  }
  if (imageSize >= 10485760) {
    displayErrorMessage("The maximum attachment size 10 mb allowed.");
    $(this).val("");
  }
  return false;
});
listen("input", "#amount", function () {
  var amount = $(this).val();
  if (amount.charAt(amount.length - 4) === ".") {
    $(this).val(amount.slice(0, -1));
  }
});
function paymentDateFilter() {
  var start = moment().startOf("month");
  var end = moment().endOf("month");
  if (!$("#paymentDateFilter").length) {
    return;
  }
  var dateRange = $("#paymentDateFilter");
  function cb(start, end) {
    window.livewire.emit("dateFilter", start.format("MM/DD/YYYY") + " - " + end.format("MM/DD/YYYY"));
    $("#paymentDateFilter").val(start.format("MM/DD/YYYY") + " - " + end.format("MM/DD/YYYY"));
  }
  dateRange.daterangepicker({
    startDate: start,
    endDate: end,
    showDropdowns: true,
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "Last 7 Days": [moment().subtract(6, "days"), moment()],
      "Last 30 Days": [moment().subtract(29, "days"), moment()],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
    }
  }, cb);
  cb(start, end);
  dateRange.on("apply.daterangepicker", function (ev, picker) {
    isPickerApply = true;
    start = picker.startDate.format("YYYY-MM-DD");
    end = picker.endDate.format("YYYY-MM-DD");
    window.livewire.emit("dateFilter", start + " - " + end);
  });
}
listenClick("#adminPaymentExcelExport", function (e) {
  e.preventDefault();
  $.ajax({
    url: route("admin.paymentsExcel"),
    type: "GET",
    data: {
      date: $("#paymentDateFilter").val()
    },
    xhrFields: {
      responseType: "blob"
    },
    success: function success(response) {
      var blob = new Blob([response]);
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Payment-Excel" + ".xlsx";
      link.click();
    },
    error: function error(blob) {
      console.log(blob);
    }
  });
});
listenClick("#adminPaymentPdfExport", function (e) {
  e.preventDefault();
  $.ajax({
    url: route("admin.payments.pdf"),
    type: "GET",
    data: {
      date: $("#paymentDateFilter").val()
    },
    xhrFields: {
      responseType: "blob"
    },
    success: function success(response) {
      var blob = new Blob([response]);
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "payments" + ".pdf";
      link.click();
    },
    error: function error(blob) {
      console.log(blob);
    }
  });
});

// public payment invoice JS code
listenClick(".open-public-payment-modal", function (event) {
  $("#publicPaymentModal").appendTo("body").modal("show");
});

// public payment store JS code
listenSubmit("#publicPaymentForm", function (e) {
  var _this = this;
  e.preventDefault();
  if ($("#payment_note").val().trim().length == 0) {
    displayErrorMessage("Note field is Required");
    return false;
  }
  var btnSubmitEle = $(this).find("#btnPublicPay");
  setAdminBtnLoader(btnSubmitEle);
  var payloadData = {
    amount: parseFloat($("#amount").val()),
    invoiceId: parseInt($("#invoice_id").val()),
    notes: $("#payment_note").val()
  };
  if (paymentMode == 1) {
    $.ajax({
      url: route("client.payments.store"),
      type: "POST",
      data: new FormData(this),
      processData: false,
      contentType: false,
      success: function success(result) {
        if (result.success) {
          displaySuccessMessage(result.message);
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        setAdminBtnLoader(btnSubmitEle);
      }
    });
  } else if (paymentMode == 2) {
    $.post(route("stripe-payment"), payloadData).done(function (result) {
      var sessionId = result.data.sessionId;
      stripe.redirectToCheckout({
        sessionId: sessionId
      }).then(function (result) {
        $(this).html("Make Payment").removeClass("disabled");
        manageAjaxErrors(result);
      });
    })["catch"](function (error) {
      $(_this).html("Make Payment").removeClass("disabled");
      manageAjaxErrors(error);
    });
  } else if (paymentMode == 3) {
    $.ajax({
      type: "GET",
      url: route("public.paypal.init"),
      data: {
        amount: payloadData.amount,
        invoiceId: payloadData.invoiceId,
        notes: payloadData.notes
      },
      success: function success(result) {
        if (result.status == "CREATED") {
          var redirectTo = "";
          $.each(result.links, function (key, val) {
            if (val.rel == "approve") {
              redirectTo = val.href;
            }
          });
          location.href = redirectTo;
        } else {
          location.href = result.url;
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        setAdminBtnLoader(btnSubmitEle);
      }
    });
  } else if (paymentMode == 5) {
    $.ajax({
      type: "GET",
      url: route("public.razorpay.init"),
      data: $(this).serialize(),
      success: function success(result) {
        if (result.success) {
          $("#publicPaymentModal").modal("hide");
          var _result$data = result.data,
            id = _result$data.id,
            amount = _result$data.amount,
            name = _result$data.name,
            email = _result$data.email,
            invoiceId = _result$data.invoiceId,
            invoice_id = _result$data.invoice_id,
            notes = _result$data.notes;
          options.description = JSON.stringify({
            invoice_id: invoice_id,
            notes: notes
          });
          options.order_id = id;
          options.amount = amount;
          options.prefill.name = name;
          options.prefill.email = email;
          options.prefill.invoiceId = invoiceId;
          var razorPay = new Razorpay(options);
          razorPay.open();
          razorPay.on("public.payment.failed");
        }
      },
      error: function error(result) {
        displayErrorMessage(result.responseJSON.message);
      },
      complete: function complete() {
        setAdminBtnLoader(btnSubmitEle);
      }
    });
  }
});
listenHiddenBsModal("#publicPaymentModal", function () {
  resetModalForm("#publicPaymentForm", "#publicPaymentValidationErrorsBox");
});

/***/ }),

/***/ "./resources/assets/js/payment_qr_code/payment-qr-code.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/payment_qr_code/payment-qr-code.js ***!
  \****************************************************************/
/***/ (() => {

listenClick(".open-payment-qr-code-modal", function () {
  $("#addPaymentQrCodeForm")[0].reset();
  $("#paymentQrCodeInputImage").css("background-image", 'url("/assets/images/avatar.png")');
  $("#addPaymentQrCodeModal").appendTo("body").modal("show");
});
listenSubmit("#addPaymentQrCodeForm", function (e) {
  e.preventDefault();
  if (isDoubleClicked($(this))) return;
  $.ajax({
    url: route("payment-qr-codes.store"),
    type: "POST",
    data: new FormData(this),
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#addPaymentQrCodeModal").modal("hide");
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#paymentQRCodeTbl").DataTable().ajax.reload(null, false);
        // Turbo.visit(route("payment-qr-codes.index"));
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick(".qrcode-edit-btn", function (event) {
  var paymentQrCodeId = $(event.currentTarget).attr("data-id");
  taxRenderData(paymentQrCodeId);
});
function taxRenderData(paymentQrCodeId) {
  $.ajax({
    url: route("payment-qr-codes.edit", paymentQrCodeId),
    type: "GET",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#editQrCodeTitle").val(result.data.title);
        $(".qr_code_image").css("background-image", "url('" + result.data.qr_image + "')");
        $("#paymentQrCodeId").val(result.data.id);
        $("#editPaymentQrCodeModal").appendTo("body").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
listenSubmit("#editPaymentQrCodeForm", function (event) {
  event.preventDefault();
  var paymentQrCodeId = $("#paymentQrCodeId").val();
  $.ajax({
    url: route("payment-update", paymentQrCodeId),
    type: "post",
    data: new FormData(this),
    contentType: false,
    processData: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $("#editPaymentQrCodeModal").modal("hide");
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#paymentQRCodeTbl").DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick(".qrcode-delete-btn", function (event) {
  var paymentQrCode = $(event.currentTarget).attr("data-id");
  deleteItem(route("payment-qr-codes.destroy", paymentQrCode), "#paymentQRCodeTbl", Lang.get("messages.payment_qr_codes.payment_qr_code"));
});
listenChange(".qr-status", function (event) {
  var paymentQrCodeId = $(event.currentTarget).attr("data-id");
  updateStatus(paymentQrCodeId);
});
function updateStatus(paymentQrCodeId) {
  $.ajax({
    url: route("payment-qr-codes.default-status", paymentQrCodeId),
    method: "post",
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
      }
    }
  });
}

/***/ }),

/***/ "./resources/assets/js/product/create-edit.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/product/create-edit.js ***!
  \****************************************************/
/***/ (() => {

document.addEventListener('turbo:load', createEditProduct);
function createEditProduct() {
  loadSelect2Dropdown();
  $('#adminProductUnitId').trigger('change');
}
function loadSelect2Dropdown() {
  var categorySelect2 = $('#adminCategoryId');
  if (!categorySelect2.length) {
    return false;
  }
  if ($('#adminCategoryId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminBrandId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminBarcodeSymbologyId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminProductUnitId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminSaleUnitId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminPurchaseUnitId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminTaxTypeId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminWarehouseId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminSupplierId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  if ($('#adminProductStatusId').hasClass("select2-hidden-accessible")) {
    $('.select2-container').remove();
  }
  $('#adminCategoryId').select2({
    width: '100%'
  });
  $('#adminBrandId').select2({
    width: '100%'
  });
  $('#adminBarcodeSymbologyId').select2({
    width: '100%'
  });
  $('#adminProductUnitId').select2({
    width: '100%'
  });
  $('#adminSaleUnitId').select2({
    width: '100%'
  });
  $('#adminPurchaseUnitId').select2({
    width: '100%'
  });
  $('#adminTaxTypeId').select2({
    width: '100%'
  });
  $('#adminWarehouseId').select2({
    width: '100%'
  });
  $('#adminSupplierId').select2({
    width: '100%'
  });
  $('#adminProductStatusId').select2({
    width: '100%'
  });
}
listenChange('#adminProductUnitId', function () {
  var v = $('#adminProductUnitId').val();
  var sale_el = $('#adminSaleUnitId');
  var purchase_el = $('#adminPurchaseUnitId');
  sale_el.find('option').remove().end();
  purchase_el.find('option').remove().end();
  if (sale_el.hasClass("select2-hidden-accessible")) {
    sale_el.select2('destroy');
  }
  if (purchase_el.hasClass("select2-hidden-accessible")) {
    purchase_el.select2('destroy');
  }
  if (v !== '' && typeof v !== 'undefined') {
    if (!$.isEmptyObject(base_unit_children[v])) {
      sale_el.append('<option value="" ></option>');
      purchase_el.append('<option value="" ></option>');
      $.each(base_unit_children[v], function (k, v) {
        sale_el.append('<option value="' + k + '" >' + v + '</option>');
        purchase_el.append('<option value="' + k + '" >' + v + '</option>');
      });
    }
  }
  sale_el.val(sale_unit);
  purchase_el.val(purchase_unit);
  sale_el.select2({
    width: '100%',
    placeholder: "Choose Sale Unit"
  });
  purchase_el.select2({
    width: '100%',
    placeholder: "Choose Purchase Unit"
  });
});
function setSaleAndPurchaseUnits() {
  var v = $('#adminProductUnitId').val();
  var sale_el = $('#adminSaleUnitId');
  var purchase_el = $('#adminPurchaseUnitId');
  sale_el.select2('destroy');
  purchase_el.select2('destroy');
  if (v === '' || v === null) {}
}
listenChange('#countryId', function () {
  $.ajax({
    url: route('states-list'),
    type: 'get',
    dataType: 'json',
    data: {
      countryId: $(this).val()
    },
    success: function success(data) {
      $('#stateId').empty();
      $('#stateId').select2({
        placeholder: 'Select State',
        allowClear: false
      });
      $('#stateId').append($('<option value=""></option>').text('Select State'));
      $.each(data.data, function (i, v) {
        $('#stateId').append($('<option></option>').attr('value', i).text(v));
      });
      if ($('#isEdit').val() && $('#stateId').val()) {
        $('#stateId').val($('#stateId').val()).trigger('change');
      }
    }
  });
});
listenChange('#stateId', function () {
  $.ajax({
    url: route('cities-list'),
    type: 'get',
    dataType: 'json',
    data: {
      stateId: $(this).val(),
      country: $('#countryId').val()
    },
    success: function success(data) {
      $('#cityId').empty();
      $('#cityId').select2({
        placeholder: 'Select City',
        allowClear: false
      });
      $.each(data.data, function (i, v) {
        $('#cityId').append($('<option></option>').attr('value', i).text(v));
      });
      if ($('#isEdit').val() && $('#cityId').val()) {
        $('#cityId').val($('#cityId').val()).trigger('change');
      }
    }
  });
});
listenClick('.remove-image', function () {
  defaultAvatarImagePreview('#previewImage', 1);
});
listenSubmit('#clientForm, #editClientForm', function () {
  if ($('#error-msg').text() !== '') {
    $('#phoneNumber').focus();
    return false;
  }
});
listenKeyup('#code', function () {
  return $('#code').val(this.value.toUpperCase());
});
listenClick('#autoCode', function () {
  var code = Math.random().toString(36).toUpperCase().substr(2, 6);
  $('#code').val(code);
});
listenClick('.remove-image', function () {
  defaultImagePreview('#previewImage', 1);
});
listenChange('#productImages', function () {
  var _this = this;
  var _loop = function _loop() {
    var filereader = new FileReader();
    var img_preview = "<div class='previewItem custom-preview position-relative cursor-pointer' data-key='0'>";
    img_preview += '<img class="imagePreview" src="" />';
    img_preview += '<button type="button" class="remove-btn p-0"><i class="fa fa-trash"></i></button>';
    img_preview += '</div>';
    var $img = jQuery.parseHTML(img_preview);
    filereader.onload = function () {
      $($img).find('img').attr("src", this.result);
    };
    filereader.readAsDataURL(_this.files[i]);
    $(".imagePreviewContainer").append($img);
  };
  for (var i = 0; i < this.files.length; ++i) {
    _loop();
  }
});

/***/ }),

/***/ "./resources/assets/js/product/product.js":
/*!************************************************!*\
  !*** ./resources/assets/js/product/product.js ***!
  \************************************************/
/***/ (() => {

listenClick('.product-delete-btn', function (event) {
  var productId = $(event.currentTarget).attr('data-id');
  deleteItem(route('products.destroy', productId), 'productTable', Lang.get('messages.product.product'));
});

/***/ }),

/***/ "./resources/assets/js/purchase-return/purchase-return.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/purchase-return/purchase-return.js ***!
  \****************************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditQuote);
function loadCreateEditQuote() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditQuote();
  momentFormat = convertToMomentFormat(currentDateFormat);
}
function initializeSelect2CreateEditQuote() {
  $("#supplier_id,#discountType,#status,#supplier_id").select2();
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  $("#purchase_return_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
}
window.returnQtyUpdate = function (obj) {
  livewire.emitTo('purchase-return.items', 'qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};
window.showPurchaseReturnProductModal = function (pid) {
  var pitems = $.parseJSON($('#purchase_return_items').val());
  var p = pitems[pid];
  if (typeof p !== 'undefined') {
    $('#purchaseProductModal').find('h2').html(p.name);
    $('#product_id').val(pid);
    $('#product_cost_id').val(p.product_cost);
    $('#tax_type_id').val(p.tax_type).select2();
    $('#tax_value_id').val(p.tax_value);
    $('#discount_type_id').val(p.discount_type).select2();
    $('#discount_value_id').val(p.discount_value);
    $('#purchaseProductModal').modal('show');
  }
  console.log(p);
};
listenClick('#updatePurchaseReturnProduct', function (event) {
  event.preventDefault();
  var product_cost = $('#product_cost_id').val();
  $('.product_cost').hide();
  if (product_cost === '' || product_cost === null) {
    $('.product_cost').html('Product cost required').show();
    return false;
  }
  livewire.emitTo('purchase-return.items', 'productUpdate', {
    'product_id': $('#product_id').val(),
    'product_cost': product_cost,
    'tax_type': $('#tax_type_id').val(),
    'tax_value': $('#tax_value_id').val(),
    'discount_type': $('#discount_type_id').val(),
    'discount_value': $('#discount_value_id').val()
  });
  $('#purchaseProductModal').modal('hide');
});
listenClick("#savePurchaseReturnForm", function (event) {
  event.preventDefault();
  var frm = $(this).parents('form');
  $('#warehouse_id').removeAttr('disabled');
  screenLock();
  $.ajax({
    url: frm.attr('action'),
    type: "POST",
    dataType: "json",
    data: $('#' + frm.attr('id')).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      displaySuccessMessage(res.result.message);
      Turbo.visit(route("purchases-returns.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick('.purchase-return-delete-btn', function (event) {
  var purchase_id = $(event.currentTarget).attr('data-id');
  deleteItem(route('purchases-returns.destroy', purchase_id), 'purchaseReturnTable', 'Purchase Return');
});
listenClick('.purchase-return-download-pdf', function (event) {
  var purchase_return_download_url = $(event.currentTarget).attr('data-url');
  screenUnLock();
  $.ajax({
    url: purchase_return_download_url,
    dataType: "json",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      console.log(res.data.purchase_return_pdf_url);
      window.open(res.data.purchase_return_pdf_url, '_blank');
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/purchase/purchase.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/purchase/purchase.js ***!
  \**************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditQuote);
function loadCreateEditQuote() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditQuote();
  momentFormat = convertToMomentFormat(currentDateFormat);
}
function initializeSelect2CreateEditQuote() {
  $("#supplier_id,#discountType,#status,#supplier_id").select2();
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  $("#purchase_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
}
window.qtyUpdate = function (obj) {
  livewire.emit('qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};
window.showProductModal = function (pid) {
  var pitems = $.parseJSON($('#purchase_items').val());
  var p = pitems[pid];
  if (typeof p !== 'undefined') {
    $('#purchaseProductModal').find('h2').html(p.name);
    $('#product_id').val(pid);
    $('#product_cost_id').val(p.product_cost);
    $('#tax_type_id').val(p.tax_type).select2();
    $('#tax_value_id').val(p.tax_value);
    $('#discount_type_id').val(p.discount_type).select2();
    $('#discount_value_id').val(p.discount_value);
    $('#purchaseProductModal').modal('show');
  }
  console.log(p);
};
listenClick('#updatePurchaseProduct', function (event) {
  event.preventDefault();
  var product_cost = $('#product_cost_id').val();
  $('.product_cost').hide();
  if (product_cost === '' || product_cost === null) {
    $('.product_cost').html('Product cost required').show();
    return false;
  }
  livewire.emit('productUpdate', {
    'product_id': $('#product_id').val(),
    'product_cost': product_cost,
    'tax_type': $('#tax_type_id').val(),
    'tax_value': $('#tax_value_id').val(),
    'discount_type': $('#discount_type_id').val(),
    'discount_value': $('#discount_value_id').val()
  });
  $('#purchaseProductModal').modal('hide');
});
listenClick("#savePurchaseForm", function (event) {
  event.preventDefault();
  var frm = $(this).parents('form');
  $('#warehouse_id').removeAttr('disabled');
  screenLock();
  $.ajax({
    url: frm.attr('action'),
    type: "POST",
    dataType: "json",
    data: $('#' + frm.attr('id')).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      displaySuccessMessage(res.result.message);
      Turbo.visit(route("purchases.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick('.purchase-delete-btn', function (event) {
  var purchase_id = $(event.currentTarget).attr('data-id');
  deleteItem(route('purchases.destroy', purchase_id), 'purchaseTable', 'Purchase');
});
listenClick('.purchase-download-pdf', function (event) {
  var purchase_download_url = $(event.currentTarget).attr('data-url');
  screenUnLock();
  $.ajax({
    url: purchase_download_url,
    dataType: "json",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      console.log(res.data.purchase_pdf_url);
      window.open(res.data.purchase_pdf_url, '_blank');
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/quote/create-edit.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/quote/create-edit.js ***!
  \**************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditQuote);
function loadCreateEditQuote() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditQuote();
  loadSelect2ClientData();
  momentFormat = convertToMomentFormat(currentDateFormat);
  if ($("#quoteNoteData").val() == true || $("#quoteTermData").val() == true) {
    $("#quoteAddNote").hide();
    $("#quoteRemoveNote").show();
    $("#quoteNoteAdd").show();
    $("#quoteTermRemove").show();
  } else {
    $("#quoteRemoveNote").hide();
    $("#quoteNoteAdd").hide();
    $("#quoteTermRemove").hide();
  }
  if ($("#quoteRecurring").val() == true) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
  if ($("#discountType").val() != 0) {
    $("#discount").removeAttr("disabled");
  } else {
    $("#discount").attr("disabled", "disabled");
  }
  calculateAndSetQuoteAmount();
}
function loadSelect2ClientData() {
  if (!$("#client_id").length && !$("#discountType").length) {
    return;
  }
  $("#client_id,#discountType,#status,#templateId").select2();
}
function initializeSelect2CreateEditQuote() {
  if (!select2NotExists(".product-quote")) {
    return false;
  }
  removeSelect2Container([".product-quote"]);
  $(".product-quote").select2({
    tags: true
  });
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  $(".payment-qr-code").select2();
  $("#client_id").focus();
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  var quoteDueDateFlatPicker = $("#quoteDueDate").flatpickr({
    defaultDate: currentDate,
    dateFormat: currentDateFormat,
    locale: getUserLanguages
  });
  var editQuoteDueDateVal = moment($("#editQuoteDueDateAdmin").val()).format(convertToMomentFormat(currentDateFormat));
  var editQuoteDueDateFlatPicker = $(".edit-quote-due-date").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editQuoteDueDateVal,
    locale: getUserLanguages
  });
  $("#quote_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#quote_date").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#quote_date").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
  var editQuoteDate = $("#editQuoteDate").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: moment($("#editQuoteDateAdmin").val()).format(convertToMomentFormat(currentDateFormat)),
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editQuoteDate").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#editQuoteDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editQuoteDueDateFlatPicker != "undefined") {
        editQuoteDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editQuoteDateAdmin").val(), momentFormat).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      } else {
        minDate = moment($("#editQuoteDateAdmin").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editQuoteDueDateFlatPicker != "undefined") {
        editQuoteDueDateFlatPicker.set("minDate", minDate);
      }
    }
  });
}
listenKeyup("#quoteId", function () {
  return $("#quoteId").val(this.value.toUpperCase());
});
listenClick("#quoteAddNote", function () {
  $("#quoteAddNote").hide();
  $("#quoteRemoveNote").show();
  $("#quoteNoteAdd").show();
  $("#quoteTermRemove").show();
});
listenClick("#quoteRemoveNote", function () {
  $("#quoteAddNote").show();
  $("#quoteRemoveNote").hide();
  $("#quoteNoteAdd").hide();
  $("#quoteTermRemove").hide();
  $("#quoteNote").val("");
  $("#quoteTerm").val("");
  $("#quoteAddNote").show();
});
listenClick("#formData_recurring-0", function () {
  if ($("#formData_recurring-0").prop("checked")) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
});
listenClick("#formData_recurring-1", function () {
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
});
listenChange("#discountType", function () {
  discountType = $(this).val();
  $("#discount").val(0);
  if (discountType == 1 || discountType == 2) {
    $("#discount").removeAttr("disabled");
    if (discountType == 2) {
      var value = $("#discount").val();
      $("#discount").val(value.substring(0, 2));
    }
  } else {
    $("#discount").attr("disabled", "disabled");
    $("#discount").val(0);
    $("#quoteDiscountAmount").text("0");
  }
  calculateDiscount();
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenClick("#addQuoteItem", function () {
  var data = {
    products: JSON.parse($("#products").val())
  };
  console.log(data);
  var quoteItemHtml = prepareTemplateRender("#quotesItemTemplate", data);
  console.log(quoteItemHtml);
  $(".quote-item-container").append(quoteItemHtml);
  $(".productId").select2({
    placeholder: "Select Product or Enter free text",
    tags: true
  });
  resetQuoteItemIndex();
});
var resetQuoteItemIndex = function resetQuoteItemIndex() {
  var index = 1;
  $(".quote-item-container>tr").each(function () {
    $(this).find(".item-number").text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      products: JSON.parse($("#products").val())
    };
    var quoteItemHtml = prepareTemplateRender("#quotesItemTemplate", data);
    $(".quote-item-container").append(quoteItemHtml);
    $(".productId").select2();
  }
};
listenClick(".delete-quote-item", function () {
  $(this).parents("tr").remove();
  resetQuoteItemIndex();
  calculateAndSetQuoteAmount();
});
listenChange(".product-quote", function () {
  var productId = $(this).val();
  if (isEmpty(productId)) {
    productId = 0;
  }
  var element = $(this);
  $.ajax({
    url: route("quotes.get-product", productId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        var price = "";
        $.each(result.data, function (id, productPrice) {
          if (id === productId) price = productPrice;
        });
        element.parent().parent().find("td .price-quote").val(price);
        element.parent().parent().find("td .qty-quote").val(1);
        $(".price-quote").trigger("keyup");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenKeyup(".qty-quote", function () {
  var qty = parseFloat($(this).val());
  var rate = $(this).parent().siblings().find(".price-quote").val();
  rate = parseFloat(removeCommas(rate));
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".quote-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetQuoteAmount();
});
listenKeyup(".price-quote", function () {
  var rate = $(this).val();
  rate = parseFloat(removeCommas(rate));
  var qty = $(this).parent().siblings().find(".qty-quote").val();
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".quote-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetQuoteAmount();
});
var calculateAmount = function calculateAmount(qty, rate) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    return price;
  } else {
    return 0;
  }
};
var calculateAndSetQuoteAmount = function calculateAndSetQuoteAmount() {
  var quoteTotalAmount = 0;
  $(".quote-item-container>tr").each(function () {
    var quoteItemTotal = $(this).find(".quote-item-total").text();
    quoteItemTotal = removeCommas(quoteItemTotal);
    quoteItemTotal = isEmpty($.trim(quoteItemTotal)) ? 0 : parseFloat(quoteItemTotal);
    quoteTotalAmount += quoteItemTotal;
  });
  quoteTotalAmount = parseFloat(quoteTotalAmount);
  if (isNaN(quoteTotalAmount)) {
    quoteTotalAmount = 0;
  }
  $("#quoteTotal").text(addCommas(quoteTotalAmount.toFixed(2)));

  //set hidden input value
  $("#quoteTotalAmount").val(quoteTotalAmount);
  calculateDiscount();
};
var calculateDiscount = function calculateDiscount() {
  var discount = $("#discount").val();
  discountType = $("#discountType").val();
  var itemAmount = [];
  var i = 0;
  $(".quote-item-total").each(function () {
    itemAmount[i++] = $.trim(removeCommas($(this).text()));
  });
  $.sum = function (arr) {
    var r = 0;
    $.each(arr, function (i, v) {
      r += +v;
    });
    return r;
  };
  var totalAmount = $.sum(itemAmount);
  $("#quoteTotal").text(number_format(totalAmount));
  if (isEmpty(discount) || isEmpty(totalAmount)) {
    discount = 0;
  }
  var discountAmount = 0;
  var finalAmount = totalAmount - discountAmount;
  if (discountType == 1) {
    discountAmount = discount;
    finalAmount = totalAmount - discountAmount;
  } else if (discountType == 2) {
    discountAmount = totalAmount * discount / 100;
    finalAmount = totalAmount - discountAmount;
  }
  $("#quoteFinalAmount").text(number_format(finalAmount));
  $("#quoteTotalAmount").val(finalAmount.toFixed(2));
  $("#quoteDiscountAmount").text(number_format(discountAmount));
};
listen("keyup", "#discount", function () {
  var value = $(this).val();
  if (discountType == 2 && value > 100) {
    displayErrorMessage("On Percentage you can only give maximum 100% discount");
    $(this).val(value.slice(0, -1));
    return false;
  }
  calculateDiscount();
});
listenClick("#saveAsDraftQuote", function (event) {
  event.preventDefault();
  var quoteStates = $(this).data("status");
  var myForm = document.getElementById("quoteForm");
  var formData = new FormData(myForm);
  formData.append("status", quoteStates);
  screenLock();
  $.ajax({
    url: route("quotes.store"),
    type: "POST",
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      // displaySuccessMessage(result.message)
      Turbo.visit(route("quotes.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick("#editSaveQuote", function (event) {
  event.preventDefault();
  var quoteStatus = $(this).data("status");
  var formData = $("#quoteEditForm").serialize() + "&quoteStatus=" + quoteStatus;
  screenLock();
  $.ajax({
    url: $("#quoteUpdateUrl").val(),
    type: "PUT",
    dataType: "json",
    data: formData,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      // displaySuccessMessage(result.message)
      Turbo.visit(route("quotes.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listen("input", ".qty-quote", function () {
  var quantity = $(this).val();
  if (quantity.length == 8) {
    $(this).val(quantity.slice(0, -1));
  }
});

/***/ }),

/***/ "./resources/assets/js/quote/quote.js":
/*!********************************************!*\
  !*** ./resources/assets/js/quote/quote.js ***!
  \********************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadQuote);
function loadQuote() {
  initializeSelect2Quote();
}
function initializeSelect2Quote() {
  if (!select2NotExists('#status_filter')) {
    return false;
  }
  removeSelect2Container(['#status_filter']);
  $('#status_filter').select2({
    placeholder: 'All'
  });
  if ($('#status').val() == '') {
    $('#status_filter').val(5).trigger('change');
  }
}
listenClick('.quote-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('quotes.destroy', id), 'quote', Lang.get('messages.quote.quote'));
});
listenClick('#resetFilter', function () {
  $('#status_filter').val(5).trigger('change');
  $('#status_filter').select2({
    placeholder: 'All'
  });
});
listenClick('.convert-to-invoice', function (e) {
  e.preventDefault();
  var quoteId = $(this).data('id');
  $.ajax({
    url: route('quotes.convert-to-invoice'),
    type: 'GET',
    data: {
      quoteId: quoteId
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/sale/sale.js":
/*!******************************************!*\
  !*** ./resources/assets/js/sale/sale.js ***!
  \******************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditSale);
function loadCreateEditSale() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditSale();
  momentFormat = convertToMomentFormat(currentDateFormat);
}
function initializeSelect2CreateEditSale() {
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  $("#sale_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onReady: function onReady() {
      if (typeof quoteDueDateFlatPicker != "undefined") {
        quoteDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
}
window.saleQtyUpdate = function (obj) {
  livewire.emitTo('sale.items', 'qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};
window.showSaleProductModal = function (pid) {
  var pitems = $.parseJSON($('#sale_items').val());
  var p = pitems[pid];
  if (typeof p !== 'undefined') {
    $('#saleProductModal').find('h2').html(p.name);
    $('#product_id').val(pid);
    $('#product_cost_id').val(p.product_cost);
    $('#tax_type_id').val(p.tax_type).select2();
    $('#tax_value_id').val(p.tax_value);
    $('#discount_type_id').val(p.discount_type).select2();
    $('#discount_value_id').val(p.discount_value);
    $('#saleProductModal').modal('show');
  }
  console.log(p);
};
listenClick('#updateSaleProduct', function (event) {
  event.preventDefault();
  var product_cost = $('#product_cost_id').val();
  $('.product_cost').hide();
  if (product_cost === '' || product_cost === null) {
    $('.product_cost').html('Product cost required').show();
    return false;
  }
  livewire.emitTo('sale.items', 'productUpdate', {
    'product_id': $('#product_id').val(),
    'product_cost': product_cost,
    'tax_type': $('#tax_type_id').val(),
    'tax_value': $('#tax_value_id').val(),
    'discount_type': $('#discount_type_id').val(),
    'discount_value': $('#discount_value_id').val()
  });
  $('#saleProductModal').modal('hide');
});
listenClick("#saveSaleForm", function (event) {
  event.preventDefault();
  var frm = $(this).parents('form');
  $('#warehouse_id').removeAttr('disabled');
  screenLock();
  $.ajax({
    url: frm.attr('action'),
    type: "POST",
    dataType: "json",
    data: $('#' + frm.attr('id')).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      displaySuccessMessage(res.result.message);
      Turbo.visit(route("purchases.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick('.sale-delete-btn', function (event) {
  var purchase_id = $(event.currentTarget).attr('data-id');
  deleteItem(route('purchases.destroy', purchase_id), 'purchaseTable', 'Purchase');
});
listenClick('.sale-download-pdf', function (event) {
  var purchase_download_url = $(event.currentTarget).attr('data-url');
  screenUnLock();
  $.ajax({
    url: purchase_download_url,
    dataType: "json",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      console.log(res.data.purchase_pdf_url);
      window.open(res.data.purchase_pdf_url, '_blank');
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/settings/invoice-template.js":
/*!**********************************************************!*\
  !*** ./resources/assets/js/settings/invoice-template.js ***!
  \**********************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadInvoiceTemplates);
var pickr = null;
function loadInvoiceTemplates() {
  initializeSelect2();
  loadPickrData();
  if (pickr !== null) {
    var color = $('#invoiceColor').val();
    if (color != null) {
      pickr.setColor(color);
      var template = $('#invoiceTemplateId').val();
      var invoiceData = [{
        'invColor': color,
        'companyName': $('#companyName').val(),
        'companyAddress': $('#companyAddress').val(),
        'companyPhone': $('#companyPhoneNumber').val()
      }];
      var value = prepareTemplateRender('#' + template, invoiceData);
      $('#editorContent').html(value);
    }
  }
  if ($('#invoiceTemplateId').length) {
    var _template = $('#invoiceTemplateId').val();
    var _color = $('#invoiceTemplateId').select2().find(":selected").data('color');
    prepareDefaultTemplate(_template, _color);
  }
}
function initializeSelect2() {
  var invoiceTemplateId = $('#invoiceTemplateId');
  if (!invoiceTemplateId.length) {
    return;
  }
  $('#invoiceTemplateId').select2({
    width: '100%'
  });
}

// Invoice Template JS For Setting Module
function loadPickrData() {
  var colorPickerSelector = $('.color-wrapper');
  if (!colorPickerSelector.length) {
    return;
  }
  pickr = Pickr.create({
    el: '.color-wrapper',
    theme: 'nano',
    // or 'monolith', or 'nano'
    closeWithKey: 'Enter',
    autoReposition: true,
    defaultRepresentation: 'HEX',
    swatches: ['rgba(244, 67, 54, 1)', 'rgba(233, 30, 99, 1)', 'rgba(156, 39, 176, 1)', 'rgba(103, 58, 183, 1)', 'rgba(63, 81, 181, 1)', 'rgba(33, 150, 243, 1)', 'rgba(3, 169, 244, 1)', 'rgba(0, 188, 212, 1)', 'rgba(0, 150, 136, 1)', 'rgba(76, 175, 80, 1)', 'rgba(139, 195, 74, 1)', 'rgba(205, 220, 57, 1)', 'rgba(255, 235, 59, 1)', 'rgba(255, 193, 7, 1)'],
    components: {
      // Main components
      preview: true,
      hue: true,
      // Input / output Options
      interaction: {
        input: true,
        clear: false,
        save: false
      }
    }
  });
  pickr.on('change', function () {
    var color = pickr.getColor().toHEXA().toString();
    if (wc_hex_is_light(color)) {
      $('#validationErrorsBox').text('');
      $('#validationErrorsBox').show().html('');
      $('#validationErrorsBox').text('Pick a different color');
      setTimeout(function () {
        $('#validationErrorsBox').slideUp();
      }, 5000);
      $(':input[id="btnSave"]').prop('disabled', true);
      return;
    }
    $(':input[id="btnSave"]').prop('disabled', false);
    pickr.setColor(color);
    $('#invoiceColor').val(color);
    var template = $('#invoiceTemplateId').val();
    var invoiceData = [{
      'invColor': color,
      'companyName': $('#companyName').val(),
      'companyAddress': $('#companyAddress').val(),
      'companyPhone': $('#companyPhoneNumber').val()
    }];
    var value = prepareTemplateRender('#' + template, invoiceData);
    $('#editorContent').html(value);
  });
}
listenChange('#invoiceTemplateId', function () {
  var template = $(this).val();
  var color = $(this).select2().find(":selected").data('color');
  prepareDefaultTemplate(template, color);
});
function prepareDefaultTemplate(template, color) {
  var invoiceData = [{
    'invColor': color,
    'companyName': $('#companyName').val(),
    'companyAddress': $('#companyAddress').val(),
    'companyPhone': $('#companyPhoneNumber').val()
  }];
  var value = prepareTemplateRender('#' + template, invoiceData);
  $('#invoiceColor').val(color);
  $('#editorContent').html(value);
  setTimeout(function () {
    pickr.setColor(color);
  }, 200);
}

/***/ }),

/***/ "./resources/assets/js/settings/setting.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/settings/setting.js ***!
  \*************************************************/
/***/ (() => {

document.addEventListener("turbo:load", loadSettings);
function loadSettings() {
  initializeSelect2Dropdown();
  initializeDefaultCountryCode();
}
function initializeDefaultCountryCode() {
  if (!$("#countryPhone").length) {
    return false;
  }
  var input = document.querySelector("#countryPhone");
  var intl = window.intlTelInput(input, {
    initialCountry: $("#countryCode").val(),
    separateDialCode: true,
    preferredCountries: false,
    geoIpLookup: function geoIpLookup(success, failure) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
        var countryCode = resp && resp.country ? resp.country : "";
        success(countryCode);
      });
    },
    utilsScript: "../../public/assets/js/inttel/js/utils.min.js"
  });
  var getCode = intl.selectedCountryData["name"] + "+" + intl.selectedCountryData["dialCode"];
  $("#countryPhone").val(getCode);
}
listenClick(".user-country-code .iti__standard", function () {
  console.log($(this).text());
  $("#countryPhone").val($(this).text());
  $(this).attr("data-country-code");
  $("#countryCode").val($(this).attr("data-country-code"));
});
function initializeSelect2Dropdown() {
  var currencyType = $("#currencyType");
  if (!currencyType.length) {
    return false;
  }
  ["#currencyType", "#timeZone", "#dateFormat"].forEach(function (value) {
    if ($(value).hasClass("select2-hidden-accessible")) {
      $(".select2-container").remove();
    }
  });
  $("#currencyType, #timeZone, #dateFormat").select2({
    width: "100%"
  });
}
listenChange("input[type=radio][name=decimal_separator]", function () {
  if (this.value === ",") {
    $('input[type=radio][name=thousand_separator][value="."]').prop("checked", true);
  } else {
    $('input[type=radio][name=thousand_separator][value=","]').prop("checked", true);
  }
});
listenChange("input[type=radio][name=thousand_separator]", function () {
  if (this.value === ",") {
    $('input[type=radio][name=decimal_separator][value="."]').prop("checked", true);
  } else {
    $('input[type=radio][name=decimal_separator][value=","]').prop("checked", true);
  }
});
listenChange("#appLogo", function () {
  $("#validationErrorsBox").addClass("d-none");
  if (isValidLogo($(this), "#validationErrorsBox")) {
    displaySettingImage(this, "#previewImage");
  }
});
listenChange("#companyLogo", function () {
  $("#validationErrorsBox").addClass("d-none");
  if (isValidLogo($(this), "#validationErrorsBox")) {
    displaySettingImage(this, "#previewImage1");
  }
});
function isValidLogo(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split(".").pop().toLowerCase();
  if ($.inArray(ext, ["jpg", "png", "jpeg"]) == -1) {
    $(inputSelector).val("");
    $(validationMessageSelector).removeClass("d-none");
    $(validationMessageSelector).html("The image must be a file of type: jpg, jpeg, png.").show();
    return false;
  }
  $(validationMessageSelector).hide();
  return true;
}
function displaySettingImage(input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        $(selector).attr("src", e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
}
listenSubmit("#createSetting", function () {
  var companyAddress = $("#companyAddress").val();
  var companyName = $("#company_name").val();
  var appName = $("#app_name").val();
  if (!$.trim(appName)) {
    displayErrorMessage("App Name is required");
    return false;
  }
  if (!$.trim(companyName)) {
    displayErrorMessage("Company Name is required");
    return false;
  }
  if (!$.trim(companyAddress)) {
    displayErrorMessage("Please enter company address");
    return false;
  }
});
listenSubmit("#userSetting", function () {
  var companyName = $("#company_name").val();
  var appName = $("#app_name").val();
  if (!$.trim(appName)) {
    displayErrorMessage("App Name is required");
    return false;
  }
  if (!$.trim(companyName)) {
    displayErrorMessage("Company Name is required");
    return false;
  }
});

/***/ }),

/***/ "./resources/assets/js/sidebar_menu_search/sidebar_menu_search.js":
/*!************************************************************************!*\
  !*** ./resources/assets/js/sidebar_menu_search/sidebar_menu_search.js ***!
  \************************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', sidebarMenuSearch);
function sidebarMenuSearch() {
  listenKeyup('#menuSearch', function () {
    var value = $(this).val().toLowerCase();
    $('.nav-item').filter(function () {
      $('.no-record').addClass('d-none');
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      checkEmpty();
    });
  });
  listenClick('.sidebar-aside-toggle', function () {
    if ($(this).hasClass('active') === true) {
      $('.sidebar-search-box').addClass('d-none');
    } else {
      $('.sidebar-search-box').removeClass('d-none');
    }
  });
}
function checkEmpty() {
  if ($('.menu-item:visible').last().length == 0) {
    $('.no-record').removeClass('d-none');
  }
}

/***/ }),

/***/ "./resources/assets/js/subscribe/subscribe.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/subscribe/subscribe.js ***!
  \****************************************************/
/***/ (() => {

var subscribeTableName = '#subscribersTable';
listenClick('.subscriber-delete-btn', function () {
  var subscriberId = $(this).attr('data-id');
  deleteItem(route('super.admin.subscribe.destroy', subscriberId), subscribeTableName, Lang.get('messages.subscription_plans.subscriber'));
});

/***/ }),

/***/ "./resources/assets/js/subscription_plans/create-edit.js":
/*!***************************************************************!*\
  !*** ./resources/assets/js/subscription_plans/create-edit.js ***!
  \***************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSubsPlanCreateEdit);
function loadSubsPlanCreateEdit() {
  $('.price-input').trigger('input');
  $('#createSubscriptionPlanForm, #editSubscriptionPlanForm').find('input:text:visible:first').focus();
}
listenSubmit('#createSubscriptionPlanForm, #editSubscriptionPlanForm', function () {
  $('#btnSave').attr('disabled', true);
});

/***/ }),

/***/ "./resources/assets/js/subscription_plans/plan_features.js":
/*!*****************************************************************!*\
  !*** ./resources/assets/js/subscription_plans/plan_features.js ***!
  \*****************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSubscriptionPlanFeatures);
function loadSubscriptionPlanFeatures() {
  // features selection script - starts
  var featureLength = $('.feature:checkbox:checked').length;
  featureChecked(featureLength);
}
window.featureChecked = function (featureLength) {
  var totalFeature = $('.feature:checkbox').length;
  if (featureLength === totalFeature) {
    $('#selectAll').prop('checked', true);
  } else {
    $('#selectAll').prop('checked', false);
  }
};

// script for selecting all features
listenClick('#selectAll', function () {
  if ($('#selectAll').is(':checked')) {
    $('.feature').each(function () {
      $(this).prop('checked', true);
    });
  } else {
    $('.feature').each(function () {
      $(this).prop('checked', false);
    });
  }
});

// script for selecting single feature
listenClick('.feature', function () {
  var featureLength = $('.feature:checkbox:checked').length;
  featureChecked(featureLength);
});
// features selection script - ends

/***/ }),

/***/ "./resources/assets/js/subscription_plans/subscription_plan.js":
/*!*********************************************************************!*\
  !*** ./resources/assets/js/subscription_plans/subscription_plan.js ***!
  \*********************************************************************/
/***/ (() => {

listenClick('#resetFilter', function () {
  $('#planTypeFilter').val('').trigger('change');
  livewire.emit('refreshDatatable');
});
listenClick('.plan-delete-btn', function (event) {
  var subscriptionId = $(event.currentTarget).attr('data-id');
  var deleteSubscriptionUrl = $('#subscriptionPlanUrl').val() + '/' + subscriptionId;
  deleteItem(deleteSubscriptionUrl, '#subscriptionPlanTable', Lang.get('messages.subscription_plans.subscription_plan'));
});
listenChange('.is_default', function (event) {
  var subscriptionPlanId = $(event.currentTarget).data('id');
  livewire.emit('refreshDatatable');
  livewire.emit('resetPageTable');
  updateStatusToDefault(subscriptionPlanId);
});
function updateStatusToDefault(subscriptionPlanId) {
  $.ajax({
    url: route('make.plan.default', subscriptionPlanId),
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
      }
    }
  });
}

/***/ }),

/***/ "./resources/assets/js/subscriptions/admin-free-subscription.js":
/*!**********************************************************************!*\
  !*** ./resources/assets/js/subscriptions/admin-free-subscription.js ***!
  \**********************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSubsAdminFreeSubscription);
function loadSubsAdminFreeSubscription() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
}
listenClick('.freePayment', function () {
  var _this = this;
  if (typeof getLoggedInUserdata != 'undefined' && getLoggedInUserdata == '') {
    window.location.href = logInUrl;
    return true;
  }
  if ($(this).data('plan-price') === 0) {
    $(this).addClass('disabled');
    var data = {
      plan_id: $(this).data('id'),
      price: $(this).data('plan-price')
    };
    $.post(makePaymentURL, data).done(function (result) {
      displaySuccessMessage(result.message);
      setTimeout(function () {
        location.reload();
      }, 5000);
    })["catch"](function (error) {
      $(_this).html(subscribeText).removeClass('disabled');
      $('.freePayment').attr('disabled', false);
      displayErrorMessage(error.responseJSON.message);
    });
    return true;
  }
});

/***/ }),

/***/ "./resources/assets/js/subscriptions/free-subscription.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/subscriptions/free-subscription.js ***!
  \****************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSubsFreeSubscription);
function loadSubsFreeSubscription() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
}
listenClick('.freePayment', function () {
  var _this = this;
  if (typeof getLoggedInUserdata != 'undefined' && getLoggedInUserdata == '') {
    window.location.href = logInUrl;
    return true;
  }
  if ($(this).data('plan-price') === 0) {
    $(this).addClass('disabled');
    var data = {
      plan_id: $(this).data('id'),
      price: $(this).data('plan-price')
    };
    $.post(makePaymentURL, data).done(function (result) {
      var toastMessageData = {
        'toastType': 'success',
        'toastMessage': result.message
      };
      paymentMessage(toastMessageData);
      setTimeout(function () {
        location.reload();
      }, 5000);
    })["catch"](function (error) {
      $(_this).html(subscribeText).removeClass('disabled');
      $('.freePayment').attr('disabled', false);
      var toastMessageData = {
        'toastType': 'error',
        'toastMessage': error.responseJSON.message
      };
      paymentMessage(toastMessageData);
    });
    return true;
  }
});

/***/ }),

/***/ "./resources/assets/js/subscriptions/payment-message.js":
/*!**************************************************************!*\
  !*** ./resources/assets/js/subscriptions/payment-message.js ***!
  \**************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSubsPaymentMsg);
function loadSubsPaymentMsg() {
  paymentMessage();
}
window.paymentMessage = function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (toastData !== null) {
    toastData = data != null ? data : toastData;
    setTimeout(function () {
      $.toast({
        heading: toastData.toastType,
        icon: toastData.toastType,
        bgColor: '#7603f3',
        textColor: '#ffffff',
        text: toastData.toastMessage,
        position: 'top-right',
        stack: false
      });
    }, 1000);
  }
};

/***/ }),

/***/ "./resources/assets/js/subscriptions/subscription.js":
/*!***********************************************************!*\
  !*** ./resources/assets/js/subscriptions/subscription.js ***!
  \***********************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSubsSubscription);
function loadSubsSubscription() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  if ($('#paymentType').length) {
    activatePaymentButton($('#paymentType').val());
    $('#paymentType').trigger('change');
  }
}
listenClick('.makePayment', function () {
  var _this = this;
  if (typeof getLoggedInUserdata != 'undefined' && getLoggedInUserdata == '') {
    window.location.href = logInUrl;
    return true;
  }
  var payloadData = {
    plan_id: $(this).data('id'),
    from_pricing: typeof fromPricing != 'undefined' ? fromPricing : null,
    price: $(this).data('plan-price'),
    payment_type: $('#paymentType option:selected').val()
  };
  $(this).addClass('disabled');
  $.post(makePaymentURL, payloadData).done(function (result) {
    if (typeof result.data == 'undefined') {
      var toastMessageData = {
        'toastType': 'success',
        'toastMessage': result.message
      };
      paymentMessage(toastMessageData);
      setTimeout(function () {
        window.location.href = subscriptionPlans;
      }, 5000);
      return true;
    }
    var sessionId = result.data.sessionId;
    stripe.redirectToCheckout({
      sessionId: sessionId
    }).then(function (result) {
      $(this).html(subscribeText).removeClass('disabled');
      $('.makePayment').attr('disabled', false);
      var toastMessageData = {
        'toastType': 'error',
        'toastMessage': result.responseJSON.message
      };
      paymentMessage(toastMessageData);
    });
  })["catch"](function (error) {
    $(_this).html(subscribeText).removeClass('disabled');
    $('.makePayment').attr('disabled', false);
    var toastMessageData = {
      'toastType': 'error',
      'toastMessage': error.responseJSON.message
    };
    paymentMessage(toastMessageData);
  });
});
listenChange('#paymentType', function () {
  var paymentType = $(this).val();
  if (paymentType == 4) {
    $('.payment-attachments').removeClass('d-none');
  } else {
    $('.payment-attachments').addClass('d-none');
  }
  activatePaymentButton(paymentType);
});
function activatePaymentButton(paymentType) {
  if (paymentType == 1) {
    $('.proceed-to-payment, .razorPayPayment, .cashPayment').addClass('d-none');
    $('.stripePayment').removeClass('d-none');
  }
  if (paymentType == 2) {
    $('.proceed-to-payment, .razorPayPayment, .cashPayment').addClass('d-none');
    $('.paypalPayment').removeClass('d-none');
  }
  if (paymentType == 3) {
    $('.proceed-to-payment, .paypalPayment, .cashPayment').addClass('d-none');
    $('.razorPayPayment').removeClass('d-none');
  }
  if (paymentType == 4) {
    $('.proceed-to-payment, .paypalPayment, .razorPayPayment').addClass('d-none');
    $('.cashPayment').removeClass('d-none');
  }
}
listenClick('.paymentByPaypal', function () {
  var pricing = typeof fromPricing != 'undefined' ? fromPricing : null;
  $(this).addClass('disabled');
  $.ajax({
    type: 'GET',
    url: route('admin.paypal.init'),
    data: {
      'planId': $(this).data('id'),
      'from_pricing': pricing,
      'payment_type': $('#paymentType option:selected').val()
    },
    success: function success(result) {
      if (result.status == 'CREATED') {
        var redirectTo = '';
        $.each(result.links, function (key, val) {
          if (val.rel == 'approve') {
            redirectTo = val.href;
          }
        });
        location.href = redirectTo;
      } else {
        location.href = result.url;
      }
    },
    error: function error(result) {},
    complete: function complete() {}
  });
});

// RazorPay Payment
listenClick('.razor_pay_payment', function () {
  $(this).addClass('disabled');
  $.ajax({
    type: 'POST',
    url: makeRazorpayURl,
    data: {
      'plan_id': $(this).data('id'),
      'from_pricing': typeof fromPricing != 'undefined' ? fromPricing : null
    },
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
      if (result.success) {
        var _result$data = result.data,
          id = _result$data.id,
          amount = _result$data.amount,
          name = _result$data.name,
          email = _result$data.email,
          contact = _result$data.contact,
          planID = _result$data.planID;
        options.amount = amount;
        options.order_id = id;
        options.prefill.name = name;
        options.prefill.email = email;
        options.prefill.contact = contact;
        options.prefill.planID = planID;
        var razorPay = new Razorpay(options);
        razorPay.open();
        razorPay.on('payment.failed', storeFailedPayment);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
});
function storeFailedPayment(response) {
  $.ajax({
    type: 'POST',
    url: razorpayPaymentFailed,
    data: {
      data: response
    },
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}

// cash Payment
listenClick('.cash_payment', function () {
  $(this).addClass('disabled');
  var formData = new FormData();
  var fileData = $('input[type="file"]')[0].files; // for multiple files
  for (var i = 0; i < fileData.length; i++) {
    formData.append('payment_attachments[]', fileData[i]);
  }
  formData.append('plan_id', $(this).data('id'));
  formData.append('from_pricing', typeof fromPricing != 'undefined' ? fromPricing : null);
  $.ajax({
    type: 'POST',
    url: cashPaymentUrl,
    data: formData,
    contentType: false,
    processData: false,
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
});

/***/ }),

/***/ "./resources/assets/js/subscriptions/subscriptions-transactions.js":
/*!*************************************************************************!*\
  !*** ./resources/assets/js/subscriptions/subscriptions-transactions.js ***!
  \*************************************************************************/
/***/ (() => {

listenClick('#resetFilter', function () {
  $('#paymentTypeArr').val('').trigger('change');
});
listenChange('.payment-approve', function () {
  var id = $(this).attr('data-id');
  var status = $(this).val();
  $.ajax({
    url: route('change-payment-status', id),
    type: 'GET',
    data: {
      id: id,
      status: status
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      livewire.emit('refreshDatatable');
      livewire.emit('resetPageTable');
      Turbo.visit(route('subscriptions.transactions.index'));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/super_admin/super-admin.js":
/*!********************************************************!*\
  !*** ./resources/assets/js/super_admin/super-admin.js ***!
  \********************************************************/
/***/ (() => {

listenClick('.super-admin-delete-btn', function (event) {
  var recordId = $(event.currentTarget).attr('data-id');
  deleteItem(route('super-admins.destroy', recordId), 'tableName', Lang.get('messages.super_admin.super_admin'));
});
listenSubmit('#superAdminCreateForm, #superAdminEditForm', function (e) {
  e.preventDefault();
  if ($('#error-msg').text() !== '') {
    $('#phoneNumber').focus();
    return false;
  }
  $("#superAdminEditForm,#superAdminCreateForm")[0].submit();
});

/***/ }),

/***/ "./resources/assets/js/super_admin_currency/currency.js":
/*!**************************************************************!*\
  !*** ./resources/assets/js/super_admin_currency/currency.js ***!
  \**************************************************************/
/***/ (() => {

"use strict";


listenClick('.addAdminCurrency', function () {
  $('#addAdminCurrencyModal').appendTo('body').modal('show');
});
listenSubmit('#addAdminCurrencyForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('super.admin.currencies.store'),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        $('#addAdminCurrencyModal').modal('hide');
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#currencyTbl').DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenHiddenBsModal('#addAdminCurrencyModal', function () {
  resetModalForm('#addAdminCurrencyForm', '#validationErrorsBox');
});
listenClick('.admin-currency-edit-btn', function (event) {
  var currencyId = $(event.currentTarget).attr('data-id');
  adminCurrencyRenderData(currencyId);
});
function adminCurrencyRenderData(id) {
  $.ajax({
    url: route('super.admin.currencies.edit', id),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#editAdminCurrencyName').val(result.data.name);
        $('#editAdminCurrencyIcon').val(result.data.icon);
        $('#editAdminCurrencyCode').val(result.data.code);
        $('#adminCurrencyId').val(result.data.id);
        $('#editAdminCurrencyModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
;
listenSubmit('#editAdminCurrencyForm', function (event) {
  event.preventDefault();
  var id = $('#adminCurrencyId').val();
  $.ajax({
    url: route('super.admin.currencies.update', {
      currency: id
    }),
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#editAdminCurrencyModal').modal('hide');
        $('#currencyTbl').DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick('.admin-currency-delete-btn', function (event) {
  var currencyId = $(event.currentTarget).data('id');
  deleteItem(route('super.admin.currencies.destroy', currencyId), '#currencyTbl', Lang.get('messages.currency.currency'));
});

/***/ }),

/***/ "./resources/assets/js/super_admin_dashboard/dashboard.js":
/*!****************************************************************!*\
  !*** ./resources/assets/js/super_admin_dashboard/dashboard.js ***!
  \****************************************************************/
/***/ (() => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var start_date;
var end_date;
var datePicker;
var isPickerApply = false;
document.addEventListener('turbo:load', loadSuperAdminDashboard);
function loadSuperAdminDashboard() {
  initSuperAdminDashboardDatePicker();
}
function initSuperAdminDashboardDatePicker() {
  datePicker = $('#super_admin_time_range');
  if (!datePicker.length) {
    return;
  }
  start_date = moment().startOf('month');
  end_date = moment().endOf('month');
  setRevenueDatepickerValue(start_date, end_date);
  var last_month = moment().startOf('month').subtract(1, 'days');
  datePicker.daterangepicker({
    maxDate: new Date(),
    startDate: start_date,
    endDate: end_date,
    opens: 'left',
    showDropdowns: true,
    autoUpdateInput: false,
    locale: {
      customRangeLabel: Lang.get('messages.common.custom'),
      applyLabel: Lang.get('messages.common.apply'),
      cancelLabel: Lang.get('messages.common.cancel'),
      fromLabel: Lang.get('messages.common.from'),
      toLabel: Lang.get('messages.common.to'),
      monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
      daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
    },
    ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.range.today'), [moment(), moment()]), Lang.get('messages.range.this_week'), [moment().startOf('week'), moment().endOf('week')]), Lang.get('messages.range.last_week'), [moment().startOf('week').subtract(7, 'days'), moment().startOf('week').subtract(1, 'days')]), Lang.get('messages.range.last_30'), [start_date, end_date]), Lang.get('messages.range.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.range.last_month'), [last_month.clone().startOf('month'), last_month.clone().endOf('month')])
  }, setRevenueDatepickerValue);
  loadRevenueChart(start_date.format('YYYY-MM-D'), end_date.format('YYYY-MM-D'));
  datePicker.on('apply.daterangepicker', function (ev, picker) {
    isPickerApply = true;
    start_date = picker.startDate.format('YYYY-MM-D');
    end_date = picker.endDate.format('YYYY-MM-D');
    loadRevenueChart(start_date, end_date);
  });
}
function setRevenueDatepickerValue(start, end) {
  datePicker.val(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
}
function loadRevenueChart(startDate, endDate) {
  $.ajax({
    type: 'GET',
    url: route('super-admin.revenue-chart'),
    dataType: 'json',
    data: {
      start_date: startDate,
      end_date: endDate
    },
    cache: false
  }).done(prepareRevenueChart);
}
function prepareRevenueChart(result) {
  $('#revenue_overview-container').html('');
  var data = result.data;
  if (data.total_records === 0) {
    $('#revenue_overview-container').empty();
    $('#revenue_overview-container').append('<div align="center" class="no-record justify-align-center">' + Lang.get('messages.admin_dashboard.no_record_found') + '</div>');
    return true;
  } else {
    $('#revenue_overview-container').html('');
    $('#revenue_overview-container').append('<canvas id="revenue_chart_canvas" height="200"></canvas>');
  }
  var ctx = document.getElementById('revenue_chart_canvas').getContext('2d');
  ctx.canvas.style.height = '500px';
  ctx.canvas.style.width = '908px';
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: data.month,
        // Name the series
        data: data.yearly_revenue,
        // Specify the data values array
        fill: false,
        borderColor: '#2196f3',
        // Add custom color border (Line)
        backgroundColor: '#2196f3',
        // Add custom color background (Points and Fill)
        borderWidth: 2 // Specify bar border width
      }]
    },
    options: {
      elements: {
        line: {
          tension: 0.5
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function label(context) {
              return currencyAmount(context.formattedValue);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          },
          ticks: {
            min: 0,
            // stepSize: 500,
            callback: function callback(label) {
              return currencyAmount(label);
            }
          }
        },
        x: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/***/ }),

/***/ "./resources/assets/js/super_admin_enquiry/super_admin_enquiry.js":
/*!************************************************************************!*\
  !*** ./resources/assets/js/super_admin_enquiry/super_admin_enquiry.js ***!
  \************************************************************************/
/***/ (() => {

listenClick('#resetFilter', function () {
  $('#filter_status').val(2).trigger('change');
});
listenClick('.enquiry-delete-btn', function (e) {
  var superAdminEnquiryId = $(e.currentTarget).attr('data-id');
  deleteItem($('#enquiryUrl').val() + '/' + superAdminEnquiryId, '#superAdminEnquiriesTable', Lang.get('messages.landing.enquiry'));
});

/***/ }),

/***/ "./resources/assets/js/super_admin_settings/new-user-setting.js":
/*!**********************************************************************!*\
  !*** ./resources/assets/js/super_admin_settings/new-user-setting.js ***!
  \**********************************************************************/
/***/ (() => {

document.addEventListener("turbo:load", loadNewUserSettings);
function loadNewUserSettings() {
  initializeDefaultNewUserCountryCode();
  loadNewUserPhoneNumberCountryCode();
}
function initializeDefaultNewUserCountryCode() {
  if (!$("#newUserCountryPhone").length) {
    return false;
  }
  var input = document.querySelector("#newUserCountryPhone");
  var intl = window.intlTelInput(input, {
    initialCountry: $("#newUserCountryCode").val(),
    separateDialCode: true,
    preferredCountries: false,
    geoIpLookup: function geoIpLookup(success, failure) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
        var newUserCountryCode = resp && resp.country ? resp.country : "";
        success(newUserCountryCode);
      });
    },
    utilsScript: "../../public/assets/js/inttel/js/utils.min.js"
  });
  var getCode = intl.selectedCountryData["name"] + "+" + intl.selectedCountryData["dialCode"];
  $("#newUserCountryPhone").val(getCode);
}
listenClick(".country-code .iti__standard", function () {
  $("#newUserCountryPhone").val($(this).text());
  $(this).attr("data-country-code");
  $("#newUserCountryCode").val($(this).attr("data-country-code"));
});
function loadNewUserPhoneNumberCountryCode() {
  if (!$("#newUserPhoneNumber").length) {
    return;
  }
  var input2 = document.querySelector("#newUserPhoneNumber"),
    errorMsg2 = document.querySelector("#error-msg"),
    validMsg2 = document.querySelector("#valid-msg");
  var errorMap = [Lang.get("messages.placeholder.invalid_number"), Lang.get("messages.placeholder.invalid_country_number"), Lang.get("messages.placeholder.too_short"), Lang.get("messages.placeholder.too_long"), Lang.get("messages.placeholder.invalid_number")];

  // initialise plugin
  var intl2 = window.intlTelInput(input2, {
    initialCountry: "in",
    separateDialCode: true,
    preferredCountries: false,
    geoIpLookup: function geoIpLookup(success, failure) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
        var newUserCountryCode = resp && resp.country ? resp.country : "";
        success(newUserCountryCode);
      });
    },
    utilsScript: "../../public/assets/js/inttel/js/utils.min.js"
  });
  var reset2 = function reset2() {
    input2.classList.remove("error");
    errorMsg2.innerHTML = "";
    errorMsg2.classList.add("hide");
    validMsg2.classList.add("hide");
  };
  input2.addEventListener("blur", function () {
    reset2();
    if (input2.value.trim()) {
      if (intl2.isValidNumber()) {
        validMsg2.classList.remove("hide");
      } else {
        input2.classList.add("error");
        var errorCode2 = intl2.getValidationError();
        errorMsg2.innerHTML = errorMap[errorCode2];
        errorMsg2.classList.remove("hide");
      }
    }
  });

  // on keyup / change flag: reset
  input2.addEventListener("change", reset2);
  input2.addEventListener("keyup", reset2);
  if (typeof phoneNo != "undefined" && phoneNo !== "") {
    setTimeout(function () {
      $("#newUserPhoneNumber").trigger("change");
    }, 500);
  }
  $("#newUserPhoneNumber").on("blur keyup change countrychange", function () {
    if (typeof phoneNo != "undefined" && phoneNo !== "") {
      intl2.setNumber("+" + phoneNo);
      phoneNo = "";
    }
    var getCode = intl2.selectedCountryData["dialCode"];
    $("#newUserPrefixCode").val(getCode);
  });
  if ($("#isEdit").val()) {
    var getCode = intl2.selectedCountryData["dialCode"];
    $("#newUserPrefixCode").val(getCode);
  }
  var getPhoneNumber = $("#newUserPhoneNumber").val();
  var removeSpacePhoneNumber = getPhoneNumber.replace(/\s/g, "");
  $("#newUserPhoneNumber").val(removeSpacePhoneNumber);
}
listen("submit", "#newUserSettingForm", function (e) {
  if ($("#error-msg").text() !== "") {
    $("#newUserPhoneNumber").focus();
    return false;
  }
});

/***/ }),

/***/ "./resources/assets/js/super_admin_settings/setting.js":
/*!*************************************************************!*\
  !*** ./resources/assets/js/super_admin_settings/setting.js ***!
  \*************************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSuperAdminSetting);
function loadSuperAdminSetting() {
  if (typeof phoneNo != 'undefined' && phoneNo !== '') $('#phoneNumber').trigger('blur');
}
listenChange('#superAdminAppLogo', function () {
  $('#validationErrorsBox').addClass('d-none');
  if (isValidLogo($(this), '#validationErrorsBox')) {
    displayLogo(this, '#previewImage');
  }
});
listenSubmit('#createSuperAdminSetting', function (event) {
  event.preventDefault();
  $('#createSuperAdminSetting')[0].submit();
  return true;
});
window.isValidLogo = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['jpg', 'png', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).removeClass('d-none');
    $(validationMessageSelector).html('The image must be a file of type: jpg, jpeg, png.').show();
    return false;
  }
  $(validationMessageSelector).hide();
  return true;
};
window.displayLogo = function (input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        $(selector).attr('src', e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
listenClick('#resetFilter', function () {
  $('#filter_status').val('2').trigger('change');
});
listenSubmit('#superAdminFooterSettingForm', function (event) {
  event.preventDefault();
  if ($('#error-msg').text() !== '') {
    $('#phoneNumber').focus();
    return false;
  }
  var facebookUrl = $('#facebookUrl').val();
  var twitterUrl = $('#twitterUrl').val();
  var youtubeUrl = $('#youtubeUrl').val();
  var linkedInUrl = $('#linkedInUrl').val();
  var facebookExp = new RegExp(/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/i);
  var twitterExp = new RegExp(/http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/);
  var youtubeUrlExp = new RegExp(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/);
  var linkedInExp = new RegExp(/http(?:s)?:\/\/(?:www\.)?linkedin\.com\/([a-zA-Z0-9_]+)/);
  var facebookCheck = facebookUrl == '' ? true : facebookUrl.match(facebookExp) ? true : false;
  if (!facebookCheck) {
    displayErrorMessage('Please enter a valid Facebook URL');
    return false;
  }
  var youtubeUrlCheck = youtubeUrl == '' ? true : youtubeUrl.match(youtubeUrlExp) ? true : false;
  if (!youtubeUrlCheck) {
    displayErrorMessage('Please enter a valid Youtube URL');
    return false;
  }
  var twitterCheck = twitterUrl == '' ? true : twitterUrl.match(twitterExp) ? true : false;
  if (!twitterCheck) {
    displayErrorMessage('Please enter a valid Twitter URL');
    return false;
  }
  var linkedInCheck = linkedInUrl == '' ? true : linkedInUrl.match(linkedInExp) ? true : false;
  if (!linkedInCheck) {
    displayErrorMessage('Please enter a valid Linkedin URL');
    return false;
  }
  $('#superAdminFooterSettingForm')[0].submit();
  return true;
});

/***/ }),

/***/ "./resources/assets/js/super_admin_testimonial/testimonial.js":
/*!********************************************************************!*\
  !*** ./resources/assets/js/super_admin_testimonial/testimonial.js ***!
  \********************************************************************/
/***/ (() => {

// 'use strict'

listenSubmit('#addTestimonialForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#testimonialSaveBtn');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $('#testimonialSaveBtn').attr('disabled', true);
  $.ajax({
    url: route('admin-testimonial.store'),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addTestimonialModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#testimonialSaveBtn').attr('disabled', false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      $('#testimonialSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.testimonial-show-btn', function () {
  var testimonialShowId = $(this).attr('data-id');
  $.ajax({
    url: route('admin-testimonial.show', testimonialShowId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.image_url.split('.').pop().toLowerCase();
        if (ext == '') {
          $('#showPreviewImage').attr('src', result.data.image_url);
        } else {
          $('#showPreviewImage').attr('src', result.data.image_url);
        }
        $('.show-name').text(result.data.name);
        $('.show-position').text(result.data.position);
        $('.show-description').text(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#documentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#documentUrl').show();
          $('.btn-view').show();
          $('#documentUrl').attr('href', result.data.document_url);
        }
        $('#showTestimonialModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
//
listenClick('.testimonial-edit-btn', function (event) {
  if (ajaxCallIsRunning) {
    return;
  }
  ajaxCallInProgress();
  var testimonialId = $(event.currentTarget).data('id');
  testimonialRenderData(testimonialId);
});
//
function testimonialRenderData(testimonialId) {
  $.ajax({
    url: route('admin-testimonial.edit', testimonialId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.image_url.split('.').pop().toLowerCase();
        if (ext == '') {
          $('#editPreviewImage').css('background-image', 'url("' + result.data.image_url + '")');
        } else {
          $('#editPreviewImage').css('background-image', 'url("' + result.data.image_url + '")');
        }
        $('#testimonialId').val(result.data.id);
        $('#editName').val(result.data.name);
        $('#editPosition').val(result.data.position);
        $('#editDescription').val(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#documentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#documentUrl').show();
          $('.btn-view').show();
          $('#documentUrl').attr('href', result.data.document_url);
        }
        $('#editTestimonialModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
listenSubmit('#editTestimonialForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditSave');
  loadingButton.button('loading');
  $('#btnEditSave').attr('disabled', true);
  var id = $('#testimonialId').val();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: route('admin-testimonial.update', id),
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editTestimonialModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        $('#btnEditSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      $('#btnEditSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.addTestimonialButton', function () {
  $('#addTestimonialModal').appendTo('body').modal('show');
});
listenHiddenBsModal('#addTestimonialModal', function () {
  resetModalForm('#addTestimonialForm', '#addTestimonialModal #validationErrorsBox');
  $('#previewImage').attr('src', $('#defaultDocumentImageUrl').val()).css('background-image', "url(".concat($('#defaultDocumentImageUrl').val(), ")"));
  $('#testimonialSaveBtn').attr('disabled', false);
});
listenShowBsModal('#addTestimonialModal', function () {
  $('#addTestimonialModal #validationErrorsBox').show();
  $('#addTestimonialModal #validationErrorsBox').addClass('d-none');
});
//
listenHiddenBsModal('#editTestimonialModal', function () {
  resetModalForm('#editTestimonialForm', '#editTestimonialModal #editValidationErrorsBox');
  $('#previewImage').attr('src', $('#defaultDocumentImageUrl').val()).css('background-image', "url(".concat($('#defaultDocumentImageUrl').val(), ")"));
  $('#btnEditSave').attr('disabled', false);
});
//
listenShowBsModal('#editTestimonialModal', function () {
  $('#editTestimonialModal #editValidationErrorsBox').show();
  $('#editTestimonialModal #editValidationErrorsBox').addClass('d-none');
});
listenClick('.testimonial-delete-btn', function (event) {
  var testimonialId = $(event.currentTarget).attr('data-id');
  deleteItem(route('admin-testimonial.destroy', testimonialId), $('#AdminTestimonialTbl'), Lang.get('messages.testimonial.testimonial'));
});
//
listenChange('#profile', function () {
  var extension = isValidDocument($(this), '#addTestimonialModal #validationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '#previewImage', extension);
  }
});
listenChange('#editProfile', function () {
  var extension = isValidDocument($(this), '#editTestimonialModal #editValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '#editPreviewImage', extension);
  }
});
window.isValidDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html(profileError).removeClass('d-none');
    return false;
  }
  $(validationMessageSelector).html(profileError).addClass('d-none');
  return ext;
};

/***/ }),

/***/ "./resources/assets/js/supplier/create-edit.js":
/*!*****************************************************!*\
  !*** ./resources/assets/js/supplier/create-edit.js ***!
  \*****************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditSupplier);
function loadCreateEditSupplier() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditSupplier();
  loadSelect2ClientData();
  momentFormat = convertToMomentFormat(currentDateFormat);
  if ($("#supplierNoteData").val() == true || $("#supplierTermData").val() == true) {
    $("#supplierAddNote").hide();
    $("#supplierRemoveNote").show();
    $("#supplierNoteAdd").show();
    $("#supplierTermRemove").show();
  } else {
    $("#supplierRemoveNote").hide();
    $("#supplierNoteAdd").hide();
    $("#supplierTermRemove").hide();
  }
  if ($("#supplierRecurring").val() == true) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
  if ($("#discountType").val() != 0) {
    $("#discount").removeAttr("disabled");
  } else {
    $("#discount").attr("disabled", "disabled");
  }
  calculateAndSetSupplierAmount();
}
function loadSelect2ClientData() {
  if (!$("#client_id").length && !$("#discountType").length) {
    return;
  }
  $("#client_id,#discountType,#status,#templateId").select2();
}
function initializeSelect2CreateEditSupplier() {
  if (!select2NotExists(".product-supplier")) {
    return false;
  }
  removeSelect2Container([".product-supplier"]);
  $(".product-supplier").select2({
    tags: true
  });
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  $(".payment-qr-code").select2();
  $("#client_id").focus();
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  var supplierDueDateFlatPicker = $("#supplierDueDate").flatpickr({
    defaultDate: currentDate,
    dateFormat: currentDateFormat,
    locale: getUserLanguages
  });
  var editSupplierDueDateVal = moment($("#editSupplierDueDateAdmin").val()).format(convertToMomentFormat(currentDateFormat));
  var editSupplierDueDateFlatPicker = $(".edit-supplier-due-date").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editSupplierDueDateVal,
    locale: getUserLanguages
  });
  $("#supplier_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#quote_date").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#quote_date").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof supplierDueDateFlatPicker != "undefined") {
        supplierDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      if (typeof supplierDueDateFlatPicker != "undefined") {
        supplierDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
  var editSupplierDate = $("#editSupplierDate").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: moment($("#editSupplierDateAdmin").val()).format(convertToMomentFormat(currentDateFormat)),
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editSupplierDate").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#editSupplierDate").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editsupplierDueDateFlatPicker != "undefined") {
        editsupplierDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#editSupplierDateAdmin").val(), momentFormat).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      } else {
        minDate = moment($("#editSupplierDateAdmin").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof editsupplierDueDateFlatPicker != "undefined") {
        editsupplierDueDateFlatPicker.set("minDate", minDate);
      }
    }
  });
}
listenKeyup("#supplierId", function () {
  return $("#supplierId").val(this.value.toUpperCase());
});
listenClick("#supplierAddNote", function () {
  $("#supplierAddNote").hide();
  $("#supplierRemoveNote").show();
  $("#supplierNoteAdd").show();
  $("#supplierTermRemove").show();
});
listenClick("#supplierRemoveNote", function () {
  $("#supplierAddNote").show();
  $("#supplierRemoveNote").hide();
  $("#supplierNoteAdd").hide();
  $("#supplierTermRemove").hide();
  $("#supplierNote").val("");
  $("#supplierTerm").val("");
  $("#supplierAddNote").show();
});
listenClick("#formData_recurring-0", function () {
  if ($("#formData_recurring-0").prop("checked")) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
});
listenClick("#formData_recurring-1", function () {
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
});
listenChange("#discountType", function () {
  discountType = $(this).val();
  $("#discount").val(0);
  if (discountType == 1 || discountType == 2) {
    $("#discount").removeAttr("disabled");
    if (discountType == 2) {
      var value = $("#discount").val();
      $("#discount").val(value.substring(0, 2));
    }
  } else {
    $("#discount").attr("disabled", "disabled");
    $("#discount").val(0);
    $("#supplierDiscountAmount").text("0");
  }
  calculateDiscount();
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenClick("#addSupplierItem", function () {
  var data = {
    products: JSON.parse($("#products").val())
  };
  var suppliereItemHtml = prepareTemplateRender("#supplieresItemTemplate", data);
  $(".suppliere-item-container").append(suppliereItemHtml);
  $(".productId").select2({
    placeholder: "Select Product or Enter free text",
    tags: true
  });
  resetSuppliereItemIndex();
});
var resetSupplierItemIndex = function resetSupplierItemIndex() {
  var index = 1;
  $(".supplier-item-container>tr").each(function () {
    $(this).find(".item-number").text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      products: JSON.parse($("#products").val())
    };
    var supplierItemHtml = prepareTemplateRender("#suppliersItemTemplate", data);
    $(".supplier-item-container").append(supplierItemHtml);
    $(".productId").select2();
  }
};
listenClick(".delete-supplier-item", function () {
  $(this).parents("tr").remove();
  resetSupplierItemIndex();
  calculateAndSetSupplierAmount();
});
listenChange(".product-supplier", function () {
  var productId = $(this).val();
  if (isEmpty(productId)) {
    productId = 0;
  }
  var element = $(this);
  $.ajax({
    url: route("supplier.get-product", productId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        var price = "";
        $.each(result.data, function (id, productPrice) {
          if (id === productId) price = productPrice;
        });
        element.parent().parent().find("td .price-supplier").val(price);
        element.parent().parent().find("td .qty-supplier").val(1);
        $(".price-supplier").trigger("keyup");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenKeyup(".qty-supplier", function () {
  var qty = parseFloat($(this).val());
  var rate = $(this).parent().siblings().find(".price-supplier").val();
  rate = parseFloat(removeCommas(rate));
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".supplier-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetsupplierAmount();
});
listenKeyup(".price-supplier", function () {
  var rate = $(this).val();
  rate = parseFloat(removeCommas(rate));
  var qty = $(this).parent().siblings().find(".qty-supplier").val();
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".supplier-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetSupplierAmount();
});
var calculateAmount = function calculateAmount(qty, rate) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    return price;
  } else {
    return 0;
  }
};
var calculateAndSetSupplierAmount = function calculateAndSetSupplierAmount() {
  var supplierTotalAmount = 0;
  $(".supplier-item-container>tr").each(function () {
    var supplierItemTotal = $(this).find(".supplier-item-total").text();
    supplierItemTotal = removeCommas(supplierItemTotal);
    supplierItemTotal = isEmpty($.trim(supplierItemTotal)) ? 0 : parseFloat(supplierItemTotal);
    supplierTotalAmount += supplierItemTotal;
  });
  supplierTotalAmount = parseFloat(supplierTotalAmount);
  if (isNaN(supplierTotalAmount)) {
    supplierTotalAmount = 0;
  }
  $("#supplierTotal").text(addCommas(supplierTotalAmount.toFixed(2)));

  //set hidden input value
  $("#supplierTotalAmount").val(supplierTotalAmount);
  calculateDiscount();
};
var calculateDiscount = function calculateDiscount() {
  var discount = $("#discount").val();
  discountType = $("#discountType").val();
  var itemAmount = [];
  var i = 0;
  $(".supplier-item-total").each(function () {
    itemAmount[i++] = $.trim(removeCommas($(this).text()));
  });
  $.sum = function (arr) {
    var r = 0;
    $.each(arr, function (i, v) {
      r += +v;
    });
    return r;
  };
  var totalAmount = $.sum(itemAmount);
  $("#supplierTotal").text(number_format(totalAmount));
  if (isEmpty(discount) || isEmpty(totalAmount)) {
    discount = 0;
  }
  var discountAmount = 0;
  var finalAmount = totalAmount - discountAmount;
  if (discountType == 1) {
    discountAmount = discount;
    finalAmount = totalAmount - discountAmount;
  } else if (discountType == 2) {
    discountAmount = totalAmount * discount / 100;
    finalAmount = totalAmount - discountAmount;
  }
  $("#supplierFinalAmount").text(number_format(finalAmount));
  $("#supplierTotalAmount").val(finalAmount.toFixed(2));
  $("#supplierDiscountAmount").text(number_format(discountAmount));
};
listen("keyup", "#discount", function () {
  var value = $(this).val();
  if (discountType == 2 && value > 100) {
    displayErrorMessage("On Percentage you can only give maximum 100% discount");
    $(this).val(value.slice(0, -1));
    return false;
  }
  calculateDiscount();
});
listenClick("#saveAsDraftSupplier", function (event) {
  event.preventDefault();
  var myForm = document.getElementById("supplierForm");
  var formData = new FormData(myForm);
  screenLock();
  $.ajax({
    url: route("suppliers.store"),
    type: "POST",
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      Turbo.visit(route("suppliers.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick("#editSaveSupplier", function (event) {
  event.preventDefault();
  var formData = $("#edit_supplierForm").serialize();
  screenLock();
  $.ajax({
    url: $("#supplierUpdateUrl").val(),
    type: "put",
    data: formData,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      Turbo.visit(route("suppliers.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listen("input", ".qty-supplier", function () {
  var quantity = $(this).val();
  if (quantity.length == 8) {
    $(this).val(quantity.slice(0, -1));
  }
});

/***/ }),

/***/ "./resources/assets/js/supplier/supplier.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/supplier/supplier.js ***!
  \**************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadSupplier);
function loadSupplier() {
  initializeSelect2Supplier();
}
function initializeSelect2Supplier() {
  if (!select2NotExists('#status_filter')) {
    return false;
  }
  removeSelect2Container(['#status_filter']);
  $('#status_filter').select2({
    placeholder: 'All'
  });
  if ($('#status').val() == '') {
    $('#status_filter').val(5).trigger('change');
  }
}
listenClick('.supplier-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('suppliers.destroy', id), 'supplier', Lang.get('messages.supplier.supplier'));
});
listenClick('#resetFilter', function () {
  $('#status_filter').val(5).trigger('change');
  $('#status_filter').select2({
    placeholder: 'All'
  });
});
listenClick('.convert-to-invoice', function (e) {
  e.preventDefault();
  var supplierId = $(this).data('id');
  $.ajax({
    url: route('suppliers.convert-to-invoice'),
    type: 'GET',
    data: {
      supplierId: supplierId
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});

/***/ }),

/***/ "./resources/assets/js/tax/tax.js":
/*!****************************************!*\
  !*** ./resources/assets/js/tax/tax.js ***!
  \****************************************/
/***/ (() => {

listenClick(".addTax", function () {
  $("#addTaxModal").appendTo("body").modal("show");
});
listenSubmit("#addTaxForm", function (e) {
  e.preventDefault();
  if (isDoubleClicked($(this))) return;
  $.ajax({
    url: route("taxes.store"),
    type: "POST",
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#addTaxModal").modal("hide");
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#taxTbl").DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenHiddenBsModal("#addTaxModal", function () {
  resetModalForm("#addTaxForm", "#validationErrorsBox");
});
listenClick(".tax-edit-btn", function (event) {
  var taxId = $(event.currentTarget).attr("data-id");
  taxRenderData(taxId);
});
listenSubmit("#editTaxForm", function (event) {
  event.preventDefault();
  var taxId = $("#taxId").val();
  $.ajax({
    url: route("taxes.update", {
      tax: taxId
    }),
    type: "put",
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#editTaxModal").modal("hide");
        $("#taxTbl").DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick(".tax-delete-btn", function (event) {
  var taxId = $(event.currentTarget).attr("data-id");
  deleteItem(route("taxes.destroy", taxId), "#taxTbl", Lang.get("messages.invoice.tax"));
});
listenChange(".tax-status", function (event) {
  var taxId = $(event.currentTarget).attr("data-id");
  updateStatus(taxId);
});
function taxRenderData(taxId) {
  $.ajax({
    url: route("taxes.edit", taxId),
    type: "GET",
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $("#editTaxName").val(result.data.name);
        $("#editTaxValue").val(result.data.value);
        if (result.data.is_default === 1) {
          $("input:radio[value='1'][name='is_default']").prop("checked", true);
        } else {
          $("input:radio[value='0'][name='is_default']").prop("checked", true);
        }
        $("#taxId").val(result.data.id);
        $("#editTaxModal").appendTo("body").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
function updateStatus(taxId) {
  $.ajax({
    url: route("taxes.default-status", taxId),
    method: "post",
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      livewire.emit("refreshDatatable");
      livewire.emit("resetPageTable");
    }
  });
}

/***/ }),

/***/ "./resources/assets/js/transaction/transaction.js":
/*!********************************************************!*\
  !*** ./resources/assets/js/transaction/transaction.js ***!
  \********************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadTransaction);
function loadTransaction() {
  initializeSelect2Transaction();
}
function initializeSelect2Transaction() {
  if (!select2NotExists('#paymentModeFilter')) {
    return false;
  }
  removeSelect2Container(["#paymentModeFilter"]);
  $('#paymentModeFilter').select2({
    placeholder: 'Select Payment Method',
    allowClear: false
  });
}
listenClick('#resetFilter', function () {
  $('#paymentModeFilter').select2({
    placeholder: 'Select Payment Method',
    allowClear: false
  });
  $('#paymentModeFilter').val(0).trigger('change');
});
listenClick('.show-payment-notes', function () {
  var paymentId = $(this).attr('data-id');
  paymentData(paymentId);
});
function paymentData(paymentId) {
  $.ajax({
    url: route('payment-notes.show', paymentId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var notes = isEmpty(result.data) ? 'N/A' : result.data;
        $('#showClientNotesId').text(notes);
        $('#paymentNotesModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
;

/***/ }),

/***/ "./resources/assets/js/transfer/transfer.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/transfer/transfer.js ***!
  \**************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditQuote);
function loadCreateEditQuote() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditQuote();
  momentFormat = convertToMomentFormat(currentDateFormat);
}
function initializeSelect2CreateEditQuote() {
  $("#from_warehouse_id,#to_warehouse_id,#discountType,#status").select2();
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  $("#transfer_date").flatpickr({
    defaultDate: new Date(),
    dateFormat: currentDateFormat,
    maxDate: new Date(),
    locale: getUserLanguages
  });
  // let currentDate = moment(new Date())
  //     .add(1, "days")
  //     .format(convertToMomentFormat(currentDateFormat));

  // $("#transfer_date").flatpickr({
  //     defaultDate: moment(new Date()).format(
  //         convertToMomentFormat(currentDateFormat)
  //     ),
  //     dateFormat: currentDateFormat,
  //     locale: getUserLanguages,
  //     onReady: function () {
  //         if (typeof currentDate != "undefined") {
  //             currentDate.set("minDate", currentDate);
  //         }
  //     },
  // });
}
window.qtyUpdate = function (obj) {
  livewire.emit('qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};
window.transferShowProductModal = function (pid) {
  var pitems = $.parseJSON($('#transfer_items').val());
  var p = pitems[pid];
  if (typeof p !== 'undefined') {
    console.log(p);
    $('#transferProductModal').find('h2').html(p.name);
    $('#product_id').val(pid);
    $('#product_cost_id').val(p.product_cost);
    $('#tax_type_id').val(p.tax_type).select2();
    $('#tax_value_id').val(p.tax_value);
    $('#discount_type_id').val(p.discount_type).select2();
    $('#discount_value_id').val(p.discount_value);
    $('#transferProductModal').modal('show');
  }
};
listenClick('#updateTransferProduct', function (event) {
  event.preventDefault();
  var product_cost = $('#product_cost_id').val();
  $('.product_cost').hide();
  if (product_cost === '' || product_cost === null) {
    $('.product_cost').html('Product cost required').show();
    return false;
  }
  livewire.emit('productUpdate', {
    'product_id': $('#product_id').val(),
    'product_cost': product_cost,
    'tax_type': $('#tax_type_id').val(),
    'tax_value': $('#tax_value_id').val(),
    'discount_type': $('#discount_type_id').val(),
    'discount_value': $('#discount_value_id').val()
  });
  $('#transferProductModal').modal('hide');
});
listenClick("#saveTransferForm", function (event) {
  event.preventDefault();
  var frm = $(this).parents('form');
  if ($('#from_warehouse_id').val() == "") {
    displayErrorMessage("Select From Warehouse");
    return;
  }
  if ($('#to_warehouse_id').val() == "") {
    displayErrorMessage("Select To Warehouse");
    return;
  }
  if ($('#from_warehouse_id').val() == $('#to_warehouse_id').val()) {
    displayErrorMessage("You can not transfer stock in same warehouse");
    return;
  }
  screenLock();
  $.ajax({
    url: frm.attr('action'),
    type: "POST",
    dataType: "json",
    data: $('#' + frm.attr('id')).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(res) {
      displaySuccessMessage(res.result.message);
      Turbo.visit(route("transfers.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick('.transfers-delete-btn', function (event) {
  var transfer_id = $(event.currentTarget).attr('data-id');
  deleteItem(route('transfers.destroy', transfer_id), 'transferTable', 'Transfer');
});

/***/ }),

/***/ "./resources/assets/js/turbo.js":
/*!**************************************!*\
  !*** ./resources/assets/js/turbo.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/turbo */ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js");

window.Turbo = _hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__;
_hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__.start();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__);

/***/ }),

/***/ "./resources/assets/js/unit/unit.js":
/*!******************************************!*\
  !*** ./resources/assets/js/unit/unit.js ***!
  \******************************************/
/***/ (() => {

listenClick('.addUnits', function () {
  $('#addUnitModal').appendTo('body').modal('show');
});
listenSubmit('#addUnitForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: route('unit.store'),
    type: 'POST',
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#addUnitModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenHiddenBsModal('#addUnitModal', function () {
  resetModalForm('#addUnitForm', '#validationErrorsBox');
});
listenClick('.unit-edit-btn', function (event) {
  var UnitId = $(event.currentTarget).attr('data-id');
  UnitRenderData(UnitId);
});
function UnitRenderData(unitId) {
  $.ajax({
    url: route('unit.edit', unitId),
    type: 'GET',
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        console.log("result.data", result.data);
        $('#editUnitName').val(result.data.name);
        $('#editShortName').val(result.data.short_name);
        $('#unitId').val(result.data.id);
        $('#editUnitModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
}
;
listenSubmit('#editUnitForm', function (event) {
  event.preventDefault();
  var unitId = $('#unitId').val();
  $.ajax({
    url: route('unit.update', unitId),
    type: 'put',
    data: $(this).serialize(),
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      if (result.success) {
        $('#editUnitModal').modal('hide');
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
    }
  });
});
listenClick('.unit-delete-btn', function (event) {
  var UnitId = $(event.currentTarget).attr('data-id');
  deleteItem(route('unit.destroy', UnitId), '#unitTbl', "Units");
  // Lang.get('messages.units.base_units')
});

/***/ }),

/***/ "./resources/assets/js/users/create-edit.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/users/create-edit.js ***!
  \**************************************************/
/***/ (() => {

listenClick('.remove-image', function () {
  defaultImagePreview('#previewImage', 1);
  $(this).toggleClass('d-none');
});

/***/ }),

/***/ "./resources/assets/js/users/user-profile.js":
/*!***************************************************!*\
  !*** ./resources/assets/js/users/user-profile.js ***!
  \***************************************************/
/***/ (() => {

document.addEventListener("turbo:load", loadLanguageData);
function loadLanguageData() {
  if ($("#selectLanguage").length) {
    $("#selectLanguage").select2({
      width: "100%",
      dropdownParent: $("#changeLanguageModal")
    });
  }
}
listenClick("#changePassword", function () {
  $(".pass-check-meter div.flex-grow-1").removeClass("active");
  $("#changePasswordModal").modal("show").appendTo("body");
});
listenClick("#passwordChangeBtn", function () {
  $.ajax({
    url: changePasswordUrl,
    type: "PUT",
    data: $("#changePasswordForm").serialize(),
    success: function success(result) {
      $("#changePasswordModal").modal("hide");
      displaySuccessMessage(result.message);
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenHiddenBsModal(["#changeLanguageModal", "#changePasswordModal"], function () {
  var checkUrlContain = window.location.href.indexOf("/invoice/");
  if (checkUrlContain == -1) {
    $("#changeLanguageForm")[0].reset();
    $("#changePasswordForm")[0].reset();
    $("select.select2Selector").each(function (index, element) {
      var drpSelector = "#" + $(this).attr("id");
      $(drpSelector).val(getLoggedInUserLang);
      $(drpSelector).trigger("change");
    });
  }
});
listenClick("#languageChangeBtn", function () {
  $.ajax({
    url: route("change-language"),
    type: "POST",
    data: $("#changeLanguageForm").serialize(),
    success: function success(result) {
      $("#changeLanguageModal").modal("hide");
      displaySuccessMessage(Lang.get("messages.flash.language_updated"));
      setTimeout(function () {
        location.reload(true);
        Turbo.visit(window.location.href);
      }, 2000);
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick("#changeLanguage", function () {
  var getLanguagerUrl = route("get.all.language");
  $.ajax({
    url: getLanguagerUrl,
    type: "GET",
    success: function success(result) {
      if (result.success) {
        livewire.emit("refreshDatatable");
        livewire.emit("resetPageTable");
        $("#selectLanguage").empty();
        var options = [];
        $.each(result.data.getAllLanguage, function (key, value) {
          options += '<option value="' + key + '">' + value + "</option>";
        });
        $("#selectLanguage").html(options);
        $("#selectLanguage").val(result.data.currentLanguage).trigger("change");
        $("#changeLanguageModal").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.message);
    }
  });
});
window.printErrorMessage = function (selector, errorResult) {
  $(selector).show().html("");
  $(selector).text(errorResult.responseJSON.message);
};
listenHiddenBsModal("#changePasswordModal", function () {
  resetModalForm("#changePasswordForm", "#validationErrorsBox");
});

/***/ }),

/***/ "./resources/assets/js/users/users.js":
/*!********************************************!*\
  !*** ./resources/assets/js/users/users.js ***!
  \********************************************/
/***/ (() => {

listenChange('.status', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  updateStatus(userId);
});
function updateStatus(userId) {
  $.ajax({
    url: route('users.status', userId),
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    }
  });
}
listenChange('.is-verified', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: route('users.verified', userId),
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('resetPageTable');
      }
    }
  });
});
listenClick('.user-delete-btn', function (event) {
  var recordId = $(event.currentTarget).attr('data-id');
  deleteItem(route('users.destroy', recordId), 'tableName', Lang.get('messages.user.user'));
});
listenClick('.user-impersonate', function () {
  var id = $(this).data('id');
  var element = document.createElement('a');
  element.setAttribute('href', route('impersonate', id));
  element.setAttribute('data-turbo', 'false');
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  $('.user-impersonate').prop('disabled', true);
});

/***/ }),

/***/ "./resources/assets/js/warehouse/create-edit.js":
/*!******************************************************!*\
  !*** ./resources/assets/js/warehouse/create-edit.js ***!
  \******************************************************/
/***/ (() => {

var discountType = null;
var momentFormat = "";
document.addEventListener("turbo:load", loadCreateEditWarehouse);
function loadCreateEditWarehouse() {
  $('input:text:not([readonly="readonly"])').first().blur();
  initializeSelect2CreateEditWarehouse();
  loadSelect2ClientData();
  momentFormat = convertToMomentFormat(currentDateFormat);
  if ($("#warehouseNoteData").val() == true || $("#warehouseTermData").val() == true) {
    $("#warehouseAddNote").hide();
    $("#warehouseRemoveNote").show();
    $("#warehouseNoteAdd").show();
    $("#warehouseTermRemove").show();
  } else {
    $("#warehouseRemoveNote").hide();
    $("#warehouseNoteAdd").hide();
    $("#warehouseTermRemove").hide();
  }
  if ($("#warehouseRecurring").val() == true) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
  if ($("#discountType").val() != 0) {
    $("#discount").removeAttr("disabled");
  } else {
    $("#discount").attr("disabled", "disabled");
  }
  calculateAndSetWarehouseAmount();
}
function loadSelect2ClientData() {
  if (!$("#client_id").length && !$("#discountType").length) {
    return;
  }
  $("#client_id,#discountType,#status,#templateId").select2();
}
function initializeSelect2CreateEditWarehouse() {
  if (!select2NotExists(".product-warehouse")) {
    return false;
  }
  removeSelect2Container([".product-warehouse"]);
  $(".product-warehouse").select2({
    tags: true
  });
  $(".tax").select2({
    placeholder: "Select TAX"
  });
  $(".payment-qr-code").select2();
  $("#client_id").focus();
  var currentDate = moment(new Date()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
  var warehouseDueDateFlatPicker = $("#warehouseDueDate").flatpickr({
    defaultDate: currentDate,
    dateFormat: currentDateFormat,
    locale: getUserLanguages
  });
  var editWarehouseDueDateVal = moment($("#editWarehouseDueDateAdmin").val()).format(convertToMomentFormat(currentDateFormat));
  var editWarehouseDueDateFlatPicker = $(".edit-warehouse-due-date").flatpickr({
    dateFormat: currentDateFormat,
    defaultDate: editWarehouseDueDateVal,
    locale: getUserLanguages
  });
  $("#warehouse_date").flatpickr({
    defaultDate: moment(new Date()).format(convertToMomentFormat(currentDateFormat)),
    dateFormat: currentDateFormat,
    locale: getUserLanguages,
    onChange: function onChange() {
      var minDate;
      if (currentDateFormat == "d.m.Y" || currentDateFormat == "d/m/Y" || currentDateFormat == "d-m-Y") {
        minDate = moment($("#quote_date").val(), momentFormat).add(1, "days").format(momentFormat);
      } else {
        minDate = moment($("#quote_date").val()).add(1, "days").format(convertToMomentFormat(currentDateFormat));
      }
      if (typeof warehouseDueDateFlatPicker != "undefined") {
        warehouseDueDateFlatPicker.set("minDate", minDate);
      }
    },
    onReady: function onReady() {
      if (typeof warehouseDueDateFlatPicker != "undefined") {
        warehouseDueDateFlatPicker.set("minDate", currentDate);
      }
    }
  });
}
listenKeyup("#warehouseId", function () {
  return $("#warehouseId").val(this.value.toUpperCase());
});
listenClick("#warehouseAddNote", function () {
  $("#warehouseAddNote").hide();
  $("#warehouseRemoveNote").show();
  $("#warehouseNoteAdd").show();
  $("#warehouseTermRemove").show();
});
listenClick("#warehouseRemoveNote", function () {
  $("#warehouseAddNote").show();
  $("#warehouseRemoveNote").hide();
  $("#warehouseNoteAdd").hide();
  $("#warehouseTermRemove").hide();
  $("#warehouseNote").val("");
  $("#warehouseTerm").val("");
  $("#warehouseAddNote").show();
});
listenClick("#formData_recurring-0", function () {
  if ($("#formData_recurring-0").prop("checked")) {
    $(".recurring").show();
  } else {
    $(".recurring").hide();
  }
});
listenClick("#formData_recurring-1", function () {
  if ($("#formData_recurring-1").prop("checked")) {
    $(".recurring").hide();
  }
});
listenChange("#discountType", function () {
  discountType = $(this).val();
  $("#discount").val(0);
  if (discountType == 1 || discountType == 2) {
    $("#discount").removeAttr("disabled");
    if (discountType == 2) {
      var value = $("#discount").val();
      $("#discount").val(value.substring(0, 2));
    }
  } else {
    $("#discount").attr("disabled", "disabled");
    $("#discount").val(0);
    $("#warehouseDiscountAmount").text("0");
  }
  calculateDiscount();
});
window.isNumberKey = function (evt, element) {
  var charCode = evt.which ? evt.which : event.keyCode;
  return !((charCode !== 46 || $(element).val().indexOf(".") !== -1) && (charCode < 48 || charCode > 57));
};
listenClick("#addWarehouseItem", function () {
  var data = {
    products: JSON.parse($("#products").val())
  };
  var warehouseItemHtml = prepareTemplateRender("#warehousesItemTemplate", data);
  $(".warehouse-item-container").append(warehouseItemHtml);
  $(".productId").select2({
    placeholder: "Select Product or Enter free text",
    tags: true
  });
  resetWarehouseItemIndex();
});
var resetWarehouseItemIndex = function resetWarehouseItemIndex() {
  var index = 1;
  $(".warehouse-item-container>tr").each(function () {
    $(this).find(".item-number").text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      products: JSON.parse($("#products").val())
    };
    var warehouseItemHtml = prepareTemplateRender("#warehousesItemTemplate", data);
    $(".warehouse-item-container").append(warehouseItemHtml);
    $(".productId").select2();
  }
};
listenClick(".delete-warehouse-item", function () {
  $(this).parents("tr").remove();
  resetWarehouseItemIndex();
  calculateAndSetWarehouseAmount();
});
listenChange(".product-warehouse", function () {
  var productId = $(this).val();
  if (isEmpty(productId)) {
    productId = 0;
  }
  var element = $(this);
  $.ajax({
    url: route("warehouses.get-product", productId),
    type: "get",
    dataType: "json",
    success: function success(result) {
      if (result.success) {
        var price = "";
        $.each(result.data, function (id, productPrice) {
          if (id === productId) price = productPrice;
        });
        element.parent().parent().find("td .price-warehouse").val(price);
        element.parent().parent().find("td .qty-warehouse").val(1);
        $(".price-warehouse").trigger("keyup");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenKeyup(".qty-warehouse", function () {
  var qty = parseFloat($(this).val());
  var rate = $(this).parent().siblings().find(".price-warehouse").val();
  rate = parseFloat(removeCommas(rate));
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".warehouse-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetWarehouseAmount();
});
listenKeyup(".price-warehouse", function () {
  var rate = $(this).val();
  rate = parseFloat(removeCommas(rate));
  var qty = $(this).parent().siblings().find(".qty-warehouse").val();
  var amount = calculateAmount(qty, rate);
  $(this).parent().siblings(".warehouse-item-total").text(addCommas(amount.toFixed(2).toString()));
  calculateAndSetWarehouseAmount();
});
var calculateAmount = function calculateAmount(qty, rate) {
  if (qty > 0 && rate > 0) {
    var price = qty * rate;
    return price;
  } else {
    return 0;
  }
};
var calculateAndSetWarehouseAmount = function calculateAndSetWarehouseAmount() {
  var warehouseTotalAmount = 0;
  $(".warehouse-item-container>tr").each(function () {
    var warehouseItemTotal = $(this).find(".warehouse-item-total").text();
    warehouseItemTotal = removeCommas(warehouseItemTotal);
    warehouseItemTotal = isEmpty($.trim(warehouseItemTotal)) ? 0 : parseFloat(warehouseItemTotal);
    warehouseTotalAmount += warehouseItemTotal;
  });
  warehouseTotalAmount = parseFloat(warehouseTotalAmount);
  if (isNaN(warehouseTotalAmount)) {
    warehouseTotalAmount = 0;
  }
  $("#warehouseTotal").text(addCommas(warehouseTotalAmount.toFixed(2)));

  //set hidden input value
  $("#warehouseTotalAmount").val(warehouseTotalAmount);
  calculateDiscount();
};
var calculateDiscount = function calculateDiscount() {
  var discount = $("#discount").val();
  discountType = $("#discountType").val();
  var itemAmount = [];
  var i = 0;
  $(".warehouse-item-total").each(function () {
    itemAmount[i++] = $.trim(removeCommas($(this).text()));
  });
  $.sum = function (arr) {
    var r = 0;
    $.each(arr, function (i, v) {
      r += +v;
    });
    return r;
  };
  var totalAmount = $.sum(itemAmount);
  $("#warehouseTotal").text(number_format(totalAmount));
  if (isEmpty(discount) || isEmpty(totalAmount)) {
    discount = 0;
  }
  var discountAmount = 0;
  var finalAmount = totalAmount - discountAmount;
  if (discountType == 1) {
    discountAmount = discount;
    finalAmount = totalAmount - discountAmount;
  } else if (discountType == 2) {
    discountAmount = totalAmount * discount / 100;
    finalAmount = totalAmount - discountAmount;
  }
  $("#warehouseFinalAmount").text(number_format(finalAmount));
  $("#warehouseTotalAmount").val(finalAmount.toFixed(2));
  $("#warehouseDiscountAmount").text(number_format(discountAmount));
};
listen("keyup", "#discount", function () {
  var value = $(this).val();
  if (discountType == 2 && value > 100) {
    displayErrorMessage("On Percentage you can only give maximum 100% discount");
    $(this).val(value.slice(0, -1));
    return false;
  }
  calculateDiscount();
});
listenClick("#saveAsDraftWarehouse", function (event) {
  event.preventDefault();
  var myForm = document.getElementById("warehouseForm");
  var formData = new FormData(myForm);
  screenLock();
  $.ajax({
    url: route("warehouse.store"),
    type: "POST",
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      Turbo.visit(route("warehouse.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listenClick("#editSaveWarehouse", function (event) {
  event.preventDefault();
  var formData = $("#edit_warehouseForm").serialize();
  screenLock();
  $.ajax({
    url: $("#warehouseUpdateUrl").val(),
    type: "put",
    data: formData,
    beforeSend: function beforeSend() {
      startLoader();
    },
    success: function success(result) {
      Turbo.visit(route("warehouse.index"));
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      stopLoader();
      screenUnLock();
    }
  });
});
listen("input", ".qty-warehouse", function () {
  var quantity = $(this).val();
  if (quantity.length == 8) {
    $(this).val(quantity.slice(0, -1));
  }
});

/***/ }),

/***/ "./resources/assets/js/warehouse/warehouse.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/warehouse/warehouse.js ***!
  \****************************************************/
/***/ (() => {

document.addEventListener('turbo:load', loadWarehouse);
function loadWarehouse() {
  initializeSelect2Warehouse();
}
function initializeSelect2Warehouse() {
  if (!select2NotExists('#status_filter')) {
    return false;
  }
  removeSelect2Container(['#status_filter']);
  $('#status_filter').select2({
    placeholder: 'All'
  });
  if ($('#status').val() == '') {
    $('#status_filter').val(5).trigger('change');
  }
}
listenClick('.warehouse-delete-btn', function (event) {
  event.preventDefault();
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('warehouse.destroy', id), 'warehouse', Lang.get('messages.warehouse.warehouse'));
});
listenClick('#resetFilter', function () {
  $('#status_filter').val(5).trigger('change');
  $('#status_filter').select2({
    placeholder: 'All'
  });
});
listenClick('.convert-to-invoice', function (e) {
  e.preventDefault();
  var warehouseId = $(this).data('id');
  $.ajax({
    url: route('warehouses.convert-to-invoice'),
    type: 'GET',
    data: {
      warehouseId: warehouseId
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refreshDatatable');
        livewire.emit('resetPageTable');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});

/***/ }),

/***/ "./node_modules/flatpickr/dist/l10n/index.js":
/*!***************************************************!*\
  !*** ./node_modules/flatpickr/dist/l10n/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
     true ? factory(exports) :
    0;
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var fp = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Arabic = {
        weekdays: {
            shorthand: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
            longhand: [
                "الأحد",
                "الاثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت",
            ],
        },
        months: {
            shorthand: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            longhand: [
                "يناير",
                "فبراير",
                "مارس",
                "أبريل",
                "مايو",
                "يونيو",
                "يوليو",
                "أغسطس",
                "سبتمبر",
                "أكتوبر",
                "نوفمبر",
                "ديسمبر",
            ],
        },
        firstDayOfWeek: 6,
        rangeSeparator: " إلى ",
        weekAbbreviation: "Wk",
        scrollTitle: "قم بالتمرير للزيادة",
        toggleTitle: "اضغط للتبديل",
        amPM: ["ص", "م"],
        yearAriaLabel: "سنة",
        monthAriaLabel: "شهر",
        hourAriaLabel: "ساعة",
        minuteAriaLabel: "دقيقة",
        time_24hr: false,
    };
    fp.l10ns.ar = Arabic;
    fp.l10ns;

    var fp$1 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Austria = {
        weekdays: {
            shorthand: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            longhand: [
                "Sonntag",
                "Montag",
                "Dienstag",
                "Mittwoch",
                "Donnerstag",
                "Freitag",
                "Samstag",
            ],
        },
        months: {
            shorthand: [
                "Jän",
                "Feb",
                "Mär",
                "Apr",
                "Mai",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Dez",
            ],
            longhand: [
                "Jänner",
                "Februar",
                "März",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Dezember",
            ],
        },
        firstDayOfWeek: 1,
        weekAbbreviation: "KW",
        rangeSeparator: " bis ",
        scrollTitle: "Zum Ändern scrollen",
        toggleTitle: "Zum Umschalten klicken",
        time_24hr: true,
    };
    fp$1.l10ns.at = Austria;
    fp$1.l10ns;

    var fp$2 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Azerbaijan = {
        weekdays: {
            shorthand: ["B.", "B.e.", "Ç.a.", "Ç.", "C.a.", "C.", "Ş."],
            longhand: [
                "Bazar",
                "Bazar ertəsi",
                "Çərşənbə axşamı",
                "Çərşənbə",
                "Cümə axşamı",
                "Cümə",
                "Şənbə",
            ],
        },
        months: {
            shorthand: [
                "Yan",
                "Fev",
                "Mar",
                "Apr",
                "May",
                "İyn",
                "İyl",
                "Avq",
                "Sen",
                "Okt",
                "Noy",
                "Dek",
            ],
            longhand: [
                "Yanvar",
                "Fevral",
                "Mart",
                "Aprel",
                "May",
                "İyun",
                "İyul",
                "Avqust",
                "Sentyabr",
                "Oktyabr",
                "Noyabr",
                "Dekabr",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return ".";
        },
        rangeSeparator: " - ",
        weekAbbreviation: "Hf",
        scrollTitle: "Artırmaq üçün sürüşdürün",
        toggleTitle: "Aç / Bağla",
        amPM: ["GƏ", "GS"],
        time_24hr: true,
    };
    fp$2.l10ns.az = Azerbaijan;
    fp$2.l10ns;

    var fp$3 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Belarusian = {
        weekdays: {
            shorthand: ["Нд", "Пн", "Аў", "Ср", "Чц", "Пт", "Сб"],
            longhand: [
                "Нядзеля",
                "Панядзелак",
                "Аўторак",
                "Серада",
                "Чацвер",
                "Пятніца",
                "Субота",
            ],
        },
        months: {
            shorthand: [
                "Сту",
                "Лют",
                "Сак",
                "Кра",
                "Тра",
                "Чэр",
                "Ліп",
                "Жні",
                "Вер",
                "Кас",
                "Ліс",
                "Сне",
            ],
            longhand: [
                "Студзень",
                "Люты",
                "Сакавік",
                "Красавік",
                "Травень",
                "Чэрвень",
                "Ліпень",
                "Жнівень",
                "Верасень",
                "Кастрычнік",
                "Лістапад",
                "Снежань",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "Тыд.",
        scrollTitle: "Пракруціце для павелічэння",
        toggleTitle: "Націсніце для пераключэння",
        amPM: ["ДП", "ПП"],
        yearAriaLabel: "Год",
        time_24hr: true,
    };
    fp$3.l10ns.be = Belarusian;
    fp$3.l10ns;

    var fp$4 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Bosnian = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
            longhand: [
                "Nedjelja",
                "Ponedjeljak",
                "Utorak",
                "Srijeda",
                "Četvrtak",
                "Petak",
                "Subota",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Maj",
                "Jun",
                "Jul",
                "Avg",
                "Sep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "Januar",
                "Februar",
                "Mart",
                "April",
                "Maj",
                "Juni",
                "Juli",
                "Avgust",
                "Septembar",
                "Oktobar",
                "Novembar",
                "Decembar",
            ],
        },
        time_24hr: true,
    };
    fp$4.l10ns.bs = Bosnian;
    fp$4.l10ns;

    var fp$5 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Bulgarian = {
        weekdays: {
            shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            longhand: [
                "Неделя",
                "Понеделник",
                "Вторник",
                "Сряда",
                "Четвъртък",
                "Петък",
                "Събота",
            ],
        },
        months: {
            shorthand: [
                "Яну",
                "Фев",
                "Март",
                "Апр",
                "Май",
                "Юни",
                "Юли",
                "Авг",
                "Сеп",
                "Окт",
                "Ное",
                "Дек",
            ],
            longhand: [
                "Януари",
                "Февруари",
                "Март",
                "Април",
                "Май",
                "Юни",
                "Юли",
                "Август",
                "Септември",
                "Октомври",
                "Ноември",
                "Декември",
            ],
        },
        time_24hr: true,
        firstDayOfWeek: 1,
    };
    fp$5.l10ns.bg = Bulgarian;
    fp$5.l10ns;

    var fp$6 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Bangla = {
        weekdays: {
            shorthand: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"],
            longhand: [
                "রবিবার",
                "সোমবার",
                "মঙ্গলবার",
                "বুধবার",
                "বৃহস্পতিবার",
                "শুক্রবার",
                "শনিবার",
            ],
        },
        months: {
            shorthand: [
                "জানু",
                "ফেব্রু",
                "মার্চ",
                "এপ্রিল",
                "মে",
                "জুন",
                "জুলাই",
                "আগ",
                "সেপ্টে",
                "অক্টো",
                "নভে",
                "ডিসে",
            ],
            longhand: [
                "জানুয়ারী",
                "ফেব্রুয়ারী",
                "মার্চ",
                "এপ্রিল",
                "মে",
                "জুন",
                "জুলাই",
                "আগস্ট",
                "সেপ্টেম্বর",
                "অক্টোবর",
                "নভেম্বর",
                "ডিসেম্বর",
            ],
        },
    };
    fp$6.l10ns.bn = Bangla;
    fp$6.l10ns;

    var fp$7 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Catalan = {
        weekdays: {
            shorthand: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
            longhand: [
                "Diumenge",
                "Dilluns",
                "Dimarts",
                "Dimecres",
                "Dijous",
                "Divendres",
                "Dissabte",
            ],
        },
        months: {
            shorthand: [
                "Gen",
                "Febr",
                "Març",
                "Abr",
                "Maig",
                "Juny",
                "Jul",
                "Ag",
                "Set",
                "Oct",
                "Nov",
                "Des",
            ],
            longhand: [
                "Gener",
                "Febrer",
                "Març",
                "Abril",
                "Maig",
                "Juny",
                "Juliol",
                "Agost",
                "Setembre",
                "Octubre",
                "Novembre",
                "Desembre",
            ],
        },
        ordinal: function (nth) {
            var s = nth % 100;
            if (s > 3 && s < 21)
                return "è";
            switch (s % 10) {
                case 1:
                    return "r";
                case 2:
                    return "n";
                case 3:
                    return "r";
                case 4:
                    return "t";
                default:
                    return "è";
            }
        },
        firstDayOfWeek: 1,
        rangeSeparator: " a ",
        time_24hr: true,
    };
    fp$7.l10ns.cat = fp$7.l10ns.ca = Catalan;
    fp$7.l10ns;

    var fp$8 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Kurdish = {
        weekdays: {
            shorthand: [
                "یەکشەممە",
                "دووشەممە",
                "سێشەممە",
                "چوارشەممە",
                "پێنجشەممە",
                "هەینی",
                "شەممە",
            ],
            longhand: [
                "یەکشەممە",
                "دووشەممە",
                "سێشەممە",
                "چوارشەممە",
                "پێنجشەممە",
                "هەینی",
                "شەممە",
            ],
        },
        months: {
            shorthand: [
                "ڕێبەندان",
                "ڕەشەمە",
                "نەورۆز",
                "گوڵان",
                "جۆزەردان",
                "پووشپەڕ",
                "گەلاوێژ",
                "خەرمانان",
                "ڕەزبەر",
                "گەڵاڕێزان",
                "سەرماوەز",
                "بەفرانبار",
            ],
            longhand: [
                "ڕێبەندان",
                "ڕەشەمە",
                "نەورۆز",
                "گوڵان",
                "جۆزەردان",
                "پووشپەڕ",
                "گەلاوێژ",
                "خەرمانان",
                "ڕەزبەر",
                "گەڵاڕێزان",
                "سەرماوەز",
                "بەفرانبار",
            ],
        },
        firstDayOfWeek: 6,
        ordinal: function () {
            return "";
        },
    };
    fp$8.l10ns.ckb = Kurdish;
    fp$8.l10ns;

    var fp$9 = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Czech = {
        weekdays: {
            shorthand: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
            longhand: [
                "Neděle",
                "Pondělí",
                "Úterý",
                "Středa",
                "Čtvrtek",
                "Pátek",
                "Sobota",
            ],
        },
        months: {
            shorthand: [
                "Led",
                "Ún",
                "Bře",
                "Dub",
                "Kvě",
                "Čer",
                "Čvc",
                "Srp",
                "Zář",
                "Říj",
                "Lis",
                "Pro",
            ],
            longhand: [
                "Leden",
                "Únor",
                "Březen",
                "Duben",
                "Květen",
                "Červen",
                "Červenec",
                "Srpen",
                "Září",
                "Říjen",
                "Listopad",
                "Prosinec",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return ".";
        },
        rangeSeparator: " do ",
        weekAbbreviation: "Týd.",
        scrollTitle: "Rolujte pro změnu",
        toggleTitle: "Přepnout dopoledne/odpoledne",
        amPM: ["dop.", "odp."],
        yearAriaLabel: "Rok",
        time_24hr: true,
    };
    fp$9.l10ns.cs = Czech;
    fp$9.l10ns;

    var fp$a = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Welsh = {
        weekdays: {
            shorthand: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwe", "Sad"],
            longhand: [
                "Dydd Sul",
                "Dydd Llun",
                "Dydd Mawrth",
                "Dydd Mercher",
                "Dydd Iau",
                "Dydd Gwener",
                "Dydd Sadwrn",
            ],
        },
        months: {
            shorthand: [
                "Ion",
                "Chwef",
                "Maw",
                "Ebr",
                "Mai",
                "Meh",
                "Gorff",
                "Awst",
                "Medi",
                "Hyd",
                "Tach",
                "Rhag",
            ],
            longhand: [
                "Ionawr",
                "Chwefror",
                "Mawrth",
                "Ebrill",
                "Mai",
                "Mehefin",
                "Gorffennaf",
                "Awst",
                "Medi",
                "Hydref",
                "Tachwedd",
                "Rhagfyr",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function (nth) {
            if (nth === 1)
                return "af";
            if (nth === 2)
                return "ail";
            if (nth === 3 || nth === 4)
                return "ydd";
            if (nth === 5 || nth === 6)
                return "ed";
            if ((nth >= 7 && nth <= 10) ||
                nth == 12 ||
                nth == 15 ||
                nth == 18 ||
                nth == 20)
                return "fed";
            if (nth == 11 ||
                nth == 13 ||
                nth == 14 ||
                nth == 16 ||
                nth == 17 ||
                nth == 19)
                return "eg";
            if (nth >= 21 && nth <= 39)
                return "ain";
            // Inconclusive.
            return "";
        },
        time_24hr: true,
    };
    fp$a.l10ns.cy = Welsh;
    fp$a.l10ns;

    var fp$b = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Danish = {
        weekdays: {
            shorthand: ["søn", "man", "tir", "ons", "tors", "fre", "lør"],
            longhand: [
                "søndag",
                "mandag",
                "tirsdag",
                "onsdag",
                "torsdag",
                "fredag",
                "lørdag",
            ],
        },
        months: {
            shorthand: [
                "jan",
                "feb",
                "mar",
                "apr",
                "maj",
                "jun",
                "jul",
                "aug",
                "sep",
                "okt",
                "nov",
                "dec",
            ],
            longhand: [
                "januar",
                "februar",
                "marts",
                "april",
                "maj",
                "juni",
                "juli",
                "august",
                "september",
                "oktober",
                "november",
                "december",
            ],
        },
        ordinal: function () {
            return ".";
        },
        firstDayOfWeek: 1,
        rangeSeparator: " til ",
        weekAbbreviation: "uge",
        time_24hr: true,
    };
    fp$b.l10ns.da = Danish;
    fp$b.l10ns;

    var fp$c = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var German = {
        weekdays: {
            shorthand: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            longhand: [
                "Sonntag",
                "Montag",
                "Dienstag",
                "Mittwoch",
                "Donnerstag",
                "Freitag",
                "Samstag",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mär",
                "Apr",
                "Mai",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Dez",
            ],
            longhand: [
                "Januar",
                "Februar",
                "März",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Dezember",
            ],
        },
        firstDayOfWeek: 1,
        weekAbbreviation: "KW",
        rangeSeparator: " bis ",
        scrollTitle: "Zum Ändern scrollen",
        toggleTitle: "Zum Umschalten klicken",
        time_24hr: true,
    };
    fp$c.l10ns.de = German;
    fp$c.l10ns;

    var english = {
        weekdays: {
            shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            longhand: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            longhand: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: function (nth) {
            var s = nth % 100;
            if (s > 3 && s < 21)
                return "th";
            switch (s % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        },
        rangeSeparator: " to ",
        weekAbbreviation: "Wk",
        scrollTitle: "Scroll to increment",
        toggleTitle: "Click to toggle",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Year",
        monthAriaLabel: "Month",
        hourAriaLabel: "Hour",
        minuteAriaLabel: "Minute",
        time_24hr: false,
    };

    var fp$d = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Esperanto = {
        firstDayOfWeek: 1,
        rangeSeparator: " ĝis ",
        weekAbbreviation: "Sem",
        scrollTitle: "Rulumu por pligrandigi la valoron",
        toggleTitle: "Klaku por ŝalti",
        weekdays: {
            shorthand: ["Dim", "Lun", "Mar", "Mer", "Ĵaŭ", "Ven", "Sab"],
            longhand: [
                "dimanĉo",
                "lundo",
                "mardo",
                "merkredo",
                "ĵaŭdo",
                "vendredo",
                "sabato",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Maj",
                "Jun",
                "Jul",
                "Aŭg",
                "Sep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "januaro",
                "februaro",
                "marto",
                "aprilo",
                "majo",
                "junio",
                "julio",
                "aŭgusto",
                "septembro",
                "oktobro",
                "novembro",
                "decembro",
            ],
        },
        ordinal: function () {
            return "-a";
        },
        time_24hr: true,
    };
    fp$d.l10ns.eo = Esperanto;
    fp$d.l10ns;

    var fp$e = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Spanish = {
        weekdays: {
            shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            longhand: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],
        },
        months: {
            shorthand: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ],
            longhand: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
            ],
        },
        ordinal: function () {
            return "º";
        },
        firstDayOfWeek: 1,
        rangeSeparator: " a ",
        time_24hr: true,
    };
    fp$e.l10ns.es = Spanish;
    fp$e.l10ns;

    var fp$f = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Estonian = {
        weekdays: {
            shorthand: ["P", "E", "T", "K", "N", "R", "L"],
            longhand: [
                "Pühapäev",
                "Esmaspäev",
                "Teisipäev",
                "Kolmapäev",
                "Neljapäev",
                "Reede",
                "Laupäev",
            ],
        },
        months: {
            shorthand: [
                "Jaan",
                "Veebr",
                "Märts",
                "Apr",
                "Mai",
                "Juuni",
                "Juuli",
                "Aug",
                "Sept",
                "Okt",
                "Nov",
                "Dets",
            ],
            longhand: [
                "Jaanuar",
                "Veebruar",
                "Märts",
                "Aprill",
                "Mai",
                "Juuni",
                "Juuli",
                "August",
                "September",
                "Oktoober",
                "November",
                "Detsember",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return ".";
        },
        weekAbbreviation: "Näd",
        rangeSeparator: " kuni ",
        scrollTitle: "Keri, et suurendada",
        toggleTitle: "Klõpsa, et vahetada",
        time_24hr: true,
    };
    fp$f.l10ns.et = Estonian;
    fp$f.l10ns;

    var fp$g = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Persian = {
        weekdays: {
            shorthand: ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"],
            longhand: [
                "یک‌شنبه",
                "دوشنبه",
                "سه‌شنبه",
                "چهارشنبه",
                "پنچ‌شنبه",
                "جمعه",
                "شنبه",
            ],
        },
        months: {
            shorthand: [
                "ژانویه",
                "فوریه",
                "مارس",
                "آوریل",
                "مه",
                "ژوئن",
                "ژوئیه",
                "اوت",
                "سپتامبر",
                "اکتبر",
                "نوامبر",
                "دسامبر",
            ],
            longhand: [
                "ژانویه",
                "فوریه",
                "مارس",
                "آوریل",
                "مه",
                "ژوئن",
                "ژوئیه",
                "اوت",
                "سپتامبر",
                "اکتبر",
                "نوامبر",
                "دسامبر",
            ],
        },
        firstDayOfWeek: 6,
        ordinal: function () {
            return "";
        },
    };
    fp$g.l10ns.fa = Persian;
    fp$g.l10ns;

    var fp$h = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Finnish = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["su", "ma", "ti", "ke", "to", "pe", "la"],
            longhand: [
                "sunnuntai",
                "maanantai",
                "tiistai",
                "keskiviikko",
                "torstai",
                "perjantai",
                "lauantai",
            ],
        },
        months: {
            shorthand: [
                "tammi",
                "helmi",
                "maalis",
                "huhti",
                "touko",
                "kesä",
                "heinä",
                "elo",
                "syys",
                "loka",
                "marras",
                "joulu",
            ],
            longhand: [
                "tammikuu",
                "helmikuu",
                "maaliskuu",
                "huhtikuu",
                "toukokuu",
                "kesäkuu",
                "heinäkuu",
                "elokuu",
                "syyskuu",
                "lokakuu",
                "marraskuu",
                "joulukuu",
            ],
        },
        ordinal: function () {
            return ".";
        },
        time_24hr: true,
    };
    fp$h.l10ns.fi = Finnish;
    fp$h.l10ns;

    var fp$i = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Faroese = {
        weekdays: {
            shorthand: ["Sun", "Mán", "Týs", "Mik", "Hós", "Frí", "Ley"],
            longhand: [
                "Sunnudagur",
                "Mánadagur",
                "Týsdagur",
                "Mikudagur",
                "Hósdagur",
                "Fríggjadagur",
                "Leygardagur",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Mai",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Des",
            ],
            longhand: [
                "Januar",
                "Februar",
                "Mars",
                "Apríl",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "Septembur",
                "Oktobur",
                "Novembur",
                "Desembur",
            ],
        },
        ordinal: function () {
            return ".";
        },
        firstDayOfWeek: 1,
        rangeSeparator: " til ",
        weekAbbreviation: "vika",
        scrollTitle: "Rulla fyri at broyta",
        toggleTitle: "Trýst fyri at skifta",
        yearAriaLabel: "Ár",
        time_24hr: true,
    };
    fp$i.l10ns.fo = Faroese;
    fp$i.l10ns;

    var fp$j = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var French = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
            longhand: [
                "dimanche",
                "lundi",
                "mardi",
                "mercredi",
                "jeudi",
                "vendredi",
                "samedi",
            ],
        },
        months: {
            shorthand: [
                "janv",
                "févr",
                "mars",
                "avr",
                "mai",
                "juin",
                "juil",
                "août",
                "sept",
                "oct",
                "nov",
                "déc",
            ],
            longhand: [
                "janvier",
                "février",
                "mars",
                "avril",
                "mai",
                "juin",
                "juillet",
                "août",
                "septembre",
                "octobre",
                "novembre",
                "décembre",
            ],
        },
        ordinal: function (nth) {
            if (nth > 1)
                return "";
            return "er";
        },
        rangeSeparator: " au ",
        weekAbbreviation: "Sem",
        scrollTitle: "Défiler pour augmenter la valeur",
        toggleTitle: "Cliquer pour basculer",
        time_24hr: true,
    };
    fp$j.l10ns.fr = French;
    fp$j.l10ns;

    var fp$k = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Greek = {
        weekdays: {
            shorthand: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
            longhand: [
                "Κυριακή",
                "Δευτέρα",
                "Τρίτη",
                "Τετάρτη",
                "Πέμπτη",
                "Παρασκευή",
                "Σάββατο",
            ],
        },
        months: {
            shorthand: [
                "Ιαν",
                "Φεβ",
                "Μάρ",
                "Απρ",
                "Μάι",
                "Ιούν",
                "Ιούλ",
                "Αύγ",
                "Σεπ",
                "Οκτ",
                "Νοέ",
                "Δεκ",
            ],
            longhand: [
                "Ιανουάριος",
                "Φεβρουάριος",
                "Μάρτιος",
                "Απρίλιος",
                "Μάιος",
                "Ιούνιος",
                "Ιούλιος",
                "Αύγουστος",
                "Σεπτέμβριος",
                "Οκτώβριος",
                "Νοέμβριος",
                "Δεκέμβριος",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        weekAbbreviation: "Εβδ",
        rangeSeparator: " έως ",
        scrollTitle: "Μετακυλήστε για προσαύξηση",
        toggleTitle: "Κάντε κλικ για αλλαγή",
        amPM: ["ΠΜ", "ΜΜ"],
        yearAriaLabel: "χρόνος",
        monthAriaLabel: "μήνας",
        hourAriaLabel: "ώρα",
        minuteAriaLabel: "λεπτό",
    };
    fp$k.l10ns.gr = Greek;
    fp$k.l10ns;

    var fp$l = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Hebrew = {
        weekdays: {
            shorthand: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
            longhand: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
        },
        months: {
            shorthand: [
                "ינו׳",
                "פבר׳",
                "מרץ",
                "אפר׳",
                "מאי",
                "יוני",
                "יולי",
                "אוג׳",
                "ספט׳",
                "אוק׳",
                "נוב׳",
                "דצמ׳",
            ],
            longhand: [
                "ינואר",
                "פברואר",
                "מרץ",
                "אפריל",
                "מאי",
                "יוני",
                "יולי",
                "אוגוסט",
                "ספטמבר",
                "אוקטובר",
                "נובמבר",
                "דצמבר",
            ],
        },
        rangeSeparator: " אל ",
        time_24hr: true,
    };
    fp$l.l10ns.he = Hebrew;
    fp$l.l10ns;

    var fp$m = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Hindi = {
        weekdays: {
            shorthand: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
            longhand: [
                "रविवार",
                "सोमवार",
                "मंगलवार",
                "बुधवार",
                "गुरुवार",
                "शुक्रवार",
                "शनिवार",
            ],
        },
        months: {
            shorthand: [
                "जन",
                "फर",
                "मार्च",
                "अप्रेल",
                "मई",
                "जून",
                "जूलाई",
                "अग",
                "सित",
                "अक्ट",
                "नव",
                "दि",
            ],
            longhand: [
                "जनवरी ",
                "फरवरी",
                "मार्च",
                "अप्रेल",
                "मई",
                "जून",
                "जूलाई",
                "अगस्त ",
                "सितम्बर",
                "अक्टूबर",
                "नवम्बर",
                "दिसम्बर",
            ],
        },
    };
    fp$m.l10ns.hi = Hindi;
    fp$m.l10ns;

    var fp$n = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Croatian = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
            longhand: [
                "Nedjelja",
                "Ponedjeljak",
                "Utorak",
                "Srijeda",
                "Četvrtak",
                "Petak",
                "Subota",
            ],
        },
        months: {
            shorthand: [
                "Sij",
                "Velj",
                "Ožu",
                "Tra",
                "Svi",
                "Lip",
                "Srp",
                "Kol",
                "Ruj",
                "Lis",
                "Stu",
                "Pro",
            ],
            longhand: [
                "Siječanj",
                "Veljača",
                "Ožujak",
                "Travanj",
                "Svibanj",
                "Lipanj",
                "Srpanj",
                "Kolovoz",
                "Rujan",
                "Listopad",
                "Studeni",
                "Prosinac",
            ],
        },
        time_24hr: true,
    };
    fp$n.l10ns.hr = Croatian;
    fp$n.l10ns;

    var fp$o = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Hungarian = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["V", "H", "K", "Sz", "Cs", "P", "Szo"],
            longhand: [
                "Vasárnap",
                "Hétfő",
                "Kedd",
                "Szerda",
                "Csütörtök",
                "Péntek",
                "Szombat",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Már",
                "Ápr",
                "Máj",
                "Jún",
                "Júl",
                "Aug",
                "Szep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "Január",
                "Február",
                "Március",
                "Április",
                "Május",
                "Június",
                "Július",
                "Augusztus",
                "Szeptember",
                "Október",
                "November",
                "December",
            ],
        },
        ordinal: function () {
            return ".";
        },
        weekAbbreviation: "Hét",
        scrollTitle: "Görgessen",
        toggleTitle: "Kattintson a váltáshoz",
        rangeSeparator: " - ",
        time_24hr: true,
    };
    fp$o.l10ns.hu = Hungarian;
    fp$o.l10ns;

    var fp$p = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Armenian = {
        weekdays: {
            shorthand: ["Կիր", "Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ"],
            longhand: [
                "Կիրակի",
                "Եկուշաբթի",
                "Երեքշաբթի",
                "Չորեքշաբթի",
                "Հինգշաբթի",
                "Ուրբաթ",
                "Շաբաթ",
            ],
        },
        months: {
            shorthand: [
                "Հնվ",
                "Փտր",
                "Մար",
                "Ապր",
                "Մայ",
                "Հնս",
                "Հլս",
                "Օգս",
                "Սեպ",
                "Հոկ",
                "Նմբ",
                "Դեկ",
            ],
            longhand: [
                "Հունվար",
                "Փետրվար",
                "Մարտ",
                "Ապրիլ",
                "Մայիս",
                "Հունիս",
                "Հուլիս",
                "Օգոստոս",
                "Սեպտեմբեր",
                "Հոկտեմբեր",
                "Նոյեմբեր",
                "Դեկտեմբեր",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "ՇԲՏ",
        scrollTitle: "Ոլորեք՝ մեծացնելու համար",
        toggleTitle: "Սեղմեք՝ փոխելու համար",
        amPM: ["ՄԿ", "ԿՀ"],
        yearAriaLabel: "Տարի",
        monthAriaLabel: "Ամիս",
        hourAriaLabel: "Ժամ",
        minuteAriaLabel: "Րոպե",
        time_24hr: true,
    };
    fp$p.l10ns.hy = Armenian;
    fp$p.l10ns;

    var fp$q = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Indonesian = {
        weekdays: {
            shorthand: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            longhand: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Mei",
                "Jun",
                "Jul",
                "Agu",
                "Sep",
                "Okt",
                "Nov",
                "Des",
            ],
            longhand: [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        time_24hr: true,
        rangeSeparator: " - ",
    };
    fp$q.l10ns.id = Indonesian;
    fp$q.l10ns;

    var fp$r = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Icelandic = {
        weekdays: {
            shorthand: ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"],
            longhand: [
                "Sunnudagur",
                "Mánudagur",
                "Þriðjudagur",
                "Miðvikudagur",
                "Fimmtudagur",
                "Föstudagur",
                "Laugardagur",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Maí",
                "Jún",
                "Júl",
                "Ágú",
                "Sep",
                "Okt",
                "Nóv",
                "Des",
            ],
            longhand: [
                "Janúar",
                "Febrúar",
                "Mars",
                "Apríl",
                "Maí",
                "Júní",
                "Júlí",
                "Ágúst",
                "September",
                "Október",
                "Nóvember",
                "Desember",
            ],
        },
        ordinal: function () {
            return ".";
        },
        firstDayOfWeek: 1,
        rangeSeparator: " til ",
        weekAbbreviation: "vika",
        yearAriaLabel: "Ár",
        time_24hr: true,
    };
    fp$r.l10ns.is = Icelandic;
    fp$r.l10ns;

    var fp$s = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Italian = {
        weekdays: {
            shorthand: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
            longhand: [
                "Domenica",
                "Lunedì",
                "Martedì",
                "Mercoledì",
                "Giovedì",
                "Venerdì",
                "Sabato",
            ],
        },
        months: {
            shorthand: [
                "Gen",
                "Feb",
                "Mar",
                "Apr",
                "Mag",
                "Giu",
                "Lug",
                "Ago",
                "Set",
                "Ott",
                "Nov",
                "Dic",
            ],
            longhand: [
                "Gennaio",
                "Febbraio",
                "Marzo",
                "Aprile",
                "Maggio",
                "Giugno",
                "Luglio",
                "Agosto",
                "Settembre",
                "Ottobre",
                "Novembre",
                "Dicembre",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () { return "°"; },
        rangeSeparator: " al ",
        weekAbbreviation: "Se",
        scrollTitle: "Scrolla per aumentare",
        toggleTitle: "Clicca per cambiare",
        time_24hr: true,
    };
    fp$s.l10ns.it = Italian;
    fp$s.l10ns;

    var fp$t = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Japanese = {
        weekdays: {
            shorthand: ["日", "月", "火", "水", "木", "金", "土"],
            longhand: [
                "日曜日",
                "月曜日",
                "火曜日",
                "水曜日",
                "木曜日",
                "金曜日",
                "土曜日",
            ],
        },
        months: {
            shorthand: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
            ],
            longhand: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
            ],
        },
        time_24hr: true,
        rangeSeparator: " から ",
        monthAriaLabel: "月",
        amPM: ["午前", "午後"],
        yearAriaLabel: "年",
        hourAriaLabel: "時間",
        minuteAriaLabel: "分",
    };
    fp$t.l10ns.ja = Japanese;
    fp$t.l10ns;

    var fp$u = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Georgian = {
        weekdays: {
            shorthand: ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"],
            longhand: [
                "კვირა",
                "ორშაბათი",
                "სამშაბათი",
                "ოთხშაბათი",
                "ხუთშაბათი",
                "პარასკევი",
                "შაბათი",
            ],
        },
        months: {
            shorthand: [
                "იან",
                "თებ",
                "მარ",
                "აპრ",
                "მაი",
                "ივნ",
                "ივლ",
                "აგვ",
                "სექ",
                "ოქტ",
                "ნოე",
                "დეკ",
            ],
            longhand: [
                "იანვარი",
                "თებერვალი",
                "მარტი",
                "აპრილი",
                "მაისი",
                "ივნისი",
                "ივლისი",
                "აგვისტო",
                "სექტემბერი",
                "ოქტომბერი",
                "ნოემბერი",
                "დეკემბერი",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "კვ.",
        scrollTitle: "დასქროლეთ გასადიდებლად",
        toggleTitle: "დააკლიკეთ გადართვისთვის",
        amPM: ["AM", "PM"],
        yearAriaLabel: "წელი",
        time_24hr: true,
    };
    fp$u.l10ns.ka = Georgian;
    fp$u.l10ns;

    var fp$v = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Korean = {
        weekdays: {
            shorthand: ["일", "월", "화", "수", "목", "금", "토"],
            longhand: [
                "일요일",
                "월요일",
                "화요일",
                "수요일",
                "목요일",
                "금요일",
                "토요일",
            ],
        },
        months: {
            shorthand: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
            ],
            longhand: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
            ],
        },
        ordinal: function () {
            return "일";
        },
        rangeSeparator: " ~ ",
        amPM: ["오전", "오후"],
    };
    fp$v.l10ns.ko = Korean;
    fp$v.l10ns;

    var fp$w = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Khmer = {
        weekdays: {
            shorthand: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស.", "សុក្រ", "សៅរ៍"],
            longhand: [
                "អាទិត្យ",
                "ចន្ទ",
                "អង្គារ",
                "ពុធ",
                "ព្រហស្បតិ៍",
                "សុក្រ",
                "សៅរ៍",
            ],
        },
        months: {
            shorthand: [
                "មករា",
                "កុម្ភះ",
                "មីនា",
                "មេសា",
                "ឧសភា",
                "មិថុនា",
                "កក្កដា",
                "សីហា",
                "កញ្ញា",
                "តុលា",
                "វិច្ឆិកា",
                "ធ្នូ",
            ],
            longhand: [
                "មករា",
                "កុម្ភះ",
                "មីនា",
                "មេសា",
                "ឧសភា",
                "មិថុនា",
                "កក្កដា",
                "សីហា",
                "កញ្ញា",
                "តុលា",
                "វិច្ឆិកា",
                "ធ្នូ",
            ],
        },
        ordinal: function () {
            return "";
        },
        firstDayOfWeek: 1,
        rangeSeparator: " ដល់ ",
        weekAbbreviation: "សប្តាហ៍",
        scrollTitle: "រំកិលដើម្បីបង្កើន",
        toggleTitle: "ចុចដើម្បីផ្លាស់ប្ដូរ",
        yearAriaLabel: "ឆ្នាំ",
        time_24hr: true,
    };
    fp$w.l10ns.km = Khmer;
    fp$w.l10ns;

    var fp$x = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Kazakh = {
        weekdays: {
            shorthand: ["Жс", "Дс", "Сc", "Ср", "Бс", "Жм", "Сб"],
            longhand: [
                "Жексенбi",
                "Дүйсенбi",
                "Сейсенбi",
                "Сәрсенбi",
                "Бейсенбi",
                "Жұма",
                "Сенбi",
            ],
        },
        months: {
            shorthand: [
                "Қаң",
                "Ақп",
                "Нау",
                "Сәу",
                "Мам",
                "Мау",
                "Шiл",
                "Там",
                "Қыр",
                "Қаз",
                "Қар",
                "Жел",
            ],
            longhand: [
                "Қаңтар",
                "Ақпан",
                "Наурыз",
                "Сәуiр",
                "Мамыр",
                "Маусым",
                "Шiлде",
                "Тамыз",
                "Қыркүйек",
                "Қазан",
                "Қараша",
                "Желтоқсан",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "Апта",
        scrollTitle: "Үлкейту үшін айналдырыңыз",
        toggleTitle: "Ауыстыру үшін басыңыз",
        amPM: ["ТД", "ТК"],
        yearAriaLabel: "Жыл",
    };
    fp$x.l10ns.kz = Kazakh;
    fp$x.l10ns;

    var fp$y = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Lithuanian = {
        weekdays: {
            shorthand: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
            longhand: [
                "Sekmadienis",
                "Pirmadienis",
                "Antradienis",
                "Trečiadienis",
                "Ketvirtadienis",
                "Penktadienis",
                "Šeštadienis",
            ],
        },
        months: {
            shorthand: [
                "Sau",
                "Vas",
                "Kov",
                "Bal",
                "Geg",
                "Bir",
                "Lie",
                "Rgp",
                "Rgs",
                "Spl",
                "Lap",
                "Grd",
            ],
            longhand: [
                "Sausis",
                "Vasaris",
                "Kovas",
                "Balandis",
                "Gegužė",
                "Birželis",
                "Liepa",
                "Rugpjūtis",
                "Rugsėjis",
                "Spalis",
                "Lapkritis",
                "Gruodis",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "-a";
        },
        rangeSeparator: " iki ",
        weekAbbreviation: "Sav",
        scrollTitle: "Keisti laiką pelės rateliu",
        toggleTitle: "Perjungti laiko formatą",
        time_24hr: true,
    };
    fp$y.l10ns.lt = Lithuanian;
    fp$y.l10ns;

    var fp$z = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Latvian = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"],
            longhand: [
                "Svētdiena",
                "Pirmdiena",
                "Otrdiena",
                "Trešdiena",
                "Ceturtdiena",
                "Piektdiena",
                "Sestdiena",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Mai",
                "Jūn",
                "Jūl",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "Janvāris",
                "Februāris",
                "Marts",
                "Aprīlis",
                "Maijs",
                "Jūnijs",
                "Jūlijs",
                "Augusts",
                "Septembris",
                "Oktobris",
                "Novembris",
                "Decembris",
            ],
        },
        rangeSeparator: " līdz ",
        time_24hr: true,
    };
    fp$z.l10ns.lv = Latvian;
    fp$z.l10ns;

    var fp$A = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Macedonian = {
        weekdays: {
            shorthand: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са"],
            longhand: [
                "Недела",
                "Понеделник",
                "Вторник",
                "Среда",
                "Четврток",
                "Петок",
                "Сабота",
            ],
        },
        months: {
            shorthand: [
                "Јан",
                "Фев",
                "Мар",
                "Апр",
                "Мај",
                "Јун",
                "Јул",
                "Авг",
                "Сеп",
                "Окт",
                "Ное",
                "Дек",
            ],
            longhand: [
                "Јануари",
                "Февруари",
                "Март",
                "Април",
                "Мај",
                "Јуни",
                "Јули",
                "Август",
                "Септември",
                "Октомври",
                "Ноември",
                "Декември",
            ],
        },
        firstDayOfWeek: 1,
        weekAbbreviation: "Нед.",
        rangeSeparator: " до ",
        time_24hr: true,
    };
    fp$A.l10ns.mk = Macedonian;
    fp$A.l10ns;

    var fp$B = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Mongolian = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"],
            longhand: ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"],
        },
        months: {
            shorthand: [
                "1-р сар",
                "2-р сар",
                "3-р сар",
                "4-р сар",
                "5-р сар",
                "6-р сар",
                "7-р сар",
                "8-р сар",
                "9-р сар",
                "10-р сар",
                "11-р сар",
                "12-р сар",
            ],
            longhand: [
                "Нэгдүгээр сар",
                "Хоёрдугаар сар",
                "Гуравдугаар сар",
                "Дөрөвдүгээр сар",
                "Тавдугаар сар",
                "Зургаадугаар сар",
                "Долдугаар сар",
                "Наймдугаар сар",
                "Есдүгээр сар",
                "Аравдугаар сар",
                "Арваннэгдүгээр сар",
                "Арванхоёрдугаар сар",
            ],
        },
        rangeSeparator: "-с ",
        time_24hr: true,
    };
    fp$B.l10ns.mn = Mongolian;
    fp$B.l10ns;

    var fp$C = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Malaysian = {
        weekdays: {
            shorthand: ["Aha", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
            longhand: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mac",
                "Apr",
                "Mei",
                "Jun",
                "Jul",
                "Ogo",
                "Sep",
                "Okt",
                "Nov",
                "Dis",
            ],
            longhand: [
                "Januari",
                "Februari",
                "Mac",
                "April",
                "Mei",
                "Jun",
                "Julai",
                "Ogos",
                "September",
                "Oktober",
                "November",
                "Disember",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
    };
    fp$C.l10ns;

    var fp$D = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Burmese = {
        weekdays: {
            shorthand: ["နွေ", "လာ", "ဂါ", "ဟူး", "ကြာ", "သော", "နေ"],
            longhand: [
                "တနင်္ဂနွေ",
                "တနင်္လာ",
                "အင်္ဂါ",
                "ဗုဒ္ဓဟူး",
                "ကြာသပတေး",
                "သောကြာ",
                "စနေ",
            ],
        },
        months: {
            shorthand: [
                "ဇန်",
                "ဖေ",
                "မတ်",
                "ပြီ",
                "မေ",
                "ဇွန်",
                "လိုင်",
                "သြ",
                "စက်",
                "အောက်",
                "နို",
                "ဒီ",
            ],
            longhand: [
                "ဇန်နဝါရီ",
                "ဖေဖော်ဝါရီ",
                "မတ်",
                "ဧပြီ",
                "မေ",
                "ဇွန်",
                "ဇူလိုင်",
                "သြဂုတ်",
                "စက်တင်ဘာ",
                "အောက်တိုဘာ",
                "နိုဝင်ဘာ",
                "ဒီဇင်ဘာ",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        time_24hr: true,
    };
    fp$D.l10ns.my = Burmese;
    fp$D.l10ns;

    var fp$E = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Dutch = {
        weekdays: {
            shorthand: ["zo", "ma", "di", "wo", "do", "vr", "za"],
            longhand: [
                "zondag",
                "maandag",
                "dinsdag",
                "woensdag",
                "donderdag",
                "vrijdag",
                "zaterdag",
            ],
        },
        months: {
            shorthand: [
                "jan",
                "feb",
                "mrt",
                "apr",
                "mei",
                "jun",
                "jul",
                "aug",
                "sept",
                "okt",
                "nov",
                "dec",
            ],
            longhand: [
                "januari",
                "februari",
                "maart",
                "april",
                "mei",
                "juni",
                "juli",
                "augustus",
                "september",
                "oktober",
                "november",
                "december",
            ],
        },
        firstDayOfWeek: 1,
        weekAbbreviation: "wk",
        rangeSeparator: " t/m ",
        scrollTitle: "Scroll voor volgende / vorige",
        toggleTitle: "Klik om te wisselen",
        time_24hr: true,
        ordinal: function (nth) {
            if (nth === 1 || nth === 8 || nth >= 20)
                return "ste";
            return "de";
        },
    };
    fp$E.l10ns.nl = Dutch;
    fp$E.l10ns;

    var fp$F = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var NorwegianNynorsk = {
        weekdays: {
            shorthand: ["Sø.", "Må.", "Ty.", "On.", "To.", "Fr.", "La."],
            longhand: [
                "Søndag",
                "Måndag",
                "Tysdag",
                "Onsdag",
                "Torsdag",
                "Fredag",
                "Laurdag",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mars",
                "Apr",
                "Mai",
                "Juni",
                "Juli",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Des",
            ],
            longhand: [
                "Januar",
                "Februar",
                "Mars",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Desember",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " til ",
        weekAbbreviation: "Veke",
        scrollTitle: "Scroll for å endre",
        toggleTitle: "Klikk for å veksle",
        time_24hr: true,
        ordinal: function () {
            return ".";
        },
    };
    fp$F.l10ns.nn = NorwegianNynorsk;
    fp$F.l10ns;

    var fp$G = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Norwegian = {
        weekdays: {
            shorthand: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
            longhand: [
                "Søndag",
                "Mandag",
                "Tirsdag",
                "Onsdag",
                "Torsdag",
                "Fredag",
                "Lørdag",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Mai",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Des",
            ],
            longhand: [
                "Januar",
                "Februar",
                "Mars",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Desember",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " til ",
        weekAbbreviation: "Uke",
        scrollTitle: "Scroll for å endre",
        toggleTitle: "Klikk for å veksle",
        time_24hr: true,
        ordinal: function () {
            return ".";
        },
    };
    fp$G.l10ns.no = Norwegian;
    fp$G.l10ns;

    var fp$H = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Punjabi = {
        weekdays: {
            shorthand: ["ਐਤ", "ਸੋਮ", "ਮੰਗਲ", "ਬੁੱਧ", "ਵੀਰ", "ਸ਼ੁੱਕਰ", "ਸ਼ਨਿੱਚਰ"],
            longhand: [
                "ਐਤਵਾਰ",
                "ਸੋਮਵਾਰ",
                "ਮੰਗਲਵਾਰ",
                "ਬੁੱਧਵਾਰ",
                "ਵੀਰਵਾਰ",
                "ਸ਼ੁੱਕਰਵਾਰ",
                "ਸ਼ਨਿੱਚਰਵਾਰ",
            ],
        },
        months: {
            shorthand: [
                "ਜਨ",
                "ਫ਼ਰ",
                "ਮਾਰ",
                "ਅਪ੍ਰੈ",
                "ਮਈ",
                "ਜੂਨ",
                "ਜੁਲਾ",
                "ਅਗ",
                "ਸਤੰ",
                "ਅਕ",
                "ਨਵੰ",
                "ਦਸੰ",
            ],
            longhand: [
                "ਜਨਵਰੀ",
                "ਫ਼ਰਵਰੀ",
                "ਮਾਰਚ",
                "ਅਪ੍ਰੈਲ",
                "ਮਈ",
                "ਜੂਨ",
                "ਜੁਲਾਈ",
                "ਅਗਸਤ",
                "ਸਤੰਬਰ",
                "ਅਕਤੂਬਰ",
                "ਨਵੰਬਰ",
                "ਦਸੰਬਰ",
            ],
        },
        time_24hr: true,
    };
    fp$H.l10ns.pa = Punjabi;
    fp$H.l10ns;

    var fp$I = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Polish = {
        weekdays: {
            shorthand: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
            longhand: [
                "Niedziela",
                "Poniedziałek",
                "Wtorek",
                "Środa",
                "Czwartek",
                "Piątek",
                "Sobota",
            ],
        },
        months: {
            shorthand: [
                "Sty",
                "Lut",
                "Mar",
                "Kwi",
                "Maj",
                "Cze",
                "Lip",
                "Sie",
                "Wrz",
                "Paź",
                "Lis",
                "Gru",
            ],
            longhand: [
                "Styczeń",
                "Luty",
                "Marzec",
                "Kwiecień",
                "Maj",
                "Czerwiec",
                "Lipiec",
                "Sierpień",
                "Wrzesień",
                "Październik",
                "Listopad",
                "Grudzień",
            ],
        },
        rangeSeparator: " do ",
        weekAbbreviation: "tydz.",
        scrollTitle: "Przewiń, aby zwiększyć",
        toggleTitle: "Kliknij, aby przełączyć",
        firstDayOfWeek: 1,
        time_24hr: true,
        ordinal: function () {
            return ".";
        },
    };
    fp$I.l10ns.pl = Polish;
    fp$I.l10ns;

    var fp$J = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Portuguese = {
        weekdays: {
            shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            longhand: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez",
            ],
            longhand: [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro",
            ],
        },
        rangeSeparator: " até ",
        time_24hr: true,
    };
    fp$J.l10ns.pt = Portuguese;
    fp$J.l10ns;

    var fp$K = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Romanian = {
        weekdays: {
            shorthand: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"],
            longhand: [
                "Duminică",
                "Luni",
                "Marți",
                "Miercuri",
                "Joi",
                "Vineri",
                "Sâmbătă",
            ],
        },
        months: {
            shorthand: [
                "Ian",
                "Feb",
                "Mar",
                "Apr",
                "Mai",
                "Iun",
                "Iul",
                "Aug",
                "Sep",
                "Oct",
                "Noi",
                "Dec",
            ],
            longhand: [
                "Ianuarie",
                "Februarie",
                "Martie",
                "Aprilie",
                "Mai",
                "Iunie",
                "Iulie",
                "August",
                "Septembrie",
                "Octombrie",
                "Noiembrie",
                "Decembrie",
            ],
        },
        firstDayOfWeek: 1,
        time_24hr: true,
        ordinal: function () {
            return "";
        },
    };
    fp$K.l10ns.ro = Romanian;
    fp$K.l10ns;

    var fp$L = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Russian = {
        weekdays: {
            shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            longhand: [
                "Воскресенье",
                "Понедельник",
                "Вторник",
                "Среда",
                "Четверг",
                "Пятница",
                "Суббота",
            ],
        },
        months: {
            shorthand: [
                "Янв",
                "Фев",
                "Март",
                "Апр",
                "Май",
                "Июнь",
                "Июль",
                "Авг",
                "Сен",
                "Окт",
                "Ноя",
                "Дек",
            ],
            longhand: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "Нед.",
        scrollTitle: "Прокрутите для увеличения",
        toggleTitle: "Нажмите для переключения",
        amPM: ["ДП", "ПП"],
        yearAriaLabel: "Год",
        time_24hr: true,
    };
    fp$L.l10ns.ru = Russian;
    fp$L.l10ns;

    var fp$M = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Sinhala = {
        weekdays: {
            shorthand: ["ඉ", "ස", "අ", "බ", "බ්‍ර", "සි", "සෙ"],
            longhand: [
                "ඉරිදා",
                "සඳුදා",
                "අඟහරුවාදා",
                "බදාදා",
                "බ්‍රහස්පතින්දා",
                "සිකුරාදා",
                "සෙනසුරාදා",
            ],
        },
        months: {
            shorthand: [
                "ජන",
                "පෙබ",
                "මාර්",
                "අප්‍රේ",
                "මැයි",
                "ජුනි",
                "ජූලි",
                "අගෝ",
                "සැප්",
                "ඔක්",
                "නොවැ",
                "දෙසැ",
            ],
            longhand: [
                "ජනවාරි",
                "පෙබරවාරි",
                "මාර්තු",
                "අප්‍රේල්",
                "මැයි",
                "ජුනි",
                "ජූලි",
                "අගෝස්තු",
                "සැප්තැම්බර්",
                "ඔක්තෝබර්",
                "නොවැම්බර්",
                "දෙසැම්බර්",
            ],
        },
        time_24hr: true,
    };
    fp$M.l10ns.si = Sinhala;
    fp$M.l10ns;

    var fp$N = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Slovak = {
        weekdays: {
            shorthand: ["Ned", "Pon", "Ut", "Str", "Štv", "Pia", "Sob"],
            longhand: [
                "Nedeľa",
                "Pondelok",
                "Utorok",
                "Streda",
                "Štvrtok",
                "Piatok",
                "Sobota",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Máj",
                "Jún",
                "Júl",
                "Aug",
                "Sep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "Január",
                "Február",
                "Marec",
                "Apríl",
                "Máj",
                "Jún",
                "Júl",
                "August",
                "September",
                "Október",
                "November",
                "December",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " do ",
        time_24hr: true,
        ordinal: function () {
            return ".";
        },
    };
    fp$N.l10ns.sk = Slovak;
    fp$N.l10ns;

    var fp$O = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Slovenian = {
        weekdays: {
            shorthand: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
            longhand: [
                "Nedelja",
                "Ponedeljek",
                "Torek",
                "Sreda",
                "Četrtek",
                "Petek",
                "Sobota",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Maj",
                "Jun",
                "Jul",
                "Avg",
                "Sep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "Januar",
                "Februar",
                "Marec",
                "April",
                "Maj",
                "Junij",
                "Julij",
                "Avgust",
                "September",
                "Oktober",
                "November",
                "December",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " do ",
        time_24hr: true,
        ordinal: function () {
            return ".";
        },
    };
    fp$O.l10ns.sl = Slovenian;
    fp$O.l10ns;

    var fp$P = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Albanian = {
        weekdays: {
            shorthand: ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sh"],
            longhand: [
                "E Diel",
                "E Hënë",
                "E Martë",
                "E Mërkurë",
                "E Enjte",
                "E Premte",
                "E Shtunë",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Shk",
                "Mar",
                "Pri",
                "Maj",
                "Qer",
                "Kor",
                "Gus",
                "Sht",
                "Tet",
                "Nën",
                "Dhj",
            ],
            longhand: [
                "Janar",
                "Shkurt",
                "Mars",
                "Prill",
                "Maj",
                "Qershor",
                "Korrik",
                "Gusht",
                "Shtator",
                "Tetor",
                "Nëntor",
                "Dhjetor",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " deri ",
        weekAbbreviation: "Java",
        yearAriaLabel: "Viti",
        monthAriaLabel: "Muaji",
        hourAriaLabel: "Ora",
        minuteAriaLabel: "Minuta",
        time_24hr: true,
    };
    fp$P.l10ns.sq = Albanian;
    fp$P.l10ns;

    var fp$Q = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Serbian = {
        weekdays: {
            shorthand: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
            longhand: [
                "Nedelja",
                "Ponedeljak",
                "Utorak",
                "Sreda",
                "Četvrtak",
                "Petak",
                "Subota",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "Maj",
                "Jun",
                "Jul",
                "Avg",
                "Sep",
                "Okt",
                "Nov",
                "Dec",
            ],
            longhand: [
                "Januar",
                "Februar",
                "Mart",
                "April",
                "Maj",
                "Jun",
                "Jul",
                "Avgust",
                "Septembar",
                "Oktobar",
                "Novembar",
                "Decembar",
            ],
        },
        firstDayOfWeek: 1,
        weekAbbreviation: "Ned.",
        rangeSeparator: " do ",
        time_24hr: true,
    };
    fp$Q.l10ns.sr = Serbian;
    fp$Q.l10ns;

    var fp$R = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Swedish = {
        firstDayOfWeek: 1,
        weekAbbreviation: "v",
        weekdays: {
            shorthand: ["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
            longhand: [
                "söndag",
                "måndag",
                "tisdag",
                "onsdag",
                "torsdag",
                "fredag",
                "lördag",
            ],
        },
        months: {
            shorthand: [
                "jan",
                "feb",
                "mar",
                "apr",
                "maj",
                "jun",
                "jul",
                "aug",
                "sep",
                "okt",
                "nov",
                "dec",
            ],
            longhand: [
                "januari",
                "februari",
                "mars",
                "april",
                "maj",
                "juni",
                "juli",
                "augusti",
                "september",
                "oktober",
                "november",
                "december",
            ],
        },
        rangeSeparator: " till ",
        time_24hr: true,
        ordinal: function () {
            return ".";
        },
    };
    fp$R.l10ns.sv = Swedish;
    fp$R.l10ns;

    var fp$S = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Thai = {
        weekdays: {
            shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
            longhand: [
                "อาทิตย์",
                "จันทร์",
                "อังคาร",
                "พุธ",
                "พฤหัสบดี",
                "ศุกร์",
                "เสาร์",
            ],
        },
        months: {
            shorthand: [
                "ม.ค.",
                "ก.พ.",
                "มี.ค.",
                "เม.ย.",
                "พ.ค.",
                "มิ.ย.",
                "ก.ค.",
                "ส.ค.",
                "ก.ย.",
                "ต.ค.",
                "พ.ย.",
                "ธ.ค.",
            ],
            longhand: [
                "มกราคม",
                "กุมภาพันธ์",
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " ถึง ",
        scrollTitle: "เลื่อนเพื่อเพิ่มหรือลด",
        toggleTitle: "คลิกเพื่อเปลี่ยน",
        time_24hr: true,
        ordinal: function () {
            return "";
        },
    };
    fp$S.l10ns.th = Thai;
    fp$S.l10ns;

    var fp$T = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Turkish = {
        weekdays: {
            shorthand: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
            longhand: [
                "Pazar",
                "Pazartesi",
                "Salı",
                "Çarşamba",
                "Perşembe",
                "Cuma",
                "Cumartesi",
            ],
        },
        months: {
            shorthand: [
                "Oca",
                "Şub",
                "Mar",
                "Nis",
                "May",
                "Haz",
                "Tem",
                "Ağu",
                "Eyl",
                "Eki",
                "Kas",
                "Ara",
            ],
            longhand: [
                "Ocak",
                "Şubat",
                "Mart",
                "Nisan",
                "Mayıs",
                "Haziran",
                "Temmuz",
                "Ağustos",
                "Eylül",
                "Ekim",
                "Kasım",
                "Aralık",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return ".";
        },
        rangeSeparator: " - ",
        weekAbbreviation: "Hf",
        scrollTitle: "Artırmak için kaydırın",
        toggleTitle: "Aç/Kapa",
        amPM: ["ÖÖ", "ÖS"],
        time_24hr: true,
    };
    fp$T.l10ns.tr = Turkish;
    fp$T.l10ns;

    var fp$U = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Ukrainian = {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            longhand: [
                "Неділя",
                "Понеділок",
                "Вівторок",
                "Середа",
                "Четвер",
                "П'ятниця",
                "Субота",
            ],
        },
        months: {
            shorthand: [
                "Січ",
                "Лют",
                "Бер",
                "Кві",
                "Тра",
                "Чер",
                "Лип",
                "Сер",
                "Вер",
                "Жов",
                "Лис",
                "Гру",
            ],
            longhand: [
                "Січень",
                "Лютий",
                "Березень",
                "Квітень",
                "Травень",
                "Червень",
                "Липень",
                "Серпень",
                "Вересень",
                "Жовтень",
                "Листопад",
                "Грудень",
            ],
        },
        time_24hr: true,
    };
    fp$U.l10ns.uk = Ukrainian;
    fp$U.l10ns;

    var fp$V = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Uzbek = {
        weekdays: {
            shorthand: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"],
            longhand: [
                "Якшанба",
                "Душанба",
                "Сешанба",
                "Чоршанба",
                "Пайшанба",
                "Жума",
                "Шанба",
            ],
        },
        months: {
            shorthand: [
                "Янв",
                "Фев",
                "Мар",
                "Апр",
                "Май",
                "Июн",
                "Июл",
                "Авг",
                "Сен",
                "Окт",
                "Ноя",
                "Дек",
            ],
            longhand: [
                "Январ",
                "Феврал",
                "Март",
                "Апрел",
                "Май",
                "Июн",
                "Июл",
                "Август",
                "Сентябр",
                "Октябр",
                "Ноябр",
                "Декабр",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "Ҳафта",
        scrollTitle: "Катталаштириш учун айлантиринг",
        toggleTitle: "Ўтиш учун босинг",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Йил",
        time_24hr: true,
    };
    fp$V.l10ns.uz = Uzbek;
    fp$V.l10ns;

    var fp$W = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var UzbekLatin = {
        weekdays: {
            shorthand: ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"],
            longhand: [
                "Yakshanba",
                "Dushanba",
                "Seshanba",
                "Chorshanba",
                "Payshanba",
                "Juma",
                "Shanba",
            ],
        },
        months: {
            shorthand: [
                "Yan",
                "Fev",
                "Mar",
                "Apr",
                "May",
                "Iyun",
                "Iyul",
                "Avg",
                "Sen",
                "Okt",
                "Noy",
                "Dek",
            ],
            longhand: [
                "Yanvar",
                "Fevral",
                "Mart",
                "Aprel",
                "May",
                "Iyun",
                "Iyul",
                "Avgust",
                "Sentabr",
                "Oktabr",
                "Noyabr",
                "Dekabr",
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " — ",
        weekAbbreviation: "Hafta",
        scrollTitle: "Kattalashtirish uchun aylantiring",
        toggleTitle: "O‘tish uchun bosing",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Yil",
        time_24hr: true,
    };
    fp$W.l10ns["uz_latn"] = UzbekLatin;
    fp$W.l10ns;

    var fp$X = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Vietnamese = {
        weekdays: {
            shorthand: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            longhand: [
                "Chủ nhật",
                "Thứ hai",
                "Thứ ba",
                "Thứ tư",
                "Thứ năm",
                "Thứ sáu",
                "Thứ bảy",
            ],
        },
        months: {
            shorthand: [
                "Th1",
                "Th2",
                "Th3",
                "Th4",
                "Th5",
                "Th6",
                "Th7",
                "Th8",
                "Th9",
                "Th10",
                "Th11",
                "Th12",
            ],
            longhand: [
                "Tháng một",
                "Tháng hai",
                "Tháng ba",
                "Tháng tư",
                "Tháng năm",
                "Tháng sáu",
                "Tháng bảy",
                "Tháng tám",
                "Tháng chín",
                "Tháng mười",
                "Tháng mười một",
                "Tháng mười hai",
            ],
        },
        firstDayOfWeek: 1,
        rangeSeparator: " đến ",
    };
    fp$X.l10ns.vn = Vietnamese;
    fp$X.l10ns;

    var fp$Y = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var Mandarin = {
        weekdays: {
            shorthand: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            longhand: [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
            ],
        },
        months: {
            shorthand: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
            ],
            longhand: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
            ],
        },
        rangeSeparator: " 至 ",
        weekAbbreviation: "周",
        scrollTitle: "滚动切换",
        toggleTitle: "点击切换 12/24 小时时制",
    };
    fp$Y.l10ns.zh = Mandarin;
    fp$Y.l10ns;

    var fp$Z = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var MandarinTraditional = {
        weekdays: {
            shorthand: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
            longhand: [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
            ],
        },
        months: {
            shorthand: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
            ],
            longhand: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
            ],
        },
        rangeSeparator: " 至 ",
        weekAbbreviation: "週",
        scrollTitle: "滾動切換",
        toggleTitle: "點擊切換 12/24 小時時制",
    };
    fp$Z.l10ns.zh_tw = MandarinTraditional;
    fp$Z.l10ns;

    var l10n = {
        ar: Arabic,
        at: Austria,
        az: Azerbaijan,
        be: Belarusian,
        bg: Bulgarian,
        bn: Bangla,
        bs: Bosnian,
        ca: Catalan,
        ckb: Kurdish,
        cat: Catalan,
        cs: Czech,
        cy: Welsh,
        da: Danish,
        de: German,
        default: __assign({}, english),
        en: english,
        eo: Esperanto,
        es: Spanish,
        et: Estonian,
        fa: Persian,
        fi: Finnish,
        fo: Faroese,
        fr: French,
        gr: Greek,
        he: Hebrew,
        hi: Hindi,
        hr: Croatian,
        hu: Hungarian,
        hy: Armenian,
        id: Indonesian,
        is: Icelandic,
        it: Italian,
        ja: Japanese,
        ka: Georgian,
        ko: Korean,
        km: Khmer,
        kz: Kazakh,
        lt: Lithuanian,
        lv: Latvian,
        mk: Macedonian,
        mn: Mongolian,
        ms: Malaysian,
        my: Burmese,
        nl: Dutch,
        nn: NorwegianNynorsk,
        no: Norwegian,
        pa: Punjabi,
        pl: Polish,
        pt: Portuguese,
        ro: Romanian,
        ru: Russian,
        si: Sinhala,
        sk: Slovak,
        sl: Slovenian,
        sq: Albanian,
        sr: Serbian,
        sv: Swedish,
        th: Thai,
        tr: Turkish,
        uk: Ukrainian,
        vn: Vietnamese,
        zh: Mandarin,
        zh_tw: MandarinTraditional,
        uz: Uzbek,
        uz_latn: UzbekLatin,
    };

    exports.default = l10n;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ "./node_modules/jsrender/jsrender.js":
/*!*******************************************!*\
  !*** ./node_modules/jsrender/jsrender.js ***!
  \*******************************************/
/***/ ((module) => {

/*! JsRender v1.0.13: http://jsviews.com/#jsrender */
/*! **VERSION FOR WEB** (For NODE.JS see http://jsviews.com/download/jsrender-node.js) */
/*
 * Best-of-breed templating in browser or on Node.js.
 * Does not require jQuery, or HTML DOM
 * Integrates with JsViews (http://jsviews.com/#jsviews)
 *
 * Copyright 2021, Boris Moore
 * Released under the MIT License.
 */

//jshint -W018, -W041, -W120

(function(factory, global) {
	// global var is the this object, which is window when running in the usual browser environment
	var $ = global.jQuery;

	if (true) { // CommonJS e.g. Browserify
		module.exports = $
			? factory(global, $)
			: function($) { // If no global jQuery, take optional jQuery passed as parameter: require('jsrender')(jQuery)
				if ($ && !$.fn) {
					throw "Provide jQuery or null";
				}
				return factory(global, $);
			};
	} else {}
} (

// factory (for jsrender.js)
function(global, $) {
"use strict";

//========================== Top-level vars ==========================

// global var is the this object, which is window when running in the usual browser environment
var setGlobals = $ === false; // Only set globals if script block in browser (not AMD and not CommonJS)

$ = $ && $.fn ? $ : global.jQuery; // $ is jQuery passed in by CommonJS loader (Browserify), or global jQuery.

var versionNumber = "v1.0.13",
	jsvStoreName, rTag, rTmplString, topView, $views, $expando,
	_ocp = "_ocp",      // Observable contextual parameter

	$isFunction, $isArray, $templates, $converters, $helpers, $tags, $sub, $subSettings, $subSettingsAdvanced, $viewsSettings,
	delimOpenChar0, delimOpenChar1, delimCloseChar0, delimCloseChar1, linkChar, setting, baseOnError,

	isRenderCall,
	rNewLine = /[ \t]*(\r\n|\n|\r)/g,
	rUnescapeQuotes = /\\(['"\\])/g, // Unescape quotes and trim
	rEscapeQuotes = /['"\\]/g, // Escape quotes and \ character
	rBuildHash = /(?:\x08|^)(onerror:)?(?:(~?)(([\w$.]+):)?([^\x08]+))\x08(,)?([^\x08]+)/gi,
	rTestElseIf = /^if\s/,
	rFirstElem = /<(\w+)[>\s]/,
	rAttrEncode = /[\x00`><"'&=]/g, // Includes > encoding since rConvertMarkers in JsViews does not skip > characters in attribute strings
	rIsHtml = /[\x00`><\"'&=]/,
	rHasHandlers = /^on[A-Z]|^convert(Back)?$/,
	rWrappedInViewMarker = /^\#\d+_`[\s\S]*\/\d+_`$/,
	rHtmlEncode = rAttrEncode,
	rDataEncode = /[&<>]/g,
	rDataUnencode = /&(amp|gt|lt);/g,
	rBracketQuote = /\[['"]?|['"]?\]/g,
	viewId = 0,
	charEntities = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\x00": "&#0;",
		"'": "&#39;",
		'"': "&#34;",
		"`": "&#96;",
		"=": "&#61;"
	},
	charsFromEntities = {
		amp: "&",
		gt: ">",
		lt: "<"
	},
	HTML = "html",
	STRING = "string",
	OBJECT = "object",
	tmplAttr = "data-jsv-tmpl",
	jsvTmpl = "jsvTmpl",
	indexStr = "For #index in nested block use #getIndex().",
	cpFnStore = {},     // Compiled furnctions for computed values in template expressions (properties, methods, helpers)
	$render = {},

	jsr = global.jsrender,
	jsrToJq = jsr && $ && !$.render, // JsRender already loaded, without jQuery. but we will re-load it now to attach to jQuery

	jsvStores = {
		template: {
			compile: compileTmpl
		},
		tag: {
			compile: compileTag
		},
		viewModel: {
			compile: compileViewModel
		},
		helper: {},
		converter: {}
	};

	// views object ($.views if jQuery is loaded, jsrender.views if no jQuery, e.g. in Node.js)
	$views = {
		jsviews: versionNumber,
		sub: {
			// subscription, e.g. JsViews integration
			rPath: /^(!*?)(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
			//        not                               object     helper    view  viewProperty pathTokens      leafToken

			rPrm: /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)(~?[\w$.^]+)?\s*((\+\+|--)|\+|-|~(?![\w$])|&&|\|\||===|!==|==|!=|<=|>=|[<>%*:?\/]|(=))\s*|(!*?(@)?[#~]?[\w$.^]+)([([])?)|(,\s*)|(?:(\()\s*)?\\?(?:(')|("))|(?:\s*(([)\]])(?=[.^]|\s*$|[^([])|[)\]])([([]?))|(\s+)/g,
			//   lftPrn0           lftPrn         bound     path               operator     err                                          eq      path2 late            prn      comma  lftPrn2          apos quot        rtPrn  rtPrnDot                  prn2     space

			View: View,
			Err: JsViewsError,
			tmplFn: tmplFn,
			parse: parseParams,
			extend: $extend,
			extendCtx: extendCtx,
			syntaxErr: syntaxError,
			onStore: {
				template: function(name, item) {
					if (item === null) {
						delete $render[name];
					} else if (name) {
						$render[name] = item;
					}
				}
			},
			addSetting: addSetting,
			settings: {
				allowCode: false
			},
			advSet: noop, // Update advanced settings
			_thp: tagHandlersFromProps,
			_gm: getMethod,
			_tg: function() {}, // Constructor for tagDef
			_cnvt: convertVal,
			_tag: renderTag,
			_er: error,
			_err: onRenderError,
			_cp: retVal, // Get observable contextual parameters (or properties) ~foo=expr. In JsRender, simply returns val.
			_sq: function(token) {
				if (token === "constructor") {
					syntaxError("");
				}
				return token;
			}
		},
		settings: {
			delimiters: $viewsDelimiters,
			advanced: function(value) {
				return value
					? (
							$extend($subSettingsAdvanced, value),
							$sub.advSet(),
							$viewsSettings
						)
						: $subSettingsAdvanced;
				}
		},
		map: dataMap // If jsObservable loaded first, use that definition of dataMap
	};

function getDerivedMethod(baseMethod, method) {
	return function() {
		var ret,
			tag = this,
			prevBase = tag.base;

		tag.base = baseMethod; // Within method call, calling this.base will call the base method
		ret = method.apply(tag, arguments); // Call the method
		tag.base = prevBase; // Replace this.base to be the base method of the previous call, for chained calls
		return ret;
	};
}

function getMethod(baseMethod, method) {
	// For derived methods (or handlers declared declaratively as in {{:foo onChange=~fooChanged}} replace by a derived method, to allow using this.base(...)
	// or this.baseApply(arguments) to call the base implementation. (Equivalent to this._super(...) and this._superApply(arguments) in jQuery UI)
	if ($isFunction(method)) {
		method = getDerivedMethod(
				!baseMethod
					? noop // no base method implementation, so use noop as base method
					: baseMethod._d
						? baseMethod // baseMethod is a derived method, so use it
						: getDerivedMethod(noop, baseMethod), // baseMethod is not derived so make its base method be the noop method
				method
			);
		method._d = (baseMethod && baseMethod._d || 0) + 1; // Add flag for derived method (incremented for derived of derived...)
	}
	return method;
}

function tagHandlersFromProps(tag, tagCtx) {
	var prop,
		props = tagCtx.props;
	for (prop in props) {
		if (rHasHandlers.test(prop) && !(tag[prop] && tag[prop].fix)) { // Don't override handlers with fix expando (used in datepicker and spinner)
			tag[prop] = prop !== "convert" ? getMethod(tag.constructor.prototype[prop], props[prop]) : props[prop];
			// Copy over the onFoo props, convert and convertBack from tagCtx.props to tag (overrides values in tagDef).
			// Note: unsupported scenario: if handlers are dynamically added ^onFoo=expression this will work, but dynamically removing will not work.
		}
	}
}

function retVal(val) {
	return val;
}

function noop() {
	return "";
}

function dbgBreak(val) {
	// Usage examples: {{dbg:...}}, {{:~dbg(...)}}, {{dbg .../}}, {^{for ... onAfterLink=~dbg}} etc.
	try {
		console.log("JsRender dbg breakpoint: " + val);
		throw "dbg breakpoint"; // To break here, stop on caught exceptions.
	}
	catch (e) {}
	return this.base ? this.baseApply(arguments) : val;
}

function JsViewsError(message) {
	// Error exception type for JsViews/JsRender
	// Override of $.views.sub.Error is possible
	this.name = ($.link ? "JsViews" : "JsRender") + " Error";
	this.message = message || this.name;
}

function $extend(target, source) {
	if (target) {
		for (var name in source) {
			target[name] = source[name];
		}
		return target;
	}
}

(JsViewsError.prototype = new Error()).constructor = JsViewsError;

//========================== Top-level functions ==========================

//===================
// views.delimiters
//===================

	/**
	* Set the tag opening and closing delimiters and 'link' character. Default is "{{", "}}" and "^"
	* openChars, closeChars: opening and closing strings, each with two characters
	* $.views.settings.delimiters(...)
	*
	* @param {string}   openChars
	* @param {string}   [closeChars]
	* @param {string}   [link]
	* @returns {Settings}
	*
	* Get delimiters
	* delimsArray = $.views.settings.delimiters()
	*
	* @returns {string[]}
	*/
function $viewsDelimiters(openChars, closeChars, link) {
	if (!openChars) {
		return $subSettings.delimiters;
	}
	if ($isArray(openChars)) {
		return $viewsDelimiters.apply($views, openChars);
	}
	linkChar = link ? link[0] : linkChar;
	if (!/^(\W|_){5}$/.test(openChars + closeChars + linkChar)) {
		error("Invalid delimiters"); // Must be non-word characters, and openChars and closeChars must each be length 2
	}
	delimOpenChar0 = openChars[0];
	delimOpenChar1 = openChars[1];
	delimCloseChar0 = closeChars[0];
	delimCloseChar1 = closeChars[1];

	$subSettings.delimiters = [delimOpenChar0 + delimOpenChar1, delimCloseChar0 + delimCloseChar1, linkChar];

	// Escape the characters - since they could be regex special characters
	openChars = "\\" + delimOpenChar0 + "(\\" + linkChar + ")?\\" + delimOpenChar1; // Default is "{^{"
	closeChars = "\\" + delimCloseChar0 + "\\" + delimCloseChar1;                   // Default is "}}"
	// Build regex with new delimiters
	//          [tag    (followed by / space or })  or cvtr+colon or html or code] followed by space+params then convertBack?
	rTag = "(?:(\\w+(?=[\\/\\s\\" + delimCloseChar0 + "]))|(\\w+)?(:)|(>)|(\\*))\\s*((?:[^\\"
		+ delimCloseChar0 + "]|\\" + delimCloseChar0 + "(?!\\" + delimCloseChar1 + "))*?)";

	// Make rTag available to JsViews (or other components) for parsing binding expressions
	$sub.rTag = "(?:" + rTag + ")";
	//                        { ^? {   tag+params slash?  or closingTag                                                   or comment
	rTag = new RegExp("(?:" + openChars + rTag + "(\\/)?|\\" + delimOpenChar0 + "(\\" + linkChar + ")?\\" + delimOpenChar1 + "(?:(?:\\/(\\w+))\\s*|!--[\\s\\S]*?--))" + closeChars, "g");

	// Default:  bind     tagName         cvt   cln html code    params            slash   bind2         closeBlk  comment
	//      /(?:{(\^)?{(?:(\w+(?=[\/\s}]))|(\w+)?(:)|(>)|(\*))\s*((?:[^}]|}(?!}))*?)(\/)?|{(\^)?{(?:(?:\/(\w+))\s*|!--[\s\S]*?--))}}

	$sub.rTmpl = new RegExp("^\\s|\\s$|<.*>|([^\\\\]|^)[{}]|" + openChars + ".*" + closeChars);
	// $sub.rTmpl looks for initial or final white space, html tags or { or } char not preceded by \\, or JsRender tags {{xxx}}.
	// Each of these strings are considered NOT to be jQuery selectors
	return $viewsSettings;
}

//=========
// View.get
//=========

function getView(inner, type) { //view.get(inner, type)
	if (!type && inner !== true) {
		// view.get(type)
		type = inner;
		inner = undefined;
	}

	var views, i, l, found,
		view = this,
		root = type === "root";
		// view.get("root") returns view.root, view.get() returns view.parent, view.get(true) returns view.views[0].

	if (inner) {
		// Go through views - this one, and all nested ones, depth-first - and return first one with given type.
		// If type is undefined, i.e. view.get(true), return first child view.
		found = type && view.type === type && view;
		if (!found) {
			views = view.views;
			if (view._.useKey) {
				for (i in views) {
					if (found = type ? views[i].get(inner, type) : views[i]) {
						break;
					}
				}
			} else {
				for (i = 0, l = views.length; !found && i < l; i++) {
					found = type ? views[i].get(inner, type) : views[i];
				}
			}
		}
	} else if (root) {
		// Find root view. (view whose parent is top view)
		found = view.root;
	} else if (type) {
		while (view && !found) {
			// Go through views - this one, and all parent ones - and return first one with given type.
			found = view.type === type ? view : undefined;
			view = view.parent;
		}
	} else {
		found = view.parent;
	}
	return found || undefined;
}

function getNestedIndex() {
	var view = this.get("item");
	return view ? view.index : undefined;
}

getNestedIndex.depends = function() {
	return [this.get("item"), "index"];
};

function getIndex() {
	return this.index;
}

getIndex.depends = "index";

//==================
// View.ctxPrm, etc.
//==================

/* Internal private: view._getOb() */
function getPathObject(ob, path, ltOb, fn) {
	// Iterate through path to late paths: @a.b.c paths
	// Return "" (or noop if leaf is a function @a.b.c(...) ) if intermediate object not yet available
	var prevOb, tokens, l,
		i = 0;
	if (ltOb === 1) {
		fn = 1;
		ltOb = undefined;
	}
	// Paths like ^a^b^c or ~^a^b^c will not throw if an object in path is undefined.
	if (path) {
		tokens = path.split(".");
		l = tokens.length;

		for (; ob && i < l; i++) {
			prevOb = ob;
			ob = tokens[i] ? ob[tokens[i]] : ob;
		}
	}
	if (ltOb) {
		ltOb.lt = ltOb.lt || i<l; // If i < l there was an object in the path not yet available
	}
	return ob === undefined
		? fn ? noop : ""
		: fn ? function() {
			return ob.apply(prevOb, arguments);
		} : ob;
}

function contextParameter(key, value, get) {
	// Helper method called as view.ctxPrm(key) for helpers or template parameters ~foo - from compiled template or from context callback
	var wrapped, deps, res, obsCtxPrm, tagElse, callView, newRes,
		storeView = this,
		isUpdate = !isRenderCall && arguments.length > 1,
		store = storeView.ctx;
	if (key) {
		if (!storeView._) { // tagCtx.ctxPrm() call
			tagElse = storeView.index;
			storeView = storeView.tag;
		}
		callView = storeView;
		if (store && store.hasOwnProperty(key) || (store = $helpers).hasOwnProperty(key)) {
			res = store[key];
			if (key === "tag" || key === "tagCtx" || key === "root" || key === "parentTags") {
				return res;
			}
		} else {
			store = undefined;
		}
		if (!isRenderCall && storeView.tagCtx || storeView.linked) { // Data-linked view, or tag instance
			if (!res || !res._cxp) {
				// Not a contextual parameter
				// Set storeView to tag (if this is a tag.ctxPrm() call) or to root view ("data" view of linked template)
				storeView = storeView.tagCtx || $isFunction(res)
					? storeView // Is a tag, not a view, or is a computed contextual parameter, so scope to the callView, no the 'scope view'
					: (storeView = storeView.scope || storeView,
						!storeView.isTop && storeView.ctx.tag // If this view is in a tag, set storeView to the tag
							|| storeView);
				if (res !== undefined && storeView.tagCtx) {
					// If storeView is a tag, but the contextual parameter has been set at at higher level (e.g. helpers)...
					storeView = storeView.tagCtx.view.scope; // then move storeView to the outer level (scope of tag container view)
				}
				store = storeView._ocps;
				res = store && store.hasOwnProperty(key) && store[key] || res;
				if (!(res && res._cxp) && (get || isUpdate)) {
					// Create observable contextual parameter
					(store || (storeView._ocps = storeView._ocps || {}))[key]
						= res
						= [{
							_ocp: res, // The observable contextual parameter value
							_vw: callView,
							_key: key
						}];
					res._cxp = {
						path: _ocp,
						ind: 0,
						updateValue: function(val, path) {
							$.observable(res[0]).setProperty(_ocp, val); // Set the value (res[0]._ocp)
							return this;
						}
					};
				}
			}
			if (obsCtxPrm = res && res._cxp) {
				// If this helper resource is an observable contextual parameter
				if (arguments.length > 2) {
					deps = res[1] ? $sub._ceo(res[1].deps) : [_ocp]; // fn deps (with any exprObs cloned using $sub._ceo)
					deps.unshift(res[0]); // view
					deps._cxp = obsCtxPrm;
					// In a context callback for a contextual param, we set get = true, to get ctxPrm [view, dependencies...] array - needed for observe call
					return deps;
				}
				tagElse = obsCtxPrm.tagElse;
				newRes = res[1] // linkFn for compiled expression
					? obsCtxPrm.tag && obsCtxPrm.tag.cvtArgs
						? obsCtxPrm.tag.cvtArgs(tagElse, 1)[obsCtxPrm.ind] // = tag.bndArgs() - for tag contextual parameter
						: res[1](res[0].data, res[0], $sub) // = fn(data, view, $sub) for compiled binding expression
					: res[0]._ocp; // Observable contextual parameter (uninitialized, or initialized as static expression, so no path dependencies)
				if (isUpdate) {
					$sub._ucp(key, value, storeView, obsCtxPrm); // Update observable contextual parameter
					return storeView;
				}
				res = newRes;
			}
		}
		if (res && $isFunction(res)) {
			// If a helper is of type function we will wrap it, so if called with no this pointer it will be called with the
			// view as 'this' context. If the helper ~foo() was in a data-link expression, the view will have a 'temporary' linkCtx property too.
			// Note that helper functions on deeper paths will have specific this pointers, from the preceding path.
			// For example, ~util.foo() will have the ~util object as 'this' pointer
			wrapped = function() {
				return res.apply((!this || this === global) ? callView : this, arguments);
			};
			$extend(wrapped, res); // Attach same expandos (if any) to the wrapped function
		}
		return wrapped || res;
	}
}

/* Internal private: view._getTmpl() */
function getTemplate(tmpl) {
	return tmpl && (tmpl.fn
		? tmpl
		: this.getRsc("templates", tmpl) || $templates(tmpl)); // not yet compiled
}

//==============
// views._cnvt
//==============

function convertVal(converter, view, tagCtx, onError) {
	// Called from compiled template code for {{:}}
	// self is template object or linkCtx object
	var tag, linkCtx, value, argsLen, bindTo,
		// If tagCtx is an integer, then it is the key for the compiled function to return the boundTag tagCtx
		boundTag = typeof tagCtx === "number" && view.tmpl.bnds[tagCtx-1];

	if (onError === undefined && boundTag && boundTag._lr) { // lateRender
		onError = "";
	}
	if (onError !== undefined) {
		tagCtx = onError = {props: {}, args: [onError]};
	} else if (boundTag) {
		tagCtx = boundTag(view.data, view, $sub);
	}
	boundTag = boundTag._bd && boundTag;
	if (converter || boundTag) {
		linkCtx = view._lc; // For data-link="{cvt:...}"... See onDataLinkedTagChange
		tag = linkCtx && linkCtx.tag;
		tagCtx.view = view;
		if (!tag) {
			tag = $extend(new $sub._tg(), {
				_: {
					bnd: boundTag,
					unlinked: true,
					lt: tagCtx.lt // If a late path @some.path has not returned @some object, mark tag as late
				},
				inline: !linkCtx,
				tagName: ":",
				convert: converter,
				onArrayChange: true,
				flow: true,
				tagCtx: tagCtx,
				tagCtxs: [tagCtx],
				_is: "tag"
			});
			argsLen = tagCtx.args.length;
			if (argsLen>1) {
				bindTo = tag.bindTo = [];
				while (argsLen--) {
					bindTo.unshift(argsLen); // Bind to all the arguments - generate bindTo array: [0,1,2...]
				}
			}
			if (linkCtx) {
				linkCtx.tag = tag;
				tag.linkCtx = linkCtx;
			}
			tagCtx.ctx = extendCtx(tagCtx.ctx, (linkCtx ? linkCtx.view : view).ctx);
			tagHandlersFromProps(tag, tagCtx);
		}
		tag._er = onError && value;
		tag.ctx = tagCtx.ctx || tag.ctx || {};
		tagCtx.ctx = undefined;
		value = tag.cvtArgs()[0]; // If there is a convertBack but no convert, converter will be "true"
		tag._er = onError && value;
	} else {
		value = tagCtx.args[0];
	}

	// Call onRender (used by JsViews if present, to add binding annotations around rendered content)
	value = boundTag && view._.onRender
		? view._.onRender(value, view, tag)
		: value;
	return value != undefined ? value : "";
}

function convertArgs(tagElse, bound) { // tag.cvtArgs() or tag.cvtArgs(tagElse?, true?)
	var l, key, boundArgs, args, bindFrom, tag, converter,
		tagCtx = this;

	if (tagCtx.tagName) {
		tag = tagCtx;
		tagCtx = (tag.tagCtxs || [tagCtx])[tagElse||0];
		if (!tagCtx) {
			return;
		}
	} else {
		tag = tagCtx.tag;
	}

	bindFrom = tag.bindFrom;
	args = tagCtx.args;

	if ((converter = tag.convert) && typeof converter === STRING) {
		converter = converter === "true"
			? undefined
			: (tagCtx.view.getRsc("converters", converter) || error("Unknown converter: '" + converter + "'"));
	}

	if (converter && !bound) { // If there is a converter, use a copy of the tagCtx.args array for rendering, and replace the args[0] in
		args = args.slice(); // the copied array with the converted value. But we do not modify the value of tag.tagCtx.args[0] (the original args array)
	}
	if (bindFrom) { // Get the values of the boundArgs
		boundArgs = [];
		l = bindFrom.length;
		while (l--) {
			key = bindFrom[l];
			boundArgs.unshift(argOrProp(tagCtx, key));
		}
		if (bound) {
			args = boundArgs; // Call to bndArgs() - returns the boundArgs
		}
	}
	if (converter) {
		converter = converter.apply(tag, boundArgs || args);
		if (converter === undefined) {
			return args; // Returning undefined from a converter is equivalent to not having a converter.
		}
		bindFrom = bindFrom || [0];
		l = bindFrom.length;
		if (!$isArray(converter) || (converter.arg0 !== false && (l === 1 || converter.length !== l || converter.arg0))) {
			converter = [converter]; // Returning converter as first arg, even if converter value is an array
			bindFrom = [0];
			l = 1;
		}
		if (bound) {        // Call to bndArgs() - so apply converter to all boundArgs
			args = converter; // The array of values returned from the converter
		} else {            // Call to cvtArgs()
			while (l--) {
				key = bindFrom[l];
				if (+key === key) {
					args[key] = converter[l];
				}
			}
		}
	}
	return args;
}

function argOrProp(context, key) {
	context = context[+key === key ? "args" : "props"];
	return context && context[key];
}

function convertBoundArgs(tagElse) { // tag.bndArgs()
	return this.cvtArgs(tagElse, 1);
}

//=============
// views.tag
//=============

/* view.getRsc() */
function getResource(resourceType, itemName) {
	var res, store,
		view = this;
	if (typeof itemName === STRING) {
		while ((res === undefined) && view) {
			store = view.tmpl && view.tmpl[resourceType];
			res = store && store[itemName];
			view = view.parent;
		}
		return res || $views[resourceType][itemName];
	}
}

function renderTag(tagName, parentView, tmpl, tagCtxs, isUpdate, onError) {
	function bindToOrBindFrom(type) {
		var bindArray = tag[type];

		if (bindArray !== undefined) {
			bindArray = $isArray(bindArray) ? bindArray : [bindArray];
			m = bindArray.length;
			while (m--) {
				key = bindArray[m];
				if (!isNaN(parseInt(key))) {
					bindArray[m] = parseInt(key); // Convert "0" to 0, etc.
				}
			}
		}

		return bindArray || [0];
	}

	parentView = parentView || topView;
	var tag, tagDef, template, tags, attr, parentTag, l, m, n, itemRet, tagCtx, tagCtxCtx, ctxPrm, bindTo, bindFrom, initVal,
		content, callInit, mapDef, thisMap, args, bdArgs, props, tagDataMap, contentCtx, key, bindFromLength, bindToLength, linkedElement, defaultCtx,
		i = 0,
		ret = "",
		linkCtx = parentView._lc || false, // For data-link="{myTag...}"... See onDataLinkedTagChange
		ctx = parentView.ctx,
		parentTmpl = tmpl || parentView.tmpl,
		// If tagCtxs is an integer, then it is the key for the compiled function to return the boundTag tagCtxs
		boundTag = typeof tagCtxs === "number" && parentView.tmpl.bnds[tagCtxs-1];

	if (tagName._is === "tag") {
		tag = tagName;
		tagName = tag.tagName;
		tagCtxs = tag.tagCtxs;
		template = tag.template;
	} else {
		tagDef = parentView.getRsc("tags", tagName) || error("Unknown tag: {{" + tagName + "}} ");
		template = tagDef.template;
	}
	if (onError === undefined && boundTag && (boundTag._lr = (tagDef.lateRender && boundTag._lr!== false || boundTag._lr))) {
		onError = ""; // If lateRender, set temporary onError, to skip initial rendering (and render just "")
	}
	if (onError !== undefined) {
		ret += onError;
		tagCtxs = onError = [{props: {}, args: [], params: {props:{}}}];
	} else if (boundTag) {
		tagCtxs = boundTag(parentView.data, parentView, $sub);
	}

	l = tagCtxs.length;
	for (; i < l; i++) {
		tagCtx = tagCtxs[i];
		content = tagCtx.tmpl;
		if (!linkCtx || !linkCtx.tag || i && !linkCtx.tag.inline || tag._er || content && +content===content) {
			// Initialize tagCtx
			// For block tags, tagCtx.tmpl is an integer > 0
			if (content && parentTmpl.tmpls) {
				tagCtx.tmpl = tagCtx.content = parentTmpl.tmpls[content - 1]; // Set the tmpl property to the content of the block tag
			}
			tagCtx.index = i;
			tagCtx.ctxPrm = contextParameter;
			tagCtx.render = renderContent;
			tagCtx.cvtArgs = convertArgs;
			tagCtx.bndArgs = convertBoundArgs;
			tagCtx.view = parentView;
			tagCtx.ctx = extendCtx(extendCtx(tagCtx.ctx, tagDef && tagDef.ctx), ctx); // Clone and extend parentView.ctx
		}
		if (tmpl = tagCtx.props.tmpl) {
			// If the tmpl property is overridden, set the value (when initializing, or, in case of binding: ^tmpl=..., when updating)
			tagCtx.tmpl = parentView._getTmpl(tmpl);
			tagCtx.content = tagCtx.content || tagCtx.tmpl;
		}

		if (!tag) {
			// This will only be hit for initial tagCtx (not for {{else}}) - if the tag instance does not exist yet
			// If the tag has not already been instantiated, we will create a new instance.
			// ~tag will access the tag, even within the rendering of the template content of this tag.
			// From child/descendant tags, can access using ~tag.parent, or ~parentTags.tagName
			tag = new tagDef._ctr();
			callInit = !!tag.init;

			tag.parent = parentTag = ctx && ctx.tag;
			tag.tagCtxs = tagCtxs;

			if (linkCtx) {
				tag.inline = false;
				linkCtx.tag = tag;
			}
			tag.linkCtx = linkCtx;
			if (tag._.bnd = boundTag || linkCtx.fn) {
				// Bound if {^{tag...}} or data-link="{tag...}"
				tag._.ths = tagCtx.params.props["this"]; // Tag has a this=expr binding, to get javascript reference to tag instance
				tag._.lt = tagCtxs.lt; // If a late path @some.path has not returned @some object, mark tag as late
				tag._.arrVws = {};
			} else if (tag.dataBoundOnly) {
				error(tagName + " must be data-bound:\n{^{" + tagName + "}}");
			}
			//TODO better perf for childTags() - keep child tag.tags array, (and remove child, when disposed)
			// tag.tags = [];
		} else if (linkCtx && linkCtx.fn._lr) {
			callInit = !!tag.init;
		}
		tagDataMap = tag.dataMap;

		tagCtx.tag = tag;
		if (tagDataMap && tagCtxs) {
			tagCtx.map = tagCtxs[i].map; // Copy over the compiled map instance from the previous tagCtxs to the refreshed ones
		}
		if (!tag.flow) {
			tagCtxCtx = tagCtx.ctx = tagCtx.ctx || {};

			// tags hash: tag.ctx.tags, merged with parentView.ctx.tags,
			tags = tag.parents = tagCtxCtx.parentTags = ctx && extendCtx(tagCtxCtx.parentTags, ctx.parentTags) || {};
			if (parentTag) {
				tags[parentTag.tagName] = parentTag;
				//TODO better perf for childTags: parentTag.tags.push(tag);
			}
			tags[tag.tagName] = tagCtxCtx.tag = tag;
			tagCtxCtx.tagCtx = tagCtx;
		}
	}
	if (!(tag._er = onError)) {
		tagHandlersFromProps(tag, tagCtxs[0]);
		tag.rendering = {rndr: tag.rendering}; // Provide object for state during render calls to tag and elses. (Used by {{if}} and {{for}}...)
		for (i = 0; i < l; i++) { // Iterate tagCtx for each {{else}} block
			tagCtx = tag.tagCtx = tagCtxs[i];
			props = tagCtx.props;
			tag.ctx = tagCtx.ctx;

			if (!i) {
				if (callInit) {
					tag.init(tagCtx, linkCtx, tag.ctx);
					callInit = undefined;
				}
				if (!tagCtx.args.length && tagCtx.argDefault !== false && tag.argDefault !== false) {
					tagCtx.args = args = [tagCtx.view.data]; // Missing first arg defaults to the current data context
					tagCtx.params.args = ["#data"];
				}

				bindTo = bindToOrBindFrom("bindTo");

				if (tag.bindTo !== undefined) {
					tag.bindTo = bindTo;
				}

				if (tag.bindFrom !== undefined) {
					tag.bindFrom = bindToOrBindFrom("bindFrom");
				} else if (tag.bindTo) {
					tag.bindFrom = tag.bindTo = bindTo;
				}
				bindFrom = tag.bindFrom || bindTo;

				bindToLength = bindTo.length;
				bindFromLength = bindFrom.length;

				if (tag._.bnd && (linkedElement = tag.linkedElement)) {
					tag.linkedElement = linkedElement = $isArray(linkedElement) ? linkedElement: [linkedElement];

					if (bindToLength !== linkedElement.length) {
						error("linkedElement not same length as bindTo");
					}
				}
				if (linkedElement = tag.linkedCtxParam) {
					tag.linkedCtxParam = linkedElement = $isArray(linkedElement) ? linkedElement: [linkedElement];

					if (bindFromLength !== linkedElement.length) {
						error("linkedCtxParam not same length as bindFrom/bindTo");
					}
				}

				if (bindFrom) {
					tag._.fromIndex = {}; // Hash of bindFrom index which has same path value as bindTo index. fromIndex = tag._.fromIndex[toIndex]
					tag._.toIndex = {}; // Hash of bindFrom index which has same path value as bindTo index. fromIndex = tag._.fromIndex[toIndex]
					n = bindFromLength;
					while (n--) {
						key = bindFrom[n];
						m = bindToLength;
						while (m--) {
							if (key === bindTo[m]) {
								tag._.fromIndex[m] = n;
								tag._.toIndex[n] = m;
							}
						}
					}
				}

				if (linkCtx) {
					// Set attr on linkCtx to ensure outputting to the correct target attribute.
					// Setting either linkCtx.attr or this.attr in the init() allows per-instance choice of target attrib.
					linkCtx.attr = tag.attr = linkCtx.attr || tag.attr || linkCtx._dfAt;
				}
				attr = tag.attr;
				tag._.noVws = attr && attr !== HTML;
			}
			args = tag.cvtArgs(i);
			if (tag.linkedCtxParam) {
				bdArgs = tag.cvtArgs(i, 1);
				m = bindFromLength;
				defaultCtx = tag.constructor.prototype.ctx;
				while (m--) {
					if (ctxPrm = tag.linkedCtxParam[m]) {
						key = bindFrom[m];
						initVal = bdArgs[m];
						// Create tag contextual parameter
						tagCtx.ctx[ctxPrm] = $sub._cp(
							defaultCtx && initVal === undefined ? defaultCtx[ctxPrm]: initVal,
							initVal !== undefined && argOrProp(tagCtx.params, key),
							tagCtx.view,
							tag._.bnd && {tag: tag, cvt: tag.convert, ind: m, tagElse: i}
						);
					}
				}
			}
			if ((mapDef = props.dataMap || tagDataMap) && (args.length || props.dataMap)) {
				thisMap = tagCtx.map;
				if (!thisMap || thisMap.src !== args[0] || isUpdate) {
					if (thisMap && thisMap.src) {
						thisMap.unmap(); // only called if observable map - not when only used in JsRender, e.g. by {{props}}
					}
					mapDef.map(args[0], tagCtx, thisMap, !tag._.bnd);
					thisMap = tagCtx.map;
				}
				args = [thisMap.tgt];
			}

			itemRet = undefined;
			if (tag.render) {
				itemRet = tag.render.apply(tag, args);
				if (parentView.linked && itemRet && !rWrappedInViewMarker.test(itemRet)) {
					// When a tag renders content from the render method, with data linking then we need to wrap with view markers, if absent,
					// to provide a contentView for the tag, which will correctly dispose bindings if deleted. The 'tmpl' for this view will
					// be a dumbed-down template which will always return the itemRet string (no matter what the data is). The itemRet string
					// is not compiled as template markup, so can include "{{" or "}}" without triggering syntax errors
					tmpl = { // 'Dumbed-down' template which always renders 'static' itemRet string
						links: []
					};
					tmpl.render = tmpl.fn = function() {
						return itemRet;
					};
					itemRet = renderWithViews(tmpl, parentView.data, undefined, true, parentView, undefined, undefined, tag);
				}
			}
			if (!args.length) {
				args = [parentView]; // no arguments - (e.g. {{else}}) get data context from view.
			}
			if (itemRet === undefined) {
				contentCtx = args[0]; // Default data context for wrapped block content is the first argument
				if (tag.contentCtx) { // Set tag.contentCtx to true, to inherit parent context, or to a function to provide alternate context.
					contentCtx = tag.contentCtx === true ? parentView : tag.contentCtx(contentCtx);
				}
				itemRet = tagCtx.render(contentCtx, true) || (isUpdate ? undefined : "");
			}
			ret = ret
				? ret + (itemRet || "")
				: itemRet !== undefined
					? "" + itemRet
					: undefined; // If no return value from render, and no template/content tagCtx.render(...), return undefined
		}
		tag.rendering = tag.rendering.rndr; // Remove tag.rendering object (if this is outermost render call. (In case of nested calls)
	}
	tag.tagCtx = tagCtxs[0];
	tag.ctx = tag.tagCtx.ctx;

	if (tag._.noVws && tag.inline) {
		// inline tag with attr set to "text" will insert HTML-encoded content - as if it was element-based innerText
		ret = attr === "text"
			? $converters.html(ret)
			: "";
	}
	return boundTag && parentView._.onRender
		// Call onRender (used by JsViews if present, to add binding annotations around rendered content)
		? parentView._.onRender(ret, parentView, tag)
		: ret;
}

//=================
// View constructor
//=================

function View(context, type, parentView, data, template, key, onRender, contentTmpl) {
	// Constructor for view object in view hierarchy. (Augmented by JsViews if JsViews is loaded)
	var views, parentView_, tag, self_,
		self = this,
		isArray = type === "array";
		// If the data is an array, this is an 'array view' with a views array for each child 'item view'
		// If the data is not an array, this is an 'item view' with a views 'hash' object for any child nested views

	self.content = contentTmpl;
	self.views = isArray ? [] : {};
	self.data = data;
	self.tmpl = template;
	self_ = self._ = {
		key: 0,
		// ._.useKey is non zero if is not an 'array view' (owning a data array). Use this as next key for adding to child views hash
		useKey: isArray ? 0 : 1,
		id: "" + viewId++,
		onRender: onRender,
		bnds: {}
	};
	self.linked = !!onRender;
	self.type = type || "top";
	if (type) {
		self.cache = {_ct: $subSettings._cchCt}; // Used for caching results of computed properties and helpers (view.getCache)
	}

	if (!parentView || parentView.type === "top") {
		(self.ctx = context || {}).root = self.data;
	}

	if (self.parent = parentView) {
		self.root = parentView.root || self; // view whose parent is top view
		views = parentView.views;
		parentView_ = parentView._;
		self.isTop = parentView_.scp; // Is top content view of a link("#container", ...) call
		self.scope = (!context.tag || context.tag === parentView.ctx.tag) && !self.isTop && parentView.scope || self;
		// Scope for contextParams - closest non flow tag ancestor or root view
		if (parentView_.useKey) {
			// Parent is not an 'array view'. Add this view to its views object
			// self._key = is the key in the parent view hash
			views[self_.key = "_" + parentView_.useKey++] = self;
			self.index = indexStr;
			self.getIndex = getNestedIndex;
		} else if (views.length === (self_.key = self.index = key)) { // Parent is an 'array view'. Add this view to its views array
			views.push(self); // Adding to end of views array. (Using push when possible - better perf than splice)
		} else {
			views.splice(key, 0, self); // Inserting in views array
		}
		// If no context was passed in, use parent context
		// If context was passed in, it should have been merged already with parent context
		self.ctx = context || parentView.ctx;
	} else if (type) {
		self.root = self; // view whose parent is top view
	}
}

View.prototype = {
	get: getView,
	getIndex: getIndex,
	ctxPrm: contextParameter,
	getRsc: getResource,
	_getTmpl: getTemplate,
	_getOb: getPathObject,
	getCache: function(key) { // Get cached value of computed value
		if ($subSettings._cchCt > this.cache._ct) {
			this.cache = {_ct: $subSettings._cchCt};
		}
		return this.cache[key] !== undefined ? this.cache[key] : (this.cache[key] = cpFnStore[key](this.data, this, $sub));
	},
	_is: "view"
};

//====================================================
// Registration
//====================================================

function compileChildResources(parentTmpl) {
	var storeName, storeNames, resources;
	for (storeName in jsvStores) {
		storeNames = storeName + "s";
		if (parentTmpl[storeNames]) {
			resources = parentTmpl[storeNames];        // Resources not yet compiled
			parentTmpl[storeNames] = {};               // Remove uncompiled resources
			$views[storeNames](resources, parentTmpl); // Add back in the compiled resources
		}
	}
}

//===============
// compileTag
//===============

function compileTag(name, tagDef, parentTmpl) {
	var tmpl, baseTag, prop,
		compiledDef = new $sub._tg();

	function Tag() {
		var tag = this;
		tag._ = {
			unlinked: true
		};
		tag.inline = true;
		tag.tagName = name;
	}

	if ($isFunction(tagDef)) {
		// Simple tag declared as function. No presenter instantation.
		tagDef = {
			depends: tagDef.depends,
			render: tagDef
		};
	} else if (typeof tagDef === STRING) {
		tagDef = {template: tagDef};
	}

	if (baseTag = tagDef.baseTag) {
		tagDef.flow = !!tagDef.flow; // Set flow property, so defaults to false even if baseTag has flow=true
		baseTag = typeof baseTag === STRING
			? (parentTmpl && parentTmpl.tags[baseTag] || $tags[baseTag])
			: baseTag;
		if (!baseTag) {
			error('baseTag: "' + tagDef.baseTag + '" not found');
		}
		compiledDef = $extend(compiledDef, baseTag);

		for (prop in tagDef) {
			compiledDef[prop] = getMethod(baseTag[prop], tagDef[prop]);
		}
	} else {
		compiledDef = $extend(compiledDef, tagDef);
	}

	// Tag declared as object, used as the prototype for tag instantiation (control/presenter)
	if ((tmpl = compiledDef.template) !== undefined) {
		compiledDef.template = typeof tmpl === STRING ? ($templates[tmpl] || $templates(tmpl)) : tmpl;
	}
	(Tag.prototype = compiledDef).constructor = compiledDef._ctr = Tag;

	if (parentTmpl) {
		compiledDef._parentTmpl = parentTmpl;
	}
	return compiledDef;
}

function baseApply(args) {
	// In derived method (or handler declared declaratively as in {{:foo onChange=~fooChanged}} can call base method,
	// using this.baseApply(arguments) (Equivalent to this._superApply(arguments) in jQuery UI)
	return this.base.apply(this, args);
}

//===============
// compileTmpl
//===============

function compileTmpl(name, tmpl, parentTmpl, options) {
	// tmpl is either a template object, a selector for a template script block, or the name of a compiled template

	//==== nested functions ====
	function lookupTemplate(value) {
		// If value is of type string - treat as selector, or name of compiled template
		// Return the template object, if already compiled, or the markup string
		var currentName, tmpl;
		if ((typeof value === STRING) || value.nodeType > 0 && (elem = value)) {
			if (!elem) {
				if (/^\.?\/[^\\:*?"<>]*$/.test(value)) {
					// value="./some/file.html" (or "/some/file.html")
					// If the template is not named, use "./some/file.html" as name.
					if (tmpl = $templates[name = name || value]) {
						value = tmpl;
					} else {
						// BROWSER-SPECIFIC CODE (not on Node.js):
						// Look for server-generated script block with id "./some/file.html"
						elem = document.getElementById(value);
					}
				} else if (value.charAt(0) === "#") {
					elem = document.getElementById(value.slice(1));
				} if (!elem && $.fn && !$sub.rTmpl.test(value)) {
					try {
						elem = $(value, document)[0]; // if jQuery is loaded, test for selector returning elements, and get first element
					} catch (e) {}
				}// END BROWSER-SPECIFIC CODE
			} //BROWSER-SPECIFIC CODE
			if (elem) {
				if (elem.tagName !== "SCRIPT") {
					error(value + ": Use script block, not " + elem.tagName);
				}
				if (options) {
					// We will compile a new template using the markup in the script element
					value = elem.innerHTML;
				} else {
					// We will cache a single copy of the compiled template, and associate it with the name
					// (renaming from a previous name if there was one).
					currentName = elem.getAttribute(tmplAttr);
					if (currentName) {
						if (currentName !== jsvTmpl) {
							value = $templates[currentName];
							delete $templates[currentName];
						} else if ($.fn) {
							value = $.data(elem)[jsvTmpl]; // Get cached compiled template
						}
					}
					if (!currentName || !value) { // Not yet compiled, or cached version lost
						name = name || ($.fn ? jsvTmpl : value);
						value = compileTmpl(name, elem.innerHTML, parentTmpl, options);
					}
					value.tmplName = name = name || currentName;
					if (name !== jsvTmpl) {
						$templates[name] = value;
					}
					elem.setAttribute(tmplAttr, name);
					if ($.fn) {
						$.data(elem, jsvTmpl, value);
					}
				}
			} // END BROWSER-SPECIFIC CODE
			elem = undefined;
		} else if (!value.fn) {
			value = undefined;
			// If value is not a string. HTML element, or compiled template, return undefined
		}
		return value;
	}

	var elem, compiledTmpl,
		tmplOrMarkup = tmpl = tmpl || "";
	$sub._html = $converters.html;

	//==== Compile the template ====
	if (options === 0) {
		options = undefined;
		tmplOrMarkup = lookupTemplate(tmplOrMarkup); // Top-level compile so do a template lookup
	}

	// If options, then this was already compiled from a (script) element template declaration.
	// If not, then if tmpl is a template object, use it for options
	options = options || (tmpl.markup
		? tmpl.bnds
			? $extend({}, tmpl)
			: tmpl
		: {}
	);

	options.tmplName = options.tmplName || name || "unnamed";
	if (parentTmpl) {
		options._parentTmpl = parentTmpl;
	}
	// If tmpl is not a markup string or a selector string, then it must be a template object
	// In that case, get it from the markup property of the object
	if (!tmplOrMarkup && tmpl.markup && (tmplOrMarkup = lookupTemplate(tmpl.markup)) && tmplOrMarkup.fn) {
		// If the string references a compiled template object, need to recompile to merge any modified options
		tmplOrMarkup = tmplOrMarkup.markup;
	}
	if (tmplOrMarkup !== undefined) {
		if (tmplOrMarkup.render || tmpl.render) {
			// tmpl is already compiled, so use it
			if (tmplOrMarkup.tmpls) {
				compiledTmpl = tmplOrMarkup;
			}
		} else {
			// tmplOrMarkup is a markup string, not a compiled template
			// Create template object
			tmpl = tmplObject(tmplOrMarkup, options);
			// Compile to AST and then to compiled function
			tmplFn(tmplOrMarkup.replace(rEscapeQuotes, "\\$&"), tmpl);
		}
		if (!compiledTmpl) {
			compiledTmpl = $extend(function() {
				return compiledTmpl.render.apply(compiledTmpl, arguments);
			}, tmpl);

			compileChildResources(compiledTmpl);
		}
		return compiledTmpl;
	}
}

//==== /end of function compileTmpl ====

//=================
// compileViewModel
//=================

function getDefaultVal(defaultVal, data) {
	return $isFunction(defaultVal)
		? defaultVal.call(data)
		: defaultVal;
}

function addParentRef(ob, ref, parent) {
	Object.defineProperty(ob, ref, {
		value: parent,
		configurable: true
	});
}

function compileViewModel(name, type) {
	var i, constructor, parent,
		viewModels = this,
		getters = type.getters,
		extend = type.extend,
		id = type.id,
		proto = $.extend({
			_is: name || "unnamed",
			unmap: unmap,
			merge: merge
		}, extend),
		args = "",
		cnstr = "",
		getterCount = getters ? getters.length : 0,
		$observable = $.observable,
		getterNames = {};

	function JsvVm(args) {
		constructor.apply(this, args);
	}

	function vm() {
		return new JsvVm(arguments);
	}

	function iterate(data, action) {
		var getterType, defaultVal, prop, ob, parentRef,
			j = 0;
		for (; j < getterCount; j++) {
			prop = getters[j];
			getterType = undefined;
			if (typeof prop !== STRING) {
				getterType = prop;
				prop = getterType.getter;
				parentRef = getterType.parentRef;
			}
			if ((ob = data[prop]) === undefined && getterType && (defaultVal = getterType.defaultVal) !== undefined) {
				ob = getDefaultVal(defaultVal, data);
			}
			action(ob, getterType && viewModels[getterType.type], prop, parentRef);
		}
	}

	function map(data) {
		data = typeof data === STRING
			? JSON.parse(data) // Accept JSON string
			: data;            // or object/array
		var l, prop, childOb, parentRef,
			j = 0,
			ob = data,
			arr = [];

		if ($isArray(data)) {
			data = data || [];
			l = data.length;
			for (; j<l; j++) {
				arr.push(this.map(data[j]));
			}
			arr._is = name;
			arr.unmap = unmap;
			arr.merge = merge;
			return arr;
		}

		if (data) {
			iterate(data, function(ob, viewModel) {
				if (viewModel) { // Iterate to build getters arg array (value, or mapped value)
					ob = viewModel.map(ob);
				}
				arr.push(ob);
			});
			ob = this.apply(this, arr); // Instantiate this View Model, passing getters args array to constructor
			j = getterCount;
			while (j--) {
				childOb = arr[j];
				parentRef = getters[j].parentRef;
				if (parentRef && childOb && childOb.unmap) {
					if ($isArray(childOb)) {
						l = childOb.length;
						while (l--) {
							addParentRef(childOb[l], parentRef, ob);
						}
					} else {
						addParentRef(childOb, parentRef, ob);
					}
				}
			}
			for (prop in data) { // Copy over any other properties. that are not get/set properties
				if (prop !== $expando && !getterNames[prop]) {
					ob[prop] = data[prop];
				}
			}
		}
		return ob;
	}

	function merge(data, parent, parentRef) {
		data = typeof data === STRING
			? JSON.parse(data) // Accept JSON string
			: data;            // or object/array

		var j, l, m, prop, mod, found, assigned, ob, newModArr, childOb,
			k = 0,
			model = this;

		if ($isArray(model)) {
			assigned = {};
			newModArr = [];
			l = data.length;
			m = model.length;
			for (; k<l; k++) {
				ob = data[k];
				found = false;
				for (j=0; j<m && !found; j++) {
					if (assigned[j]) {
						continue;
					}
					mod = model[j];

					if (id) {
						assigned[j] = found = typeof id === STRING
						? (ob[id] && (getterNames[id] ? mod[id]() : mod[id]) === ob[id])
						: id(mod, ob);
					}
				}
				if (found) {
					mod.merge(ob);
					newModArr.push(mod);
				} else {
					newModArr.push(childOb = vm.map(ob));
					if (parentRef) {
						addParentRef(childOb, parentRef, parent);
					}
				}
			}
			if ($observable) {
				$observable(model).refresh(newModArr, true);
			} else {
				model.splice.apply(model, [0, model.length].concat(newModArr));
			}
			return;
		}
		iterate(data, function(ob, viewModel, getter, parentRef) {
			if (viewModel) {
				model[getter]().merge(ob, model, parentRef); // Update typed property
			} else if (model[getter]() !== ob) {
				model[getter](ob); // Update non-typed property
			}
		});
		for (prop in data) {
			if (prop !== $expando && !getterNames[prop]) {
				model[prop] = data[prop];
			}
		}
	}

	function unmap() {
		var ob, prop, getterType, arr, value,
			k = 0,
			model = this;

		function unmapArray(modelArr) {
			var arr = [],
				i = 0,
				l = modelArr.length;
			for (; i<l; i++) {
				arr.push(modelArr[i].unmap());
			}
			return arr;
		}

		if ($isArray(model)) {
			return unmapArray(model);
		}
		ob = {};
		for (; k < getterCount; k++) {
			prop = getters[k];
			getterType = undefined;
			if (typeof prop !== STRING) {
				getterType = prop;
				prop = getterType.getter;
			}
			value = model[prop]();
			ob[prop] = getterType && value && viewModels[getterType.type]
				? $isArray(value)
					? unmapArray(value)
					: value.unmap()
				: value;
		}
		for (prop in model) {
			if (model.hasOwnProperty(prop) && (prop.charAt(0) !== "_" || !getterNames[prop.slice(1)]) && prop !== $expando && !$isFunction(model[prop])) {
				ob[prop] = model[prop];
			}
		}
		return ob;
	}

	JsvVm.prototype = proto;

	for (i=0; i < getterCount; i++) {
		(function(getter) {
			getter = getter.getter || getter;
			getterNames[getter] = i+1;
			var privField = "_" + getter;

			args += (args ? "," : "") + getter;
			cnstr += "this." + privField + " = " + getter + ";\n";
			proto[getter] = proto[getter] || function(val) {
				if (!arguments.length) {
					return this[privField]; // If there is no argument, use as a getter
				}
				if ($observable) {
					$observable(this).setProperty(getter, val);
				} else {
					this[privField] = val;
				}
			};

			if ($observable) {
				proto[getter].set = proto[getter].set || function(val) {
					this[privField] = val; // Setter called by observable property change
				};
			}
		})(getters[i]);
	}

	// Constructor for new viewModel instance.
	cnstr = new Function(args, cnstr);

	constructor = function() {
		cnstr.apply(this, arguments);
		// Pass additional parentRef str and parent obj to have a parentRef pointer on instance
		if (parent = arguments[getterCount + 1]) {
			addParentRef(this, arguments[getterCount], parent);
		}
	};

	constructor.prototype = proto;
	proto.constructor = constructor;

	vm.map = map;
	vm.getters = getters;
	vm.extend = extend;
	vm.id = id;
	return vm;
}

function tmplObject(markup, options) {
	// Template object constructor
	var htmlTag,
		wrapMap = $subSettingsAdvanced._wm || {}, // Only used in JsViews. Otherwise empty: {}
		tmpl = {
			tmpls: [],
			links: {}, // Compiled functions for link expressions
			bnds: [],
			_is: "template",
			render: renderContent
		};

	if (options) {
		tmpl = $extend(tmpl, options);
	}

	tmpl.markup = markup;
	if (!tmpl.htmlTag) {
		// Set tmpl.tag to the top-level HTML tag used in the template, if any...
		htmlTag = rFirstElem.exec(markup);
		tmpl.htmlTag = htmlTag ? htmlTag[1].toLowerCase() : "";
	}
	htmlTag = wrapMap[tmpl.htmlTag];
	if (htmlTag && htmlTag !== wrapMap.div) {
		// When using JsViews, we trim templates which are inserted into HTML contexts where text nodes are not rendered (i.e. not 'Phrasing Content').
		// Currently not trimmed for <li> tag. (Not worth adding perf cost)
		tmpl.markup = $.trim(tmpl.markup);
	}

	return tmpl;
}

//==============
// registerStore
//==============

/**
* Internal. Register a store type (used for template, tags, helpers, converters)
*/
function registerStore(storeName, storeSettings) {

/**
* Generic store() function to register item, named item, or hash of items
* Also used as hash to store the registered items
* Used as implementation of $.templates(), $.views.templates(), $.views.tags(), $.views.helpers() and $.views.converters()
*
* @param {string|hash} name         name - or selector, in case of $.templates(). Or hash of items
* @param {any}         [item]       (e.g. markup for named template)
* @param {template}    [parentTmpl] For item being registered as private resource of template
* @returns {any|$.views} item, e.g. compiled template - or $.views in case of registering hash of items
*/
	function theStore(name, item, parentTmpl) {
		// The store is also the function used to add items to the store. e.g. $.templates, or $.views.tags

		// For store of name 'thing', Call as:
		//    $.views.things(items[, parentTmpl]),
		// or $.views.things(name[, item, parentTmpl])

		var compile, itemName, thisStore, cnt,
			onStore = $sub.onStore[storeName];

		if (name && typeof name === OBJECT && !name.nodeType && !name.markup && !name.getTgt && !(storeName === "viewModel" && name.getters || name.extend)) {
			// Call to $.views.things(items[, parentTmpl]),

			// Adding items to the store
			// If name is a hash, then item is parentTmpl. Iterate over hash and call store for key.
			for (itemName in name) {
				theStore(itemName, name[itemName], item);
			}
			return item || $views;
		}
		// Adding a single unnamed item to the store
		if (name &&  typeof name !== STRING) { // name must be a string
			parentTmpl = item;
			item = name;
			name = undefined;
		}
		thisStore = parentTmpl
			? storeName === "viewModel"
				? parentTmpl
				: (parentTmpl[storeNames] = parentTmpl[storeNames] || {})
			: theStore;
		compile = storeSettings.compile;

		if (item === undefined) {
			item = compile ? name : thisStore[name];
			name = undefined;
		}
		if (item === null) {
			// If item is null, delete this entry
			if (name) {
				delete thisStore[name];
			}
		} else {
			if (compile) {
				item = compile.call(thisStore, name, item, parentTmpl, 0) || {};
				item._is = storeName; // Only do this for compiled objects (tags, templates...)
			}
			if (name) {
				thisStore[name] = item;
			}
		}
		if (onStore) {
			// e.g. JsViews integration
			onStore(name, item, parentTmpl, compile);
		}
		return item;
	}

	var storeNames = storeName + "s";
	$views[storeNames] = theStore;
}

/**
* Add settings such as:
* $.views.settings.allowCode(true)
* @param {boolean} value
* @returns {Settings}
*
* allowCode = $.views.settings.allowCode()
* @returns {boolean}
*/
function addSetting(st) {
	$viewsSettings[st] = $viewsSettings[st] || function(value) {
		return arguments.length
			? ($subSettings[st] = value, $viewsSettings)
			: $subSettings[st];
	};
}

//========================
// dataMap for render only
//========================

function dataMap(mapDef) {
	function Map(source, options) {
		this.tgt = mapDef.getTgt(source, options);
		options.map = this;
	}

	if ($isFunction(mapDef)) {
		// Simple map declared as function
		mapDef = {
			getTgt: mapDef
		};
	}

	if (mapDef.baseMap) {
		mapDef = $extend($extend({}, mapDef.baseMap), mapDef);
	}

	mapDef.map = function(source, options) {
		return new Map(source, options);
	};
	return mapDef;
}

//==============
// renderContent
//==============

/** Render the template as a string, using the specified data and helpers/context
* $("#tmpl").render(), tmpl.render(), tagCtx.render(), $.render.namedTmpl()
*
* @param {any}        data
* @param {hash}       [context]           helpers or context
* @param {boolean}    [noIteration]
* @param {View}       [parentView]        internal
* @param {string}     [key]               internal
* @param {function}   [onRender]          internal
* @returns {string}   rendered template   internal
*/
function renderContent(data, context, noIteration, parentView, key, onRender) {
	var i, l, tag, tmpl, tagCtx, isTopRenderCall, prevData, prevIndex,
		view = parentView,
		result = "";

	if (context === true) {
		noIteration = context; // passing boolean as second param - noIteration
		context = undefined;
	} else if (typeof context !== OBJECT) {
		context = undefined; // context must be a boolean (noIteration) or a plain object
	}

	if (tag = this.tag) {
		// This is a call from renderTag or tagCtx.render(...)
		tagCtx = this;
		view = view || tagCtx.view;
		tmpl = view._getTmpl(tag.template || tagCtx.tmpl);
		if (!arguments.length) {
			data = tag.contentCtx && $isFunction(tag.contentCtx)
				? data = tag.contentCtx(data)
				: view; // Default data context for wrapped block content is the first argument
		}
	} else {
		// This is a template.render(...) call
		tmpl = this;
	}

	if (tmpl) {
		if (!parentView && data && data._is === "view") {
			view = data; // When passing in a view to render or link (and not passing in a parent view) use the passed-in view as parentView
		}

		if (view && data === view) {
			// Inherit the data from the parent view.
			data = view.data;
		}

		isTopRenderCall = !view;
		isRenderCall = isRenderCall || isTopRenderCall;
		if (isTopRenderCall) {
			(context = context || {}).root = data; // Provide ~root as shortcut to top-level data.
		}
		if (!isRenderCall || $subSettingsAdvanced.useViews || tmpl.useViews || view && view !== topView) {
			result = renderWithViews(tmpl, data, context, noIteration, view, key, onRender, tag);
		} else {
			if (view) { // In a block
				prevData = view.data;
				prevIndex = view.index;
				view.index = indexStr;
			} else {
				view = topView;
				prevData = view.data;
				view.data = data;
				view.ctx = context;
			}
			if ($isArray(data) && !noIteration) {
				// Create a view for the array, whose child views correspond to each data item. (Note: if key and parentView are passed in
				// along with parent view, treat as insert -e.g. from view.addViews - so parentView is already the view item for array)
				for (i = 0, l = data.length; i < l; i++) {
					view.index = i;
					view.data = data[i];
					result += tmpl.fn(data[i], view, $sub);
				}
			} else {
				view.data = data;
				result += tmpl.fn(data, view, $sub);
			}
			view.data = prevData;
			view.index = prevIndex;
		}
		if (isTopRenderCall) {
			isRenderCall = undefined;
		}
	}
	return result;
}

function renderWithViews(tmpl, data, context, noIteration, view, key, onRender, tag) {
	// Render template against data as a tree of subviews (nested rendered template instances), or as a string (top-level template).
	// If the data is the parent view, treat as noIteration, re-render with the same data context.
	// tmpl can be a string (e.g. rendered by a tag.render() method), or a compiled template.
	var i, l, newView, childView, itemResult, swapContent, contentTmpl, outerOnRender, tmplName, itemVar, newCtx, tagCtx, noLinking,
		result = "";

	if (tag) {
		// This is a call from renderTag or tagCtx.render(...)
		tmplName = tag.tagName;
		tagCtx = tag.tagCtx;
		context = context ? extendCtx(context, tag.ctx) : tag.ctx;

		if (tmpl === view.content) { // {{xxx tmpl=#content}}
			contentTmpl = tmpl !== view.ctx._wrp // We are rendering the #content
				? view.ctx._wrp // #content was the tagCtx.props.tmpl wrapper of the block content - so within this view, #content will now be the view.ctx._wrp block content
				: undefined; // #content was the view.ctx._wrp block content - so within this view, there is no longer any #content to wrap.
		} else if (tmpl !== tagCtx.content) {
			if (tmpl === tag.template) { // Rendering {{tag}} tag.template, replacing block content.
				contentTmpl = tagCtx.tmpl; // Set #content to block content (or wrapped block content if tagCtx.props.tmpl is set)
				context._wrp = tagCtx.content; // Pass wrapped block content to nested views
			} else { // Rendering tagCtx.props.tmpl wrapper
				contentTmpl = tagCtx.content || view.content; // Set #content to wrapped block content
			}
		} else {
			contentTmpl = view.content; // Nested views inherit same wrapped #content property
		}

		if (tagCtx.props.link === false) {
			// link=false setting on block tag
			// We will override inherited value of link by the explicit setting link=false taken from props
			// The child views of an unlinked view are also unlinked. So setting child back to true will not have any effect.
			context = context || {};
			context.link = false;
		}
	}

	if (view) {
		onRender = onRender || view._.onRender;
		noLinking = context && context.link === false;

		if (noLinking && view._.nl) {
			onRender = undefined;
		}

		context = extendCtx(context, view.ctx);
		tagCtx = !tag && view.tag
			? view.tag.tagCtxs[view.tagElse]
			: tagCtx;
	}

	if (itemVar = tagCtx && tagCtx.props.itemVar) {
		if (itemVar[0] !== "~") {
			syntaxError("Use itemVar='~myItem'");
		}
		itemVar = itemVar.slice(1);
	}

	if (key === true) {
		swapContent = true;
		key = 0;
	}

	// If link===false, do not call onRender, so no data-linking marker nodes
	if (onRender && tag && tag._.noVws) {
		onRender = undefined;
	}
	outerOnRender = onRender;
	if (onRender === true) {
		// Used by view.refresh(). Don't create a new wrapper view.
		outerOnRender = undefined;
		onRender = view._.onRender;
	}
	// Set additional context on views created here, (as modified context inherited from the parent, and to be inherited by child views)
	context = tmpl.helpers
		? extendCtx(tmpl.helpers, context)
		: context;

	newCtx = context;
	if ($isArray(data) && !noIteration) {
		// Create a view for the array, whose child views correspond to each data item. (Note: if key and view are passed in
		// along with parent view, treat as insert -e.g. from view.addViews - so view is already the view item for array)
		newView = swapContent
			? view
			: (key !== undefined && view)
				|| new View(context, "array", view, data, tmpl, key, onRender, contentTmpl);
		newView._.nl= noLinking;
		if (view && view._.useKey) {
			// Parent is not an 'array view'
			newView._.bnd = !tag || tag._.bnd && tag; // For array views that are data bound for collection change events, set the
			// view._.bnd property to true for top-level link() or data-link="{for}", or to the tag instance for a data-bound tag, e.g. {^{for ...}}
			newView.tag = tag;
		}
		for (i = 0, l = data.length; i < l; i++) {
			// Create a view for each data item.
			childView = new View(newCtx, "item", newView, data[i], tmpl, (key || 0) + i, onRender, newView.content);
			if (itemVar) {
				(childView.ctx = $extend({}, newCtx))[itemVar] = $sub._cp(data[i], "#data", childView);
			}
			itemResult = tmpl.fn(data[i], childView, $sub);
			result += newView._.onRender ? newView._.onRender(itemResult, childView) : itemResult;
		}
	} else {
		// Create a view for singleton data object. The type of the view will be the tag name, e.g. "if" or "mytag" except for
		// "item", "array" and "data" views. A "data" view is from programmatic render(object) against a 'singleton'.
		newView = swapContent ? view : new View(newCtx, tmplName || "data", view, data, tmpl, key, onRender, contentTmpl);

		if (itemVar) {
			(newView.ctx = $extend({}, newCtx))[itemVar] = $sub._cp(data, "#data", newView);
		}

		newView.tag = tag;
		newView._.nl = noLinking;
		result += tmpl.fn(data, newView, $sub);
	}
	if (tag) {
		newView.tagElse = tagCtx.index;
		tagCtx.contentView = newView;
	}
	return outerOnRender ? outerOnRender(result, newView) : result;
}

//===========================
// Build and compile template
//===========================

// Generate a reusable function that will serve to render a template against data
// (Compile AST then build template function)

function onRenderError(e, view, fallback) {
	var message = fallback !== undefined
		? $isFunction(fallback)
			? fallback.call(view.data, e, view)
			: fallback || ""
		: "{Error: " + (e.message||e) + "}";

	if ($subSettings.onError && (fallback = $subSettings.onError.call(view.data, e, fallback && message, view)) !== undefined) {
		message = fallback; // There is a settings.debugMode(handler) onError override. Call it, and use return value (if any) to replace message
	}
	return view && !view._lc ? $converters.html(message) : message; // For data-link=\"{... onError=...}"... See onDataLinkedTagChange
}

function error(message) {
	throw new $sub.Err(message);
}

function syntaxError(message) {
	error("Syntax error\n" + message);
}

function tmplFn(markup, tmpl, isLinkExpr, convertBack, hasElse) {
	// Compile markup to AST (abtract syntax tree) then build the template function code from the AST nodes
	// Used for compiling templates, and also by JsViews to build functions for data link expressions

	//==== nested functions ====
	function pushprecedingContent(shift) {
		shift -= loc;
		if (shift) {
			content.push(markup.substr(loc, shift).replace(rNewLine, "\\n"));
		}
	}

	function blockTagCheck(tagName, block) {
		if (tagName) {
			tagName += '}}';
			//			'{{include}} block has {{/for}} with no open {{for}}'
			syntaxError((
				block
					? '{{' + block + '}} block has {{/' + tagName + ' without {{' + tagName
					: 'Unmatched or missing {{/' + tagName) + ', in template:\n' + markup);
		}
	}

	function parseTag(all, bind, tagName, converter, colon, html, codeTag, params, slash, bind2, closeBlock, index) {
/*

     bind     tagName         cvt   cln html code    params            slash   bind2         closeBlk  comment
/(?:{(\^)?{(?:(\w+(?=[\/\s}]))|(\w+)?(:)|(>)|(\*))\s*((?:[^}]|}(?!}))*?)(\/)?|{(\^)?{(?:(?:\/(\w+))\s*|!--[\s\S]*?--))}}/g

(?:
  {(\^)?{            bind
  (?:
    (\w+             tagName
      (?=[\/\s}])
    )
    |
    (\w+)?(:)        converter colon
    |
    (>)              html
    |
    (\*)             codeTag
  )
  \s*
  (                  params
    (?:[^}]|}(?!}))*?
  )
  (\/)?              slash
  |
  {(\^)?{            bind2
  (?:
    (?:\/(\w+))\s*   closeBlock
    |
    !--[\s\S]*?--    comment
  )
)
}}/g

*/
		if (codeTag && bind || slash && !tagName || params && params.slice(-1) === ":" || bind2) {
			syntaxError(all);
		}

		// Build abstract syntax tree (AST): [tagName, converter, params, content, hash, bindings, contentMarkup]
		if (html) {
			colon = ":";
			converter = HTML;
		}
		slash = slash || isLinkExpr && !hasElse;

		var late, openTagName, isLateOb,
			pathBindings = (bind || isLinkExpr) && [[]], // pathBindings is an array of arrays for arg bindings and a hash of arrays for prop bindings
			props = "",
			args = "",
			ctxProps = "",
			paramsArgs = "",
			paramsProps = "",
			paramsCtxProps = "",
			onError = "",
			useTrigger = "",
			// Block tag if not self-closing and not {{:}} or {{>}} (special case) and not a data-link expression
			block = !slash && !colon;

		//==== nested helper function ====
		tagName = tagName || (params = params || "#data", colon); // {{:}} is equivalent to {{:#data}}
		pushprecedingContent(index);
		loc = index + all.length; // location marker - parsed up to here
		if (codeTag) {
			if (allowCode) {
				content.push(["*", "\n" + params.replace(/^:/, "ret+= ").replace(rUnescapeQuotes, "$1") + ";\n"]);
			}
		} else if (tagName) {
			if (tagName === "else") {
				if (rTestElseIf.test(params)) {
					syntaxError('For "{{else if expr}}" use "{{else expr}}"');
				}
				pathBindings = current[9] && [[]];
				current[10] = markup.substring(current[10], index); // contentMarkup for block tag
				openTagName = current[11] || current[0] || syntaxError("Mismatched: " + all);
				// current[0] is tagName, but for {{else}} nodes, current[11] is tagName of preceding open tag
				current = stack.pop();
				content = current[2];
				block = true;
			}
			if (params) {
				// remove newlines from the params string, to avoid compiled code errors for unterminated strings
				parseParams(params.replace(rNewLine, " "), pathBindings, tmpl, isLinkExpr)
					.replace(rBuildHash, function(all, onerror, isCtxPrm, key, keyToken, keyValue, arg, param) {
						if (key === "this:") {
							keyValue = "undefined"; // this=some.path is always a to parameter (one-way), so don't need to compile/evaluate some.path initialization
						}
						if (param) {
							isLateOb = isLateOb || param[0] === "@";
						}
						key = "'" + keyToken + "':";
						if (arg) {
							args += isCtxPrm + keyValue + ",";
							paramsArgs += "'" + param + "',";
						} else if (isCtxPrm) { // Contextual parameter, ~foo=expr
							ctxProps += key + 'j._cp(' + keyValue + ',"' + param + '",view),';
							// Compiled code for evaluating tagCtx on a tag will have: ctx:{'foo':j._cp(compiledExpr, "expr", view)}
							paramsCtxProps += key + "'" + param + "',";
						} else if (onerror) {
							onError += keyValue;
						} else {
							if (keyToken === "trigger") {
								useTrigger += keyValue;
							}
							if (keyToken === "lateRender") {
								late = param !== "false"; // Render after first pass
							}
							props += key + keyValue + ",";
							paramsProps += key + "'" + param + "',";
							hasHandlers = hasHandlers || rHasHandlers.test(keyToken);
						}
						return "";
					}).slice(0, -1);
			}

			if (pathBindings && pathBindings[0]) {
				pathBindings.pop(); // Remove the binding that was prepared for next arg. (There is always an extra one ready).
			}

			newNode = [
					tagName,
					converter || !!convertBack || hasHandlers || "",
					block && [],
					parsedParam(paramsArgs || (tagName === ":" ? "'#data'," : ""), paramsProps, paramsCtxProps), // {{:}} equivalent to {{:#data}}
					parsedParam(args || (tagName === ":" ? "data," : ""), props, ctxProps),
					onError,
					useTrigger,
					late,
					isLateOb,
					pathBindings || 0
				];
			content.push(newNode);
			if (block) {
				stack.push(current);
				current = newNode;
				current[10] = loc; // Store current location of open tag, to be able to add contentMarkup when we reach closing tag
				current[11] = openTagName; // Used for checking syntax (matching close tag)
			}
		} else if (closeBlock) {
			blockTagCheck(closeBlock !== current[0] && closeBlock !== current[11] && closeBlock, current[0]); // Check matching close tag name
			current[10] = markup.substring(current[10], index); // contentMarkup for block tag
			current = stack.pop();
		}
		blockTagCheck(!current && closeBlock);
		content = current[2];
	}
	//==== /end of nested functions ====

	var i, result, newNode, hasHandlers, bindings,
		allowCode = $subSettings.allowCode || tmpl && tmpl.allowCode
			|| $viewsSettings.allowCode === true, // include direct setting of settings.allowCode true for backward compat only
		astTop = [],
		loc = 0,
		stack = [],
		content = astTop,
		current = [,,astTop];

	if (allowCode && tmpl._is) {
		tmpl.allowCode = allowCode;
	}

//TODO	result = tmplFnsCache[markup]; // Only cache if template is not named and markup length < ...,
//and there are no bindings or subtemplates?? Consider standard optimization for data-link="a.b.c"
//		if (result) {
//			tmpl.fn = result;
//		} else {

//		result = markup;
	if (isLinkExpr) {
		if (convertBack !== undefined) {
			markup = markup.slice(0, -convertBack.length - 2) + delimCloseChar0;
		}
		markup = delimOpenChar0 + markup + delimCloseChar1;
	}

	blockTagCheck(stack[0] && stack[0][2].pop()[0]);
	// Build the AST (abstract syntax tree) under astTop
	markup.replace(rTag, parseTag);

	pushprecedingContent(markup.length);

	if (loc = astTop[astTop.length - 1]) {
		blockTagCheck(typeof loc !== STRING && (+loc[10] === loc[10]) && loc[0]);
	}
//			result = tmplFnsCache[markup] = buildCode(astTop, tmpl);
//		}

	if (isLinkExpr) {
		result = buildCode(astTop, markup, isLinkExpr);
		bindings = [];
		i = astTop.length;
		while (i--) {
			bindings.unshift(astTop[i][9]); // With data-link expressions, pathBindings array for tagCtx[i] is astTop[i][9]
		}
		setPaths(result, bindings);
	} else {
		result = buildCode(astTop, tmpl);
	}
	return result;
}

function setPaths(fn, pathsArr) {
	var key, paths,
		i = 0,
		l = pathsArr.length;
	fn.deps = [];
	fn.paths = []; // The array of path binding (array/dictionary)s for each tag/else block's args and props
	for (; i < l; i++) {
		fn.paths.push(paths = pathsArr[i]);
		for (key in paths) {
			if (key !== "_jsvto" && paths.hasOwnProperty(key) && paths[key].length && !paths[key].skp) {
				fn.deps = fn.deps.concat(paths[key]); // deps is the concatenation of the paths arrays for the different bindings
			}
		}
	}
}

function parsedParam(args, props, ctx) {
	return [args.slice(0, -1), props.slice(0, -1), ctx.slice(0, -1)];
}

function paramStructure(paramCode, paramVals) {
	return '\n\tparams:{args:[' + paramCode[0] + '],\n\tprops:{' + paramCode[1] + '}'
		+ (paramCode[2] ? ',\n\tctx:{' + paramCode[2] + '}' : "")
		+ '},\n\targs:[' + paramVals[0] + '],\n\tprops:{' + paramVals[1] + '}'
		+ (paramVals[2] ? ',\n\tctx:{' + paramVals[2] + '}' : "");
}

function parseParams(params, pathBindings, tmpl, isLinkExpr) {

	function parseTokens(all, lftPrn0, lftPrn, bound, path, operator, err, eq, path2, late, prn,
												comma, lftPrn2, apos, quot, rtPrn, rtPrnDot, prn2, space, index, full) {
	// /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)(~?[\w$.^]+)?\s*((\+\+|--)|\+|-|~(?![\w$])|&&|\|\||===|!==|==|!=|<=|>=|[<>%*:?\/]|(=))\s*|(!*?(@)?[#~]?[\w$.^]+)([([])?)|(,\s*)|(?:(\()\s*)?\\?(?:(')|("))|(?:\s*(([)\]])(?=[.^]|\s*$|[^([])|[)\]])([([]?))|(\s+)/g,
	//lftPrn0           lftPrn         bound     path               operator     err                                          eq      path2 late            prn      comma  lftPrn2          apos quot        rtPrn  rtPrnDot                  prn2     space
	// (left paren? followed by (path? followed by operator) or (path followed by paren?)) or comma or apos or quot or right paren or space

		function parsePath(allPath, not, object, helper, view, viewProperty, pathTokens, leafToken) {
			// /^(!*?)(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
			//    not                               object     helper    view  viewProperty pathTokens      leafToken
			subPath = object === ".";
			if (object) {
				path = path.slice(not.length);
				if (/^\.?constructor$/.test(leafToken||path)) {
					syntaxError(allPath);
				}
				if (!subPath) {
					allPath = (late // late path @a.b.c: not throw on 'property of undefined' if a undefined, and will use _getOb() after linking to resolve late.
							? (isLinkExpr ? '' : '(ltOb.lt=ltOb.lt||') + '(ob='
							: ""
						)
						+ (helper
							? 'view.ctxPrm("' + helper + '")'
							: view
								? "view"
								: "data")
						+ (late
							? ')===undefined' + (isLinkExpr ? '' : ')') + '?"":view._getOb(ob,"'
							: ""
						)
						+ (leafToken
							? (viewProperty
								? "." + viewProperty
								: helper
									? ""
									: (view ? "" : "." + object)
								) + (pathTokens || "")
							: (leafToken = helper ? "" : view ? viewProperty || "" : object, ""));
					allPath = allPath + (leafToken ? "." + leafToken : "");

					allPath = not + (allPath.slice(0, 9) === "view.data"
						? allPath.slice(5) // convert #view.data... to data...
						: allPath)
					+ (late
							? (isLinkExpr ? '"': '",ltOb') + (prn ? ',1)':')')
							: ""
						);
				}
				if (bindings) {
					binds = named === "_linkTo" ? (bindto = pathBindings._jsvto = pathBindings._jsvto || []) : bndCtx.bd;
					if (theOb = subPath && binds[binds.length-1]) {
						if (theOb._cpfn) { // Computed property exprOb
							while (theOb.sb) {
								theOb = theOb.sb;
							}
							if (theOb.prm) {
								if (theOb.bnd) {
									path = "^" + path.slice(1);
								}
								theOb.sb = path;
								theOb.bnd = theOb.bnd || path[0] === "^";
							}
						}
					} else {
						binds.push(path);
					}
					if (prn && !subPath) {
						pathStart[fnDp] = ind;
						compiledPathStart[fnDp] = compiledPath[fnDp].length;
					}
				}
			}
			return allPath;
		}

		//bound = bindings && bound;
		if (bound && !eq) {
			path = bound + path; // e.g. some.fn(...)^some.path - so here path is "^some.path"
		}
		operator = operator || "";
		lftPrn2 = lftPrn2 || "";
		lftPrn = lftPrn || lftPrn0 || lftPrn2;
		path = path || path2;

		if (late && (late = !/\)|]/.test(full[index-1]))) {
			path = path.slice(1).split(".").join("^"); // Late path @z.b.c. Use "^" rather than "." to ensure that deep binding will be used
		}
		// Could do this - but not worth perf cost?? :-
		// if (!path.lastIndexOf("#data.", 0)) { path = path.slice(6); } // If path starts with "#data.", remove that.
		prn = prn || prn2 || "";
		var expr, binds, theOb, newOb, subPath, lftPrnFCall, ret,
			ind = index;

		if (!aposed && !quoted) {
			if (err) {
				syntaxError(params);
			}
			if (rtPrnDot && bindings) {
				// This is a binding to a path in which an object is returned by a helper/data function/expression, e.g. foo()^x.y or (a?b:c)^x.y
				// We create a compiled function to get the object instance (which will be called when the dependent data of the subexpression changes,
				// to return the new object, and trigger re-binding of the subsequent path)
				expr = pathStart[fnDp-1];
				if (full.length - 1 > ind - (expr || 0)) { // We need to compile a subexpression
					expr = $.trim(full.slice(expr, ind + all.length));
					binds = bindto || bndStack[fnDp-1].bd;
					// Insert exprOb object, to be used during binding to return the computed object
					theOb = binds[binds.length-1];
					if (theOb && theOb.prm) {
						while (theOb.sb && theOb.sb.prm) {
							theOb = theOb.sb;
						}
						newOb = theOb.sb = {path: theOb.sb, bnd: theOb.bnd};
					} else {
						binds.push(newOb = {path: binds.pop()}); // Insert exprOb object, to be used during binding to return the computed object
					}
					if (theOb && theOb.sb === newOb) {
						compiledPath[fnDp] = compiledPath[fnDp-1].slice(theOb._cpPthSt) + compiledPath[fnDp];
						compiledPath[fnDp-1] = compiledPath[fnDp-1].slice(0, theOb._cpPthSt);
					}
					newOb._cpPthSt = compiledPathStart[fnDp-1];
					newOb._cpKey = expr;

					compiledPath[fnDp] += full.slice(prevIndex, index);
					prevIndex = index;

					newOb._cpfn = cpFnStore[expr] = cpFnStore[expr] || // Compiled function for computed value: get from store, or compile and store
						new Function("data,view,j", // Compiled function for computed value in template
					"//" + expr + "\nvar v;\nreturn ((v=" + compiledPath[fnDp] + (rtPrn === "]" ? ")]" : rtPrn) + ")!=null?v:null);");

					compiledPath[fnDp-1] += (fnCall[prnDp] && $subSettingsAdvanced.cache ? "view.getCache(\"" + expr.replace(rEscapeQuotes, "\\$&") + "\"" : compiledPath[fnDp]);

					newOb.prm = bndCtx.bd;
					newOb.bnd = newOb.bnd || newOb.path && newOb.path.indexOf("^") >= 0;
				}
				compiledPath[fnDp] = "";
			}
			if (prn === "[") {
				prn = "[j._sq(";
			}
			if (lftPrn === "[") {
				lftPrn = "[j._sq(";
			}
		}
		ret = (aposed
			// within single-quoted string
			? (aposed = !apos, (aposed ? all : lftPrn2 + '"'))
			: quoted
			// within double-quoted string
				? (quoted = !quot, (quoted ? all : lftPrn2 + '"'))
				:
			(
				(lftPrn
					? (
						prnStack[++prnDp] = true,
						prnInd[prnDp] = 0,
						bindings && (
							pathStart[fnDp++] = ind++,
							bndCtx = bndStack[fnDp] = {bd: []},
							compiledPath[fnDp] = "",
							compiledPathStart[fnDp] = 1
						),
						lftPrn) // Left paren, (not a function call paren)
					: "")
				+ (space
					? (prnDp
						? "" // A space within parens or within function call parens, so not a separator for tag args
			// New arg or prop - so insert backspace \b (\x08) as separator for named params, used subsequently by rBuildHash, and prepare new bindings array
						: (paramIndex = full.slice(paramIndex, ind), named
							? (named = boundName = bindto = false, "\b")
							: "\b,") + paramIndex + (paramIndex = ind + all.length, bindings && pathBindings.push(bndCtx.bd = []), "\b")
					)
					: eq
			// named param. Remove bindings for arg and create instead bindings array for prop
						? (fnDp && syntaxError(params), bindings && pathBindings.pop(), named = "_" + path, boundName = bound, paramIndex = ind + all.length,
								bindings && ((bindings = bndCtx.bd = pathBindings[named] = []), bindings.skp = !bound), path + ':')
						: path
			// path
							? (path.split("^").join(".").replace($sub.rPath, parsePath)
								+ (prn || operator)
							)
							: operator
			// operator
								? operator
								: rtPrn
			// function
									? rtPrn === "]" ? ")]" : ")"
									: comma
										? (fnCall[prnDp] || syntaxError(params), ",") // We don't allow top-level literal arrays or objects
										: lftPrn0
											? ""
											: (aposed = apos, quoted = quot, '"')
			))
		);

		if (!aposed && !quoted) {
			if (rtPrn) {
				fnCall[prnDp] = false;
				prnDp--;
			}
		}

		if (bindings) {
			if (!aposed && !quoted) {
				if (rtPrn) {
					if (prnStack[prnDp+1]) {
						bndCtx = bndStack[--fnDp];
						prnStack[prnDp+1] = false;
					}
					prnStart = prnInd[prnDp+1];
				}
				if (prn) {
					prnInd[prnDp+1] = compiledPath[fnDp].length + (lftPrn ? 1 : 0);
					if (path || rtPrn) {
						bndCtx = bndStack[++fnDp] = {bd: []};
						prnStack[prnDp+1] = true;
					}
				}
			}

			compiledPath[fnDp] = (compiledPath[fnDp]||"") + full.slice(prevIndex, index);
			prevIndex = index+all.length;

			if (!aposed && !quoted) {
				if (lftPrnFCall = lftPrn && prnStack[prnDp+1]) {
					compiledPath[fnDp-1] += lftPrn;
					compiledPathStart[fnDp-1]++;
				}
				if (prn === "(" && subPath && !newOb) {
					compiledPath[fnDp] = compiledPath[fnDp-1].slice(prnStart) + compiledPath[fnDp];
					compiledPath[fnDp-1] = compiledPath[fnDp-1].slice(0, prnStart);
				}
			}
			compiledPath[fnDp] += lftPrnFCall ? ret.slice(1) : ret;
		}

		if (!aposed && !quoted && prn) {
			prnDp++;
			if (path && prn === "(") {
				fnCall[prnDp] = true;
			}
		}

		if (!aposed && !quoted && prn2) {
			if (bindings) {
				compiledPath[fnDp] += prn;
			}
			ret += prn;
		}
		return ret;
	}

	var named, bindto, boundName, result,
		quoted, // boolean for string content in double quotes
		aposed, // or in single quotes
		bindings = pathBindings && pathBindings[0], // bindings array for the first arg
		bndCtx = {bd: bindings},
		bndStack = {0: bndCtx},
		paramIndex = 0, // list,
		// The following are used for tracking path parsing including nested paths, such as "a.b(c^d + (e))^f", and chained computed paths such as
		// "a.b().c^d().e.f().g" - which has four chained paths, "a.b()", "^c.d()", ".e.f()" and ".g"
		prnDp = 0,     // For tracking paren depth (not function call parens)
		fnDp = 0,      // For tracking depth of function call parens
		prnInd = {},   // We are in a function call
		prnStart = 0,  // tracks the start of the current path such as c^d() in the above example
		prnStack = {}, // tracks parens which are not function calls, and so are associated with new bndStack contexts
		fnCall = {},   // We are in a function call
		pathStart = {},// tracks the start of the current path such as c^d() in the above example
		compiledPathStart = {0: 0},
		compiledPath = {0:""},
		prevIndex = 0;

	if (params[0] === "@") {
		params = params.replace(rBracketQuote, ".");
	}
	result = (params + (tmpl ? " " : "")).replace($sub.rPrm, parseTokens);

	if (bindings) {
		result = compiledPath[0];
	}

	return !prnDp && result || syntaxError(params); // Syntax error if unbalanced parens in params expression
}

function buildCode(ast, tmpl, isLinkExpr) {
	// Build the template function code from the AST nodes, and set as property on the passed-in template object
	// Used for compiling templates, and also by JsViews to build functions for data link expressions
	var i, node, tagName, converter, tagCtx, hasTag, hasEncoder, getsVal, hasCnvt, useCnvt, tmplBindings, pathBindings, params, boundOnErrStart,
		boundOnErrEnd, tagRender, nestedTmpls, tmplName, nestedTmpl, tagAndElses, content, markup, nextIsElse, oldCode, isElse, isGetVal, tagCtxFn,
		onError, tagStart, trigger, lateRender, retStrOpen, retStrClose,
		tmplBindingKey = 0,
		useViews = $subSettingsAdvanced.useViews || tmpl.useViews || tmpl.tags || tmpl.templates || tmpl.helpers || tmpl.converters,
		code = "",
		tmplOptions = {},
		l = ast.length;

	if (typeof tmpl === STRING) {
		tmplName = isLinkExpr ? 'data-link="' + tmpl.replace(rNewLine, " ").slice(1, -1) + '"' : tmpl;
		tmpl = 0;
	} else {
		tmplName = tmpl.tmplName || "unnamed";
		if (tmpl.allowCode) {
			tmplOptions.allowCode = true;
		}
		if (tmpl.debug) {
			tmplOptions.debug = true;
		}
		tmplBindings = tmpl.bnds;
		nestedTmpls = tmpl.tmpls;
	}
	for (i = 0; i < l; i++) {
		// AST nodes: [0: tagName, 1: converter, 2: content, 3: params, 4: code, 5: onError, 6: trigger, 7:pathBindings, 8: contentMarkup]
		node = ast[i];

		// Add newline for each callout to t() c() etc. and each markup string
		if (typeof node === STRING) {
			// a markup string to be inserted
			code += '+"' + node + '"';
		} else {
			// a compiled tag expression to be inserted
			tagName = node[0];
			if (tagName === "*") {
				// Code tag: {{* }}
				code += ";\n" + node[1] + "\nret=ret";
			} else {
				converter = node[1];
				content = !isLinkExpr && node[2];
				tagCtx = paramStructure(node[3], params = node[4]);
				trigger = node[6];
				lateRender = node[7];
				if (node[8]) { // latePath @a.b.c or @~a.b.c
					retStrOpen = "\nvar ob,ltOb={},ctxs=";
					retStrClose = ";\nctxs.lt=ltOb.lt;\nreturn ctxs;";
				} else {
					retStrOpen = "\nreturn ";
					retStrClose = "";
				}
				markup = node[10] && node[10].replace(rUnescapeQuotes, "$1");
				if (isElse = tagName === "else") {
					if (pathBindings) {
						pathBindings.push(node[9]);
					}
				} else {
					onError = node[5] || $subSettings.debugMode !== false && "undefined"; // If debugMode not false, set default onError handler on tag to "undefined" (see onRenderError)
					if (tmplBindings && (pathBindings = node[9])) { // Array of paths, or false if not data-bound
						pathBindings = [pathBindings];
						tmplBindingKey = tmplBindings.push(1); // Add placeholder in tmplBindings for compiled function
					}
				}
				useViews = useViews || params[1] || params[2] || pathBindings || /view.(?!index)/.test(params[0]);
				// useViews is for perf optimization. For render() we only use views if necessary - for the more advanced scenarios.
				// We use views if there are props, contextual properties or args with #... (other than #index) - but you can force
				// using the full view infrastructure, (and pay a perf price) by opting in: Set useViews: true on the template, manually...
				if (isGetVal = tagName === ":") {
					if (converter) {
						tagName = converter === HTML ? ">" : converter + tagName;
					}
				} else {
					if (content) { // TODO optimize - if content.length === 0 or if there is a tmpl="..." specified - set content to null / don't run this compilation code - since content won't get used!!
						// Create template object for nested template
						nestedTmpl = tmplObject(markup, tmplOptions);
						nestedTmpl.tmplName = tmplName + "/" + tagName;
						// Compile to AST and then to compiled function
						nestedTmpl.useViews = nestedTmpl.useViews || useViews;
						buildCode(content, nestedTmpl);
						useViews = nestedTmpl.useViews;
						nestedTmpls.push(nestedTmpl);
					}

					if (!isElse) {
						// This is not an else tag.
						tagAndElses = tagName;
						useViews = useViews || tagName && (!$tags[tagName] || !$tags[tagName].flow);
						// Switch to a new code string for this bound tag (and its elses, if it has any) - for returning the tagCtxs array
						oldCode = code;
						code = "";
					}
					nextIsElse = ast[i + 1];
					nextIsElse = nextIsElse && nextIsElse[0] === "else";
				}
				tagStart = onError ? ";\ntry{\nret+=" : "\n+";
				boundOnErrStart = "";
				boundOnErrEnd = "";

				if (isGetVal && (pathBindings || trigger || converter && converter !== HTML || lateRender)) {
					// For convertVal we need a compiled function to return the new tagCtx(s)
					tagCtxFn = new Function("data,view,j", "// " + tmplName + " " + (++tmplBindingKey) + " " + tagName
						+ retStrOpen + "{" + tagCtx + "};" + retStrClose);
					tagCtxFn._er = onError;
					tagCtxFn._tag = tagName;
					tagCtxFn._bd = !!pathBindings; // data-linked tag {^{.../}}
					tagCtxFn._lr = lateRender;

					if (isLinkExpr) {
						return tagCtxFn;
					}

					setPaths(tagCtxFn, pathBindings);
					tagRender = 'c("' + converter + '",view,';
					useCnvt = true;
					boundOnErrStart = tagRender + tmplBindingKey + ",";
					boundOnErrEnd = ")";
				}
				code += (isGetVal
					? (isLinkExpr ? (onError ? "try{\n" : "") + "return " : tagStart) + (useCnvt // Call _cnvt if there is a converter: {{cnvt: ... }} or {^{cnvt: ... }}
						? (useCnvt = undefined, useViews = hasCnvt = true, tagRender + (tagCtxFn
							? ((tmplBindings[tmplBindingKey - 1] = tagCtxFn), tmplBindingKey) // Store the compiled tagCtxFn in tmpl.bnds, and pass the key to convertVal()
							: "{" + tagCtx + "}") + ")")
						: tagName === ">"
							? (hasEncoder = true, "h(" + params[0] + ")")
							: (getsVal = true, "((v=" + params[0] + ')!=null?v:' + (isLinkExpr ? 'null)' : '"")'))
							// Non strict equality so data-link="title{:expr}" with expr=null/undefined removes title attribute
					)
					: (hasTag = true, "\n{view:view,content:false,tmpl:" // Add this tagCtx to the compiled code for the tagCtxs to be passed to renderTag()
						+ (content ? nestedTmpls.length : "false") + "," // For block tags, pass in the key (nestedTmpls.length) to the nested content template
						+ tagCtx + "},"));

				if (tagAndElses && !nextIsElse) {
					// This is a data-link expression or an inline tag without any elses, or the last {{else}} of an inline tag
					// We complete the code for returning the tagCtxs array
					code = "[" + code.slice(0, -1) + "]";
					tagRender = 't("' + tagAndElses + '",view,this,';
					if (isLinkExpr || pathBindings) {
						// This is a bound tag (data-link expression or inline bound tag {^{tag ...}}) so we store a compiled tagCtxs function in tmp.bnds
						code = new Function("data,view,j", " // " + tmplName + " " + tmplBindingKey + " " + tagAndElses + retStrOpen + code
							+ retStrClose);
						code._er = onError;
						code._tag = tagAndElses;
						if (pathBindings) {
							setPaths(tmplBindings[tmplBindingKey - 1] = code, pathBindings);
						}
						code._lr = lateRender;
						if (isLinkExpr) {
							return code; // For a data-link expression we return the compiled tagCtxs function
						}
						boundOnErrStart = tagRender + tmplBindingKey + ",undefined,";
						boundOnErrEnd = ")";
					}

					// This is the last {{else}} for an inline tag.
					// For a bound tag, pass the tagCtxs fn lookup key to renderTag.
					// For an unbound tag, include the code directly for evaluating tagCtxs array
					code = oldCode + tagStart + tagRender + (pathBindings && tmplBindingKey || code) + ")";
					pathBindings = 0;
					tagAndElses = 0;
				}
				if (onError && !nextIsElse) {
					useViews = true;
					code += ';\n}catch(e){ret' + (isLinkExpr ? "urn " : "+=") + boundOnErrStart + 'j._err(e,view,' + onError + ')' + boundOnErrEnd + ';}' + (isLinkExpr ? "" : '\nret=ret');
				}
			}
		}
	}
	// Include only the var references that are needed in the code
	code = "// " + tmplName
		+ (tmplOptions.debug ? "\ndebugger;" : "")
		+ "\nvar v"
		+ (hasTag ? ",t=j._tag" : "")                // has tag
		+ (hasCnvt ? ",c=j._cnvt" : "")              // converter
		+ (hasEncoder ? ",h=j._html" : "")           // html converter
		+ (isLinkExpr
				? (node[8] // late @... path?
						? ", ob"
						: ""
					) + ";\n"
				: ',ret=""')
		+ code
		+ (isLinkExpr ? "\n" : ";\nreturn ret;");

	try {
		code = new Function("data,view,j", code);
	} catch (e) {
		syntaxError("Compiled template code:\n\n" + code + '\n: "' + (e.message||e) + '"');
	}
	if (tmpl) {
		tmpl.fn = code;
		tmpl.useViews = !!useViews;
	}
	return code;
}

//==========
// Utilities
//==========

// Merge objects, in particular contexts which inherit from parent contexts
function extendCtx(context, parentContext) {
	// Return copy of parentContext, unless context is defined and is different, in which case return a new merged context
	// If neither context nor parentContext are defined, return undefined
	return context && context !== parentContext
		? (parentContext
			? $extend($extend({}, parentContext), context)
			: context)
		: parentContext && $extend({}, parentContext);
}

function getTargetProps(source, tagCtx) {
	// this pointer is theMap - which has tagCtx.props too
	// arguments: tagCtx.args.
	var key, prop,
		map = tagCtx.map,
		propsArr = map && map.propsArr;

	if (!propsArr) { // map.propsArr is the full array of {key:..., prop:...} objects
		propsArr = [];
		if (typeof source === OBJECT || $isFunction(source)) {
			for (key in source) {
				prop = source[key];
				if (key !== $expando && source.hasOwnProperty(key) && (!tagCtx.props.noFunctions || !$.isFunction(prop))) {
					propsArr.push({key: key, prop: prop});
				}
			}
		}
		if (map) {
			map.propsArr = map.options && propsArr; // If bound {^{props}} and not isRenderCall, store propsArr on map (map.options is defined only for bound, && !isRenderCall)
		}
	}
	return getTargetSorted(propsArr, tagCtx); // Obtains map.tgt, by filtering, sorting and splicing the full propsArr
}

function getTargetSorted(value, tagCtx) {
	// getTgt
	var mapped, start, end,
		tag = tagCtx.tag,
		props = tagCtx.props,
		propParams = tagCtx.params.props,
		filter = props.filter,
		sort = props.sort,
		directSort = sort === true,
		step = parseInt(props.step),
		reverse = props.reverse ? -1 : 1;

	if (!$isArray(value)) {
		return value;
	}
	if (directSort || sort && typeof sort === STRING) {
		// Temporary mapped array holds objects with index and sort-value
		mapped = value.map(function(item, i) {
			item = directSort ? item : getPathObject(item, sort);
			return {i: i, v: typeof item === STRING ? item.toLowerCase() : item};
		});
		// Sort mapped array
		mapped.sort(function(a, b) {
			return a.v > b.v ? reverse : a.v < b.v ? -reverse : 0;
		});
		// Map to new array with resulting order
		value = mapped.map(function(item){
			return value[item.i];
		});
	} else if ((sort || reverse < 0) && !tag.dataMap) {
		value = value.slice(); // Clone array first if not already a new array
	}
	if ($isFunction(sort)) {
		value = value.sort(function() { // Wrap the sort function to provide tagCtx as 'this' pointer
			return sort.apply(tagCtx, arguments);
		});
	}
	if (reverse < 0 && (!sort || $isFunction(sort))) { // Reverse result if not already reversed in sort
		value = value.reverse();
	}

	if (value.filter && filter) { // IE8 does not support filter
		value = value.filter(filter, tagCtx);
		if (tagCtx.tag.onFilter) {
			tagCtx.tag.onFilter(tagCtx);
		}
	}

	if (propParams.sorted) {
		mapped = (sort || reverse < 0) ? value : value.slice();
		if (tag.sorted) {
			$.observable(tag.sorted).refresh(mapped); // Note that this might cause the start and end props to be modified - e.g. by pager tag control
		} else {
			tagCtx.map.sorted = mapped;
		}
	}

	start = props.start; // Get current value - after possible changes triggered by tag.sorted refresh() above
	end = props.end;
	if (propParams.start && start === undefined || propParams.end && end === undefined) {
		start = end = 0;
	}
	if (!isNaN(start) || !isNaN(end)) { // start or end specified, but not the auto-create Number array scenario of {{for start=xxx end=yyy}}
		start = +start || 0;
		end = end === undefined || end > value.length ? value.length : +end;
		value = value.slice(start, end);
	}
	if (step > 1) {
		start = 0;
		end = value.length;
		mapped = [];
		for (; start<end; start+=step) {
			mapped.push(value[start]);
		}
		value = mapped;
	}
	if (propParams.paged && tag.paged) {
		$observable(tag.paged).refresh(value);
	}

	return value;
}

/** Render the template as a string, using the specified data and helpers/context
* $("#tmpl").render()
*
* @param {any}        data
* @param {hash}       [helpersOrContext]
* @param {boolean}    [noIteration]
* @returns {string}   rendered template
*/
function $fnRender(data, context, noIteration) {
	var tmplElem = this.jquery && (this[0] || error('Unknown template')), // Targeted element not found for jQuery template selector such as "#myTmpl"
		tmpl = tmplElem.getAttribute(tmplAttr);

	return renderContent.call(tmpl && $.data(tmplElem)[jsvTmpl] || $templates(tmplElem),
		data, context, noIteration);
}

//========================== Register converters ==========================

function getCharEntity(ch) {
	// Get character entity for HTML, Attribute and optional data encoding
	return charEntities[ch] || (charEntities[ch] = "&#" + ch.charCodeAt(0) + ";");
}

function getCharFromEntity(match, token) {
	// Get character from HTML entity, for optional data unencoding
	return charsFromEntities[token] || "";
}

function htmlEncode(text) {
	// HTML encode: Replace < > & ' " ` etc. by corresponding entities.
	return text != undefined ? rIsHtml.test(text) && ("" + text).replace(rHtmlEncode, getCharEntity) || text : "";
}

function dataEncode(text) {
	// Encode just < > and & - intended for 'safe data' along with {{:}} rather than {{>}}
  return typeof text === STRING ? text.replace(rDataEncode, getCharEntity) : text;
}

function dataUnencode(text) {
  // Unencode just < > and & - intended for 'safe data' along with {{:}} rather than {{>}}
  return  typeof text === STRING ? text.replace(rDataUnencode, getCharFromEntity) : text;
}

//========================== Initialize ==========================

$sub = $views.sub;
$viewsSettings = $views.settings;

if (!(jsr || $ && $.render)) {
	// JsRender/JsViews not already loaded (or loaded without jQuery, and we are now moving from jsrender namespace to jQuery namepace)
	for (jsvStoreName in jsvStores) {
		registerStore(jsvStoreName, jsvStores[jsvStoreName]);
	}

	$converters = $views.converters;
	$helpers = $views.helpers;
	$tags = $views.tags;

	$sub._tg.prototype = {
		baseApply: baseApply,
		cvtArgs: convertArgs,
		bndArgs: convertBoundArgs,
		ctxPrm: contextParameter
	};

	topView = $sub.topView = new View();

	//BROWSER-SPECIFIC CODE
	if ($) {

		////////////////////////////////////////////////////////////////////////////////////////////////
		// jQuery (= $) is loaded

		$.fn.render = $fnRender;
		$expando = $.expando;
		if ($.observable) {
			if (versionNumber !== (versionNumber = $.views.jsviews)) {
				// Different version of jsRender was loaded
				throw "jquery.observable.js requires jsrender.js " + versionNumber;
			}
			$extend($sub, $.views.sub); // jquery.observable.js was loaded before jsrender.js
			$views.map = $.views.map;
		}

	} else {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// jQuery is not loaded.

		$ = {};

		if (setGlobals) {
			global.jsrender = $; // We are loading jsrender.js from a script element, not AMD or CommonJS, so set global
		}

		// Error warning if jsrender.js is used as template engine on Node.js (e.g. Express or Hapi...)
		// Use jsrender-node.js instead...
		$.renderFile = $.__express = $.compile = function() { throw "Node.js: use npm jsrender, or jsrender-node.js"; };

		//END BROWSER-SPECIFIC CODE
		$.isFunction = function(ob) {
			return typeof ob === "function";
		};

		$.isArray = Array.isArray || function(obj) {
			return ({}.toString).call(obj) === "[object Array]";
		};

		$sub._jq = function(jq) { // private method to move from JsRender APIs from jsrender namespace to jQuery namespace
			if (jq !== $) {
				$extend(jq, $); // map over from jsrender namespace to jQuery namespace
				$ = jq;
				$.fn.render = $fnRender;
				delete $.jsrender;
				$expando = $.expando;
			}
		};

		$.jsrender = versionNumber;
	}
	$subSettings = $sub.settings;
	$subSettings.allowCode = false;
	$isFunction = $.isFunction;
	$.render = $render;
	$.views = $views;
	$.templates = $templates = $views.templates;

	for (setting in $subSettings) {
		addSetting(setting);
	}

	/**
	* $.views.settings.debugMode(true)
	* @param {boolean} debugMode
	* @returns {Settings}
	*
	* debugMode = $.views.settings.debugMode()
	* @returns {boolean}
	*/
	($viewsSettings.debugMode = function(debugMode) {
		return debugMode === undefined
			? $subSettings.debugMode
			: (
				$subSettings._clFns && $subSettings._clFns(), // Clear linkExprStore (cached compiled expressions), since debugMode setting affects compilation for expressions
				$subSettings.debugMode = debugMode,
				$subSettings.onError = typeof debugMode === STRING
					? function() { return debugMode; }
					: $isFunction(debugMode)
						? debugMode
						: undefined,
				$viewsSettings);
	})(false); // jshint ignore:line

	$subSettingsAdvanced = $subSettings.advanced = {
		cache: true, // By default use cached values of computed values (Otherwise, set advanced cache setting to false)
		useViews: false,
		_jsv: false // For global access to JsViews store
	};

	//========================== Register tags ==========================

	$tags({
		"if": {
			render: function(val) {
				// This function is called once for {{if}} and once for each {{else}}.
				// We will use the tag.rendering object for carrying rendering state across the calls.
				// If not done (a previous block has not been rendered), look at expression for this block and render the block if expression is truthy
				// Otherwise return ""
				var self = this,
					tagCtx = self.tagCtx,
					ret = (self.rendering.done || !val && (tagCtx.args.length || !tagCtx.index))
						? ""
						: (self.rendering.done = true,
							self.selected = tagCtx.index,
							undefined); // Test is satisfied, so render content on current context
				return ret;
			},
			contentCtx: true, // Inherit parent view data context
			flow: true
		},
		"for": {
			sortDataMap: dataMap(getTargetSorted),
			init: function(val, cloned) {
				this.setDataMap(this.tagCtxs);
			},
			render: function(val) {
				// This function is called once for {{for}} and once for each {{else}}.
				// We will use the tag.rendering object for carrying rendering state across the calls.
				var value, filter, srtField, isArray, i, sorted, end, step,
					self = this,
					tagCtx = self.tagCtx,
					range = tagCtx.argDefault === false,
					props = tagCtx.props,
					iterate = range || tagCtx.args.length, // Not final else and not auto-create range
					result = "",
					done = 0;

				if (!self.rendering.done) {
					value = iterate ? val : tagCtx.view.data; // For the final else, defaults to current data without iteration.

					if (range) {
						range = props.reverse ? "unshift" : "push";
						end = +props.end;
						step = +props.step || 1;
						value = []; // auto-create integer array scenario of {{for start=xxx end=yyy}}
						for (i = +props.start || 0; (end - i) * step > 0; i += step) {
							value[range](i);
						}
					}
					if (value !== undefined) {
						isArray = $isArray(value);
						result += tagCtx.render(value, !iterate || props.noIteration);
						// Iterates if data is an array, except on final else - or if noIteration property
						// set to true. (Use {{include}} to compose templates without array iteration)
						done += isArray ? value.length : 1;
					}
					if (self.rendering.done = done) {
						self.selected = tagCtx.index;
					}
					// If nothing was rendered we will look at the next {{else}}. Otherwise, we are done.
				}
				return result;
			},
			setDataMap: function(tagCtxs) {
				var tagCtx, props, paramsProps,
					self = this,
					l = tagCtxs.length;
				while (l--) {
					tagCtx = tagCtxs[l];
					props = tagCtx.props;
					paramsProps = tagCtx.params.props;
					tagCtx.argDefault = props.end === undefined || tagCtx.args.length > 0; // Default to #data except for auto-create range scenario {{for start=xxx end=yyy step=zzz}}
					props.dataMap = (tagCtx.argDefault !== false && $isArray(tagCtx.args[0]) &&
						(paramsProps.sort || paramsProps.start || paramsProps.end || paramsProps.step || paramsProps.filter || paramsProps.reverse
						|| props.sort || props.start || props.end || props.step || props.filter || props.reverse))
						&& self.sortDataMap;
				}
			},
			flow: true
		},
		props: {
			baseTag: "for",
			dataMap: dataMap(getTargetProps),
			init: noop, // Don't execute the base init() of the "for" tag
			flow: true
		},
		include: {
			flow: true
		},
		"*": {
			// {{* code... }} - Ignored if template.allowCode and $.views.settings.allowCode are false. Otherwise include code in compiled template
			render: retVal,
			flow: true
		},
		":*": {
			// {{:* returnedExpression }} - Ignored if template.allowCode and $.views.settings.allowCode are false. Otherwise include code in compiled template
			render: retVal,
			flow: true
		},
		dbg: $helpers.dbg = $converters.dbg = dbgBreak // Register {{dbg/}}, {{dbg:...}} and ~dbg() to throw and catch, as breakpoints for debugging.
	});

	$converters({
		html: htmlEncode,
		attr: htmlEncode, // Includes > encoding since rConvertMarkers in JsViews does not skip > characters in attribute strings
		encode: dataEncode,
		unencode: dataUnencode, // Includes > encoding since rConvertMarkers in JsViews does not skip > characters in attribute strings
		url: function(text) {
			// URL encoding helper.
			return text != undefined ? encodeURI("" + text) : text === null ? text : ""; // null returns null, e.g. to remove attribute. undefined returns ""
		}
	});
}
//========================== Define default delimiters ==========================
$subSettings = $sub.settings;
$isArray = ($||jsr).isArray;
$viewsSettings.delimiters("{{", "}}", "^");

if (jsrToJq) { // Moving from jsrender namespace to jQuery namepace - copy over the stored items (templates, converters, helpers...)
	jsr.views.sub._jq($);
}
return $ || jsr;
}, window));


/***/ }),

/***/ "./resources/assets/css/invoice-pdf.scss":
/*!***********************************************!*\
  !*** ./resources/assets/css/invoice-pdf.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/assets/css/phone-number-dark.scss":
/*!*****************************************************!*\
  !*** ./resources/assets/css/phone-number-dark.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/assets/css/main.scss":
/*!****************************************!*\
  !*** ./resources/assets/css/main.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/assets/css/invoice-template-dark.scss":
/*!*********************************************************!*\
  !*** ./resources/assets/css/invoice-template-dark.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/assets/js/pages": 0,
/******/ 			"assets/css/page": 0,
/******/ 			"assets/css/invoice-template-dark-mode": 0,
/******/ 			"assets/css/phone-number-dark": 0,
/******/ 			"assets/css/invoice-pdf": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/flatpickr_localization.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/turbo.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/custom/helpers.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/custom/custom.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/dashboard/dashboard.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/users/users.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/users/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/category/category.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/expense_category/expense_category.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/expense/expense.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/customer/customer.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/customer/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/base-unit/base-unit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/unit/unit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/adjustment/adjustment.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/adjustment/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/brand/brand.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/custom/phone-number-country-code.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client/client.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/product/product.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/product/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/invoice/invoice.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/invoice/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/quote/quote.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/purchase/purchase.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/purchase-return/purchase-return.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/sale/sale.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/quote/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/warehouse/warehouse.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/warehouse/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/settings/setting.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/tax/tax.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/currency/currency.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/users/user-profile.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/sidebar_menu_search/sidebar_menu_search.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/invoice/invoice_payment_history.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client_panel/invoice/invoice.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/transaction/transaction.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/transfer/transfer.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client_panel/transaction/transaction.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/settings/invoice-template.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client/invoice.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/invoice/invoice_send.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/payment/payment.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/payment_qr_code/payment-qr-code.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/account/account.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscription_plans/subscription_plan.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscription_plans/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscription_plans/plan_features.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscriptions/admin-free-subscription.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscriptions/free-subscription.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscriptions/payment-message.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscriptions/subscription.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscriptions/subscriptions-transactions.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/faqs/faqs.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/contact_enquiry/contact_enquiry.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin_testimonial/testimonial.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/languageChange/languageChange.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin_enquiry/super_admin_enquiry.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin_settings/setting.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin_settings/new-user-setting.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin_dashboard/dashboard.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/subscribe/subscribe.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/supplier/supplier.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/supplier/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/jquery.toast.min.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin_currency/currency.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/super_admin/super-admin.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client_panel/quotes/quote.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/js/client_panel/quotes/create-edit.js")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/css/invoice-pdf.scss")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/css/phone-number-dark.scss")))
/******/ 	__webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/css/main.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["assets/css/page","assets/css/invoice-template-dark-mode","assets/css/phone-number-dark","assets/css/invoice-pdf"], () => (__webpack_require__("./resources/assets/css/invoice-template-dark.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;