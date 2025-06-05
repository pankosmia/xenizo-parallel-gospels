import {Box, Grid2, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {useState, useEffect, useContext} from "react";
import {getText, debugContext} from "pithekos-lib";
import UsfmViewer from "./UsfmViewer";
import JuxtaGlossViewer from "./JuxtaGlossViewer";
import JuxtaViewer from "./JuxtaViewer";

export default function UnitContent({sectionPointer, sectionOrders, sections, juxtas}) {
    const [section, setSection] = useState(null);
    const [unit, setUnit] = useState(null);
    const [GLs, setGLs] = useState({});
    const [Sources, setSources] = useState({});
    const [selectedTexts, setSelectedTexts] = useState(["gl"]);

    const {debugRef} = useContext(debugContext);

    useEffect(
        () => {
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
            };
            if (sections) {
                const newSection = sectionsForBook(sectionPointer[0])[sectionPointer[1]][1];
                setSection(newSection);
                setUnit(newSection[sectionPointer[0]].units[sectionPointer[2]]);
            }
        }
    );

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

    if (!section || !unit) {
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
                            GLs[sectionPointer[0]] &&
                            <UsfmViewer
                                content={GLs[sectionPointer[0]]}
                                sectionPointer={sectionPointer}
                                cvs={unit.cv}
                            />
                        }
                        {
                            t[0] === "juxtaGl" &&
                            juxtas[sectionPointer[0]] &&
                            <JuxtaGlossViewer
                                content={juxtas[sectionPointer[0]]}
                                sectionPointer={sectionPointer}
                                firstSentence={unit.firstSentence}
                                lastSentence={unit.lastSentence}
                            />
                        }
                        {
                            t[0] === "juxta" &&
                            juxtas[sectionPointer[0]] &&
                            <JuxtaViewer
                                content={juxtas[sectionPointer[0]]}
                                sectionPointer={sectionPointer}
                                firstSentence={unit.firstSentence}
                                lastSentence={unit.lastSentence}
                            />
                        }
                        {
                            t[0] === "source" &&
                            Sources[sectionPointer[0]] &&
                            <UsfmViewer
                                content={Sources[sectionPointer[0]]}
                                sectionPointer={sectionPointer}
                                cvs={unit.cv}
                            />
                        }
                    </Grid2>
                )
        }
    </Grid2>
}