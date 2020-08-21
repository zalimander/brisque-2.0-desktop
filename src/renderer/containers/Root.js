// @flow

import { ipcRenderer as ipc, remote } from 'electron';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch } from 'react-router-dom';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import type { Store } from '~/reducers/types';
import App from './App';
import Login from './Login';
import Captcha from './Captcha'
import Button from '~/components/Button';
import styles from './Root.scss';

import MinimizeButton from '~/assets/windows/minimize.png';
import MinimizeButtonHover from '~/assets/windows/minimize-hover.png';
import MaximizeButton from '~/assets/windows/maximize.png';
import MaximizeButtonHover from '~/assets/windows/maximize-hover.png';
import CloseButton from '~/assets/windows/close.png';
import CloseButtonHover from '~/assets/windows/close-hover.png';
import { actionFromName } from '../store/actions'

type Props = {
  store: Store,
  history: object
};

export default class Root extends Component<Props> {
  componentDidMount() {
    ipc.on('hash', this.changeHash);
    ipc.on('store.update', this.updateStore)
    ipc.send('store.subscribe')
  }

  componentWillUnmount() {
    ipc.removeListener('hash', this.changeHash);
    ipc.removeListener('store.update', this.updateStore)
  }

  changeHash = (evt, hash) => {
    const { history } = this.props;
    history.push(hash);
  };
  
  updateStore = (evt, state) => {
    const { store } = this.props
    store.dispatch(actionFromName(state.type)(state.data))
  }

  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route
            render={({ location }) => (
              <div style={{ height: '100%' }}>
                <TransitionGroup className={styles.wrapper}>
                  <CSSTransition
                    key={location.pathname}
                    classNames="fade"
                    timeout={250}
                  >
                    <section
                      className={[styles.wrapperSection, 'app-router'].join(' ')}
                    >
                      <Switch location={location}>
                        <Route path="/login" component={Login} />
                        <Route path='/captcha' component={Captcha} />
                        <Route path="/app/:page?" component={ props => <App {...props} store={ store }/> } />
                        <Route path="/" render={() => <div />} />
                      </Switch>
                    </section>
                  </CSSTransition>
                </TransitionGroup>
                <div className={styles.windowHeader}>
                  {remote.process.platform === 'win32' && (
                    <div className={styles.windowControls}>
                      <Button
                        width={35}
                        height={22}
                        src={MinimizeButton}
                        hoverSrc={MinimizeButtonHover}
                        onClick={() => remote.getCurrentWindow().minimize()}
                      />
                      <Button
                        width={35}
                        height={22}
                        src={MaximizeButton}
                        hoverSrc={MaximizeButtonHover}
                        onClick={() => remote.getCurrentWindow().maximize()}
                        disabled={location.pathname !== '/app'}
                      />
                      <Button
                        width={35}
                        height={22}
                        src={CloseButton}
                        hoverSrc={CloseButtonHover}
                        onClick={() => remote.getCurrentWindow().close()}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        </ConnectedRouter>
      </Provider>
    );
  }
}
