import Vue from "vue";

new Vue({
    el: "div#root",
    data: {
        time: 0
    },
    created: function() {
        setInterval(() => {
            this.time++;
        }, 1000);
    },
    template: '<div>{{time}}</div>'
});
