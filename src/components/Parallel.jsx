import {useState, useEffect, useContext} from 'react';
import {getJson, getAndSetJson, debugContext} from "pithekos-lib";
import {Box, Button, ButtonGroup, Grid2, Stack, Typography} from "@mui/material";

import JuxtaGlossViewer from "./JuxtaGlossViewer";

export default function Parallel({sections, sectionsI18n, sectionOrders}) {

    const [juxtas, setJuxtas] = useState({
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
                                                                <Box>
                                                                    <JuxtaGlossViewer
                                                                        content={juxtas[bookCode]}
                                                                        firstSentence={sections[sectionId][bookCode]["firstSentence"]}
                                                                        lastSentence={sections[sectionId][bookCode]["lastSentence"]}
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

/*<>
    {
        line["TITLE"] &&
        <Grid2
            item
            size={12}
            display="flex"
            justifyContent="center"
            alignContent="center"
            sx={{backgroundColor: "#777", color: "#FFF"}}>
            <Typography variant="h6">{line["TITLE"]}</Typography>
        </Grid2>
    }
    {
        ["MRK", "LUK", "MAT", "JHN"].map(
            bookCode => <Grid2 container key={`${bookCode}-${n}`} size={3} spacing={1} item
                               display="flex" flexDirection="row" alignContent="flex-start">
                {line[bookCode]["chapter"] ?
                    <>
                        <Grid2 item size={12} display="flex"
                               justifyContent="center"
                               alignContent="center"
                               sx={{backgroundColor: "#DDD"}}
                        >
                            <b><i>{`${bookCode} ${line[bookCode]["chapter"]}.${line[bookCode]["fromVerse"]}${line[bookCode]["fromVerse"] !== line[bookCode]["toVerse"] ? "-" + line[bookCode]["toVerse"] : ""}`}</i></b>
                        </Grid2>
                        {
                            juxtaIndexes(line[bookCode]["fromJuxta"], line[bookCode]["toJuxta"])
                                .map(ji => <>
                                        {
                                            contentView === "juxta" &&
                                            <Grid2 item size={12} display="flex" alignContent="center"
                                                   justifyContent="center">
                                                <b>{ji + 1}</b>
                                            </Grid2>
                                        }
                                        {
                                            contentView === "juxta" &&
                                            juxtas[bookCode].sentences &&
                                            juxtas[bookCode].sentences[ji] &&
                                            juxtas[bookCode].sentences[ji].chunks
                                                .map(
                                                    (c, n) => <>
                                                        <Grid2
                                                            key={`${n}-2`}
                                                            item
                                                            size={6}
                                                            display="flex"
                                                            justifyContent="right"
                                                            alignItems="right"
                                                        >
                                                            {c.source.map(s => s.content).join(' ')}
                                                        </Grid2>
                                                        <Grid2
                                                            key={`${n}-3`}
                                                            item
                                                            size={6}
                                                        >
                                                            {c.gloss}
                                                        </Grid2>
                                                    </>
                                                )
                                        }
                                    </>
                                )
                        }
                        {
                            contentView === "source" &&
                            juxtaIndexes(line[bookCode]["fromJuxta"], line[bookCode]["toJuxta"])
                                .map(ji => <Grid2 item size={12}>{
                                        `${ji}: ` +
                                        juxtas[bookCode].sentences[ji].chunks
                                            .map(
                                                (c, n) => c.source.map(s => s.content).join(" ")
                                            )
                                            .join(" ") + "."
                                    }
                                    </Grid2>
                                )
                        }
                        {
                            contentView === "gloss" &&
                            juxtaIndexes(line[bookCode]["fromJuxta"], line[bookCode]["toJuxta"])
                                .map(ji => <Grid2 item size={12}>{
                                        `${ji}: ` +
                                        juxtas[bookCode].sentences[ji].chunks
                                            .map(
                                                (c, n) => c.gloss
                                            )
                                            .join(" ")
                                    }
                                    </Grid2>
                                )
                        }
                    </> :
                    <Grid2 item size={12} display="flex" alignContent="center"
                           justifyContent="center">---</Grid2>
                }
            </Grid2>
        )
    }
</>
)*/



