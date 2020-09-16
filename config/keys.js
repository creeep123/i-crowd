module.exports = {
  google: {
    clientID: "338862965662-q462nnelqq7ap8qaukovakirs22svtvc.apps.googleusercontent.com",
    clientSecret: "Z2VAubkdZKBJFWPCFppAqzMy"
  },
  session: {
    cookieKey: "thisIsMyRandomCookie"
  },
  mailchimp: {
    apiKey:"817c5383f38a94228303f5029c828584-us17",
    url: "https://us17.api.mailchimp.com/3.0/lists/797d0cb446",
    list_id:"",
    options: {
      method: "POST",
      auth: "david:817c5383f38a94228303f5029c828584-us17"
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