jQuery(document).ready(function($) {
    function websocket_setup(data) {

        const chatSocket = new WebSocket( ws_url + data );

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            $('.spinner').addClass('d-none');

            if (data.message) {
                $('#log').append('<span class="">' + data.message + '</span>');
            }

            if (data.contexts) {
                $('#context').append('<div class="row pt-3 pb-3"><b>Context:</b></div>');
                data.contexts.forEach(function(c) {
                    $("#context").append('<div class="col pb-2">' + c + '</div>');
                });
            }
        };

        chatSocket.onclose = function(e) {
            console.log('Chat Socket Closed Unexpectedly');
            $('#query-row').hide();
            $('#error').html('<b>Connection failed, please <a href=".">refresh the page</a> and try again.</p>');
        };

        $(document).on('click', '#vectorseek_submit', function(e) {
            e.preventDefault();
            var query = $('#vectorseek-query').val();
            $('#log').empty();
            $('.spinner').removeClass('d-none');
            chatSocket.send(JSON.stringify({'project': project, 'query': query, 'context': context}));
        });
    }

    $.ajax({ url: '/wp-json/vectorseek/v2/key', success: websocket_setup });
});

