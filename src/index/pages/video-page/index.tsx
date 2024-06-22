import { invoke } from "@tauri-apps/api/core";
import { Flex, Space, Spin, Switch, message } from "antd";
import { useEffect, useState } from "react";
import Page from "../../../widgets/page";
import ScrollBox from "../../../widgets/scroll-box";
import './video-page.css';
import { emit } from "@tauri-apps/api/event";
import { Store } from '@tauri-apps/plugin-store';

const base_video = "https://ncdncd-sslmi.com";
const base_video_list = "https://nc18x2.xyz";

const store = new Store('store.bin');

const Header: React.FC<any> = props => {
    return (
        <Space>
            <Switch checkedChildren="国产" unCheckedChildren="其他" defaultChecked onClick={props.onChange} />
        </Space>
    )
}

const VideoPage: React.FC = () => {

    const [videoList, setVideoList] = useState<Array<[string, string, string]>>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [channel, setChannel] = useState(2);
    const [spinning, setSpinning] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await getVideoList(channel, videoList, pageIndex);
        })();
    }, [])

    const getVideoList = async (chann: number, vls: Array<[string, string, string]>, pgi: number) => {
        setSpinning(true);
        let videos: Array<[string, string, string]> = [];
        let new_vl: Array<[string, string, string]> = [];
        try {
            for (let i = pgi; i < (pgi + 3); i++) {
                if (i == 1) {
                    videos = await invoke("get_video_list", { url: `${base_video_list}/Html/${chann}/index.html` });
                } else {
                    videos = await invoke("get_video_list", { url: `${base_video_list}/Html/${chann}/index-${i}.html` });
                }
                new_vl = new_vl.concat(videos);
            }
        } catch (err) {
            message.error(err as any)
        }
        let vl = vls;
        vl = vl.concat(new_vl);
        setVideoList(vl);
        setPageIndex(pgi + 3);
        setSpinning(false);
    }

    const changeChannel = async () => {
        let chan = 1;
        if (channel === 1) { setChannel(2); chan = 2; } else { setChannel(1); chan = 1; };
        setVideoList([]);
        setPageIndex(1);
        setTimeout(() => { }, 1000);
        await getVideoList(chan, [], 1);
    }

    const openPlayer = async (url: string) => {
        try {
            await invoke("open_player");
            await store.set('video_url', url);
        } catch (err) {
            emit("change_video", { url });
        }
    }

    const handleLoadMore = async (e: any) => {
        let dom = e.target;
        if (dom.clientHeight + dom.scrollTop === dom.scrollHeight) {
            await getVideoList(channel, videoList, pageIndex);
        }
    }



    return (
        <Page header={<Header onChange={changeChannel} />} style={{ paddingRight: "8px" }}>
            <Spin spinning={spinning} size="large">
                <ScrollBox style={{ padding: "12px" }} onScroll={handleLoadMore}>
                    <Flex wrap="wrap" gap="small">
                        {
                            videoList.map((item, index) => <div key={index} className="list-card list-card-rect" onClick={() => openPlayer(base_video + item[2].slice(0, item[2].length - 4))}><img src={"https://ncinci-jpjso.com" + item[2]} /></div>)
                        }
                    </Flex>
                </ScrollBox>
            </Spin>
        </Page>
    )
}

export default VideoPage;