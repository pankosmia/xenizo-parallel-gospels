import {Proskomma} from "proskomma-core";
import {Typography} from "@mui/material";

export default function UsfmViewer({content, sectionPointer, cvs}) {
    if (!content) {
        return <p>Loading...</p>;
    }
    const pk = new Proskomma();
    pk.loadSuccinctDocSet(content);
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
    if (!result.data.docSet.document) {
        return <p>Loading...</p>;
    }
    return <>
        {
            result.data.docSet.document.mainSequence.blocks.map(
                b => <Typography variant="body2">{
                    b.items
                        .map(
                            i => {
                                if (i.type === "scope" && i.subType === "start" && i.payload.startsWith("verses/")) {
                                    return <Typography
                                        display="inline"
                                        sx={{fontWeight: "bold", fontSize: "75%", paddingRight: "0.25em"}}
                                    >
                                        {i.payload.split("/")[1]}
                                    </Typography>;
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
