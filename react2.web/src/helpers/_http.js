import config from './config';
import axios from 'axios';

const doGet = (url, body, onSuccess, onFail) => {
} 


const doPost = async (url, body, onSuccess, onFail) => {
    try{
        let response = await axios({
            method  :'post',
            url : config.api_url + url,
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
            },
            data : body
        })
        let data = await response.data;
        onSuccess(data);
    }
    catch(err)
    {
        onFail(err);
    }
} 

const doPostFile = async (url, formData, onSuccess, onFail) => {
    try{
        let response = await axios({
            method  :'post',
            url : config.api_url + url,
            headers : {
                'Content-Type': 'multipart/form-data'
            },
            data : formData
        })
        let data = await response.data;
        onSuccess(data);
    }
    catch(err)
    {
        onFail(err);
    }
} 


export default {doGet, doPost, doPostFile}