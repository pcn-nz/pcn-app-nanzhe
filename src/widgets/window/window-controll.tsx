import React from 'react';
import './window-control.css';

const closePath =
    'M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z'
const restorePath =
    'm 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z'
const maximizePath = 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z'
const minimizePath = 'M 0,5 10,5 10,6 0,6 Z'

interface WindowCtrollProps {
    isMaximized?: boolean;
    close?: () => void;
    toggleMaximize?: () => void;
    minimize?: () => void;
}

const WindowCtroll: React.FC<WindowCtrollProps> = (props) => {
    return <div className='window-control-box'>
        <div className='window-control-btn' onClick={props.minimize}>
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path d={minimizePath} />
            </svg>
        </div>
        <div className='window-control-btn' onClick={props.toggleMaximize}>{props.isMaximized ?
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path d={restorePath} />
            </svg> :
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path d={maximizePath} />
            </svg>
        }</div>
        <div className='window-control-btn window-control-btn-close' onClick={props.close}>
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path d={closePath} />
            </svg>
        </div>
    </div>
}

export default WindowCtroll;
export type {
    WindowCtrollProps
}