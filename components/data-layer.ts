import { Hours } from './types';

export const getData = async () => {
  return await (await fetch('/api/hours')).json();
};
export const saveData = async (hours: Hours) => {
  return await await fetch('/api/hours', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(hours, null, 2),
  });
};
