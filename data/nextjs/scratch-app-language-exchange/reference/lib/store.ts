import type { Partner, VocabWord, Session, Language } from "./types";

let partners: Partner[] = [
  { id: "p1", name: "Maria Garcia", nativeLanguage: "Spanish", learningLanguage: "French", level: "intermediate", bio: "Love cooking and travel", online: true },
  { id: "p2", name: "Yuki Tanaka", nativeLanguage: "Japanese", learningLanguage: "German", level: "beginner", bio: "Anime fan and tech enthusiast", online: false },
  { id: "p3", name: "Pierre Dupont", nativeLanguage: "French", learningLanguage: "Mandarin", level: "advanced", bio: "Software engineer in Paris", online: true },
];

let vocabWords: VocabWord[] = [
  { id: "v1", word: "hola", translation: "hello", language: "Spanish", mastered: false },
  { id: "v2", word: "gracias", translation: "thank you", language: "Spanish", mastered: true },
  { id: "v3", word: "bonjour", translation: "good morning", language: "French", mastered: false },
];

let sessions: Session[] = [
  { id: "s1", partnerId: "p1", partnerName: "Maria Garcia", language: "Spanish", date: "2024-03-01", durationMinutes: 30, notes: "Practiced greetings" },
];

let nextId = 100;

export function getPartners(): Partner[] { return [...partners]; }
export function getVocabWords(): VocabWord[] { return [...vocabWords]; }
export function getSessions(): Session[] { return [...sessions]; }

export function addPartner(data: Omit<Partner, "id">): Partner {
  const p: Partner = { ...data, id: `p${nextId++}` };
  partners.push(p);
  return p;
}

export function addVocabWord(data: Omit<VocabWord, "id">): VocabWord {
  const v: VocabWord = { ...data, id: `v${nextId++}` };
  vocabWords.push(v);
  return v;
}

export function toggleMastered(id: string): VocabWord | null {
  const w = vocabWords.find(v => v.id === id);
  if (!w) return null;
  w.mastered = !w.mastered;
  return { ...w };
}

export function addSession(data: Omit<Session, "id">): Session {
  const s: Session = { ...data, id: `s${nextId++}` };
  sessions.push(s);
  return s;
}

export function deleteSession(id: string): boolean {
  const before = sessions.length;
  sessions = sessions.filter(s => s.id !== id);
  return sessions.length < before;
}

export function filterPartnersByLanguage(lang: Language): Partner[] {
  return partners.filter(p => p.learningLanguage === lang || p.nativeLanguage === lang);
}

export function __reset(): void {
  partners = [
    { id: "p1", name: "Maria Garcia", nativeLanguage: "Spanish", learningLanguage: "French", level: "intermediate", bio: "Love cooking and travel", online: true },
    { id: "p2", name: "Yuki Tanaka", nativeLanguage: "Japanese", learningLanguage: "German", level: "beginner", bio: "Anime fan and tech enthusiast", online: false },
    { id: "p3", name: "Pierre Dupont", nativeLanguage: "French", learningLanguage: "Mandarin", level: "advanced", bio: "Software engineer in Paris", online: true },
  ];
  vocabWords = [
    { id: "v1", word: "hola", translation: "hello", language: "Spanish", mastered: false },
    { id: "v2", word: "gracias", translation: "thank you", language: "Spanish", mastered: true },
    { id: "v3", word: "bonjour", translation: "good morning", language: "French", mastered: false },
  ];
  sessions = [
    { id: "s1", partnerId: "p1", partnerName: "Maria Garcia", language: "Spanish", date: "2024-03-01", durationMinutes: 30, notes: "Practiced greetings" },
  ];
  nextId = 100;
}
