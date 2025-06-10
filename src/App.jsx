import {useCallback, useEffect, useState} from "react";
import RequireResources from "./components/RequireResources";
import {Box, CircularProgress} from "@mui/material";
import ContentViewer from "./components/ContentViewer";
import {getJson, getText} from "pithekos-lib";
import {Proskomma} from "proskomma-core";

const contentSpec = require("./contentSpec.json");

export default function App() {
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 80);
    const [content, setContent] = useState({});
    const handleWindowResize = useCallback(event => {
        setMaxWindowHeight(window.innerHeight - 80);
    }, []);

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
                                            .map(r => r.split("\t"));
                                    } else if (resourceV.endsWith(".usfm")) {
                                        const pk = new Proskomma();
                                        pk.importDocument({lang: "xxx", abbr: "yyy"}, "usfm", response.text);
                                        const docSetId = pk.gqlQuerySync("{ docSets { id } }").data.docSets[0].id;
                                        console.log(docSetId);
                                        newContent[generalK][resourceK] = pk.serializeSuccinct(docSetId);
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
                                newContent[unitRecord.id][resourceK] = resourceV.endsWith(".json") ? response.json : response.text;
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
                                    newContent[unitRecord.secondaryContent.id][resourceK] = resourceV.endsWith(".json") ? response.json : response.text;
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
    )
    ;

    console.log(content);

    if (Object.keys(content).length === 0) {
        return <CircularProgress/>
    }

    return <Box sx={{maxHeight: maxWindowHeight}}>
        <RequireResources
            required={[
                ["Xenizo Parallel Gospels (XPG)", "git.door43.org/BurritoTruck/en_syn",],
                ["New testament Juxtalinear (NTJXT)", "git.door43.org/BurritoTruck/fr_juxta"],
                ["Introductions de Livre Xenizo (ILX)", "git.door43.org/BurritoTruck/fr_xenizo_book-notes",],
                ["unfoldingWord Greek New Testament (UGNT)", "git.door43.org/uW/grc_ugnt"],
                ["Pain sur les eaux (PSLE)", "git.door43.org/BurritoTruck/fr_psle"],
                ["Notes de Section de Xenizo (NSX)", "git.door43.org/BurritoTruck/fr_sn"],
                ["unfoldingWord UGNT", "git.door43.org/uW/grc_ugnt"],
                ["Pain sur les eaux (PSLE)", "git.door43.org/BurritoTruck/fr_psle"],
                ["Notes d'étude Tyndale en français (TSNFR)", "git.door43.org/BurritoTruck/fr_tsn"],
                ["Notes critiques (NCX)", "git.door43.org/BurritoTruck/fr_cn"],
                ["Analyse Verbal Xenizo (AVX)", "git.door43.org/BurritoTruck/fr_vp"],
                ["Questions d'étude de Worldview (SQ)", "git.door43.org/BurritoTruck/fr_sq"],
                ["unfoldingWord translationQuestions (TQ)", "git.door43.org/uW/en_tq"],
                ["Notes de traduction d'unfoldingWord avec catégories (TNCFR)", "git.door43.org/BurritoTruck/fr_tnc"],
                ["Termes de traduction d'unfoldingWord (TWFR)", "git.door43.org/BurritoTruck/fr_tw"],
                ["Résumés de Termes de traduction d'unfoldingWord (TWSFR)", "git.door43.org/BurritoTruck/fr_tws"]
            ]}
        >
            <ContentViewer content={content}/>
        </RequireResources>
    </Box>;
}