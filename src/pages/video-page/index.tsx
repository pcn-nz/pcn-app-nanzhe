import { invoke } from "@tauri-apps/api/core";
import { Flex } from "antd";
import { useEffect, useState } from "react";
import Page from "../../widgets/page";
import ScrollBox from "../../widgets/scroll-box";
import './video-page.css';

const base_video = "https://ncdncd-sslmi.com";

const VideoPage: React.FC = () => {

    const [videoList, setVideoList] = useState<Array<[string, string, string]>>([]);

    useEffect(() => {
        (async () => {
            await getVideoList("https://nc18k1.xyz/Html/2/index.html");
        })()
    })

    const getVideoList = async (url: string) => {
        let videos: Array<[string, string, string]> = await invoke("get_video_list", { url });
        setVideoList(videos);
    }

    return (
        <Page>
            <ScrollBox style={{ padding: "12px" }}>
                <Flex wrap="wrap" gap="small">
                    {
                        videoList.map((item, index) => <div key={index} className="list-card"><img src={"https://ncinci-jpjso.com" + item[2]} /></div>)
                    }
                </Flex>
            </ScrollBox>
        </Page>
    )
}

export default VideoPage;