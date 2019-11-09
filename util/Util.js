import {Modal, Toast} from 'antd-mobile';
const alert = Modal.alert;

/**
 * 提示
 * @param content 提示内容
 */
let showToast = (content) => {
    Toast.hide();
    Toast.info(content, 2, null, true);
};

/**
 * 隐藏提示
 * @param content
 */
let hiddenToast = (content) => {
    Toast.hide();
};

/**
 * 确认窗口
 * @param title 标题
 * @param content 内容
 * @param cancelText 取消按钮名称
 * @param OkText 确认按钮名称
 * @param CancelCallBack 取消按钮回调
 * @param OKCallBack 确认按钮回调
 */
let alertUtil = function alertUtil(title, content, cancelText, OkText, CancelCallBack, OKCallBack) {
    alert(title, content, [
        {
            text: cancelText, onPress: () => {
                if (CancelCallBack && typeof CancelCallBack === 'function') {
                    CancelCallBack();
                }
            }
        },
        {
            text: OkText, onPress: () => {
                if (OKCallBack && typeof OKCallBack === 'function') {
                    OKCallBack();
                }
            }
        }
    ]);
};

/**
 * 返回首页
 */
let toHome = function toHome() {
    window.location.replace("/");
};



let exports = module.exports = {
    showToast: showToast,
    hiddenToast: hiddenToast,
    alertUtil: alertUtil,
    toHome:toHome
};

