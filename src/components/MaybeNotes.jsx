import {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import {matchingSentence} from "../utils/jRef";
import {Grid2, Typography} from "@mui/material";

export default function MaybeNotes({source, sentenceN}) {
    const [showNotes, setShowNotes] = useState(false);
    const matchingNotes = source.filter(note => matchingSentence(note[2].map(v => v - 1), sentenceN));
    if (matchingNotes.length === 0) {
        return <IconButton  disabled={true}><CommentIcon/></IconButton>;
    } else {
        return <>
            <IconButton
                onClick={() => setShowNotes(!showNotes)}
            >
                <CommentIcon/>
            </IconButton>
            {
                showNotes ?
                    <Grid2 container>
                        {
                            matchingNotes.map(
                                note => <>
                                    <Grid2 item size={2}>
                                        <b>{note[0]}</b>
                                    </Grid2>
                                    <Grid2 item size={4}>
                                        <i>{note[4]}</i>
                                    </Grid2>
                                    <Grid2 item size={6}>
                                        {note[6]}
                                    </Grid2>
                                </>
                            )
                        }
                    </Grid2> :
            <Typography component="span">({matchingNotes.length})</Typography>
            }
        </>
    }
}