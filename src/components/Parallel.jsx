import {useState, useEffect, useContext} from 'react';
import {getJson, getAndSetJson, debugContext} from "pithekos-lib";
import {Button, Grid2, Typography} from "@mui/material";

export default function Parallel() {

    const [parallel, setParallel] = useState([]);
    const [juxtas, setJuxtas] = useState({
        MAT: {},
        MRK: {},
        LUK: {},
        JHN: {}
    });
    const [contentView, setContentView] = useState("gloss");
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

    const juxtaIndexes = (fromJuxtaString, toJuxtaString) => {
        let fromJuxta = parseInt(fromJuxtaString) - 1;
        const toJuxta = parseInt(toJuxtaString) - 1;
        if (!fromJuxta || !toJuxta) {
            return [];
        }
        if (fromJuxta > toJuxta) {
            return [];
        }
        let ret = [];
        while (fromJuxta <= toJuxta) {
            ret.push(fromJuxta);
            fromJuxta++;
        }
        return ret;
    }

    if (parallel.length === 0) {
        return <div>Loading...</div>;
    } else {
        return <>
            <Button
                sx={{ml: 2, position: "absolute", top: "75px", right: "50px"}}
                color="primary"
                size="large"
                variant="contained"
                aria-label={contentView}
                onClick={
                    () => {
                        if (contentView === "gloss") {
                            setContentView("source")
                        } else if (contentView === "source") {
                            setContentView("juxta")
                        } else {
                            setContentView("gloss")
                        }
                    }
                }
            >
                {contentView}
            </Button>
            <Grid2 container style={{fontSize: "x-small"}}>
                <Grid2 item size={12}>
                    <Typography variant="h6">To use this experimental page you will need to download some
                        resources from BurritoTruck: XPG; NTJXT; NCX</Typography>
                    <Typography variant="h6">Critical notes only exist for MRK</Typography>
                </Grid2>
                {
                    parallel.map((line, n) => <>
                            {
                                line["TITLE"] &&
                                <Grid2
                                    item
                                    size={12}
                                    display="flex"
                                    justifyContent="center"
                                    alignContent="center"
                                    sx={{backgroundColor: "#777", color: "#FFF"}}>
                                    <Typography variant="h6">{line["TITLE"]}</Typography>
                                </Grid2>
                            }
                            {
                                ["MRK", "LUK", "MAT", "JHN"].map(
                                    bookCode => <Grid2 container key={`${bookCode}-${n}`} size={3} spacing={1} item
                                                       display="flex" flexDirection="row" alignContent="flex-start">
                                        {line[bookCode]["chapter"] ?
                                            <>
                                                <Grid2 item size={12} display="flex"
                                                       justifyContent="center"
                                                       alignContent="center"
                                                       sx={{backgroundColor: "#DDD"}}
                                                >
                                                    <b><i>{`${bookCode} ${line[bookCode]["chapter"]}.${line[bookCode]["fromVerse"]}${line[bookCode]["fromVerse"] !== line[bookCode]["toVerse"] ? "-" + line[bookCode]["toVerse"] : ""}`}</i></b>
                                                </Grid2>
                                                {
                                                    juxtaIndexes(line[bookCode]["fromJuxta"], line[bookCode]["toJuxta"])
                                                        .map(ji => <>
                                                                {
                                                                    contentView === "juxta" &&
                                                                    <Grid2 item size={12} display="flex" alignContent="center"
                                                                           justifyContent="center">
                                                                        <b>{ji + 1}</b>
                                                                    </Grid2>
                                                                }
                                                                {
                                                                    contentView === "juxta" &&
                                                                    juxtas[bookCode].sentences &&
                                                                    juxtas[bookCode].sentences[ji] &&
                                                                    juxtas[bookCode].sentences[ji].chunks
                                                                        .map(
                                                                            (c, n) => <>
                                                                                <Grid2
                                                                                    key={`${n}-2`}
                                                                                    item
                                                                                    size={6}
                                                                                    display="flex"
                                                                                    justifyContent="right"
                                                                                    alignItems="right"
                                                                                >
                                                                                    {c.source.map(s => s.content).join(' ')}
                                                                                </Grid2>
                                                                                <Grid2
                                                                                    key={`${n}-3`}
                                                                                    item
                                                                                    size={6}
                                                                                >
                                                                                    {c.gloss}
                                                                                </Grid2>
                                                                            </>
                                                                        )
                                                                }
                                                            </>
                                                        )
                                                }
                                                {
                                                    contentView === "source" &&
                                                    juxtaIndexes(line[bookCode]["fromJuxta"], line[bookCode]["toJuxta"])
                                                        .map(ji => <Grid2 item size={12}>{
                                                                `${ji}: ` +
                                                                juxtas[bookCode].sentences[ji].chunks
                                                                    .map(
                                                                        (c, n) => c.source.map(s => s.content).join(" ")
                                                                    )
                                                                    .join(" ") + "."
                                                            }
                                                            </Grid2>
                                                        )
                                                }
                                                {
                                                    contentView === "gloss" &&
                                                    juxtaIndexes(line[bookCode]["fromJuxta"], line[bookCode]["toJuxta"])
                                                        .map(ji => <Grid2 item size={12}>{
                                                                `${ji}: ` +
                                                                juxtas[bookCode].sentences[ji].chunks
                                                                    .map(
                                                                        (c, n) => c.gloss
                                                                    )
                                                                    .join(" ")
                                                            }
                                                            </Grid2>
                                                        )
                                                }
                                            </> :
                                            <Grid2 item size={12} display="flex" alignContent="center"
                                                   justifyContent="center">---</Grid2>
                                        }
                                    </Grid2>
                                )
                            }
                        </>
                    )
                }
            </Grid2>
        </>
    }
}



