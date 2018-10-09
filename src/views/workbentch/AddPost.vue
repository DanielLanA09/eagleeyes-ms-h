<template>
    <div>
        <el-row v-show="!CoverStarted" type="flex" justify="left">
            <el-col :span="10" >
                <el-form label-width="120px" :model="CoverForm">
                    <el-form-item label="封面图片" >
                        <e-uploader size="small" v-model="CoverForm.img" @change="saveCoverOnLoseFocus"></e-uploader>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input size="small" placeholder="请输入文章标题" v-model="CoverForm.title" @blur="saveCoverOnLoseFocus"></el-input>
                    </el-form-item>
                    <el-form-item label="项目">
                        <el-input size="small" placeholder="请输入楼盘项目" v-model="CoverForm.project" @blur="saveCoverOnLoseFocus"></el-input>
                    </el-form-item>
                    <el-form-item label="楼盘区域">
                        <el-input size="small" placeholder="请输入所属楼盘区域" v-model="CoverForm.projectDistrict" @blur="saveCoverOnLoseFocus"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input size="small" placeholder="请输入地址" v-model="CoverForm.address" @blur="saveCoverOnLoseFocus"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input size="small" placeholder="请输入相关描述" v-model="CoverForm.des" @blur="saveCoverOnLoseFocus"></el-input>
                    </el-form-item>
                    <el-form-item label="定位">
                        <el-col :span="11">
                            <el-form-item>
                                <el-input size="small" placeholder="纬度" v-model.number="CoverForm.latitude" type="number" @blur="saveCoverOnLoseFocus"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="1">
                            <el-form-item>
                                <el-input size="small" placeholder="经度" v-model.number="CoverForm.longitude" type="number" @blur="saveCoverOnLoseFocus"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="转发和浏览">
                        <el-col :span="11">
                            <el-form-item>
                                <el-input size="small" placeholder="请输入转发量" v-model="CoverForm.transmitC" type="number" @blur="saveCoverOnLoseFocus"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="1">
                            <el-form-item>
                                <el-input size="small" placeholder="请输入浏览量" v-model="CoverForm.viewC" type="number" @blur="saveCoverOnLoseFocus"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="选择价格">
                        <!-- <el-input placeholder="请选择楼盘关联价格" v-model="CoverForm.price" type="number" @blur="saveCoverOnLoseFocus"></el-input> -->
                        <el-select size="small" class="width-full" placeholder="请选择楼盘关联价格" v-model="CoverForm.buildingId" @change="setBuildingId(CoverForm.buildingId)" @blur="saveCoverOnLoseFocus">
                          <el-option v-for="p in priceAvail" :key="p.buildingBaseId" :label="p.project" :value="p.buildingBaseId">
                            <span style="float:left">{{p.price}} 元/平米</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{p.area}}-{{p.project}}</span>
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择标签">
                        <div class="inline" v-for="(tag,key) in CoverForm.tags" :key="key">
                            <el-tag :type="tag.type=='ADVANTAGE'?'success':'danger'" closable @close="onTagRemove(key)">{{tag.name}}</el-tag>
                        </div>
                        <el-row>
                            <el-col :span="5">
                              <el-select size="small" class="width-full" v-model="temTag.type" @change="onTagTypeChange">
                                <el-option label="请选择类型" value="NULL" :disabled="true"></el-option>
                                <el-option label="优点" value="ADVANTAGE"></el-option>
                                <el-option label="缺点" value="DISADVANTAGE"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="15">
                              <el-select size="small" multiple class="width-full" v-model="temTag.name">
                                <el-option v-for="(option,key) in availTags" :key="key" :label="option.label" :value="option.value" :disabled="option.disabled"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="4">
                                <el-button size="small" class="width-full" type="primary" @click="onTagAdd" @blur="saveCoverOnLoseFocus">确认</el-button>
                            </el-col>
                        </el-row>                        
                    </el-form-item>
                    <el-form-item label="选择区域">
                        <el-select size="small" v-model="CoverForm.district" class="width-full" @blur="saveCoverOnLoseFocus">
                            <el-option v-for="(c,k) in districtCode" :key="k" :label="c.label" :value="c.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="success" style="width:100%;" @click="onStartEditing">开始编辑文章</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-show="CoverStarted" type="flex" justify="left">
            <el-col :span="20">
                <el-tabs v-model="activeDevisionName" @tab-click="moduleChange" :tab-position="'left'">
                    <el-tab-pane :label="devision.name" :name="devision.name" v-for="(devision,devisionKey) in CoverForm.devisions" :key="devisionKey">
                        <el-form label-width="80px">
                            <el-row class="devision">
                                <el-form-item label="标准">
                                    <e-uploader v-model="devision.norm" @change="saveDevisionOnLoseFocus(devisionKey)"></e-uploader>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input size="medium" v-model="devision.des" placeholder="请输入文章相关描述" @blur="saveDevisionOnLoseFocus(devisionKey)" autofocus="true"></el-input>
                                </el-form-item>
                                <el-form-item label="排序" v-model="devision.sort">
                                    <el-col :span="7">
                                        <el-input size="medium" v-model="devision.sort" type="number" placeholder="请输入排序" @blur="saveDevisionOnLoseFocus(devisionKey)"></el-input>
                                    </el-col>
                                    <el-col :span="7" :offset="1">
                                        <el-select size="medium" v-model="devision.type" placeholder="请选择栏目类型" class="width-full" @blur="saveDevisionOnLoseFocus(devisionKey)">
                                            <el-option :label="'前言'" :value="'PREFACE'"></el-option>
                                            <el-option :label="'外部配套'" :value="'OUTERSET'"></el-option>
                                            <el-option :label="'内部配套'" :value="'INNERSET'"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8" :offset="1">
                                        <el-input size="medium" v-model="devision.mark" type="number" placeholder="请输入分数" @blur="saveDevisionOnLoseFocus(devisionKey)"></el-input>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="参数">
                                    <el-table size="mini" :data="devision.paramsList" border :default-sort="{prop:'sort',order:'ascending'}" style="width:100%;">
                                        <el-table-column prop="sort" label="序号" width="80"></el-table-column>
                                        <el-table-column prop="name" label="名字" width="120"></el-table-column>
                                        <el-table-column prop="type" label="类型" width="120"></el-table-column>
                                        <el-table-column prop="must" label="必填" width="120">
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.must==true"><i class="el-icon-success" style="color:red;"></i></span>
                                                <span v-if="scope.row.must==false"><i class="el-icon-error" style="color:green;"></i></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="des" label="描述" ></el-table-column>
                                        <el-table-column label="内容" >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.data" @blur="saveParamsOnLoseFocus(devisionKey)" ></el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-button type="warning" size="mini"  @click="resetDevParams(devision)">重设此栏目参数</el-button>
                                </el-form-item>
                            </el-row>
                            <el-row v-for="(_module,moduleKey) in devision.moduleList" :key="moduleKey" class="sub-devision">
                                <div class="margin-up-down-20"><el-alert title="子栏目" type="success" :center="true" :closable="true" close-text="删除" @close="deleteModule(devisionKey,moduleKey)"></el-alert></div>
                                <el-form-item label="标题">
                                    <el-col :span="24">
                                        <el-input size="small" v-model="_module.name" placeholder="请输入子栏目的标题" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></el-input>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input size="small" v-model="_module.des" placeholder="请输入子栏目描述" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></el-input>
                                </el-form-item>
                                <el-form-item label="属性">
                                    <el-col :span="3">
                                        <el-select size="small" placeholder="选择分支" v-model="_module.branch" @change="onBranchChange(devisionKey,moduleKey,$event)" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)">
                                            <el-option :label="'文本'" :value="'TITLE_CONTENT'"></el-option>
                                            <el-option :label="'图文'" :value="'TITLE_IMGS_CONTENT'"></el-option>
                                            <el-option :label="'列表'" :value="'TITLE_LIST'"></el-option>
                                            <!-- <el-option :label="'标签'" :value="'TITLE_KEY_VALUE'"></el-option> -->
                                        </el-select>
                                    </el-col>
                                    <el-col :span="3" :offset="1">
                                        <el-input size="small" placeholder="输入排序" type="number" v-model="_module.sort" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></el-input>
                                    </el-col>
                                    <el-col :span="4" :offset="1">
                                        <!-- <el-switch v-model="_module.status" active-text="启用" inactive-text="关闭"></el-switch> -->
                                        <el-select size="small" placeholder="选择状态" v-model="_module.status" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)">
                                            <el-option :label="'启用'" :value="0"></el-option>
                                            <el-option :label="'关闭'" :value="1"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="内容">
                                    <el-row>
                                        <el-col :span="24" v-if="_module.branch=='TITLE_CONTENT'">
                                            <el-input size="small" type="textarea" v-model="_module.content" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></el-input>
                                            <!-- <vue-editor v-model="_module.content" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></vue-editor> -->
                                        </el-col>
                                        <el-col :span="24" v-if="_module.branch=='TITLE_IMGS_CONTENT'">
                                            <div v-for="(list_item,list_key) in _module.content" :key="list_key">
                                              <e-uploader v-model="list_item.img" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></e-uploader>
                                              <div class="margin-up-down-10">
                                                  <el-input size="small" placeholder="输入图片的名字，使用“|”分割" v-model="list_item.imgNames" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></el-input>
                                              </div>
                                              <div class="margin-up-down-10">
                                                  <el-input size="small" type="textarea" v-model="list_item.content" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></el-input>
                                                  <!-- <vue-editor v-model="list_item.content" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)"></vue-editor> -->
                                              </div>
                                              <div class="h-right margin-bottom-10">
                                                <el-button size="small" type="warning" v-if="_module.content.length>1" @click="onImgContentListRemove(devisionKey,moduleKey,list_key)">删除此节</el-button>
                                              </div>
                                            </div>
                                            <div class="h-right">
                                              <el-button size="small" type="primary" @click="onImgContentListAdd(devisionKey,moduleKey)">继续添加</el-button>
                                            </div>
                                        </el-col>
                                        <el-col :span="24" v-if="_module.branch=='TITLE_LIST'">
                                            <div v-for="(property,pkey) in _module.content" :key="pkey" class="margin-up-down-10">
                                              <el-alert :type="property.type=='ADVANTAGE'?'success':'error'"  :title="property.content" @close="onContentListRemove(devisionKey,moduleKey,pkey)"></el-alert>
                                            </div>
                                            <div class="margin-up-down-10">
                                                <el-input size="small" v-model="temModuleContent.content" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)">
                                                    <el-select size="small" class="width-120"  v-model="temModuleContent.type" slot="prepend" placeholder="请选择类型" @blur="saveModuleOnLoseFocus(devisionKey,moduleKey)">
                                                        <el-option label="优点" value="ADVANTAGE"></el-option>
                                                        <el-option label="缺点" value="DISADVANTAGE"></el-option>
                                                    </el-select>
                                                    <el-button size="small" slot="append" type="success" @click="onContentListAdd(devisionKey,moduleKey)">添加</el-button>
                                                </el-input>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-row>
                            <el-form-item class="h-right">
                                <el-button size="small" type="success" @click="onAddModule(devisionKey)">添加子栏目</el-button>
                                <!-- <el-button type="warning" @click="onBackCover">返回封面</el-button> -->
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import api from "@/utils/api";
import { VueEditor } from "vue2-editor";
import eUploader from "@/components/Uploader.vue";

