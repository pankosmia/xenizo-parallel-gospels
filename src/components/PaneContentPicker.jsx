import {useEffect, useState} from "react";
import {Button, ButtonGroup} from "@mui/material";

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
    return <ButtonGroup>
        {
            Object.entries(fullPaneChoices)
                .map(
                    pc => <Button
                        size="small"
                        color="secondary"
                        variant={pc[0] === paneChoiceGetter ? "contained" : "outlined"}
                        onClick={() => paneChoiceSetter(pc[0])}
                    >
                        {pc[1]}
                    </Button>
                )
        }
    </ButtonGroup>
}