import { Toast } from 'antd-mobile';
let IDValidator = require('./IDValidator.min.js');
let Validator = new IDValidator();
let showToast = (content) => {
    Toast.hide();
    Toast.info(content, 2, null, true);
};

/**
 * 身份证号正确性校验
 * @param value 身份证号
 * @returns {*} 校验结果
 */
let checkIDNo = function checkIDNo(value) {
    value = value.trim();
    return Validator.isValid(value)
};


/**
 * 通过正确的身份证取型如1990/03/01的生日
 * @param certNo 身份证号
 * @returns {*} 生日
 */
let getBirthDayByCertNo = function getBirthDayByCertNo(certNo) {

    const len = (certNo + "").length;
    if (len === 0) {
        return 0;
    } else {
        if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
        {
            return 0;
        }
    }
    var strBirthday = "";
    if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
    {
        strBirthday = certNo.substr(6, 4) + "/" + certNo.substr(10, 2) + "/" + certNo.substr(12, 2);
    }
    if (len == 15) {
        strBirthday = "19" + certNo.substr(6, 2) + "/" + certNo.substr(8, 2) + "/" + certNo.substr(10, 2);
    }
    return strBirthday;
}


/**
 * 根据身份证号取性别,返回男、女
 * @param certNo 身份证号
 * @returns {*} 男女
 */
let getSex = function getSex(certNo) {
    var sexno, sex
    if (certNo.length == 18) {
        sexno = certNo.substring(16, 17)
    } else if (certNo.length == 15) {
        sexno = certNo.substring(14, 15)
    } else {
        return false
    }
    var tempid = sexno % 2;
    if (tempid == 0) {
        sex = '女'
    } else {
        sex = '男'
    }
    return sex
};


/**
 * 根据生日获取岁年龄岁
 * @param birthday 生日
 * @param differDay 相差天数、用于t+n生效保单按生效日期计算时
 * @returns {number} 年龄岁
 */
