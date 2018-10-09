<template>
    <div>
      <el-upload ref="upload" :action="BASE_URL+'/file/uploadFile'" :auto-upload="true" :file-list="setPreImgs" :headers="setRequestHeader" list-type="picture-card" :on-success="handleSuccess" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
      </el-upload>
    </div>
</template>

<script>
import api from "@/utils/api";
export default {
  props: {
    value: ""
  },
  data: () => ({
    url: "",
    BASE_URL: ""
  }),
  computed: {
    setRequestHeader() {
      return {
        Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
        inputId: "file"
      };
    },
    setPreImgs() {
      let imgList = [];
      if (this.value) {
        this.value.split("|").map(img => {
          imgList.push({ url: this.BASE_URL + "/file/downloadFile/" + img });
        });
      }
      return imgList;
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.url = "";
      fileList.map(file => {
        if (file.response) {
          this.url += "|" + file.response.fileName;
        } else if (file.url) {
          this.url +=
            "|" +
            file.url.substring(
              file.url.indexOf("downloadFile/") + 13,
              file.url.length
            );
        }
      });
      this.url = this.url.substring(1, this.url.length);
      this.$emit("input", this.url);
      this.$emit("change");
    },
    handleRemove(file, fileList) {
      this.url = "";
      fileList.map(file => {
        if (file.response) {
          this.url += "|" + file.response.fileName;
        } else if (file.url) {
          this.url +=
            "|" +
            file.url.substring(
              file.url.indexOf("downloadFile/") + 13,
              file.url.length
            );
        }
      });
      this.url = this.url.substring(1, this.url.length);
      this.$emit("input", this.url);
      this.$emit("change");
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
  },
  mounted() {
    this.BASE_URL = api.BASE_URL;
  }
};
</script>

<style>
</style>
