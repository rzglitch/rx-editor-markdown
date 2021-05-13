<?php
/**
 * @class  markdown_helperController
 * @author rzglitch
 * @brief  Controller class of the Markdown Helper module
 */

class markdown_helperController extends markdown_helper {
	function triggerDeleteMarkdown(&$obj)
	{
		$args = new stdClass();

		$oMarkdown_HelperModel = getModel('markdown_helper');
		$find_var = $oMarkdown_HelperModel->getSrls();

		$args->target_srl = $obj->$find_var;

		$query = executeQuery('markdown_helper.getDocument', $args);
		$data = $query->data;

		if ($data->target_srl) {
			$oDB = DB::getInstance();
			$oDB->begin();

			$output = executeQuery('markdown_helper.deleteDocument', $args);

			$oDB->commit();
		}

		return;
	}

	function triggerInsertMarkdown(&$obj)
	{
		$args = new stdClass();

		$oMarkdown_HelperModel = getModel('markdown_helper');
		$find_var = $oMarkdown_HelperModel->getSrls();

		$args->target_srl = $obj->$find_var;

		$query = executeQuery('markdown_helper.getDocument', $args);
		$data = $query->data;

		$args->content = Context::get('markdown_content');

		if (!$data->target_srl) {
			$args->m_helper_srl = getNextSequence();

			$oDB = DB::getInstance();
			$oDB->begin();

			$output = executeQuery('markdown_helper.insertDocument', $args);

			$oDB->commit();
		} else {
			$oDB = DB::getInstance();
			$oDB->begin();

			$output = executeQuery('markdown_helper.updateDocument', $args);

			$oDB->commit();
		}

		return;
	}

	function triggerUpdateMarkdown(&$obj)
	{
		return $this->triggerInsertMarkdown($obj);
	}
}
