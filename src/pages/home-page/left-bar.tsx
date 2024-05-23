import { Button, List, Select, Space } from "antd"
import ScrollBox from "../../widgets/scroll-box"
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

type LeftBoxProps = {
    onClick: (arg0: [string, string], arg1: number) => void;
    activeIndex?: number;
    urls?: Array<[string, string]>;
    handlePrevPage?: () => void;
    handleNextPage?: () => void;
    handleChangeChannel?: (value: number) => void;
}

const LeftBox: React.FC<LeftBoxProps> = props => {

    const handleChangeChannel = (value: any) => {
        props.handleChangeChannel ? props.handleChangeChannel(value as number) : null;
    }

    return (
        <div style={{ display: "flex", width: "300px", height: "100%",padding:"0px 0px 0px 12px", flexDirection: "column" }}>
            <div style={{ width: "100%", height: "48px", display: "flex", alignItems: "center" }}>
                <Space style={{ flexShrink: 0 }}>
                    <Button icon={<LeftOutlined />} onClick={props.handlePrevPage}></Button>
                    <Button icon={<RightOutlined />} onClick={props.handleNextPage}></Button>
                    <Select defaultValue={14} style={{ width: "196px" }} onChange={handleChangeChannel} options={[
                        { value: 14, label: <span>唯美写真</span> },
                        { value: 15, label: <span>网友自拍</span> },
                        { value: 16, label: <span>露出激情</span> },
                        { value: 49, label: <span>美乳美臀</span> },
                        { value: 21, label: <span>丝袜美腿</span> },
                        { value: 106, label: <span>卡通漫画</span> },
                        { value: 114, label: <span>欧美风情</span> },
                        { value: 210, label: <span>AI图展</span> },
                    ]} />
                </Space>
            </div>
            <ScrollBox style={{ padding: "3px 12px 0px 0px" }}>
                <List
                    size="small"
                    dataSource={props.urls}
                    renderItem={(item, index) => <List.Item style={props.activeIndex == index ? { color: "red" } : undefined} onClick={() => props.onClick(item, index)}>{item[1]}</List.Item>}
                />
            </ScrollBox>
        </div>
    )
}

export default LeftBox;