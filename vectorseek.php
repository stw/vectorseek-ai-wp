<?php
/**
 * Plugin Name: VectorSeek AI Search
 * Description: Connect WordPress to VectorSeek.ai
 * Version: 0.0.10
 * Author: Stephen Walker <swalker@walkertek.com>, VectorSeek
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/lgpl-3.0.html
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

define( 'VECTORSEEK_VERSION', '0.0.10' );

if ( ! class_exists( 'VectorSeek_Connector' ) ) {

    class VectorSeek_Connector {
        private $host;
        private $context;
        private $api_key;
        private $search_class;
        private $voice;

        public function __construct() {
            add_action('admin_menu', array($this, 'add_admin_menu'));
            add_action('admin_init', array($this, 'register_settings'));

            $this->host = get_option('vectorseek_host');
            $this->context = get_option('vectorseek_context');
            $this->api_key = get_option('vectorseek_api_key');
            $this->search_class = get_option('vectorseek_search_class');
            $this->voice = get_option('vectorseek_voice');
        }

        public function add_admin_menu() {
            add_options_page(
                'VectorSeek Settings',
                'VectorSeek.ai',
                'manage_options',
                'vectorseek_settings',
                array($this, 'settings_page')
            );
        }

        public function all() {
            return array(
                'host' => $this->host,
                'api_key' => $this->api_key,
                'context' => $this->context,
                'search_class' => $this->search_class,
                'voice' => !empty($this->voice),
            );
        }

        public function register_settings() {
            $args = array(
                'sanitize_callback' => 'sanitize_text_field',
                'type' => 'string',
                'default' => NULL,
            );
            register_setting('vectorseek_settings', 'vectorseek_host', $args);
            register_setting('vectorseek_settings', 'vectorseek_context', $args);
            register_setting('vectorseek_settings', 'vectorseek_api_key', $args);
            register_setting('vectorseek_settings', 'vectorseek_search_class', $args);
            register_setting('vectorseek_settings', 'vectorseek_voice', array(
                'sanitize_callback' => function ($value) { return $value ? '1' : ''; },
                'type' => 'string',
                'default' => '',
            ));
        }

        public function settings_page() {
            include dirname( __FILE__ ) . '/templates/settings.php';
        }
    }

    $vectorseek_connector = new VectorSeek_Connector();

    function vectorseek_api_key() {
        $vectorseek_connector = new VectorSeek_Connector();
        return $vectorseek_connector->all();
    }

    add_action( 'rest_api_init', function () {
      register_rest_route( 'vectorseek/v2', '/key', array(
        'methods' => 'GET',
        'callback' => 'vectorseek_api_key',
        'permission_callback' => '__return_true',
      ));
    });

    add_action('wp_enqueue_scripts','vectorseek_init');
    function vectorseek_init() {
        global $post;

        if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'vectorseek' ) ) {
            wp_enqueue_script( 'vectorseek-cookies-js', plugins_url( '/js/vendor/js.cookie.min.js', __FILE__ ), array('jquery'), VECTORSEEK_VERSION, array('in_footer'=>true));
            /* wp_enqueue_script( 'vectorseek-commonmark-js', plugins_url( '/js/vendor/commonmark.js', __FILE__ ), array('jquery'), VECTORSEEK_VERSION, array('in_footer'=>true)); */
            wp_enqueue_script( 'vectorseek-purify-js', plugins_url( '/js/vendor/purify.min.js', __FILE__ ), array('jquery'), VECTORSEEK_VERSION, array('in_footer'=>true));
            // wp_enqueue_script( 'vectorseek-smd-js', plugins_url( '/js/vendor/smd.min.js', __FILE__ ), array('jquery'), VECTORSEEK_VERSION, array('in_footer'=>true, 'type'=> 'module'));
            wp_enqueue_script( 'vectorseek-info-js', plugins_url( '/js/info.js', __FILE__ ), array('jquery'), VECTORSEEK_VERSION, array('in_footer'=>true));
            // wp_enqueue_script( 'vectorseek-js', plugins_url( '/js/vectorseek.js', __FILE__ ), array('vectorseek-cookies-js'), VECTORSEEK_VERSION, array('in_footer'=>true, 'type'=>'module'));
            // Script modules. Pass the plugin version so browsers fetch new files after an update (WordPress
            // would otherwise add ITS version), and register the helpers so WordPress versions their imports
            // too (the module imports them as '@vectorseek/...'; WordPress writes the matching import map).
            wp_register_script_module( '@vectorseek/smd', plugins_url( '/js/vendor/smd.min.js', __FILE__ ), array(), vectorseek_asset_ver( '/js/vendor/smd.min.js' ) );
            wp_register_script_module( '@vectorseek/voice', plugins_url( '/js/voice.js', __FILE__ ), array(), vectorseek_asset_ver( '/js/voice.js' ) );
            wp_register_script_module( '@vectorseek/conversation', plugins_url( '/js/conversation.js', __FILE__ ), array(), vectorseek_asset_ver( '/js/conversation.js' ) );
            wp_enqueue_script_module( 'vectorseek-js', plugins_url( '/js/vectorseek.js', __FILE__ ), array( '@vectorseek/smd', '@vectorseek/voice', '@vectorseek/conversation' ), vectorseek_asset_ver( '/js/vectorseek.js' ) );
            wp_enqueue_style( 'vectorseek-css', plugins_url( '/css/vectorseek.css', __FILE__ ), array(), VECTORSEEK_VERSION);
            wp_enqueue_style( 'vectorseek-spinner-css', plugins_url( '/css/spinner.css', __FILE__ ), array(), VECTORSEEK_VERSION);
        }
    }

    /**
     * Cache-busting version for a plugin file: the plugin version plus the file's modification time, so
     * a browser never keeps using an old script after the plugin (or the file) has been updated.
     */
    function vectorseek_asset_ver( $relative_path ) {
        $file = plugin_dir_path( __FILE__ ) . ltrim( $relative_path, '/' );
        $mtime = file_exists( $file ) ? filemtime( $file ) : 0;
        return VECTORSEEK_VERSION . ( $mtime ? '-' . base_convert( (string) $mtime, 10, 36 ) : '' );
    }

    function vectorseek_page($atts) {
        ob_start();
        include dirname( __FILE__ ) . '/templates/query.php';
        return ob_get_clean();
    }
    add_shortcode('vectorseek', 'vectorseek_page');

}
