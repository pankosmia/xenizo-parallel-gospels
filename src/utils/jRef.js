const unpackJRef = ref => {
    const [_, sentenceRange] = ref.split(":");
    let [fromSentence, toSentence] = sentenceRange.split("-");
    if (!toSentence) {
        toSentence = fromSentence;
    }
    return [parseInt(fromSentence), parseInt(toSentence)];
}

const unpackJCRef = ref => {
    const [_, sentence, clause] = ref.split(":");
   return [parseInt(sentence), parseInt(clause)];
}

const matchingSentence = (sentenceTuple, toMatch) => {
    return toMatch >= sentenceTuple[0] && toMatch <= sentenceTuple[1];
}

const matchingSentenceClause = (sentenceTuple, toMatch, clause) => {
    // console.log(sentenceTuple, toMatch, clause);
    return toMatch === sentenceTuple[0] && clause === sentenceTuple[1];
}

const matchingRef = (ref, toMatch) => matchingSentence(unpackJRef(ref), toMatch);

export {unpackJRef, unpackJCRef, matchingRef, matchingSentence, matchingSentenceClause};