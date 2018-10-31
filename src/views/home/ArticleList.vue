<template>
    <div class="table-back">
        <div class="search-box">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-input placeholder="输入标题进行搜索" v-model="keywords">
                        <el-select slot="prepend" placeholder="全部" v-model="condition" class="input-with-select">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="仅自己" value="1"></el-option>
                            <el-option label="未发布" value="2"></el-option>
                            <el-option label="已发布" value="3"></el-option>
                        </el-select>
                        <el-button slot="append"  icon="el-icon-search" @click="requestList"></el-button>
                    </el-input>
                </el-col>
                <!-- <el-button @click="getAllOldList">oldList</el-button>
                <el-button @click="getParams">retriveParams</el-button>
                <el-button @click="parse">parse</el-button>
                <el-button @click="save">save</el-button> -->
            </el-row>
        </div>
        <div class="table-box">
            <el-table :data="articleList.content" border stripe :default-sort="{prop:'updatedAt',order:'ascending'}">
                <el-table-column label="序号" width="60" prop="id"></el-table-column>
                <el-table-column label="标题" width="120" prop="title"></el-table-column>
                <el-table-column label="区域" width="80" prop="district"></el-table-column>
                <el-table-column label="楼盘" width="180" prop="project"></el-table-column>
                <el-table-column label="状态" width="120" prop="status">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status==0">已发布</span>
                    <span v-if="scope.row.status==1">未发布</span>
                  </template>
                </el-table-column>
                <el-table-column label="地址" prop="address"></el-table-column>
                <el-table-column label="价格" width="80" prop="price"></el-table-column>
                <el-table-column label="创建时间" width="180" prop="createdAt"></el-table-column>
                <el-table-column label="更新时间" width="180" prop="updatedAt"></el-table-column>
                <el-table-column label="作者" width="80" prop="author"></el-table-column>
                <el-table-column label="操作" fixed="right" width="160">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="small">查看</el-button> -->
                        <el-button type="text" size="small" @click="publish(scope.row)">发布</el-button>
                        <el-button type="text" size="small" @click="editCover(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteCover(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer">
            <el-pagination background layout="prev,pager,next,total,jumper" 
            :total="articleList.totalElements" :page-size="articleList.size" :page-count="articleList.totalPages"
            @current-change="onPageChange"></el-pagination>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api";
import oldCover from "@/utils/oldData.json";
import oldParam from "@/utils/oldParam.json";
import devSet from "@/utils/devSet.json";
import paramSet from "@/utils/paramSet.json";

