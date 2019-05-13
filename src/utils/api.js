import axios from "axios"
import router from '@/router'
import store from "@/store";
// const API_BASE_URL = 'http://192.168.31.252:30080/ealgeeyes-ms-3.0/api'
// const API_BASE_URL = 'https://www.eagleshing.com/ealgeeyes-ms-3.0/api'
// const API_BASE_URL = 'http://localhost:8090/api'

axios.defaults.baseURL = process.env.VUE_APP_BASEURL

axios.interceptors.request.use(
    config => {
        // config.headers.Authorization = "Bearer " + localStorage.getItem("ACCESS_TOKEN")
        config.headers.Authorization = "Bearer " + store.state.ACCESS_TOKEN
        return config;
    },
    error => {
        return Promise.reject(error)
    })

axios.interceptors.response.use(
    response => {
        switch (response.status) {
            case 200:
                {
                    return response;
                }
            case 201:
                {
                    return response;
                }
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    {
                        router.replace({
                            name: "login"
                        });
                        break;
                    }
                case 404:
                    {
                        return "未找到此接口！";
                    }
            }
        }
        return Promise.reject(error)
    }
);

function returnSuccess(response, callBack) {
    callBack({
        success: true,
        data: response.data
    })
}

function returnError(error, callBack) {
    let msg = ""
    if (error.response != undefined) {
        msg = error.response.data
    } else if (error.message != undefined) {
        msg = error.message;
    }
    callBack({
        success: false,
        msg: msg.message
    });
}

function returnResult(result, callBack, that, success, successMsg) {
    if (success) {
        if (that.$notify) {
            that.$notify.success({
                title: "提示",
                message: successMsg
            })
        }
        callBack(result.data);
    } else {
        let msg = ""
        if (result.response) {
            msg = result.response.data.error;
        } else if (result.message) {
            msg = result.message
        } else if (msg.length == 0) {
            msg = "服务器错误，请查看日志"
        }
        if (that) {
            that.$notify.error({
                title: "警告",
                message: msg
            })
        }
        callBack(result.data);
    }
}

