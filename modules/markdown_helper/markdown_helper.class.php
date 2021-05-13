<?php
/**
 * @class  markdown_helper
 * @author rzglitch
 * @brief  Main class of the Markdown Helper module
 */

class markdown_helper extends ModuleObject
{
	private $triggers = null;

	/**
	 * @brief Install module
	 */
	function moduleInstall()
	{
		$oModuleModel = getModel('module');
		$oModuleController = getController('module');

		$oMarkdown_HelperModel = getModel('markdown_helper');
		$this->triggers = $oMarkdown_HelperModel->getConfig('triggers');

		foreach ($this->triggers as $trigger)
		{
			$oModuleController->insertTrigger($trigger[0], $trigger[1], $trigger[2], $trigger[3], $trigger[4]);
		}
		return new BaseObject();
	}

	/**
	 * @brief Check update
	 */
	function checkUpdate()
	{
		$oModuleModel = getModel('module');

		$oMarkdown_HelperModel = getModel('markdown_helper');
		$this->triggers = $oMarkdown_HelperModel->getConfig('triggers');

		foreach ($this->triggers as $trigger)
		{
			if (!$oModuleModel->getTrigger($trigger[0], $trigger[1], $trigger[2], $trigger[3], $trigger[4]))
			{
				return true;
			}
		}

		return false;
	}

	/**
	 * @brief Module update
	 */
	function moduleUpdate()
	{
		$oModuleModel = getModel('module');
		$oModuleController = getController('module');

		$oMarkdown_HelperModel = getModel('markdown_helper');
		$this->triggers = $oMarkdown_HelperModel->getConfig('triggers');

		foreach ($this->triggers as $trigger)
		{
			if (!$oModuleModel->getTrigger($trigger[0], $trigger[1], $trigger[2], $trigger[3], $trigger[4]))
			{
				$oModuleController->insertTrigger($trigger[0], $trigger[1], $trigger[2], $trigger[3], $trigger[4]);
			}
		}
		return new BaseObject(0, 'success_updated');
	}

	/**
	 * @brief Recompile cache
	 */
	function recompileCache()
	{
	}

}
?>
