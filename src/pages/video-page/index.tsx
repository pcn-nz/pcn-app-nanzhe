import { invoke } from "@tauri-apps/api/core";
import { Button, Flex, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import Page from "../../widgets/page";
import ScrollBox from "../../widgets/scroll-box";
import './video-page.css';
import { Link } from "react-router-dom";

import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const base_video = "https://ncdncd-sslmi.com";

const VideoPage: React.FC = () => {

    const [videoList, setVideoList] = useState<Array<[string, string, string]>>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [spinning, setSpinning] = useState<boolean>(true);

    useEffect(() => {

        const webview = new WebviewWindow('player', {
            url: 'index.html'
        });
        webview.once('tauri://created', function () {
            // webview successfully created
        });
        webview.once('tauri://error', function () {
            // an error happened creating the webview
        });

        (async () => {
            await getVideoList("https://nc18k1.xyz/Html/2/index.html");
        })()
    }, [])

    const getVideoList = async (url: string) => {
        setSpinning(true);
        setVideoList([]);
        let videos: Array<[string, string, string]> = await invoke("get_video_list", { url });
        setVideoList(videos);
        setSpinning(false);
    }

    const nextPage = async () => {
        let pi = pageIndex + 1;
        setPageIndex(pi);
        await getVideoList(`https://nc18k1.xyz/Html/2/index-${pi}.html`);
    }

    const prePage = async () => {
        let pi = 1;
        if (pageIndex > 1) {
            pi = pageIndex - 1;
        }
        setPageIndex(pi);
        if (pi == 1) {
            await getVideoList(`https://nc18k1.xyz/Html/2/index.html`);
        } else {
            await getVideoList(`https://nc18k1.xyz/Html/2/index-${pi}.html`);
        }

    }

    const Header = () => {
        return (
            <Space>
                <Button icon={<LeftOutlined />} onClick={prePage}></Button>
                <Button icon={<RightOutlined />} onClick={nextPage}></Button>
            </Space>
        )
    }

    return (
        <Page header={<Header />}>
            <ScrollBox style={{ padding: "12px" }}>
                <Flex wrap="wrap" gap="small">
                    {
                        videoList.map((item, index) => <div key={index} className="list-card list-card-rect"><Link to={{
                            pathname: '/video/player',
                            search: `?url=${base_video + item[2].slice(0, item[2].length - 4)}`,
                        }}><img src={"https://ncinci-jpjso.com" + item[2]} /></Link></div>)
                    }
                </Flex>
            </ScrollBox>
            <Spin spinning={spinning} fullscreen size="large" />
        </Page>
    )
}

export default VideoPage;