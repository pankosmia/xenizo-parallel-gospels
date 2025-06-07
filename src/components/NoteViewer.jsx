import {useState} from 'react';
import {Box, Button, Stack} from "@mui/material";
import Markdown from "react-markdown";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryNotesViewer from "./CategoryNotesViewer";
import TwoPartNotes from "./TwoPartNotes";

export default function NoteViewer({spec, bookCode, cv, selectedTexts}) {
    const [open, setOpen] = useState(false);
    const [showSecondary, setShowSecondary] = useState(true);
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
        .map(l => [
                spec.categories ? l[2].split(':')[1] : "*",
                spec.type === "questions" ?
                    l[5] + "\n\n" + l[6] :
                    l[6] || l[5]
            ]
        );

    if (verseNotes.length === 0) {
        return "";
    }
    if (spec.secondaryContent) {
        spec.secondaryContent[bookCode]
            .filter(l => cvInRange(cv, l[0]))
            .map(l => [
                    "*",
                    l[6] || l[5]
                ]
            );
    }
    // Categories - use specific component
    if (spec.categories) {
        let notesByCategory = {};
        for (const verseNoteTuple of verseNotes) {
            if (!notesByCategory[verseNoteTuple[0]]) {
                notesByCategory[verseNoteTuple[0]] = [];
            }
            notesByCategory[verseNoteTuple[0]].push(verseNoteTuple[1]);
        }
        return <>{
            Object.entries(notesByCategory)
                .sort(
                    (a, b) => noteCategories[a[0]] > noteCategories[b[0]]
                )
                .map(
                    kv => <CategoryNotesViewer
                        spec={spec}
                        categoryLabel={noteCategories[kv[0]]}
                        notes={kv[1]}
                    />
                )
        }</>
    }
    // Two-part: use specific component
    if (spec.secondaryContent) {
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
                    spec.secondaryContent[bookCode]
                        .filter(l => cvInRange(cv, l[0]))
                        .map(l => l[6] || l[5]
                        ).map(
                        (
                            (nt, n) => <TwoPartNotes
                                shortNote={nt}
                                longNote={verseNotes[n][1]}
                            />
                        )
                    )
                }</Stack>
            }
        </Box>
    }

    // Default button
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
                        {vn[1]}
                    </Markdown>
                )
            }</Stack>
        }
    </Box>
}