import React from "react";
import Page from "../../widgets/page";
import { Link, useSearchParams } from "react-router-dom";
import './player-page.css';
import { Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const PlayerPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    return (
        <Page header={
            <Space>
                <Link to={{
                    pathname: '/video',
                    search: `?pageIndex=${Number(searchParams.get("pageIndex"))}`,
                }}><Button icon={<ArrowLeftOutlined />}></Button>
                </Link>
                {/* <span>{Number(searchParams.get("pageIndex"))}</span> */}
            </Space >
        }>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <video controls src={searchParams.get("url") as any}></video>
            </div>
        </Page >
    )
}

export default PlayerPage;