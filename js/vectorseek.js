jQuery(document).ready(function($) {

    function waitForSocketConnection(socket, callback){
        setTimeout(
            function () {
                if (socket.readyState === 1) {
                    console.log("Connection is made")
                    if (callback != null){
                        callback();
                    }
                } else {
                    console.log("wait for connection...")
                    waitForSocketConnection(socket, callback);
                }

            }, 5); // wait 5 milisecond for the connection...
    }

    function urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
      })
    }

    function websocket_setup(data) {
        const host = data.host;
        const context = data.context;
        const token = data.api_key;
        const search_class = data.search_class;

        proto = 'wss://';
        if (window.location.protocol == 'http:') {
            proto = 'ws://';
        }
        url = proto + host + '/ws/project/' + token;

        const chatSocket = new WebSocket( url );

        var message = '';
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);

            message += data.message;

            $('.vectorseek_spinner').addClass('d-none');

            if (data.message) {
                $('#vectorseek_results').html(urlify(message));
            }

            if (data.contexts) {
                $('#vectorseek_context').append('<div class="row pt-3 pb-3"><b>Context:</b></div>');
                data.contexts.forEach(function(c) {
                    $("#vectorseek_context").append('<div class="col pb-2">' + c + '</div>');
                });
            }
        };

        chatSocket.onclose = function(e) {
            console.log('Chat Socket Closed Unexpectedly');
            $('#vectorseek_query_row').hide();
            $('#vectorseek_error').html('<b>Connection failed, please <a href=".">refresh the page</a> and try again.</p>');
        };

        $(document).on('click', '#vectorseek_submit', function(e) {
            e.preventDefault();
            var query = $('#vectorseek_query').val();
            $('#vectorseek_results').empty();
            $('.vectorseek_spinner').removeClass('d-none');
            chatSocket.send(JSON.stringify({'type': 'query', 'query': query, 'context': context}));
        });

        var query = $(search_class).val();
        if (query) {
            $('.vectorseek_spinner').removeClass('d-none');
            waitForSocketConnection(chatSocket, function(){
                chatSocket.send(JSON.stringify({'type': 'query', 'query': query, 'context': context}));
            });
        }
    }

    $.ajax({ url: '/wp-json/vectorseek/v2/key', success: websocket_setup });
});

