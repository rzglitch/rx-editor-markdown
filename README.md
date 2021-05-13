# rx-editor-markdown

본 에디터는 라이믹스에서 마크다운을 사용할 수 있도록 하는 에디터입니다.

반드시 마크다운 헬퍼와 함께 사용하셔야 합니다.

라이믹스 코어 파일을 건드리지 않습니다.

## 설치

1. `modules/markdown_helper/config.json.example` 파일을 같은 폴더 내에 복사하고 파일명을 `config.json`으로 하세요.
2. modules 폴더를 라이믹스가 설치된 폴더에 넣으세요.

## config.json 설정 방법

문서/댓글 외의 다른 곳에 마크다운 에디터를 사용하려면 config.json 파일을 수정해야 합니다.
```
{
  "srls": ["document_srl", "comment_srl", "new_srl", "new srl2", ...],
  "triggers": [
    ...
    [
      "test.testDeleteAction",
      "markdown_helper",
      "controller",
      "triggerDeleteMarkdown",
      "after"
    ],
    [
      "test.testInsertAction",
      "markdown_helper",
      "controller",
      "triggerInsertMarkdown",
      "after"
    ],
    [
      "test.testUpdateAction",
      "markdown_helper",
      "controller",
      "triggerUpdateMarkdown",
      "after"
    ]
  ]
}
```

`srls` 항목에는 각 게시물의 번호를 부여하는 srl 변수 이름을 넣고, `triggers` 항목에 Delete/Insert/Update 에 해당하는 trigger 액션을 넣으세요.

위 예시의 `test.test~~~Action`에는 각각 해당하는 trigger의 이름을 넣으면 됩니다.

## 라이선스

본 에디터와 마크다운 헬퍼 모듈은 GNU GPL v2 라이선스의 적용을 받는 자유 소프트웨어(free software)입니다.
