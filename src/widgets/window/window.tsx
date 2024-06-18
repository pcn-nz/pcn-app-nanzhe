import React, { ReactNode } from 'react';
import WindowCtroll from './window-controll';
import './window.css';

interface WindowProps {
    isMaximized?: boolean;
    children?: ReactNode;
    close?: () => void;
    toggleMaximize?: () => void;
    minimize?: () => void;
    leftbox?: ReactNode | null;
    leftStyle?: React.CSSProperties | undefined;
    style?: React.CSSProperties | undefined;
}

const Window: React.FC<WindowProps> = (props) => {
    return <div className='window' style={props.style}>
        <WindowCtroll isMaximized={props.isMaximized} minimize={props.minimize} toggleMaximize={props.toggleMaximize} close={props.close} />
        {props.leftbox === null ? null :
            <div className='left-box' style={props.leftStyle}>
                <div className='left-box-body' data-tauri-drag-region>
                    {props.leftbox}
                </div>
            </div>}
        <div className="right-box">
            <div className='right-box-body' data-tauri-drag-region>
                {props.children}
            </div>
        </div>
    </div>
}

export default Window;
export type {
    WindowProps
}