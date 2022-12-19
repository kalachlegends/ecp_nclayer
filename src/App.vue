<template>
  <div class="grid">
    <a-spin
      :spinning="isLoad"
      :tip="'Идет загрузка вебсокета'"
      :indicator="indicator"
    >
      <a-alert :message="message"> </a-alert>
    </a-spin>

    <div style="width: 100%">
      <h6>MODEL:</h6>
      <json-editor
        v-model="jsonView"
        :show-btns="true"
        :expandedOnStart="true"
        @json-change="onJsonChange"
        @json-save="jsonSave"
        @has-error="errorJsoin"
      />
    </div>

    <a-alert
      v-if="isError"
      message="NCALayer не найден!!!!!!!!!!!!"
      type="error"
      show-icon
    >
      <template #icon><smile-outlined /></template>
    </a-alert>
    <div class="width-100p">
      <!-- <a-textarea
        v-model:value="xmlString"
        placeholder="Basic usage"
        :rows="4"
      /> -->
      <a-button @click="localSave">
        Сохранить данный json в local storage</a-button
      >
      <a-button @click="podpisat"> Подписать</a-button>
    </div>

    <div class="d-flexx">
      <div>
        <a-typography-title>Отправляете в NCALayer</a-typography-title>
        <json-viewer :value="jsonView" />
      </div>
      <div>
        <a-typography-title>Ответ от NCALayer</a-typography-title>
        <json-viewer :value="nclayerMess" />
      </div>
    </div>
  </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
import { Vue3JsonEditor } from "vue3-json-editor";
export default {
  name: "App",
  data() {
    return {
      xmlString: "",
      isError: false,
      isLoad: true,
      message: "Веб-сокет -NCALayer загружен....",
      nclayerMess: "",
      socket: {},
      jsonView: {},
    };
  },
  methods: {
    onJsonChange(e) {
      this.jsonView = { ...e };
      console.log(e);
    },
    jsonSave(e) {
      this.jsonView = { ...e };
      console.log(e);
    },
    localSave() {
      localStorage.removeItem("json");
      localStorage.setItem("json", JSON.stringify(this.jsonView));
    },
    podpisat() {
      this.socket.send(JSON.stringify(this.jsonView));
    },
    components: {
      JsonViewer,

      Vue3JsonEditor,
    },
    computed: {
      compXmlString() {
        return this.xmlString;
      },
    },
  },
  mounted() {
    this.socket = new WebSocket("wss://127.0.0.1:13579/");

    if (localStorage.getItem("json")) {
    } else {
      localStorage.setItem(
        "json",
        JSON.stringify({
          module: "kz.gov.pki.knca.commonUtils",
          method: "signXml",
          args: ["PKCS12", "SIGNATURE", this.xmlString, "", ""],
        })
      );
    }
    this.jsonView = JSON.parse(localStorage.getItem("json"));
    this.socket.onerror = (e) => {
      this.isError = true;
    };
    this.socket.onopen = (e) => {
      this.isLoad = false;
    };
    this.socket.onmessage = (event) => {
      this.nclayerMess = JSON.parse(event.data);
    };
  },
};
</script>
<style>
#app {
  margin: 0 auto;
  width: 1000px;
}
.flex {
  display: flex;
  gap: 10px;
}
.grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.width-100p {
  width: 100%;
}
.d-flexx {
  display: flex;
  gap: 20px;
}
</style>
