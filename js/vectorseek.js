import * as smd from "@vectorseek/smd";
import { VoiceInput, Speaker, createVoiceUi, HandsFree } from "@vectorseek/voice";
import { Conversation } from "@vectorseek/conversation";

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

    function uuidv4() {
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
      );
    }

    function websocket_setup(data) {
        const host = data.host;
        const context = data.context;
        const token = data.api_key;
        const search_class = data.search_class;
        var message = '';

        var proto = 'wss://';
        if (window.location.protocol == 'http:') {
            proto = 'ws://';
        }
        var url = proto + host + '/ws/project/' + token;
        console.log("URL (vs): " + url);

        const chatSocket = new WebSocket( url );

        // ---- voice (opt-in in the plugin settings AND enabled on the VectorSeek project) ----
        const voiceOptIn = !!data.voice;
        const httpBase = (window.location.protocol == 'http:' ? 'http://' : 'https://') + host;
        const speaker = new Speaker();
        let voiceQuery = false;    // current query was dictated
        let pendingVoice = false;  // set by dictation, consumed on submit
        const $mic = $('#vectorseek_mic');
        const $speak = $('#vectorseek_speak');
        const $status = $('#vectorseek_voice_status');

        const $stop = $('#vectorseek_stop');
        const voiceUi = createVoiceUi({
            mic: $mic[0], stop: $stop[0], status: $status[0],
            isBusy: function() { return dictation.busy; }
        });

        const dictation = new VoiceInput({
            onStart: function() {
                speaker.cancel();
                voiceUi.onStart(handsFree.autoSession);
            },
            onInterim: function(text) { $('#vectorseek_query').val(text); },
            onEnd: voiceUi.onEnd,
            onProcessing: voiceUi.onProcessing,
            onError: function(msg) {
                handsFree.disarm();       // a silent or failed listen ends the hands-free loop
                voiceUi.onError(handsFree.autoSession ? 'Tap the microphone to keep talking.' : msg);
            },
            onFinal: function(text) {
                voiceUi.onFinal();                 // mic is usable again straight away (conversation mode: next question)
                $('#vectorseek_query').val(text);
                pendingVoice = true;
                $('#vectorseek_submit').trigger('click');
            }
        });
        // Hands-free conversation: in conversation mode, start listening again on its own after a spoken
        // exchange (answer read, or Stop pressed) when the browser and page state allow it.
        const $input = $('#vectorseek_query');
        const handsFree = new HandsFree({
            start: function() { dictation.start(); },
            onActiveChange: function(on) {          // a visible cue that the conversation is on
                $mic.toggleClass('vs-conversation', on)
                    .attr('title', on ? 'Voice conversation is on - click while it is listening to end it' : 'Ask by voice');
            },
            canListen: function() {
                return conv.enabled && dictation.supported && !dictation.listening && !dictation.busy && !speaker.busy
                    && document.visibilityState !== 'hidden'
                    && document.activeElement !== $input[0]            // the visitor is typing
                    && !String($input.val() || '').trim();             // or has text waiting
            }
        });

        speaker.onBusyChange = function(busy) {       // mic is disabled and Stop shown while an answer is read aloud
            voiceUi.onSpeaking(busy);
            if (!busy) handsFree.readingEnded();
        };
        $stop.on('click', function() {
            console.debug('[voice] stop pressed (reading=' + speaker.busy + ')');
            voiceUi.reset();                     // make sure the mic is usable again, whatever state we were in
            handsFree.stopping = true;           // listening may restart right now: this click is a user gesture
            try {
                speaker.cancel({ force: true });   // stop reading the response, always
            } finally {
                handsFree.stopping = false;
            }
        });

        function enableVoice(cfg) {
            if (!voiceOptIn) return;
            speaker.setServer(cfg.tts ? { endpoint: httpBase + '/api/voice/speak', key: token } : null);
            dictation.setServer(cfg.transcribe ? { endpoint: httpBase + '/api/voice/transcribe', key: token } : null);
            if (!dictation.supported) return;
            $mic.prop('hidden', false);
            if (speaker.supported) $speak.prop('hidden', false);
        }

        $mic.on('click', function() {
            if (dictation.listening && handsFree.autoSession) {   // clicking the mic during an automatic listen ends the conversation
                handsFree.end();
                dictation.abort();                 // discard what was heard
                $input.val('');                    // ...including any live text already shown in the box
                voiceUi.onConversationEnded();
                return;
            }
            handsFree.markManual();
            dictation.toggle();
        });
        $speak.on('click', function() {
            const mute = !speaker.muted;
            speaker.setMuted(mute);
            $speak.toggleClass('vs-muted', mute)
                  .attr('aria-pressed', String(mute))
                  .attr('aria-label', mute ? 'Unmute spoken answers' : 'Mute spoken answers')
                  .attr('title', mute ? 'Spoken answers off' : 'Spoken answers on');
        });
        $(window).on('pagehide', function() { handsFree.disarm(); speaker.cancel(); dictation.abort(); });

        const element  = document.getElementById("vectorseek_results");
        let renderer = smd.default_renderer(element);
        let parser   = smd.parser(renderer);

        // ---- ongoing conversation (project setting; the server tells us in the config message) ----
        const conv = new Conversation({
            container: element,
            loader: document.getElementById('vectorseek_loader-container'),
            images: function() {
                return { up: $('#vectorseek_up img').attr('src'), down: $('#vectorseek_down img').attr('src') };
            },
            onRate: function(id, token, value) {
                $.get(httpBase + '/api/query/' + id + '/' + (value > 0 ? 'up' : 'down'), { t: token || '' });
            },
            onClear: function() {
                Cookies.set('uuid', uuidv4());     // new session: the server forgets earlier turns
                handsFree.disarm();
                speaker.cancel();
                message = '';
                $('#vectorseek_query').val('').trigger('focus');
            }
        });

        // var reader = new commonmark.Parser();
        // var writer = new commonmark.HtmlRenderer();

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);

            if (data.config) {
                conv.setEnabled(!!data.config.conversation);
                if (data.config.voice_enabled) enableVoice(data.config);
                return;
            }

            message += data.message;

            $('#vectorseek_loader-container').css('display', 'none');

            DOMPurify.sanitize(message);

            if (DOMPurify.removed.length) {
                console.log("Found insecure code");
                smd.parser_end(parser);
            } else {
                if (data.message) {
                    smd.parser_write(parser, data.message);
                    if (voiceQuery) speaker.feed(data.message);
                }

                // if (data.message) {
                //     var parsed = reader.parse(message);
                //     var result = writer.render(parsed);
                //     $('#vectorseek_results').html(result);
                // }

                // Conversation mode: sources (and context, where this page shows it) go in a collapsed accordion
                // under their own answer. Context is only shown where the page already has a context display.
                if (conv.enabled && (data.sources || data.contexts)) {
                    conv.addReferences({
                        sources: data.sources,
                        contexts: $('#vectorseek_context').length ? data.contexts : null,
                        searchTypes: data.search_types
                    });
                }

                if (!conv.enabled && data.sources && data.sources.length > 0) {
                    let citationsHtml = '<div class="citations"><h5>Sources:</h5>';
                    data.sources.forEach(function(source, index) {
                        const citationNum = index + 1;
                        const confidence = getConfidenceClass(source.confidence);
                        citationsHtml += `<div class="row mb-1 p-1 ${confidence}">
                            <div class="col small text-muted">
                            <span class="citation-number">${citationNum} - </span>
                            <span class="confidence">${(source.confidence * 100).toFixed(0)}% - </span>
                            <span class="citation-link"><a href="${source.url}" target="_blank">${source.title}</a></span>
                            </div>
                        </div>`;
                    });
                    citationsHtml += '</div>';
                    $(conv.target).append(citationsHtml);
                }

                if (!conv.enabled && data.contexts) {
                    $('#vectorseek_context').append('<div class="row pt-3 pb-3"><b>Context:</b></div>');
                    data.contexts.forEach(function(c) {
                        $("#vectorseek_context").append('<div class="col pb-2">' + c + '</div>');
                    });

                    if (!conv.enabled) $('#vectorseek_rate').removeClass('d-none');
                }

                if (data.qlog_id) {
                    if (voiceQuery) speaker.flush();
                    voiceQuery = false;
                    smd.parser_end(parser);
                    $('#qlog_id').val(data.qlog_id).attr('data-token', data.qlog_token || '');
                    conv.finishTurn({ id: data.qlog_id, token: data.qlog_token });
                    handsFree.answerComplete();
                }
            }

        };

        chatSocket.onclose = function(e) {
            console.log('Chat Socket Closed Unexpectedly');
            $('#vectorseek_loader-container').hide();
            if (e.code === 4403) {
                $('#vectorseek_error').text('This website is not authorized to use this search. Add it under Allowed Origins in your VectorSeek project settings.');
                $('#vectorseek_error').removeClass('d-none');
                return;
            }
            $('#vectorseek_error').html('<p>Connection failed, please <a href=".">refresh the page</a> and try again.</p>');
            $('#vectorseek_error').removeClass('d-none');
        };


        $('#vectorseek_up').on('click', function(e) {
            var id = $('#qlog_id').val();
            $.get(httpBase + '/api/query/' + id + '/up', { t: $('#qlog_id').attr('data-token') || '' });
            $('#vectorseek_rate').append('<div id="vs_msg"><b>Thank You!</b></div>');
            $('#vectorseek_rating').addClass('d-none');
        });

        $('#vectorseek_down').on('click', function(e) {
            var id = $('#qlog_id').val();
            $.get(httpBase + '/api/query/' + id + '/down', { t: $('#qlog_id').attr('data-token') || '' });
            $('#vectorseek_rate').append('<div id="vs_msg"><b>Thank You!</b></div>');
            $('#vectorseek_rating').addClass('d-none');
        });

        $(document).on('click', '#vectorseek_submit', function(e) {
            e.preventDefault();
            var query = $('#vectorseek_query').val();
            if (conv.enabled && !String(query).trim()) { pendingVoice = false; return; }
            var context = 20;
            var uuid = Cookies.get('uuid');
            if (! uuid) {
                uuid = uuidv4();
                Cookies.set('uuid', uuid);
            }
            message = '';
            voiceQuery = pendingVoice;
            pendingVoice = false;
            speaker.cancel();
            if (voiceQuery) speaker.start();
            if (voiceQuery && conv.enabled) { handsFree.arm(); handsFree.beginAnswer(); } else { handsFree.disarm(); }
            conv.startTurn(query);          // single-answer mode: clears the previous result as before
            renderer = smd.default_renderer(conv.target);
            parser   = smd.parser(renderer);
            if (conv.enabled) $('#vectorseek_query').val('');
            $('#vectorseek_loader-container').css('display', 'flex');
            $('#vectorseek_rate').addClass('d-none');
            $('#vs_msg').remove();
            $('#vectorseek_rating').removeClass('d-none');
            $('#accordionContext').addClass('d-none');

            var info = getInfo();
            var ip = getIP();
            ip.then(ip => {
                info['ip'] = ip;
                chatSocket.send(JSON.stringify({'type': 'query', 'uuid': uuid, 'query': query, 'context': context, 'info': info, 'voice': voiceQuery}));
            }).catch(err => {
                console.log(err);
                chatSocket.send(JSON.stringify({'type': 'query', 'uuid': uuid, 'query': query, 'context': context, 'info': info, 'voice': voiceQuery}));
            });
        });

        var query = $(search_class).val();
        if (query) {
            message = '';
            $('#vectorseek_loader-container').css('display', 'flex');
            waitForSocketConnection(chatSocket, function(){
                var uuid = Cookies.get('uuid');
                var context = 10;
                if (! uuid) {
                    uuid = uuidv4();
                    Cookies.set('uuid', uuid);
                }

                var ip = getIP();
                var info = getInfo();
                info['ip'] = ip;
                var client = 'wp';
                chatSocket.send(JSON.stringify({'type': 'query', 'uuid': uuid, 'query': query, 'context': context, 'info': info, 'client': client}));
            });
        }
    }

    $.ajax({ url: '/wp-json/vectorseek/v2/key', success: websocket_setup });

    function getConfidenceClass(confidence) {
        if (confidence >= 0.85) return 'conf-excellent';  // Green - Excellent
        if (confidence >= 0.70) return 'conf-good';  // Light Green - Good
        if (confidence >= 0.60) return 'conf-fair';  // Yellow - Fair
        if (confidence >= 0.40) return 'conf-poor'; // Orange - Poor
        return 'conf-verypoor'; // Red - Very Poor
    }
});


