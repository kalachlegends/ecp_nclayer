import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
import JsonViewer from 'vue-json-viewer'
import { Vue3JsonEditor } from 'vue3-json-editor'
app.component("json-editor", Vue3JsonEditor)
app.use(Antd).use(JsonViewer).mount('#app');