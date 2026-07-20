import { useState, useRef } from "react";
import { IconUpload, IconAlertTriangle } from "@tabler/icons-react";
import axios from "axios";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/resume";

function UploadScreen({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef();

  const validateFile = (file) => {
    if (!file) return;

    const valid =
      ALLOWED_TYPES.includes(file.type) ||
      /\.(pdf|doc|docx)$/i.test(file.name);

    if (!valid) {
      return setError("Only PDF or DOC/DOCX files are allowed.");
    }

    uploadFile(file);
  };

  const getRawText = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${id}`);
      return res.data.raw_text || "";
    } catch {
      return "";
    }
  };

  const uploadFile = async (file) => {
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("resume", file);

      const res = await axios.post(`${API_BASE_URL}/upload`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      const rawText = data.resumeId
        ? await getRawText(data.resumeId)
        : "";

      onUploadSuccess({
        parsedData: data.parsed_data,
        rawText,
        filename: file.name,
      });

    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="upload-container loading">
        <div className="loader-spinner" />
        <div className="loading-text">Parsing Resume...</div>
        <div className="loading-subtext">
          Extracting structure, skills and details...
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div
        className={`dropzone ${dragging ? "active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          validateFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="file-input"
          accept=".pdf,.doc,.docx"
          onChange={(e) => validateFile(e.target.files[0])}
        />

        <IconUpload className="upload-icon" size={48} stroke={1.5} />

        <p className="upload-title">
          Click or drag resume here
        </p>

        <span className="upload-subtitle">
          PDF, DOC or DOCX up to 10MB
        </span>
      </div>

      {error && (
        <div className="error-card">
          <IconAlertTriangle size={20} />
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}

export default UploadScreen;