import React, { useEffect } from "react";
import Page from "../../widgets/page";
import Player from "xgplayer/es/player";
import { useSearchParams } from "react-router-dom";
import './player-page.css';
import { Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const PlayerPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        new Player({
            id: 'mse',
            url: searchParams.get("url") as any,
            cssFullscreen: true,
        });
    }, [])

    const backToVideoList=()=>{
        // todo
    }

    return (
        <Page header={
            <Space>
                <Button icon={<ArrowLeftOutlined />} onClick={backToVideoList}></Button>
            </Space>
        }>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <div id="mse"></div>
            </div>
        </Page>
    )
}

export default PlayerPage;