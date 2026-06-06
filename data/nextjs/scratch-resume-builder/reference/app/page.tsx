"use client";
import React, { useState } from "react";

interface Experience {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

const SEED_INFO: PersonalInfo = {
  name: "Jane Smith",
  email: "jane.smith@email.com",
  phone: "555-0101",
  location: "San Francisco, CA",
  summary: "Experienced software engineer with 5 years in web development",
};

const SEED_EXPERIENCE: Experience[] = [
  { id: 1, company: "TechCorp", title: "Senior Engineer", startDate: "2021-06", endDate: "Present", description: "Led frontend team of 5 engineers" },
  { id: 2, company: "StartupXYZ", title: "Engineer", startDate: "2019-01", endDate: "2021-05", description: "Built React component library" },
];

const SEED_EDUCATION: Education[] = [
  { id: 1, institution: "State University", degree: "B.S.", field: "Computer Science", graduationYear: "2018" },
];

const SEED_SKILLS = ["React", "TypeScript", "Node.js", "CSS"];

export default function App() {
  const [info, setInfo] = useState<PersonalInfo>(SEED_INFO);
  const [savedInfo, setSavedInfo] = useState<PersonalInfo>(SEED_INFO);
  const [experience, setExperience] = useState<Experience[]>(SEED_EXPERIENCE);
  const [education, setEducation] = useState<Education[]>(SEED_EDUCATION);
  const [skills, setSkills] = useState<string[]>(SEED_SKILLS);
  const [nextExpId, setNextExpId] = useState(3);
  const [nextEduId, setNextEduId] = useState(2);

  const [expCompany, setExpCompany] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expDesc, setExpDesc] = useState("");

  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduYear, setEduYear] = useState("");

  const [skillInput, setSkillInput] = useState("");

  function handleSaveInfo() {
    setSavedInfo({ ...info });
  }

  function handleAddExp() {
    if (!expCompany.trim() || !expTitle.trim()) return;
    setExperience([...experience, { id: nextExpId, company: expCompany.trim(), title: expTitle.trim(), startDate: expStart, endDate: expEnd, description: expDesc.trim() }]);
    setNextExpId(nextExpId + 1);
    setExpCompany(""); setExpTitle(""); setExpStart(""); setExpEnd(""); setExpDesc("");
  }

  function handleDeleteExp(id: number) {
    setExperience(experience.filter((e) => e.id !== id));
  }

  function handleAddEdu() {
    if (!eduInstitution.trim() || !eduDegree.trim()) return;
    setEducation([...education, { id: nextEduId, institution: eduInstitution.trim(), degree: eduDegree.trim(), field: eduField.trim(), graduationYear: eduYear }]);
    setNextEduId(nextEduId + 1);
    setEduInstitution(""); setEduDegree(""); setEduField(""); setEduYear("");
  }

  function handleDeleteEdu(id: number) {
    setEducation(education.filter((e) => e.id !== id));
  }

  function handleAddSkill() {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  }

  function handleRemoveSkill(skill: string) {
    const idx = skills.indexOf(skill);
    if (idx !== -1) {
      setSkills([...skills.slice(0, idx), ...skills.slice(idx + 1)]);
    }
  }

  return (
    <div>
      <h1>Resume Builder</h1>

      <section>
        <h2>Personal Info</h2>
        <input data-testid="input-name" type="text" placeholder="Name" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
        <input data-testid="input-email" type="text" placeholder="Email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
        <input data-testid="input-phone" type="text" placeholder="Phone" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
        <input data-testid="input-location" type="text" placeholder="Location" value={info.location} onChange={(e) => setInfo({ ...info, location: e.target.value })} />
        <textarea data-testid="input-summary" placeholder="Summary" value={info.summary} onChange={(e) => setInfo({ ...info, summary: e.target.value })} />
        <button data-testid="save-info" onClick={handleSaveInfo}>Save Info</button>
      </section>

      <section>
        <h2>Experience</h2>
        {experience.map((exp) => (
          <div key={exp.id} data-testid={`exp-card-${exp.id}`}>
            <p>{exp.company}</p>
            <p>{exp.title}</p>
            <p>{exp.startDate} - {exp.endDate}</p>
            <p>{exp.description}</p>
            <button data-testid={`delete-exp-${exp.id}`} onClick={() => handleDeleteExp(exp.id)}>Delete</button>
          </div>
        ))}
        <input data-testid="input-exp-company" type="text" placeholder="Company" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} />
        <input data-testid="input-exp-title" type="text" placeholder="Title" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} />
        <input data-testid="input-exp-start" type="text" placeholder="Start Date" value={expStart} onChange={(e) => setExpStart(e.target.value)} />
        <input data-testid="input-exp-end" type="text" placeholder="End Date" value={expEnd} onChange={(e) => setExpEnd(e.target.value)} />
        <input data-testid="input-exp-desc" type="text" placeholder="Description" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
        <button data-testid="add-exp-btn" onClick={handleAddExp}>Add Experience</button>
      </section>

      <section>
        <h2>Education</h2>
        {education.map((edu) => (
          <div key={edu.id} data-testid={`edu-card-${edu.id}`}>
            <p>{edu.institution}</p>
            <p>{edu.degree} in {edu.field}</p>
            <p>{edu.graduationYear}</p>
            <button data-testid={`delete-edu-${edu.id}`} onClick={() => handleDeleteEdu(edu.id)}>Delete</button>
          </div>
        ))}
        <input data-testid="input-edu-institution" type="text" placeholder="Institution" value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} />
        <input data-testid="input-edu-degree" type="text" placeholder="Degree" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} />
        <input data-testid="input-edu-field" type="text" placeholder="Field" value={eduField} onChange={(e) => setEduField(e.target.value)} />
        <input data-testid="input-edu-year" type="text" placeholder="Graduation Year" value={eduYear} onChange={(e) => setEduYear(e.target.value)} />
        <button data-testid="add-edu-btn" onClick={handleAddEdu}>Add Education</button>
      </section>

      <section>
        <h2>Skills</h2>
        <div>
          {skills.map((skill, idx) => (
            <span key={idx} data-testid={`skill-tag-${skill}`}>
              {skill}
              <button data-testid={`remove-skill-${skill}`} onClick={() => handleRemoveSkill(skill)}>x</button>
            </span>
          ))}
        </div>
        <input data-testid="input-skill" type="text" placeholder="Add skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
        <button data-testid="add-skill-btn" onClick={handleAddSkill}>Add Skill</button>
      </section>

      <section data-testid="resume-preview">
        <h2>Preview</h2>
        <p data-testid="preview-name">{savedInfo.name}</p>
        <p data-testid="preview-exp-count">{experience.length}</p>
        <p data-testid="preview-skills-count">{skills.length}</p>
      </section>
    </div>
  );
}
