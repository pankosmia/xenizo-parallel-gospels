import {Typography} from "@mui/material";
export default function SNViewer({content, cvs}) {
    const cvInRange = (cv, range) => {
        const [cvC, cvV] = cv.split(":");
        const [rangeC, rangeV] = range.split(":");
        if (cvC !== rangeC) {
            return false;
        }
        if (rangeV.includes("-")) {
            const [fromV, toV] = rangeV.split("-").map(v => parseInt(v));
            return (cvV >= fromV && cvV <= toV)
        } else {
            return (cvV === rangeV);
        }
    };

    const firstVerse = cvs.split("-")[0];
    return <Typography variant="body2" sx={{fontStyle: "italic"}}>
        {
            content
                .filter(r => cvInRange(firstVerse, r[0]))
                .map(r => <Typography variant="body2">{r[6]}</Typography>)
        }
    </Typography>
}