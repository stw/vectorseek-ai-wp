<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="wrap">
    <h1>VectorSeek.ai Settings</h1>
    <form method="post" action="options.php">
        <?php
        settings_fields('vectorseek_settings');
        do_settings_sections('vectorseek_settings');
        ?>
        <table class="form-table" width="80%">
            <tr>
                <th scope="row">VectorSeek.ai Host</th>
                <td><input size="50" type="text" name="vectorseek_host" value="<?php echo esc_attr(get_option('vectorseek_host')); ?>" /></td>
            </tr>
            <tr>
                <th scope="row">Context Length</th>
                <td><input size="50" type="text" name="vectorseek_context" value="<?php echo esc_attr(get_option('vectorseek_context')); ?>" /></td>
            </tr>
            <tr>
                <th scope="row">API Key</th>
                <td><input size="50" type="password" name="vectorseek_api_key" value="<?php echo esc_attr(get_option('vectorseek_api_key')); ?>" /></td>
            </tr>

            <tr>
                <td colspan="2">This is the class of the search form:</td>
            </tr>
            <tr>
                <th scope="row">Search Form Class</th>
                <td><input size="50" type="text" name="vectorseek_search_class" value="<?php echo esc_attr(get_option('vectorseek_search_class')); ?>" /></td>
            </tr>

        </table>
        <?php submit_button(); ?>
    </form>
</div>

<p>Creates shortcode [vectorseek] to be included on pages</p>

<p>Visit <a target="_blank" href="https://vectorseek.ai">VectorSeek.ai</a> to setup your project.</p>

<h3>To include in search results on the search page, use the below snippet:</h3>

<textarea cols="90" rows="5" disabled>
<div id="vectorseek_loader-container" class="mt-3">
    <div class="vectorseek_loader-bar"></div>
    <div class="vectorseek_loader-bar"></div>
    <div class="vectorseek_loader-bar"></div>
</div> 
<div id="vectorseek_results"></div>
<div id="vectorseek_context"></div>
</textarea>
