import { ContentBlock, ContentState } from "draft-js"
import React from "react";

interface BlockComponentProps {
    contentState: ContentState
    block: ContentBlock
}
const Image =(props: BlockComponentProps) => {
    const {block, contentState} = props
    const {src} = contentState.getEntity(block.getEntityAt(0)).getData()
    return <img src={src} alt={src} role="presentation" style={{width: "50%"}} />
}

const Media = (props: BlockComponentProps) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
    // const type = entity.getType()
    let media = null

    if (entity.getType() === "image") {
    // if (type === "image") {
        media = <Image {...props}/>
    }

    return media

}

export const mediaBlockRenderor = (block: ContentBlock) => {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false
        }
    }
}

export const MediaComponent = ({ blockProps }: any) => {
  const src = blockProps.src;
  if (src.file) {
    return (
      <img
        style={{
          width: "50%"
        }}
        src={src.file}
        alt="article"
      />
    );
  }
  return null;
};