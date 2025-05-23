import {useState, useEffect} from 'react';
import Markdown from "react-markdown";
import RequireResources from "./RequireResources";
import {getText} from "pithekos-lib";

export default function BookContent({sectionPointer}) {
    const [intros, setIntros] = useState({});

    useEffect(() => {
        const getIntros = async bookCodes => {
        const newIntros = {};
        for (const bookCode of bookCodes) {
            const response = await getText(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_xenizo_book-notes?ipath=${bookCode}.md`);
            if (response.ok) {
                newIntros[bookCode] = response.text;
            } else {
                console.log(`Could not load markdown text for ${bookCode}: ${response.error}`);
            }
        }
        setIntros(newIntros);
    };
    getIntros(["MAT", "MRK", "LUK", "JHN"]).then();
},
[]
);

    return <RequireResources
        required={[
            ["Introductions de Livre Xenizo (ILX)", "git.door43.org/BurritoTruck/fr_xenizo_book-notes",],
        ]}
    >
        {intros[sectionPointer[0]] && <Markdown>{intros[sectionPointer[0]]}</Markdown>}
    </RequireResources>
}