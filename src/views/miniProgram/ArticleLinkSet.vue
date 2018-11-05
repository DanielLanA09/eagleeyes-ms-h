<template>
    <div>
        <div class="up-down-off-10 h-right">
            <el-button type="success" size="small" @click="addVisible=true">新增</el-button>
        </div>
        <el-table :data="list" border>
            <el-table-column prop="createdAt" label="日期" width="180"></el-table-column>
            <el-table-column prop="type" label="分类" width="180"></el-table-column>
            <el-table-column prop="viewC" label="浏览量" width="80"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="onEdit(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="onDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增文章" :visible.sync="addVisible">
            <el-form :form="article" label-width="60px">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="标题">
                            <el-input v-model="article.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型">
                            <el-select v-model="article.type">
                                <el-option :label="'分类1'" :value="'cata1'"></el-option>
                                <el-option :label="'分类2'" :value="'cata2'"></el-option>
                                <el-option :label="'分类3'" :value="'cata3'"></el-option>
                                <el-option :label="'分类4'" :value="'cata4'"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="连接">
                    <el-input v-model="article.link"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" >
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addLink">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "@/utils/api.js";
export default {
  data: () => {
    return {
      list: [],
      addVisible: false,
      article: {},
      pageable: {
        page: 0,
        size: 20
      }
    };
  },
  mounted() {
    this.pageList();
  },
  methods: {
    addLink() {
      api.saveLink(this.article, res => {
        if (res.success) {
          this.$notify.success({
            title: "提示",
            message: "添加完毕"
          });
          this.pageList();
          this.addVisible = false;
        } else {
          this.$notify.console.error({
            title: "警告",
            message: res.msg
          });
        }
      });
    },
    pageList() {
      api.linkList(this.pageable, res => {
        if (res.success) {
          this.list = res.data.content;
        }
      });
    },
    onDelete(id) {
      api.deleteLink(id, res => {
        if (res.success) {
          this.$notify.success({
            title: "提示",
            message: res.data
          });
          this.pageList();
        } else {
          this.$notify.error({
            title: "警告",
            message: res.msg
          });
        }
      });
    },
    onEdit(row) {
      this.article = row;
      this.addVisible = true;
    }
  }
};
</script>

<style scoped lang="less">
</style>
