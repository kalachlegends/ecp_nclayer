<template>
  <div class="grid">
    <a-spin
      :spinning="isLoad"
      :tip="'Идет загрузка вебсокета'"
      :indicator="indicator"
    >
      <a-alert :message="message"> </a-alert>
    </a-spin>
    <a-alert
      v-if="isError"
      message="NCALayer не найден!!!!!!!!!!!!"
      type="error"
      show-icon
    >
      <template #icon><smile-outlined /></template>
    </a-alert>
    <!-- <div style="width: 100%">
      <h6>MODEL:</h6>
      <json-editor
        v-model="jsonView"
        :show-btns="true"
        :expandedOnStart="true"
        @json-change="onJsonChange"
        @json-save="jsonSave"
        @has-error="errorJsonb"
      />
    </div> -->

    <!-- <div class="width-100p">
      <a-textarea
        v-model:value="xmlString"
        placeholder="Basic usage"
        :rows="4"
      />
      <a-button @click="localSave">
        Сохранить данный json в local storage</a-button
      >
      <a-button @click="podpisat"> Подписать</a-button>
    </div> -->
    <div>
      <a-typography-title>Введите XML</a-typography-title>
      <a-textarea
        v-model:value="xmlString"
        placeholder="Введите XML"
        :rows="4"
        style="height: 400px"
      />
      <a-button type="primary" @click="podpisat" class="mt-10">
        Подписать</a-button
      >
      <!-- <json-viewer :value="jsonView" /> -->
    </div>
    <div>
      <a-alert
        v-if="isErrorNc"
        :message="messageError"
        type="error"
        show-icon
      />
      <a-alert v-if="alert" :message="alert" type="success" />
      <a-typography-title class="typographic"
        >Подписанный документ:

        <a-button @click="copy" type="primary">Скопировать</a-button>
      </a-typography-title>
      <div>
        {{ resultXmlString }}
      </div>
      <!-- <json-viewer :value="nclayerMess" /> -->
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
      resultXmlString: "",
      isError: false,
      isLoad: true,
      messageError: "Ошибка подписи",
      message: "NCALayer загружен....",
      nclayerMess: "",
      isErrorNc: false,
      socket: {},
      jsonView: {},
      alert: "",
    };
  },
  methods: {
    onJsonChange(e) {
      this.jsonView = { ...e };
      console.log(e);
    },

    copy() {
      const timeout = setTimeout(() => {
        this.alert = "";
        clearTimeout(timeout);
      }, 1000);
      this.alert = "Скопировано!";

      navigator.clipboard.writeText(this.resultXmlString);
    },
    jsonSave(e) {
      this.jsonView = { ...e };
      console.log(e);
    },
    errorJsonb(e) {
      console.log(e);
    },
    localSave() {
      localStorage.removeItem("json");
      localStorage.setItem("json", JSON.stringify(this.jsonView));
    },
    podpisat() {
      this.socket.send(
        JSON.stringify({
          module: "kz.gov.pki.knca.commonUtils",
          method: "signXml",
          args: ["PKCS12", "SIGNATURE", this.xmlString, "", ""],
        })
      );
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
          args: [
            "PKCS12",
            "SIGNATURE",
            '<?xml version="1.0" encoding="UTF-8"?><doc><contents><![CDATA[<div class="text-right">\n  <p><em>Приложение к Приказу АО «Транстелеком»</em></p>\n  <p><em>от 18.06.2019 года № TTC/39-ВП </em></p>\n</div>\n<p></p>\n\n<p></p>\n\n]]></contents></doc>',
            "",
            "",
          ],
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
      // this.nclayerMess = JSON.parse(event.data);
      let data = JSON.parse(event.data);
      console.log(data);
      this.messageError = "Ошибка подписи";
      if (data.code == 200) {
        this.isErrorNc = false;
        this.resultXmlString = data.responseObject;
      }
      if (data.code == 500) {
        this.isErrorNc = true;

        this.messageError = this.messageError + ` - \n${data.message}`;
      }
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
.grid div {
  width: 100%;
}
.mt-10 {
  margin-top: 10px;
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
.typographic {
  display: flex;
  align-items: center;

  gap: 10px;
}
.d-flexx {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: space-between;
}
</style>
