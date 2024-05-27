import React, { useEffect } from "react";
import Page from "../../widgets/page";
import Player from "xgplayer/es/player";
import { useSearchParams } from "react-router-dom";
import './player-page.css';

const PlayerPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        new Player({
            id: 'mse',
            url: searchParams.get("url") as any,
            cssFullscreen: true,
        });
    }, [])

    return (
        <Page>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <div id="mse"></div>
            </div>
        </Page>
    )
}

export default PlayerPage;