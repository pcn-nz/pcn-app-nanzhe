import React, { ReactNode } from 'react';
import './scroll-box.css';

interface ScrollBoxProps {
    children?: ReactNode;
    style?: React.CSSProperties | undefined;
    onScroll?: React.UIEventHandler<HTMLDivElement> | undefined;
}

const ScrollBox: React.FC<ScrollBoxProps> = (props) => {
    return <div className="scroll-box">
        <div className='scroll-box-body' style={props.style} onScroll={props.onScroll}>
            <div className='scroll-box-main'>
                {props.children}
            </div>
        </div>
    </div>
}

export default ScrollBox;