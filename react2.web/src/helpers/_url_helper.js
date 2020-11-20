import config from './config';
import axios from 'axios';
import _localStorage from './_localStorage';
import * as qs from 'query-string';

const goToPage =  (cur_url, target_page) => {
    try{
        // var pathname = new URL(cur_url).pathname;
        const parsed = qs.parse(document.location.search);
        let workspaceId = parsed.ws;
        document.location.href = target_page + '?ws=' + workspaceId;
    }
    catch(err)
    {
        console.log(err)
        document.location.href = cur_url;
    }
} 

export default {goToPage}