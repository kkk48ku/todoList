;(function () {
    //将定义好的存值与取值方法暴露出去成为全局对象
    window.ms = {
      set: set,
      get: get,
    };
    //用window.localStorage原生API定义存值方法
    function set(key ,val) {
        localStorage.setItem(key,JSON.stringify(val));
    }
    //用window.localStorage原生API定义取值方法
    function get(key) {
        let json = localStorage.getItem(key);
        if (json){
            return JSON.parse(json);
        }
    }
})();