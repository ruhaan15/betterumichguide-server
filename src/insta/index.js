import axios from 'axios';
const router = express.Router();

const APP_ID = "1837290969936807";
const SECRET = "0ecbb50d1e88476ec202210d8f769ce2";

router.get("/facebook/getAccessToken", (req, res, next) =>{
    console.log("was here");
    axios.get(`https://graph.facebook.com/oauth/access_token
    ?client_id=${APP_ID}
    &client_secret=${SECRET}
    &grant_type=client_credentials`).then((access_token) => console.log(access_token));
})


const options = {
    method: 'GET',
    url: 'https://phonenumbervalidatefree.p.rapidapi.com/ts_PhoneNumberValidateTest.jsp',
    params: {number: '+59894887799', country: 'UY'},
    headers: {
        'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
        'X-RapidAPI-Host': 'phonenumbervalidatefree.p.rapidapi.com'
    }
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});

