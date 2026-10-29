// One offline source for the in-app guide, tours and printable manual.
export const SECTIONS=[['start','Start here'],['writing','Writing & review'],['organize','Organize your work'],['planning','Plan & connect'],['research','Research & references'],['publish','Import & publish'],['protect','Saving & recovery'],['personal','Make Atlas yours']];
const view=id=>({type:'view',id}),tool=id=>({type:'tool',id}),shell=id=>({type:'shell',id});
const articles=[];
function lesson(id,section,title,summary,where,steps,result,tips=[],limits=[],action=null,features=[]){articles.push({id,section,title,summary,where,steps,result,tips,limits,action,features});}
lesson('welcome','start','Your first session','Choose a starting point for any kind of writing.','First launch; Atlas Studio menu → Help & Learning',[
'Choose A fresh page for an empty project, Show me around for a practice project and quick tour, or Continue with my existing library when that option appears.',
'Use New to create ordinary editable writing. You can write fiction, fan fiction, an article, an essay, a letter, poetry, research or another kind of text in the same project.',
'Open Help & Learning whenever you need instructions. Choose a short tour, resume a paused one, or search for the task you want to do.',
'For hands-on learning, choose Create practice project in this center. It adds separate sample material and never resets your existing work.'
],'You have a place to write and can choose how much guidance to see.',['Templates suggest a starting structure; they never restrict your subject or audience.','Replaying a tour does not create another project. The practice-project button reopens its existing project if it is still present.'],[],null,['001','002','003','005','129']);
lesson('workspace','start','Find your way around','Understand the title bar, sidebar, main area and optional panels.','The main Atlas window',[
'Use the Atlas Studio name/logo at the top left to open the application menu. It contains import, library, backup, preferences and help actions.',
'Choose a project or document in the left sidebar. The main area displays your writing or the selected workspace view.',
'Use Back and Forward above the workspace, Alt Left/Right, or mouse navigation buttons to revisit locations. Recent locations offers the last 20 distinct entries from this session. Opening another library resets the navigation history.',
'Use the top toolbar for Writing tools, search, focus, details, Export and New. Hover an icon for its name; keyboard focus also reveals an outline.',
'Open the details panel only when needed. Drag the sidebar separator to resize it, or focus the separator and use arrow keys. Preferences retain your panel choices.',
'Use the window controls to minimize, maximize/restore or close Atlas. Closing waits for saving; if saving fails, Atlas offers ways to keep or rescue your draft.'
],'One sidebar and one main work area keep navigation predictable.',['The project name in the title bar tells you where you are.','F1 opens this guide; Ctrl K searches the library.'],[],shell('details'),['008','009','010','011','012','015','016','017','021']);
lesson('views','start','Choose a workspace view','Use different perspectives on the same writing and notes.','Workspace view menu, at the top left below the title bar',[
'Open Workspace view. The menu groups Writing, Knowledge cards and Manuscript; Board, Connections and Timeline; then Research shelf, Writing goals and Link health.',
'Choose a view with the pointer, or move with arrow keys, Home and End and activate with Enter. Escape closes the menu; Tab continues to the next toolbar control.',
'Return to Writing whenever you want to edit the original item. A stage, date or relationship changed in another view belongs to that same item.',
'Use only the views that help your current work; you do not need to fill every board or diagram.'
],'Planning and research stay connected to the draft.',['Changing views does not create copies of your documents.'],[],view('writing'),['013','014']);
lesson('projects','start','Projects and library folders','Create, select and locate your work.','Projects in the sidebar; Atlas Studio menu → Choose library folder',[
'Use the plus button beside Projects to create a project. Give it a name, color and optional writing intention/deadline, then save.',
'Select its name to limit the workspace to that project, or choose All projects to see writing across the library.',
'Edit a project through its sidebar controls. Document details can change the project for an item and its descendants.',
'For a different library on disk, use Choose library folder. Save current work first and select the intended folder. Preferences → Open library folder shows the current location.'
],'Projects group related writing; a library is the on-disk collection containing all those projects.',['Project folders in the tree are organizational items inside a project, not Windows directories.','Existing installations normally retain the legacy %APPDATA%\\Folio Studio location.'],['Use one Atlas instance to write a given library. Library files are local and are not encrypted by Atlas.'],{type:'project'},['052','063','111','127','131']);
lesson('create','start','Create a document or card','Start blank or use an editable template.','New button; Ctrl N; Ctrl Shift N for a card',[
'Select the project, then choose New. Enter a title and choose the kind: Document, chapter, scene, section, folder or knowledge card.',
'Choose Blank document or an optional starter from the template groups. Your own saved document templates appear under Your templates.',
'Choose Place inside when you want nested writing. Creating from a folder or chapter row menu preselects that parent.',
'Create the item and write. Change the title directly above the editor. Use Document options to duplicate it, convert it between writing/card, save a checkpoint or move it to trash.'
],'You have an ordinary editable item with a stable identity.',['A folder holds other items and has no draft text.','Move nested contents elsewhere before converting their parent into a card.'],[],shell('new'),['028','055','059','062']);
lesson('folders','organize','Folders, chapters and scenes','Build a nested structure and arrange it in the order you need.','Sidebar item menu; document details → Parent section',[
'Use a row’s menu to create a folder, chapter or scene inside it. Expand/collapse arrows reveal or hide the children.',
'Drag an item to reorder within its project. Hold Shift during the drag to place it inside another suitable item.',
'For a precise destination, use Move to… in the row menu or Parent section in document details. A parent cannot be inside its own descendants; a card cannot contain nested writing.',
'Open a folder to see its contents and breadcrumbs. Moving a chapter/folder carries its descendants while their document IDs remain unchanged.',
'Use Manuscript’s reorder controls as a keyboard alternative. Check the resulting outline before exporting.'
],'Your nested outline controls reading and collected export order.',['Pinned filters retain the parent path to pinned writing.','Use the bulk tool for selected items across a larger move.'],[],view('manuscript'),['053','054','056','057','058','060','070']);
lesson('tabs','writing','Document tabs and reading memory','Switch drafts without losing your place.','Tab strip above Writing',[
'Open a document from the sidebar or search. It appears in the tab strip; selecting a tab returns to that document.',
'Hover or focus a tab to reveal its pin and close buttons. Pinned tabs stay first; a tooltip includes the project when titles match.',
'Close a tab with its X or Ctrl W. Use the reopen-arrow button or Ctrl Shift T to reopen a recently closed tab. Closing a tab does not delete the document.',
'Use Ctrl Tab / Ctrl Shift Tab to cycle tabs. On a focused tab, arrow keys, Home and End move between them.',
'Return to a draft to restore cursor/selection and scroll. The PDF reader remembers its own page and zoom.'
],'You can move between drafts and sources while keeping your position.',['The sidebar pin/filter is a bookmark for writing; tab pinning controls the open tab strip.'],[],view('writing'),['018','061','091','135']);
lesson('format','writing','Writing and selection formatting','Format a passage without a crowded permanent ribbon.','Writing editor; toolbar near selected text',[
'In Preferences, choose Default paste behavior: keep supported source formatting, match formatting at the cursor, or plain text. Match preserves ordinary emphasis at the cursor without copying links or comment anchors. Plain text preserves paragraph breaks and literal characters. Ctrl Shift V overrides the preference for one plain-text paste. Code-block pastes remain literal.',
'Keep formatting retains supported tables, images and emphasis; unsupported source fonts/layouts may be normalized by the editor. Comment anchors are not copied. Paste can be undone independently. Use Paragraph style for headings 1 through 6; Undo and Redo are disabled when no operation is available.',
'Choose Outline in the editor toolbar to show headings. Select a heading to place the cursor there. A warning marks skipped heading levels. Collapse hides descendant headings in the outline, without hiding or changing the writing.',
'Hover or focus an outline row for Move up/down controls. A move includes its text, images and all subsections, and can be undone in one step. Moves stay among sibling headings; headings nested inside tables or lists cannot be moved here.',
'Click the draft and type. Select a passage to reveal bold, italic, underline, highlight, comment, link and list controls beside it.',
'Use Paragraph style above the editor for paragraph or heading levels 1–3. Headings also build the outline in document details.',
'Use Insert for bullet/numbered lists, checklists, quotes, code blocks, dividers, tables, images, links and equations.',
'Use Ctrl B / Ctrl I for common formatting and the undo/redo buttons for editor changes. Word and character counts appear below the draft.',
'Right-click a misspelled word for local suggestions or Add to personal dictionary. Set the language in Language & accessibility.'
],'Your draft has readable structure with formatting close to the text.',['Blank writing remains unrestricted across purposes.','Word segmentation varies by language, so treat counts as a writing aid rather than linguistic certification.'],[],view('writing'),['029','030','031','035','043','044','045','046','048','049']);
lesson('tables','writing','Tables and checklists','Keep structured information inside the draft.','Writing → Insert; Table options while inside a table',[
'Place the cursor where the table belongs, choose Insert → Table, and type in its cells.',
'Click inside a cell to reveal Table options. Add a row below or column to the right, remove the current row/column, or remove the table.',
'Drag a column boundary to adjust its width. Review complex tables after export because printed page widths differ.',
'For tasks, use Insert → Checklist. Enter each item and toggle its checkbox as the work progresses.'
],'Tables and tasks remain editable in the document.',['Save before experimenting with a large structural change; editor undo can help reverse an accidental edit.'],[],{type:'editor',id:'insert'},['036','037','038','039']);
lesson('images','writing','Images and web links','Bring local illustrations and external references into your writing.','Writing → Insert → Image or Link',[
'For an image, choose Insert → Image, add a local file if needed, then select its thumbnail. Atlas stores the research attachment with the library.',
'Keep meaningful filenames so images are easy to identify on the research shelf. Complete backups include the stored bytes.',
'For a web link, select text and choose Link, or supply an optional label for a new link. Use an https://, http:// or mailto: address.',
'Ctrl-click a web link to open it in your system browser. For another Atlas item, choose Link a note instead to keep a stable internal connection.'
],'Images and links support the writing while remaining locally organized.',['Word imports can retain embedded images.'],['External websites open separately and may require a network. Word uses a placeholder for WebP; supported raster images export normally.'],{type:'editor',id:'image'},['040','041','051']);
lesson('equations','writing','Equations and technical text','Add rendered math and readable code examples.','Writing → Insert → Equation or Code block',[
'Place the cursor, choose Equation, and enter the LaTeX expression. Check the live preview before inserting it.',
'Use standard supported KaTeX syntax. Correct the expression if the preview shows an error.',
'For code examples, use a code block. Treat it as readable text, not an executable program.',
'Check your intended export: HTML/PDF render equations, while Word keeps visible editable LaTeX text.'
],'Technical material can sit alongside ordinary prose.',['A Technical writing layout is also available.'],['Atlas does not compile complete TeX projects, execute code or generate native Word math objects.'],{type:'editor',id:'math'},['007','042']);
lesson('find','writing','Find and replace in one document','Locate a word and revise individual or repeated occurrences.','Ctrl F; Find and replace toolbar button',[
'Open the document and press Ctrl F. Enter Find text and, if needed, Replacement text.',
'Choose Match case when capitalization should matter. Next match selects the first occurrence, then advances through the document.',
'Use Replace for the current occurrence or Replace all for every match in this document.',
'Review the draft and save. For selected documents across a project, use Find & replace across writing instead.'
],'A focused replacement changes only the current document.',['The search is literal text; it is not a regular-expression editor.'],[],shell('find'),['032','033','034']);
lesson('focus','writing','Focus mode and comfortable typography','Give the draft more room when you need fewer controls.','Focus mode in the top toolbar; Preferences',[
'Open the draft, then choose Focus mode. The surrounding navigation is reduced so the writing has more space.',
'Press Escape to return to the normal workspace.',
'In Preferences, choose the normal writing font and text size. Standard layout follows these preferences.',
'Use Writing layout for a document-specific size/spacing override; use Language & accessibility for scaling the entire interface.'
],'You can reduce visual distractions without changing the document’s content.',['Use reduced motion if transitions distract you.'],[],shell('focus'),['019','025']);
lesson('layouts','writing','Poetry, script, letter and technical layouts','Choose a helpful starting layout without locking your writing to a genre.','Writing tools → Writing layout',[
'Open a writing document and choose Standard, Poetry, Script draft, Letter or Technical.',
'Adjust the document writing size and line height when the preset needs refinement.',
'Continue editing freely; the layout does not impose a mandatory subject, structure or audience.',
'Use Standard to return to your usual writing typography. Choose print/export settings separately in Export presets.'
],'The editor fits the current piece while leaving the text unrestricted.',['Poetry can use deliberate line breaks; imported Unicode prose remains ordinary text.'],['Script draft is a drafting aid, not industry screenplay pagination. Advanced visual poetry and exact print composition remain manual.'],tool('layout'),['004','006','142']);
lesson('comments','writing','Comments and annotations','Keep revision notes beside a passage.','Selected-text comment button; Ctrl Alt M; Writing tools → Comments & annotations',[
'Select the passage before opening Comments if you want an anchored note. Without a selection, the comment applies to the document generally.',
'Type Your comment and choose Add comment. The comment text is stored separately from the draft.',
'Keep writing with the optional comment panel beside the editor. Selecting a saved quotation scrolls to its anchor when that anchor still exists.',
'Resolve finished notes; enable Show resolved comments to reopen them. Delete comment removes the note and its matching anchor.'
],'Revision reminders remain connected without becoming part of your prose.',['Deleting or substantially replacing an anchored passage may remove its visible anchor; the saved comment/quotation can still help you find context.'],['Comments are retained in Atlas backups; exports do not create native Word review-comment objects.'],tool('comments'),['140']);
lesson('revisions','writing','Revision history and passage comparisons','Keep checkpoints and restore only the writing you need.','Document options → Save revision checkpoint; Writing tools → Compare revisions',[
'Before a major rewrite, save a revision checkpoint from Document options. Revision history also provides Checkpoint now and earlier saved drafts.',
'Open Compare revisions and choose Earlier draft. Read the highlighted word changes and the earlier/current passage blocks.',
'Choose Restore this passage for the block you want back. Atlas checkpoints the current draft first so the newer writing remains in history.',
'For a whole earlier draft, open Revision history, review its preview and use its restore action.',
'Check the resulting writing before continuing. Up to 60 checkpoints are retained per document.'
],'You can recover earlier writing while preserving the newer checkpoint.',['A separate complete backup protects the whole library, not only one draft.'],['Passage restoration works with paragraph/content blocks, not arbitrary character-range merge editing.'],tool('revisions'),['107','136']);
lesson('compare','writing','Edit two documents side by side','Keep another draft visible while working.','Compare two documents above the draft',[
'Open the main document, then choose Compare two documents.',
'Select the second document. Its editor appears beside the primary draft; edits belong to the document shown in that pane.',
'Use the close-comparison control to return to one draft.',
'For automatic change highlighting between versions of one document, use Compare revisions instead.'
],'Two editable documents can share the writing area.',['Close a research/comment panel when you need the extra width.'],[],{type:'dialog',id:'compare'},['020']);
lesson('bulk','organize','Organize several items together','Move, tag, archive, restore or export a selection.','Writing tools → Organize selected items',[
'Choose the project and select the items you want to organize. Review the selection before applying an action.',
'Choose the Bulk action. Move uses a destination; tagging uses the supplied tags; archive hides selected work from ordinary views without trashing it.',
'Apply to selection. Folder/subtree actions include descendants, and invalid destinations inside the selection are rejected.',
'To bring archived work back, enable Show archived items, select it and choose restore. Restoring nested writing also restores its archived parent path.',
'Choose export to open export options for the selection. Folder containers are omitted from the actual writing output.'
],'Related items can be managed consistently in one operation.',['Use status:archived in Ctrl K to locate archived writing.','Archive and trash are separate states.'],['Advanced clipboard cut/paste and a complete tree keyboard-command system are not included.'],tool('bulk'),['071','137']);
lesson('batch-replace','organize','Preview project-wide replacements','Apply one carefully reviewed change across chosen writing.','Writing tools → Find & replace across writing',[
'Choose the project and documents to include. Enter the literal find and replacement text, with Match case if appropriate.',
'Preview the changes. Review the matching document names, occurrence counts and before/after text.',
'Apply the batch only when the preview is correct. The operation changes the selected documents together.',
'Use the saved operation’s Undo when necessary. Atlas refuses that undo if a later edit changed the affected documents, protecting newer writing.'
],'A project-wide change has a review step and a guarded recovery path.',['Generated citations, bibliography text, note bodies and code are excluded.','Up to ten batch snapshots are retained. Make a full backup before a very large revision.'],[],tool('replace'),['143','144']);
lesson('templates','organize','Reusable project and document templates','Save your own structures and starting text.','Writing tools → Your reusable templates',[
'For a project template, choose a project and Template name. Enable Include starter text and notes only if you want content copied along with the structure.',
'Choose Save project structure. Later, Create project makes a new editable project with fresh IDs and remapped internal links.',
'For a document template, open the desired draft, name the template and choose Save current document template.',
'Use New → Start with → Your templates to create a document from that starter. Remove templates from the tool when you no longer want to offer them.'
],'Your preferred organization can be reused without copying document identities.',['Deleting a template does not delete documents or projects already created from it.','Built-in starter groups cover 25 optional structures for varied writing purposes.'],[],tool('templates'),['138']);
lesson('properties','organize','Details, tags and custom properties','Describe writing with only the fields you need.','Document details; Writing tools → Custom document properties',[
'Open document details for project, kind, parent, status, date, tags, outline and related links. Adjust the panel width if needed.',
'Use tags consistently; hierarchical tags such as research/history can help group related material. Sidebar filters narrow the current workspace.',
'Open Custom document properties to add optional text, date or number fields, such as viewpoint, audience, revision deadline or publication status.',
'Name each field clearly and enter its value. These custom values are included in library search.',
'Remove fields you no longer need. Properties are descriptive metadata; the writing remains unrestricted.'
],'Your metadata supports organization without making every draft a complex form.',['Parent changes preserve item identities.'],['Custom fields are per document and do not provide database formulas or relational field types.'],tool('properties'),['066','146']);
lesson('capture','organize','Quick capture and Inbox','Save a loose idea before deciding where it belongs.','Writing tools → Quick capture',[
'Open Quick capture and enter a short Capture title and the idea text.',
'Choose Save to inbox. Atlas creates or reuses an Inbox project and saves a normal editable document there.',
'Select the captured item to open it. Expand it, add tags or link it to related writing.',
'Use document details or the bulk tool to move it into its eventual project/parent when you are ready.'
],'Ideas have a dependable holding place that is easy to reorganize later.',['Capture is inside Atlas; it is not a global Windows hotkey or browser clipper.'],[],tool('inbox'),['145']);
lesson('cards','organize','Knowledge cards and categories','Keep notes, characters, locations, concepts and research near the draft.','Workspace view → Knowledge cards; Ctrl Shift N',[
'Create a knowledge card with New or Ctrl Shift N. Give it a useful title and editable content.',
'Use the card’s category/tags and properties to distinguish a character, location, concept, source note or another kind of idea.',
'Browse cards in Knowledge cards, or enable Show knowledge cards in the writing sidebar.',
'Link a card to relevant writing and review its backlinks. A card is the same saved item across the writing, board and connection views.'
],'Small pieces of knowledge can connect to longer writing without being duplicated.',['A card does not contain nested writing. Use a folder or chapter for a hierarchy.'],[],view('cards'),['072']);
lesson('links','planning','Stable links, backlinks and link health','Connect ideas and resolve unclear connections.','Insert → Link → Link a note instead; Workspace view → Link health',[
'To make a stable internal link, use Link a note instead and choose the intended item. Atlas stores its ID so a rename does not break that connection.',
'You can also type [[Note title]]. An unambiguous project-local title takes priority over matches elsewhere.',
'Open document details to inspect backlinks and related notes. Renaming an unambiguous linked note updates connected title references.',
'Open Link health to find missing or ambiguous wiki links. Pick the intended existing item, clarify the title, or use the offered create-card action for a missing note.'
],'Connections remain useful as your library changes.',['Use distinct titles when relying on typed wiki links; ID links are the most reliable choice when titles repeat.'],[],view('links'),['073','074','075','076']);
lesson('board','planning','Board and drafting stages','Track work from idea through completion.','Workspace view → Board',[
'Open Board for the current project. Cards represent the same writing items shown elsewhere.',
'Drag a card between stages as the work moves forward. You can also set the item’s stage in document details.',
'Open a card to return to its writing. The changed stage is immediately visible in the same item’s metadata.',
'Use the board for your own process; it does not require a particular genre or publication workflow.'
],'A simple stage overview supports drafting and revision.',['Folder containers are omitted from the board.'],[],view('board'),['077','078']);
lesson('graph','planning','Connections graph','Explore relationships without changing the underlying writing.','Workspace view → Connections',[
'Create internal links between writing and cards, then open Connections to see related nodes and edges.',
'Open a node to return to its writing. Drag nodes to arrange the graph; Atlas remembers those positions.',
'Use the graph’s zoom and reset/layout controls when the arrangement becomes hard to read.',
'For a large library, load additional batches as offered. Focus on a project or smaller collection when you want a clearer map.'
],'The graph helps you discover context among your saved links.',['Large graphs load progressively rather than drawing the whole library at once.'],[],view('graph'),['079','080','081']);
lesson('timeline','planning','Timeline, events and milestones','Arrange dates alongside your writing.','Workspace view → Timeline',[
'Open Timeline and choose a lane/filter if needed. Dated writing and separate events can share this view.',
'Use New event to enter a title, date, description and optional lane. Open an existing event to revise those details.',
'Give a writing item a date through document details when it belongs on the timeline. Use the undated-writing controls to schedule items when offered.',
'Move an unwanted event to trash and restore it through Atlas Studio menu → Trash if needed. Document and event recovery are both supported.'
],'Dates and milestones become part of the same project context.',['A separate event describes a milestone without requiring a writing document.'],[],view('timeline'),['082','083']);
lesson('manuscript','planning','Manuscript builder and read-through','Read and export longer work in the order you arranged.','Workspace view → Manuscript',[
'Arrange chapters, scenes and sections in the project tree. Expand the nested outline in Manuscript.',
'Use drag ordering or the up/down controls to refine the sequence. Folder containers group content without adding empty chapter text.',
'Choose Read through to read the collected manuscript continuously. Open an individual item when you want to edit it.',
'Export in manuscript order, or choose only selected chapters. Check the outline and export preview/options before saving the file.'
],'Your reading order and collected export order agree.',['Different kinds of writing can use the same nested structure: report sections, essay parts or book chapters.'],[],view('manuscript'),['067','068','069']);
lesson('goals','planning','Writing goals and activity','Use optional intentions without turning writing into a requirement.','Workspace view → Writing goals; Preferences',[
'Set the daily writing intention in Preferences and project intentions/deadlines when editing the project.',
'Open Writing goals to review the project and daily activity tracked from saved writing.',
'Use the numbers as a guide and adjust the intention to suit the work. Research and revision are valuable even when they add few words.',
'Keep imported prose separate from newly written activity; Atlas does not count an Atlas import as new writing.'
],'Progress information stays available when it helps.',['Counts are an activity aid, not a promise of exact linguistic segmentation or work measurement.'],[],view('goals'),['084']);
lesson('search','organize','One search across the library','Find writing, cards, projects, events, references and indexed source pages.','Ctrl K; Find anything button',[
'Press Ctrl K and enter words or a quoted phrase. Search includes writing text, titles, tags, custom properties and other library items.',
'Narrow the results with filters such as type:card, type:file, type:reference, type:source-page, status:ready, tag:research or project:"My project".',
'Use arrow keys to select a result and Enter to open it. Pointer selection works too.',
'Use status:archived to find archived writing. For PDF page contents, index the source first in Search research contents.',
'Press Escape to close search and return to the draft. Inside Help & Learning, Ctrl K or Ctrl F searches guide lessons instead.'
],'You can reach the same saved item from one search entry point.',['Ctrl N creates a document; Ctrl Shift N creates a card. Quick commands are limited to the actions exposed by the current UI.'],[],shell('search'),['099','100','101','102']);
lesson('research','research','Research shelf and source files','Collect documents, images, sources and reading notes.','Workspace view → Research shelf',[
'Choose Add files and select local PDFs, images or supported text files. Atlas stores a library copy so the project can include it in backups.',
'Open a source from the shelf. A PDF can appear beside your writing; image and text previews remain available for other supported files.',
'Add reading notes, references and related cards. Meaningful names make later search easier.',
'Use Search research contents to build a page-text/OCR index when you need content search, rather than only filename and notes search.'
],'The source material remains close to the writing it supports.',['Changing an original file outside Atlas does not automatically replace or reindex the stored library copy.'],[],view('research'),['085']);
lesson('pdf','research','Read, highlight and extract from PDFs','Return to the exact source page behind a note.','Research shelf → open a PDF',[
'Open the PDF beside a draft. Use Previous/Next, PDF page and the zoom controls to find the passage.',
'Select text in a selectable PDF and choose Highlight selected text. Save any highlight comment or reading note you need.',
'Use Extract to card for a source-linked note. The new card retains the source ID/page and a link back to that page.',
'Select the saved source link later to reopen the file at the referenced page. Close the reader to regain writing space; page/zoom are remembered.'
],'Reading notes and highlights keep their source context.',['Scanned pages may need OCR for search, but OCR does not create a selectable PDF text layer for the reader.'],[],view('research'),['086','087','088','089','090']);
lesson('ocr','research','Search PDF contents and use local OCR','Index selectable PDFs and scanned material on this computer.','Writing tools → Search research contents',[
'Choose a source and Index contents to extract its PDF/text content by page.',
'For scans or images, enable Use local OCR when needed and choose English, French or Arabic data before indexing.',
'Wait for indexing progress. Cancel preserves the previous index and stops after the current page finishes.',
'Search source contents in the tool, or use Ctrl K with type:source-page and your terms. Choose a result to open its exact page.',
'Compare recognized text with the original scan before relying on a quotation or number.'
],'Research becomes searchable without sending its contents to a service.',['OCR is optional local recognition; the original source bytes remain unchanged.'],['OCR can misread text, handwriting, columns or poor scans. It adds searchable index text, not an edited PDF or a selectable reader text layer.'],tool('sources'),['092','147']);
lesson('references','research','Reference records and Zotero imports','Keep bibliography data separate from the draft.','Research shelf → references; Import CSL-JSON',[
'Use the reference controls to create a record with title, author, year, publisher/journal, DOI and URL.',
'For structured manual author names, use Family, Given; Family, Given. A name without a comma is treated as a literal author label.',
'To import records from Zotero, export a CSL-JSON array there, then choose the reference-import control in Atlas and select that file.',
'Edit or remove reference records from the shelf. After changing cited records, refresh linked references in Citations & notes.'
],'Consistent source records support reusable citations and bibliographies.',['Keep a full backup before removing records that existing writing cites.'],['This is file import, not direct/live Zotero synchronization.'],view('research'),['093','096']);
lesson('citations','research','Linked citations and full CSL formatting','Insert citations that retain their source identity.','Writing tools → Citations & notes',[
'Create/import reference records first, then place the writing cursor where the citation belongs and open Citations & notes.',
'Choose APA, MLA, Chicago notes/bibliography or IEEE. Select the reference(s) and add a locator/page when appropriate.',
'Choose Insert linked citation. Use Insert bibliography to add a linked reference-list block.',
'After changing records or style, choose Refresh linked references. For another style, Import CSL style using an independent .csl file.',
'Review the final publication style and export. Author names, locators and source types affect the result.'
],'The local citeproc engine formats references without a network service.',['Linked citations use reference IDs rather than relying on pasted text.'],['Dependent CSL styles need their parent and are rejected. Chicago note citation text is formatted, but automatic placement into native footnotes is not included; create a semantic note separately when needed.'],tool('citations'),['094','095','097']);
lesson('notes','research','Footnotes and endnotes','Keep note text as semantic notes with numbered markers.','Writing tools → Citations & notes',[
'Place the cursor where the note belongs and open Citations & notes.',
'Enter New note text, choose Footnote or Endnote, then Insert note at cursor.',
'Edit existing note text from the note list. Atlas renumbers markers automatically as notes are rearranged.',
'Export to Word when you need actual Word footnote/endnote parts. Check note placement in your target format before publication.'
],'Notes travel with the writing and remain editable in Atlas.',['Footnotes and endnotes have separate numbering.'],['HTML/PDF collect notes at the end, with return links. PDF page-bottom footnote composition is not included. Text formats include note text without print pagination.'],tool('citations'),['141']);
lesson('dictation','writing','Free offline speech-to-text','Turn your voice or a local recording into text, then review before insertion.','Ctrl Shift D; Writing tools → Offline dictation',[
'Open a writing document and Offline dictation. Choose the spoken language or Detect automatically.',
'Choose Start recording only when you want microphone capture. Stop & transcribe ends capture and runs the bundled local speech model.',
'Alternatively, choose Transcribe audio file and select a supported local recording. Keep it under 100 MB and five minutes after decoding.',
'Review and correct the transcript. Place the writing cursor and choose Insert reviewed transcript. You can continue typing while transcription runs.',
'Use Cancel transcription if needed. Advanced can import a compatible Whisper GGML model for another speed/accuracy tradeoff.'
],'Speech becomes reviewed text in your draft with no account or per-use fee.',['The full installer bundles multilingual Whisper Small Q5 and a CPU runtime. Recognition is optional; there is no AI writing or rewriting.','Recording starts only with Start. Temporary native input/output files are removed after the job; a crash may leave SpeechTemp files locally.'],['Recordings are limited to five minutes. Closing the panel stops/cancels its job; uninserted review text is temporary. Recognition may make mistakes. Microphone access depends on your Windows device/privacy settings.'],tool('speech'),['149','150','151','152']);
lesson('imports','publish','Import writing and an Atlas library','Bring existing work in with a preview where available.','Atlas Studio menu → Import documents / Import Atlas library',[
'Choose the destination project before importing ordinary documents. Import documents accepts Markdown, plain text, HTML and Word.',
'For an older Atlas library, choose Import Atlas library and select a supported version-1 JSON backup or legacy SQLite database.',
'Review the project/document/event counts and duplicates. Choose to skip identical content/merge matches or import separate copies.',
'Apply the preview, then check the resulting project structure and representative documents. Atlas creates a pre-import safety checkpoint; original Atlas databases open read-only.'
],'Imported writing becomes editable Atlas items without replacing the current library.',['Word imports can retain embedded images.','A full .folio backup uses Restore a backup copy, not the Atlas JSON/SQLite importer.'],['Browser-only Atlas storage and external media are not imported by the legacy library converter. Complex Word/HTML layout may need review.'],{type:'menu'},['114','115','116']);
lesson('exports','publish','Export one draft or collected writing','Save a usable copy in your intended format.','Export button; folder export; bulk selected export',[
'Open the document/project and choose Export. Choose Current document, All writing in this project/filter, Writing in manuscript order or Selected chapters.',
'For selected writing, tick the intended items. Folder containers are excluded; collected writing follows the arranged outline order.',
'Choose PDF, Word, Markdown, HTML, plain text or EPUB, and select an export layout preset.',
'Choose save location. Once the native picker closes, export runs in the background and you can keep writing.',
'Open the finished file in its target reader and check headings, order, tables, images, notes and equations before sharing it.'
],'The draft can leave Atlas in a format appropriate to the next step.',['HTML/PDF render math and include local media; Word retains common editable formatting/tables/supported images and visible LaTeX text.','Export options describe output; they do not change the saved draft.'],['EPUB is a text edition, not illustrated/fixed-layout EPUB. Markdown/plain text cannot preserve all rich layout. Exact specialist publishing/prepress composition is not certified.'],shell('export'),['117','118','119','120','121','122','123']);
lesson('presets','publish','Save export and print presets','Reuse margins, paper, typography and chapter settings.','Writing tools → Export presets',[
'Select Standard, Book manuscript, Article, Essay/report or Ebook as a starting point.',
'Adjust page size, font, size, line spacing and margins. Choose chapter numbering/breaks, title page and page numbers where appropriate.',
'Give your custom preset a recognizable name and save it.',
'Select that preset in the export dialog for one document or a collection. Review the exported file before publication.'
],'Different writing purposes can have reusable output settings.',['Writing layout changes the editor; export presets change the output. They are independent.'],['Print-specific pagination applies to PDF/Word/HTML. Plain text and reflowable ebooks do not preserve printed page breaks or page numbers.'],tool('exports'),['124']);
lesson('saving','protect','Autosave, conflicts and safe closing','Understand whether your latest words are safely on disk.','Save status in the title bar; Ctrl S',[
'Watch for Unsaved changes, Saving… and Saved locally. Ctrl S asks Atlas to save now.',
'Atlas uses atomic writes and previous-state recovery. Closing waits for saving rather than immediately discarding the current draft.',
'If saving fails, keep the window open. Check storage access/free space, then retry. Use Export draft to rescue writing if necessary.',
'If a conflicting external edit is detected, Atlas rejects the overwrite. Preserve the draft and compare the external library copy before choosing what to keep.',
'For protection beyond one draft or disk, make complete backups and verify a restoration preview.'
],'The save indicator reflects success, and failure leaves choices for recovery.',['Avoid editing library JSON outside Atlas while it is open.','Revision history, daily checkpoints and full backups serve different purposes.'],['Unexpected OS shutdown/storage failure is not a substitute for a second-drive backup.'],{type:'menu'},['103','104','105','106','130']);
lesson('backup','protect','Backup health, preview and restoration','Protect the complete library and test the recovery path.','Writing tools → Backup & recovery',[
'Review missing attachments, free space, revision/daily checkpoint counts and recorded complete backups.',
'The health message identifies missing files, no available complete backup, or an archive older than seven days. Archive availability is not a new integrity check: use Preview a backup to verify its current contents.',
'Choose Create verified backup and save a .folio archive, preferably on a separate drive. It contains writing, events, references, attachments, annotations, history, templates, indexes and imported styles.',
'Choose Preview a backup and select the archive. Atlas verifies it and shows the contents before you commit to restoration.',
'Choose Restore separate copy only when you want to open a new restored library. The current library remains on disk, and the archive is checked again for changes.',
'Review the restored writing and source files. Use Choose library folder when returning to another saved library.'
],'A portable, verified copy can recover more than the current text document.',['Missing attachment bytes cause backup to fail rather than silently omit sources.','Daily JSON checkpoints refer to the original attachment directory; they are not complete portable archives.'],['Restoration is bounded to 512 MB compressed and 1 GB expanded. Libraries/backups are not encrypted by Atlas.'],tool('recovery'),['108','109','110','112']);
lesson('trash','protect','Trash, restore and archive','Hide or remove work without confusing the recovery options.','Atlas Studio menu → Trash; bulk archive controls',[
'Use Move to trash on a document, folder or event when you want it out of normal work. Trashing a folder includes its nested writing.',
'Open Trash to see recoverable documents and events, then choose Restore for the item you need back.',
'Restoring a nested item restores the relevant parent path so the item can be reached in the tree.',
'Use archive in Organize selected items for work you want to set aside without putting it in trash. Show archived items or status:archived brings it back into reach.'
],'Trash and archive provide distinct ways to recover or revisit work.',['Closing a tab, deleting a template and hiding a panel are different from trashing writing.'],[],shell('trash'),['064','065']);
lesson('themes','personal','Themes, animation and panel preferences','Make Atlas comfortable without adding permanent clutter.','Atlas Studio menu → Preferences',[
'Choose any of the 15 complete themes. The workspace, menus and optional panels use the same theme colors.',
'Choose your default writing font/size and reduced motion preference. Reduced motion removes decorative transitions.',
'Resize the sidebar with its separator, or use keyboard arrows while it is focused. Adjust the optional details panel width when open.',
'Atlas remembers theme, panel settings, last view/project and writing positions for your next session.'
],'Appearance and movement suit your own reading comfort.',['Use full interface scaling in Language & accessibility when every control needs to be larger.','Themes: Atlas Midnight, Paper Light, Deep Ocean, Forest, Amethyst, Ember, Graphite, Cobalt, Rose Noir, Parchment, Sage, Open Sky, Lavender, Desert Sand and Quiet Mono.'],['Color contrast has bounded automated checks; every assistive technology/display combination is not certified.'],shell('settings'),['022','023','024','026']);
lesson('language','personal','Language, RTL and accessibility','Adjust writing direction, spelling and the whole interface.','Writing tools → Language & accessibility',[
'Set Interface scale from 80–150% for all controls, not only draft text.',
'Choose the default writing direction and, when needed, a direction for the current document. Use Selected paragraph RTL/LTR for a particular paragraph.',
'Choose Local spelling language. Right-click misspelled text for suggestions, or add/remove personal words in the dictionary controls.',
'Use keyboard focus outlines, menu arrows/Home/End, Tab and Escape to navigate. Choose reduced motion in Preferences if needed.',
'Set the dictation language separately; it does not change the spelling dictionary.'
],'Mixed language work can have appropriate direction and readable controls.',['Official dictionaries are bundled for offline use; Windows may also use local native spelling resources.'],['English and French suggestions were tested offline. Not every spelling language, bidirectional export, screen reader or high-DPI configuration is certified.'],tool('language'),['027','047','050','148']);
lesson('shortcuts','personal','Keyboard reference','Reach common actions without hunting through menus.','Throughout Atlas',[
'F1 opens Help & Learning. Inside the guide, Ctrl F or Ctrl K focuses lesson search; Escape closes the center.',
'Ctrl N creates a document; Ctrl Shift N creates a card. Ctrl S saves; Ctrl F finds in the current draft; Ctrl K searches the library.',
'Ctrl W closes a tab; Ctrl Shift T reopens one; Ctrl Tab / Ctrl Shift Tab cycles tabs.',
'Ctrl Alt M opens comments for the selection; Ctrl Shift D opens offline dictation. Ctrl B / Ctrl I format text; editor undo/redo remains available.',
'Use arrow keys/Home/End inside menus and focused tabs, Enter to activate, and Escape to close a menu/dialog or leave focus mode. Use the sidebar separator’s arrow-key controls for width.'
],'Common actions remain accessible with keyboard navigation.',['Help search searches instructions, while the main Ctrl K searches your saved library.'],[],null,[]);
lesson('troubleshooting','protect','Troubleshooting and known limits','Choose the right recovery step when something does not behave as expected.','Help & Learning; Backup & recovery',[
'Cannot find writing? Check the project, sidebar query, pinned/card filters, archive status and Trash before assuming it was lost.',
'Save failure/conflict? Keep the window open, export the draft if needed, check storage access/free space and preserve both versions before resolving an external conflict.',
'No dictation audio? Select the intended Windows input device, allow microphone access for desktop apps, then try a short recording. Audio-file transcription can help distinguish device problems from recognition problems.',
'No source-content results? Index the file first; enable the correct OCR language for a scan. Check the source itself when recognition gets words/numbers wrong.',
'Export looks different? Verify format limits, scope/order and preset. Use Word for native note parts or HTML/PDF for rendered equations; specialist publishing may need another layout application.'
],'A problem has a concrete next check and a way to protect the writing.',['The full installer includes speech/OCR/runtime resources. Reinstall the full package if the speech pack is missing. Uninstall keeps your library.','For any reported bug, note the app version, action, expected result and actual message without sharing private writing unnecessarily.'],['Maximum validation limits are not demonstrated performance guarantees. Long-session, extreme-size, low-memory, multiple-display and sudden-OS-shutdown testing is incomplete. No live coauthoring, direct Zotero sync, full TeX compiler or app encryption is included.'],tool('recovery'),['126','128','132','133','134']);
export const ARTICLES=articles;
export const ARTICLE_BY_ID=Object.fromEntries(articles.map(a=>[a.id,a]));
export const TOURS=[
 {id:'overview',name:'Quick start',description:'The six essentials for your first session.',minutes:6,steps:['workspace','create','views','properties','search','saving']},
 {id:'foundations',name:'Workspace & organization',description:'Projects, folders, tabs, capture and your own reusable structures.',minutes:12,steps:['welcome','projects','folders','tabs','capture','templates','bulk','properties']},
 {id:'writing',name:'Write comfortably',description:'Formatting, structured text, layouts, focus and dictation.',minutes:15,steps:['format','tables','images','equations','find','focus','layouts','dictation']},
 {id:'revision',name:'Review & revise',description:'Comments, history, comparisons and careful batch changes.',minutes:8,steps:['comments','revisions','compare','batch-replace']},
 {id:'planning',name:'Plan & connect',description:'Cards, links, drafting stages, events and a collected manuscript.',minutes:14,steps:['cards','links','board','graph','timeline','manuscript','goals']},
 {id:'research',name:'Research & cite',description:'Sources, PDF notes, local OCR, references and semantic notes.',minutes:14,steps:['research','pdf','ocr','references','citations','notes']},
 {id:'publishing',name:'Import & publish',description:'Bring writing in and choose a reliable output.',minutes:7,steps:['imports','presets','exports']},
 {id:'protection',name:'Protect your work',description:'Save status, full backups, restore previews and recovery.',minutes:9,steps:['saving','backup','trash','troubleshooting']},
 {id:'personal',name:'Make Atlas yours',description:'Themes, language, scaling and keyboard controls.',minutes:7,steps:['themes','language','shortcuts','search']},
 {id:'complete',name:'Complete feature tour',description:'Every guide lesson, in order. Pause and resume whenever you like.',minutes:65,steps:articles.map(a=>a.id)}
];
export const TOUR_BY_ID=Object.fromEntries(TOURS.map(t=>[t.id,t]));
export function searchLessons(query,section='all'){const terms=String(query).toLocaleLowerCase().trim().replaceAll('+',' ').replace(/wordcount/g,'word count').replace(/dark ?mode|light ?mode/g,'themes').split(/\s+/).filter(Boolean);return articles.filter(a=>section==='all'||a.section===section).map(a=>{const title=(a.title+' '+a.where).toLocaleLowerCase(),body=(a.summary+' '+a.steps.join(' ')+' '+a.tips.join(' ')+' '+a.limits.join(' ')).toLocaleLowerCase();return {a,score:terms.every(t=>title.includes(t)||body.includes(t))?terms.reduce((n,t)=>n+(title.includes(t)?5:1),0)+1:0};}).filter(r=>r.score).sort((a,b)=>b.score-a.score).map(r=>r.a);}
export function tourPosition(settings,id){const t=TOUR_BY_ID[id]||TOUR_BY_ID.overview,p=settings.helpTourProgress?.[t.id];return Math.max(0,Math.min(t.steps.length-1,Number.isInteger(p?.step)?p.step:0));}
export function makePracticeBundle(state,makeId,now=new Date().toISOString()){
 const existing=state.projects.find(p=>p.learningPractice);if(existing)return {existing:true,project:existing,docs:state.docs.filter(d=>d.projectId===existing.id&&!d.deleted)};
 const pid=makeId(),ids=Array.from({length:7},makeId),doc=(i,title,type,html,parentId='')=>({id:ids[i],projectId:pid,title,type,importedFrom:'Tutorial',html,text:html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),parentId,tags:['practice'],status:i===2?'revising':'draft',createdAt:now,updatedAt:now,order:state.docs.length+i,date:'',pinned:false});
 const docs=[doc(0,'Practice collection','folder',''),doc(1,'An opening to explore','chapter','<p>This is practice writing. You can edit, format or replace it without changing your other projects.</p><p>Select this sentence and add a revision comment.</p><p>See <a href="folio://note/'+ids[5]+'">Research card</a> for a linked idea.</p>',ids[0]),doc(2,'A second section','section','<p>Use this second piece to try tabs, stages, comparisons or manuscript ordering.</p>',ids[0]),doc(3,'A scene or example','scene','<p>A small nested piece can belong to fiction, an article example, or a report section.</p>',ids[1]),doc(4,'An article draft','article','<h2>A useful question</h2><p>What would make this clearer for a reader?</p><ul><li>Keep the purpose visible.</li><li>Connect the supporting evidence.</li></ul>'),doc(5,'Research card','card','<p>This sample card is for trying links, tags and the graph. Add a real source to the research shelf when you want to try PDF reading and citations.</p>'),doc(6,'A character, concept or location','card','<p>Choose the kind of knowledge that suits your project. Cards are not limited to fiction.</p>')];
 return {existing:false,project:{id:pid,name:'Atlas learning practice',color:'#aaa8ff',goal:500,deadline:'',learningPractice:true},docs};
}
