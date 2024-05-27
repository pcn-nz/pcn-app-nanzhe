import React, { useEffect, useState } from "react";
import Window from "./widgets/window";
import "./App.css";
import { Window as MainWindow } from '@tauri-apps/api/window';
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { ConfigProvider, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import HomePage from "./pages/home-page";
import { PictureOutlined, StarOutlined, VideoCameraOutlined } from "@ant-design/icons";
import logo from './assets/logo.png';
import VideoPage from "./pages/video-page";
import PlayerPage from "./pages/player-page";

const appWindow = new MainWindow('main');
const App: React.FC = () => {
  let [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    appWindow.listen("tauri://resize", () => {
      appWindow.isMaximized().then((res: boolean) => {
        setIsMaximized(res);
      })
    });
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
      <ConfigProvider locale={zhCN}>
        <Window isMaximized={isMaximized} close={close} minimize={minimize} toggleMaximize={toggleMaximize} leftStyle={{ width: "80px", padding: "5px 12px 12px 12px", background: "white" }}
          leftbox={<LeftBar />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/video/player" element={<PlayerPage />} />
          </Routes>
        </Window>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
