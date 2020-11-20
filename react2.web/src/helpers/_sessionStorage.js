const setItem = (key, json_data) => {
    sessionStorage.setItem(key, JSON.stringify(json_data));
} 

const getItem = (key) => {
    try
    {
        let str_data = sessionStorage.getItem(key);
        return JSON.parse(str_data);
    }
    catch(err)
    {
        return null;
    }
} 

export default {setItem, getItem}