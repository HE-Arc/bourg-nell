module.exports = {
    // ...
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    entry: "./main.js",
    output: "bundle.js"
}