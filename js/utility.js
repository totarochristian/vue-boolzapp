async function LoadJsonFile(){
    const response = await fetch("../assets/data/data.json");
    const json = await response.json();
    return json;
}

function GetContactLastMessageDate(date){
    const currentDate = new Date();
    const prevDate = GetPreviousDate(currentDate);
    const messageDate = new Date(date);
    let result = '';
    if(DatesAreEquals(currentDate,messageDate))
        result = GetCustomTime(messageDate);
    else if(DatesAreEquals(prevDate,messageDate))
        result = "Ieri";
    else
        result = GetCustomDate(messageDate);
    return result;
}
function GetPreviousDate(date){
    const dt = new Date(date);
    dt.setDate(date.getDate() - 1);
    return dt;
}
function GetCustomTime(date){
    return date.getHours() + ":" + date.getMinutes();
}
function GetCustomDate(date){
    return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
}
function DatesAreEquals(date1, date2){
    if(date1.getDay() != date2.getDay())
        return false;
    if(date1.getMonth() != date2.getMonth())
        return false;
    if(date1.getFullYear() != date2.getFullYear())
        return false;
    return true;
}