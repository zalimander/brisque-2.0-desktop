import React from 'react';
import axios from 'axios'
import { render, unmountComponentAtNode } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss'

const store = configureStore();

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.baseURL = process.env.BASE_URL

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    const rootNode = document.getElementById('root')
    
    unmountComponentAtNode(rootNode)
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      rootNode
    );
  });
}
