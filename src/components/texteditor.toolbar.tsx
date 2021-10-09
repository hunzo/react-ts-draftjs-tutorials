import {
    AtomicBlockUtils,
    EditorState,
    RichUtils,
} from 'draft-js'
import React from 'react'
import './texteditor.page.css'

interface Props {
    editorState: EditorState
    setEditorState: any
}

const TextEditorToolbar: React.FC<Props> = ({
    editorState,
    setEditorState,
}) => {
    const handleBlockClick = (event: React.MouseEvent, inlineStyle: string) => {
        event.preventDefault()
        setEditorState(RichUtils.toggleBlockType(editorState, inlineStyle))
    }

    const handleToggleClick = (
        event: React.MouseEvent,
        inlineStyle: string
    ) => {
        event.preventDefault()
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
    }

    const handleAddLink = () => {
        const selection = editorState.getSelection()
        const link = prompt('please insert image link')
        if (!link) {
            setEditorState(RichUtils.toggleLink(editorState, selection, null))
            return
        }
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {
                url: link,
            }
        )
        const newEditorState = EditorState.push(
            editorState,
            contentStateWithEntity,
            'apply-entity'
        )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        setEditorState(
            RichUtils.toggleLink(newEditorState, selection, entityKey)
        )
    }

    const handleInsertImageURL = () => {
        const selection = editorState.getSelection()
        const src = prompt('please insert image link')
        if (!src) {
            setEditorState(editorState, selection, null)
            return
        }
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
            'image',
            'IMMUTABLE',
            { src }
        )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
        })
        return setEditorState(
            AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
        )
    }

    const handleInsertImageFile = (file: FileReader) => {
        console.log('insert image file')
        console.log(file)
        const contentStateWithEntity = editorState
            .getCurrentContent()
            .createEntity('image', 'IMMUTABLE', {
                src: file.result,
            })
        setEditorState(
            AtomicBlockUtils.insertAtomicBlock(
                EditorState.set(editorState, {
                    currentContent: contentStateWithEntity,
                }),
                contentStateWithEntity.getLastCreatedEntityKey(),
                ' '
            )
        )
    }

    return (
        <div>
            <pre>
                <button onMouseDown={(e) => handleBlockClick(e, 'header-one')}>
                    H1
                </button>
                <button onMouseDown={(e) => handleBlockClick(e, 'header-two')}>
                    H2
                </button>
                <button
                    onMouseDown={(e) => handleBlockClick(e, 'header-three')}
                >
                    H3
                </button>
                <button onMouseDown={(e) => handleBlockClick(e, 'header-four')}>
                    H4
                </button>
                <button onMouseDown={(e) => handleBlockClick(e, 'header-five')}>
                    H5
                </button>
                <button onMouseDown={(e) => handleBlockClick(e, 'header-six')}>
                    H6
                </button>
                <button
                    onMouseDown={(e) =>
                        handleBlockClick(e, 'ordered-list-item')
                    }
                >
                    ordered list
                </button>
                <button
                    onMouseDown={(e) =>
                        handleBlockClick(e, 'unordered-list-item')
                    }
                >
                    unordered list
                </button>
            </pre>

            <pre>
                <button onMouseDown={(e) => handleToggleClick(e, 'unstyled')}>
                    normal
                </button>
                <button onMouseDown={(e) => handleToggleClick(e, 'BOLD')}>
                    bold
                </button>
                <button onMouseDown={(e) => handleToggleClick(e, 'UNDERLINE')}>
                    under-line
                </button>
                <button onMouseDown={(e) => handleToggleClick(e, 'ITALIC')}>
                    italic
                </button>
                <button
                    onMouseDown={(e) => handleToggleClick(e, 'STRIKETHROUGH')}
                >
                    strikethrough
                </button>
            </pre>
            <pre>
                <button
                    disabled={editorState.getSelection().isCollapsed()}
                    onMouseDown={(e) => {
                        e.preventDefault()
                        handleAddLink()
                    }}
                >
                    Link
                </button>
                <button
                    // disabled={editorState.getSelection().isCollapsed()}
                    onMouseDown={(e) => {
                        e.preventDefault()
                        handleInsertImageURL()
                    }}
                >
                    ImageURL
                </button>
                <button
                    onClick={(e: React.MouseEvent) => {
                        e.preventDefault()
                        document.getElementById('fileInput')?.click()
                    }}
                >
                    ImageFile
                </button>
            </pre>
            <input
                id="fileInput"
                style={{ display: 'none' }}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                onChange={(event) => {
                    const reader = new FileReader()
                    reader.addEventListener(
                        'load',
                        () => {
                            handleInsertImageFile(reader)
                        },
                        false
                    )
                    if (event.target.files) {
                        reader.readAsDataURL(
                            Array.prototype.slice.call(event.target.files)[0]
                        )
                    }
                }}
            />
        </div>
    )
}

export default TextEditorToolbar
