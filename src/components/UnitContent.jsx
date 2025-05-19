import {Typography} from "@mui/material";

export default function UnitContent({sectionPointer}) {
    return <Typography>{`UNIT Content for ${sectionPointer.join(', ')}`}</Typography>
}