/**
 * Function used to load the json file with the data about the profile and the contacts.
 * @returns Json structure
 */
async function LoadJsonFile(){
    const response = await fetch("../assets/data/data.json");
    const json = await response.json();
    return json;
}

/**
 * Function used to define the date preview to use in the form left contacts preview.
 * @param {*} date String date saved in the json file.
 * @returns String to use in the date last access in the contacts last message preview.
 */
function GetContactLastMessageDate(date){
    const currentDate = new Date();
    const prevDate = GetPreviousDate(currentDate);
    const messageDate = new Date(date);
    let result = '';
    //If the message date is the same of today, return the time
    if(DatesAreEquals(currentDate,messageDate))
        result = GetCustomTimeString(messageDate);
    //else, if the message date is the date of yesterday, return "Ieri"
    else if(DatesAreEquals(prevDate,messageDate))
        result = "Ieri";
    //else, returns the date
    else
        result = GetCustomDateString(messageDate);
    return result;
}

/**
 * Function used to get the previus date of a passed date.
 * @param {*} date Normal date.
 * @returns Previous date.
 */
function GetPreviousDate(date){
    const dt = new Date(date);
    dt.setDate(date.getDate() - 1);
    return dt;
}

/**
 * Function used to return the time as string in the format hh:mm .
 * @param {*} date Date where gets the values needed.
 * @returns String time.
 */
function GetCustomTimeString(date){
    return date.getHours() + ":" + date.getMinutes();
}

/**
 * Function used to return the date as string in the format dd/mm/yyyy.
 * @param {*} date Date where gets the values needed.
 * @returns String date.
 */
function GetCustomDateString(date){
    return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
}

/**
 * Function used to compare two dates (this function will not check the time).
 * @param {*} date1 Date 1 to be compared.
 * @param {*} date2 Date 2 to be compared.
 * @returns True id the two dates are equals, false otherwise.
 */
function DatesAreEquals(date1, date2){
    if(date1.getDay() != date2.getDay())
        return false;
    if(date1.getMonth() != date2.getMonth())
        return false;
    if(date1.getFullYear() != date2.getFullYear())
        return false;
    return true;
}