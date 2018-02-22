var Api = function() {

}

Api.prototype.get = function(type, id) {
  id = id || 0
  if (id) {
    url = "http://localhost:8000/api/"+type+"/"+id+"/"
  } else {
    url = "http://localhost:8000/api/"+type+"s/"
  }

  return $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization","Token " + window.sessionStorage.accessToken);
    },  
    url: url,
    method: 'get'
  })
  

  .done(function(response) {
    return response
  })
  .fail(function(response) {
    return {'error': response['detail']}
  })
};

Api.prototype.createOrUpdateOrDelete = function(type, data, id) {
  id = id || 0
  if (id) {
    url = "http://localhost:8000/api/"+type+"/"+id+"/"
    method = "put"
  } else {
    url = "http://localhost:8000/api/"+type+"s/"
    method = "post"
  }

  if (!Object.keys(data).length) {
    method = "delete"
  }

  return $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization","Token " + window.sessionStorage.accessToken);
    },  
    url: url,
    method: method,
    data: data,
  })
  

  .done(function(response) {
    return response
  })
  .fail(function(response) {
    return {'error': response['detail']}
  })
};

Api.prototype.search = function(query) {
  return $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization","Token " + window.sessionStorage.accessToken);
    },  
    url: 'http://localhost:8000/api/notes/',
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

