import React, {Component} from 'react';
import Router from "next/router";

export default class Index extends Component{

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Router.push({pathname:"/login"});
  }

  render(){
    return(
        <div className={"index_container"}><div className={"loading"}>加载中......</div>
          <style jsx>
            {`
                .index_container {
                }

                .loading {
                      margin: auto;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      -webkit-transform: translate(-50%,-50%);
                          -ms-transform: translate(-50%,-50%);
                              transform: translate(-50%,-50%);

                }

            `}
          </style>
        </div>
    )
  }
}
