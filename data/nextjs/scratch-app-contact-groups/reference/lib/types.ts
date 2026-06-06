export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  groupId: string;
  favorite: boolean;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}
