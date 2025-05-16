import {Button, ButtonGroup} from "@mui/material";
import {useState} from "react";


export default function ContentNavigator({sections, sectionsI18n, sectionPointer, setSectionPointer}) {
    const books = ["MAT", "MRK", "LUK", "JHN"];
    const [navLevel, setNavLevel] = useState("book");
    const bookSections = Object.entries(sections)
        .filter(s => s[1][sectionPointer[0]].cvs)
        .sort(
            (a, b) => {
                const cvA = a[1][sectionPointer[0]].cvs;
                const cA = parseInt(cvA.split(":")[0]);
                const cvB = b[1][sectionPointer[0]].cvs;
                const cB = parseInt(cvB.split(":")[0]);
                if (cA !== cB) {
                    return cA - cB;
                }
                const vA = parseInt(cvA.split(":")[1].split("-")[0]);
                const vB = parseInt(cvB.split(":")[1].split("-")[0]);
                return vA - vB;
            }
        )

    const nextBook = () => {
        const currentBookIndex = books.indexOf(sectionPointer[0]);
        if ((currentBookIndex > -1) && (currentBookIndex < books.length)) {
            return books[currentBookIndex + 1]
        } else {
            return null;
        }
    }

    const previousBook = () => {
        const currentBookIndex = books.indexOf(sectionPointer[0]);
        if ((currentBookIndex > -1) && (currentBookIndex > 0)) {
            return books[currentBookIndex - 1]
        } else {
            return null;
        }
    }

    return <ButtonGroup sx={{width: '100%'}}>
        <Button
            sx={{width: '30%'}}
            size="small"
            disabled={!previousBook()}
            onClick={() => setSectionPointer([previousBook(), 0, 0])}
        >
            {
                previousBook() || "-"
            }
        </Button>
        <ButtonGroup orientation="vertical" sx={{width: '40%'}}>
            <Button
                variant={navLevel === "book" ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => setNavLevel("book")}
            >
                {sectionPointer[0]}
            </Button>
            <Button
                variant={navLevel === "section" ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => setNavLevel("section")}
            >
                {sectionsI18n["fr"][bookSections[sectionPointer[1]][0]]["title"]}
                {" ("}
                {bookSections[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                {")"}
            </Button>
            <Button
                variant={navLevel === "unit" ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => setNavLevel("unit")}
            >
                {bookSections[sectionPointer[1]][1][sectionPointer[0]]["units"][sectionPointer[2]]["cv"]}
            </Button>
        </ButtonGroup>
        <Button
            sx={{width: '30%'}}
            size="small"
            disabled={!nextBook()}
            onClick={() => setSectionPointer([nextBook(), 0, 0])}
        >
            {
                nextBook() || "-"
            }
        </Button>
    </ButtonGroup>
}