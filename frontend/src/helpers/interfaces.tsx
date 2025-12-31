export interface User {
  ID: string;
  CreatedAt: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  IsAdmin: boolean;
}

export type { User as UserInterface };
