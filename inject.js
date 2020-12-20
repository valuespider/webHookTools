const script = document.createElement('script');

function core(e, window) {
    var globalConfig = e;
    console.log("inject start!", e)

    if (e["config-hook-debugger"]) {

        function Closure(injectFunction) {
            return function () {
                if (!arguments.length)
                    return injectFunction.apply(this, arguments)
                    arguments[arguments.length - 1] = arguments[arguments.length - 1].replace(/debugger/g, "");
                return injectFunction.apply(this, arguments)
            }
        }

        var oldFunctionConstructor = window.Function.prototype.constructor;
        window.Function.prototype.constructor = Closure(oldFunctionConstructor)
            //fix native function
            window.Function.prototype.constructor.toString = oldFunctionConstructor.toString.bind(oldFunctionConstructor);

        var oldFunction = Function;
        window.Function = Closure(oldFunction)
            //fix native function
            window.Function.toString = oldFunction.toString.bind(oldFunction);

        var oldEval = eval;
        window.eval = Closure(oldEval)
            //fix native function
            window.eval.toString = oldEval.toString.bind(oldEval);

        // hook GeneratorFunction
        var oldGeneratorFunctionConstructor = Object.getPrototypeOf(function  * () {}).constructor
            var newGeneratorFunctionConstructor = Closure(oldGeneratorFunctionConstructor)
            newGeneratorFunctionConstructor.toString = oldGeneratorFunctionConstructor.toString.bind(oldGeneratorFunctionConstructor);
        Object.defineProperty(oldGeneratorFunctionConstructor.prototype, "constructor", {
            value: newGeneratorFunctionConstructor,
            writable: false,
            configurable: true
        })

        // hook Async Function
        var oldAsyncFunctionConstructor = Object.getPrototypeOf(async function () {}).constructor
            var newAsyncFunctionConstructor = Closure(oldAsyncFunctionConstructor)
            newAsyncFunctionConstructor.toString = oldAsyncFunctionConstructor.toString.bind(oldAsyncFunctionConstructor);
        Object.defineProperty(oldAsyncFunctionConstructor.prototype, "constructor", {
            value: newAsyncFunctionConstructor,
            writable: false,
            configurable: true
        })

        // hook dom
        var oldSetAttribute = window.Element.prototype.setAttribute;
        window.Element.prototype.setAttribute = function (name, value) {
            if (typeof value == "string")
                value = value.replace(/debugger/g, "")
                    // 向上调用
                    oldSetAttribute.call(this, name, value)
        };
        var oldContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow").get
            Object.defineProperty(window.HTMLIFrameElement.prototype, "contentWindow", {
            get() {
                var newV = oldContentWindow.call(this)
                    if (!newV.inject) {
                        newV.inject = true;
                        core.call(newV, globalConfig, newV);
                    }
                    return newV
            }
        })

    }
    if (e["config-hook-pushState"]) {
        // hook pushState
        var oldHistoryPushState = history.pushState;
        var pushState = {};

        history.pushState = function () {
            // anti-shake filtering high frequency operation
            if (new Date() - pushState.lastTime > 200) {
                pushState.count = 0;
            }
            pushState.count++;
            if (pushState.count > 3)
                return;
            return oldHistoryPushState.apply(this, arguments)
        };
        history.pushState.toString = oldHistoryPushState.toString.bind(oldHistoryPushState)
    }
    if (e["config-hook-regExp"]) {
        // hook RegExp
        var oldRegExp = RegExp;
        RegExp = new Proxy(RegExp, {
            apply(target, thisArgument, argumentsList) {
                console.log("Some codes are setting RegExp...");
                debugger;
                // prevent detection of formatting
                if (argumentsList[0] == `\\w+ *\\(\\) *{\\w+ *['|"].+['|"];? *}`) {
                    return Reflect.apply(target, thisArgument, [""])
                }
                return Reflect.apply(target, thisArgument, argumentsList)
            }
        });
        RegExp.toString = oldRegExp.toString.bind(oldRegExp)
    }
    if (e["config-hook-console"]) {
        // hook console
        var oldConsole = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "table", "trace", "group", "groupCollapsed", "groupEnd", "clear", "count", "countReset", "assert", "profile", "profileEnd", "time", "timeLog", "timeEnd", "timeStamp", "context", "memory"].map(key => {
            var old = console[key];
            console[key] = function () {};
            console[key].toString = old.toString.bind(old)
                return old;
        })
    }
    if (e["config-hook-setcookie"]) {
        (function () {
            'use strict';
            var pre = document.cookie;
            Object.defineProperty(document, 'cookie', {
                get: function () {
                    console.log('Getting document.cookie')
                    return pre;

                },
                set: function (val) {
                    console.log('Setting document.cookie', val);
                    debugger;
                    pre = val

                }
            })
        })();
    }
    if (e["config-fuck-sojson"]) {
        (function () {
            var setInterval_ = setInterval;
            setInterval = function () {};
            setInterval.toString = function () {
                console.log("有函数正在检测setInterval是否被hook");
                return setInterval_.toString();
            };
        })();

        (function () {
            var _RegExp = RegExp;
            RegExp = function (pattern, modifiers) {
                if (pattern == decodeURIComponent("%5Cw%2B%20*%5C(%5C)%20*%7B%5Cw%2B%20*%5B'%7C%22%5D.%2B%5B'%7C%22%5D%3B%3F%20*%7D") || pattern == decodeURIComponent("function%20*%5C(%20*%5C)")
                     || pattern == decodeURIComponent("%5C%2B%5C%2B%20*(%3F%3A_0x(%3F%3A%5Ba-f0-9%5D)%7B4%2C6%7D%7C(%3F%3A%5Cb%7C%5Cd)%5Ba-z0-9%5D%7B1%2C4%7D(%3F%3A%5Cb%7C%5Cd))") || pattern == decodeURIComponent("(%5C%5C%5Bx%7Cu%5D(%5Cw)%7B2%2C4%7D)%2B")) {
                    pattern = '.*?';
                    console.log("发现sojson检测特征，已帮您处理。")
                }
                if (modifiers) {
                    console.log("疑似最后一个检测...已帮您处理。")
                    console.log("已通过全部检测，请手动处理debugger后尽情调试吧！")
                    return _RegExp(pattern, modifiers);
                } else {
                    return _RegExp(pattern);
                }
            };
            RegExp.toString = function () {
                return _RegExp.toString();
            };
        })();
    }
    if (e["config-hook-setInterval"]) {
        (function () {
            setInterval_ = setInterval;
            console.log("原函数已被重命名为setInterval_")
            setInterval = function () {};
            setInterval.toString = function () {
                console.log("有函数正在检测setInterval是否被hook");
                return setInterval_.toString();
            };
        })();
    }
    if (e["config-hook-stringify"]) {
        var rstringiyf = JSON.stringify;
        var stringify_key = prompt("请输入你要监视的关键字：")
        JSON.stringify = function (a) {
            console.log('Detect JSON.stringify 被转换的数据为: =>  ', a)
                for (const key in a) {
                    if (a.hasOwnProperty(key)) {
                        const element = a[key];
                        if (element == stringify_key) {
                            console.log("发现有代码正在将关键字对象转换为字符串...")
                            debugger;
                        }

                    }
                }
                return rstringiyf(a);
        }
        JSON.stringify.toString = function () {
            return rstringiyf.toString();
        }

        //JSON.parse
        var strparse = JSON.parse;
        JSON.parse = function (b) {
            console.log("Detect JSON.Parse");
            return strparse(b);
        }
    }

}
chrome.storage.sync.get(["config-hook-console", "config-hook-debugger", "config-hook-regExp", "config-hook-pushState", "config-hook-setcookie", "config-fuck-sojson", "config-hook-setInterval", "config-hook-stringify"], function (result) {
    script.text = `(${core.toString()})(${JSON.stringify(result)},window)`;
    script.onload = () => {
        script.parentNode.removeChild(script);
    };
    (document.head || document.documentElement).appendChild(script);
})