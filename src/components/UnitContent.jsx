import {Typography} from "@mui/material";
import {useState, useEffect} from "react";

export default function UnitContent({sectionPointer, sectionOrders, sections, juxtas}) {
    const [section, setSection] = useState(null);
    const [unit, setUnit] = useState(null);

    useEffect(
        () => {
            const sectionsForBook = bookCode => {
                return Object.entries(sections)
                    .filter(s => s[1][bookCode].cvs)
                    .sort(
                        (a, b) => {
                            const cvA = a[1][bookCode].cvs;
                            const cA = parseInt(cvA.split(":")[0]);
                            const cvB = b[1][bookCode].cvs;
                            const cB = parseInt(cvB.split(":")[0]);
                            if (cA !== cB) {
                                return cA - cB;
                            }
                            const vA = parseInt(cvA.split(":")[1].split("-")[0]);
                            const vB = parseInt(cvB.split(":")[1].split("-")[0]);
                            return vA - vB;
                        }
                    )
            };
            if (sections) {
                const newSection = sectionsForBook(sectionPointer[0])[sectionPointer[1]][1];
                setSection(newSection);
                setUnit(newSection[sectionPointer[0]].units[sectionPointer[2]]);
            }
        }
    );
    if (!section || !unit) {
        return <p>Loading...</p>
    }
    return <>
        <Typography variant="h6">{`${sectionPointer[0]} ${unit.cv}`}</Typography>
    </>
}