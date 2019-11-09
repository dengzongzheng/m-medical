import React,{ Component } from 'react';
import {title,organizations} from 'constants/index';
import Validate from "util/Validate";
import Util from "util/Util";
import xhr from "request/index";
import css from "./index.css";
import Router from "next/router";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            param:{
                userName:"",
                password:"",
                confirmPassword:"",
                organizations:[

                ],
                companyName:"",
                principal:"",
                certNo:"",
                sex:"",
                ethnic:"",
                address:"",
                mobile:"",
                managerName:"",
                managerMobile:""
            },
            organizations:[
                {
                    "organizationName": "公共机构",
                    "organizationCode": 1,
                    "select":false,
                    "industries": [
                        {
                            "code": 1,
                            "select":false,
                            "name": "住宿业"
                        },
                        {
                            "code": 2,
                            "select":false,
                            "name": "美容店"
                        },
                        {
                            "code": 3,
                            "select":false,
                            "name": "理发店"
                        },
                        {
                            "code": 4,
                            "select":false,
                            "name": "公共浴室"
                        },
                        {
                            "code": 5,
                            "select":false,
                            "name": "商场"
                        }
                    ]
                },
                {
                    "organizationCode": 2,
                    "select":false,
                    "organizationName": "学校",
                    "industries": [],
                },
                {
                    "organizationCode": 3,
                    "select":false,
                    "organizationName": "医疗机构",
                    "industries": [
                        {
                            "code": 1,
                            "select":false,
                            "name": "传染病防控"
                        },
                        {
                            "code": 2,
                            "select":false,
                            "name": "放射卫生"
                        },
                        {
                            "code": 3,
                            "select":false,
                            "name": "依法执业"
                        }
                    ]
                },
                {
                    "organizationCode": 4,
                    "select":false,
                    "organizationName": "供水单位",
                    "industries": []
                },
                {
                    "organizationCode": 5,
                    "select":false,
                    "organizationName": "监督协管",
                    "industries": []
                }
            ],
            industry:{
                code:"",
                name:""
            }
        }
    }

    validateInputData(name,value,needShowMessage) {

        if (!needShowMessage) {
            needShowMessage = true;
        }
        if (name === "userName") {
            return Validate.validateEmpty(value, needShowMessage, "请输入用户名");
        }
        if (name === "password") {
            return Validate.validateEmpty(value, needShowMessage, "请输入密码");
        }
        if (name === "confirmPassword") {
            const flag = Validate.validateEmpty(value, needShowMessage, "请输入确认密码");
            if (flag) {
                const password = this.state.param.password;
                return Validate.equalsValidate(password, value, true, "两次输入密码不一致");
            }else{
                return false;
            }
        }
        if (name === "organizations") {
            let flag = false;
            for (let i = 0; i < this.state.organizations.length; i++) {
                if (this.state.organizations[i].select) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                Util.showToast("请选择分类及行业");
                return false;
            }
            return true;
        }

        if (name === 'industries') {
            let flag = false;
            for (let i = 0; i < this.state.organizations.length; i++) {
                if (this.state.organizations[i].select) {
                    for (let j = 0; j < this.state.organizations[i].industries.length; j++) {
                        flag = flag || this.state.organizations[i].industries[j].select;
                    }
                }
            }
            if (!flag) {
                Util.showToast("请选择已选分类下行业");
                return false;
            }
            return true;
        }

        if (name === "companyName") {
            return Validate.validateEmpty(value, needShowMessage, "请输入单位名称");
        }

        if (name === "address") {
            return Validate.validateEmpty(value, needShowMessage, "请输入单位地址");
        }

        if (name === "managerName") {
            return Validate.validateEmpty(value, needShowMessage, "请输入单位负责人");
        }

        if (name === "managerMobile") {
            return Validate.validateMobile(value, needShowMessage, "请输入联系电话", "联系电话输入错误");
        }


        return true;
    }

    inputOnBlur(event){
        const name = event.target.name;
        const value = event.target.value;
        let param = this.state.param;
        param[name] = value;
        const that = this;
        this.setState(state=>({
            param: param
        }),function () {
            that.validateInputData(name, value);
        });
    }

    handleCheckboxChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const code = target.value;
        const industry = target.industry;
        let organizations = this.state.organizations;
        if ("organization" === name) {
            for (let i = 0; i < organizations.length; i++) {
                if (organizations[i].organizationCode+"" === code) {
                    organizations[i].select = value;
                    break;
                }
            }
        }
        this.setState(state => ({
            organizations: organizations
        }));
    }

    handleIndustryChange(event, organization_code) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const code = target.value;
        let organizations = this.state.organizations;
        for (let i = 0; i < organizations.length; i++) {
            if (organizations[i].organizationCode === organization_code) {
                for (let j = 0; j < organizations[i].industries.length; j++) {
                    if (organizations[i].industries[j].code+"" === code) {
                        organizations[i].industries[j].select = value;
                        break;
                    }
                }
                break;
            }
        }
        this.setState(state => ({
            organizations: organizations
        }));
    }

    validateAll(){

        if (!this.validateInputData("userName", this.state.param.userName)) {
            return false;
        }
        if (!this.validateInputData("password", this.state.param.password)) {
            return false;
        }
        if (!this.validateInputData("confirmPassword", this.state.param.confirmPassword)) {
            return false;
        }
        if (!this.validateInputData("organizations", this.state.param.organizations)) {
            return false;
        }
        if (!this.validateInputData("industries", this.state.param.organizations)) {
            return false;
        }
        if (!this.validateInputData("companyName", this.state.param.companyName)) {
            return false;
        }
        if (!this.validateInputData("address", this.state.param.address)) {
            return false;
        }
        if (!this.validateInputData("managerName", this.state.param.managerName)) {
            return false;
        }
        if (!this.validateInputData("managerMobile", this.state.param.managerMobile)) {
            return false;
        }
        return true;
    }

    register(){
        if (!this.validateAll()) {
            return;
        }
        const that = this;
        let param = this.state.param;
        param["organizations"] = this.state.organizations;
        xhr.post('/api/user/register',param,true).then(function (data) {
            if(data.code ==="1"){
                Util.alertUtil("提示", "注册成功", "关闭", "确认", function () {
                    Router.push({pathname: "/login"})
                }, function () {
                    Router.push({pathname: "/login"})
                });
            }else{
                Util.showToast(data.message);
            }
        });
    }

    render(){
        let organizationsDiv = this.state.organizations.map((item,index) => (
            <div className="check-box-div" key={item.organizationName}>
                <input type="checkbox"
                       value={item.organizationCode}
                       id={item.organizationCode+"organization"}
                       onChange={(event)=>this.handleCheckboxChange(event)}
                       name={"organization"}
                       checked={item.select}/>
                <label className="check-name"
                       htmlFor={item.organizationCode+"organization"}>
                    {item.organizationName}
                </label>
            </div>
        ));

        let industriesDiv = [];
        this.state.organizations.map((item, index) => {
            if (item.select) {
                item.industries.map((item2,index2)=>{
                    industriesDiv.push(
                        <div className="check-box-div" key={item2.name}>
                            <input type="checkbox"
                                   value={item2.code}
                                   id={item2.code+"industries"}
                                   onChange={(event)=>this.handleIndustryChange(event,item.organizationCode)}
                                   name={"industries"}
                                   industry={"adad"}
                                   checked={item2.select}/>
                            <label className="check-name"
                                   htmlFor={item2.code+"industries"}>
                                {item2.name}
                            </label>
                        </div>
                    )
                });
            }
        });

        let industries = industriesDiv.length>0?(
            <div className="input-box-2">
                <label className="title">*行业</label>
                {industriesDiv}
            </div>
        ):"";
        return (
            <div className="container">
                <header className="header">注册</header>
                <div className="content-box">
                    <div className="input-box">
                        <label>*用户名</label>
                        <input type="text" placeholder="请输入用户名"
                               onBlur={() => this.inputOnBlur(event)}
                               name="userName"/>
                    </div>

                    <div className="input-box">
                        <label>*密码</label>
                        <input type="password" placeholder="请输入密码"
                               onBlur={() => this.inputOnBlur(event)}
                               name="password"/>
                    </div>

                    <div className="input-box">
                        <label>*确认密码</label>
                        <input type="password" placeholder="请输入确认密码"
                               onBlur={() => this.inputOnBlur(event)}
                               name="confirmPassword"/>
                    </div>

                    <div className="input-box-2">
                        <label className="title">*类别</label>
                        {organizationsDiv}
                    </div>

                    {industries}

                    <div className="input-box">
                        <label>*单位名称</label>
                        <input type="text" placeholder="请输入单位名称"
                               onBlur={() => this.inputOnBlur(event)}
                               name="companyName"/>
                    </div>

                    <div className="input-box">
                        <label>*单位地址</label>
                        <input type="text" placeholder="请输入单位地址"
                               onBlur={() => this.inputOnBlur(event)}
                               name="address"/>
                    </div>

                    <div className="input-box">
                        <label>*负责人</label>
                        <input type="text" placeholder="请输入负责人"
                               onBlur={() => this.inputOnBlur(event)}
                               name="managerName"/>
                    </div>

                    <div className="input-box">
                        <label>*联系电话</label>
                        <input type="text" placeholder="请输入联系电话"
                               onBlur={() => this.inputOnBlur(event)}
                               name="managerMobile"/>
                    </div>
                </div>

                <div className="button-box">

                    <input type="button" value="注册"
                           onClick={() => this.register()}/>

                </div>
                <style jsx>{`

                    .container{
                        padding: 20px;
                    }

                    .header{
                        text-align: center;
                        margin-bottom: 40px;
                        font-size: 42px;
                        font-weight: bold;
                    }

                    .content-box{
                        font-size: 18px;
                    }

                    .input-box input{
                        background: #fff;
                        border: 1px solid #DDD;
                        font-size: 16px;
                        border-radius: 3px;
                        box-shadow: inset 0 1px 10px rgba(0,0,0,.06);
                        -webkit-appearance: none;
                        outline: 0;
                        box-sizing: border-box;
                        width: 100%;
                        height: 40px;
                        margin: 0 0 26px;
                        padding-left: 4px;
                    }

                    .input-box label{
                        font-size: 18px;
                        margin-bottom: 14px;
                        display: block;
                    }


                    .button-box{
                        padding-left: 40px;
                        padding-right: 40px;
                    }

                    .button-box input {
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid #3698f6;
                        border-radius: 6px;
                        font-size: 20px;
                        background: #3698f6;
                        color: white;
                        width: 100%;
                        font-weight: bold;
                        box-shadow: 0 1px 2px #3698f6;
                    }

                    .check-self{
                        display: inline-block;
                        height: 10px;
                        width: 10px;
                        border-radius: 2px;
                        border: 2px solid;
                    }

                  `}
                </style>
            </div>
        );
    }
};
