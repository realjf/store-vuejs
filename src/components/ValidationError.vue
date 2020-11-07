<template>
<div v-if="show" class="text-danger">
    <div v-for="m in messages" v-bind:key="m">{{m}}</div>
</div>
</template>

<script>
export default {
    props: ["validation"],
    computed: {
        show() {
            return this.validation.$dirty && this.validation.$invalid
        },
        messages() {
            let messages = [];
            if (this.validation.$dirty) {
                if (this.hasValidationError("required")) {
                    messages.push("Please enter a value")
                } else if (this.hasValidationError("email")) {
                    messages.push("Please enter a valid email address");
                }
            }
            return messages;
        }
    },
    methods: {
        hasValidationError(type) {
            // 新版本的ESLint使用了禁止直接调用 Object.prototypes 的内置属性开关，
            // 说白了就是ESLint 配置文件中的 "extends": "eslint:recommended" 属性启用了此规则，所以使用如下方法调用hasOwnProperty
            return Object.prototype.hasOwnProperty.call(this.validation.$params, type) && !this.validation[type];
        }
    }
}
</script>
