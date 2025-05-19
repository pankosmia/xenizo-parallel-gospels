import {Typography} from "@mui/material";

export default function BookContent({sectionPointer}) {
    return <Typography>{`BOOK Content for ${sectionPointer.join(', ')}`}</Typography>
}