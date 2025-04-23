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
                <th scope="row">Project ID</th>
                <td><input size="50" type="text" name="vectorseek_project" value="<?php echo esc_attr(get_option('vectorseek_project')); ?>" /></td>
            </tr>
            <tr>
                <th scope="row">Context Length</th>
                <td><input size="50" type="text" name="vectorseek_context" value="<?php echo esc_attr(get_option('vectorseek_context')); ?>" /></td>
            </tr>
            <tr>
                <th scope="row">API Key</th>
                <td><input size="50" type="password" name="vectorseek_api_key" value="<?php echo esc_attr(get_option('vectorseek_api_key')); ?>" /></td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
</div>

<p>Creates shortcode [vectorseek] to be included on pages</p>


