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
 * Function used to get a string containing the current date and time in the format: yyyy-mm-dd hh:mm:ss .
 * @returns String containing the current date and time.
 */
function GetCurrentDateTimeStringFormatted(){
    const dt = new Date();
    dt.setHours(dt.getHours() + 2);
    let res = dt.toISOString().replace('T',' ');
    return res.substring(0,res.length-5);
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

/**
 * Function used to play an audio passing the source address of the file.
 * @param {*} audioSrc String with the url where is located the file to reproduce.
 */
function PlayAudio(audioSrc){
    const aud = new Audio(audioSrc);
    aud.play();
}

/**
 * Function that will generate a random int
 * @param {bigint} max Max value of the interval
 * @param {bigint} min Min value of the interval
 * @returns {bigint} Generated random int value
 */
function GetRandomInt(max,min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Function used to compare dates in ascending or descending order.
 * @param {*} date1 Date 1 to be compared.
 * @param {*} date2 Date 2 to be compared.
 * @param {*} growing If true order ascending, otherwise descending.
 * @returns If growing is true, returns -1 if date 1 is less then date 2, 1 if date 1 is greater then date 2, 0 if are equals, otherwise the opposite.
 */
function CompareDates(date1, date2, growing){
    if(date1 < date2)
        return growing ? -1 : 1;
    else if(date1 > date2)
        return growing ? 1 : -1;
    return 0;
}