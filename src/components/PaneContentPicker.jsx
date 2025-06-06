import {useEffect, useState} from "react";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

const standardPaneChoices = {
    "source": "Source",
    "juxtaGl": "Gloss",
    "gl": "Gateway"
}

export default function PaneContentPicker({sectionPointer, paneChoiceGetter, paneChoiceSetter, section, includeParallels}) {
    console.log(section)
    const [fullPaneChoices, setFullPaneChoices] = useState(standardPaneChoices);

    useEffect(
        () => {
            let newFullPaneChoices = {...standardPaneChoices};
            if (includeParallels) {
                for (const bookRecord of (Object.entries(section || {}))
                    .filter(kv => (Object.entries(kv[1]).length > 0) && (kv[0] !== sectionPointer[0]))
                    ) {
                    newFullPaneChoices[bookRecord[0]] = `|| ${bookRecord[0]}`;
                }
                setFullPaneChoices(newFullPaneChoices);
            }
        },
        [sectionPointer, section]
    );
    return <ToggleButtonGroup value={paneChoiceGetter}>
        {
            Object.entries(fullPaneChoices)
                .map(
                    pc => <ToggleButton
                        size="small"
                        value={pc[0]}
                        onClick={() => paneChoiceSetter(pc[0])}
                    >
                        {pc[1]}
                    </ToggleButton>
                )
        }
    </ToggleButtonGroup>
}