import React, { ReactNode } from "react";
import './page.css';

interface PageProps {
    header?: ReactNode;
    children?: ReactNode;
    style?: React.CSSProperties | undefined;
}

const Page: React.FC<PageProps> = (props) => {
    return <div className="page" style={props.style}>
        <div className="page-header" data-tauri-drag-region>
            {props.header}
        </div>
        <div className="page-body">
            {props.children}
        </div>
    </div>
}

export default Page;