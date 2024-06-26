import { invoke } from "@tauri-apps/api/core";
import { Flex, Space, Spin, Switch, message } from "antd";
import { useEffect, useState } from "react";
import Page from "../../../widgets/page";
import ScrollBox from "../../../widgets/scroll-box";
import './video-page.css';
import { emit } from "@tauri-apps/api/event";
import { Store } from '@tauri-apps/plugin-store';
import { DownloadOutlined, HeartOutlined, PlayCircleOutlined, StarOutlined } from "@ant-design/icons";
import { Menu, Item, useContextMenu, Separator } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

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

const MENU_ID = 'rightMenu';

const VideoPage: React.FC = () => {

    const [videoList, setVideoList] = useState<Array<[string, string, string]>>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [channel, setChannel] = useState(2);
    const [spinning, setSpinning] = useState<boolean>(false);
    const { show } = useContextMenu({
        id: MENU_ID,
    });

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

    const showContextMenu = (e: any) => {
        show({
            event: e,
        });
    }

    return (
        <Page header={<Header onChange={changeChannel} />} style={{ paddingRight: "8px" }}>
            <Spin spinning={spinning} size="large">
                <ScrollBox style={{ padding: "12px" }} onScroll={handleLoadMore}>
                    <Flex wrap="wrap" gap={12}>
                        {
                            videoList.map((item, index) => <div key={index} style={{ background: `url(${"https://ncinci-jpjso.com" + item[1]})`, backgroundSize: "124%" }} className="list-card list-card-rect" onContextMenu={showContextMenu} onClick={() => openPlayer(base_video + item[1].slice(0, item[1].length - 4))}>
                                <img src={"https://ncinci-jpjso.com" + item[1]} />
                                <div className="play-icon" onContextMenu={show as any}>
                                    <PlayCircleOutlined />
                                </div>
                                <div className="list-card-title">{item[0]}</div>
                            </div>)
                        }
                    </Flex>
                </ScrollBox>
            </Spin>

            <Menu id={MENU_ID} animation="fade">
                <Item>
                    <PlayCircleOutlined />
                    <span style={{ paddingLeft: "6px" }}>播放</span>
                </Item>
                <Item>
                    <DownloadOutlined />
                    <span style={{ paddingLeft: "6px" }}>下载</span>
                </Item>
                <Separator />
                <Item>
                    <StarOutlined />
                    <span style={{ paddingLeft: "6px" }}>收藏</span>
                </Item>
                <Item>
                    <HeartOutlined />
                    <span style={{ paddingLeft: "6px" }}>喜欢</span>
                </Item>
            </Menu>

        </Page>
    )
}

export default VideoPage;