let getAgeByBirthday = function getAgeByBirthday(birthday, differDay) {

    //时间字符串里，必须是“/”
    var birthDate = new Date(birthday);
    var nowDateTime = new Date();
    //校验投保年龄规范，按当前时间。
    nowDateTime.setDate(nowDateTime.getDate() + parseInt(differDay, 10));
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if ((nowDateTime.getMonth() < birthDate.getMonth()) || (nowDateTime.getMonth() == birthDate.getMonth()
        && nowDateTime.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age;
};


/**
 * 根据生日获取天年龄天数
 * @param birthday 生日
 * @param differDay 相差天数、用于t+n生效保单按生效日期计算时
 * @returns {number} 年龄天
 */
let getDayAgeByBirthday = function getDayAgeByBirthday(birthday, differDay) {

    birthday = birthday;
    var birthDate = new Date(birthday);
    //校验投保年龄规范，按当前时间。
    var nowDateTime = new Date();
    var nowDate = nowDateTime.getFullYear() + "/" + (nowDateTime.getMonth() + 1) + "/"
        + (nowDateTime.getDate() + parseInt(differDay, 10));
    var newNowDate = new Date(nowDate);
    var dayAge = (newNowDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
    dayAge = parseInt(dayAge, 10);
    return dayAge+1;
}

/**
 * 计算当前时间与起保时间相差几天
 * @param startDate 当前时间
 * @returns {number} 相差几天
 */
let getDefferDayWithStartDate = function getDefferDayWithStartDate(startDate){
    var nowDateTime = new Date();
    var newStartDate = new Date(startDate);
    var nowDate = nowDateTime.getFullYear() + "/" + (nowDateTime.getMonth() + 1) + "/" + nowDateTime.getDate();
    var newNowDate = new Date(nowDate);
    var defferDay = (newStartDate.getTime() - newNowDate.getTime()) / (1000 * 60 * 60 * 24);
    defferDay = parseInt(defferDay,10);
    return defferDay;
}


/**
 * 按证件号判断是否小于一岁
 * @param certNo 身份证号
 * @param differDay 相差天数、用于t+n生效保单按生效日期计算时
 * @returns {*} boolean true|false
 */
let isLessThanOneYearOldByCertNo = function isLessThanOneYearOldByCertNo(certNo, differDay) {
    let birthday = getBirthDayByCertNo(certNo);
    return isLessThanOneYearOldByBirthday(birthday, differDay);
}

/**
 * 按生日判断是否小于一岁
 * @param birthday 生日
 * @param differDay 相差天数、用于t+n生效保单按生效日期计算时
 * @returns {*} boolean true|false
 */
let isLessThanOneYearOldByBirthday = function isLessThanOneYearOldByBirthday(birthday, differDay) {

    var birthDate = new Date(birthday);
    var nowDateTime = new Date();
    nowDateTime.setDate(nowDateTime.getDate() + parseInt(differDay, 10));
    var dayAge = (nowDateTime.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
    dayAge = parseInt(dayAge, 10);
    return dayAge < 365;
}

/**
 * 护照号校验
 * @param value 护照号
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 为空的提示证
 * @param errorMsg 错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validatePassport = function validatePassport(value,needShowMessage, emptyMsg,errorMsg) {
    value = value.trim();
    if (value == "") {
        if(needShowMessage){
            showToast(emptyMsg);
        }
        return false;
    }
    if (/^[a-zA-Z]{1}[0-9]{7,9}$/.test(value)) {
        return true;
    } else {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
}

/**
 * 港澳居民通行证校验
 * @param value 港澳居民通行证
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 为空的提示证
 * @param errorMsg 错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateHkmPassport = function validateHkmPassport(value, needShowMessage, emptyMsg, errorMsg) {
    value = value.trim();
    if (value == "") {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    if (/^[H,M]{1}([0-9]{8}|[0-9]{10})$/.test(value)) {
        return true;
    } else {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
}

/**
 * 台湾通行证校验
 * @param value 台湾通行证
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 为空的提示证
 * @param errorMsg 错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateTaiWanPassport = function validateTaiWanPassport(value, needShowMessage, emptyMsg, errorMsg) {
    value = value.trim();
    if (value == "") {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    if (/^([0-9]{8}|[0-9]{10})$/.test(value)) {
        return true;
    } else {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
}

/**
 * 校验身份证号的正确性
 * @param value 身份证号
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 为空的提示证
 * @param errorMsg 错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateIdentifyNumber = function validateIdentifyNumber(value,needShowMessage,emptyMsg,errorMsg){

    value = value.trim();
    if ("" == value) {
        if (needShowMessage){
            showToast(emptyMsg);
        }
        return false;
    }
    if (!checkIDNo(value)) {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
    return true;
}


/**
 * 按起保时间为T+N的形式和出生日期校验年龄
 * @param value 生日
 * @param deffer 相差天数、用于t+n生效保单按生效日期计算时
 * @param needShowMessage 是否需要提示错误信息
 * @param minAge 最小年龄
 * @param minAgeUnit 年龄单位:天、年龄
 * @param maxAge 最大年龄
 * @param showMsgModel 错误提示方式:part（最小、最大分开提示）、together(一起提示)
 * @param errorMsg 错误信息
 * @param minMsg 小于最小年龄错误信息
 * @param maxMsg 大于最大年龄错误信息
 * @returns {boolean} 检验结果 true|false
 */
let validateAgeByBirthday = function validateAgeByBirthday(value, deffer, needShowMessage, minAge,
                                                           minAgeUnit, maxAge, showMsgModel, errorMsg, minMsg, maxMsg) {

    var reg = new RegExp('-', "g")
    var newBirthday = value.replace(reg, '/');
    // console.log(newBirthday);
    let age = getAgeByBirthday(newBirthday, deffer);
    // console.log("年龄为:" + age + " deffer:" + deffer);
    if ("天" == minAgeUnit) {//最小年龄为天
        let dayAge = getDayAgeByBirthday(newBirthday, deffer);
        // console.log("天年龄为:"+dayAge);
        if (dayAge < minAge) {
            if (needShowMessage) {
                let msg = showMsgModel == "part" ? minMsg : errorMsg;
                showToast(msg);
            }
            return false;
        }
    } else {
        if (age < minAge) {
            if (needShowMessage) {
                let msg = showMsgModel == "part" ? minMsg : errorMsg;
                showToast(msg);
            }
            return false;
        }
    }

    if (age > maxAge) {
        if (needShowMessage) {
            let msg = showMsgModel == "part" ? maxMsg : errorMsg;
            showToast(msg);
        }
        return false;
    }
    return true;
}


/**
 * 按起保时间为T+N的形式和身份证号校验年龄
 * @param value 生日
 * @param deffer 相差天数、用于t+n生效保单按生效日期计算时
 * @param needShowMessage 是否需要提示错误信息
 * @param minAge 最小年龄
 * @param minAgeUnit 年龄单位:天、年龄
 * @param maxAge 最大年龄
 * @param showMsgModel 错误提示方式:part（最小、最大分开提示）、together(一起提示)
 * @param errorMsg 错误信息
 * @param minMsg 小于最小年龄错误信息
 * @param maxMsg 大于最大年龄错误信息
 * @returns {boolean} 检验结果 true|false
 */
let validateAgeByIdentifyNumber = function validateAgeByIdentifyNumber(value, deffer, needShowMessage,
                                                                       minAge, minAgeUnit, maxAge, showMsgModel,
                                                                       errorMsg, minMsg, maxMsg) {
    value = value.trim();
    let birthday = getBirthDayByCertNo(value);
    return validateAgeByBirthday(birthday, deffer, needShowMessage, minAge, minAgeUnit, maxAge,
        showMsgModel, errorMsg, minMsg, maxMsg);
};

/**
 * 按起保时间为时间和身份证号校验年龄
 * @param value 生日
 * @param startDate 起保时间
 * @param needShowMessage 是否需要提示错误信息
 * @param minAge 最小年龄
 * @param minAgeUnit 年龄单位:天、年龄
 * @param maxAge 最大年龄
 * @param showMsgModel 错误提示方式:part（最小、最大分开提示）、together(一起提示)
 * @param errorMsg 错误信息
 * @param minMsg 小于最小年龄错误信息
 * @param maxMsg 大于最大年龄错误信息
 * @returns {boolean} 检验结果 true|false
 */
let validateAgeByIdentifyNumberAndStartDate = function validateAgeByIdentifyNumberAndStartDate(value, startDate,
                                                                                               needShowMessage, minAge,
                                                                                               minAgeUnit, maxAge,
                                                                                               showMsgModel, errorMsg,
                                                                                               minMsg, maxMsg) {
    value = value.trim();
    let birthday = getBirthDayByCertNo(value);
    var reg = new RegExp('-', "g")
    var newStartDate = startDate.replace(reg, '/');
    var deffer = getDefferDayWithStartDate(newStartDate);
    return validateAgeByBirthday(birthday, deffer, needShowMessage, minAge, minAgeUnit, maxAge,
        showMsgModel, errorMsg, minMsg, maxMsg);
};

/**
 * 按起保时间为时间和生日校验年龄
 * @param value 生日
 * @param startDate 起保时间
 * @param needShowMessage 是否需要提示错误信息
 * @param minAge 最小年龄
 * @param minAgeUnit 年龄单位:天、年龄
 * @param maxAge 最大年龄
 * @param showMsgModel 错误提示方式:part（最小、最大分开提示）、together(一起提示)
 * @param errorMsg 错误信息
 * @param minMsg 小于最小年龄错误信息
 * @param maxMsg 大于最大年龄错误信息
 * @returns {boolean} 检验结果 true|false
 */
let validateAgeByBirthdayAndStartDate = function validateAgeByBirthdayAndStartDate(value, startDate, needShowMessage,
                                                                                   minAge, minAgeUnit, maxAge,
                                                                                   showMsgModel, errorMsg, minMsg,
                                                                                   maxMsg) {

    var reg = new RegExp('-', "g")
    var newBirthday = value.replace(reg, '/');
    var newStartDate = startDate.replace(reg, '/');
    var deffer = getDefferDayWithStartDate(newStartDate);
    return validateAgeByBirthday(newBirthday, deffer, needShowMessage, minAge, minAgeUnit, maxAge,
        showMsgModel, errorMsg, minMsg, maxMsg);
}

/**
 * 校验被保险人姓名
 * @param value 被保险人姓名
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 姓名为空错误提示语
 * @param errorMsg 姓名错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateName = function validateName(value,needShowMessage,emptyMsg,errorMsg){
    var reg1 = /\s/;
    value = value.trim();
    if(""==value){
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    if (reg1.test(value)) {
        if(needShowMessage){
            showToast(errorMsg);
        }
        return false;
    }
    var reg2 = /^(?!·)(?!.*?·$)[\u4e00-\u9fa5 /\·]{2,20}$/;
    if (!reg2.test(value)) {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
    return true;
}


/**
 * 手机号校验，保准牛通用的
 * @param value 手机号
 * @param needShowMessage 是否显示错误提示
 * @param emptyMsg 手机号为空提示语
 * @param errorMsg 手机号错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateMobile = function validateMobile(value, needShowMessage, emptyMsg, errorMsg) {
    var reg = /^1[0-9]{10}$/;
    return validateMobileAll(value, reg, needShowMessage, emptyMsg, errorMsg);
}


/**
 * 常青松手机号校验
 * @param value 手机号
 * @param needShowMessage 是否显示错误提示
 * @param emptyMsg 手机号为空提示语
 * @param errorMsg 手机号错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateMobileForCqs = function validateMobileForCqs(value, needShowMessage,
                                                         emptyMsg, errorMsg) {
    var reg = /^1[3,4,5,6,7,8,9]\d{9}$/;
    return validateMobileAll(value, reg, needShowMessage, emptyMsg, errorMsg);
}

/**
 * 手机号校验封装
 * @param value 手机号
 * @param reg 校验正则
 * @param needShowMessage 是否显示错误提示
 * @param emptyMsg 手机号为空提示语
 * @param errorMsg 手机号错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateMobileAll = function validateMobileAll(value, reg, needShowMessage, emptyMsg, errorMsg) {

    value = value.trim();
    if ("" == value) {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    var reg1 = /\s/;
    if (reg1.test(value)) {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    var reg2 = reg;
    if (!reg2.test(value)) {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
    return true;
}

/**
 * 短信验证码校验
 * @param value 知识验证码
 * @param needShowMessage 是否显示错误提示
 * @param emptyMsg 手机号为空提示语
 * @param errorMsg 手机号错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateSmsCode = function validateSmsCode(value, needShowMessage, emptyMsg, errorMsg) {

    value = value.trim();
    if ("" == value) {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    var reg1 = /\s/;
    if (reg1.test(value)) {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }
    return true;
}

/**
 * 验证邮箱地址
 * @param value 邮箱
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 手机号为空提示语
 * @param errorMsg 手机号错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateEmail = function validateEmail(value, needShowMessage, emptyMsg, errorMsg) {
    value = value.trim();
    var reg = /\s+/g;
    var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (value.length == 0 || '' == value) {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    } else if (!pattern.test(value)) {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    } else if (reg.test(value)) {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    } else {
        return true;
    }
};

/**
 * 图形验证码校验
 * @param value 图形验证码
 * @param needShowMessage 是否显示错误信息
 * @param emptyMsg 手机号为空提示语
 * @param errorMsg 手机号错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateImageCode = function validateImageCode(value, needShowMessage, emptyMsg, errorMsg) {
    if (value !== undefined && value !== null && value !== '') {
        value = value.trim();
        if (value.length > 0) {
            return true;
        }
    }
    if (needShowMessage){
        showToast(errorMsg);
    }
    return false;
};

/**
 * 数据是否为空校验
 * @param value 待校验数据
 * @param needShowMessage 是否显示错误消息
 * @param errorMsg 错误提示语
 * @returns {boolean} 检验结果 true|false
 */
let validateEmpty = function validateEmpty(value, needShowMessage, errorMsg) {
    if (value !== undefined && value !== null && value !== '') {
        value = value.trim();
        if (value.length > 0) {
            return true;
        }
    }
    if (needShowMessage) {
        showToast(errorMsg);
    }
    return false;
};

/**
 * 地址校验
 * @param value 地址信息
 * @param needShowMessage 是否显示错误提示信息
 * @param emptyMsg 数据为空提示语
 * @param errorMsg 错误提示语
 */
let validateAddress = function validateAddress(value, needShowMessage,  emptyMsg, errorMsg) {
    value = value.trim();
    if ("" === value) {
        if (needShowMessage) {
            showToast(emptyMsg);
        }
        return false;
    }

    value = value.replace(/\s+/g, '');
    let flag = value.length>=7&&value.length<100;
    if(!flag){
        showToast(errorMsg);
        return false;
    }

    return true;
};

/**
 * 校验两值是否相等
 * @param orgValue 原始值
 * @param value 待比较值
 * @param needShowMessage 是否显示错误提示
 * @param errorMsg 错误提示
 * @returns {boolean} 返回校验结果
 */
let equalsValidate = function equalsValidate(orgValue, value, needShowMessage, errorMsg) {
    value = value.trim();
    orgValue = orgValue.trim();
    if (orgValue !== value) {
        if (needShowMessage) {
            showToast(errorMsg);
        }
        return false;
    }
    return true;
};

let exports = module.exports = {
    validatePassport: validatePassport,
    validateHkmPassport: validateHkmPassport,
    validateTaiWanPassport: validateTaiWanPassport,
    validateIdentifyNumber: validateIdentifyNumber,
    validateAgeByIdentifyNumber: validateAgeByIdentifyNumber,
    validateAgeByBirthday: validateAgeByBirthday,
    validateAgeByIdentifyNumberAndStartDate: validateAgeByIdentifyNumberAndStartDate,
    validateAgeByBirthdayAndStartDate: validateAgeByBirthdayAndStartDate,
    validateName: validateName,
    validateMobile: validateMobile,
    validateMobileForCqs: validateMobileForCqs,
    validateSmsCode: validateSmsCode,
    validateEmail: validateEmail,
    validateImageCode: validateImageCode,
    validateEmpty: validateEmpty,
    validateAddress: validateAddress,
    equalsValidate: equalsValidate
}
