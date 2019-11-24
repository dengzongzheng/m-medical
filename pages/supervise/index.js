import React,{ Component } from 'react';
import {title} from 'constants/index';
import Util from "util/Util";
import Link from 'next/link';
import xhr from "request/index";
import Upload from 'components/Upload/Index';
import { Toast } from 'antd-mobile';
import "./index.scss";
import Router from "next/router";
import {questionAnswers1} from "util/Questiones";


export default class Supervise extends Component {

    constructor(props) {
        super(props);
        this.uploadFileCallBack = this.uploadFileCallBack.bind(this);
        this.state= {
            questionAnswers: questionAnswers1
        }

    }

    componentDidMount() {

    }

    uploadFileCallBack(questionNo,data){
        console.log(questionNo);
        console.log(data);
        let questionAnswers = this.state.questionAnswers;
        for (let i = 0; i < questionAnswers.length; i++) {
            if (questionAnswers[i].questionNo === questionNo) {
                questionAnswers[i].answerImages.push(data.imageServerPath+data.fileName);
                break;
            }
        }
        this.setState(state => ({
            questionAnswers: questionAnswers
        }));
    }

    postSupervise(){

        let param = this.state.questionAnswers;

        xhr.post("/api/supervise/postSupervise", param, true,true).then(function (data) {
            if(data.code ==="1"){
                Util.alertUtil("提示", "提交成功", "关闭", "确认", function () {
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

        let superviseList = this.state.questionAnswers.map(value=> {

            let answerList = "";
            if(value.questionType===1){
                const li = value.inputAnswers.map(value => (
                    <li key={value.answerNo}><input type="radio" name="radio_4704" value="0"/><span
                        className="radio-self"/><label className="answer-text">{value.answer}</label></li>
                ));
                answerList = (
                    <div className="answer-list">
                        <ol className="choose">
                            {li}
                        </ol>
                    </div>
                )
            }

            const images = value.answerImages.map(value => (
                <img src={value} key={value} alt={""} className={"pic_style"}/>
            ));

            return (
                <div className="paper" key={value.questionNo}>
                    <div className="question">
                        <b className="no">{value.questionNo}.</b>{value.questionName}
                    </div>
                    {answerList}
                    <div className="answers">
                        <div className="pics">
                            {images}
                        </div>
                        <div className="pic-upload" id={"upload_1"}>
                            <Upload questionno={value.questionNo} callBack={this.uploadFileCallBack}/>
                        </div>

                    </div>
                </div>
            )
        });

        return (

            <div className="supervise-container">
                <div className="header">
                    放射卫生诚信自律调查表
                </div>

                <div className="paper-list">
                    {superviseList}
                </div>


                <div className="submit-answer">

                    <input type="button" className="button" value="取消"/>

                    <input type="button" className="button button-2" value="提交" onClick={()=>this.postSupervise()}/>

                </div>
                <style jsx>{`

                      .paper{
                        background: url(../../static/images/question_line.gif) repeat-x bottom;
                        padding-bottom: 20px;
                      }

                  `}
                </style>
            </div>
        )
    }
};
