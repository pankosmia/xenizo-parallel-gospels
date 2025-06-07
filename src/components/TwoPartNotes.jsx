import {useState} from "react";
import {Box, Button} from "@mui/material";
import Markdown from "react-markdown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function({shortNote, longNote}) {
    const [showLong, setShowLong] = useState(false);
    return <Box>
        <Button
        onClick={() => setShowLong(!showLong)}
        variant="text"
        color="secondary"
        endIcon={showLong ? <ExpandLess/> : <ExpandMore/>}
        >
            {shortNote}
        </Button>
        {   showLong &&
            <Markdown>{longNote}</Markdown>
        }
    </Box>
}