import {useState, useEffect} from 'react';
import {Box, Divider, Grid2} from '@mui/material';
import SentencePicker from './SentencePicker';
import {getAndSetJson} from 'pithekos-lib';


export default function SingleBook({src}) {

    const [juxtaSentences, setJuxtaSentences] = useState({sentences: []});
    const [juxtaSentenceN, setJuxtaSentenceN] = useState(0);

    useEffect(
        () => {
            getAndSetJson({
                url: `/burrito/ingredient/raw/git.door43.org/BurritoTruck/fr_juxta/?ipath=${src}`,
                setter: setJuxtaSentences
            })
        },
        [src]
    );
    return juxtaSentences.sentences.length > juxtaSentenceN ?
        <Box>
            <Grid2 container display="flex" direction="row" spacing={1}>
                <Grid2 item size={12}>
                    <SentencePicker
                        value={juxtaSentenceN}
                        setValue={
                            (v,e) => {
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
        <Box>...</Box>;
}