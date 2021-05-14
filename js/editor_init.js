function rgMdEditor() {
	this.id = null;
	this.height = "500px";
	this.previewEnabled = false;
	this.init = function (id) {
		if (this.id) {
			console.error("This MdEditor has already been initialized.");
			return false;
		}
		this.id = id;
		var self = this;
		var editor_body = this.id + " .rg_mde_body";
		var preview_parent = id + " .markdown-data";
		var code = id + " .rg_mde_code";
		var html_data =
			"PGRpdiBjbGFzcz0icmdfbWRlX3dyYXAiPgogIDxkaXYgY2xhc3M9InJnX21kZV90b29sYmFyIj4KICAgIDx1bD4KICAgICAgPGxpPjxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0icmdfbWRlX3RiX2JvbGQiPjxiPkI8L2I+PC9idXR0b24+PC9saT4KICAgICAgPGxpPjxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0icmdfbWRlX3RiX2l0YWxpYyI+PGk+aTwvaT48L2J1dHRvbj48L2xpPgogICAgICA8bGk+PGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJyZ19tZGVfdGJfbGluayI+PHU+bGluazwvdT48L2J1dHRvbj48L2xpPgogICAgICA8bGk+PGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJyZ19tZGVfdGJfaW1hZ2UiPmltYWdlPC9idXR0b24+PC9saT4KICAgICAgPGxpPjxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0icmdfbWRlX3RiX3ByZXZpZXciPlByZXZpZXc8L2J1dHRvbj48L2xpPgogICAgPC91bD4KICA8L2Rpdj4KICA8ZGl2IGNsYXNzPSJyZ19tZGVfYm9keSI+CiAgICA8ZGl2IGNsYXNzPSJtYXJrZG93bi1jb2RlIj4KICAgICAgPHRleHRhcmVhIGNsYXNzPSJyZ19tZGVfY29kZSI+PC90ZXh0YXJlYT4KICAgIDwvZGl2PgogICAgPGRpdiBjbGFzcz0ibWFya2Rvd24tZGF0YSI+CiAgICAgIDxwIGNsYXNzPSJwcmV2aWV3LW1vZGUtdGl0bGUiPlByZXZpZXcgTW9kZTwvcD4KICAgICAgPGRpdiBjbGFzcz0icmdfbWRlX3ByZXZpZXciPjwvZGl2PgogICAgPC9kaXY+CiAgPC9kaXY+CjwvZGl2Pg==";
		var tpl = window.atob(html_data);
		$(id).html(tpl);
		$(preview_parent).hide();

		var el_bold = id + " .rg_mde_tb_bold";
		var el_italic = id + " .rg_mde_tb_italic";
		var el_link = id + " .rg_mde_tb_link";
		var el_image = id + " .rg_mde_tb_image";
		var el_preview = id + " .rg_mde_tb_preview";

		var input_forms = {
			bold: "**{$1}**",
			italic: "*{$1}*",
			link: "[text]({$1})",
			image: "![alt]({$1})"
		};

		var input_buttons = [el_bold, el_italic, el_link, el_image];

		$(function () {
			$(input_buttons.join(", ")).click(function () {
				var my_class = $(this).attr("class");
				my_class = my_class.replace("rg_mde_tb_", "");
				var replaced = input_forms[my_class];

				var selected_txt = self.getSelectedTxt(code);

				if (!selected_txt) {
					if (my_class == "link" || my_class == "image") {
						selected_txt = "https://example.com/example.jpg";
					} else {
						selected_txt = "text";
					}
				}

				var output = replaced.replace("{$1}", selected_txt);
				self.insertAtCursor(code, output);
			});
			$(el_preview).click(function () {
				var d = $(preview_parent).css("display");
				if (d == "none") {
					$(preview_parent).show();
					$(editor_body).css("height", "auto");
					self.renderMarkdownData();
					self.previewEnabled = true;
				} else if (d == "block") {
					$(preview_parent).hide();
					var height = self.getHeight();
					$(editor_body).css("height", height);
					self.previewEnabled = false;
				}
			});

			$(code).bind("keyup mouseup", function () {
				if (self.previewEnabled) self.renderMarkdownData();
			});
			$(code).on("keydown", function () {
				if (event.keyCode === 9) {
					var v = this.value,
						s = this.selectionStart,
						e = this.selectionEnd;
					this.value = v.substring(0, s) + "\t" + v.substring(e);
					this.selectionStart = this.selectionEnd = s + 1;
					return false;
				}
			});
		});
	};
	this.selectInitializedEditor = function(id) {
		if ($(id).find(".rg_mde_wrap")) {
			this.id = id;
		} else {
			console.error("MdEditor has not been initialized.");
		}
	};
	this.renderMarkdownData = function () {
		var preview = this.id + " .rg_mde_preview";
		var md = window.markdownit({
			html: true,
			highlight: function (str, lang) {
				if (lang && hljs.getLanguage(lang)) {
					try {
						return hljs.highlight(str, { language: lang }).value;
					} catch (__) {}
				}
				return "";
			},
		});
		var result = HtmlSanitizer.SanitizeHtml(md.render(this.getMarkdownText()));
		$(preview).html(result);
	};
	this.addPreviewClass = function (classname) {
		var preview = this.id + " .rg_mde_preview";
		$(preview).addClass(classname);
	};
	this.getHtmlText = function () {
		var html = this.id + " .rg_mde_preview";
		return $(html).html();
	};
	this.getMarkdownText = function () {
		var code = this.id + " .rg_mde_code";
		return $(code).val();
	};
	this.putText = function (data) {
		var code = this.id + " .rg_mde_code";
		this.insertAtCursor(code, data);
	};
	this.getSelectedTxt = function (el) {
		var txtarea = document.querySelector(el);
		var start = txtarea.selectionStart;
		var finish = txtarea.selectionEnd;
		var sel = txtarea.value.substring(start, finish);

		return sel;
	};
	this.setHeight = function (height) {
		var body = this.id + " .rg_mde_body";
		var code = this.id + " .rg_mde_body .markdown-code";

		this.editorHeight = height;

		$(body).css("height", height);
		$(code).css("height", height);
	};
	this.getHeight = function () {
		return this.editorHeight;
	};
	this.insertAtCursor = function (el, myValue) {
		var myField = document.querySelector(el);
		if (document.selection) {
			myField.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
		} else if (myField.selectionStart || myField.selectionStart == "0") {
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			myField.value =
				myField.value.substring(0, startPos) +
				myValue +
				myField.value.substring(endPos, myField.value.length);
		} else {
			myField.value += myValue;
		}
		if (self.previewEnabled) self.renderMarkdownData();
	};
	this.changeContent = function (data) {
		var code = this.id + " .rg_mde_code";
		$(code).val(data);
		if (self.previewEnabled) self.renderMarkdownData();
	};
}
