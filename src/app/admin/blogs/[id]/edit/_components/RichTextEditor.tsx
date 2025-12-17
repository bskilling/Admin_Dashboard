/* eslint-disable @typescript-eslint/no-explicit-any */
// components/blog/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { useState, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  // For adding links
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);

  // For adding images
  const [imageUrl, setImageUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  // For adding tables
  const [tableSize, setTableSize] = useState({ rows: 3, cols: 3 });
  const [showTableModal, setShowTableModal] = useState(false);

  const setLink = useCallback(() => {
    // Empty input
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkModal(false);
      return;
    }

    // Add https:// if it doesn't start with a protocol
    const url =
      linkUrl.startsWith('http://') || linkUrl.startsWith('https://')
        ? linkUrl
        : `https://${linkUrl}`;

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();

    // Reset and close modal
    setLinkUrl('');
    setShowLinkModal(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!imageUrl) {
      setShowImageModal(false);
      return;
    }

    // Add image
    editor.chain().focus().setImage({ src: imageUrl }).run();

    // Reset and close modal
    setImageUrl('');
    setShowImageModal(false);
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: tableSize.rows,
        cols: tableSize.cols,
        withHeaderRow: true,
      })
      .run();

    // Reset and close modal
    setTableSize({ rows: 3, cols: 3 });
    setShowTableModal(false);
  }, [editor, tableSize]);

  // Prevent default to avoid form submission when clicking buttons
  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    callback();
  };
  if (!editor) {
    return null;
  }
  return (
    <div className="border border-gray-300 rounded-t-lg">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
        {/* Text formatting */}
        <div className="flex gap-1 mr-2">
          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleBold().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Bold"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 12h8a4 4 0 0 0 0-8H6v8zm0 0h10a4 4 0 0 1 0 8H6v-8z"
              />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Italic"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="19" y1="4" x2="10" y2="4" strokeWidth="2" strokeLinecap="round" />
              <line x1="14" y1="20" x2="5" y2="20" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="4" x2="9" y2="20" strokeWidth="2" />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleStrike().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Strikethrough"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 12h12M9 8h3a2 2 0 0 1 2 2v.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 16h3a2 2 0 0 0 2-2v-.5"
              />
            </svg>
          </button>
        </div>

        <div className="border-r border-gray-300 h-8 mx-1"></div>

        {/* Headings */}
        <div className="flex gap-1 mr-2">
          <button
            onClick={handleButtonClick(() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            )}
            className={`px-2 h-8 flex items-center justify-center rounded ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Heading 1"
            type="button"
          >
            H1
          </button>

          <button
            onClick={handleButtonClick(() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            )}
            className={`px-2 h-8 flex items-center justify-center rounded ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Heading 2"
            type="button"
          >
            H2
          </button>

          <button
            onClick={handleButtonClick(() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            )}
            className={`px-2 h-8 flex items-center justify-center rounded ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Heading 3"
            type="button"
          >
            H3
          </button>
        </div>

        <div className="border-r border-gray-300 h-8 mx-1"></div>

        {/* Lists */}
        <div className="flex gap-1 mr-2">
          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleBulletList().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Bullet List"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="9" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round" />
              <circle cx="4" cy="6" r="2" strokeWidth="2" />
              <circle cx="4" cy="12" r="2" strokeWidth="2" />
              <circle cx="4" cy="18" r="2" strokeWidth="2" />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleOrderedList().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Ordered List"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="10" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 6h1v4" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 10h2" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="border-r border-gray-300 h-8 mx-1"></div>

        {/* Alignment */}
        <div className="flex gap-1 mr-2">
          <button
            onClick={handleButtonClick(() => editor.chain().focus().setTextAlign('left').run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Align Left"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="12" x2="14" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="18" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().setTextAlign('center').run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Align Center"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="18" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().setTextAlign('right').run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Align Right"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-r border-gray-300 h-8 mx-1"></div>

        {/* Block elements */}
        <div className="flex gap-1 mr-2">
          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleBlockquote().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Blockquote"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path
                d="M17.57 4.02c-1.93 0-3.5 1.57-3.5 3.5 0 1.58 1.06 2.93 2.5 3.37-.45 3.28-2.67 5.52-5.5 6.18.88.37 1.85.57 2.85.57 3.91 0 7.08-3.17 7.08-7.08 0-3.55-2.61-6.54-6.08-6.54z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M7.57 4.02c-1.93 0-3.5 1.57-3.5 3.5 0 1.58 1.06 2.93 2.5 3.37-.45 3.28-2.67 5.52-5.5 6.18.88.37 1.85.57 2.85.57 3.91 0 7.08-3.17 7.08-7.08 0-3.55-2.61-6.54-6.08-6.54z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().toggleCodeBlock().run())}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('codeBlock') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Code Block"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <polyline
                points="16 18 22 12 16 6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="8 6 2 12 8 18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => editor.chain().focus().setHorizontalRule().run())}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
            title="Horizontal Rule"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-r border-gray-300 h-8 mx-1"></div>

        {/* Special elements */}
        <div className="flex gap-1">
          <button
            onClick={handleButtonClick(() => setShowLinkModal(true))}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="Add Link"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => setShowImageModal(true))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
            title="Add Image"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="21 15 16 10 5 21"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleButtonClick(() => setShowTableModal(true))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
            title="Add Table"
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
              <line x1="3" y1="15" x2="21" y2="15" strokeWidth="2" />
              <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2" />
              <line x1="15" y1="3" x2="15" y2="21" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="absolute z-10 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add Link</h3>
          <div className="mb-3">
            <input
              type="text"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border rounded-lg"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleButtonClick(() => setShowLinkModal(false))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleButtonClick(setLink)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="absolute z-10 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add Image</h3>
          <div className="mb-3">
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-lg"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleButtonClick(() => setShowImageModal(false))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleButtonClick(addImage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="absolute z-10 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add Table</h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tableSize.rows}
                onChange={e =>
                  setTableSize({
                    ...tableSize,
                    rows: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tableSize.cols}
                onChange={e =>
                  setTableSize({
                    ...tableSize,
                    cols: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleButtonClick(() => setShowTableModal(false))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleButtonClick(addTable)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
  onSubmit,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-sans font-bold my-6 first:mt-0',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside mb-4 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside mb-4 space-y-1',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-6 border-gray-300',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full my-6',
        },
      }),
      Table.configure({
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-6',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-200',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2 bg-gray-100 font-bold',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-md p-4 font-mono text-sm my-6',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-100 p-1 rounded',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when content prop changes (e.g. when editing existing content)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Prevent form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="relative" onSubmit={handleSubmit}>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-blue max-w-none min-h-[300px] border border-gray-300 border-t-0 rounded-b-lg p-4 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:space-y-0"
      />
    </div>
  );
};

export default RichTextEditor;
