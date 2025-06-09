import {Grid2, Stack} from "@mui/material";
import {useEffect, useState, useContext} from "react";
import {getText, debugContext} from "pithekos-lib";

import PaneContentPicker from "./PaneContentPicker";
import SNViewer from "./SNViewer";
import JuxtaGlossViewer from "./JuxtaGlossViewer";
import UsfmViewer from "./UsfmViewer";

export default function SectionContent({sectionPointer, sections, sectionsI18n, sectionOrders, juxtas}) {
    const {debugRef} = useContext(debugContext);
    const [paneChoices, setPaneChoices] = useState(["juxtaGl", "gl"]);
    const [GLs, setGLs] = useState({});
    const [Sources, setSources] = useState({});
    const [SNs, setSNs] = useState({});

    const sectionsForBook = bookCode => {
        return Object.entries(sections)
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

    useEffect(
        () => {
            const getGLs = async bookCodes => {
                const newGLs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_psle/?ipath=${bookCode}.usfm`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newGLs[bookCode] = response.text;
                    } else {
                        console.log(`Could not load GL text for ${bookCode}: ${response.error}`);
                    }
                }
                setGLs(newGLs);
            };
            getGLs(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getSources = async bookCodes => {
                const newSources = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/uW/grc_ugnt/?ipath=${bookCode}.usfm`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newSources[bookCode] = response.text;
                    } else {
                        console.log(`Could not load source text for ${bookCode}: ${response.error}`);
                    }
                }
                setSources(newSources);
            };
            getSources(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getSNs = async bookCodes => {
                const newSNs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_sn/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newSNs[bookCode] = response.text
                            .split("\n")
                            .slice(1)
                            .map(r => r.split("\t"));
                    } else {
                        console.log(`Could not load SN text for ${bookCode}: ${response.error}`);
                    }
                }
                setSNs(newSNs);
            };
            getSNs(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
    );

    if (!sections || !sectionOrders[sectionPointer[0]]) {
        return <p>Loading...</p>
    }

    return <Grid2 container sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", mt: 2, borderRadius: 1}}>
            <Grid2 item size={12}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2, borderRadius: 1}}>
                    {
                        SNs[sectionPointer[0]] && <SNViewer
                            content={SNs[sectionPointer[0]]}
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
                        GLs[sectionPointer[0]] &&
                        <UsfmViewer
                            content={GLs[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        paneChoices[0] === "juxtaGl" &&
                        juxtas[sectionPointer[0]] &&
                        <JuxtaGlossViewer
                            content={juxtas[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            firstSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["firstSentence"]}
                            lastSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["lastSentence"]}
                        />
                    }
                    {
                        paneChoices[0] === "source" &&
                        Sources[sectionPointer[0]] &&
                        <UsfmViewer
                            content={Sources[sectionPointer[0]]}
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
                        GLs[sectionPointer[0]] &&
                        <UsfmViewer
                            content={GLs[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        paneChoices[1] === "juxtaGl" &&
                        juxtas[sectionPointer[0]] &&
                        <JuxtaGlossViewer
                            content={juxtas[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            firstSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["firstSentence"]}
                            lastSentence={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["lastSentence"]}
                        />
                    }
                    {
                        paneChoices[1] === "source" &&
                        Sources[sectionPointer[0]] &&
                        <UsfmViewer
                            content={Sources[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSectionEntries[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        ["MAT", "MRK", "LUK", "JHN"].includes(paneChoices[1]) &&
                        GLs[paneChoices[1]] &&
                        <UsfmViewer
                            content={GLs[paneChoices[1]]}
                            sectionPointer={[paneChoices[1], ...sectionPointer.slice(1)]}
                            cvs={bookSectionEntries[sectionPointer[1]][1][paneChoices[1]]["cvs"]}
                        />
                    }
                </Stack>
            </Grid2>
        </Grid2>
}