import Markdown from "react-markdown";

export default function JuxtaGlossViewer({content, firstSentence, lastSentence}) {
    return content.slice(firstSentence, lastSentence)
        .map(
            s => <Markdown>
                {
                    s.chunks
                        .map(c => c.gloss)
                        .join(" ")
                }
            </Markdown>
        )
}
