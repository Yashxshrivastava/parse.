import { useState } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconBolt,
  IconFolder,
  IconInfoCircle,
  IconFileText,
  IconMail,
  IconPhone,
  IconLink,
  IconInbox,
  IconArrowLeft,
} from "@tabler/icons-react";

const tabs = [
  { id: "profile", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "other", label: "Other Info" },
  { id: "text", label: "Text" },
];

function EmptyState({ message }) {
  return (
    <div className="empty-data-alert">
      <IconInbox size={32} />
      {message}
    </div>
  );
}

function Timeline({ text, emptyMessage }) {
  if (!text) return <EmptyState message={emptyMessage} />;

  return (
    <div className="timeline">
      {text
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">{line.trim()}</div>
          </div>
        ))}
    </div>
  );
}

function ParseScreen({
  parsedData,
  rawText,
  filename,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!parsedData) return null;

  const {
    name,
    email,
    phone,
    links = [],
    skills = [],
    experience,
    education,
    projects,
    other_info,
  } = parsedData;

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="details-container">
      <div className="details-header">
        <button
          className="btn btn-secondary"
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <IconArrowLeft size={16} />
          Upload Another Resume
        </button>

        <div className="subtitle">
          Parsed file: <strong>{filename}</strong>
        </div>
      </div>

      <div className="details-card">
        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>

          <div className="profile-info">
            <div className="profile-name">
              {name || "Unknown Applicant"}
            </div>

            <ul className="profile-meta-list">
              {email && (
                <li className="profile-meta-item">
                  <IconMail size={16} />
                  <a
                    href={`mailto:${email}`}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    {email}
                  </a>
                </li>
              )}

              {phone && (
                <li className="profile-meta-item">
                  <IconPhone size={16} />
                  {phone}
                </li>
              )}
            </ul>
          </div>
        </div>

        <nav className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-panel">
                  {activeTab === "profile" && (
            <div>
              <h3 className="section-title">
                <IconUser size={22} /> Profile Overview
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(300px,1fr))",
                }}
              >
                <div
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    background: "rgba(0,0,0,.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h4>Contact Information</h4>

                  <p>
                    <strong>Email:</strong> {email || "Not specified"}
                  </p>

                  <p>
                    <strong>Phone:</strong> {phone || "Not specified"}
                  </p>
                </div>

                <div
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    background: "rgba(0,0,0,.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h4>Links</h4>

                  {links.length ? (
                    <ul
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {links.map((link, i) => (
                        <li key={i}>
                          <IconLink size={16} />{" "}
                          <a
                            href={
                              link.startsWith("http")
                                ? link
                                : `https://${link}`
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState message="No links detected." />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <h3 className="section-title">
                <IconBriefcase size={22} /> Work Experience
              </h3>

              <Timeline
                text={experience}
                emptyMessage="No professional experience found."
              />
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <h3 className="section-title">
                <IconSchool size={22} /> Education
              </h3>

              <Timeline
                text={education}
                emptyMessage="No education found."
              />
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <h3 className="section-title">
                <IconFolder size={22} /> Projects
              </h3>

              <Timeline
                text={projects}
                emptyMessage="No projects found."
              />
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h3 className="section-title">
                <IconBolt size={22} /> Skills
              </h3>

              {skills.length ? (
                <div className="skills-grid">
                  {skills.map((skill, i) => (
                    <span key={i} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message="No skills detected." />
              )}
            </div>
          )}

          {activeTab === "other" && (
            <div>
              <h3 className="section-title">
                <IconInfoCircle size={22} /> Other Information
              </h3>

              <Timeline
                text={other_info}
                emptyMessage="No additional information found."
              />
            </div>
          )}

          {activeTab === "text" && (
            <div>
              <h3 className="section-title">
                <IconFileText size={22} /> Extracted Resume
              </h3>

              {rawText ? (
                <pre className="raw-text-viewer">{rawText}</pre>
              ) : (
                <EmptyState message="No extracted text found." />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParseScreen;
        