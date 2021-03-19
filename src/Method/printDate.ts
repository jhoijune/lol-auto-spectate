const correct = (num: number): string =>
  num >= 10 ? num.toString() : '0' + num.toString();

export default () => {
  const date = new Date();
  return `${date.getFullYear()}-${correct(date.getMonth() + 1)}-${correct(
    date.getDate()
  )} ${correct(date.getHours())}:${correct(date.getMinutes())}:${correct(
    date.getSeconds()
  )}`;
};
