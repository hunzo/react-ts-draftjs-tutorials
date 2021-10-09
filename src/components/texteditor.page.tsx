import {
    ContentBlock,
    convertToRaw,
    DraftEditorCommand,
    Editor,
    EditorState,
    RichUtils,
} from 'draft-js'
import React, { useState } from 'react'
import { linkDecorator } from './render/Link' //decoraed Link
import { MediaComponent } from './render/Media'
import './texteditor.page.css'
import TextEditorToolbar from './texteditor.toolbar'

const TextEditorPage: React.FC = () => {
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty(linkDecorator)
    )
    const handleCommand = (command: DraftEditorCommand) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState)
            console.log('handle')
            return 'handled'
        } else {
            console.log(`not-handle ${Date.now()}`)
            return 'not-handled'
        }
    }

    const renderBlock = (contentBlock: ContentBlock) => {
        if (contentBlock.getType() === 'atomic') {
            const entityKey = contentBlock.getEntityAt(-1)
            const entityData = editorState
                .getCurrentContent()
                .getEntity(entityKey)
                .getData()
            return {
                component: MediaComponent,
                editable: false,
                props: {
                    src: { file: entityData.src },
                },
            }
        }
        }

    return (
        <div>
            <p style={{fontWeight: "bold"}}>#Text Toolbar</p>
            <pre>
                <TextEditorToolbar
                    editorState={editorState}
                    setEditorState={setEditorState}
                />
            </pre>

            <p style={{fontWeight: "bold"}}>#Text editor</p>
            <pre>
                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleCommand}
                    blockRendererFn={renderBlock}
                />
            </pre>
            <p>#debug</p>
            <pre>
                {JSON.stringify(
                    convertToRaw(editorState.getCurrentContent()),
                    null,
                    2
                )}
            </pre>
        </div>
    )
}

export default TextEditorPage
