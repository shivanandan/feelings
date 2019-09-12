(function(){










































    var pusher = new Pusher('258b3dfcc0352b31fbea', {
        cluster: 'us2',
        forceTLS: true
      });
      // retrieve the socket ID once we're connected
      pusher.connection.bind('connected', function () {
          // attach the socket ID to all outgoing Axios requests
          axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
      });

      // request permission to display notifications, if we don't alreay have it
      // Notification.requestPermission();
      pusher.subscribe('notifications')
              .bind('post_updated', function (emotions) {
                  // if we're on the home page, show an "Updated" badge
                  // if (window.location.pathname === "/") {
                  //     $('a[href="/posts/' + post.mood + '"]').append('<span class="badge badge-primary badge-pill">Updated</span>');
                  // }
                  // var notification = new Notification(emotion.desc + " was just updated. Check it out.");
                  // notification.onclick = function (event) {
                  //     // window.location.href = '/posts/' + post.mood;
                  //     event.preventDefault();
                  //     notification.close();
                  // }

                  console.log(emotions)
                  document.querySelector(".one").innerText = emotions["1"]
                  document.querySelector(".two").innerText = emotions["2"]
                  document.querySelector(".three").innerText = emotions["3"]
                  document.querySelector(".four").innerText = emotions["4"]
                  document.querySelector(".five").innerText = emotions["5"]





              });



})()