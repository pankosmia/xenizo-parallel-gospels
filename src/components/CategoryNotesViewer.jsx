import {Box, Button, Stack} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Markdown from "react-markdown";
import {useState} from "react";

export default function CategoryNotesViewer({spec, notes, categoryLabel}) {
    const [open, setOpen] = useState(false);

    return <Box>
        <Button
            color="secondary"
            size="small"
            variant="outlined"
            onClick={() => setOpen(!open)}
            endIcon={open ? <ExpandLess/> : <ExpandMore/>}
        >
            {`${categoryLabel} - ${spec.dcs.name} (${notes.length})`}
        </Button>
        {
            open && <Stack>{
                notes.map(
                    vn => <Markdown sx={{fontSize: "small"}}>
                        {
                            vn
                                .replace(/^[^\n]+/, "**$&**")
                                .replace(/Voir :.*/, "")
                        }
                    </Markdown>
                )
            }</Stack>

        }
    </Box>
}