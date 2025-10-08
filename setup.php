<?php
if (!defined('GLPI_ROOT')) {
   die('Direct access not allowed');
}

function plugin_version_customfields() {
   return [
      'name'           => 'Custom Fields',
      'version'        => '1.2.0',
      'author'         => 'Local',
      'license'        => 'MIT',
      'homepage'       => 'about:blank',
      'requirements'   => [
         'glpi' => [
            'min' => '10.0.0'
         ]
      ]
   ];
}

function plugin_init_customfields() {
   global $PLUGIN_HOOKS;
   $PLUGIN_HOOKS['csrf_compliant']['customfields'] = true;
   $PLUGIN_HOOKS['add_javascript']['customfields'] = [
      'js/customfields.js'
   ];
}

function plugin_customfields_install() {
   return true;
}

function plugin_customfields_uninstall() {
   return true;
}
