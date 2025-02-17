import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import { Provider } from 'react-redux';
import rootReducer from "./ReduxStore";
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';

const store = configureStore({
  reducer:rootReducer
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
  </Provider>
)
