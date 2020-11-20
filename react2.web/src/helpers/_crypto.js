import crypto from 'crypto';


var get_encrypt = (plain_str) => {
    var cipher  = crypto.createCipher('aes-256-cbc', 'mes_user_token');
    var encrypted_str = cipher.update(plain_str, 'utf8', 'hex')
    encrypted_str += cipher.final('hex');
    return encrypted_str;
}

var get_decrypt = (encrypted_str) => {
    var decipher  = crypto.createDecipher('aes-256-cbc', 'mes_user_token');
    var plain_str = decipher.update(encrypted_str, 'hex', 'utf8')
    plain_str += decipher.final('utf8');
    return plain_str;
}

export default {get_encrypt, get_decrypt}