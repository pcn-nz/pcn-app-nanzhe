import React, { useEffect, useState } from "react";
import Window from "./widgets/window";
import "./App.css";
import { Window as MainWindow } from '@tauri-apps/api/window';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { ConfigProvider, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import HomePage from "./pages/home-page";
import { PictureOutlined, StarOutlined, VideoCameraOutlined } from "@ant-design/icons";
import logo from './assets/logo.png';
import VideoPage from "./pages/video-page";
import PlayerPage from "./pages/player-page";
import { invoke } from "@tauri-apps/api/core";
import ConfigPage from "./pages/config-page";
import AuthRoute from "./widgets/AuthRoute";

const appWindow = new MainWindow('main');
const App: React.FC = () => {
  let [isMaximized, setIsMaximized] = useState(false);
  let [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    appWindow.listen("tauri://resize", () => {
      appWindow.isMaximized().then((res: boolean) => {
        setIsMaximized(res);
      })
    });
    (async () => {
      let hc = await invoke("get_config");
      setHasConfig(hc as boolean);
      localStorage.setItem("appConfig","");
    })()
  }, []);

  const close = () => {
    appWindow.close();
  }

  const minimize = () => {
    appWindow.minimize();
  }

  const toggleMaximize = () => {
    appWindow.toggleMaximize();
  }

  const LeftBar = () => {
    return (
      <Space direction="vertical">
        <div className="logo" data-tauri-drag-region>
          <img src={logo} alt="" data-tauri-drag-region />
        </div>
        <NavLink className="left-nav-btn" to={"/"}>
          <PictureOutlined />
        </NavLink>
        <NavLink className="left-nav-btn" to={"/video"}>
          <VideoCameraOutlined />
        </NavLink>
        <NavLink className="left-nav-btn" to={"/star"}>
          <StarOutlined />
        </NavLink>
      </Space>
    )
  }

  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN} theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#eb2f96'
        },
      }}>
        <Window isMaximized={isMaximized} close={close} minimize={minimize} toggleMaximize={toggleMaximize} leftStyle={{ width: "80px", padding: "5px 12px 12px 12px", background: "white" }}
          leftbox={<LeftBar />}>
          <Routes>
            <Route path="/" element={<AuthRoute auth={true}><HomePage /></AuthRoute>} />
            <Route path="/video" element={<AuthRoute auth={true}><VideoPage /></AuthRoute>} />
            <Route path="/video/player" element={<AuthRoute auth={true}><PlayerPage /></AuthRoute>} />
            <Route path="/config" element={<ConfigPage />} />
          </Routes>
        </Window>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
