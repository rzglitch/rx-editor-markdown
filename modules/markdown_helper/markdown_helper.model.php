<?php
/**
 * @class  markdown_helperModel
 * @author rzglitch
 * @brief  Model class of the Markdown Helper module
 */

class markdown_helperModel extends markdown_helper {
	function init() {

	}

	function getConfig($k)
	{
		$path = \RX_BASEDIR . 'modules/markdown_helper/config.json';

		if (!Rhymix\Framework\Storage::isFile($path)) return null;

		$file = Rhymix\Framework\Storage::read($path);
		$data = json_decode($file, true);

		return $data[$k];
	}

	function getSrls()
	{
		$primary_key = Context::get('editor_primary_key');

		$config = $this->getConfig('srls');

		foreach ($config as $v) {
			if ($v == $primary_key) {
				return $v;
			}
		}

		return false;
	}

	function getMarkdownData()
	{
		if(!checkCSRF())
		{
			return new BaseObject(-1, 'msg_security_violation');
		}

		$srl = (integer) Context::get('target_srl');

		$args = new stdClass();

		$args->target_srl = $srl;
		$query = executeQuery('markdown_helper.getDocument', $args);
		$data = $query->data;

		if ($data->target_srl)
		{
			$args->content = $data->content;

			$this->add('target_srl', $srl);
			$this->add('content', $args->content);
		}
		else
		{
			$this->add('target_srl', $srl);
			$this->add('content', null);
		}
	}
}
