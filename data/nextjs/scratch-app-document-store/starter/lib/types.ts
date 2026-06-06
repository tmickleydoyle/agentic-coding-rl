export interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  folderId: string;
  tags: string[];
  shared: boolean;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}
