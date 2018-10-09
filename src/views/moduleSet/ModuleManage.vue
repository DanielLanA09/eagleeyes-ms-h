<template>
    <div class="module-back">
        <div class="module-set">
            <el-form label-width="80px" :model="devisionSet">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="序号">
                        <el-input v-model="devisionSet.sort" type="number" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="模块名称">
                        <el-input v-model="devisionSet.name" placeholder="请输入模块的名称"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="图标1">
                      <el-button class="width-full" :type="devisionSet.icon1?'success':''" @click="icon1Visible=true">点击选择</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="图标2">
                      <el-button class="width-full" :type="devisionSet.icon2?'success':''" @click="icon2Visible=true">点击选择</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="模块描述">
                        <el-input v-model="devisionSet.des" type="textarea" placeholder="请简要描述该模块"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="页脚描述">
                        <el-input v-model="devisionSet.footerDes" type="textarea" placeholder="请简要描述该模块"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-button type="success" @click="onAdd(true)">添加</el-button>
                    <el-button type="warning" v-if="devisionSet.id!=undefined" @click="onAdd(false)">保存</el-button>
                  </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
          <el-dialog title="导航栏图标" :visible.sync="icon1Visible">
            <ul class="icon1-list">
              <li @click="setIcon1(i)" v-for="(i,k) in icon1List" :key="k">
                <i class="h-v-center iconfont" :class="[i,{active:i==devisionSet.icon1}]"></i>
              </li>
            </ul>
          </el-dialog>
          <el-dialog title="正文图标" :visible.sync="icon2Visible">
            <ul class="icon2-list">
              <li @click="setIcon2(i)" v-for="(i,k) in icon2List" :key="k">
                <i class="h-v-center iconfont" :class="[i,{active:i==devisionSet.icon2}]"></i>
              </li>
              
            </ul>
          </el-dialog>
        </div>
        <div class="module-table">
            <el-table :data="moduleTable" border style="width:100%" :default-sort="{prop:'sort',order:'ascending'}">
                <el-table-column label="排序" prop="sort" width="150"></el-table-column>
                <el-table-column label="名称" prop="name" width="150"></el-table-column>
                <el-table-column label="描述" prop="des" w></el-table-column>
                <el-table-column label="页脚" prop="footerDes" w></el-table-column>
                <el-table-column label="操作" fixed="right" prop="id" width="100">
                    <template slot-scope="scope">
                        <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api";
export default {
  data: () => ({
    devisionSet: {
      name: "",
      sort: 0,
      des: "",
      icon1: "",
      icon2: ""
    },
    icon1Visible: false,
    icon2Visible: false,
    moduleTable: [],
    icon1List: [
      "icon-xiaotubiao_fuzhi-29",
      "icon-xiaotubiao_fuzhi-18",
      "icon-xiaotubiao_fuzhi-14",
      "icon-xiaotubiao_fuzhi-13",
      "icon-xiaotubiao_fuzhi-12",
      "icon-xiaotubiao_fuzhi-11",
      "icon-xiaotubiao_fuzhi-10",
      "icon-xiaotubiao_fuzhi-9",
      "icon-xiaotubiao_fuzhi-8",
      "icon-xiaotubiao_fuzhi-7",
      "icon-xiaotubiao_fuzhi-6",
      "icon-xiaotubiao_fuzhi-5",
      "icon-xiaotubiao_fuzhi-4",
      "icon-xiaotubiao_fuzhi-"
    ],
    icon2List: [
      "icon-yiliao1",
      "icon-xiaoqupeitao",
      "icon-loufangbuju",
      "icon-shenghuoyule",
      "icon-xiaoqulvhua",
      "icon-datubiao-cloud-12",
      "icon-datubiao-cloud-11",
      "icon-datubiao-cloud-10",
      "icon-datubiao-cloud-9",
      "icon-datubiao-cloud-8",
      "icon-datubiao-cloud-6",
      "icon-datubiao-cloud-3",
      "icon-datubiao-cloud-1"
    ]
  }),
  methods: {
    setIcon1(e) {
      this.devisionSet.icon1 = e;
    },
    setIcon2(e) {
      this.devisionSet.icon2 = e;
    },
    onAdd(isAdd) {
      if (isAdd) {
        delete this.devisionSet.id;
      }
      api.saveModuleSet(this.devisionSet, res => {
        if (res.success) {
          this.$message({
            message: "保存成功！",
            type: "success"
          });
          this.onTableFresh();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    onDelete(row) {
      this.$confirm("此操作将永久删除此模块配置，是否继续？", "警告", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.deleteModuleSet(row.id, res => {
          if (res.success) {
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg);
          }
          this.onTableFresh();
        });
      });
    },
    onEdit(row) {
      this.devisionSet = row;
    },
    onTableFresh() {
      api.getModuleSet(res => {
        if (res.success) {
          this.moduleTable = res.data;
          if (this.moduleTable.length == 0) {
            this.$message.warning("目前还没设置栏目，请添加栏目吧！");
            return;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  mounted() {
    this.onTableFresh();
  }
};
</script>

<style lang="less" scoped>
.module-back {
  height: 100%;
  width: 100%;
}
.icon1-list {
  list-style: none;
  overflow: hidden;
  border: 1px solid #eaeefb;
  border-radius: 4px;
  padding: 0;
  li {
    float: left;
    height: 120px;
    line-height: 120px;
    width: 14.28%;
    font-size: 13px;
    transition: color 0.15s linear;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    i {
      font-size: 60px;
    }
    i.active {
      color:dodgerblue;
    }
  }

  li:hover {
    background-color: antiquewhite;
  }
}
.icon2-list {
  list-style: none;
  overflow: hidden;
  border: 1px solid #eaeefb;
  border-radius: 4px;
  padding: 0;
  li {
    float: left;
    height: 120px;
    line-height: 120px;
    width: 25%;
    font-size: 13px;
    transition: color 0.15s linear;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    i {
      font-size: 60px;
    }
    i.active {
      color:dodgerblue;
    }
  }
  li:hover {
    background-color: antiquewhite;
  }
}
</style>
