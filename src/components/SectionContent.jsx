import {Button, ButtonGroup, Grid2, Stack, Typography} from "@mui/material";
import {useEffect, useState, useContext} from "react";
import RequireResources from "./RequireResources";
import {getText, debugContext} from "pithekos-lib";
import {Proskomma} from "proskomma-core";

const standardPaneChoices = {
    "source": "Source",
    "juxtaGl": "Gloss",
    "gl": "Gateway"
}

function PaneContentPicker({sectionPointer, paneChoiceGetter, paneChoiceSetter, section, includeParallels}) {

    const [fullPaneChoices, setFullPaneChoices] = useState(standardPaneChoices);

    useEffect(
        () => {
            let newFullPaneChoices = {...standardPaneChoices};
            if (includeParallels) {
                for (const bookCode of Object.entries(section || {})
                    .filter(kv => Object.entries(kv[1]).length > 0 && kv[0] !== sectionPointer[0])
                    .map(kv => kv[0])) {
                    newFullPaneChoices[bookCode] = `|| ${bookCode}`;
                }
                setFullPaneChoices(newFullPaneChoices);
            }
        },
        [sectionPointer]
    );
    return <ButtonGroup>
        {
            Object.entries(fullPaneChoices)
                .map(
                    pc => <Button
                        size="small"
                        color="secondary"
                        variant={pc[0] === paneChoiceGetter ? "contained" : "outlined"}
                        onClick={() => paneChoiceSetter(pc[0])}
                    >
                        {pc[1]}
                    </Button>
                )
        }
    </ButtonGroup>
}

function UsfmViewer({content, sectionPointer, cvs}) {
    if (!content) {
        return <p>Loading...</p>;
    }
    const pk = new Proskomma();
    pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", content);
    const query = `{
        docSet(id: "xxx_yyy") {
            document(bookCode: "${sectionPointer[0]}") {
                mainSequence {
                    blocks(withScriptureCV: "${cvs}") {
                        items(withScriptureCV: "${cvs}") {
                            type subType payload
                        }
                    }
                }
            }
        }
    }`;
    const result = pk.gqlQuerySync(query);
    return <>
        {
            result.data.docSet.document.mainSequence.blocks.map(
                b => <Typography variant="body2">{
                    b.items
                        .map(
                            i => {
                                if (i.type === "scope" && i.subType === "start" && i.payload.startsWith("verses/")) {
                                    return <b>{i.payload.split("/")[1]}</b>;
                                } else if (i.type === "token") {
                                    return i.payload;
                                }
                            }
                        )
                }</Typography>
            )
        }
    </>
}

export default function SectionContent({sectionPointer, sections, sectionsI18n, sectionOrders}) {
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
    const bookSections = sectionsForBook(sectionPointer[0]);

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
                        newSNs[bookCode] = response.text;
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

    return <RequireResources
        required={[
            ["unfoldingWord Greek New Testament (UGNT)", "git.door43.org/uW/grc_ugnt"],
            ["Pain sur les eaux (PSLE)", "git.door43.org/BurritoTruck/fr_psle"],
            ["Notes de Section de Xenizo (NSX)", "git.door43.org/BurritoTruck/fr_sn"]
        ]}
    >
        <Grid2 container sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", mt: 2, borderRadius: 1}}>
            <Grid2 item size={6}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2}}>
                    <PaneContentPicker
                        paneChoiceGetter={paneChoices[0]}
                        paneChoiceSetter={nv => setPaneChoices([nv, paneChoices[1]])}
                        section={sections[sectionOrders[sectionPointer[0]][sectionPointer[1]]]}
                        sectionPointer={sectionPointer}
                        includeParallels={false}
                    />
                    {
                        paneChoices[0] === "gl" &&
                        GLs[sectionPointer[0]] &&
                        <UsfmViewer
                            content={GLs[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSections[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                    {
                        paneChoices[0] === "source" &&
                        Sources[sectionPointer[0]] &&
                        <UsfmViewer
                            content={Sources[sectionPointer[0]]}
                            sectionPointer={sectionPointer}
                            cvs={bookSections[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                        />
                    }
                </Stack>
            </Grid2>
            <Grid2 item size={6}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2, borderRadius: 1}}>
                    <PaneContentPicker
                        paneChoiceGetter={paneChoices[1]}
                        paneChoiceSetter={nv => setPaneChoices([paneChoices[0], nv])}
                        section={sections[sectionOrders[sectionPointer[0]][sectionPointer[1]]]}
                        sectionPointer={sectionPointer}
                        includeParallels={true}
                    />
                    <Typography variant="h4">{paneChoices[1]}</Typography>
                </Stack>
            </Grid2>
            <Grid2 item size={12}>
                <Stack sx={{border: 1, borderColor: "secondary.main", borderWidth: "1px", p: 2, borderRadius: 1}}>
                    <Typography variant="h4">Section Notes</Typography>
                </Stack>
            </Grid2>
        </Grid2>
    </RequireResources>

}