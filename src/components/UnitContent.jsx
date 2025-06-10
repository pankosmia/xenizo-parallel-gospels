import {Box, Grid2, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {useState} from "react";
import UsfmViewer from "./UsfmViewer";
import JuxtaGlossViewer from "./JuxtaGlossViewer";
import JuxtaViewer from "./JuxtaViewer";
import NoteViewer from "./NoteViewer";

const contentSpec = require("../contentSpec.json");

export default function UnitContent({sectionPointer, content}) {
    const [selectedTexts, setSelectedTexts] = useState(["gl"]);

    const sectionsForBook = bookCode => {
        return Object.entries(content["xpg"]["sections"])
            .filter(s => s[1][bookCode].cvs)
            .sort(
                (a, b) => {
                    const cvA = a[1][bookCode].cvs;
                    const cA = parseInt(cvA.split(":")[0]);
                    const cvB = b[1][bookCode].cvs;
                    const cB = parseInt(cvB.split(":")[0]);
                    if (cA !== cB) {
                        return cA - cB;
                    }
                    const vA = parseInt(cvA.split(":")[1].split("-")[0]);
                    const vB = parseInt(cvB.split(":")[1].split("-")[0]);
                    return vA - vB;
                }
            )
    }
    const bookSectionEntries = sectionsForBook(sectionPointer[0]);
    const unit = bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["units"][sectionPointer[2]];

    if (!content["xpg"]["sections"] || !unit) {
        return <p>Loading...</p>
    }

    const textSpecs = [
        ["source", "Source"],
        ["juxta", "Juxta"],
        ["juxtaGl", "Gloss"],
        ["gl", "Gateway"],
    ];

    return <Grid2 container spacing={2}>
            <Grid2 item size={12}>
                <Typography variant="h5">{`${sectionPointer[0]} ${unit.cv}`}</Typography>
            </Grid2>
            <Grid2 item size={12}>
                <ToggleButtonGroup
                    value={selectedTexts}
                >
                    {
                        textSpecs.map((kv) => <ToggleButton
                                value={kv[0]}
                                onClick={() => selectedTexts.includes(kv[0]) ?
                                    selectedTexts.length > 1 && setSelectedTexts(selectedTexts.filter(t => t !== kv[0])) :
                                    setSelectedTexts(Array.from(new Set([...selectedTexts, kv[0]])))
                                }
                            >
                                {kv[1]}
                            </ToggleButton>
                        )
                    }
                </ToggleButtonGroup>
            </Grid2>
            {
                textSpecs
                    .filter(t => selectedTexts.includes(t[0]))
                    .map(t => <Grid2 item size={12 / selectedTexts.length}>
                            <Box sx={{backgroundColor: "#EEE", p: 1, borderRadius: 2, textAlign: "center"}}>
                                <Typography variant="h6">{t[1]}</Typography>
                            </Box>
                            {
                                t[0] === "gl" &&
                                content["gl"][sectionPointer[0]] &&
                                <UsfmViewer
                                    content={content["gl"][sectionPointer[0]]}
                                    sectionPointer={sectionPointer}
                                    cvs={unit.cv}
                                />
                            }
                            {
                                t[0] === "juxtaGl" &&
                                content["juxta"][sectionPointer[0]] &&
                                <JuxtaGlossViewer
                                    content={content["juxta"][sectionPointer[0]]}
                                    sectionPointer={sectionPointer}
                                    firstSentence={unit.firstSentence}
                                    lastSentence={unit.lastSentence}
                                />
                            }
                            {
                                t[0] === "juxta" &&
                                content["juxta"][sectionPointer[0]] &&
                                <JuxtaViewer
                                    content={content["juxta"][sectionPointer[0]]}
                                    sectionPointer={sectionPointer}
                                    firstSentence={unit.firstSentence}
                                    lastSentence={unit.lastSentence}
                                />
                            }
                            {
                                t[0] === "source" &&
                                content["greekNT"][sectionPointer[0]] &&
                                <UsfmViewer
                                    content={content["greekNT"][sectionPointer[0]]}
                                    sectionPointer={sectionPointer}
                                    cvs={unit.cv}
                                />
                            }
                        </Grid2>
                    )
            }
            <Grid2 item size={12}>
                <Box sx={{backgroundColor: "#EEE", p: 1, borderRadius: 2, textAlign: "center"}}>
                    <Typography variant="h6">Notes</Typography>
                </Box>
            </Grid2>
            <Grid2 item size={12}>
                {
                    contentSpec.unitNotes.filter(
                        ns => selectedTexts
                                .filter(t => ns.categories || ns.for.includes(t))
                                .length
                            > 0
                    )
                        .map(
                            ns => <NoteViewer
                                spec={ns}
                                content={content}
                                bookCode={sectionPointer[0]}
                                cv={unit.cv}
                                selectedTexts={selectedTexts}
                            />
                        )
                }
            </Grid2>
        </Grid2>
}