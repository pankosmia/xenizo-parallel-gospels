import {useState} from "react";
import ContentNavigator from "./ContentNavigator";
import {Box, Stack} from "@mui/material";
import BookContent from "./BookContent";
import SectionContent from "./SectionContent";
import UnitContent from "./UnitContent";

export default function ContentViewer ({content, languages}) {
    const [sectionPointer, setSectionPointer] = useState(["MRK", 0, 0]);
    const [navLevel, setNavLevel] = useState("book");

    if (!content["xpg"]["sections"] || !content["xpg"]["i18n" + languages[0].toUpperCase()]) {
        return <Box>Loading...</Box>
    }

    const books = ["MAT", "MRK", "LUK", "JHN"];

    return <Stack>
        <ContentNavigator
            books={books}
            content={content}
            sectionPointer={sectionPointer}
            setSectionPointer={setSectionPointer}
            navLevel={navLevel}
            setNavLevel={setNavLevel}
            languages={languages}
        />
        {
            (navLevel === "book") &&
            <BookContent
                sectionPointer={sectionPointer}
                content={content}
            />
        }
        {
            (navLevel === "section") &&
            <SectionContent
                sectionPointer={sectionPointer}
                content={content}
            />
        }
        {
            (navLevel === "unit") &&
            <UnitContent
                sectionPointer={sectionPointer}
                content={content}
                languages={languages}
            />
        }
    </Stack>
}
