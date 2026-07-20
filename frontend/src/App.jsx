import { useState } from "react";
import UploadScreen from "./UploadScreen";
import ParseScreen from "./ParseScreen";

function App() {
    const [resume, setResume] = useState(null);

    return (
        <main className="app-container">
            <header className="app-header">
                <div className="logo-icon">parser.</div>
                <h1>Resume Parsing Tool</h1>
                <p className="subtitle">
                    Extract contact information, skills, and structured details from resumes
                </p>
            </header>

            {resume ? (
                <ParseScreen
                    {...resume}
                    onBack={() => setResume(null)}
                />
            ) : (
                <UploadScreen onUploadSuccess={setResume} />
            )}
        </main>
    );
}

export default App;