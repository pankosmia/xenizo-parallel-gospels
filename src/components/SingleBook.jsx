import {useState, useEffect, useContext} from 'react';
import {Box, Divider, Grid2} from '@mui/material';
import SentencePicker from './SentencePicker';
import {getAndSetJson, getText, debugContext} from 'pithekos-lib';
import CVDisplay from "./CVDisplay";
import MaybeNotes from "./MaybeNotes";
import {unpackJRef, unpackJCRef} from "../utils/jRef";

export default function SingleBook({src}) {

    const [sourcesFound, setSourcesFound] = useState(false);
    const [criticalNotes, setCriticalNotes] = useState([]);
    const [verbParsings, setVerbParsings] = useState([]);
    const [juxtaSentences, setJuxtaSentences] = useState({sentences: []});
    const [juxtaSentenceN, setJuxtaSentenceN] = useState(1);
    const {debugRef} = useContext(debugContext);

    useEffect(
        () => {
            getAndSetJson({
                url: `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_juxta/?ipath=${src}.json`,
                setter: setJuxtaSentences
            }).then(
                () => {
                    getText(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_cn/?ipath=cn_${src}.tsv`, debugRef.current)
                        .then(r => {
                                if (r.ok) {
                                    setCriticalNotes(
                                        r.text.split("\n")
                                            .slice(1)
                                            .map(r => r.split("\t"))
                                            .filter(r => r.length > 1)
                                            .map(r => [...r.slice(0, 2), unpackJRef(r[2]), ...r.slice(3)])
                                    );
                                    getText(`/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_vp/?ipath=vp_${src}.tsv`, debugRef.current)
                                        .then(r => {
                                                if (r.ok) {
                                                    setVerbParsings(
                                                        r.text.split("\n")
                                                            .slice(1)
                                                            .map(r => r.split("\t"))
                                                            .filter(r => r.length > 1)
                                                            .map(r => [...r.slice(0, 2), unpackJCRef(r[2]), ...r.slice(3)])
                                                    )
                                                }
                                            }
                                        )
                                }
                            }
                        ).then(() =>
                        setSourcesFound(true)
                    )
                })
        },
        [src]
    );

    return sourcesFound ?
        (
            juxtaSentences.sentences.length >= juxtaSentenceN ?
                <Box>
                    <Grid2 container display="flex" direction="row" spacing={1}>
                        <Grid2 item size={12}>
                            <CVDisplay book={juxtaSentences.bookCode}
                                       sentence={juxtaSentences.sentences[juxtaSentenceN - 1]}/>
                        </Grid2>
                        <Grid2 item size={12}>
                            <SentencePicker
                                value={juxtaSentenceN}
                                setValue={
                                    (v, e) => {
                                        console.log(v, e);
                                        if (typeof v === "number") {
                                            setJuxtaSentenceN(v)
                                        }
                                    }
                                }
                                maxValue={juxtaSentences.sentences.length}
                            />
                        </Grid2>
                        <Grid2 item size={12}>
                            <Divider/>
                        </Grid2>
                        <Grid2 item size={12}>
                            {juxtaSentences.sentences[juxtaSentenceN - 1].sourceString}
                        </Grid2>
                        <Grid2 item size={12}>
                            <MaybeNotes source={criticalNotes} sentenceN={juxtaSentenceN - 1}/>
                        </Grid2>
                        <Grid2 item size={12}>
                            <Divider/>
                        </Grid2>
                        {
                            juxtaSentences.sentences[juxtaSentenceN - 1].chunks
                                .map(
                                    (c, n) => <>
                                        <Grid2
                                            item
                                            size={3}
                                            key={`${n}-1`}
                                        >
                                            <MaybeNotes source={verbParsings} sentenceN={juxtaSentenceN - 2}
                                                        clause={n}/>
                                        </Grid2>
                                        <Grid2
                                            key={`${n}-2`}
                                            display="flex"
                                            item
                                            size={3}
                                            justifyContent="right"
                                            alignItems="right"
                                        >
                                            {c.source.map(s => s.content).join(' ')}
                                        </Grid2>
                                        <Grid2
                                            key={`${n}-3`}
                                            item
                                            size={3}
                                        >
                                            {c.gloss}
                                        </Grid2>
                                        <Grid2
                                            key={`${n}-4`}
                                            item
                                            size={3}
                                            key={`${n}-1`}
                                        >
                                        </Grid2>
                                    </>
                                )
                        }
                    </Grid2>
                </Box> :
                <Box>...</Box>) :
        <Box>Missing sources</Box>
}