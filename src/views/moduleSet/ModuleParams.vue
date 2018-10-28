<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-tabs v-model="activeDivision" :tab-position="'left'" @tab-click="tabChange">
                    <el-tab-pane :label="devision.name" :name="devision.name" v-for="(devision,devisionKey) in Devisions" :key="devisionKey">
                        <el-row class="margin-up-down-20">
                            <el-col :span="24" :offset="0">
                                <el-form label-width="50px" :model="Param">
                                    <el-row>
                                        <el-col :span="5">
                                            <el-form-item label="类型">
                                                <el-input v-model="Param.type" placeholder="请输入类型名称"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="名字">
                                                <el-input v-model="Param.name" placeholder="请输入参数名字"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="排序">
                                                <el-input v-model="Param.sort" placeholder="请输入次序" type="number"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item label="必填" >
                                                <el-switch v-model="Param.must"></el-switch>
                                            </el-form-item>
                                        </el-col>
                                        
                                    </el-row>
                                    <el-row>
                                        <el-col :span="18">
                                            <el-form-item label="描述">
                                                <el-input type="areatext" placeholder="请输入这个参数的相关描述" v-model="Param.des"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" :offset="1">
                                            <el-button type="success" @click="onAddParam(devision.id,true)">添加</el-button>
                                            <el-button type="warning" @click="onAddParam(devision.id,false)" v-if="Param.id!=undefined">保存</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" :offset="0" >
                                <el-table :data="ParamList" stripe border :default-sort="{prop:'type',order:'ascending'}">
                                    <el-table-column prop="name" label="名字" width="180"></el-table-column>
                                    <el-table-column prop="type" label="类型" width="180"></el-table-column>
                                    <el-table-column prop="sort" label="次序" width="80"></el-table-column>
                                    <el-table-column label="必填" width="80">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.must==true"><i class="el-icon-success" style="color:red;"></i></span>
                                            <span v-if="scope.row.must==false"><i class="el-icon-error" style="color:green;"></i></span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="des" label="描述"></el-table-column>
                                    <el-table-column label="操作" fixed="right" width="100">
                                        <template slot-scope="scope">
                                            <el-button type="text" size="small" @click="onParamDelete(scope.row.id,devision.id)">删除</el-button>
                                            <el-button type="text" size="small" @click="onParamEdit(scope.row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import api from "@/utils/api";
export default {
  data: () => ({
    Devisions: [
      {
        params: []
      }
    ],
    activeDivision: "",
    Param: {
      type: "",
      name: "",
      sort: 0,
      must: false
    },
    ParamList: [],
  }),
  methods: {
    tabChange(tag) {
      let devision = this.Devisions.find(i => i.name == tag.name);
      this.freshTable(devision.id, devision);
    },
    freshTable(id) {
      api.getparamlist(id, response => {
        if (response.success == false) {
          this.$message.error(response.msg);
          return;
        }
        this.ParamList = response.data;
      });
    },
    onAddParam(id,isAdd) {
      if(isAdd){
          delete this.Param.id;
      }
      api.saveParamSet(this.Param, id, response => {
        if (response.success == false) {
          this.$message.error(response.msg);
          return;
        } else {
          this.$message.success("保存成功！");
          this.Param={};
        }
        this.freshTable(id);
      });
    },
    onParamDelete(paramid, devisionid) {
      this.$confirm("此操作会永久删除词条记录，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.deleteParamSet(paramid, response => {
          if (response.success == false) {
            this.$message.error(response.msg);
            return;
          }
          this.freshTable(devisionid);
        });
      });
    },
    onParamEdit(row) {
      this.$confirm("确定要编辑此条目？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.Param = row;
      });
    }
  },
  mounted() {
    api.getModuleSet(response => {
      if (response.success == false) {
        this.$message.error(response.msg);
        return;
      }
      this.activeDivision = response.data[0].name;
      this.Devisions = response.data;
      this.freshTable(response.data[0].id);
    });
  }
};
</script>

<style>
</style>