export default {
  data: () => ({
    articleList: [],
    condition: "",
    pageable: {
      size: 10,
      page: 0
    },
    keywords: "",
    oldList: [],
    oldParamList: [],
    newList: [],
    devSet: [],
    paramSet: [],
    cIndex: 0
  }),
  methods: {
    save() {
      api.saveAllCover(this.newList[this.cIndex], res => {
        if (res.success) {
          this.$message.success("success");
          this.cIndex++;
          this.save();
        }
      });
    },
    parse() {
      this.newList = [];
      for (const oldCover of this.oldList) {
        let newCover = {
          title: oldCover.title,
          img: oldCover.coverImg.substring(38, oldCover.coverImg.length),
          latitude: parseFloat(oldCover.latitude),
          longitude: parseFloat(oldCover.longitude),
          status: 0,
          des: oldCover.description,
          viewC: oldCover.viewCount,
          transmitC: oldCover.forwardCount,
          address: oldCover.place,
          project: oldCover.project,
          projectDistrict: oldCover.projectDistrict,
          district: oldCover.cityDistrict,
          price: oldCover.price,
          tags: [],
          devisions: []
        };
        for (const oldtag of oldCover.tags) {
          newCover.tags.push({
            name: oldtag.name,
            type: oldtag.tagType == 1 ? "ADVANTAGE" : "DISADVANTAGE"
          });
        }
        for (const tab of oldCover.tabs) {
          switch (tab.title) {
            case "楼房信息": {
              tab.title = "楼房布局";
              break;
            }
            case "绿化保洁":{
              tab.title = "小区绿化";
              break;
            }
          }
          let devSet = this.devSet.find(i => i.name == tab.title);
          if (!devSet) {
            // eslint-disable-next-line
            console.log("error:", tab, tab.title);
          }
          let newDevision = {
            name: tab.title,
            type: devSet.type,
            mark: tab.goodValue,
            modules: [],
            devisionParams: [],
            devSetId: devSet.id
          };
          for (const subTab of tab.subTabs) {
            let newModule = {
              name: subTab.title,
              content: [],
              jsonContent: ""
            };
            if (subTab.comparison) {
              newModule.branch = "TITLE_LIST";
              newModule.content = [];
              let advantageTem = subTab.advantage.split("|");
              let disadvantageTem = subTab.disadvantage.split("|");
              for (const advantage of advantageTem) {
                newModule.content.push({
                  type: "ADVANTAGE",
                  content: advantage
                });
              }
              for (const disadvantage of disadvantageTem) {
                newModule.content.push({
                  type: "DISADVANTAGE",
                  content: disadvantage
                });
              }
              newModule.jsonContent = JSON.stringify(newModule.content);
              newDevision.modules.push(newModule);
              continue;
            }
            if (subTab.title == "小区干货") {
              newModule.branch = "TITLE_CONTENT";
              let temContent = [];
              for (const post of subTab.posts) {
                temContent.push(post.content);
              }
              newModule.content = temContent;
              newModule.jsonContent = JSON.stringify(newModule.content);
              newDevision.modules.push(newModule);
              continue;
            }
            for (const post of subTab.posts) {
              newModule.branch = "TITLE_IMGS_CONTENT";
              let imgTem = {
                content: post.content,
                imgNames: "",
                img: ""
              };
              for (const img of post.imgs) {
                imgTem.imgNames += "|" + img.imgDescription;
                imgTem.img += "|" + img.url.substring(38, img.url.length);
              }
              imgTem.imgNames = imgTem.imgNames.substring(
                1,
                imgTem.imgNames.length
              );
              imgTem.img = imgTem.img.substring(1, imgTem.img.length);

              newModule.content.push(imgTem);
            }
            newModule.jsonContent = JSON.stringify(newModule.content);
            newDevision.modules.push(newModule);
          }
          for (const addition of tab.additions) {
            let type = addition.typeName;

            for (const additionInfo of addition.additionInfo) {
              newDevision.devisionParams.push({
                type: type,
                name: additionInfo.keyName,
                data: additionInfo.keyValue,
                must: additionInfo.need,
                paramSetId: additionInfo.paramSetId,
                sort: additionInfo.sort
              });
            }
          }
          newCover.devisions.push(newDevision);
        }

        this.newList.push(newCover);
      }
    },
    getAllOldList() {
      // api.getAllOldCovers(res => {
      //   if (res.success) {
      //     this.oldList = res.data;
      //   }
      // });
      // api.getModuleSet(res=>{
      //   this.devSet = res.data;
      // })
      // api.getAllParamSet(res=>{
      //   this.paramSet = res.data;
      // })
      this.oldList = oldCover;
      this.oldParamList = oldParam;
      this.paramSet = paramSet;
      this.devSet = devSet;
    },
    getParams() {
      let that = this;
      for (var i = 0; i < this.oldList.length; i++) {
        for (var j = 0; j < this.oldList[i].tabs.length; j++) {
          this.oldList[i].tabs[j] = Object.assign(
            this.oldList[i].tabs[j],
            this.oldList[i].tabs[j],
            this.oldParamList[i].tabs[j]
          );
          this.oldList[i].tabs[j].additions.forEach(a => {
            a.additionInfo.forEach(i => {
              let paramSet = that.paramSet.find(j => j.name == i.keyName);
              if (!paramSet) {
                // eslint-disable-next-line
                console.log("error:", i.keyName);
                i.paramSetId = 0;
                i.sort = 0;
              }
              if (paramSet) {
                i.paramSetId = paramSet.id;
                i.sort = paramSet.sort;
              }
            });
          });
        }
      }
      // eslint-disable-next-line
      console.log(this.oldList);
    },
    onPageChange(val) {
      this.pageable.page = --val;
      this.requestList();
    },
    requestList() {
      api.getArticleList(this.keywords, this.pageable, res => {
        if (res.success) {
          this.articleList = res.data;
        } else {
          this.$message.error("似乎出错了，请呼叫管理人员！");
        }
      });
    },
    publish(cover) {
      this.$confirm("此操作将发布这条数据到小程序，是否继续？", "警告！", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cover.status = 0;
        api.publish(cover, res => {
          if (res.success) {
            this.$message.success("发布成功！");
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    deleteCover(cover) {
      this.$confirm("此操作会永久删除这条数据，是否继续？", "警告！", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.deleteCover(cover.id, res => {
          if (res.success) {
            this.$message.success("删除完成！");
            this.pageable.page = 0;
            this.requestList();
          } else {
            this.$message.error("出现错误，请联系管理员！");
          }
        });
      });
    },
    editCover(cover) {
      api.getCover(cover.id, res => {
        if (res.success) {
          this.$store.commit("EDIT_COVER", res.data);
          this.$router.replace({ path: "/home/addpost" });
          this.$store.commit("SET_CURRENT_NAV", "1-1");
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  mounted() {
    this.requestList();
  }
};
</script>

<style lang="less" scoped>
.table-back {
  height: 100%;
}
.search-box {
  padding: 20px 0;
}
.table-box {
  height: 95%;
}
.footer {
  margin-top: 3px;
  display: flex;
  justify-content: flex-end;
}
.input-with-select {
  // background-color: #fff;
  width: 130px;
}
</style>
