import {Typography} from "@mui/material";

export default function SectionContent({sectionPointer}) {
    return <Typography>{`SECTION Content for ${sectionPointer.join(', ')}`}</Typography>
}