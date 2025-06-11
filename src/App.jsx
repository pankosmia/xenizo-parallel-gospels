import {useCallback, useEffect, useState, useContext} from "react";
import RequireResources from "./components/RequireResources";
import {Box, CircularProgress} from "@mui/material";
import ContentViewer from "./components/ContentViewer";
import {getJson, getAndSetJson, getText, debugContext} from "pithekos-lib";
import {Proskomma} from "proskomma-core";

const contentSpec = require("./contentSpec.json");

export default function App() {
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 80);
    const [content, setContent] = useState({});
    const [languages, setLanguages] = useState(['fr']);
    const {debugRef} = useContext(debugContext);
    const handleWindowResize = useCallback(event => {
        setMaxWindowHeight(window.innerHeight - 80);
    }, []);

    useEffect(
        () => {
            getAndSetJson({
                url: "/settings/languages",
                setter: setLanguages,
                debug: debugRef.current
            })
        },
        []
    );

    useEffect(() => {
            window.addEventListener('resize', handleWindowResize);
            return () => {
                window.removeEventListener('resize', handleWindowResize);
            };
        }, [handleWindowResize]
    );

    useEffect(
        () => {
            const getContent = async () => {
                    const newContent = {};
                    for (const [generalK, generalV] of Object.entries(contentSpec.general)) {
                        for (const lang of Object.keys(generalV)) {
                            for (const [resourceK, resourceV] of Object.entries(generalV[lang].dcs.resources)) {
                                let response;
                                if (resourceV.endsWith(".json")) {
                                    response = await getJson(`/burrito/ingredient/raw/${generalV[lang].dcs.repoPath}?ipath=${resourceV}`);
                                } else {
                                    response = await getText(`/burrito/ingredient/raw/${generalV[lang].dcs.repoPath}?ipath=${resourceV}`);
                                }
                                if (response.ok) {
                                    if (!newContent[generalK]) {
                                        newContent[generalK] = {};
                                    }
                                    if (resourceV.endsWith(".json")) {
                                        newContent[generalK][resourceK] = response.json;
                                    } else if (resourceV.endsWith(".tsv")) {
                                        newContent[generalK][resourceK] = response.text
                                            .split("\n")
                                            .slice(1)
                                            .map(r => r.split("\t").map(c => c.replace(/\\n/g, "\n")));
                                    } else if (resourceV.endsWith(".usfm")) {
                                        const pk = new Proskomma();
                                        pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", response.text);
                                        const docSetId = pk.gqlQuerySync("{ docSets { id } }").data.docSets[0].id;
                                        newContent[generalK][resourceK] = pk.serializeSuccinct(docSetId);
                                    } else {
                                        newContent[generalK][resourceK] = response.text;
                                    }
                                } else {
                                    console.log(`Could not load ${resourceV} for ${generalK} (${generalV[lang].dcs.repoPath}): ${response.error}`);
                                }
                            }
                        }
                    }
                    for (const unitRecord of contentSpec.unitNotes) {
                        for (const [resourceK, resourceV] of Object.entries(unitRecord.dcs.resources)) {
                            let response;
                            if (resourceV.endsWith(".json")) {
                                response = await getJson(`/burrito/ingredient/raw/${unitRecord.dcs.repoPath}?ipath=${resourceV}`);
                            } else {
                                response = await getText(`/burrito/ingredient/raw/${unitRecord.dcs.repoPath}?ipath=${resourceV}`);
                            }
                            if (response.ok) {
                                if (!newContent[unitRecord.id]) {
                                    newContent[unitRecord.id] = {};
                                }
                                if (resourceV.endsWith(".json")) {
                                    newContent[unitRecord.id][resourceK] = response.json;
                                } else if (resourceV.endsWith(".tsv")) {
                                    newContent[unitRecord.id][resourceK] = response.text
                                        .split("\n")
                                        .slice(1)
                                        .map(r => r.split("\t").map(c => c.replace(/\\n/g, "\n")));
                                } else if (resourceV.endsWith(".usfm")) {
                                    const pk = new Proskomma();
                                    pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", response.text);
                                    const docSetId = pk.gqlQuerySync("{ docSets { id } }").data.docSets[0].id;
                                    console.log(docSetId);
                                    newContent[unitRecord.id][resourceK] = pk.serializeSuccinct(docSetId);
                                } else {
                                    newContent[unitRecord.id][resourceK] = response.text;
                                }
                            } else {
                                console.log(`Could not load ${resourceV} for ${unitRecord.id} (${unitRecord.dcs.repoPath}): ${response.error}`);
                            }
                        }
                        if (unitRecord.secondaryContent) {
                            for (const [resourceK, resourceV] of Object.entries(unitRecord.dcs.resources)) {
                                let response;
                                if (resourceV.endsWith(".json")) {
                                    response = await getJson(`/burrito/ingredient/raw/${unitRecord.secondaryContent.dcs.repoPath}?ipath=${resourceV}`);
                                } else {
                                    response = await getText(`/burrito/ingredient/raw/${unitRecord.secondaryContent.dcs.repoPath}?ipath=${resourceV}`);
                                }
                                if (response.ok) {
                                    if (!newContent[unitRecord.secondaryContent.id]) {
                                        newContent[unitRecord.secondaryContent.id] = {};
                                    }
                                    if (resourceV.endsWith(".json")) {
                                        newContent[unitRecord.secondaryContent.id][resourceK] = response.json;
                                    } else if (resourceV.endsWith(".tsv")) {
                                        newContent[unitRecord.secondaryContent.id][resourceK] = response.text
                                            .split("\n")
                                            .slice(1)
                                            .map(r => r.split("\t").map(c => c.replace(/\\n/g, "\n")));
                                    } else if (resourceV.endsWith(".usfm")) {
                                        const pk = new Proskomma();
                                        pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", response.text);
                                        const docSetId = pk.gqlQuerySync("{ docSets { id } }").data.docSets[0].id;
                                        console.log(docSetId);
                                        newContent[unitRecord.secondaryContent.id][resourceK] = pk.serializeSuccinct(docSetId);
                                    } else {
                                        newContent[unitRecord.secondaryContent.id][resourceK] = response.text;
                                    }
                                } else {
                                    console.log(`Could not load secondary content ${resourceV} for ${unitRecord.secondaryContent.id} (${unitRecord.secondaryContent.dcs.repoPath}): ${response.error}`);
                                }
                            }

                        }
                    }
                    setContent(newContent);
                }
            ;
            getContent().then();
        },
        []
    );

    if (Object.keys(content).length === 0) {
        return <CircularProgress/>
    }

    return <Box sx={{maxHeight: maxWindowHeight}}>
        <RequireResources
            contentSpec={contentSpec}
            languages={languages}
        >
            <ContentViewer content={content}/>
        </RequireResources>
    </Box>;
}