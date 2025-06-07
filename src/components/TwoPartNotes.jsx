import {useState} from "react";
import {Box, Button, Tooltip} from "@mui/material";
import Markdown from "react-markdown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function ({shortNote, longNote}) {
    const [showLong, setShowLong] = useState(false);
    return <Box>
        <Tooltip title={shortNote}>
            <Button
                onClick={() => setShowLong(!showLong)}
                variant="text"
                color="secondary"
                endIcon={showLong ? <ExpandLess/> : <ExpandMore/>}
            >
                {shortNote.split(":")[0]}
            </Button>
        </Tooltip>
        {showLong &&
            <Markdown>{longNote}</Markdown>
        }
    </Box>
}