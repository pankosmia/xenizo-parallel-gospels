import {useState, useEffect, useContext} from 'react';
import {getJson, getAndSetJson, debugContext, getText} from "pithekos-lib";
import {Box, Button, ButtonGroup, Grid2, Stack, Typography} from "@mui/material";

import JuxtaGlossViewer from "./JuxtaGlossViewer";
import UsfmViewer from "./UsfmViewer";

export default function Parallel({sections, sectionsI18n, sectionOrders}) {

    const [juxtas, setJuxtas] = useState({
        MAT: {},
        MRK: {},
        LUK: {},
        JHN: {}
    });
    const [GLs, setGLs] = useState({
        MAT: {},
        MRK: {},
        LUK: {},
        JHN: {}
    });
    const [Sources, setSources] = useState({
        MAT: {},
        MRK: {},
        LUK: {},
        JHN: {}
    });
    const [contentView, setContentView] = useState("gl");
    const [openSection, setOpenSection] = useState(null);

    useEffect(
        () => {
            const getJuxtas = async bookCodes => {
                const newJuxtas = {};
                for (const bookCode of bookCodes) {
                    const response = await getJson(
                        `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_juxta/?ipath=${bookCode}.json`,
                        debugRef.current
                    );
                    if (response.ok) {
                        newJuxtas[bookCode] = response.json;
                    } else {
                        console.log(`Could not load juxta for ${bookCode}: ${response.error}`);
                    }
                }
                setJuxtas(newJuxtas);
            };
            getJuxtas(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
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

    const {debugRef} = useContext(debugContext);

    const standardPaneChoices = {
        "source": "Source",
        "juxtaGl": "Gloss",
        "gl": "Gateway"
    }

    if (false) {
        return <div>Loading...</div>;
    } else {
        return <>
            <ButtonGroup
                sx={{
                    position: "fixed",
                    top: 80,
                    right: 20,
                    backgroundColor: "#FFF"
                }}
            >
                {
                    Object.entries(standardPaneChoices)
                        .map(
                            pc => <Button
                                size="small"
                                color="secondary"
                                variant={pc[0] === contentView ? "contained" : "outlined"}
                                onClick={() => setContentView(pc[0])}

                            >
                                {pc[1]}
                            </Button>
                        )
                }
            </ButtonGroup>
            <Grid2 container style={{fontSize: "x-small"}}>
                {
                    sectionOrders["MRK"]
                        .map(
                            (sectionId, n) => <>
                                <Grid2
                                    key={n}
                                    item
                                    size={12}
                                    display="flex"
                                    justifyContent="center"
                                    alignContent="center"
                                    sx={{
                                        backgroundColor: "#777",
                                        color: "#FFF",
                                        borderTop: 1,
                                        borderColor: 'secondary.main'
                                    }}
                                    onClick={() => openSection === n ? setOpenSection(null) : setOpenSection(n)}
                                >
                                    <Typography
                                        variant="h5"
                                    >{
                                        sectionsI18n["fr"][sectionId]["title"]
                                    }</Typography>
                                </Grid2>
                                {
                                    openSection === n &&
                                    ["MAT", "MRK", "LUK", "JHN"]
                                        .map(
                                            bookCode => <Grid2
                                                key={`${bookCode}-${n}`}
                                                size={3}
                                                spacing={1}
                                                item
                                                display="flex"
                                                flexDirection="row"
                                                alignContent="flex-start"
                                            >
                                                <Grid2 item size={12} display="flex"
                                                       justifyContent="center"
                                                       alignContent="center"
                                                       sx={{backgroundColor: "#DDD"}}
                                                >
                                                    {
                                                        <Stack>
                                                            <Typography variant="h6">{
                                                                sections[sectionId][bookCode]["cvs"] ?
                                                                    `${bookCode} ${sections[sectionId][bookCode]["cvs"]}` :
                                                                    "-"
                                                            }</Typography>
                                                            {
                                                                contentView === "juxtaGl" && sections[sectionId][bookCode]["firstSentence"] &&
                                                                <Box sx={{fontSize: "small"}}>
                                                                    <JuxtaGlossViewer
                                                                        content={juxtas[bookCode]}
                                                                        firstSentence={sections[sectionId][bookCode]["firstSentence"]}
                                                                        lastSentence={sections[sectionId][bookCode]["lastSentence"]}
                                                                    />
                                                                </Box>
                                                            }
                                                            {
                                                                contentView === "gl" && sections[sectionId][bookCode]["cvs"] &&
                                                                <Box>
                                                                    <UsfmViewer
                                                                        content={GLs[bookCode]}
                                                                        sectionPointer={[bookCode]}
                                                                        cvs={sections[sectionId][bookCode]["cvs"]}
                                                                    />
                                                                </Box>
                                                            }
                                                            {
                                                                contentView === "source" && sections[sectionId][bookCode]["cvs"] &&
                                                                <Box>
                                                                    <UsfmViewer
                                                                        content={Sources[bookCode]}
                                                                        sectionPointer={[bookCode]}
                                                                        cvs={sections[sectionId][bookCode]["cvs"]}
                                                                    />
                                                                </Box>
                                                            }
                                                        </Stack>
                                                    }
                                                </Grid2>
                                            </Grid2>
                                        )
                                }
                            </>
                        )
                }
            </Grid2>
        </>
    }
}
