var User = function(login, password) {
  this.login = login;
  this.password = password;
  this.isAuth = false;
}

User.prototype.signUp = function() {
  return $.ajax({
    url: 'http://localhost:8000/api/user/',
    method: 'post',
    data: {
      email: this.login,
      password: this.password,
    }
  })

  
    .done(function(response) {
      response = JSON.parse(response)
      return response
    })
    .fail(function(err){
      r = [];
      for (key in err.responseJSON) {
        r.push(key+': '+err.responseJSON[key])
      }
      return r
    })
};

User.prototype.signIn = function() {
  self = this;
  return $.ajax({
    url: 'http://localhost:8000/api/api-token-auth/',
    method: 'post',
    data: {
      username: this.login,
      password: this.password,
    }
  })


  .done(function(response) {
    window.sessionStorage.accessToken = response['token'];
    self.isAuth = true;
    self.password = ""
    return {"success": "OK"}
  })
  .fail(function(err) {
    r = [];
    for (key in err.responseJSON) {
      r.push(key+': '+err.responseJSON[key])
    }
    return {"fail": err.responseJSON}
  })
};

User.prototype.changePassword = function(newPassword) {
  return $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization","Token " + window.sessionStorage.accessToken);
    },  
    url: "http://localhost:8000/api/user/edit/",
    method: 'put',
    data: {
      email: this.login,
      password: newPassword
    }
  })


  .done(function(response) {
    return response
  })
  .fail(function(response) {
    return response
  })
};

User.prototype.search = function(query) {
  return $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization","Token " + window.sessionStorage.accessToken);
    }, 
    url: "http://localhost:8000/api/registered-user/",
    method: 'get',
    data: {
        search: query
    }, 
  })


  .done(function(response) {
    return response
  })
  .fail(function(response) {
    return {'error': response['detail']}
  })
};


User.prototype.getId = function() {
  return $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization","Token " + window.sessionStorage.accessToken);
    }, 
    url: "http://localhost:8000/api/registered-user/",
    method: 'get',
    data: {
        search: this.login
    }
  })
};