;(function () {
    'use strict';
    const Event = new Vue();

    Vue.component('task',{
        template: "#task-tpl",
        props: ['todo'],
        methods: {
            action(name,params){
                Event.$emit(name,params);
            }
        }
    });
    new Vue({
        el: '#main',
        data: {
            list: [],
            last_id: 0,
            current: {},
            ok: false
        },
        mounted(){
            const me = this;
            this.list = ms.get('list') || this.list;
            this.last_id = ms.get('last_id') || this.last_id;
            setInterval(function () {
                me.check_alerts();
            },1000);
            Event.$on('remove',function (id) {
                if (id){
                    me.remove(id);
                }
            });

            Event.$on('toggle_complete',function (id) {
                if (id){
                    me.toggle_complete(id);
                }
            });

            Event.$on('set_current',function (id) {
                if (id){
                    me.set_current(id);
                }
            });

            Event.$on('toggle_detail',function (id) {
                if (id){
                    me.toggle_detail(id);
                }
            });
        },
        methods: {

            check_alerts(){
                const me = this;
                this.list.forEach(function (row,i) {
                    var alert_at = row.alert_at;
                    if (!alert_at || row.alert_confirmed) return;

                    var alert_at = (new Date(alert_at)).getTime();
                    var now = (new Date()).getTime();

                    if (now >= alert_at) {
                        const confirmed = confirm('你应该去' + row.title + '了');
                        Vue.set(me.list[i], 'alert_confirmed', confirmed);
                    }
                })
            },

            merge() {
                let is_update,id;
                is_update = id = this.current.id;
                if (is_update){
                    let index = this.list.findIndex(function (item) {
                        return item.id === is_update;
                    });
                    Vue.set(this.list, index, Object.assign({}, this.current));
                } else {
                    //判断title里面是否有值，如果没有，直接返回
                    let title = this.current.title;
                    if (!title && title !== 0 && title.replace(/(^s*)|(s*$)/g, "").length == null) return;
                    let todo = Object.assign({}, this.current);
                    this.last_id ++;
                    ms.set('last_id',this.last_id);
                    todo.id = this.last_id;
                    this.list.push(todo);
                }
                this.reset_current();
            },
            toggle_detail(id){
              let index = this.list.findIndex(function (item) {
                    return item.id === id;
              });
              Vue.set(this.list[index], 'show_detail', !this.list[index].show_detail);
            },
            remove(id) {
                let index = this.list.findIndex(function (item) {
                    return item.id === id;
                });
                this.list.splice(index, 1);
            },
            next_id() {
                return this.list.length + 1;
            },
            //更新事件
            set_current(todo) {
                this.current = Object.assign({},todo);
            },
            reset_current() {
                this.set_current({});
            },
            toggle_complete(id){
                let i = this.list.findIndex(function (item) {
                    return item.id === id;
                });
                Vue.set(this.list[i],'completed',!this.list[i].completed);
            },
            toggle_isActive(){
                this.ok = !this.ok;
            }
        },
        watch: {
            list: {
               deep: true,
               handler(new_val,old_val){
                    if (new_val){
                        ms.set('list',new_val);
                    } else {
                        ms.set('list',[]);
                    }
               }
            }
        }
    });
})();
