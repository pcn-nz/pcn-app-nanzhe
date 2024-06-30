import React, { useEffect, useState } from "react";
import Page from "../../../widgets/page";
import { Button, Flex, Space, Image, Spin, message } from "antd";
import ScrollBox from "../../../widgets/scroll-box";
import './home-page.css';
import { DownloadOutlined } from "@ant-design/icons";
import LeftBox from "./left-bar";
import { invoke } from "@tauri-apps/api/core";

const HomePage: React.FC = () => {
    const [urls, setUrls] = useState<Array<[string, string]>>([]);
    const [images, setImages] = useState<Array<string>>([]);
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [listSpinning, setListSpinning] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [fid, setFid] = useState(14);
    const [baseUrl, setBaseUrl] = useState<string>("");

    useEffect(() => {
        setListSpinning(true);
        (async () => {
            invoke("get_base_url").then((bu: any) => {
                setBaseUrl(bu)
                setTimeout(() => { }, 1000);
                getUrls(bu as string, 1, 14);
            }).catch((err) => {
                message.error(err as any);
            })
        })();
    }, []);

    const getUrls = async (url: string, pageIndex: number, sfid: number) => {
        setUrls([]);
        setActiveIndex(undefined);
        setListSpinning(true);
        try {
            let res: Array<[string, string]> = await invoke("get_urls", { url: url + "thread.php?fid=" + sfid + "&page=" + pageIndex });
            if (pageIndex == 1) {
                res.splice(0, 3)
            }
            setUrls(res);
        } catch (error) {
            message.error(error as any)
        }
        setListSpinning(false);
    }

    const getImages = async (item: [string, string], index: number) => {
        setImages([]);
        setSpinning(true);
        setTitle("");
        try {
            let res = await invoke("get_images", { url: baseUrl + item[0] });
            setImages(res as Array<string>);
        } catch (error) {
            message.error(error as any)
        }
        setActiveIndex(index);
        setTitle(item[1]);
        setSpinning(false);
    }

    const handlePrevPage = async () => {
        let pi = pageIndex;
        if (pi != 1) {
            pi -= 1;
            setPageIndex(pi);
        }
        await getUrls(baseUrl, pageIndex, fid)
    }

    const handleNextPage = async () => {
        let pi = pageIndex;
        pi += 1;
        setPageIndex(pi);
        await getUrls(baseUrl, pi, fid);
    }

    const handleDownload = async () => {
        await invoke("images_download", { images, dir: title })
    }

    const handleChangeChannel = (value: number) => {
        setFid(value);
        getUrls(baseUrl, 1, value);
    }

    // const addFavorite = () => {
    //     // todo
    // }

    const Header: React.FC = () => {
        return (
            <Flex justify="space-between" style={{ width: "100%", overflow: "hidden" }} data-tauri-drag-region>
                <Space>
                    <Button icon={<DownloadOutlined />} onClick={handleDownload}></Button>
                    {/* <Button icon={<HeartOutlined />} onClick={addFavorite}></Button> */}
                    <div className="title" data-tauri-drag-region>{title}</div>
                </Space>
            </Flex>

        )
    }

    return (
        <div className="container">

            <LeftBox spinning={listSpinning} onClick={getImages} activeIndex={activeIndex} urls={urls} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} handleChangeChannel={handleChangeChannel} />
            <Page header={<Header />} style={{ paddingRight: "8px" }}>
                <Spin spinning={spinning} size="large">
                    <ScrollBox style={{ padding: "12px" }}>
                        <Flex wrap="wrap" gap="small">
                            <Image.PreviewGroup>
                                {
                                    images.map((item, index) => <div key={index} className="list-card list-card-square" style={{ background: `url(${item})`, backgroundSize: "200%" }}><Image src={item} /></div>)
                                }
                            </Image.PreviewGroup>
                        </Flex>
                    </ScrollBox>
                </Spin>
            </Page>
        </div>
    )
}

export default HomePage;