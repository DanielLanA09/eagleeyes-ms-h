<template>
    <div>
        <div class="form">
            <el-form label-width="80px" :model="TagSet">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="序号">
                            <el-input v-model="TagSet.sort" placeholder="请输入序号" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="类型">
                            <!-- <el-input v-model="TagSet.type"> </el-input> -->
                            <el-select v-model="TagSet.type" placeholder="请选择类型">
                                <el-option label="优点" value="ADVANTAGE"></el-option>
                                <el-option label="缺点" value="DISADVANTAGE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="名字" placeholder="请输入标签名字">
                            <el-input  v-model="TagSet.name"></el-input>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="TagSet.des" placeholder="请输入相关描述"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-button type="success" @click="onEdit(true)">添加</el-button>
                        <el-button type="warning" v-show="TagSet.id" @click="onEdit(false)">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <el-table :data="tagList" border style="width:100%">
                <el-table-column prop="sort" label="序号" width="80"></el-table-column>
                <el-table-column label="类型" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type=='ADVANTAGE'"><i class="el-icon-circle-plus" style="color:green;"></i></span>
                        <span v-if="scope.row.type=='DISADVANTAGE'"><i class="el-icon-remove" style="color:red;"></i></span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名字" width="120"></el-table-column>
                <el-table-column prop="author" label="作者" width="120"></el-table-column>
                <el-table-column prop="des" label="描述"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="onDelete(scope.row.id)">删除</el-button>
                        <el-button type="text" size="small" @click="onRowEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api.js";

export default {
  data: () => ({
    TagSet: {
      type: "",
      name: "",
      authoer: ""
    },
    tagList: [],
    page: 0
  }),
  methods: {
    refresh() {
      api.getTagSetList({ size: 500, page: this.page }, res => {
        this.tagList = res.data.content;
      });
    },
    onDelete(id) {
      this.$confirm("此操作将会永久删除此纪录，是否继续？", "警告", {
        confirmButtonText: "继续",
        confirmButtonCancel: "取消",
        type: "warning"
      }).then(() => {
        api.deleteTagSet(id, res => {
          if (res.success) {
            this.$message.success("删除完成！");
            this.refresh();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    onEdit(isAdd) {
      if (isAdd) {
        delete this.TagSet.id;
      }
      this.TagSet.author = this.$store.state.USER.name;
      api.saveTagSet(this.TagSet, res => {
        if (res.success) {
          this.$message.success("保存成功！");
          this.refresh();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    onRowEdit(row) {
      this.TagSet = row;
    },
    reset() {
      let user = JSON.parse(localStorage.getItem("USER"));
      this.$store.commit("SET_USER", user);
    }
  },
  mounted() {
    this.refresh();
    this.reset();
  }
};
</script>

<style scoped lang="less">
</style>
