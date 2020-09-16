module.exports = {
  google: {
    clientID: "338862965662-q462nnelqq7ap8qaukovakirs22svtvc.apps.googleusercontent.com",
    clientSecret: "Z2VAubkdZKBJFWPCFppAqzMy"
  },
  session: {
    cookieKey: "thisIsMyRandomCookie"
  },
  mailchimp: {
    apiKey:"d8c8b2b5d0f64431607489108a70f79e-us17",
    url: "https://us17.api.mailchimp.com/3.0/lists/797d0cb446",
    list_id:"",
    options: {
      method: "POST",
      auth: "david:d8c8b2b5d0f64431607489108a70f79e-us17"
    }
  },
  sendCloud:{
    apiUser:"creep_test_JOXKsN",
    apiKey:"NjjQQKrW7qsh3LxV",
    from:"iCrowd@sendcloud.org",
    templateInvokeName:"reset_password",
    useAddressList:true
  }
};