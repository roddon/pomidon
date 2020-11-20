import config from './config';
import axios from 'axios';
import _localStorage from './_localStorage';
import * as qs from 'query-string';

const get_auth_status = async (cur_url, search) => {
    try{
        const parsed = qs.parse(search);
        let token = parsed.token;
        if(token == null || token == '')
        {
           token = _localStorage.getItem('token');
        }
        else
        {
            _localStorage.setItem('token', parsed.token);
        }
        
        if(token == null || token == '')
        {
            return 'not_registered'; // go to desktop application download page
        }
        else
        {
            let response = await axios({
                method  :'post',
                url : config.api_url + 'auth/get_user',
                headers : {
                    Accept : "application/json",
                    "Content-Type" : "application/json",
                },
                data : {token : token}
            })
            let data = await response.data;
            if(data.status == false)
            {
                return 'not_found';   // go to registration page
            }
            else
            {
                return data.data.account_status; 
            }
        }
    }
    catch(err)
    {
        console.log(err)
        // onFail(err);
    }
} 

export default {get_auth_status}