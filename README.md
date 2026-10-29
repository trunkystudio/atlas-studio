# Atlas Studio 0.1

A local Windows workspace for any kind of writing: fiction, fan fiction, articles, essays, poetry, research, reports, letters, scripts and technical documents. Blank documents have no genre restrictions. Optional templates and layouts are editable starting points.

No account, subscription, cloud API or AI writing/rewriting is included. Optional speech recognition and OCR use local machine-learning models. The full installer includes the runtime, speech model, OCR resources, dictionaries, fonts and PDF engine; normal use requires no network or local web server.

## Install and upgrade

Run **Atlas-Studio-Setup-0.1.0.exe**. The compressed Windows x64 setup wizard provides a destination picker, desktop/Start-menu shortcuts and an uninstaller. The application is unsigned. Existing Folio/Atlas libraries are retained, including the legacy storage location `%APPDATA%\Folio Studio\Library` or the library directory you selected. Uninstall keeps your library.

The first launch offers **Show me around**, **A fresh page**, or continuation with an existing library. Tutorial and blank-project creation preserve existing projects. Replay the tutorial from the Atlas Studio menu.

## Help, complete guide and tours

Press **F1**, or choose **Atlas Studio menu > Help & Learning**. The offline center contains **47 step-by-step lessons** and **10 guided tours**, covering the available writing, organization, planning, research, publication and recovery features. Search a feature/question, browse a category, open its real controls, and mark lessons learned or unread. Ctrl F or Ctrl K searches the guide while it is open.

Start with the six-step Quick start, choose a topic tour, or follow the 47-lesson Complete feature tour. Expand Follow the steps for practical instructions. Back/Next, Pause, Resume tour and Start again let you learn at your own pace. Tour position/completion and reading progress are stored locally with the library settings and included in full backups. Replaying a tour does not create projects or edit writing.

**Create practice project** adds a separate set of sample writing, nested sections and linked cards. Reusing that button reopens its existing project and keeps practice edits. Your other projects are preserved. Tours never automatically record, select files, restore a library or alter document content. The person chooses Open this feature and any actual editing/file/recording actions.

**Save printable guide** exports a self-contained HTML manual with contents, search and Print / save as PDF. The release also includes a Markdown copy. The manual and in-app instructions are generated from the same lesson data; they work without a network.

## Keep the workspace clean

There is one sidebar, one main workspace and one grouped **Workspace view** menu. The details panel is optional. A compact tab strip switches documents; hover or focus a tab to reveal pin/close actions. Pinned tabs stay first. The history-arrow button reopens recently closed tabs. Tab tooltips identify the project when titles match.

The **Writing tools** button is the three-dot button in the top toolbar. Its grouped menu contains the new tools. Comments and dictation open in an optional side panel so writing remains available. Other tools open when needed. Panel widths, themes, motion, typography, selected views and reading positions are remembered. Fifteen complete themes, reduced motion, focus mode and keyboard controls remain available.

## Writing and review

- Rich text, tables with row/column controls, local images, equations, checklists, lists, quotes and code blocks. Formatting appears near selected text. The Insert menu holds less frequent commands.
- Document tabs support pinning, closing and reopening. Cursor/selection and scroll positions are restored when returning to writing. PDF page and zoom are remembered separately.
- **Compare revisions** shows word changes and changed paragraph/block passages. Restore one passage while keeping a checkpoint of the newer draft. Full-history restoration remains available.
- **Comments & annotations** anchors revision comments to selected text without inserting comment text into the draft. Resolve, reopen or remove comments. Removing a comment removes its matching anchor.
- **Writing layout** offers Standard, Poetry, Script draft, Letter and Technical starting layouts, with optional document-specific type size and line spacing. Standard respects your normal editor font preference.
- **Custom document properties** adds optional text, date and number fields, such as audience, viewpoint or deadline. Their values are searchable.
- **Language & accessibility** provides interface scaling from 80–150%, default/document/paragraph writing direction, local spelling-language selection and a personal dictionary. Official Electron dictionaries are bundled and seeded into the local cache. Windows may also use its native spelling resources. English and French suggestions were tested offline; every language is not certified.

Script layout is a drafting aid, not an industry screenplay pagination engine. Word counts use whitespace-based segmentation and are approximate for languages without word spaces. Mathematical rendering does not make Atlas a full TeX project compiler.

