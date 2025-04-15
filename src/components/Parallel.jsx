import {useState, useEffect, useContext} from 'react';
import {getJson, getAndSetJson, debugContext} from "pithekos-lib";

export default function Parallel() {

    const [parallel, setParallel] = useState([]);
    const [juxtas, setJuxtas] = useState({
        MAT: [],
        MRK: [],
        LUK: [],
        JHN: []
    });
    const {debugRef} = useContext(debugContext);

    useEffect(
        () => {
            const getStuff = async () => {
                let newJuxtas = juxtas;
                for (const bookCode of ["MAT", "MRK", "LUK", "JHN"]) {
                    let response = await getJson(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_juxta/?ipath=${bookCode}.json`, debugRef.current);
                    if (response.ok) {
                        newJuxtas[bookCode] = response.json;
                    }
                }
                setJuxtas(newJuxtas);
                getAndSetJson({
                    url: "/burrito/ingredient/raw/git.door43.org/BurritoTruck/en_syn/?ipath=parallel.json",
                    setter: setParallel
                });
            };
            getStuff().then();
        },
        []
    );

        return <div>{parallel.length === 0 ? "loading" : "loaded"}</div>
}