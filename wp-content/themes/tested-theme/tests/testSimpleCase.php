<?php

class SimpleTest extends WP_UnitTestCase {


	public function __construct( $name = null, array $data = [], $dataName = '' ) {
		parent::__construct( $name, $data, $dataName );

		$this->info = new \App\BlogInformation;
	}

	var $info;

	public function test_sample() {

		$this->assertEquals('Test Blog',$this->info->getBlogName());
		echo $this->info->getBlogName();

		$this->assertGreaterThan(0,strlen($this->info->getBlogDescription()));
		echo $this->info->getBlogDescription();

		if(strlen($this->info->getBlogFaviconUrl()) != 0)
			$this->assertFileExists($this->info->getBlogFaviconUrl());
		else
			$this->assertEquals("",$this->info->getBlogFaviconUrl());
	}

	public function testScriptArray(){
		if(count($this->info->scriptFiles()) > 0){
			$this->assertTrue($this->info->initializeScripts());
		}
	}
}