export default {
  components: {
    VueEditor,
    eUploader
  },
  data: () => ({
    BASE_URL: "",
    CoverForm: {
      tags: [],
      devisions: [
        {
          paramsList:[],
          moduleList: [
            {
              content: []
            }
          ]
        }
      ]
    },
    Tags: [],
    CoverStarted: false,
    activeDevisionName: "",
    temModuleContent: {
      type: "ADVANTAGE"
    },
    temTag: {
      type: "NULL",
      name: []
    },
    temParamList: [],
    districtCode: [
      {
        value: "520115",
        label: "观山湖区"
      },
      {
        value: "520102",
        label: "南明区"
      },
      {
        value: "520103",
        label: "云岩区"
      },
      {
        value: "520111",
        label: "花溪区"
      },
      {
        value: "520112",
        label: "乌当区"
      },
      {
        value: "520113",
        label: "白云区"
      }
    ],
    temImgList: "",
    availTags: [
      { label: "请先选择类型，在选择标签", value: "Null", disabled: true }
    ],
    priceAvail:[]
  }),
  computed: {
    setRequestHeader() {
      return {
        Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
        inputId: "file"
      };
    }
  },
  methods: {
    resetDevParams(dev){
      api.getPreDevParamsByName(dev.name,res=>{
        if(res.success){
          res.data.map(i=>{
            delete i.id;
          })
          dev.paramsList = res.data;
        }
      })
    },
    handleImgUrl(url, fileList) {
      url = "";
      fileList.map(file => {
        url += file.response.fileDownloadUri + "|";
      });
      url = url.substring(0, url.length - 1);
      return url;
    },
    onBackCover() {
      this.CoverStarted = false;
    },
    moduleChange(tab) {
      // eslint-disable-next-line
      console.log(tab);
    },
    onTagAdd() {
      for (let tag of this.temTag.name) {
        this.CoverForm.tags.push({
          type: this.temTag.type,
          name: tag
        });
      }

      this.temTag.name = [];
    },
    onTagRemove(key) {
      this.CoverForm.tags.splice(key, 1);
    },
    onStartEditing() {
      this.$confirm("你即将开始编辑文章，确认开始？", "警告", {
        confirmButtonText: "开始",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.saveCover();
      });
    },
    saveCover() {
      this.CoverForm.author = this.$store.state.USER.name;
      this.CoverForm.status = 0;
      let request = { cover: this.CoverForm, tags: this.CoverForm.tags };
      // this.CoverForm.img = this.temImgList;
      if (this.CoverForm.id != undefined) {
        api.saveCover(request, false, res => {
          if (res.success) {
            this.CoverStarted = true;
            this.$message.success("旧数据准备完毕，准备修改");
          } else {
            this.$message.error(res.msg);
          }
        });
        return;
      }
      api.saveCover(request, true, response => {
        if (response.success) {
          this.CoverForm = response.data;
          this.activeDevisionName = response.data.devisions[0].name;
          this.$message.success("数据准备完成，请继续编辑吧！");
          this.CoverStarted = true;
        } else {
          delete this.CoverForm.id;
          this.$message({
            message: response.msg,
            type: "error"
          });
        }
      });
    },
    onAddModule(key) {
      let module = {
        title: "",
        des: "",
        status: "",
        branch: "TITLE_CONTENT",
        content: "",
        jsonContent: ""
      };
      api.saveModule(module, this.CoverForm.devisions[key].id, res => {
        if (res.success) {
          res.data.content = "";
          this.CoverForm.devisions[key].moduleList.push(res.data);
          this.$message.success("子栏目准备就绪，开始编辑！");
        } else {
          this.$message.error("准备子模块时出现问题，因为：" + res.msg);
        }
      });
    },
    deleteModule(devisionKey, moduleKey) {
      let module = this.CoverForm.devisions[devisionKey].moduleList[moduleKey];
      api.deleteModule(module.id, res => {
        if (res.success) {
          this.CoverForm.devisions[devisionKey].moduleList.splice(moduleKey, 1);
        }
      });
    },
    onContentListAdd(devisionKey, moduleKey) {
      let content = this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content;
      content.push({
        type: this.temModuleContent.type,
        content: this.temModuleContent.content
      });
      this.temModuleContent.content = "";
      this.saveModuleOnLoseFocus(devisionKey, moduleKey);
    },
    onImgContentListAdd(devisionKey,moduleKey){
      let content = this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content;
      content.push({
        img:"",
        imgNames:"",
        content:""
      })
    },
    onContentListRemove(devisionKey, moduleKey, listKey) {
      let content = this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content;
      content.splice(listKey, 1);
      this.saveModuleOnLoseFocus(devisionKey, moduleKey);
    },
    onImgContentListRemove(devisionKey, moduleKey, listKey){
      this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content.splice(listKey,1);    
      this.saveModuleOnLoseFocus(devisionKey, moduleKey);  
    },
    onBranchChange(devisionKey, moduleKey, event) {
      if (event == "TITLE_CONTENT") {
        this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content = "";
      } else if (event == "TITLE_IMGS_CONTENT") {
        this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content = [
          {
            img:"",
            imgNames:"",
            content:""
          }
        ];
      } else if (event == "TITLE_LIST") {
        this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content = [];
      } else if (event == "TITLE_KEY_VALUE") {
        api.getParamListByName(this.activeDevisionName, response => {
          response.data.object.map(i => delete i.id);
          this.CoverForm.devisions[devisionKey].moduleList[moduleKey].content = {
            ParamList: response.data.object
          };
        });
      }
    },
    saveDevisionOnLoseFocus(devisionIndex) {
      let devision = this.CoverForm.devisions[devisionIndex];
      api.saveDevision(devision, this.CoverForm.id, res => {
        if (res.success) {
          // this.$message.success(devision.name+" 自动保存完毕！");
          devision = res.data;
        } else {
          this.$message.error(devision.name + " 自动保存失败！因为" + res.msg);
        }
      });
      this.saveParamsOnLoseFocus(devisionIndex);
    },
    saveModuleOnLoseFocus(devisionIndex, moduleIndex) {
      let module = this.CoverForm.devisions[devisionIndex].moduleList[
        moduleIndex
      ];
      module.jsonContent = JSON.stringify(module.content);
      let devision = this.CoverForm.devisions[devisionIndex];
      api.saveModule(module, devision.id, res => {
        if (!res.success) {
          this.$message.error(module.name + " 自动保存失败！因为" + res.msg);
        }
      });
    },
    saveParamsOnLoseFocus(devisionIndex) {
      let devision = this.CoverForm.devisions[devisionIndex];
      api.saveParams(
        { devisionId: devision.id, params: devision.paramsList },
        () => {}
      );
    },
    saveCoverOnLoseFocus() {
      this.getBuildingPrice(this.CoverForm.project)
      if (this.CoverForm.id) {
        api.saveCover(this.CoverForm, res => {
          if (res.success) {
            this.$message.success("修改已保存！");
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    setBuildingId(id){
      let price = this.priceAvail.find(item=>item.buildingBaseId==id);
      this.CoverForm.price = price.price;    
    },
    getBuildingPrice(project){
      api.getBuildingPrice(project,res=>{
        if(res.success){
          this.priceAvail = res.data;
        }else{
          this.$message.warning("未找到"+project+"相关的价格，默认为空")
        }
      })
    },
    
    reset() {
      this.BASE_URL = api.BASE_URL;
      let user = JSON.parse(localStorage.getItem("USER"));
      this.$store.commit("SET_USER", user);
    },
    onTagTypeChange(val) {
      this.getTagByType(val);
    },
    getTagByType(type) {
      api.getTagByType(type, res => {
        if (res.success) {
          let options = [];
          for (let o of res.data) {
            options.push({ label: o.name, value: o.name, disabeld: false });
          }
          this.availTags = options;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  mounted() {
    this.reset();
    if (this.$store.state.COVER.id != undefined) {
      this.CoverForm = this.$store.state.COVER;
      this.activeDevisionName = this.CoverForm.devisions[0].name;
    }
  },
  beforeRouteUpdate(to, from, next) {
    // eslint-disable-next-line
    console.log("Entering", to, from, next);
  }
};
</script>

<style scoped lang="less">
.sub-devision {
  padding: 20px 0;
  .title {
    font-size: 14px;
  }
}
</style>
