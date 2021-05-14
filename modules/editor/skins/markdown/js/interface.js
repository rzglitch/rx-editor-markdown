function _getSimpleEditorInstance(editor_sequence) {
	var md_editor = "#mdeditor_" + editor_sequence;
	var editor_obj = new rgMdEditor();
	editor_obj.selectInitializedEditor(md_editor);

	return editor_obj;
}

function editorGetContent(editor_sequence) {
	return _getSimpleEditorInstance(editor_sequence).getMarkdownText().escape();
}

function editorReplaceHTML(iframe_obj, content) {
	var editor_sequence = parseInt(iframe_obj.id.replace(/^.*_/, ''), 10);
	_getSimpleEditorInstance(editor_sequence).changeContent(content);
}

function editorGetIFrame(editor_sequence) {
	var editor = _getSimpleEditorInstance(editor_sequence);
	return $(editor.id).find(".rg_mde_code").get(0);
}
