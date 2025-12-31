export interface User {
  ID: string;
  CreatedAt: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  IsAdmin: boolean;
}

export type Boards = Board[];
export interface Board {
  ID: string;
  UserID: string;
  Title: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export type {
  User as UserInterface,
  Board as BoardInterface,
  Boards as BoardsInterface,
};
