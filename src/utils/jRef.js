const unpackJRef = ref => {
    const [_, sentenceRange] = ref.split(":");
    let [fromSentence, toSentence] = sentenceRange.split("-");
    if (!toSentence) {
        toSentence = fromSentence;
    }
    return [parseInt(fromSentence), parseInt(toSentence)];
}

const matchingSentence = (sentenceTuple, toMatch) => {
    return toMatch >= sentenceTuple[0] && toMatch <= sentenceTuple[1];
}

const matchingRef = (ref, toMatch) => matchingSentence(unpackJRef(ref), toMatch);

export {unpackJRef, matchingRef, matchingSentence};