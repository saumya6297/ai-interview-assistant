// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Resume.css";

// function Resume() {

//     const navigate = useNavigate();

//     const [file, setFile] = useState(null);

//     const [loading, setLoading] = useState(false);

//     const [result, setResult] = useState("");
//     const handleUpload = async () => {

//         if (!file) {

//             alert("Please select a PDF Resume.");

//             return;

//         }

//         setLoading(true);

//         const formData = new FormData();

//         formData.append("resume", file);

//         try {

//             const response = await fetch(

//                 "http://localhost:5000/analyze-resume",

//                 {

//                     method: "POST",

//                     body: formData

//                 }

//             );

//             const data = await response.json();

//             setResult(data.result);

//         }

//         catch (error) {

//             console.log(error);

//             alert("Resume analysis failed.");

//         }

//         setLoading(false);

//     };
//     return (

//         <div className="resume-container">

//             <div className="resume-card">

//                 <h1>📄 AI Resume Review</h1>

//                 <p>

//                     Upload your resume and get AI-powered feedback.

//                 </p>

//                 <button

//                     className="back-btn"

//                     onClick={() => navigate("/dashboard")}

//                 >

//                     ⬅ Back to Dashboard

//                 </button>

//                 <div className="upload-box">

//                     <input

//                         type="file"

//                         accept=".pdf"

//                         onChange={(e) => setFile(e.target.files[0])}

//                     />

//                     <button

//                         onClick={handleUpload}

//                         disabled={loading}

//                     >

//                         {

//                             loading

//                                 ? "Analyzing Resume..."

//                                 : "Analyze Resume"

//                         }

//                     </button>

//                 </div>

//                 {

//                     result && (

//                         <div className="result-card">

//                             <h2>

//                                 🤖 AI Resume Analysis

//                             </h2>

//                             <pre>

//                                 {result}

//                             </pre>

//                         </div>

//                     )

//                 }

//             </div>

//         </div>

//     );

// }

// export default Resume;