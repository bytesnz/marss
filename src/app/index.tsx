import * as React from 'react';
import * as ReactDom from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import * as urlJoin from 'join-path';
import { Helmet } from 'react-helmet';

import * as io from 'socket.io-client';

import { createMarss, livenActions, MarssContext } from '../lib/client/marss';
import config from './lib/config';

import './style.scss';

import { TagList } from '../components/tags';
import { CategoryList } from '../components/categories';
import { Content } from '../components/content';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Sidebar } from '../components/sidebar';

const history = createHistory();

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

// disable react-dev-tools for this project
if (process.env.NODE_ENV === 'production') {
  if (typeof window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] === "object") {
    for (let [key, value] of Object.entries(window['__REACT_DEVTOOLS_GLOBAL_HOOK__'])) {
      window['__REACT_DEVTOOLS_GLOBAL_HOOK__'][key] = typeof value == "function" ? ()=>{} : null;
    }
  }
}

(async () => {
  const socket = io({
  });

  const marss = await createMarss(config, socket);

  let store;
  if (process.env.NODE_ENV !== 'production') {
    const composeWithDevTools = require('redux-devtools-extension').composeWithDevTools;
    store = createStore(marss.reducers, marss.initialState,
        composeWithDevTools());
  } else {
    store = createStore(marss.reducers, marss.initialState);
  }

  const actions = livenActions(marss.actions, store, config, socket);

  ReactDom.render((
    <Provider store={store}>
      <MarssContext.Provider value={marss}>
        <ConnectedRouter history={history}>
          <div>
            <Helmet>
              <title>{config.title}</title>
              { config.description ? (
                  <meta name="description" content={config.description} />
              ) : null }
              { config.description ? (
              <meta property="og:description" content={config.description} />
              ) : null }
              { config.description ? (
              <meta name="twitter:description" content={config.description} />
              ) : null }
              <meta property="og:type" content="website" />
              <meta property="og:title" content={config.title} />
              <meta property="og:url" content="" />
              <meta property="og:site_name" content={config.title} />
              <meta name="twitter:card" content="summary" />
              <meta name="twitter:title" content={config.title} />
            </Helmet>
            <Header/>
            <Sidebar actions={actions} toggle={true} toggleUsingClass={true} />
            <main>
              <PropsRoute actions={actions} component={Content} />
              <PropsRoute path={`${urlJoin('/', config.baseUri, config.tagsUri)}`} actions={actions} component={TagList} />
              <PropsRoute path={`${urlJoin('/', config.baseUri, config.categoriesUri)}`} actions={actions} component={CategoryList} />
            </main>
            <Footer/>
          </div>
        </ConnectedRouter>
      </MarssContext.Provider>
    </Provider>
  ), document.getElementById('app'));
  /*
              <Route path={config.tagsUri}>
                <TagList actions={actions} />
              </Route>
              <Route path={config.categoriesUri}>
                <CategoryList actions={actions} />
              </Route>
              <Route>
                <Content actions={actions} />
              </Route>
   */
})();
