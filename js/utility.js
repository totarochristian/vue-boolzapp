async function LoadJsonFile(){
    const response = await fetch("../assets/data/data.json");
    const json = await response.json();
    return json;
}