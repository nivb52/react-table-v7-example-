export const wait = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export const isEven = (num) => num % 2 === 0;

export const upperCaseFirst = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
