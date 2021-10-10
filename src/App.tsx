import React from 'react'
import './App.css'
import TextEditorPage from './components/texteditor.page'
import 'draft-js/dist/Draft.css'

const App: React.FC = () => {
    return <div className="Container">
      <h1>React Typescript Draftjs Tutorials</h1>
      <TextEditorPage />
    </div>
}

export default App
