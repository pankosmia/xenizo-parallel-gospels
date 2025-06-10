import Markdown from "react-markdown";

export default function BookContent({sectionPointer, content}) {

    return content["bookIntros"][sectionPointer[0]] ? <Markdown>{content["bookIntros"][sectionPointer[0]]}</Markdown> : <p>Loading...</p>
}