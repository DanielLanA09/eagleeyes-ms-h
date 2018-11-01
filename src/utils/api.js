import axios from "axios"
import router from '@/router'

// const API_BASE_URL = 'http://192.168.31.252:30080/ealgeeyes-ms-3.0/api'
// const API_BASE_URL = 'https://www.eagleshing.com/ealgeeyes-ms-3.0/api'
const API_BASE_URL = 'http://localhost:8090/api'

axios.interceptors.request.use(
    config => {
        config.headers.Authorization = "Bearer " + localStorage.getItem("ACCESS_TOKEN")
        return config;
    },
    error => {
        return Promise.reject(error)
    })

axios.interceptors.response.use(
    response => {
        switch (response.status) {
            case 200: {
                return response;
            }
            case 201: {
                return response;
            }
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401: {
                    router.replace({ name: "login" });
                }
            }
        }
        return Promise.reject(error)
    }
);

function returnSuccess(response, callBack) {
    callBack({ success: true, data: response.data })
}

function returnError(error, callBack) {
    let msg = ""
    if (error.response != undefined) {
        msg = error.response.data
    }
    else if (error.message != undefined) {
        msg = error.message;
    }
    callBack({ success: false, msg: msg });
}

export default {
    BASE_URL: API_BASE_URL,
    signup(signupRequest) {
        axios.post(API_BASE_URL + "/auth/signup", signupRequest).then(() => {
            router.replace({ name: "login" });
        })
    },
    signin(signinRequest, callBack) {
        axios.post(API_BASE_URL + "/auth/signin", signinRequest).then(res => {
            localStorage.setItem("ACCESS_TOKEN", res.data.accessToken)
            callBack({ success: true, data: res.data });
        }).catch(erro => {
            callBack({ success: false, data: erro })
        })
    },
    getUserInfo(usernameRequest) {
        axios.get(API_BASE_URL + "/users/" + usernameRequest).then((response) => {
            localStorage.setItem("USER", JSON.stringify(response.data))
        })
    },
    
    saveModuleSet(module, callBack) {
        axios.post(API_BASE_URL + "/postmanage/savedevisionset", module).then(response => {
            callBack({ success: true, data: response.data.object })
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getModuleSet(callBack) {
        axios.get(API_BASE_URL + "/postmanage/getalldevisionset").then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteModuleSet(id, callBack) {
        axios.delete(API_BASE_URL + "/postmanage/deletedevisionset/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveCover(Cover, prepare, callBack) {
        axios.post(API_BASE_URL + "/post/savecover/" + prepare, Cover).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getAllParamSet(callBack){
        axios.get(API_BASE_URL+"/postmanage/getallparamset").then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveParamSet(param, id, callBack) {
        axios.post(API_BASE_URL + "/postmanage/savaparamset/" + id, param).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteParamSet(id, callBack) {
        axios.delete(API_BASE_URL + "/postmanage/deleteparamset/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getparamlist(id, callBack) {
        axios.get(API_BASE_URL + "/postmanage/getparamlist/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getParamListByName(name, callBack) {
        axios.get(API_BASE_URL + "/postmanage/getparamlistbyname/" + name).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveDevisions(request, callBack) {
        axios.post(API_BASE_URL + "/post/savedevisions", request).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            callBack({ success: false, msg: error.response.data.response });
        })
    },
    saveDevision(devision, coverId, callBack) {
        axios.post(API_BASE_URL + "/post/savedevision/" + coverId, devision).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveModule(module, devisionId, callBack) {
        axios.post(API_BASE_URL + "/post/savemodule/" + devisionId, module).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getArticleList(title, pageable, callBack) {
        axios.get(API_BASE_URL + "/post/getall/" + title, { params: pageable }).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteModule(id, callBack) {
        axios.delete(API_BASE_URL + "/post/deletemodule/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveParams(request, callBack) {
        axios.post(API_BASE_URL + "/post/saveparams", request).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteCover(id, callBack) {
        axios.delete(API_BASE_URL + "/post/deletecover/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getCover(id, callBack) {
        axios.get(API_BASE_URL + "/post/getcover/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getTagSetList(pageable, callBack) {
        axios.get(API_BASE_URL + "/postmanage/gettagsets", { params: pageable }).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveTagSet(tagSet, callBack) {
        axios.post(API_BASE_URL + "/postmanage/savetagset", tagSet).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteTagSet(id, callBack) {
        axios.delete(API_BASE_URL + "/postmanage/deletetagset/" + id).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getTagByType(type, callBack) {
        axios.get(API_BASE_URL + "/postmanage/gettagbytype/" + type).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getBuildingPrice(project, callBack) {
        axios.get(API_BASE_URL + "/scrapy/findByProject/" + project).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getAllOldCovers(callBack) {
        axios.get(API_BASE_URL + "/post/getoldcover").then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getOldParams(request,callBack) {
        axios.get(API_BASE_URL + "/post/fetchcoverforparams",request).then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveAllCover(cover, callBack) {
        axios.post(API_BASE_URL + "/post/saveall", cover).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    saveQuestion(request, callBack) {
        axios.post(API_BASE_URL + "/postmanage/addquestion", request).then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    deleteQuestion(id, callBack) {
        axios.delete(API_BASE_URL + "/postmanage/deletequestion/" + id).then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getQuestions(callBack) {
        axios.get(API_BASE_URL + "/postmanage/getquestions").then(response => {
            returnSuccess(response, callBack)
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    publish(data, callBack) {
        axios.post(API_BASE_URL + "/post/publish", data).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
    getDevision(coverId, devName, callBack) {
        axios.get(API_BASE_URL + "/post/getdevisionbyname/" + coverId + "/" + devName).then(response => {
            returnSuccess(response, callBack);
        }).catch(error => {
            returnError(error, callBack);
        })
    },
}

