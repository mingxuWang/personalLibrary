/**
 * Helper对象提供的方法有：
 * on 委托事件绑定方法
 * each 数组遍历方法
 * map 数组遍历使用同一fn处理方法
 * getType 判断并获取数据类型
 * bind 返回一个指定上下文的函数的引用
 * trim 去除字符串首尾空格
 * getQuerys 获取页面search参数并以对象形式返回
 * cookie cookie操作相关 get set unset
 * copy 深拷贝方法
 * extend 对目标对象进行拓展方法
 */

var helper = {
    /**
     * 委托事件绑定方法
     * @params parent 委托父元素的css选择符 tag id class
     * @params eventsName 绑定的事件
     * @params child 绑定事件的元素css选择符 tag id class
     * @params callback 事件响应函数
     */
    on: function(parent, eventsName, child, callback) {
        var parentNodes = document.querySelectorAll(parent),
            len = parentNodes.length,
            targetType = getType(child),
            i = 0;
        if (len === 0) {
            return;
        }

        for (; i < len; i++) {
            parentNodes[i].addEventListener(eventsName, addListener, false);
        }

        // 绑定事件方法
        function addListener(event) {
            // if (getActName(targetType, event) === child.toLowerCase()) {
            //     callback(event);
            // }
            if(isTarget(targetType, event, child.toLowerCase())){
                callback(event);
            }
        }

        // 获取目标元素类型方法
        function getType(target) {
            var type;
            if (target.indexOf(".") !== -1) {
                type = "className";
            } else if (target.indexOf("#") !== -1) {
                type = "id";
            } else {
                type = "tagName";
            }
            return type;
        }

        // 获取目标元素完整名称方法 考虑多class问题弃用
        // function getActName(type, event) {
        //     var name,
        //         lower = event.target[type].toLowerCase();
        //     if (type === "className") {
        //         name = ".";
        //     } else if (type === "id") {
        //         name = "#";
        //     } else {
        //         name = "";
        //     }
        //     return name + lower;
        // }
        // 判断是否为目标对象
        function isTarget(type, event, target){
            var className,
                targetClass,
                lower = event.target[type].toLowerCase();
            if (type === "className") {
                className = " " + lower + " ";
                targetClass = " " + target.slice(1) + " ";
                return className.indexOf(targetClass) !== -1 ;
            } else if (type === "id") {
                return ( "#" + lower ) === target ? true : false;
            } else {
                return lower === target ? true : false;
            }
        }
    },
    /**
     * 数组遍历方法
     * @params {Array} Arr 需要遍历的数组
     * @params {Function} callback 每个数组内元素要执行的回调函数
     */
    each: function(Arr, callback) {
        if (this.$getType(callback) !== "function") {
            throw new Error("$each方法调用时回调函数 未传入/类型错误！");
        }
        if ((this.$getType(Arr) !== "array")) {
            throw new Error("each方法调用时数组未正确传入！");
        }
        var i = 0,
            len = Arr.length,
            result;
        for (; i < len; i++) {
            result = callback.call(Arr[i] || null, i, list[i]);
            if (result === false) {
                return;
            }
        }
    },
    /**
     * 数组遍历使用同一fn处理方法
     * @params {Array} Arr 需要进行map处理的数组
     * @params {Function} fn 数组中每个对象需要处理的函数
     * @params {Object} context 处理函数中的上下文
     * @return {Array} 处理完成后的结果数组
     */
    map: function(Arr, fn, context) {
        var temp = [],
            key = 0,
            len = Arr.length,
            con = context || null,
            val;
        for (; key < len; key++) {
            val = fn.call(con, Arr[key], key, Arr);
            if (val === false) {
                return temp;
            }
            temp.push(val);
        }
        return temp;
    },
    /**
     * 判断并返回判断目标的数据类型
     * @params {} target 需要判断的目标
     * @return {String} 返回小写的目标类型
     */
    getType: function(target) {
        return {}.toString.call(target).slice(8, -1).toLowerCase();
    },
    /**
     * 传入需要改变引用上下文的函数名与上下文，返回一个调整后的引用
     * @params {Function} fn 需要改变上下文的函数
     * @params {Object} context 指定的上下文
     * @return {Function} 返回一个更改了引用上下文的函数的引用，后续可以直接调用
     */
    bind: function(fn, context) {
        var _args = [].slice.call(arguments, 2);
        return function() {
            var args = [].slice.call(arguments);
            return fn.apply(context, _args.concat(args));
        };
    },
    /**
     * 去除传入字符串的首尾空格并返回新的字符串
     * @params {String} str 需要去除空格的字符串
     * ￥return {String} 去除首尾空格的字符串
     */
    trim: function(str) {
        return (str || "").replace(/^\s+|\s+$/g, "");
    },
    /**
     * 获取页面search中参数并转换为对象形式
     * @params {String} -可选 url 希望进行转换的查询参数字符串
     * @return {Object} args 转换完成的参数对象
     */
    getQuerys: function(url) {
        var qs = "";
        var args = {};
        if (url) {
            if (url.indexOf('?') >= 0) {
                qs = url.substr(url.indexOf('?') + 1);
            }
        } else {
            qs = window.location.search.substr(1);
        }
        if (qs.length) {
            var params = qs.split("&");
            for (var i = 0, len = params.length; i < len; i++) {
                var item = params[i].split("=");
                var key = decodeURIComponent(item[0]) || '';
                var value = decodeURIComponent(item[1]) || '';
                args[key] = value;
            }
        }

        return args;
    },
    /**
     * 深拷贝方法
     * @params {Object} source 需要拷贝的对象
     * @return {Object} target 拷贝完成的新对象
     */
    copy: function _copy(source) {
        var target = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === "object") {
                    if (source[key] === null) {
                        target[key] = null;
                    } else if ({}.toString.call(source[key]).slice(8, -1).toLowerCase() === "array") {
                        target[key] = source[key].slice(0);
                    } else {
                        target[key] = _copy(source[key]);
                    }
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },
    /**
     * extend方法 对目标对象进行拓展
     * @params {Boolean} deep 是否需要深拷贝
     * @return {Object} target 需要被extend的对象
     * @return {Object} others 后续可传入任意个被extend的对象
     */
    extend: function(deep, target) {
        var args = [].slice.call(arguments, 2),
            len = args.length,
            i = 0,
            key;
        if (len === 0) {
            throw new Error("未传入要拓展的对象！");
        }
        if (!deep) {
            for (; i < len; i++) {
                for (key in args[i]) {
                    if (args[i].hasOwnProperty(key)) {
                        target[key] = args[i][key];
                    }
                }
            }
        } else {
            for (; i < len; i++) {
                for (key in args[i]) {
                    if (args[i].hasOwnProperty(key)) {
                        if (typeof args[i][key] === "object") {
                            if (args[i][key] === null) {
                                target[key] = null;
                            } else if ({}.toString.call(args[i][key]).slice(8, -1).toLowerCase() === "array") {
                                target[key] = args[i][key].slice(0);
                            } else {
                                target[key] = this.copy(args[i][key]);
                            }
                        } else {
                            target[key] = args[i][key];
                        }
                    }
                }
            }
        }
        return target;
    },
    /**
     * cookie操作相关
     */
    cookie: {
        get: function(name) {
            var cookie = document.cookie,
                cookieName = encodeURIComponent(name) + "=",
                cookieStart = cookie.indexOf(cookieName),
                cookieValue = null;
            if (cookieStart > -1) {
                var cookieEnd = cookie.indexOf(";", cookieStart);
                if (cookieEnd === -1) {
                    cookieEnd = cookie.length;
                }
                cookieValue = decodeURIComponent(cookie.slice(cookieStart + cookieName.length, cookieEnd));
            }
            return cookieValue;
        },
        /**
       * 设置cookie
       * @params {String} name 要设置的cookie名称
       * @params {String} value 要设置的cookie值
       * @params {Object} opts 该cookie的其它相关参数
       * @params {String} opts.domain cookie域
       * @params {String} opts.path cookie路径
       * @params {Date} opts.expires cookie失效时间
       * @params {Boolean} opts.secure cookie是否安全
       */
        set: function(name, value, opts) {
            var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value),
                cookieOpts = opts || {};
            if (cookieOpts.expires && cookieOpts.expires instanceof Date) {
                cookie += "; expires=" + cookieOpts.expires.toGMTString();
            }
            if (cookieOpts.domain) {
                cookie += "; domain=" + cookieOpts.domain;
            }
            if (cookieOpts.path) {
                cookie += "; path=" + cookieOpts.path;
            }
            if (cookieOpts.secure) {
                cookie += "; secure";
            }
            document.cookie = cookie;
        },
        /**
       * 使cookie过期
       * 设置cookie
       * @params {String} name 要设置的cookie名称
       * @params {String} path cookie路径
       * @params {String} domain cookie域
       * @params {String} opts.secure cookie是否安全
       */
        unset: function(name, path, domain, secure) {
            this.cookie.set(name, "", {
                path: path,
                domain: domain,
                secure: secure,
                expires: new Date(0)
            });
        }
    }
};
