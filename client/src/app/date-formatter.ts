export const format = (dateString: string) => {
    const day = new Date(dateString);
    const yyyy = day.getFullYear();
    let mm: string = day.getMonth() + 1 +""; // Months start at 0!
    let dd: string = day.getDate() + "";

    if (Number(dd) < 10) dd = '0' + dd;
    if (Number(mm) < 10) mm = '0' + mm;

    const formattedDate = dd + '.' + mm + '.' + yyyy;
    return formattedDate;
}