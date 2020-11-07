<template>
<router-view />
</template>

<script>
// import Store from './components/Store';
import {
    mapActions
} from "vuex";

export default {
    name: 'App',
    // components: {Store},
    methods: {
        ...mapActions({
            getData: "getData",
            initializeCart: "cart/initializeCart"
        })
    },
    created() {
        this.getData();
        // 初始化购物车
        this.initializeCart(this.$store);
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
