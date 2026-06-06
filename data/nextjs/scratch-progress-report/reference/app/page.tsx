import React, { useState } from "react";

type SubjectKey = "Math" | "Science" | "English" | "History";

interface Grades {
  Math: number;
  Science: number;
  English: number;
  History: number;
}

interface Student {
  id: number;
  name: string;
  grades: Grades;
}

interface EditState {
  studentId: number;
  subject: SubjectKey;
  value: string;
}

const SEED_STUDENTS: Student[] = [
  { id: 1, name: "Alice Johnson", grades: { Math: 92, Science: 88, English: 95, History: 79 } },
  { id: 2, name: "Bob Smith", grades: { Math: 74, Science: 81, English: 68, History: 85 } },
  { id: 3, name: "Carol White", grades: { Math: 55, Science: 62, English: 70, History: 58 } },
];

const SUBJECTS: SubjectKey[] = ["Math", "Science", "English", "History"];

function calcAvg(grades: Grades): number {
  return Math.round((grades.Math + grades.Science + grades.English + grades.History) / 4);
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [name, setName] = useState("");
  const [gradeMath, setGradeMath] = useState("");
  const [gradeScience, setGradeScience] = useState("");
  const [gradeEnglish, setGradeEnglish] = useState("");
  const [gradeHistory, setGradeHistory] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const grades: Grades = {
      Math: gradeMath !== "" ? Number(gradeMath) : 0,
      Science: gradeScience !== "" ? Number(gradeScience) : 0,
      English: gradeEnglish !== "" ? Number(gradeEnglish) : 0,
      History: gradeHistory !== "" ? Number(gradeHistory) : 0,
    };
    setStudents([...students, { id: newId, name, grades }]);
    setName("");
    setGradeMath("");
    setGradeScience("");
    setGradeEnglish("");
    setGradeHistory("");
  }

  function handleDelete(id: number) {
    setStudents(students.filter((s) => s.id !== id));
    if (editState && editState.studentId === id) setEditState(null);
  }

  function handleEditStart(studentId: number, subject: SubjectKey, current: number) {
    setEditState({ studentId, subject, value: String(current) });
  }

  function handleEditSave(studentId: number, subject: SubjectKey) {
    if (!editState) return;
    const newVal = editState.value !== "" ? Number(editState.value) : 0;
    setStudents(students.map((s) => {
      if (s.id !== studentId) return s;
      return { ...s, grades: { ...s.grades, [subject]: newVal } };
    }));
    setEditState(null);
  }

  function handleEditCancel() {
    setEditState(null);
  }

  const classAvg = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + calcAvg(s.grades), 0) / students.length)
    : 0;
  const passingCount = students.filter((s) => calcAvg(s.grades) >= 70).length;
  const failingCount = students.filter((s) => calcAvg(s.grades) < 70).length;

  return (
    <div>
      <h1 data-testid="app-title">Progress Report</h1>

      <form data-testid="add-form" onSubmit={handleAdd}>
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
        />
        <input
          data-testid="input-grade-math"
          type="number"
          value={gradeMath}
          onChange={(e) => setGradeMath(e.target.value)}
          placeholder="Math"
        />
        <input
          data-testid="input-grade-science"
          type="number"
          value={gradeScience}
          onChange={(e) => setGradeScience(e.target.value)}
          placeholder="Science"
        />
        <input
          data-testid="input-grade-english"
          type="number"
          value={gradeEnglish}
          onChange={(e) => setGradeEnglish(e.target.value)}
          placeholder="English"
        />
        <input
          data-testid="input-grade-history"
          type="number"
          value={gradeHistory}
          onChange={(e) => setGradeHistory(e.target.value)}
          placeholder="History"
        />
        <button data-testid="btn-add" type="submit">Add Student</button>
      </form>

      <div data-testid="class-avg">Class Avg: {classAvg}</div>
      <div data-testid="passing-count">{passingCount} passing</div>
      <div data-testid="failing-count">{failingCount} failing</div>

      <div data-testid="student-list">
        {students.map((s) => {
          const avg = calcAvg(s.grades);
          const status = avg >= 70 ? "Passing" : "Failing";
          return (
            <div key={s.id} data-testid={`student-item-${s.id}`}>
              <span data-testid={`student-name-${s.id}`}>{s.name}</span>
              {SUBJECTS.map((subj) => {
                const subjLower = subj.toLowerCase();
                const isEditing = editState !== null && editState.studentId === s.id && editState.subject === subj;
                return (
                  <span key={subj}>
                    {isEditing ? (
                      <>
                        <input
                          data-testid={`input-edit-grade-${s.id}-${subjLower}`}
                          type="number"
                          value={editState.value}
                          onChange={(e) => setEditState({ ...editState, value: e.target.value })}
                        />
                        <button
                          data-testid={`btn-save-grade-${s.id}-${subjLower}`}
                          onClick={() => handleEditSave(s.id, subj)}
                        >
                          Save
                        </button>
                        <button
                          data-testid={`btn-cancel-grade-${s.id}-${subjLower}`}
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span data-testid={`student-grade-${subjLower}-${s.id}`}>{s.grades[subj]}</span>
                        <button
                          data-testid={`btn-edit-grade-${s.id}-${subjLower}`}
                          onClick={() => handleEditStart(s.id, subj, s.grades[subj])}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </span>
                );
              })}
              <span data-testid={`student-avg-${s.id}`}>{avg}</span>
              <span data-testid={`student-status-${s.id}`}>{status}</span>
              <button data-testid={`btn-delete-${s.id}`} onClick={() => handleDelete(s.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
