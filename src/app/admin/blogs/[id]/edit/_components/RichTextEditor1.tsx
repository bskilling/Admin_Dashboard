/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Table,
  Grid,
  Eye,
  Upload,
  X,
  AlertCircle,
  Loader,
} from 'lucide-react';

// Type definitions
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (imageUrl: string) => void;
  userId: string;
}

interface TableCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (html: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
}

interface ActiveFormats {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  justifyLeft?: boolean;
  justifyCenter?: boolean;
  justifyRight?: boolean;
  insertUnorderedList?: boolean;
  insertOrderedList?: boolean;
}

// cn utility function
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Enhanced Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn('bg-white rounded-lg shadow-xl max-w-md w-full mx-4', className)}>
        {children}
      </div>
    </div>
  );
};

// Proper Image Uploader Component
const ImageUploader: React.FC<ImageUploaderProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  userId,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file: File): string | null => {
    const maxFileSize = 5; // 5MB
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Image size exceeds ${maxFileSize}MB limit`;
    }
    if (!acceptedTypes.includes(file.type)) {
      return `Only ${acceptedTypes.join(', ')} files are allowed`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<void> => {
    console.log('Starting upload for file:', file.name, file.size, file.type);
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'IMAGE');
      formData.append('userId', userId);
      formData.append('isPublic', 'true');

      console.log('Sending request to /api/files...');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorData: { error?: string } = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        console.error('Upload failed with error:', errorData);
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      if (result.success) {
        onUploadSuccess(result.fileUrl);
        onClose();
        console.log('Upload successful!');
      } else {
        throw new Error(result.error || 'Upload failed - no success flag');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      console.log('Upload process finished, setting loading to false');
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      uploadFile(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p className="text-gray-600 text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="mb-4 text-gray-600 font-medium">Click to upload or drag image here</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Modal>
  );
};

// Table Creator Component
const TableCreator: React.FC<TableCreatorProps> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);

  const createTable = (): void => {
    // Create table using React elements and convert to HTML string
    const tableElement = document.createElement('div');
    tableElement.className = 'my-6';

    const table = document.createElement('table');
    table.className = 'w-full border-collapse border border-gray-300 rounded-lg overflow-hidden';

    // Create thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'bg-gray-50';

    for (let j = 0; j < cols; j++) {
      const th = document.createElement('th');
      th.className = 'border border-gray-300 px-4 py-2 font-semibold text-left text-gray-900';
      th.textContent = `Header ${j + 1}`;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody
    const tbody = document.createElement('tbody');
    for (let i = 0; i < rows; i++) {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';

      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.className = 'border border-gray-300 px-4 py-2 text-gray-700';
        td.textContent = `Cell ${i + 1},${j + 1}`;
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableElement.appendChild(table);

    onInsert(tableElement.outerHTML);
    onClose();
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRows(parseInt(e.target.value) || 1);
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCols(parseInt(e.target.value) || 1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Insert Table</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
            <input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={handleRowsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
            <input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={handleColsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={createTable}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Create Table
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Main Rich Text Editor Component
const RichTextEditor = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) => {
  //   const [content, setContent] = useState<string>("");
  const [showImageUploader, setShowImageUploader] = useState<boolean>(false);
  const [showTableCreator, setShowTableCreator] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({});
  const [currentFormat, setCurrentFormat] = useState<string>('p');
  const editorRef = useRef<HTMLDivElement>(null);

  // Modern approach: Apply styles using Tailwind classes
  const applyFormat = (format: string): void => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || isPreviewMode) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      let wrapper: HTMLElement;
      switch (format) {
        case 'bold':
          wrapper = document.createElement('strong');
          wrapper.className = 'font-bold';
          break;
        case 'italic':
          wrapper = document.createElement('em');
          wrapper.className = 'italic';
          break;
        case 'underline':
          wrapper = document.createElement('u');
          wrapper.className = 'underline';
          break;
        default:
          return;
      }

      try {
        range.deleteContents();
        wrapper.textContent = selectedText;
        range.insertNode(wrapper);
        range.selectNodeContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(range);
        updateContent();
        checkActiveFormats();
      } catch (error) {
        console.warn('Error applying format:', error);
      }
    }
  };

  // Apply block format (headings, paragraphs, etc.)
  const applyBlockFormat = (format: string): void => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || isPreviewMode) return;

    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
      // @ts-expect-error nodeType
      element = element.parentElement;
    }

    // Find the closest block element
    while (
      element &&
      element !== editorRef.current &&
      !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'DIV'].includes(
        (element as HTMLElement).tagName
      )
    ) {
      // @ts-expect-error nodeType
      element = element.parentElement;
    }

    if (element && element !== editorRef.current) {
      const newElement = document.createElement(format.toUpperCase());

      // Apply Tailwind classes based on format
      switch (format) {
        case 'h1':
          newElement.className = 'text-4xl font-bold text-gray-900 mt-8 mb-4 leading-tight';
          break;
        case 'h2':
          newElement.className = 'text-3xl font-bold text-gray-800 mt-6 mb-3 leading-snug';
          break;
        case 'h3':
          newElement.className = 'text-2xl font-bold text-gray-700 mt-5 mb-2 leading-snug';
          break;
        case 'h4':
          newElement.className = 'text-xl font-bold text-gray-600 mt-4 mb-2 leading-snug';
          break;
        case 'h5':
          newElement.className = 'text-lg font-bold text-gray-600 mt-3 mb-2 leading-normal';
          break;
        case 'h6':
          newElement.className = 'text-base font-bold text-gray-600 mt-3 mb-2 leading-normal';
          break;
        case 'blockquote':
          newElement.className =
            'border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r-md';
          break;
        case 'p':
        default:
          newElement.className = 'text-gray-700 leading-relaxed my-3';
          break;
      }

      newElement.innerHTML = (element as HTMLElement).innerHTML;
      element.parentNode?.replaceChild(newElement, element);
      setCurrentFormat(format);
      updateContent();
    }
  };

  // Apply alignment
  const applyAlignment = (alignment: string): void => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || isPreviewMode) return;

    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
      // @ts-expect-error nodeType
      element = element.parentElement;
    }

    // Find the closest block element
    while (
      element &&
      element !== editorRef.current &&
      !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'DIV'].includes(
        (element as HTMLElement).tagName
      )
    ) {
      // @ts-expect-error nodeType
      element = element.parentElement;
    }

    if (element && element !== editorRef.current) {
      const htmlElement = element as HTMLElement;
      // Remove existing alignment classes
      htmlElement.className = htmlElement.className.replace(/text-(left|center|right)/g, '');

      // Add new alignment class
      const alignmentClass =
        alignment === 'left' ? 'text-left' : alignment === 'center' ? 'text-center' : 'text-right';
      htmlElement.className = cn(htmlElement.className, alignmentClass);

      updateContent();
      checkActiveFormats();
    }
  };

  // Apply list format
  const applyListFormat = (listType: string): void => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || isPreviewMode) return;

    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
      // @ts-expect-error nodeType
      element = element.parentElement;
    }

    // Check if we're already in a list
    const existingList = (element as HTMLElement).closest('ul, ol');

    if (existingList) {
      // Convert existing list or remove list formatting
      const listItems = Array.from(existingList.children);
      const fragment = document.createDocumentFragment();

      listItems.forEach(li => {
        const p = document.createElement('p');
        p.className = 'text-gray-700 leading-relaxed my-3';
        p.innerHTML = li.innerHTML;
        fragment.appendChild(p);
      });

      existingList.parentNode?.replaceChild(fragment, existingList);
    } else {
      // Create new list
      const listElement = document.createElement(listType === 'ordered' ? 'ol' : 'ul');
      listElement.className =
        listType === 'ordered'
          ? 'list-decimal list-inside my-4 space-y-1 text-gray-700'
          : 'list-disc list-inside my-4 space-y-1 text-gray-700';

      const li = document.createElement('li');
      li.className = 'leading-relaxed';

      if (range.toString()) {
        li.textContent = range.toString();
        range.deleteContents();
      } else {
        li.textContent = 'List item';
      }

      listElement.appendChild(li);
      range.insertNode(listElement);
    }

    updateContent();
    checkActiveFormats();
  };

  // Check active formatting
  const checkActiveFormats = useCallback((): void => {
    if (!editorRef.current || isPreviewMode) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
      // @ts-expect-error nodeType
      element = element.parentElement;
    }

    const htmlElement = element as HTMLElement;

    const formats: ActiveFormats = {
      bold: !!htmlElement.closest('strong, b'),
      italic: !!htmlElement.closest('em, i'),
      underline: !!htmlElement.closest('u'),
      justifyLeft: htmlElement.closest('[class*="text-left"]') !== null,
      justifyCenter: htmlElement.closest('[class*="text-center"]') !== null,
      justifyRight: htmlElement.closest('[class*="text-right"]') !== null,
      insertUnorderedList: !!htmlElement.closest('ul'),
      insertOrderedList: !!htmlElement.closest('ol'),
    };

    setActiveFormats(formats);

    // Update current format - improved detection
    const blockElement = htmlElement.closest(
      'h1, h2, h3, h4, h5, h6, p, blockquote, div'
    ) as HTMLElement;

    if (blockElement && blockElement !== editorRef.current) {
      const tagName = blockElement.tagName.toLowerCase();
      // Only update if it's a valid format option
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote'].includes(tagName)) {
        setCurrentFormat(tagName);
      } else {
        // If we're in a div or other container, default to paragraph
        setCurrentFormat('p');
      }
    } else {
      setCurrentFormat('p');
    }
  }, [isPreviewMode]);

  // Handle selection change to update active formats
  const handleSelectionChange = useCallback((): void => {
    if (!isPreviewMode) {
      setTimeout(checkActiveFormats, 10);
    }
  }, [checkActiveFormats, isPreviewMode]);

  // Insert HTML
  const insertHTML = (html: string): void => {
    if (!editorRef.current || isPreviewMode) return;

    try {
      editorRef.current.focus();

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }

        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.innerHTML += html;
      }

      updateContent();
    } catch (error) {
      console.warn('Error inserting HTML:', error);
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
      }
      updateContent();
    }
  };

  // Handle image upload success
  const handleImageUpload = (imageUrl: string): void => {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'my-6 text-center';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Uploaded image';
    img.className = 'inline-block rounded-lg shadow-md max-w-full h-auto';
    img.style.width = '300px';
    img.style.height = '200px';
    img.style.objectFit = 'cover';

    imageDiv.appendChild(img);
    insertHTML(imageDiv.outerHTML);
  };

  // Update content
  const updateContent = useCallback((): void => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
    }
  }, []);

  // Insert predefined layouts
  const insertGrid = (): void => {
    const gridDiv = document.createElement('div');
    gridDiv.className = 'my-6 p-4 border border-gray-200 rounded-lg';

    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-2 gap-4';

    // Column 1
    const col1 = document.createElement('div');
    col1.className = 'p-4 bg-gray-50 rounded-md';
    col1.innerHTML =
      '<h3 class="text-lg font-semibold text-gray-700 mb-2">Column 1</h3><p class="text-gray-600">Content for first column goes here...</p>';

    // Column 2
    const col2 = document.createElement('div');
    col2.className = 'p-4 bg-gray-50 rounded-md';
    col2.innerHTML =
      '<h3 class="text-lg font-semibold text-gray-700 mb-2">Column 2</h3><p class="text-gray-600">Content for second column goes here...</p>';

    gridContainer.appendChild(col1);
    gridContainer.appendChild(col2);
    gridDiv.appendChild(gridContainer);

    insertHTML(gridDiv.outerHTML);
  };

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current && !content) {
      const initialContent = `
        <h1 class="text-4xl font-bold text-gray-900 mt-8 mb-4 leading-tight">Welcome to Your Rich Text Editor</h1>
        <p class="text-gray-700 leading-relaxed my-3">Start typing here or use the toolbar above to format your content. You can add images, tables, grids, and more!</p>
        
        <h2 class="text-3xl font-bold text-gray-800 mt-6 mb-3 leading-snug">Features Include:</h2>
        <ul class="list-disc list-inside my-4 space-y-1 text-gray-700">
          <li class="leading-relaxed">All heading levels (H1-H6)</li>
          <li class="leading-relaxed">Text formatting (bold, italic, underline)</li>
          <li class="leading-relaxed">Lists and alignment</li>
          <li class="leading-relaxed">Image uploads with dimension control</li>
          <li class="leading-relaxed">Tables with full editing</li>
          <li class="leading-relaxed">Grid layouts and tab systems</li>
        </ul>
        
        <blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r-md">
          <p class="text-gray-700 leading-relaxed my-3">This editor focuses on simplicity and functionality!</p>
        </blockquote>
        
        <h3 class="text-2xl font-bold text-gray-700 mt-5 mb-2 leading-snug">Try the Features</h3>
        <p class="text-gray-700 leading-relaxed my-3">Select text and use the toolbar buttons, or use keyboard shortcuts like <strong class="font-bold">Ctrl+B</strong> for bold, <strong class="font-bold">Ctrl+I</strong> for italic, and <strong class="font-bold">Ctrl+U</strong> for underline.</p>
      `;
      editorRef.current.innerHTML = initialContent.trim();
      setContent(initialContent.trim());
      // Initialize format detection
      setTimeout(() => {
        checkActiveFormats();
      }, 100);
    }
  }, [checkActiveFormats]);

  // Update format detection when content changes
  useEffect(() => {
    if (content) {
      setTimeout(() => {
        checkActiveFormats();
      }, 10);
    }
  }, [content, checkActiveFormats]);

  // Add keyboard shortcuts and selection detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!editorRef.current?.contains(e.target as Node) || isPreviewMode) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            applyFormat('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormat('italic');
            break;
          case 'u':
            e.preventDefault();
            applyFormat('underline');
            break;
        }
      }
    };

    const handleSelectionChangeGlobal = (): void => {
      if (!isPreviewMode && editorRef.current?.contains(document.activeElement)) {
        setTimeout(checkActiveFormats, 10);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectionchange', handleSelectionChangeGlobal);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectionchange', handleSelectionChangeGlobal);
    };
  }, [isPreviewMode, checkActiveFormats]);

  // Toolbar button component
  const ToolbarButton: React.FC<ToolbarButtonProps> = ({
    onClick,
    icon: Icon,
    title,
    isActive = false,
    disabled = false,
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled || isPreviewMode}
      className={cn(
        'p-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        isActive
          ? 'bg-blue-100 text-blue-600 shadow-sm ring-1 ring-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    applyBlockFormat(e.target.value);
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard?.writeText(content);
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className="border-b border-gray-200 p-4 bg-gray-50/50">
          <div className="flex items-center space-x-1 flex-wrap gap-y-2">
            {/* Text Formatting */}
            <div className="flex items-center space-x-2 pr-3 border-r border-gray-200">
              <select
                value={currentFormat}
                onChange={handleFormatChange}
                disabled={isPreviewMode}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white min-w-[120px]"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
                <option value="blockquote">Quote</option>
              </select>

              <ToolbarButton
                onClick={() => applyFormat('bold')}
                icon={Bold}
                title="Bold (Ctrl+B)"
                isActive={activeFormats.bold}
              />
              <ToolbarButton
                onClick={() => applyFormat('italic')}
                icon={Italic}
                title="Italic (Ctrl+I)"
                isActive={activeFormats.italic}
              />
              <ToolbarButton
                onClick={() => applyFormat('underline')}
                icon={Underline}
                title="Underline (Ctrl+U)"
                isActive={activeFormats.underline}
              />
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
              <ToolbarButton
                onClick={() => applyAlignment('left')}
                icon={AlignLeft}
                title="Align Left"
                isActive={activeFormats.justifyLeft}
              />
              <ToolbarButton
                onClick={() => applyAlignment('center')}
                icon={AlignCenter}
                title="Align Center"
                isActive={activeFormats.justifyCenter}
              />
              <ToolbarButton
                onClick={() => applyAlignment('right')}
                icon={AlignRight}
                title="Align Right"
                isActive={activeFormats.justifyRight}
              />
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
              <ToolbarButton
                onClick={() => applyListFormat('unordered')}
                icon={List}
                title="Bullet List"
                isActive={activeFormats.insertUnorderedList}
              />
              <ToolbarButton
                onClick={() => applyListFormat('ordered')}
                icon={ListOrdered}
                title="Numbered List"
                isActive={activeFormats.insertOrderedList}
              />
            </div>

            {/* Media & Elements */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-200">
              <ToolbarButton
                onClick={() => setShowImageUploader(true)}
                icon={Image}
                title="Insert Image"
              />
              <ToolbarButton
                onClick={() => setShowTableCreator(true)}
                icon={Table}
                title="Insert Table"
              />
              <ToolbarButton onClick={insertGrid} icon={Grid} title="Insert Grid Layout" />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1">
              <ToolbarButton
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                icon={Eye}
                title="Toggle Preview"
                isActive={isPreviewMode}
              />
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-6">
          <div
            ref={editorRef}
            contentEditable={!isPreviewMode}
            className={cn(
              'min-h-[500px] outline-none transition-all duration-200',
              isPreviewMode
                ? 'cursor-default'
                : 'cursor-text focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-lg p-4'
            )}
            onInput={updateContent}
            onBlur={updateContent}
            onKeyUp={handleSelectionChange}
            onMouseUp={handleSelectionChange}
            onFocus={handleSelectionChange}
            suppressContentEditableWarning={true}
          />
        </div>

        {/* Enhanced Status Bar */}
        <div className="border-t border-gray-200 px-6 py-3 text-sm text-gray-600 bg-gray-50/50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <span className="font-medium">
                Characters:{' '}
                <span className="text-gray-900">{content.replace(/<[^>]*>/g, '').length}</span>
              </span>
              <span className="font-medium">
                Words:{' '}
                <span className="text-gray-900">
                  {
                    content
                      .replace(/<[^>]*>/g, '')
                      .split(/\s+/)
                      .filter(word => word.length > 0).length
                  }
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  isPreviewMode ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                )}
              >
                {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
              </span>
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
                Format: {currentFormat.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <ImageUploader
        isOpen={showImageUploader}
        onClose={() => setShowImageUploader(false)}
        onUploadSuccess={handleImageUpload}
        userId="demo-user"
      />

      <TableCreator
        isOpen={showTableCreator}
        onClose={() => setShowTableCreator(false)}
        onInsert={insertHTML}
      />

      {/* Output Section */}
      {/* <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">HTML Output</h3>
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            Copy HTML
          </button>
        </div>
        <pre className="text-xs bg-white p-4 rounded-lg border border-gray-200 overflow-auto max-h-64 whitespace-pre-wrap font-mono text-gray-700">
          {content || "No content yet..."}
        </pre>
      </div> */}
    </div>
  );
};

export default RichTextEditor;
