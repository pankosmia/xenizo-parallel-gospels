import {Typography} from "@mui/material";

export default function CVDisplay({book, sentence}) {
    let cvSet = new Set([]);
    for (const cvs of
            sentence
                .chunks
                .map(
                    c => c.source
                        .map(s => s.cv)
                )) {
        for (const cv of cvs) {
            cvSet.add(cv);
        }
    }
    let cvArray = Array.from(cvSet).sort();
    let cvOutput = cvArray[0] === cvArray[cvArray.length -1] ? cvArray[0] : `${cvArray[0]}-${cvArray[cvArray.length -1].split(":")[1]}`
    return <Typography variant="h4">{book}{" "}{cvOutput}</Typography>
}