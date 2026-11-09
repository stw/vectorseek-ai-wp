<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<section id="vectorseek_querybox" class="vs-section">
    <div class="vs-container">

        <form>
            <div class="vs-row">
                <div class="vs-col vs-mb-3">
                    <div class="vs-input-wrap">
                        <?php if ( get_option('vectorseek_voice') ) : ?>
                        <div class="vs-voice-controls">
                            <button id="vectorseek_mic" type="button" class="vs-voice-btn" hidden aria-label="Ask by voice" aria-pressed="false" title="Ask by voice"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
  <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
</svg></button>
                            <button id="vectorseek_speak" type="button" class="vs-voice-btn" hidden aria-label="Mute spoken answers" aria-pressed="false" title="Spoken answers on"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
  <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
  <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
</svg></button>
                            <button id="vectorseek_stop" type="button" class="vs-voice-btn vs-stop-btn" hidden aria-label="Stop reading the answer" title="Stop reading the answer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
  <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"/>
</svg></button>
                        </div>
                        <?php endif; ?>
                        <textarea id="vectorseek_query" class="vs-form-control" name="query" cols="80" rows="2" placeholder="Ask a question..."></textarea>
                    </div>
                    <div id="vectorseek_voice_status" class="vs-voice-status" role="status" aria-live="polite"></div>
                </div>

                <div class="vs-col vs-mb-3">
                    <button id="vectorseek_submit" type="button" class="vs-btn vs-btn-outline-primary">
                        <span class="text">Submit</span>
                    </button>
                </div>
            </div>
        </form>

        <div id="vectorseek_error" class="vs-row p-3 d-none">
            <div class="vs-col">
                <div class="message message-danger">
                    An error has occurred, <a href=".">please try again</a>.
                </div>
            </div>
        </div>

        <div id="vectorseek_loader-container" class="d-none">
            <div class="vectorseek_loader-bar"></div>
            <div class="vectorseek_loader-bar"></div>
            <div class="vectorseek_loader-bar"></div>
        </div> 

        <div id="vectorseek_results" class="pb-3 pt-3" aria-live="polite">
        </div>

        <div class="vs-row vs-mb-3">
            <div class="vs-col">
                <div class="vs-row">
                    <div class="vs-col-6">
                        <div id="vectorseek_rate" class="vectorseek_rate d-none">
                            <div class="vectorseek_ratetext">
                                <p>AI results. Please confirm accuracy.<br>
                                    Was this answer helpful?</p>
                            </div>
                            <div id="vectorseek_rating">
                                <input type="hidden" name="qlog_id" id="qlog_id" value=""/>
                                <a id="vectorseek_up" href="#"><img src="<?php echo esc_url(plugin_dir_url( __DIR__ )); ?>/images/thumb-up.svg" alt="Thumbs Up" class="vectorseek_thumbs_up" role="button" tabindex="0"></a>
                                <a id="vectorseek_down" href="#"><img src="<?php echo esc_url(plugin_dir_url( __DIR__ )); ?>/images/thumb-down.svg" alt="Thumbs Down" class="vectorseek_thumbs_down" role="button" tabindex="0"></a>
                            </div>
                        </div>
                    </div>
                    <div class="vs-col-6 float-end">
                        <div id="vectorseek_pb" class="vectorseek_pb">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

