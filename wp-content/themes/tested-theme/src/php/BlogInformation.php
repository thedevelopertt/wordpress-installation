<?php

namespace App;
class BlogInformation{

	public static function getBlogName(){
		return get_bloginfo('name');
	}

	public static function getBlogDescription(){
		return get_bloginfo('description');
	}

	public static function getBlogFaviconUrl(){
		return get_site_icon_url();
	}

	public static function getTemplateDirectory(){
		return get_template_directory_uri();
	}

	public static function getImageDirectory(){
		return self::getTemplateDirectory()."/dist/img/";
	}

	public static function getSvgPath(){
		return self::getImageDirectory()."svg/";
	}

	public static function getJavascriptDirectory(){
		return self::getTemplateDirectory()."/dist/js/";
	}

	public static function scriptFiles(){
		$allScripts = glob(self::getJavascriptDirectory()."*.js");
		return $allScripts;
	}

}
