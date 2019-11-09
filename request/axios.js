import axios from 'axios';
import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/toast/style/css';
import config from 'request/config';

//全局设定请求类型
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = config.serviceRootPath;

//根据 axios api，对请求返回做拦截处理
axios.interceptors.response.use(function (response) {
    console.log(response);
    if (response.status ===401) {
        // 对返回状态码为 4xx 的请求统一处理
        // 此处统一跳转 404 页面
        window.location.href = decodeURI(`${window.location.protocol}//${window.location.host}/login`)
    }
    return response
}, function (error) {
    console.log(error);
});

/**
 * get请求封装
 * @param url 请求地址
 * @param params 参数
 * @param showLoading 是否需要loading
 * @returns {Promise<T | never>} 处理结果
 */
let aGet = function aGet(url, params, showLoading) {
    // 开始 loading
    if (showLoading) {
        Toast.loading('Loading...', 0);
    }
    if (!params) {
        params = {};
    }
    return axios.get(url, {
        params: params,
        validateStatus: function (status) {
            return true;
        }
    }).then(response => {
        // 结束 loading
        // 返回后端返回数据
        return response.data
    }).catch(error => {
        // 异常处理
        console.log(error);
        if (showLoading) {
            Toast.hide();
        }
        Toast.info("服务器开小差啦，稍后再试", 3, null, true);
    }).finally(() => {
        if (showLoading) {
            Toast.hide();
        }
    });
};

/**
 * post 请求封装
 * @param url 请求地址
 * @param params 参数
 * @param showLoading 是否需要展示loading
 * @param needAuthorize 是否需要登录授权
 * @returns {Promise<T | never>}
 */
let aPost = function aPost(url, params, showLoading,needAuthorize) {
    // 开始 loading
    if (showLoading) {
        Toast.loading('Loading...', 0);
    }
    let config = {
        method: "post",
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        validateStatus: function (status) {
            return true;
        },
    };
    if (needAuthorize) {
        config.headers = {'Authorization': 'Bearer ' + localStorage.getItem("access_token"), 'Content-Type': 'application/json;charset=UTF-8'}
    }

    return axios.post(url,params,config).then(response => {
        // 结束 loading
        return response.data
    }).catch(error => {
        // 异常处理
        console.log(error);
        if (showLoading) {
            Toast.hide();
        }
        Toast.info("服务器开小差啦，稍后再试", 3, null, true);
    }).finally(() => {
        if (showLoading) {
            Toast.hide();
        }
    });
};

/**
 * 登录请求
 * @param url 登录地址
 * @param params 参数
 * @param showLoading 是否需要显示loading...
 */
let aLoginRequest = function aLoginRequest(url, params = {}, showLoading) {
    // 开始 loading
    if (showLoading) {
        Toast.loading('Loading...', 0);
    }
    return axios.request({
        url:url,
        method:'post',
        headers:{'Authorization': 'Basic '+config.basicAuthorization},
        validateStatus: function (status) {
            return true;
        },
        params:params
    }).then(response => {
        let responseData = {};
        responseData["code"] = 1;
        responseData["message"] = 'success';
        if (response.status === 400) {
            responseData["code"] = 0;
            responseData["message"] = '用户名或密码错误';
        }
        if (response.status >= 500) {
            responseData["message"] = '服务器开小差啦，稍后再试';
            responseData["code"] = 0;
        }
        responseData["data"] = response.data;
        return responseData;
    }).catch(error => {
        // 异常处理
        console.log(error);
        if (showLoading) {
            Toast.hide();
        }
        Toast.info("服务器开小差啦，稍后再试", 3, null, true);
    }).finally(() => {
        if (showLoading) {
            Toast.hide();
        }
    });
};

/**
 * 文件上传
 * @param url 地址
 * @param params 参数
 * @param showLoading 是否显示loading......
 */
let aFileUpload = function aFileUpload(url, params, showLoading) {
    // 开始 loading
    if (showLoading) {
        Toast.loading('Loading...', 0);
    }
    return axios.post(url,params,{
        headers:{'Content-Type': 'multipart/form-data'},
        validateStatus: function (status) {
            return true;
        }
    }).then(response => {
        return response.data;
    }).catch(error => {
        // 异常处理
        console.log(error);
        if (showLoading) {
            Toast.hide();
        }
        Toast.info("服务器开小差啦，稍后再试", 3, null, true);
    }).finally(() => {
        if (showLoading) {
            Toast.hide();
        }
    });
};

let exports = module.exports = {
    get: aGet,
    post: aPost,
    loginRequest: aLoginRequest,
    fileUpload: aFileUpload
};