## Organization across views

Folders, chapters, scenes, nested sections and knowledge cards share stable document IDs. Create directly inside a folder/chapter, use the parent picker, or drag to reorder; Shift-drag nests. Invalid parents and cycles are rejected. Manuscript offers an outline, reorder buttons and continuous reading. Exports follow the arranged chapter order; folder containers do not become empty chapters.

**Your reusable templates** saves your project structure with optional starter content, or the current document as a reusable template. New projects receive fresh document IDs, with internal links remapped. Custom document templates appear under Your templates in the creator. The existing 25 built-in optional templates remain available.

**Find & replace across writing** selects documents, previews each changed document and applies one batch. Undo restores the batch only if those documents have not subsequently changed. It skips generated citations/bibliographies, note bodies and code. Ordinary document-local find/replace remains available through Ctrl F.

**Organize selected items** selects several items to move, tag, archive, restore or export. Folder/subtree operations include descendants; restoring nested writing restores its archived parent path. Archived writing stays outside normal views/search. Use `status:archived` to find it or the bulk tool's Show archived items control. Recoverable trash is separate from archiving and includes documents and events.

**Quick capture** saves loose ideas into a reusable Inbox project. Board stages, graph connections, timeline events and knowledge cards update the same underlying items. Stable-ID links survive renaming; Link health identifies missing/ambiguous wiki links.

## Research, citations and notes

Add PDFs, images, text files and references to Research shelf. Open a source beside a draft; PDF highlights and extracted notes retain source-page links. The reader remembers page and zoom.

**Search research contents** indexes PDF text by page. Optional **Use local OCR when needed** recognizes scanned PDF pages and images with bundled English, French or Arabic data. OCR can make recognition mistakes; original files are preserved. Canceling during indexing preserves the previous index and stops after the current page. Source results open the exact page. Ctrl K includes indexed content with `type:source-page`, as well as writing, cards, events, projects, files and references. Other filters include `tag:`, `status:` and `project:"Name"`.

**Citations & notes** uses the real local citeproc-js engine, with APA, MLA, Chicago notes/bibliography and IEEE styles. Import independent CSL files for other styles; dependent styles need their parent style and are rejected with a clear message. References can be entered manually or imported as CSL-JSON from Zotero. Manual authors may use `Family, Given; Family, Given`. Citation nodes retain reference IDs and locator data. Refresh linked references after editing records or changing style. Bibliographies remain linked blocks. Direct Zotero sync is not included. Chicago produces formatted note citation text; automatic conversion of note-style citations into native footnotes is not included.

Footnotes/endnotes are separate semantic notes with editable text and automatic numbering. Word exports use real Word footnote/endnote parts. HTML/PDF collect notes at the end with return links; PDF does not yet place footnotes at the bottom of each printed page. Markdown, text and text EPUB include note text. Comments are revision metadata kept in Atlas backups; exports do not create Word review-comment objects.

## Free offline dictation

Open **Writing tools > Offline dictation**, or Ctrl Shift D. Choose a language or automatic detection. **Start recording** is the only action that starts microphone capture. **Stop & transcribe** processes the recording locally. Review/edit the transcript, then **Insert reviewed transcript** at the writing cursor. You can keep typing during transcription. Cancel transcription from the panel. Closing the panel stops recording and cancels its transcription; uninserted review text is temporary.

The bundled model is **Whisper Small multilingual, Q5**, run with **whisper.cpp 1.9.5** on the CPU. It is a practical speed/accuracy compromise for this computer, not a claim of best accuracy for every speaker. No key, account, usage fee or remote inference is used. Compatible Whisper GGML models can be imported through Advanced. Larger models require more memory and time. Recordings are limited to five minutes; imported audio files to 100 MB and five minutes after decoding. Common browser-decodable audio files are supported.

Audio and transcript files used by the native process are temporary and removed when the job finishes. Crashes may leave temporary files under the local SpeechTemp directory. Original imported audio files are untouched. Physical microphone quality and permissions vary by device; tests used a fake input device with public sample audio, not your microphone.

Speech sources: https://github.com/openai/whisper and https://github.com/ggml-org/whisper.cpp. Model origins/checksums and third-party licenses are shipped with the source and application.

## Export, saving and recovery

