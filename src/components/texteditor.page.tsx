import {
    ContentBlock,
    convertToRaw,
    DraftEditorCommand,
    Editor,
    EditorState,
    getDefaultKeyBinding,
    KeyBindingUtil,
    Modifier,
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
    const handleKeyCommand = (command: DraftEditorCommand) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        console.log(`handleKeyCommandDefault: ${command}`)
        if (newState) {
            console.log(`NewState => handleKeyComman: ${command}`)
            setEditorState(newState)
            return 'handled'
        } else {
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

    const _onTab = (e: React.KeyboardEvent) => {
        e.preventDefault()
        const selection = editorState.getSelection()
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType()

        console.log(`onTab(blockType): ${blockType}`)

        if (e.shiftKey && e.key === 'Tab') {
            console.log('press Shift + Tab')
            return
        }

        if (
            blockType === 'ordered-list-item' ||
            blockType === 'unordered-list-item'
        ) {
            setEditorState(RichUtils.onTab(e, editorState, 4))
            return
        }

        const tabCharactor = '_𝘴𝘱𝘢𝘤𝘦_𝘤𝘩𝘢𝘳𝘢𝘤𝘵𝘰𝘳_'
        // const tabCharactor = '\t'
        const newContentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            tabCharactor
        )
        setEditorState(
            EditorState.push(
                editorState,
                newContentState,
                'change-inline-style'
            )
        )
        return
    }

    const customKeyBindingFn = (e: React.KeyboardEvent) => {
        console.log(
            `CustomKeyBinding: ${e.code} shiftkey : ${JSON.stringify(
                e.shiftKey
            )}`
        )
        if (
            KeyBindingUtil.hasCommandModifier(e) &&
            e.shiftKey &&
            e.key === 'x'
        ) {
            return 'shift+x'
        }
        return getDefaultKeyBinding(e)
    }

    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>#Text Toolbar</p>
            <pre>
                <TextEditorToolbar
                    editorState={editorState}
                    setEditorState={setEditorState}
                />
            </pre>

            <p style={{ fontWeight: 'bold' }}>#Text editor</p>
            <div
                style={{
                    border: '1px solid #d1d1d1',
                    padding: '1rem',
                    borderRadius: '0.3rem',
                }}
            >
                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    blockRendererFn={renderBlock}
                    keyBindingFn={customKeyBindingFn} //handle tab
                    onTab={_onTab} //handle tab on list
                />
            </div>
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
