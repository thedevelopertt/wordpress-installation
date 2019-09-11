<?php

use App\BlogInformation;

function initializeScripts(){
	wp_enqueue_script("jqueryDist",BlogInformation::getJavascriptDirectory()."jquery.js",null, null);
	wp_enqueue_script("TweenMax",BlogInformation::getJavascriptDirectory()."TweenMax.js",null, null);
	wp_enqueue_script("LineMax",BlogInformation::getJavascriptDirectory()."TimelineMax.js",null, null);

	wp_enqueue_script("scrollMagic",BlogInformation::getJavascriptDirectory()."ScrollMagic.min.js",null, null);
	wp_enqueue_script("jqueryScrollMagic",BlogInformation::getJavascriptDirectory()."jquery.ScrollMagic.min.js",null, null);
	wp_enqueue_script("animationGsap",BlogInformation::getJavascriptDirectory()."animation.gsap.min.js",null, null);

	wp_enqueue_script("main",BlogInformation::getJavascriptDirectory()."main.js",null,null);
}

add_action('wp_enqueue_scripts', 'initializeScripts');


require_once __DIR__ . "/src/php/BlogInformation.php";