Export one document, selected writing or a complete manuscript to PDF, Word, Markdown, HTML, text or text EPUB. **Export presets** saves reusable paper size, font, spacing, margins, chapter numbering/breaks, title-page and page-number settings. Defaults include Standard, Book manuscript, Article, Essay/report and Ebook. Print-specific settings apply to PDF/Word/HTML; reflowable/plain formats cannot preserve printed pagination. Export runs in the background after the native save picker closes.

HTML/PDF embed local images, equation rendering and fonts. Word retains common formatting, tables, supported raster images and editable visible LaTeX text. Text EPUB is not an illustrated/fixed-layout publishing engine. WebP uses a Word placeholder. Exact journal composition, native Word math objects and professional prepress certification remain outside this release.

Autosave and Ctrl S distinguish pending, saved and failed states. Atomic file writes and previous-state recovery protect against interrupted saves. External library conflicts are rejected. Closing waits for saving; if it fails, keep editing, export the draft or explicitly close without saving. One app instance should write a library; there is no live cloud collaboration.

**Backup & recovery** shows missing attachments, local free space, revision/daily checkpoint counts and complete-backup records. **Create verified backup** creates a CRC-checked `.folio` archive with writing, attachments, events, references, annotations, revisions, templates, indexes and imported CSL styles. **Preview a backup** verifies it and shows its contents before **Restore separate copy** opens a new restored library. The archive is checked again for changes before restoration. The current library remains on disk. Restore limits are 512 MB compressed and 1 GB expanded. Daily JSON checkpoints rely on attachments in the original library; full backups are the portable copies. Store backups on another drive when appropriate.

Library data is local JSON and files, not app-encrypted storage. No commercial payment/activation system is included. The app has no recurring charges.

## Shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl K | Search / quick commands |
| Ctrl S | Save now |
| Ctrl F | Find/replace in current document |
| Ctrl W | Close document tab |
| Ctrl Shift T | Reopen closed tab |
| Ctrl Tab / Ctrl Shift Tab | Next / previous document tab |
| Ctrl Alt M | Comment on selected text |
| Ctrl Shift D | Offline dictation |
| Arrow keys / Home / End | Navigate open menus or focused tabs |
| Escape | Close an open menu/dialog or leave focus mode |

## Build and verification

The Git repository excludes the large native speech runtime/model. On Windows, run `powershell -File scripts/fetch-speech.ps1` once before packaging, or copy `native/speech-pack` from the complete source archive. The downloader verifies pinned SHA-256 checksums from `build/RESOURCE-SOURCES.json`. These downloads are for development setup; installed dictation works offline.

The delivered source archive contains the application, tests, bundled speech pack and OCR/dictionary/CSL assets. Install Node.js, then run:

```
npm ci
npm test
node scripts/licenses.cjs
npm run build
npm start
npm run dist
```

Node/npm installation and dependency acquisition need network during development; the installed application does not. Build artifacts and dependency lockfiles are pinned in the source archive. Do not rerun legacy one-time integration scripts from an older working directory.

Acceptance suites: `tests/studio-desktop.cjs`, `studio-folders.cjs`, `studio-audit.cjs`, `studio-pro-desktop.cjs`, `studio-offline-input.cjs`, `studio-research.cjs`, `studio-upgrade.cjs`, and `studio-performance.cjs`, and `studio-learning.cjs`. Use `STUDIO_TEST_EXE` for the installed executable and `STUDIO_TEST_OUTPUT` for an independent result directory where supported. These suites use isolated temporary libraries and explicit test file-picker choices. Dictation capture tests use a fake audio device. Performance results are bounded measurements on this computer, not guarantees for all hardware or library sizes.

Delivered validation and feature-inventory reports distinguish passed workflows, reviewed implementation, limits, missing features and untested conditions. Product code is original; no Lattics program code/assets are shipped. The supplied Atlas brand artwork remains in `src/assets`. Application source is MIT; third-party code/data retains its own terms. Complete notices are in `build/THIRD-PARTY-LICENSES.txt`, `build/licenses`, and dictionary/style assets.

## Community and support

Bug reports, improvement suggestions and pull requests are welcome. Accepted changes will be considered for future updates; no implementation date is guaranteed. See [Contributing](CONTRIBUTING.md) and [Support development](SUPPORT.md).
