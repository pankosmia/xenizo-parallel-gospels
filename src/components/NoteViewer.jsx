import {useState} from 'react';
import {Box, Button, Stack} from "@mui/material";
import Markdown from "react-markdown";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function NoteViewer({spec, bookCode, cv, selectedTexts}) {
    const [open, setOpen] = useState(false);
    const cvInRange = (cv, range) => {
        const [cvC, cvV] = cv.split(":");
        const [rangeC, rangeV] = range.split(":");
        if (cvC !== rangeC) {
            return false;
        }
        let [cvVFrom, cvVTo] = cvV.split("-");
        cvVFrom = parseInt(cvVFrom);
        if (!cvVTo) {
            cvVTo = cvVFrom;
        } else {
            cvVTo = parseInt(cvVTo);
        }
        if (rangeV.includes("-")) {
            const [fromV, toV] = rangeV.split("-").map(v => parseInt(v));
            return (cvVFrom >= fromV && cvVTo <= toV)
        } else {
            return (cvVFrom <= rangeV && cvVTo >= rangeV);
        }
    }
    if (!spec.content[bookCode]) {
        return "";
    }

    const noteCategories = {
        "M": "Manuscrits",
        "L": "Dans votre langue...",
        "C": "Infos culturelles",
        "E": "Expliciter",
        "G": "Grammaire",
        "V": "Vocabulaire"
    }

    const verseNotes = spec.content[bookCode]
        .filter(l => cvInRange(cv, l[0]))
        .filter(
            l => !spec.categories || (
                l[2] &&
                l[2].split(":")[1] &&
                spec.categories[l[2].split(":")[1]] &&
                selectedTexts
                    .filter(
                        t => spec.categories[l[2].split(":")[1]].includes(t)
                    )
                    .length > 0
            )
        )
        .map(l => spec.type === "questions" ?
            l[5] + "\n\n" + l[6] :
            spec.categories ?
                `### ${noteCategories[l[2].split(':')[1]]}\n\n${l[6] || l[5]}` :
                l[6] || l[5]
        );

    //  &&
    //                 selectedTexts.includes(spec.categories[l[2].split(":")[1]]

    if (verseNotes.length === 0) {
        return "";
    }
    return <Box>
        <Button
            color="secondary"
            size="small"
            variant="outlined"
            onClick={() => setOpen(!open)}
            endIcon={open ? <ExpandLess/> : <ExpandMore/>}
        >
            {`${spec.label} (${verseNotes.length})`}
        </Button>
        {
            open && <Stack>{
                verseNotes.map(
                    vn => <Markdown sx={{fontSize: "small"}}>
                        {vn}
                    </Markdown>
                )
            }</Stack>

        }
    </Box>
}