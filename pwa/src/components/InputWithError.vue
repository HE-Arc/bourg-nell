<template>
    <div>
        <div :class="hasErrors ? 'input-error' : ''">
            <input @input="emitChange" v-model="inputValue" :name="name" :tabindex="tabindex" :type="type" :placeholder="placeholder" />
            <span v-for="err in (errors || [])" :key="err" class="error">{{err}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TextInputWithError",
        data() {
            return {
                inputValue: ""
            };
        },
        props: {
            errors: {
                type: Array,
                required: false
            },
            name: {
                type: String,
                required: true
            },
            placeholder: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true   
            },
            tabindex: {
                type: String,
                required: true
            },
            value: {
                type: String,
                default: ""
            }
        },
        model: {
            prop: "value",
            event: "change"
        },
        computed: {
            hasErrors(){
                return this.errors && this.errors.length > 0;
            }
        },
        methods: {
            emitChange(value) {
                this.$emit("change", this.inputValue);
            }
        }
    }
</script>