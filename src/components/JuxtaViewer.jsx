// import Markdown from "react-markdown";
import {Box, Grid2} from "@mui/material";
// import style from './JuxtaViewer.css';

export default function JuxtaViewer({content, firstSentence, lastSentence}) {
    return <Grid2 container>
        {
            content.slice(firstSentence, lastSentence + 1)
                .map(
                    s => <Grid2 container size={12} spacing={0} display="flex">
                        {
                            s.chunks
                                .map(
                                    c => <>
                                        <Grid2 item size={6} spacing={0} sx={{p:0, m:0}} justifyContent="flex-end">
                                            <Box display="flex" justifyContent="flex-end" alignContent="flex-end" alignItems="flex-end" sx={{fontSize: "small", pr: 2}}>
                                                {c.source.map(s => s.content).join(" ")}
                                            </Box>
                                        </Grid2>
                                        <Grid2 item size={6} sx={{fontSize: "small", p:0, m:0}} spacing={0}>
                                            {c.gloss}
                                        </Grid2>
                                    </>
                                )
                        }
                    </Grid2>
                )
        }
    </Grid2>
}

// <Markdown className={style.reactMarkdown}>{c.gloss}</Markdown>