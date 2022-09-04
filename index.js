import agileTable from './index.vue'
export default {
    install(app){
        app.component('agileTable',agileTable)
        return app
    }
}