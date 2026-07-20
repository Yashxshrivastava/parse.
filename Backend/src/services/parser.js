const SKILLS = [
    "javascript", "typescript", "python", "java", "c\\++", "c#", "ruby", "php",
    "go", "rust", "html", "css", "react", "angular", "vue", "node", "express",
    "nest", "django", "flask", "sql", "mysql", "postgres", "sqlite", "mongodb",
    "redis", "cassandra", "dynamodb", "git", "docker", "kubernetes", "aws",
    "azure", "gcp", "linux", "ci/cd", "agile"
];
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const URL_REGEX = /(https?:\/\/[^\s]+|(?:www\.)[^\s]+|(?:linkedin\.com|github\.com)\/[^\s]+)/gi;
const PATTERNS = {
    EXPERIENCE: /^[#*•\s-]*(professional\s+|work\s+)?experience|employment(\s+history)?|work\s+history|professional\s+background|internship(s)?(\s+experience)?|certification\s*&\s*training\/internship[:\s]*$/i,
    EDUCATION: /^[#*•\s-]*(education|academic(\s+background|\s+history|\s+profile)?|qualifications|academic\s+details|education\s+background)[:\s]*$/i,
    PROJECTS: /^[#*•\s-]*(technical\s+|personal\s+|academic\s+|key\s+|selected\s+)?projects|project\s+experience[:\s]*$/i,
    SKILLS: /^[#*•\s-]*(technical\s+)?skills|key\s+skills|competencies[:\s]*$/i,
    OTHER: /^[#*•\s-]*(other\s+information|other\s+info|additional\s+information|additional\s+info|miscellaneous|extracurricular\s+activities|extracurriculars|certifications|certification\s*&\s*training|training\/courses|training\s*&\s*courses|training|courses|awards|languages|interests|hobbies|activities|personal\s+details)[:\s]*$/i,
    SUMMARY: /^[#*•\s-]*(professional\s+)?summary|profile|about\s+me|objective[:\s]*$/i
};

const combinePatterns = (patternsArray) => {
    const sources = patternsArray.map(p => `(${p.source})`);
    return new RegExp(sources.join('|'), 'i');
};

const EXPERIENCE_END = combinePatterns([PATTERNS.EDUCATION, PATTERNS.PROJECTS, PATTERNS.SKILLS, PATTERNS.OTHER, PATTERNS.SUMMARY]);
const EDUCATION_END = combinePatterns([PATTERNS.EXPERIENCE, PATTERNS.PROJECTS, PATTERNS.SKILLS, PATTERNS.OTHER, PATTERNS.SUMMARY]);
const PROJECTS_END = combinePatterns([PATTERNS.EXPERIENCE, PATTERNS.EDUCATION, PATTERNS.SKILLS, PATTERNS.OTHER, PATTERNS.SUMMARY]);
const OTHER_END = combinePatterns([PATTERNS.EXPERIENCE, PATTERNS.EDUCATION, PATTERNS.PROJECTS, PATTERNS.SKILLS, PATTERNS.SUMMARY]);

export function parseResumeText(text) {
     if (!text) return {};

    const cleanText = text.replace(/\s+/g, " ");

    return {
        name: extractName(text),
        email: cleanText.match(EMAIL_REGEX)?.[0] ?? null,
        phone: cleanText.match(PHONE_REGEX)?.[0]?.trim() ?? null,
        skills: extractSkills(text),
        links: extractLinks(cleanText),
        experience: extractSection(text, PATTERNS.EXPERIENCE, EXPERIENCE_END) || null,
        education: extractSection(text, PATTERNS.EDUCATION, EDUCATION_END) || null,
        projects: extractSection(text, PATTERNS.PROJECTS, PROJECTS_END) || null,
        other_info: extractSection(text, PATTERNS.OTHER, OTHER_END) || null,
    };
}

function extractSection(text, startRegex, endRegex) {
    const lines = text.split('\n');
    let extracting = false;
    const allSections = [];
    let currentSectionLines = [];

    for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;

        if (!extracting) {
            if (startRegex.test(cleanLine)) {
                extracting = true;
                currentSectionLines.push(cleanLine);
            }
            continue;
        }

        if (endRegex.test(cleanLine)) {
            allSections.push(currentSectionLines.join('\n'));
            currentSectionLines = [];
            extracting = false;

            if (startRegex.test(cleanLine)) {
                extracting = true;
                currentSectionLines.push(cleanLine);
            }
            continue;
        }

        currentSectionLines.push(cleanLine);
    }

    if (extracting && currentSectionLines.length > 0) {
        allSections.push(currentSectionLines.join('\n'));
    }

    return allSections.join('\n\n');
}
function extractSkills(text) {
    const lower = text.toLowerCase();

    return [
        ...new Set(
            SKILLS
                .filter(skill => new RegExp(`\\b${skill}\\b`, "i").test(lower))
                .map(skill => skill.replace("\\", ""))
        )
    ];
}
function extractLinks(text) {
    return [
        ...new Set(
            (text.match(URL_REGEX) || [])
                .map(link => link.replace(/[.,;|:)]+$/, ""))
                .filter(link => !link.includes("@"))
        )
    ];
}
function extractName(text) {
    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    return (
        lines.find(line =>
            !line.includes("@") &&
            !/\d{5,}/.test(line) &&
            !/resume|cv|curriculum|page/i.test(line) &&
            line.length > 2 &&
            line.length < 50
        ) || "Unknown Applicant"
    );
}