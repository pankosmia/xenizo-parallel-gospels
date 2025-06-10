import {Grid2, Stack} from "@mui/material";
import {useState} from "react";

import PaneContentPicker from "./PaneContentPicker";
import SNViewer from "./SNViewer";
import JuxtaGlossViewer from "./JuxtaGlossViewer";
import UsfmViewer from "./UsfmViewer";

export default function SectionContent({sectionPointer, content}) {
    const [paneChoices, setPaneChoices] = useState(["juxtaGl", "gl"]);

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

    if (!content["xpg"]["sections"] || !content["xpg"]["orders" + sectionPointer[0]]) {
        return <p>Loading...</p>
    }

    return <Grid2 container sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", mt: 2, borderRadius: 1}}>
            <Grid2 item size={12}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2, borderRadius: 1}}>
                    {
                        content["sectionNotes"][sectionPointer[0]] && <SNViewer
                            content={content["sectionNotes"][sectionPointer[0]]}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                </Stack>
            </Grid2>
            <Grid2 item size={6}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2}}>
                    <PaneContentPicker
                        paneChoiceGetter={paneChoices[0]}
                        paneChoiceSetter={nv => setPaneChoices([nv, paneChoices[1]])}
                        section={bookSectionEntries[sectionPointer[1]][1]}
                        sectionPointer={sectionPointer}
                        includeParallels={false}
                    />
                    {
                        paneChoices[0] === "gl" &&
                        content["gl"][sectionPointer[0]] &&
                        <UsfmViewer
                            content={content["gl"][sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        paneChoices[0] === "juxtaGl" &&
                        content["juxta"][sectionPointer[0]] &&
                        <JuxtaGlossViewer
                            content={content["juxta"][sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            firstSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["firstSentence"]}
                            lastSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["lastSentence"]}
                        />
                    }
                    {
                        paneChoices[0] === "source" &&
                        content["greekNT"][sectionPointer[0]] &&
                        <UsfmViewer
                            content={content["greekNT"][sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                </Stack>
            </Grid2>
            <Grid2 item size={6}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2, borderRadius: 1}}>
                    <PaneContentPicker
                        paneChoiceGetter={paneChoices[1]}
                        paneChoiceSetter={nv => setPaneChoices([paneChoices[0], nv])}
                        section={bookSectionEntries[sectionPointer[1]][1]}
                        sectionPointer={sectionPointer}
                        includeParallels={true}
                    />
                    {
                        paneChoices[1] === "gl" &&
                        content["gl"][sectionPointer[0]] &&
                        <UsfmViewer
                            content={content["gl"][sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        paneChoices[1] === "juxtaGl" &&
                        content["juxta"][sectionPointer[0]] &&
                        <JuxtaGlossViewer
                            content={content["juxta"][sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            firstSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["firstSentence"]}
                            lastSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["lastSentence"]}
                        />
                    }
                    {
                        paneChoices[1] === "source" &&
                        content["greekNT"][sectionPointer[0]] &&
                        <UsfmViewer
                            content={content["greekNT"][sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        ["MAT", "MRK", "LUK", "JHN"].includes(paneChoices[1]) &&
                        content["gl"][paneChoices[1]] &&
                        <UsfmViewer
                            content={content["gl"][paneChoices[1]]}
                            sectionPointer={[paneChoices[1], ...sectionPointer.slice(1)]}
                            cvs={bookSectionEntries[sectionPointer[1]][1][paneChoices[1]]["cvs"]}
                        />
                    }
                </Stack>
            </Grid2>
        </Grid2>
}