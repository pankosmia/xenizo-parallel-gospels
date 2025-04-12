import {useState, useEffect, useContext} from 'react';
import {Box, Divider, Grid2} from '@mui/material';
import SentencePicker from './SentencePicker';
import {getAndSetJson, getText, debugContext} from 'pithekos-lib';


export default function SingleBook({src}) {

    const [sourcesFound, setSourcesFound] = useState(false);
    const [criticalNotes, setCriticalNotes] = useState([]);
    const [juxtaSentences, setJuxtaSentences] = useState({sentences: []});
    const [juxtaSentenceN, setJuxtaSentenceN] = useState(0);
    const {debugRef} = useContext(debugContext);

    const unpackJRef = ref => {
        const [_, sentenceRange] = ref.split(":");
        let [fromSentence, toSentence] = sentenceRange.split("-");
        if (!toSentence) {
            toSentence = fromSentence;
        }
        return [parseInt(fromSentence), parseInt(toSentence)];
    }

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
                                        .map(r => [...r.slice(0, 2), unpackJRef(r[2]), ...r.slice(4)])
                                )
                            }
                        })
                }
            ).then(() =>
                setSourcesFound(true)
            )
        },
        [src]
    );

    console.log(JSON.stringify(criticalNotes, null, 2));

    return sourcesFound ?
        (
            juxtaSentences.sentences.length > juxtaSentenceN ?
                <Box>
                    <Grid2 container display="flex" direction="row" spacing={1}>
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
                                maxValue={juxtaSentences.sentences.length - 1}
                            />
                        </Grid2>
                        <Grid2 item size={12}>
                            {juxtaSentences.sentences[juxtaSentenceN].sourceString}
                        </Grid2>
                        <Grid2 item size={12}>
                            <Divider/>
                        </Grid2>
                        {
                            juxtaSentences.sentences[juxtaSentenceN].chunks
                                .map(
                                    c => <>
                                        <Grid2
                                            display="flex"
                                            item
                                            size={6}
                                            justifyContent="right"
                                            alignItems="right"
                                        >
                                            {c.source.map(s => s.content).join(' ')}
                                        </Grid2>
                                        <Grid2
                                            item
                                            size={6}
                                        >
                                            {c.gloss}
                                        </Grid2>
                                    </>
                                )
                        }
                    </Grid2>
                </Box> :
                <Box>...</Box>) :
        <Box>Missing sources</Box>
}