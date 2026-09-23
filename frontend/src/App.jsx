import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Judge from "./pages/Judge";
import Audience from "./pages/Audience";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/judge" element={<Judge />} />
                <Route path="/audience" element={<Audience />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;