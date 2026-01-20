export interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
}

export type Boards = Board[];
export interface Board {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  cards: Card[];
}

export interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
}
export type {
  User as UserInterface,
  Board as BoardInterface,
  Boards as BoardsInterface,
  Column as ColumnInterface,
  Card as CardInterface,
};
