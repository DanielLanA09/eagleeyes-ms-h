<template>
    <div>
        <el-table :data="questions" border>
            <el-table-column prop="id" label="序号" width="80"></el-table-column>
            <el-table-column prop="question" label="问题" ></el-table-column>
            <el-table-column prop="type" label="状态" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.type=='COMMIT'">已提交</span>
                    <span v-if="scope.row.type=='PASSED'">已审核</span>
                    <span v-if="scope.row.type=='RESOLVED'">已解决</span>
                    <span v-if="scope.row.type=='CLOSE'">已关闭</span>
                </template>
            </el-table-column>
            <el-table-column prop="isHidden" label="匿名" width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.hidden==true">是</span>
                    <span v-if="scope.row.hidden==false">否</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="checkQuestion(scope.row)">回复</el-button>
                    
                    <el-button type="text" @click="deleteQuestion(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="问题详情" :visible.sync="showQuestion">
            <div class="speaker">
                <div class="user">
                    <span>{{questionModel.user}}:</span>
                </div>
                <div class="content">
                    {{questionModel.question}}
                </div>
            </div>
            <div class="speaker" v-if="questionModel.answer.reply.length>0">
                <div class="user">
                    <span>{{questionModel.answer.username}}:</span>
                </div>
                <div class="content">
                    {{questionModel.answer.reply}}
                </div>
            </div>
            <div class="form">
                <div >
                    <el-input type="textarea" class="user-input" v-model="answerModel.reply"></el-input>
                </div>
                <div slot="footer" class="form-footer">
                    <el-button  @click="showQuestion = false">关闭</el-button>
                    <el-button type="primary" @click="commitAnswer">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "@/utils/api.js";
export default {
  data: () => ({
    USER: {},
    questions: [],
    questionModel: {
      answer: {
        username: "",
        reply: ""
      }
    },
    answerModel: {},
    showQuestion: false,
    pageable: {
      page: 0,
      size: 20
    }
  }),
  methods: {
    cleanQuestion() {
      this.questionModel.answer.username = "";
      this.questionModel.answer.reply = "";
    },
    checkQuestion(row) {
      this.cleanQuestion();
      this.questionModel.id = row.id;
      this.questionModel.question = row.question;
      this.checkMiniUser(row.userId, () => {
        this.checkAnswer(row.id, () => {
          this.showQuestion = true;
        });
      });
    },
    checkAnswer(id, callback) {
      api.userAnswer(id, this, res => {
        this.questionModel.answer = res[0];
        if (!this.questionModel.answer) {
          this.questionModel.answer = { reply: "" };
        }
        callback();
      });
    },
    checkMiniUser(id, callback) {
      api.miniUser(id, this, res => {
        this.questionModel.user = res.nickName;
        callback();
      });
    },
    commitAnswer() {
      this.answerModel.username = this.USER.username;
      api.saveAnswer(this.answerModel, this.questionModel.id, this, () => {
        this.showQuestion = false;
        this.answerModel.reply = "";
      });
    },
    deleteQuestion(row) {
      this.$confirm("此操作将会永久删除此问题，确认？", "提示", {
        type: "warning"
      }).then(() => {
        api.deleteUserQuestion(row.id, this, () => {
          this.findQuestions();
        });
      });
    },
    findQuestions() {
      api.userQuestions(this.pageable, this, res => {
        this.questions = res.content;
      });
    }
  },
  mounted() {
    this.USER = JSON.parse(localStorage.getItem("USER"));
    this.findQuestions();
  }
};
</script>

<style scoped lang="less">
.speaker {
  margin-top: 10px;
}
.speaker:first-child {
  margin-top: 0;
}
.user {
  width: 150px;
  font-size: 24px;
}
.content {
}
.user-input {
}
.form {
  margin-top: 10px;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
</style>
