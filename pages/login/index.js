import React, {Component} from 'react';
import {InputItem, WhiteSpace,Button } from 'antd-mobile';
import Validate from "util/Validate";
import Util from "util/Util";
import Link from 'next/link';
import xhr from "request/index";
import Router from "next/router";


class Index extends Component{

    constructor(props) {
        super(props);
        this.state = {
            param:{
                username: "",
                password: "",
                grant_type: "password"
            }
        }
    }

    validateLogin(name, value, needShowMessage) {

        if (needShowMessage === undefined) {
            needShowMessage = true;
        }
        if (name === "username") {
            return Validate.validateEmpty(value, needShowMessage, "请输入用户名");
        }
        if (name === "password") {
            return Validate.validateEmpty(value, needShowMessage, "请输入密码");
        }
        return true;
    }

    inputOnblur(event){

        const name = event.target.name;
        const value = event.target.value;
        let param = this.state.param;
        param[name] = value;
        this.setState(state => ({
            param: param
        }));
        this.validateLogin(name, value);
    }

    validateAll() {
        if (!this.validateLogin("username", this.state.param.username)) {
            return false;
        }

        if (!this.validateLogin("password", this.state.param.password)) {
            return false;
        }

        return true;
    }

    login(){

        if (!this.validateAll()) {
            return;
        }

        const that  = this;
        xhr.loginRequest('/oauth/token',this.state.param,true).then(function (data) {
            console.log(data);
            if (data.code === "1" || data.code === 1) {
                localStorage.setItem("access_token", data.data.access_token);
                Router.push({pathname: "/supervise"});
            } else {
                localStorage.setItem("access_token", "");
                Util.showToast(data.message);
            }
        });
    }

    render(){
        return (

            <div className={"login-box"}>
                <div className={"login-title"}>登录</div>
                <WhiteSpace/>
                <InputItem
                    placeholder="用户名"
                    name={"username"}
                    onBlur={()=>this.inputOnblur(event)}
                />
                <WhiteSpace/>
                <InputItem
                    type={"password"}
                    name={"password"}
                    onBlur={()=>this.inputOnblur(event)}
                    placeholder="密码"
                />

                <WhiteSpace size={"lg"}/>
                <Button type="primary"
                        className={"login-button"}
                        onClick={() => this.login()}
                >登录</Button>
                <WhiteSpace/>

                <div className="no-register-box">
                    <WhiteSpace size={"lg"}/>
                    <div className="no-account">还没有账号？</div>
                    <div className="to-register"><Link href={"/register"}><a>立即注册</a></Link></div>
                </div>
                <style jsx>{`

                    .login-box {
                        position: absolute;
                        top: 20%;
                        width: 100%;
                    }
                        .login-button{
                        width: 80%;
                        margin: auto;
                    }
                        .login-title{
                        text-align: center;
                        margin-bottom: 40px;
                        font-size: 42px;
                        font-weight: bold;
                    }

                        .no-register-box{
                        font-size: 14px;
                        text-align: center;
                    }

                        .no-account{
                        display: inline-block;
                    }

                        .to-register{
                        display: inline-block;
                    }

                        .to-register a {
                        text-decoration: none;
                        color: #4498EA;
                        cursor: pointer;
                    }
                `}
                </style>
            </div>
        );
    }
}

export default Index;
