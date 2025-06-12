import {Button, ButtonGroup, Stack, Typography, Dialog, Toolbar, AppBar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CompareIcon from '@mui/icons-material/Compare';
import {useState} from "react";
import Parallel from "./Parallel";
import IconButton from "@mui/material/IconButton";

export default function ContentNavigator(
    {
        books,
        navLevel,
        setNavLevel,
        sectionPointer,
        setSectionPointer,
        content,
        languages
    }
) {
    const sectionsForBook = bookCode => {
        return Object.entries(content["xpg"]["sections"])
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
    }
    const bookSections = sectionsForBook(sectionPointer[0]);

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
            if (previousBook()) {
                return [previousBook(), 0, 0];
            } else {
                return null;
            }
        }
        if (navLevel === "section") {
            const previousSection = sectionPointer[1] - 1;
            if (previousSection < 0) {
                if (previousBook()) {
                    const previousBookSections = sectionsForBook(previousBook());
                    return [previousBook(), previousBookSections.length - 1, 0];
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
                    const previousBookSections = sectionsForBook(previousBook());
                    const previousBookUnits = previousBookSections[previousBookSections.length - 1][1][previousBook()]["units"];
                    return [
                        previousBook(),
                        previousBookSections.length - 1,
                        previousBookUnits.length - 1,
                    ];
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
            if (nextBook()) {
                return [nextBook(), 0, 0];
            } else {
                return null;
            }
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
        const destinationBookSections = sectionsForBook(destination[0]);
        if (navLevel === "book") {
            return <Typography variant="body2">{destination[0]}</Typography>;
        }
        if (navLevel === "section") {
            let ret = [];
            if (destination[0] !== sectionPointer[0]) {
                ret.push(<Typography variant="caption">{destination[0]}</Typography>);
            }
            ret.push(<Typography
                variant="body2">{content["xpg"]["i18n" + languages[0].toUpperCase()][destinationBookSections[destination[1]][0]]["title"]}</Typography>);
            return ret;
        }
        let ret = [];
        if (destination[0] !== sectionPointer[0]) {
            ret.push(<Typography variant="caption">{destination[0]}</Typography>);
        }
        if (destination[1] !== sectionPointer[1]) {
            ret.push(<Typography
                variant="caption">{content["xpg"]["i18n" + languages[0].toUpperCase()][destinationBookSections[destination[1]][0]]["title"]}</Typography>);
        }
        ret.push(<Typography
            variant="body2">{destinationBookSections[destination[1]][1][destination[0]]["units"][destination[2]]["cv"]}</Typography>);
        return ret;
    }

    const [parallelOpen, setParallelOpen] = useState(false);
    return <>
        <ButtonGroup sx={{width: '100%', border: 1, borderColor: "secondary.main"}}>
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
            <ButtonGroup orientation="vertical" sx={{width: '40%', border: 1, borderColor: "secondary.main"}}>
                <ButtonGroup>
                    <Button
                        variant={navLevel === "book" ? "contained" : "text"}
                        size="large"
                        color="secondary"
                        sx={{width: '20%'}}
                    />
                    <Button
                        sx={{width: '60%'}}
                        variant={navLevel === "book" ? "contained" : "text"}
                        color="secondary"
                        size="small"
                        onClick={() => setNavLevel("book")}
                    >
                        <Typography variant="body2">{sectionPointer[0]}</Typography>
                    </Button>
                    <Button
                        variant={navLevel === "book" ? "contained" : "text"}
                        size="large"
                        color="secondary"
                        sx={{width: '20%'}}
                        onClick={() => setParallelOpen(true)}
                        endIcon={<CompareIcon/>}
                    >
                        Comparer
                    </Button>
                </ButtonGroup>
                <Button
                    variant={navLevel === "section" ? "contained" : "outlined"}
                    color="secondary"
                    size="small"
                    onClick={() => setNavLevel("section")}
                >
                    <Typography variant="body2">
                        {content["xpg"]["i18n" + languages[0].toUpperCase()][bookSections[sectionPointer[1]][0]]["title"]}
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
                    <Typography variant="body2">
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
        <Dialog
            fullScreen
            open={parallelOpen}
            onClose={() => setParallelOpen(false)}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="secondary"
                        onClick={() => setParallelOpen(false)}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        ||
                    </Typography>
                </Toolbar>
            </AppBar>
            <Parallel
                content={content}
            />
        </Dialog>
    </>
}