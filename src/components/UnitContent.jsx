import {Box, Grid2, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {useState, useEffect, useContext} from "react";
import {getText, debugContext} from "pithekos-lib";
import UsfmViewer from "./UsfmViewer";
import JuxtaGlossViewer from "./JuxtaGlossViewer";
import JuxtaViewer from "./JuxtaViewer";
import RequireResources from "./RequireResources";
import NoteViewer from "./NoteViewer";

export default function UnitContent({sectionPointer, sectionOrders, sections, juxtas}) {
    const [section, setSection] = useState(null);
    const [unit, setUnit] = useState(null);
    const [GLs, setGLs] = useState({});
    const [Sources, setSources] = useState({});
    const [TSN, setTSN] = useState({});
    const [SQ, setSQ] = useState({});
    const [TQ, setTQ] = useState({});
    const [CN, setCN] = useState({});
    const [TNC, setTNC] = useState({});
    const [AVX, setAVX] = useState({});
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

    useEffect(
        () => {
            const getTSNs = async bookCodes => {
                const newTSNs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_tsn/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newTSNs[bookCode] = response.text
                            .split("\n")
                            .map(
                                r => r.split("\t")
                                    .map(c => c.replace(/\\n/g, "\n"))
                            );
                    } else {
                        console.log(`Could not load TSN for ${bookCode}: ${response.error}`);
                    }
                }
                setTSN(newTSNs);
            };
            getTSNs(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getCNs = async bookCodes => {
                const newCNs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_cn/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newCNs[bookCode] = response.text
                            .split("\n")
                            .map(
                                r => r.split("\t")
                                    .map(c => c.replace(/\\n/g, "\n"))
                            );
                        ;
                    } else {
                        console.log(`Could not load CN for ${bookCode}: ${response.error}`);
                    }
                }
                setCN(newCNs);
            };
            getCNs(["MRK"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getAVXs = async bookCodes => {
                const newAVXs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_vp/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newAVXs[bookCode] = response.text
                            .split("\n")
                            .map(
                                r => r.split("\t")
                                    .map(c => c.replace(/\\n/g, "\n"))
                            );
                        ;
                    } else {
                        console.log(`Could not load AVX for ${bookCode}: ${response.error}`);
                    }
                }
                setAVX(newAVXs);
            };
            getAVXs(["MRK"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getSQs = async bookCodes => {
                const newSQs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_sq/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newSQs[bookCode] = response.text
                            .split("\n")
                            .map(
                                r => r.split("\t")
                                    .map(c => c.replace(/\\n/g, "\n"))
                            );
                        ;
                    } else {
                        console.log(`Could not load SQ for ${bookCode}: ${response.error}`);
                    }
                }
                setSQ(newSQs);
            };
            getSQs(["MAT", "MRK", "LUK"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getTQs = async bookCodes => {
                const newTQs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/uW/en_tq/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newTQs[bookCode] = response.text
                            .split("\n")
                            .map(
                                r => r.split("\t")
                                    .map(c => c.replace(/\\n/g, "\n"))
                            );
                        ;
                    } else {
                        console.log(`Could not load TQ for ${bookCode}: ${response.error}`);
                    }
                }
                setTQ(newTQs);
            };
            getTQs(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getTNCs = async bookCodes => {
                const newTNCs = {};
                for (const bookCode of bookCodes) {
                    const response = await getText(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_tnc/?ipath=${bookCode}.tsv`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newTNCs[bookCode] = response.text
                            .split("\n")
                            .map(
                                r => r.split("\t")
                                    .map(c => c.replace(/\\n/g, "\n"))
                            );
                        ;
                    } else {
                        console.log(`Could not load TNC for ${bookCode}: ${response.error}`);
                    }
                }
                setTNC(newTNCs);
            };
            getTNCs(["MRK"]).then();
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

    const noteSpecs = [
        {
            "label": "Notes de traduction d'unfoldingWord avec catégories",
            "categories": {
                "M": ["source"],
                "L": ["gl"],
                "C": ["gl", "juxtaGl"],
                "E": ["juxtaGL", "gl"],
                "G": ["juxtaGL", "gl"],
                "V": ["juxtaGL", "gl"],
            },
            "type": "notes",
            "content": TNC
        },
        {
            "label": "Notes critiques",
            "for": ["source"],
            "type": "notes",
            "content": CN
        },
        {
            "label": "Verbes",
            "for": ["source", "juxta"],
            "type": "notes",
            "content": AVX
        },
        {
            "label": "uW Questions FR",
            "for": ["juxtaGl", "gl"],
            "type": "questions",
            "content": TQ
        },
        {
            "label": "Questions Worldview FR",
            "for": ["gl"],
            "type": "questions",
            "content": SQ
        },
        {
            "label": "Tyndale FR",
            "for": ["gl"],
            "type": "notes",
            "content": TSN
        },
        /*{
            "label": "uW tW FR",
            "for": ["juxtaGl", "gl"],
            "content": TW
        },*/
    ];

    return <RequireResources
        required={[
            ["unfoldingWord UGNT", "git.door43.org/uW/grc_ugnt"],
            ["Pain sur les eaux (PSLE)", "git.door43.org/BurritoTruck/fr_psle"],
            ["Notes d'étude Tyndale en français (TSNFR)", "git.door43.org/BurritoTruck/fr_tsn"],
            ["Notes critiques (NCX)", "git.door43.org/BurritoTruck/fr_cn"],
            ["Analyse Verbal Xenizo (AVX)", "git.door43.org/BurritoTruck/fr_vp"],
            ["Questions d'étude de Worldview (SQ)", "git.door43.org/BurritoTruck/fr_sq"],
            ["unfoldingWord translationQuestions (TQ)", "git.door43.org/uW/en_tq"],
            ["Notes de traduction d'unfoldingWord avec catégories (TNCFR)", "git.door43.org/BurritoTruck/fr_tnc"]
        ]}>
        <Grid2 container spacing={2}>
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
            <Grid2 item size={12}>
                <Box sx={{backgroundColor: "#EEE", p: 1, borderRadius: 2, textAlign: "center"}}>
                    <Typography variant="h6">Notes</Typography>
                </Box>
            </Grid2>
            <Grid2 item size={12}>
                {
                    noteSpecs.filter(
                        ns => selectedTexts
                                .filter(t => ns.categories || ns.for.includes(t))
                                .length
                            > 0
                    )
                        .map(
                            ns => <NoteViewer
                                spec={ns}
                                bookCode={sectionPointer[0]}
                                cv={unit.cv}
                                selectedTexts={selectedTexts}
                            />
                        )
                }
            </Grid2>
        </Grid2>
    </RequireResources>
}