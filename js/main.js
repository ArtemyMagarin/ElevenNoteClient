// TODO: callbacks

userdata = {
  username: "viewer@test.com",
  userid: 0
}

userdata_vm = new Vue({
  el: "#userdata",
  data: userdata,
})


bookdata = {
  booklist: [],
  current_book: {},
  cardlist: [],
  current_card: {},
  notelist: [],
  current_note: {},
  shared_notelist: [],
  isSharedActive: false,
  canEdit: false,
  canDelete: false,
  action: 'view',
}

bookdata_vm = new Vue({
  el: "#booklist",
  data: bookdata,
  methods: {
    prettyDate: function (s) {
      d = new Date(s);
      now = new Date();

      if (d.toDateString() === now.toDateString()) {
        return "Last edited: today, at " + d.toTimeString().split(":").slice(0,2).join(":")
      }
      return "Last edited: " + d.toDateString().split(" ").slice(1).join(" ") +", "+ d.toTimeString().split(":").slice(0,2).join(":")
    },

    prettyUsername: function(username) {
      if (username == userdata.username) {
        return "You"
      }
      return username
    },

    getTags: function(tagsId) {
      return tagsId
    },

    setCurrentBook: function(event) {
      bookdata.isSharedActive = false;
      id = event.target.getAttribute('data-id')
      bookdata.current_book = bookdata.booklist.reduce(function(prev, curr) {
        if (curr['id'] == id) {return curr} else {return prev}
      }, {})
      bookdata.cardlist = bookdata.current_book.notes
    },

    setSharedAsCurrentBook: function(event) {
      bookdata.isSharedActive = true;
      bookdata.current_book = {id: 0, title: 'Shared notes', description: ''}
      bookdata.cardlist = bookdata.shared_notelist
    },

    setCurrentCard: function(event) {
      id = event.target.getAttribute('data-id') || $(event.target).closest("div[data-id]").attr("data-id")
      bookdata.booklist = []
      
      bookdata.current_card = bookdata.cardlist.reduce(function(prev, curr) {
        if (curr['id'] == id) {return curr} else {return prev}
      }, {})
      bookdata.current_note = bookdata.current_card
      bookdata.notelist = bookdata.cardlist
      bookdata.cardlist = []

      bookdata.action = 'view'
      bookdata.canDelete = false
      bookdata.canEdit = false
      if (userdata.userid == bookdata.current_note.owner.id) {
        bookdata.canDelete = true
        bookdata.canEdit = true
      } else {
        if (~bookdata.current_note.editors.indexOf(userdata.userid)) {
          bookdata.canEdit = true
        }
      }
      
    },

    setCurrentNote: function(event) {
      id = event.target.getAttribute('data-id') || $(event.target).closest("div[data-id]").attr("data-id")      
      bookdata.current_note = bookdata.notelist.reduce(function(prev, curr) {
        if (curr['id'] == id) {return curr} else {return prev}
      }, {})

      bookdata.action = 'view'
      bookdata.canDelete = false
      bookdata.canEdit = false
      if (userdata.userid == bookdata.current_note.owner.id) {
        bookdata.canDelete = true
        bookdata.canEdit = true
      } else {
        if (~bookdata.current_note.editors.indexOf(userdata.userid)) {
          bookdata.canEdit = true
        }
      }

    },

    goStart: function() {
      api.get('book').done(function(data){
        bookdata.current_card = bookdata.current_note = new Object();
        bookdata.booklist = data
        bookdata.cardlist = bookdata.current_book["notes"] || bookdata.shared_notelist
        bookdata.notelist = []
        if (bookdata.current_book.id) {
        
          bookdata.current_book = bookdata.booklist.reduce(function(prev, curr) {
            if (curr['id'] == bookdata.current_book.id) {return curr} else {return prev}
          }, {})
        }


      })

      api.get('note').done(function(data) {
        bookdata.shared_notelist = []
        data.forEach(function(item) {
          if (item.owner.email != userdata.username) {
            bookdata.shared_notelist.push(item)
          }
        })
      })
    }
  }
})

user = new User("viewer@test.com", "98sasaylalka")
api = new Api()

user.signIn().done(function(data) {
  userdata.username = user.login
  user.getId().done(function(data) {
    userdata.userid = data[0].id
  })
  
}).fail(data=>alert(data))
api.get('book').done(function(data){
  bookdata.booklist = data
  bookdata.current_book = data[0]
  bookdata.cardlist = data[0]["notes"]
})

api.get('note').done(function(data) {
  data.forEach(function(item) {
    if (item.owner.email != userdata.username) {
      bookdata.shared_notelist.push(item)
    }
  })
})

