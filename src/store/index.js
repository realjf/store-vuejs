import Vue from "vue";
import Vuex from "vuex";

import Axios from "axios";
import CartModule from "./cart";
import OrdersModule from "./orders";
import AuthModule from "./auth";

Vue.use(Vuex);

const baseUrl = "/api";
const productsUrl = `${baseUrl}/products`;
const categoriesUrl = `${baseUrl}/categories`;

const testData = [];

for(let i = 1; i <= 10; i++){
    testData.push({
        id: i, name: `Product #${i}`, category: `Category ${i % 3}`,
        description: `This is Product #${i}`, price: i * 50
    })
}

export default new Vuex.Store({
    strict: false, // 修改检查模式
    modules: {cart: CartModule, orders: OrdersModule, auth: AuthModule }, // 添加购物车模块
    state: {
        // products: testData,
        categoriesData: [],
        // productsTotal: testData.length,
        currentPage: 1,
        pageSize: 4,
        currentCategory: "All",
        pages: [],
        serverPageCount: 0,
        searchTerm: "",
        showSearch: false
    },
    getters: {
        // productsFilteredByCategory: state => state.products.filter(p => state.currentCategory == "All" || p.category == state.currentCategory),
        // 根据当前分页以及每页个数返回当前页面产品列表
        processedProducts: (state) => {
            return state.pages[state.currentPage];
        },
        // 计算分页总数
        pageCount: (state) => state.serverPageCount,
        categories: state => ["All", ...state.categoriesData],
        productById:(state) => (id) => {
            return state.pages[state.currentPage].find(p => p.id == id);
        }
    },
    mutations: {
        // 设置当前分页
        _setCurrentPage(state, page){
            state.currentPage = page;
        },
        // 设置每页个数
        _setPageSize(state, size){
            state.pageSize = size;
            state.currentPage = 1;
        },
        // 设置当前分类
        _setCurrentCategory(state, category){
            state.currentCategory = category;
            state.currentPage = 1;
        },
        // setData(state, data){
        //     state.products = data.pdata;
        //     state.productsTotal = data.pdata.length;
        //     state.categoriesData = data.cdata.sort();
        // },
        addPage(state, page){
            for(let i=0; i<page.pageCount; i++){
                Vue.set(state.pages, page.number +i, page.data.slice(i*state.pageSize, (i*state.pageSize) + state.pageSize));
            }
        },
        clearPages(state){
            state.pages.splice(0, state.pages.length);
        },
        setCategories(state, categories){
            state.categoriesData = categories;
        },
        setPageCount(state, count){
            state.serverPageCount = Math.ceil(Number(count)/state.pageSize);
        },
        setShowSearch(state, show){
            state.showSearch = show;
        },
        setSearchTerm(state, term){
            state.searchTerm = term;
            state.currentPage = 1;
        },
        // 添加商品
        _addProduct(state, product){
            state.pages[state.currentPage].unshift(product);
        },
        _updateProduct(state, product){
            let page = state.pages[state.currentPage];
            let index = page.findIndex(p => p.id == product.id);
            Vue.set(page, index, product);
        }
    },
    actions: {
        async getData(context) {
            await context.dispatch("getPage", 2);
            context.commit("setCategories", (await Axios.get(categoriesUrl)).data);
        },
        async getPage(context, getPageCount = 1){
            let url = `${productsUrl}?_page=${context.state.currentPage}` + `&_limit=${context.state.pageSize * getPageCount}`;
            if(context.state.currentCategory != "All"){
                url += `&category=${context.state.currentCategory}`;
            }
            // 添加搜索词判断
            if(context.state.searchTerm != ""){
                url += `&q=${context.state.searchTerm}`;
            }
            let response = await Axios.get(url);
            context.commit("setPageCount", response.headers["x-total-count"]);
            context.commit("addPage", {number: context.state.currentPage, data: response.data, pageCount: getPageCount});
        },
        setCurrentPage(context, page){
            context.commit("_setCurrentPage", page);
            if(!context.state.pages[page]){
                context.dispatch("getPage");
            }
        },
        setPageSize(context, size){
            context.commit("clearPages");
            context.commit("_setPageSize", size);
            context.dispatch("getPage", 2);
        },
        setCurrentCategory(context, category){
            context.commit("clearPages");
            context.commit("_setCurrentCategory", category);
            context.dispatch("getPage", 2);
        },
        search(context, term){
            context.commit("setSearchTerm", term);
            context.commit("clearPages");
            context.dispatch("getPage", 2);
        },
        clearSearchTerm(context){
            context.commit("setSearchTerm", "");
            context.commit("clearPages");
            context.dispatch("getPage", 2);
        },
        // 添加商品
        async addProduct(context, product){
            let data = (await context.getters.authenticatedAxios.post(productsUrl, product)).data;
            product.id = data.id;
            this.commit("_addProduct", product);
        },
        async removeProduct(context, product){
            await context.getters.authenticatedAxios.delete(`${productsUrl}/${product.id}`);
            context.commit("clearPages");
            context.dispatch("getPage", 1);
        },
        async updateProduct(context, product){
            await context.getters.authenticatedAxios.put(`${productsUrl}/${product.id}`, product);
            this.commit("_updateProduct", product);
        }
    }
})
