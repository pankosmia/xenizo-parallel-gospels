import {useCallback, useContext, useEffect, useState} from "react";
import {i18nContext, getAndSetJson} from "pithekos-lib";
import RequireResources from "./components/RequireResources";
import {Box} from "@mui/material";
import ContentViewer from "./components/ContentViewer";

export default function App() {
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 80);
    const handleWindowResize = useCallback(event => {
        setMaxWindowHeight(window.innerHeight - 80);
    }, []);
    const {i18nRef} = useContext(i18nContext);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    return <Box sx={{maxHeight: maxWindowHeight}}>
        <RequireResources
            required={[
                ["Xenizo Parallel Gospels (XPG)", "git.door43.org/BurritoTruck/en_syn",],
                ["New testament Juxtalinear (NTJXT)", "git.door43.org/BurritoTruck/fr_juxta"]
            ]}
        >
            <ContentViewer/>
        </RequireResources>
    </Box>
}