import React, { Suspense, useEffect } from 'react';
import './index.css';
import "./a.sass"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-spring-bottom-sheet/dist/style.css'
import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import  { AliveScope, KeepAlive } from 'react-activation';
import Image from './Component/Media/Image';
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client';
import splashImage from "./assets/splash.png"
import OneSignal from 'react-onesignal';

// OneSignal.init({ appId: '5182f563-4f60-40c8-9e60-50618ffdc172' , allowLocalhostAsSecureOrigin: true});
// const initConfig = {
//   appId: "5182f563-4f60-40c8-9e60-50618ffdc172"
// };

export default async function runOneSignal() {
  await OneSignal.init({ appId: '5182f563-4f60-40c8-9e60-50618ffdc172', allowLocalhostAsSecureOrigin: true});
  OneSignal.showSlidedownPrompt();
}

const App= lazy(()=> import("./App"))

const EntryApp= ()=> {
  useEffect(()=> {
    runOneSignal()
  }, [])
  useEffect(()=> {
    if(localStorage.getItem("appdesktop")== "true") {
      document.title= "Pia chat"
    }
  }, [])  
  
  return (
    <>
      {/* <AliveScope> */}
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
          <Router>
            <Routes>
              <Route path={"/*"} element={
                // <KeepAlive id={"123456789"} when={()=> true}>
                  <Suspense fallback={<div style={{width: "100%", height: "100%", position: 'fixed', top: 0, left: 0, display: 'flex', justifyContent: "center", alignItems: 'center'}}>
                    <img src={splashImage} style={{width: 300, maxWidth: "100%"}} alt={"Không thể mở"} />
                  </div>}>
                    <App />
                  </Suspense>
                // </KeepAlive>
              
              } />
              <Route path={"/media/:image_id"} element={
              // <KeepAlive when={true}>
                <Image />
              // </KeepAlive>
              } />
            </Routes>
          </Router>
        </SnackbarProvider>
      {/* </AliveScope> */}
    </>
  )
}

createRoot(document.getElementById('root')).render(<EntryApp />);





