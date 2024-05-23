import React, { useEffect, useState } from "react";
import Page from "../../widgets/page";
import { Button, Flex, Space, Image, Spin } from "antd";
import ScrollBox from "../../widgets/scroll-box";
import './home-page.css';
import { DownloadOutlined } from "@ant-design/icons";
import LeftBox from "./left-bar";
import { invoke } from "@tauri-apps/api/core";

const HomePage: React.FC = () => {
    let [urls, setUrls] = useState([] as Array<[string, string]>);
    let [images, setImages] = useState([] as Array<string>);
    let [activeIndex, setActiveIndex] = useState(undefined as undefined | number);
    let [baseUrl, setBaseUrl] = useState("");
    let [pageIndex, setPageIndex] = useState(1);
    let [spinning, setSpinning] = React.useState<boolean>(true);
    const [title, setTitle] = useState("");
    const [fid, setFid] = useState(14);

    useEffect(() => {
        (async () => {
            let baseUrl = await invoke("get_base_url");
            setBaseUrl(baseUrl as string);
            getUrls(baseUrl as string, 1, 14);
        })();
    }, []);

    const getUrls = async (url: string, pageIndex: number, sfid: number) => {
        setUrls([]);
        setActiveIndex(undefined);
        setSpinning(true);
        let res: Array<[string, string]> = await invoke("get_urls", { url: url + "thread1022.php?fid=" + sfid + "&page=" + pageIndex });
        if (pageIndex == 1) {
            res.splice(0, 3)
        }
        setUrls(res);
        setSpinning(false);
    }

    const getImages = async (item: [string, string], index: number) => {
        setImages([]);
        setSpinning(true);
        setTitle("");
        let res = await invoke("get_images", { url: baseUrl + item[0] });
        setImages(res as Array<string>);
        setActiveIndex(index);
        setTitle(item[1]);
        setSpinning(false);
    }

    const handlePrevPage = async () => {
        if (pageIndex != 1) {
            pageIndex -= 1;
            setPageIndex(pageIndex);
        }
        await getUrls(baseUrl, pageIndex, fid)
    }

    const handleNextPage = async () => {
        pageIndex += 1;
        setPageIndex(pageIndex);
        await getUrls(baseUrl, pageIndex, fid);
    }

    const handleDownload = async () => {
        await invoke("images_download", { images, dir: title })
    }

    const handleChangeChannel = (value: number) => {
        setFid(value);
        getUrls(baseUrl, 1, value);
    }

    const Header: React.FC = () => {
        return (
          <Flex justify="space-between" style={{ width: "100%", overflow: "hidden" }} data-tauri-drag-region>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}></Button>
              <div className="title" data-tauri-drag-region>{title}</div>
            </Space>
          </Flex>
    
        )
      }

    return (
        <div className="container">
            <LeftBox onClick={getImages} activeIndex={activeIndex} urls={urls} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} handleChangeChannel={handleChangeChannel} />
            <Page header={<Header />}>
                <ScrollBox style={{ padding: "12px" }}>
                    <Flex wrap="wrap" gap="small">
                        <Image.PreviewGroup
                            preview={{
                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                            }}
                        >
                            {
                                images.map((item, index) => <div key={index} className="list-card"><Image src={item} /></div>)
                            }
                        </Image.PreviewGroup>
                    </Flex>
                </ScrollBox>
            </Page>
            <Spin spinning={spinning} fullscreen size="large" />
        </div>
    )
}

export default HomePage;