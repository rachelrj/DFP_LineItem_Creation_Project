import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import appCreds from './reducers/reducers.js';

let doerStore = createStore(appCreds, applyMiddleware(thunk));
import Doer from './components/Doer.jsx';
 
ReactDOM.render(
  <Provider store={doerStore}>
    <Doer store={doerStore}/>
  </Provider>,
  document.body
);