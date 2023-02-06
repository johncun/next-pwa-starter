export interface Hours {
  _id?: string;
  days: {
    [date: string]: number;
  };
}
