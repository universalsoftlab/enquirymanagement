// Redux/store/Store.js
import { createStore, combineReducers } from 'redux';
import contactReducer from '../reducers/contactReducer';

const rootReducer = combineReducers({
  contact: contactReducer,
});

export const store = createStore(rootReducer); // ✅ named export

