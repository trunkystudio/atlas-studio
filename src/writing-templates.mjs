export const TEMPLATE_GROUPS=[
 ['Start anywhere',[
  ['Blank document','<p></p>'],
  ['Free writing','<p></p>']
 ]],
 ['Fiction & storytelling',[
  ['Fan fiction chapter','<h2>Chapter title</h2><p></p><h2>Scene break</h2><p></p>'],
  ['Short story','<h2>Title</h2><p></p>'],
  ['Chapter outline','<h2>Opening</h2><p></p><h2>Development</h2><p></p><h2>Turning point</h2><p></p><h2>Resolution</h2><p></p>'],
  ['Character sketch','<h2>Identity & role</h2><p></p><h2>Motivation</h2><p></p><h2>Relationships</h2><p></p><h2>Voice & development</h2><p></p>'],
  ['Worldbuilding note','<h2>Place or concept</h2><p></p><h2>Details & rules</h2><p></p><h2>Connections</h2><p></p>'],
  ['Screenplay draft','<h2>Scene heading</h2><p></p><h2>Action</h2><p></p><h2>Dialogue</h2><p></p>']
 ]],
 ['Poetry & personal writing',[
  ['Poem','<h2>Title</h2><p></p>'],
  ['Personal essay','<h2>Title</h2><p></p>'],
  ['Daily journal','<h2>Today</h2><p></p><h2>Observations</h2><p></p><h2>Reflections</h2><p></p>']
 ]],
 ['Articles & nonfiction',[
  ['Article / blog post','<h2>Headline</h2><p></p><h2>Opening</h2><p></p><h2>Main points</h2><p></p><h2>Closing</h2><p></p>'],
  ['News article','<h2>Headline</h2><p></p><h2>Lead</h2><p></p><h2>Reporting & evidence</h2><p></p><h2>Sources</h2><p></p>'],
  ['Review','<h2>Subject</h2><p></p><h2>Evaluation</h2><p></p><h2>Conclusion</h2><p></p>'],
  ['Tutorial / guide','<h2>Goal</h2><p></p><h2>What you need</h2><p></p><h2>Steps</h2><ol><li><p></p></li></ol><h2>Result</h2><p></p>']
 ]],
 ['Study & research',[
  ['Essay','<h2>Question or thesis</h2><p></p><h2>Argument</h2><p></p><h2>Evidence</h2><p></p><h2>Conclusion</h2><p></p><h2>References</h2><p></p>'],
  ['Research note','<h2>Research question</h2><p></p><h2>Key findings</h2><p></p><h2>Evidence and sources</h2><p></p><h2>Open questions</h2><p></p>'],
  ['Literature review','<h2>Scope</h2><p></p><h2>Themes in the literature</h2><p></p><h2>Points of agreement</h2><p></p><h2>Gaps and contradictions</h2><p></p><h2>Bibliography</h2><p></p>'],
  ['Study notes','<h2>Topic</h2><p></p><h2>Key ideas</h2><p></p><h2>Examples</h2><p></p><h2>Questions</h2><p></p>']
 ]],
 ['Work & everyday writing',[
  ['Report','<h2>Summary</h2><p></p><h2>Findings</h2><p></p><h2>Recommendations</h2><p></p>'],
  ['Proposal','<h2>Objective</h2><p></p><h2>Approach</h2><p></p><h2>Resources & schedule</h2><p></p><h2>Next steps</h2><p></p>'],
  ['Letter / email','<p></p><p></p><p></p>'],
  ['Meeting notes','<h2>Purpose</h2><p></p><h2>Discussion</h2><p></p><h2>Decisions</h2><p></p><h2>Next actions</h2><p></p>'],
  ['Speech / presentation','<h2>Opening</h2><p></p><h2>Main message</h2><p></p><h2>Supporting points</h2><p></p><h2>Closing</h2><p></p>'],
  ['Technical documentation','<h2>Overview</h2><p></p><h2>Requirements</h2><p></p><h2>Usage</h2><p></p><h2>Examples</h2><pre><code></code></pre><h2>Troubleshooting</h2><p></p>']
 ]]
];
export const templates={...Object.fromEntries(TEMPLATE_GROUPS.flatMap(g=>g[1])),'Blank article':'<p></p>'};
export const WRITING_HELP='Write fiction, fan fiction, poetry, articles, essays, research, work documents, or anything else. Templates are optional and fully editable.';
