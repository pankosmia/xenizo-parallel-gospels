import {useEffect, useState} from "react";
import {getJson, getAndSetJson} from 'pithekos-lib';
import ContentNavigator from "./ContentNavigator";
import {Box, Stack} from "@mui/material";

export default function ContentViewer () {
    const [juxtas, setJuxtas] = useState({});
    const [sections, setSections] = useState(null);
    const [sectionsI18n, setSectionsI18n] = useState({});
    const [sectionOrders, setSectionOrders] = useState({});
    const [sectionPointer, setSectionPointer] = useState(["MRK", 0, 0]);

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

    if (!sections || !juxtas[sectionPointer[0]] || !sectionsI18n["fr"]) {
        return <Box>Loading...</Box>
    }

    return <Stack>
        <ContentNavigator
            sectionPointer={sectionPointer}
            setSectionPointer={setSectionPointer}
            sections={sections}
            sectionOrders={sectionOrders}
            sectionsI18n={sectionsI18n}
        />
    </Stack>

}
