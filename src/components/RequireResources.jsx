import {doI18n, getAndSetJson, i18nContext} from 'pithekos-lib';
import {useContext, useEffect, useState} from "react";
import {Stack, Typography} from "@mui/material";

export default function RequireResources({required, children}) {
    const [resources, setResources] = useState([]);
    const {i18nRef} = useContext(i18nContext);

    useEffect(
        () => {
            getAndSetJson({
                url: "/git/list-local-repos",
                setter: setResources
            })
        },
        []
    );

    const missingResources = required.filter(r => !resources.includes(r));
    if (missingResources.length > 0) {
        return <Stack>
            <Typography variant="h6">{doI18n("components:require-resources:missing-resources", i18nRef.current)}</Typography>
            {
                missingResources.map(
                    mr => <Typography>{mr}</Typography>
                )
            }
        </Stack>
    }

    return <>{children}</>
}
