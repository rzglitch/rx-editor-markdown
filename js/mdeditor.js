"use strict";

(function ($) {
	// Convert YouTube links.
	var convertYouTube = function (str) {
		var regexp = /https?:\/\/(www\.youtube(?:-nocookie)?\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)\S*/g;
		var embed =
			'<div class="video_container"><iframe src="https://www.youtube.com/embed/$2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
		return String(str).replace(regexp, embed);
	};

	// Insert content at cursor position.
	var insertContent = function(editor, content) {
		var insert_form = $(editor.id).closest("form");
		var markdown_input = insert_form
				.find("input,textarea")
				.filter("[name=markdown_content]");
		editor.putText(content);
		var mdcontent = editor.getMarkdownText();
		markdown_input.val(mdcontent);
	};

	// Page load event handler.
	$(function () {
		$(".mdeditor").each(function () {
			var editor = $(this);
			var editor_sequence = editor.data("editor-sequence");
			var content_key = editor.data("editor-content-key-name");
			var primary_key = editor.data("editor-primary-key-name");
			var insert_form = editor.closest("form");
			var content_input = insert_form
				.find("input,textarea")
				.filter("[name=" + content_key + "]");
			var markdown_input = insert_form
				.find("input,textarea")
				.filter("[name=markdown_content]");
			var editor_height = editor.data("editor-height");
			var editor_wrap = "#mdeditor_" + editor_sequence;
			var editor_textarea = editor_wrap + " .rg_mde_code";

			var where = null;
			var target = insert_form
				.find("input,textarea")
				.filter("[name=" + primary_key + "]");

			var params = {
				where: where,
				target_srl: target.val(),
			};
			var md_editor = new rgMdEditor();
			md_editor.init(editor_wrap);
			md_editor.addPreviewClass("rhymix_content");

			exec_json(
				"markdown_helper.getMarkdownData",
				params,
				function (data) {
					var markdown_data;
					if (!data.content) {
						if (content_input.val()) {
							markdown_data = content_input.val();
						} else {
							markdown_data = "";
						}
					} else {
						markdown_data = data.content;
					}

					markdown_input.val(markdown_data);

					md_editor.setHeight(editor_height + "px");
					var content = markdown_input.val();
					if (content) {
						md_editor.changeContent(markdown_input.val());
					}
				}
			);

			// Clean up pasted content.
			$(editor_textarea).on("paste", function (event) {
				var clipboard_data =
					event.clipboardData ||
					window.clipboardData ||
					event.originalEvent.clipboardData;
				if (typeof clipboard_data !== "undefined") {
					var content = clipboard_data.getData("text");
				} else {
					return;
				}
				content = convertYouTube(content);
				insertContent(md_editor, content);
				event.preventDefault();
			});

			// Copy edited content to the actual input element.
			editor.on("mouseout change", function (event) {
				md_editor.renderMarkdownData();
				var content = md_editor.getHtmlText();
				content_input.val(content);
				var mdcontent = md_editor.getMarkdownText();
				markdown_input.val(mdcontent);
				event.preventDefault();
			});
		});
	});

	// Simulate CKEditor for file upload integration.
	window._getCkeInstance = function (editor_sequence) {
		var md_editor = "#mdeditor_" + editor_sequence;
		var editor_obj = new rgMdEditor();
		editor_obj.selectInitializedEditor(md_editor);

		var turndownService = new TurndownService();

		return {
			getData: function () {
				return editor_obj.getMarkdownText();
			},
			setData: function (content) {
				editor_obj.changeContent(content);
			},
			insertHtml: function (content) {
				var conv_markdown = turndownService.turndown(content);
				conv_markdown += "\n"
				insertContent(editor_obj, conv_markdown);
			},
		};
	};
})(jQuery);
