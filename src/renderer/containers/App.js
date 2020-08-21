import { ipcRenderer as ipc, remote } from 'electron';

import React, { Component } from 'react';
import styles from './App.scss';

import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import css from 'classnames';

import Logo from '~/assets/logo.png';
import captchaLogo from '~/assets/captchaLogo.svg'
import Dashboard from '~/pages/dashboard';
import Tasks from '~/pages/tasks';
import Profiles from '~/pages/profiles';
import Proxies from '~/pages/proxies';
import Settings from '~/pages/settings';


type Props = {
  store: object,
  match: object,
  location: object
};

export default class App extends Component<Props> {
  
  constructor(props) {
    super(props);

    this.state = {
      pathname: `/${props.match.params.page || ''}`,
      fullScreen: false
    };
    this.pages = {
      Dashboard,
      Tasks,
      Profiles,
      Proxies,
      Settings
    };
  }

  componentDidMount() {
    ipc.on('enter-full-screen', this.enterFullScreen);
    ipc.on('leave-full-screen', this.leaveFullScreen);
  }

  componentWillUnmount() {
    ipc.removeListener('enter-full-screen', this.enterFullScreen);
    ipc.removeListener('leave-full-screen', this.leaveFullScreen);
  }

  enterFullScreen = () => {
    this.setState({ fullScreen: true });
  };

  leaveFullScreen = () => {
    this.setState({ fullScreen: false });
  };

  render() {
    const { location, store } = this.props;
    const { pathname, fullScreen } = this.state;
    return (
      <div
        className={['container', 'horizontal', styles.outerContainer].join(' ')}
      >
        <div className={ styles.loader }>
        
        </div>
        <div className={styles.sidebar}>
          {remote.process.platform === 'darwin' && (
            <div
              className={styles.trafficLights}
              style={{ height: fullScreen ? '1em' : '2em' }}
            />
          )}
          {Object.keys(this.pages).map(page => (
            <a
              key={page}
              className={css({
                [styles.navigator]: true,
                [styles.selected]: pathname.substring(1) === page.toLowerCase()
              })}
              onClick={() =>
                this.setState({ pathname: `/${page.toLowerCase()}` })
              }
              onKeyDown={() => {}}
              role="presentation"
            >
              <img
                className={styles.navigator}
                src={this.pages[page].icon}
                alt=""
              />
            </a>
          ))}
          <img className={styles.logo} src={Logo} alt="" />
          <div className={styles.captcha} onClick={ () => ipc.send('captcha.open') }>
            <img className={styles.captchaLogo} src={captchaLogo} alt="" />
          </div>
        </div>

        <TransitionGroup className={styles.container}>
          <CSSTransition key={pathname} classNames="fade" timeout={250}>
            <section className={styles.wrapper}>
              <Switch location={Object.assign({}, location, { pathname })}>
                <Route path="/dashboard" component={ props => <Dashboard { ...props } store={ store } /> }/>
                <Route path="/tasks" component={ props => <Tasks { ...props } store={ store } /> } />
                <Route path="/profiles" component={ props => <Profiles { ...props } store={ store } /> } />
                <Route path="/proxies" component={ props => <Proxies { ...props } store={ store } /> } />
                <Route path="/settings" component={ props => <Settings { ...props } store={ store } /> } />
                <Route path="/" render={() => <div>Not Found?</div>} />
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}
