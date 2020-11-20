
const getDateString =  (date_string) => {
    try{
        let month_str = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var date_obj = new Date(date_string);

        let new_date_str = month_str[date_obj.getMonth()] + ' ' + date_obj.getDate();
        return new_date_str;
    }
    catch(err)
    {
        console.log(err)
        return date_string;
    }
} 

export default {getDateString}