import React, {Component} from 'react';
import xhr from "request/index";
import './Index.scss';
import { Toast } from 'antd-mobile';

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionNo: this.props.questionno
        }
    }

    uploadFile(e){
        const self = this;
        console.log(e.target);
        let file = e.target.files[0];
        if (!file) {
            return;
        }
        /* eslint-disable no-undef */
        let param = new FormData();  // 创建form对象
        param.append('files', file, file.name)  // 通过append向form对象添加数据
        param.append('chunk', '0') // 添加form表单中其他数据
        console.log("222222");
        console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
        const that = this;
        xhr.fileUpload("/file/upload", param, true).then(function (data) {
            console.log(data);
            if (data.code === "1") {
                that.props.callBack(that.props.questionno, data.data);
            }else{
                Toast.info(data.message);
            }
        });
    }

    render() {
        return(
            <div className={"upload-components-container"}>
                <input name="file" className={"input_file"} id={"file"+this.props.questionno}
                       type="file" accept="image/png,image/gif,image/jpeg"
                       onChange={()=>this.uploadFile(event)}/>
                <label htmlFor={"file"+this.props.questionno}>上传图片<img src={"../../static/images/upload.png"}
                                                                       className="upload-button"/></label>
            </div>
        )
    }
};
