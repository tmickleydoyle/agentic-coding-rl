export type Language = "Spanish" | "French" | "German" | "Japanese" | "Mandarin" | "Portuguese";

export interface Partner {
  id: string;
  name: string;
  nativeLanguage: Language;
  learningLanguage: Language;
  level: "beginner" | "intermediate" | "advanced";
  bio: string;
  online: boolean;
}

export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  language: Language;
  mastered: boolean;
}

export interface Session {
  id: string;
  partnerId: string;
  partnerName: string;
  language: Language;
  date: string;
  durationMinutes: number;
  notes: string;
}

export type Route = "home" | "vocabulary" | "partners" | "sessions";

export interface AppState {
  route: Route;
  partners: Partner[];
  vocabWords: VocabWord[];
  sessions: Session[];
}
