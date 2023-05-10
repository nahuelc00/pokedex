function calculateTotalStat(statsArray) {
  let statTotal = 0;
  statsArray.forEach((stat) => {
    statTotal = stat.base_stat + statTotal;
  });
  return statTotal;
}

function convertHectogramToKilogram(number) { /* eslint consistent-return: */
  const numberToString = number.toString();

  if (numberToString.length === 6) {
    const firstHalf = numberToString.slice(0, 5);
    const secondHalf = numberToString.slice(5, 6);
    return `${firstHalf}.${secondHalf}`;
  }
  if (numberToString.length === 5) {
    const firstHalf = numberToString.slice(0, 4);
    const secondHalf = numberToString.slice(4, 5);
    return `${firstHalf}.${secondHalf}`;
  }
  if (numberToString.length === 4) {
    const firstHalf = numberToString.slice(0, 3);
    const secondHalf = numberToString.slice(3, 4);
    return `${firstHalf}.${secondHalf}`;
  }
  if (numberToString.length === 3) {
    const firstHalf = numberToString.slice(0, 2);
    const secondHalf = numberToString.slice(2, 3);
    return `${firstHalf}.${secondHalf}`;
  }
  if (numberToString.length === 2) {
    const firstHalf = numberToString.slice(0, 1);
    const secondHalf = numberToString.slice(1, 2);
    return `${firstHalf}.${secondHalf}`;
  }
  if (numberToString.length === 1) {
    const firstHalf = numberToString.slice(0, 1);
    return '0' + `.${firstHalf}`; /* eslint no-useless-concat: */
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { calculateTotalStat, convertHectogramToKilogram, capitalizeFirstLetter };
