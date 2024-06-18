import React, { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { Store } from '@tauri-apps/plugin-store';
import { Window as MainWindow } from '@tauri-apps/api/window';
import './player.css';
import Window from '../widgets/window';

const appWindow = new MainWindow('player');

const PlayerPage: React.FC = () => {

    const [videoUrl, setVideoUrl] = useState<string>("");
    const [isMaximized, setIsMaximized] = useState(false);
    useEffect(() => {

        appWindow.listen("tauri://resize", () => {
            appWindow.isMaximized().then((res: boolean) => {
                setIsMaximized(res);
            })
        });

        listen("change_video", (event: any) => {
            setVideoUrl(event.payload.url)
        });
        const store = new Store('store.bin');
        (async () => {
            const val: any = await store.get('video_url');
            setVideoUrl(val);
        })();
    }, [])

    const close = () => {
        appWindow.close();
    }

    const minimize = () => {
        appWindow.minimize();
    }

    const toggleMaximize = () => {
        appWindow.toggleMaximize();
    }

    return (
        <Window isMaximized={isMaximized} close={close} minimize={minimize} toggleMaximize={toggleMaximize} style={{ background: "#000000" }} leftbox={null}>
            <video id="myvideo" src={videoUrl} controls={true} data-tauri-drag-region />
        </Window>
    )
}

export default PlayerPage;
