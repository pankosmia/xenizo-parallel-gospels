import {createRoot} from "react-dom/client";
import {SpSpa} from "pithekos-lib";
import App from "./App";
import './index.css';

createRoot(document.getElementById("root"))
    .render(
        <SpSpa
            requireNet={false}
            titleKey="pages:xenizo-parallel-gospels:title"
            currentId="xenizo-parallel-gospels"
        >
            <App/>
        </SpSpa>
    );
