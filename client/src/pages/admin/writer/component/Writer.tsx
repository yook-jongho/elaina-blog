import React, { createElement, useEffect, useRef } from 'react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import styles from 'src/styles/MarkdownStyles.module.css';
import gfm from 'remark-gfm';

const Editor = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '500px',
  fontFamily: "'Nanum Gothic', sans-serif",
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  outline: 'none',
  padding: '.5rem',
  border: '1px solid #888',
  borderRadius: '12px',
  '&::after': {
    display: 'block',
    content: "''"
  }
});

const Paragraph = styled.p({
  display: 'inline-block',
  width: '100%'
});

const ParagraphContent = styled.span({
  display: 'inline-block',
  height: '100%',
  '&::after': {
    content: "'\\200B'"
  }
});

function Text(props: { children?: string }) {
  return (
    <Paragraph>
      <ParagraphContent>{props.children}</ParagraphContent>
    </Paragraph>
  );
}

interface Props {}

export function Writer(props: Props) {
  const editor = useRef<HTMLDivElement>(null);
  const [initlizedP, setInitilizedP] = useState<Node>();
  const [initilizedSpan, setInitilizedSpan] = useState<Node>();
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (editor.current?.firstChild?.firstChild) {
      setInitilizedP(editor.current.firstChild);
      setInitilizedSpan(editor.current.firstChild.firstChild);
    }
  }, []);

  useEffect(() => {
    // const lastParagraph = editor.current?.lastChild;
    // if (lastParagraph?.firstChild?.nodeName === 'BR') {
    //   if (initilizedSpan) {
    //     lastParagraph.firstChild.remove();
    //     initilizedSpan.textContent = '';
    //     lastParagraph.appendChild(initilizedSpan);
    //   }
    // }
    // console.log('useEffect');
    // if (editor.current?.lastChild?.firstChild?.nodeName === 'BR') {
    //   editor.current?.lastChild?.firstChild.remove();
    //   console.log(initilizedSpan);
    //   initilizedSpan.textContent = '';
    //   editor.current?.lastChild?.appendChild(initilizedSpan);
    // } else if (editor.current?.childNodes[editor.current?.childNodes.length - 2]?.firstChild?.nodeName === 'BR') {
    //   editor.current?.childNodes[editor.current?.childNodes.length - 2].firstChild?.remove();
    //   console.log(initilizedSpan);
    //   initilizedSpan.textContent = '';
    //   editor.current?.childNodes[editor.current?.childNodes.length - 2].firstChild?.appendChild(initilizedSpan);
    // }
  }, [editor.current?.lastChild?.firstChild, editor.current?.childNodes[editor.current?.childNodes.length - 2], initilizedSpan]);

  function paste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();

    const clipboardData = e.clipboardData.getData('text/plain');
    const splitedData = clipboardData.split('\n');

    const selection: Selection = window.getSelection();
    const isOncePaste: boolean = splitedData.length === 1 ? true : false;
    const selectionRange: Range = selection?.getRangeAt(0);
    const anchorNode: Node = selection.anchorNode;
    const focusNode: Node = selection.focusNode;
    let lastEndText: string = '';

    // 처음부터 붙여넣기 하는 경우 SPAN의 firstChildNode가 없어서 예외처리
    if (focusNode?.nodeName === 'SPAN') {
      const textNode = document.createTextNode(splitedData[0]);
      focusNode.appendChild(textNode);
      selectionRange.setStart(textNode, splitedData[0].length);
    } else {
      const anchorOffset = selection.anchorOffset;
      const focusOffset = selection.focusOffset;
      const focusText = focusNode?.textContent;

      if (anchorNode === focusNode) {
        const startOffset = anchorOffset < focusOffset ? anchorOffset : focusOffset;
        const endOffset = anchorOffset > focusOffset ? anchorOffset : focusOffset;
        const startText = focusText?.slice(0, startOffset);
        const endText = focusText?.slice(endOffset, focusText.length);

        if (isOncePaste) {
          focusNode.textContent = `${startText}${splitedData[0]}${endText}`;
          selectionRange.setStart(focusNode, startOffset + splitedData[0].length);
        } else {
          focusNode.textContent = `${startText}${splitedData[0]}`;
          lastEndText = endText;
        }
      } else {
        const editorChildNodes: Array<ChildNode> = [];
        let startNode, endNode;

        // Selection된 영역의 노드 시작지점 및 끝나는 지점 구하기
        for (let editorChildNode of editor.current.childNodes) {
          if (startNode) {
            editorChildNodes.push(editorChildNode);
          }

          if (editorChildNode === anchorNode.parentNode.parentNode || editorChildNode === focusNode?.parentNode?.parentNode) {
            if (startNode === undefined) {
              startNode = editorChildNode;
              editorChildNodes.push(editorChildNode);
            } else {
              endNode = editorChildNode;
              break;
            }
          }
        }

        let startOffset;
        let startText, endText;
        if (startNode === anchorNode.parentNode.parentNode) {
          startOffset = anchorOffset + splitedData[0].length;
          startText = startNode?.firstChild.textContent?.slice(0, anchorOffset);
          endText = endNode?.firstChild.textContent?.slice(focusOffset);
        } else {
          startOffset = focusOffset + splitedData[0].length;
          startText = startNode?.firstChild.textContent?.slice(0, focusOffset);
          endText = endNode?.firstChild.textContent?.slice(anchorOffset);
        }

        for (let editorChildNode of editorChildNodes) {
          if (editorChildNode !== startNode) {
            editorChildNode.remove();
          }
        }

        if (isOncePaste) {
          startNode.firstChild.textContent = `${startText}${splitedData[0]}${endText}`;
          selectionRange?.setStart(startNode.firstChild.firstChild, startOffset);
          selectionRange?.setEnd(startNode.firstChild.firstChild, startOffset);
        } else {
          lastEndText = endText;
          startNode.firstChild.textContent = `${startText}${splitedData[0]}`;
        }
      }
    }

    let focusNextNode: ChildNode;
    if (focusNode?.nodeName === 'SPAN') {
      focusNextNode = focusNode?.parentNode?.nextSibling;
    } else {
      focusNextNode = focusNode?.parentNode?.parentNode?.nextSibling;
    }

    for (let index = 1; index < splitedData.length; index++) {
      const targetData = splitedData[index];
      const textNode: Node = initlizedP.cloneNode(true);

      if (index === splitedData.length - 1) {
        textNode.firstChild.textContent = `${targetData}${lastEndText}`;
      } else {
        textNode.firstChild.textContent = targetData;
      }

      editor.current.insertBefore(textNode, focusNextNode);

      if (index === splitedData.length - 1) {
        selectionRange.setStart(textNode.firstChild?.firstChild, targetData.length);
      } else {
        focusNextNode = textNode?.nextSibling;
      }
    }

    parseTextContent();
  }

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Backspace') {
      if (text.length <= 1) {
        if (editor.current?.firstChild?.firstChild) {
          e.preventDefault();
          setText('');
          editor.current.firstChild.firstChild.textContent = '';
        }
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      // console.log('enter');
      // document.execCommand('insertHTML', false, '<br></br>');
      const selection = window.getSelection();
      const anchorNode = selection?.anchorNode;
      initilizedSpan.textContent = '';
      initlizedP?.appendChild(initilizedSpan);
      const paragraph = initlizedP;
      // // const element = React.createElement(Text, { children: '' });
      console.log(anchorNode?.nodeName);
      if (anchorNode?.nodeName === 'SPAN' || 'P') {
        editor.current?.append(paragraph?.cloneNode(true));
      } else {
        // initilizedSpan.textContent = '';
        // initlizedP?.appendChild(initilizedSpan);
        // const paragraph = initlizedP;
        // console.log(paragraph);
        // insertAfter(paragraph, anchorNode?.parentNode);
      }
    }
  }

  function parseTextContent() {
    if (editor.current !== null) {
      setText(editor.current.innerText.replaceAll('\n\n', '  \n').replaceAll('\n  \n', '\n&#8203;  \n').replaceAll('\n\n', '\n'));
    }
  }

  function insertAfter(newNode: Node, referenceNode: Node) {
    console.log('before', referenceNode.parentNode?.childNodes);
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    console.log('after', referenceNode.parentNode?.childNodes);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Editor
        ref={editor}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onPaste={paste}
        onKeyDown={keyDown}
        onInput={parseTextContent}
      >
        <Text></Text>
      </Editor>
      <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column' }}>
        <ReactMarkdown plugins={[gfm]} className={styles['markdown-body']} children={text}></ReactMarkdown>
      </div>
    </div>
  );
}
