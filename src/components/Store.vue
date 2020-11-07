<template>
<div class="container-fluid">
    <div class="row">
        <div class="col bg-dark text-white">
            <a class="navbar-brand">SPORTS STORE</a>
        </div>
    </div>
    <div class="row">
        <div class="col-3 bg-info p-2">
            <!-- 使用分类组件 -->
            <CategoryControls />
        </div>
        <div class="col-9 p-2">
            <!-- 使用注册组件 -->
            <product-list />
        </div>
    </div>
</div>
</template>

<script>
// 导入组件文件
import ProductList from "./ProductList"
import CategoryControls from "./CategoryControls";
export default {
    components: {
        ProductList,
        CategoryControls
    }
}
</script>
