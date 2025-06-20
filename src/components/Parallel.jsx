import {useState} from 'react';
import {Box, Button, ButtonGroup, Grid2, Stack, Typography} from "@mui/material";

import JuxtaGlossViewer from "./JuxtaGlossViewer";
import UsfmViewer from "./UsfmViewer";

export default function Parallel({content, languages}) {

    const [contentView, setContentView] = useState("gl");
    const [openSection, setOpenSection] = useState(null);

    const standardPaneChoices = {
        "source": "Source",
        "juxtaGl": "Gloss",
        "gl": "Gateway"
    }

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
                content["xpg"]["ordersMRK"]
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
                                    content["xpg"]["i18n" + languages[0].toUpperCase()][sectionId]["title"]
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
                                                            content["xpg"]["sections"][sectionId][bookCode]["cvs"] ?
                                                                `${bookCode} ${content["xpg"]["sections"][sectionId][bookCode]["cvs"]}` :
                                                                "-"
                                                        }</Typography>
                                                        {
                                                            contentView === "juxtaGl" && content["juxta"][bookCode] && content["xpg"]["sections"][sectionId][bookCode]["firstSentence"] &&
                                                            <Box sx={{fontSize: "small"}}>
                                                                <JuxtaGlossViewer
                                                                    content={content["juxta"][bookCode]}
                                                                    firstSentence={content["xpg"]["sections"][sectionId][bookCode]["firstSentence"]}
                                                                    lastSentence={content["xpg"]["sections"][sectionId][bookCode]["lastSentence"]}
                                                                />
                                                            </Box>
                                                        }
                                                        {
                                                            contentView === "gl" && content["gl"][bookCode] && content["xpg"]["sections"][sectionId][bookCode]["cvs"] &&
                                                            <Box>
                                                                <UsfmViewer
                                                                    content={content["gl"][bookCode]}
                                                                    sectionPointer={[bookCode]}
                                                                    cvs={content["xpg"]["sections"][sectionId][bookCode]["cvs"]}
                                                                />
                                                            </Box>
                                                        }
                                                        {
                                                            contentView === "source" && content["greekNT"][bookCode] && content["xpg"]["sections"][sectionId][bookCode]["cvs"] &&
                                                            <Box>
                                                                <UsfmViewer
                                                                    content={content["greekNT"][bookCode]}
                                                                    sectionPointer={[bookCode]}
                                                                    cvs={content["xpg"]["sections"][sectionId][bookCode]["cvs"]}
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
