import {useEffect, useState} from "react";
import {getJson, getAndSetJson} from 'pithekos-lib';
import ContentNavigator from "./ContentNavigator";
import {Box, Stack} from "@mui/material";
import BookContent from "./BookContent";
import SectionContent from "./SectionContent";
import UnitContent from "./UnitContent";

export default function ContentViewer () {
    const [juxtas, setJuxtas] = useState({});
    const [sections, setSections] = useState(null);
    const [sectionsI18n, setSectionsI18n] = useState({});
    const [sectionOrders, setSectionOrders] = useState({});
    const [sectionPointer, setSectionPointer] = useState(["MRK", 0, 0]);
    const [navLevel, setNavLevel] = useState("book");

    useEffect(
        () => {
            if (!sections) {
                getAndSetJson({
                    url: `/burrito/ingredient/raw/git.door43.org/BurritoTruck/en_syn?ipath=sections.json`,
                    setter: setSections
                });
            }
        },
        []
    );

    useEffect(
        () => {
            const getSectionOrders = async bookCodes => {
                const newSectionOrders = {};
                for (const bookCode of bookCodes) {
                    const response = await getJson(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/en_syn?ipath=sectionOrders/${bookCode}.json`);
                    if (response.ok) {
                        newSectionOrders[bookCode] = response.json;
                    } else {
                        console.log(`Could not load sectionOrder for ${bookCode}: ${response.error}`);
                    }
                }
                setSectionOrders(newSectionOrders);
            };
            getSectionOrders(["MRK"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getSectionI18ns = async langCodes => {
                const newSectionsI18n = {};
                for (const langCode of langCodes) {
                    const response = await getJson(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/en_syn?ipath=i18n/${langCode}.json`);
                    if (response.ok) {
                        newSectionsI18n[langCode] = response.json;
                    } else {
                        console.log(`Could not load section i18n for ${langCode}: ${response.error}`);
                    }
                }
                setSectionsI18n(newSectionsI18n);
            };
            getSectionI18ns(["en", "fr"]).then();
        },
        []
    );

    useEffect(
        () => {
            const getJuxtas = async bookCodes => {
                const newJuxtas = {};
                for (const bookCode of bookCodes) {
                    const response = await getJson(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_juxta/?ipath=${bookCode}.json`);
                    if (response.ok) {
                        newJuxtas[bookCode] = response.json;
                    } else {
                        console.log(`Could not load juxta for ${bookCode}: ${response.error}`);
                    }
                }
                setJuxtas(newJuxtas);
            };
            getJuxtas(["MAT", "MRK", "LUK", "JHN"]).then();
        },
        []
    );

    if (!sections || !sectionsI18n["fr"]) {
        return <Box>Loading...</Box>
    }

    const books = ["MAT", "MRK", "LUK", "JHN"];

    if (!sections) {
        return <Box>Loading...</Box>
    }

    return <Stack>
        <ContentNavigator
            books={books}
            sectionPointer={sectionPointer}
            setSectionPointer={setSectionPointer}
            sections={sections}
            sectionOrders={sectionOrders}
            sectionsI18n={sectionsI18n}
            navLevel={navLevel}
            setNavLevel={setNavLevel}
        />
        {
            (navLevel === "book") &&
            <BookContent
                sectionPointer={sectionPointer}
            />
        }
        {
            (navLevel === "section") &&
            <SectionContent
                sectionPointer={sectionPointer}
            />
        }
        {
            (navLevel === "unit") &&
            <UnitContent
                sectionPointer={sectionPointer}
            />
        }
    </Stack>

}
