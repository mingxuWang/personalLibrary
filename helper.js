/**
 * Helper对象提供的方法有：
 * $on 委托事件绑定方法
 * $each 数组遍历方法
 */

var helper = {
    /**
     * 委托事件绑定方法
     * @params parent 委托父元素的css选择符 tag id class
     * @params eventsName 绑定的事件
     * @params child 绑定事件的元素css选择符 tag id class
     * @params resFunc 事件响应函数
     */
    $on: function(parent, eventsName, child, resFunc) {
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
                resFunc(event);
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
    $each: function(list, callback) {
        if (typeof callback !== "function") {
            console.error("$each方法调用时回调函数 未传入/类型错误！");
            return;
        }
        if (!(list instanceof Array)) {
            console.error("$each方法调用时数组未正确传入！");
            return;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            var result = callback.call(list[i], i, list[i]);
            if (result === false) {
                return;
            }
        }
    }
};
