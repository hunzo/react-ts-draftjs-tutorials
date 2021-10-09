import { CompositeDecorator, DraftDecoratorComponentProps } from 'draft-js'
import React from 'react'

export const Link = (props: DraftDecoratorComponentProps) => {
    const { url } = props.contentState.getEntity(props.entityKey || "").getData()
    // const eKey = props.entityKey
    // console.log(eKey)
    // console.log(url)
    // check URL
    return (
        // <a rel="noopener noreferrer" target="_blank" href={url}>
        <a href={url} style={{textDecoration: "none", fontSize: "18px"}} target={url}>
            {props.children}
        </a>
    )
}
export const linkDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK";
      }, callback);
    },
    component: Link
  }
]);