export default {
    BASE_URL: process.env.VUE_APP_BASEURL,
    signup(signupRequest) {
        axios.post("/auth/signup", signupRequest).then(() => {
            router.replace({
                name: "login"
            });
        })
    },
    signin(signinRequest, callBack) {
        axios.post("/auth/signin", signinRequest).then(res => {
            localStorage.setItem("ACCESS_TOKEN", res.data.accessToken)
            store.commit("SIGN_IN", res.data.accessToken);
            callBack({
                success: true,
                data: res.data
            });
        }).catch(erro => {
            callBack({
                success: false,
                data: erro
            })
        })
    },
    getUserInfo(usernameRequest) {
        axios.get("/users/" + usernameRequest).then((response) => {
            localStorage.setItem("USER", JSON.stringify(response.data))
            store.commit("SET_USER", response.data);
        })
    },

    saveModuleSet(module, callBack) {
        axios.post("/postmanage/savedevisionset", module).then(response => {
            callBack({
                success: true,
                data: response.data.object
            })
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getModuleSet(callBack) {
        axios.get("/postmanage/getalldevisionset").then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteModuleSet(id, callBack) {
        axios.delete("/postmanage/deletedevisionset/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveCover(Cover, prepare, callBack) {
        axios.post("/post/savecover/" + prepare, Cover).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getAllParamSet(callBack) {
        axios.get("/postmanage/getallparamset").then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveParamSet(param, id, callBack) {
        axios.post("/postmanage/savaparamset/" + id, param).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteParamSet(id, callBack) {
        axios.delete("/postmanage/deleteparamset/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getparamlist(id, callBack) {
        axios.get("/postmanage/getparamlist/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getParamListByName(name, callBack) {
        axios.get("/postmanage/getparamlistbyname/" + name).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveDevisions(request, callBack) {
        axios.post("/post/savedevisions", request).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            callBack({
                success: false,
                msg: error.response.data.response
            });
        })
    },
    saveDevision(devision, coverId, callBack) {
        axios.post("/post/savedevision/" + coverId, devision).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveModule(module, devisionId, callBack) {
        axios.post("/post/savemodule/" + devisionId, module).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getArticleList(title, pageable, callBack) {
        axios.get("/post/getall/" + title, {
            params: pageable
        }).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteModule(id, callBack) {
        axios.delete("/post/deletemodule/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveParams(request, callBack) {
        axios.post("/post/saveparams", request).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteCover(id, callBack) {
        axios.delete("/post/deletecover/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getCover(id, callBack) {
        axios.get("/post/getcover/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getTagSetList(pageable, callBack) {
        axios.get("/postmanage/gettagsets", {
            params: pageable
        }).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveTagSet(tagSet, callBack) {
        axios.post("/postmanage/savetagset", tagSet).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteTagSet(id, callBack) {
        axios.delete("/postmanage/deletetagset/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getTagByType(type, callBack) {
        axios.get("/postmanage/gettagbytype/" + type).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getBuildingPrice(project, callBack) {
        axios.get("/scrapy/findByProject/" + project).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getAllOldCovers(callBack) {
        axios.get("/post/getoldcover").then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getOldParams(request, callBack) {
        axios.get("/post/fetchcoverforparams", request).then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveAllCover(cover, callBack) {
        axios.post("/post/saveall", cover).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveQuestion(request, callBack) {
        axios.post("/postmanage/addquestion", request).then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteQuestion(id, callBack) {
        axios.delete("/postmanage/deletequestion/" + id).then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getQuestions(callBack) {
        axios.get("/postmanage/getquestions").then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    publish(data, callBack) {
        axios.post("/post/publish", data).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getDevision(coverId, devName, callBack) {
        axios.get("/post/getdevisionbyname/" + coverId + "/" + devName).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    updatePrice(callBack) {
        axios.get("/post/updateprice").then(res => {
            returnSuccess(res, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveBlock(data, that, callBack) {
        axios.post("/link/saveblock", data).then(res => {
            returnResult(res, callBack, that, true, "保存板块成功！")
        }).catch(error => {
            returnResult(error, callBack, that, false)
        })
    },
    blockList(callBack) {
        axios.get("/link/findblocks").then(res => {
            returnSuccess(res, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteBlock(id, callBack) {
        axios.delete("/link/deleteblock/" + id).then(res => {
            returnSuccess(res, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    findLinkList(pid, that, callBack) {
        axios.get("/link/findarticlelinks", {
            params: {
                blockId: pid
            }
        }).then(res => {
            returnResult(res, callBack, that, true, "获取链接列表成功！")
        }).catch(error => {
            returnResult(error, callBack, that, false)
        })
    },
    saveLink(data, that, callBack) {
        axios.post("/link/savelink", data).then(res => {
            returnResult(res, callBack, that, true, "保存连接成功！")
        }).catch(error => {
            returnResult(error, callBack, that, false)
        })
    },
    deleteLink(id, that, callBack) {
        axios.delete("/link/deletelink/" + id).then(res => {
            returnResult(res, callBack, that, true, "删除连接成功！")
        }).catch(error => {
            returnResult(error, callBack, that, false)
        })
    },
    userQuestions(pageable, that, callBack) {
        axios.get("/users/userquestions", {
            params: {
                page: pageable.page,
                size: pageable.size
            },
            callBack
        }).then(res => {
            returnResult(res, callBack, that, true, "获取问题列表完成")
        })
    },
    userAnswer(id, that, callBack) {
        axios.get("/users/questionansers", {
            params: {
                id: id
            },
            callBack
        }).then(res => {
            returnResult(res, callBack, that, true, "获取回复完成！")
        })
    },
    miniUser(id, that, callBack) {
        axios.get("/users/miniuser", {
            params: {
                id: id
            },
            callBack
        }).then(res => {
            returnResult(res, callBack, that, true, "获取小程序用户完成")
        })
    },
    ///users/saveanswer
    saveAnswer(answer, id, that, callBack) {
        axios.post("/users/saveanswer/" + id, answer).then(res => {
            returnResult(res, callBack, that, true, "回复完成！")
        })
    },
    getUserInfoByUsername(user, callBack) {
        axios.get("/users/" + user).then((res) => {
            returnResult(res, callBack)
        })
    },
    deleteUserQuestion(id, that, callback) {
        axios.delete("/users/deletequestion/" + id).then((res) => {
            returnResult(res, callback, that, true, "删除完成！")
        })
    }


}