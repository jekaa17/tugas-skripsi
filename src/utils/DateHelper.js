const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date) => {
  if (!date) return;

  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
};

export const checkPassDueDate = (date) => {
  if (!date) return;
  const dueDay = date.getDate();
  const dueMonth = date.getMonth();
  const dueYear = date.getYear();

  const today = new Date();
  const todayYear = today.getYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  if (dueDay < todayDate && dueMonth < todayMonth && dueYear < todayYear) {
    return true;
  }

  return false;
};
