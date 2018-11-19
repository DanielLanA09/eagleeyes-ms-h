<template>
    <div>
        <div class="margin-bottom-20 h-left">
            <el-button size="mini" type="primary" @click="addNewBlock">添加</el-button>
        </div>
        <div>
            <el-table border style="width:100%;" :data="blockList" :row-class-name="setWarning">
                <el-table-column label="序号" width="80" prop="id"></el-table-column>
                <el-table-column label="名字" width="150" prop="name"></el-table-column>
                <el-table-column label="状态" width="80" prop="active">
                  <template slot-scope="scope">
                    <span v-if="scope.row.active">启用</span>
                    <span v-if="!scope.row.active">未启用</span>
                  </template>
                </el-table-column>
                <el-table-column label="次序" width="80" prop="position"></el-table-column>
                <el-table-column label="类型" width="150" prop="type">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type=='SWIPER'">轮播</span>
                    <span v-if="scope.row.type=='BODY'">主体</span>
                    <span v-if="scope.row.type=='HOT'">热门</span>
                    <span v-if="scope.row.type=='ARTICLE'">公众号文章</span>
                  </template>
                </el-table-column>
                <el-table-column label="图片" prop="img"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editBlock(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="setLink(scope.row)">设置文章</el-button>
                        <el-button type="text" size="small" @click="deleteBlock(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>      
        </div>
        <el-dialog :visible.sync="addBlockShow" width="30%">
            <el-form label-width="100px" :model="blockModel">
                <el-form-item label="位置">
                    <el-select class="width-full" v-model="blockModel.type" size="mini">
                        <el-option label="轮播" value="SWIPER"></el-option>
                        <el-option label="主体" value="BODY"></el-option>
                        <el-option label="热门" value="HOT"></el-option>
                        <el-option label="文章" value="ARTICLE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名字">
                    <el-input size="mini" v-model="blockModel.name"></el-input>
                </el-form-item>
                <el-form-item label="秩序" v-if="blockModel.type=='BODY'">
                    <el-input size="mini" v-model.number="blockModel.position"></el-input>
                </el-form-item>
                <el-form-item label="启用">
                    <el-switch v-model="blockModel.active"></el-switch>
                </el-form-item>
                <el-form-item label="背景图片" v-if="blockModel.type=='BODY'">
                    <uploader v-model="blockModel.img"></uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" >
                <el-button @click="addBlockShow=false">关闭</el-button>
                <el-button type="primary" @click="addBlockConfirm">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="addLinkShow" width="50%">
            <el-form label-width="100px" :model="linkModel">
                <el-form-item label="标题">
                    <el-input size="mini" v-model="linkModel.title"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="linkModel.type" class="width-full" size="mini">
                      <el-option label="公众号文章" value="PUBLIC_ARTICLE"></el-option>
                      <el-option label="测评文章" value="TEST_ARTICLE"></el-option>
                  </el-select>
                </el-form-item> 
                <el-form-item label="链接" v-if="linkModel.type=='PUBLIC_ARTICLE'">
                    <el-input size="mini" v-model="linkModel.link"></el-input>
                </el-form-item>
                <el-form-item label="秩序">
                    <el-input size="mini" v-model.number="linkModel.position"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <uploader v-model="linkModel.img"></uploader>
                </el-form-item>
                <el-form-item label="列表" :default-sort="{prop:'postion',order:'ascending'}">
                    <el-table border :data="linkList" height="250">
                        <el-table-column width="80" label="序号" prop="id"></el-table-column>
                        <el-table-column width="150" label="类型" prop="type">
                          <template slot-scope="scope">
                            <span v-if="scope.row.type=='PUBLIC_ARTICLE'">公众号文章</span>
                            <span v-if="scope.row.type=='TEST_ARTICLE'">测评文章</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="标题" prop="title"></el-table-column>
                        <el-table-column label="链接地址" prop="link"></el-table-column>
                        <el-table-column label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="deleteLink(scope.row.id)">删除</el-button>
                            <el-button type="text" size="mini" @click="editLink(scope.row)">编辑</el-button>                            
                          </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" @click="addLinkShow=false">关闭</el-button>
                <el-button type="warnning" size="mini" @click="updateLink">更新</el-button>
                <el-button type="primary" size="mini" @click="saveLink">添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "@/utils/api";
import uploader from "@/components/Uploader";
export default {
  components: {
    uploader
  },
  data: () => ({
    blockList: [],
    linkList: [],
    addBlockShow: false,
    addLinkShow: false,
    blockModel: {
      active: true
    },
    linkModel: {}
  }),
  methods: {
    addNewBlock() {
      this.blockModel = {};
      this.addBlockShow = true;
    },
    addBlockConfirm() {
      api.saveBlock(this.blockModel, this, () => {
        this.findBlockList();
        this.addBlockShow = false;
      });
    },
    findBlockList() {
      api.blockList(res => {
        this.blockList = res.data;
      });
    },
    editLink(link) {
      this.linkModel = link;
    },
    setWarning(row) {
      if (row.row.active) {
        return "warning";
      } else {
        return "active";
      }
    },
    editBlock(row) {
      this.blockModel = row;
      this.addBlockShow = true;
    },

    deleteBlock(id) {
      this.$confirm("确认删除？").then(() => {
        api.deleteBlock(id, res => {
          if (res.success) {
            this.$notify.success({
              title: "提示",
              message: "删除成功"
            });
            this.findBlockList();
          } else {
            this.$notify.error({
              title: "警告",
              message: res.msg
            });
          }
        });
      });
    },
    setLink(row) {
      this.linkModel = {};
      this.linkModel.blockId = row.id;
      this.blockModel = row;
      this.findLinks(row.id);
    },
    findLinks(pid) {
      api.findLinkList(pid, this, res => {
        res.sort((a,b)=>a.position-b.position);
        this.linkList = res;
        this.addLinkShow = true;
      });
    },
    updateLink() {
      api.saveLink(this.linkModel, this, () => {
        this.findLinks(this.linkModel.blockId);
      });
    },
    saveLink() {
      delete this.linkModel.id;
      api.saveLink(this.linkModel, this, () => {
        this.findLinks(this.linkModel.blockId);
      });
    },
    deleteLink(pid) {
      this.$confirm("确定删除？").then(() => {
        let id = this.linkModel.blockId;
        api.deleteLink(pid, this, () => {
          this.findLinks(id);
        });
      });
    }
  },
  mounted() {
    this.findBlockList();
  }
};
</script>

<style scoped lang="less">
.warning {
  background-color: wheat;
}
.active {
  background-color: white;
}
</style>
