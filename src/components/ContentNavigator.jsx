import {Button, ButtonGroup, Stack, Typography} from "@mui/material";
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

    const previousThing = () => {
        if (navLevel === "book") {
            return [previousBook(), 0, 0]
        }
        if (navLevel === "section") {
            const previousSection = sectionPointer[1] - 1;
            if (previousSection < 0) {
                if (previousBook()) {
                    return [previousBook(), 0, 0];
                } else {
                    return null;
                }
            } else {
                return [sectionPointer[0], previousSection, 0];
            }
        }
        const previousUnit = sectionPointer[2] - 1;
        if (previousUnit < 0) {
            const previousSection = sectionPointer[1] - 1;
            if (previousSection < 0) {
                if (previousBook()) {
                    return [previousBook(), 0, 0];
                } else {
                    return null;
                }
            } else {
                const previousSectionOb = bookSections[previousSection][1];
                return [sectionPointer[0], previousSection, previousSectionOb[sectionPointer[0]]["units"].length - 1];
            }
        } else {
            return [sectionPointer[0], sectionPointer[1], previousUnit];
        }
    }

    const nextThing = () => {
        if (navLevel === "book") {
            return [nextBook(), 0, 0]
        }
        if (navLevel === "section") {
            const nextSection = sectionPointer[1] + 1;
            if (nextSection >= bookSections.length) {
                if (nextBook()) {
                    return [nextBook(), 0, 0];
                } else {
                    return null;
                }
            } else {
                return [sectionPointer[0], nextSection, 0];
            }
        }
        const currentSection = bookSections[sectionPointer[1]][1];
        const nextUnit = sectionPointer[2] + 1;
        if (nextUnit >= currentSection[sectionPointer[0]]["units"].length) {
            const nextSection = sectionPointer[1] + 1;
            if (nextSection >= bookSections.length) {
                if (nextBook()) {
                    return [nextBook(), 0, 0];
                } else {
                    return null;
                }
            } else {
                return [sectionPointer[0], nextSection, 0];
            }
        } else {
            return [sectionPointer[0], sectionPointer[1], nextUnit];
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

    const renderDestination = destination => {
        if (navLevel === "book") {
            return <Typography>{destination[0]}</Typography>;
        }
        if (navLevel === "section") {
            let ret = [];
            if (destination[0] !== sectionPointer[0]) {
                ret.push(<Typography>{destination[0]}</Typography>);
            }
            ret.push(<Typography>{sectionsI18n["fr"][bookSections[destination[1]][0]]["title"]}</Typography>);
            return ret;
        }
        let ret = [];
        if (destination[0] !== sectionPointer[0]) {
            ret.push(<Typography>{destination[0]}</Typography>);
        }
        if (destination[1] !== sectionPointer[1]) {
            ret.push(<Typography>{sectionsI18n["fr"][bookSections[destination[1]][0]]["title"]}</Typography>);
        }
        ret.push(<Typography>{bookSections[destination[1]][1][destination[0]]["units"][destination[2]]["cv"]}</Typography>);
        return ret;
    }

    return <ButtonGroup sx={{width: '100%'}}>
        <Button
            sx={{width: '30%'}}
            size="small"
            disabled={!previousThing()}
            onClick={() => setSectionPointer(previousThing())}
        >
            {
                (previousThing() && <Stack>{renderDestination(previousThing())}</Stack>) || "-"
            }
        </Button>
        <ButtonGroup orientation="vertical" sx={{width: '40%'}}>
            <Button
                variant={navLevel === "book" ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => setNavLevel("book")}
            >
                <Typography>{sectionPointer[0]}</Typography>
            </Button>
            <Button
                variant={navLevel === "section" ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => setNavLevel("section")}
            >
                <Typography>
                    {sectionsI18n["fr"][bookSections[sectionPointer[1]][0]]["title"]}
                    {" ("}
                    {bookSections[sectionPointer[1]][1][sectionPointer[0]]["cvs"]}
                    {")"}
                </Typography>
            </Button>
            <Button
                variant={navLevel === "unit" ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => setNavLevel("unit")}
            >
                <Typography>
                    {bookSections[sectionPointer[1]][1][sectionPointer[0]]["units"][sectionPointer[2]]["cv"]}
                </Typography>
            </Button>
        </ButtonGroup>
        <Button
            sx={{width: '30%'}}
            size="small"
            disabled={!nextThing()}
            onClick={() => setSectionPointer(nextThing())}
        >
            {
                (nextThing() && <Stack>{renderDestination(nextThing())}</Stack>) || "-"
            }
        </Button>
    </ButtonGroup>
}