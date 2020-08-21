import { ipcRenderer as ipc, remote } from 'electron'

import axios from 'axios'
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import WebView from 'react-electron-web-view'
import url from 'url'
import qs from 'qs'

import Button from '~/components/Button'
import Logo from '~/assets/logo.png'
import styles from './Login.scss'

let onBeforeUnload

window.onbeforeunload = (...args) => onBeforeUnload && onBeforeUnload(...args)

export default class Login extends Component {
  constructor() {
    super()
    
    this.state = {
      showLogin: true,
      showDiscord: false,
      showButton: true,
      loading: false,
      loaded: false,
      showError: false,
      error: ''
    }
    
    this.webviewRef = React.createRef()
    this.openLogin = this.openLogin.bind(this)
  }
  
  componentWillUnmount() {
    onBeforeUnload = undefined
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { showDiscord } = this.state
    if (showDiscord && !prevState.showDiscord) {
      this.setupWebView()
    } else if (!showDiscord && prevState.showDiscord) {
      onBeforeUnload = undefined
    }
  }
  
  setupWebView() {
    const webview = this.webviewRef.current.view
    const webContents = webview.getWebContents()
    
    webContents.addListener('will-navigate', (evt, url) => {
      const { code, error } = qs.parse(url.split('?')[1])
      
      if (url.indexOf('/login/discord') === -1) {
        return
      }
      
      if (code) {
        this.setState({ loading: true })
        ipc.once('resize', () => {
          this.setState({ showLogin: true })
          axios
            .post('/api/user/authenticate/discord/callback', { code })
            .then(({ data }) => {
              ipc.send('user.token', data.token)
            })
            .catch(({ response }) => {
              this.setState({ loading: false, showError: true, error: response && response.data && response.data.error || 'An unknown error occurred, please try again'})
            })
        })
      } else if (error) {
        ipc.once('resize', () => {
          this.setState({ showLogin: true, showError: true, error: 'You must log in with Discord to use Brisque' })
        })
      }
      
      this.setState({ showDiscord: false })
    })
    
    webContents.session.webRequest.onBeforeRequest(({ url }, callback) => {
      callback(url.indexOf('/login/discord') !== -1 ? { cancel: true } : {})
    })
    
    onBeforeUnload = evt => {
      /* eslint-disable-next-line */
      evt.returnValue = false
      this.setState({ showDiscord: false })
      ipc.once('resize', () => this.setState({ showLogin: true }))
      return evt.preventDefault()
    }
  }
  
  openLogin() {
    this.setState({ showLogin: false, showError: false })
    return ipc.once('resize', () => this.setState({ showDiscord: true }))
  }
  
  get loginPage() {
    const { showButton, showError, error, loading, loaded } = this.state
    
    return (
      <div className={ [styles.container, styles.login].join(' ') }>
        <img className={ styles.logo } src={ Logo } alt="" onClick={ () => this.setState({ loading: !loading }) }/>
        <h1 className={ styles.title } onClick={ () => this.setState({ loaded: !loaded }) }>Brisque IO</h1>
        <div className={ styles.container }>
          <CSSTransition
            in={ loading }
            timeout={ 250 }
            classNames='absolute fade'
            unmountOnExit
          >
            <div className='loader small' style={{ top: 0, marginBottom: -13 }}>
              <div/>
              <p>Logging in...</p>
            </div>
          </CSSTransition>
          <CSSTransition
            in={ !loading }
            timeout={ 250 }
            classNames="absolute fade"
            unmountOnExit
          >
            <div className={ styles.button }>
              <CSSTransition
                in={ showButton }
                timeout={ 250 }
                classNames="absolute fade"
                unmountOnExit
              >
                <Button style={ { zIndex: 15 } } onClick={ this.openLogin }>
                  Login with Discord
                </Button>
              </CSSTransition>
              <CSSTransition
                in={ !showButton }
                timeout={ 250 }
                classNames="absolute fade"
                unmountOnExit
              >
                <input type="text" placeholder="Access Code"/>
              </CSSTransition>
              {/*
              <span className='subtext'>
                { showButton ? 'Have an access code?' : 'Using a Discord account?' }&nbsp;
                <a className='subtext' onClick={ () => this.setState({ showButton: !showButton }) }>
                  Log in here!
                </a>
              </span>
              */ }
              <CSSTransition
                in={ showError }
                timeout={ 250 }
                classNames="fade"
                unmountOnExit
                onExited={ () => this.setState({ error: '' }) }
              >
                <p className={ styles.error }>{ error }</p>
              </CSSTransition>
            </div>
          </CSSTransition>
        </div>
        <span className="version">{ remote.app.getVersion() }</span>
      </div>
    )
  }
  
  render() {
    const { showLogin, showDiscord } = this.state
    return (
      <div
        className="centered container"
        style={ { backgroundColor: showDiscord ? '#303136' : '#1A1324E6' } }
      >
        <CSSTransition
          in={ showLogin }
          timeout={ 250 }
          classNames="fade"
          unmountOnExit
          onExited={ () => ipc.send('resize', 'discord') }
        >
          { this.loginPage }
        </CSSTransition>
        <CSSTransition
          in={ showDiscord }
          timeout={ 250 }
          classNames="fade"
          unmountOnExit
          onExited={ () => ipc.send('resize', 'login') }
        >
          <div className={ styles.webviewContainer }>
            <WebView
              ref={ this.webviewRef }
              className={ styles.webview }
              style={ { display: 'flex', flex: 1 } }
              partition="persist:discord"
              src={ url.resolve(process.env.BASE_URL, '/api/user/authenticate/discord') }
            />
          </div>
        </CSSTransition>
      </div>
    )
  }
}
