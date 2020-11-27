<template>
    <div class="avatar" :status="status">
        <img :src="img" alt="avatar">
    </div>
</template>

<script>
    export default {
        props: {
            status: {
                type: String,
                required: false
            },
            md5hash: {
                type: String,
                required: true
            }
        },
        computed: { 
            img() {
                return `https://www.gravatar.com/avatar/${this.md5hash}`;
            }
        }
    }
</script>