<?php
/**
 * Plugin Name: VectorSeek.ai 
 * Description: Connect WordPress to VectorSeek.ai
 * Version: 0.1
 * Author: Stephen Walker <swalker@walkertek.com>, VectorSeek
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class VectorSeek_Connector {
    private $host;
    private $api_key;

    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));

        $this->host = get_option('vectorseek_host');
        $this->host = get_option('vectorseek_project');
        $this->host = get_option('vectorseek_context');
        $this->api_key = get_option('vectorseek_api_key');
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

    public function host() {
        return $this->host;
    }

    public function api_key() {
        return $this->api_key;
    }

    public function register_settings() {
        register_setting('vectorseek_settings', 'vectorseek_host');
        register_setting('vectorseek_settings', 'vectorseek_project');
        register_setting('vectorseek_settings', 'vectorseek_context');
        register_setting('vectorseek_settings', 'vectorseek_api_key');
    }

    public function settings_page() {
        include dirname( __FILE__ ) . '/templates/settings.php';
    }
}

$vectorseek_connector = new VectorSeek_Connector();

function vectorseek_api_key() {
    $vectorseek_connector = new VectorSeek_Connector();
    return $vectorseek_connector->api_key();
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'vectorseek/v2', '/key', array(
    'methods' => 'GET',
    'callback' => 'vectorseek_api_key',
  ));
});

add_action('wp_enqueue_scripts','vectorseek_init');
function vectorseek_init() {
    wp_enqueue_script( 'vectorseek-js', plugins_url( '/js/vectorseek.js', __FILE__ ), array('jquery'));
}

function vectorseek_page($atts) {
    ob_start();
    include dirname( __FILE__ ) . '/templates/query.php';
    return ob_get_clean();
}
add_shortcode('vectorseek', 'vectorseek_page');

