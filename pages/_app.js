import React from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'
import withRedux from 'next-redux-wrapper'
import {initStore} from 'store/store';
import 'antd-mobile/dist/antd-mobile.css';
import dynamic from 'next/dynamic';
const vConsole = dynamic(import ('util/Vconsole'),{ssr:false});

export default withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps ({ Component, ctx }) {
      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}
      }
    }

    componentDidMount() {
      new vConsole();
    }

    render () {
      const { Component, pageProps, store } = this.props
      return (
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      )
    }
  }
)
