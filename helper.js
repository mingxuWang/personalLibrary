/**
 * Helper对象提供的方法有：
 * on 委托事件绑定方法
 * each 数组遍历方法
 * getType 判断并获取数据类型
 * bind 返回一个指定上下文的函数的引用
 * trim 去除字符串首尾空格
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
        var parentNodes = document.querySelectorAll(parent);
        var len = parentNodes.length;
        var targetType = getType(child);
        if (len === 0) {
            return;
        }

        for (var i = 0; i < len; i++) {
            parentNodes[i].addEventListener(eventsName, addListener, false);
        }

        // 绑定事件方法
        function addListener(event) {
            if (getActName(targetType, event) === child.toLowerCase()) {
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

        // 获取目标元素完整名称方法
        function getActName(type, event) {
            var name,
                lower = event.target[type].toLowerCase();
            if (type === "className") {
                name = ".";
            } else if (type === "id") {
                name = "#";
            } else {
                name = "";
            }
            return name + lower;
        }
    },
    /**
     * 数组遍历方法
     * @params {Array} list 需要遍历的数组
     * @params {Function} callback 每个数组内元素要执行的回调函数
     */
    each: function(list, callback) {
        if (helper.$getType(callback) !== "function") {
            console.error("$each方法调用时回调函数 未传入/类型错误！");
            return;
        }
        if ((helper.$getType(list) !== "array")) {
            console.error("$each方法调用时数组未正确传入！");
            return;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            var result = callback.call(list[i] || null, i, list[i]);
            if (result === false) {
                return;
            }
        }
    },
    /**
     * 判断并返回判断目标的数据类型
     * @params {} target 需要判断的目标
     * @return {String} 返回小写的目标类型
     */
    getType: function(target){
        return Object.prototype.toString.call(target).slice(8,-1).toLowerCase();
    },
    /**
     * 传入需要改变引用上下文的函数名与上下文，返回一个调整后的引用
     * @params {Function} fn 需要改变上下文的函数
     * @params {Object} context 指定的上下文
     * @return {Function} 返回一个更改了引用上下文的函数的引用，后续可以直接调用
     */
    bind: function(fn,context){
      return function(){
        var args = Array.prototype.slice.call(arguments);
        return fn.apply(context,args);
      };
    },
    /**
     * 去除传入字符串的首尾空格并返回新的字符串
     * @params {String} str 需要去除空格的字符串
     * ￥return {String} 去除首尾空格的字符串
     */
    trim: function(str){
        return (str || "").replace(/^\s+|\s+$/g,"");
    }
};
