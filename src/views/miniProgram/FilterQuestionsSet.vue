<template>
    <div>
        <div class="operation">
            <el-button type="success" size="mini" @click="onAddNew">添加新问题</el-button>
        </div>
        <div class="questions-grid">
            <el-card class="card" shadow="hover" v-for="(q,k) in questions" :key="k">
                <div slot="header">
                    <span>{{q.title}}</span>
                    <el-button style="float:right;padding: 3px 0;" type="text" @click="onDelete(q)">删除</el-button>
                    <el-button style="float:right;padding: 3px 0;" type="text" @click="onEdit(q)">编辑</el-button>
                </div>
                <div>
                    <div v-for="(o,ok) in q.options" :key="ok">{{o.content}}</div>
                </div>
            </el-card>
        </div>
        <el-dialog title="添加" :visible.sync="addVisible">
            <el-form label-width="80px" :model="question">
                <el-form-item label="问题标题">
                    <el-col :span="16">
                        <el-input size="small" v-model="question.title"></el-input>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-input size="small" v-model="question.max" type="number" placeholder="最大选中数量"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="选项内容">
                    <el-input size="small" v-model="temOption.content"></el-input>
                </el-form-item>
                <el-form-item label="选项标签">
                    <el-col :span="20">
                        <el-select class="width-full" size="small" multiple v-model="temOption.tags">
                            <el-option v-for="(t,k) in tags" :key="k" :label="t.name" :value="t.name"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <el-button class="width-full" size="small" type="primary" @click="addOption">加入</el-button>
                    </el-col>
                </el-form-item>
                <div style="margin-left:80px;margin-top:5px;" v-for="(op,ok) in question.options" :key="ok" >
                    <el-alert :title="op.content+'('+op.tags+')'" type="success" @close="removeOption(ok)"></el-alert>
                </div>
            </el-form>
            <div slot="footer">
                <el-button size="mini" type="warning" @click="addVisible=false">取消</el-button>
                <el-button size="mini" type="success" @click="addConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "@/utils/api";
export default {
  data: () => ({
    addVisible: false,
    question: {},
    questions: [],
    tags: [],
    temOption: {}
  }),
  methods: {
    onAddNew() {
      this.question = {};
      this.addVisible = true;
    },
    onEdit(q) {
      this.question = q;
      this.addVisible = true;
    },
    onDelete(q){
        api.deleteQuestion(q.id,res=>{
            if(res.success){
                this.$message.success("删除成功！")
                this.getQuestions();
            }
        })
    },
    addConfirm() {
      if(this.question.max>1){
        this.question.multiple = true
      }
      api.saveQuestion(this.question, res => {
        if (res.success) {
          this.$message.success("添加成功！");
          this.getQuestions();
        } else {
          this.$message.console.error(res.msg);
        }
      });
    },
    getQuestions() {
      api.getQuestions(res => {
        if (res.success) {
          this.questions = res.data;
        } else {
          this.$message.error("获取问题列表出错：", res.msg);
        }
      });
    },
    addOption() {
      if (!this.question.options) {
        this.question.options = [];
      }
      this.temOption.tags = this.temOption.tags.join(",");
      this.temOption.checked = false;
      this.question.options.push(this.temOption);
      this.temOption = { content: "", tags: [] };
    },
    removeOption(index) {
      this.question.options.splice(index, 1);
    }
  },
  mounted() {
    this.getQuestions();
    api.getTagByType("ADVANTAGE", res => {
      if (res.success) {
        this.tags = res.data;
      }
    });
  }
};
</script>

<style scoped lang="less">
.operation {
  margin-bottom: 15px;
}
.questions-grid {
  .card {
    float: left;
    width: 500px;
    margin-top: 15px;
    margin-right: 15px;
  }
  .card:first-child {
    margin-left: 0;
  }
}
</style>
