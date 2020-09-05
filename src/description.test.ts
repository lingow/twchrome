import * as description from './description'


describe('description',() =>{
  describe('parseDescription',() => {
    it('understands tags',() =>{
      expect(description.parseDescription("+atag").task).toMatchObject({'tags':['atag']});
    });
    it('understands multiple tags',() =>{
      expect(description.parseDescription("+atag +anothertag").task)
        .toMatchObject({'tags':['atag','anothertag']});
    });
    it('understands comma separated tags',() =>{
      expect(description.parseDescription("+atag,anothertag").task)
        .toMatchObject({'tags':['atag','anothertag']});
    });
    it('understands "project" and substrings',() =>{
      expect(description.parseDescription("projec:aproject").task).toMatchObject({'project':'aproject'});
      expect(description.parseDescription("proje:aproject").task).toMatchObject({'project':'aproject'});
      expect(description.parseDescription("proj:aproject").task).toMatchObject({'project':'aproject'});
      expect(description.parseDescription("pro:aproject").task).toMatchObject({'project':'aproject'});
    });
    it('understands "priority" and substrings',() =>{
      expect(description.parseDescription("priority:H").task).toMatchObject({'priority':'H'});
      expect(description.parseDescription("priorit:H").task).toMatchObject({'priority':'H'});
      expect(description.parseDescription("priori:H").task).toMatchObject({'priority':'H'});
      expect(description.parseDescription("prior:H").task).toMatchObject({'priority':'H'});
      expect(description.parseDescription("prio:H").task).toMatchObject({'priority':'H'});
      expect(description.parseDescription("pri:H").task).toMatchObject({'priority':'H'});
    });
    it('understands priorities H M and L',() =>{
      expect(description.parseDescription("priority:H").task).toMatchObject({'priority':'H'});
      expect(description.parseDescription("priority:M").task).toMatchObject({'priority':'M'});
      expect(description.parseDescription("priority:L").task).toMatchObject({'priority':'L'});
    });
    it('understands "depends" and substrings',() =>{
      expect(description.parseDescription("depends:10").task).toMatchObject({'depends':['10']});
      expect(description.parseDescription("depend:10").task).toMatchObject({'depends':['10']});
      expect(description.parseDescription("depen:10").task).toMatchObject({'depends':['10']});
      expect(description.parseDescription("depe:10").task).toMatchObject({'depends':['10']});
      expect(description.parseDescription("dep:10").task).toMatchObject({'depends':['10']});
      expect(description.parseDescription("de:10").task).toMatchObject({'depends':['10']});
    });
    it('understands multiple "depends"',() =>{
      expect(description.parseDescription("depends:10 depends:11").task)
        .toMatchObject({'depends':['10','11']});
    });
    it('understands "due" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("due:" + isostring).task).toMatchObject({'due':isostring});
      expect(description.parseDescription("du:" + isostring).task).toMatchObject({'due':isostring});
    });
    it('understands "wait" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("wait:" + isostring).task).toMatchObject({'wait':isostring});
      expect(description.parseDescription("wai:" + isostring).task).toMatchObject({'wait':isostring});
      expect(description.parseDescription("wa:" + isostring).task).toMatchObject({'wait':isostring});
      expect(description.parseDescription("w:" + isostring).task).toMatchObject({'wait':isostring});
    });
    it('understands "until" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("until:" + isostring).task).toMatchObject({'until':isostring});
      expect(description.parseDescription("unti:" + isostring).task).toMatchObject({'until':isostring});
      expect(description.parseDescription("unt:" + isostring).task).toMatchObject({'until':isostring});
      expect(description.parseDescription("un:" + isostring).task).toMatchObject({'until':isostring});
      expect(description.parseDescription("u:" + isostring).task).toMatchObject({'until':isostring});
    });
    it('understands "scheduled" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("scheduled:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("schedule:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("schedul:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("schedu:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sched:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sche:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sch:" + isostring).task).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sc:" + isostring).task).toMatchObject({'scheduled':isostring});
    });
    it('understands "start" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("start:" + isostring).task).toMatchObject({'start':isostring});
      expect(description.parseDescription("star:" + isostring).task).toMatchObject({'start':isostring});
      expect(description.parseDescription("sta:" + isostring).task).toMatchObject({'start':isostring});
      expect(description.parseDescription("st:" + isostring).task).toMatchObject({'start':isostring});
    });
    it('understands "annotations" and substrings',() =>{
      expect(description.parseDescription("annotations:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotation:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotatio:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotati:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotat:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annota:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annot:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("ann:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("an:anannotation").task).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("a:anannotation").task).toMatchObject({'annotations':['anannotation']});
    });
    it('understands multiple annotations',() =>{
      expect(description.parseDescription("annotations:anannotation annotations:anotherannotation").task)
        .toMatchObject({'annotations':['anannotation','anotherannotation']});
    });
    it('understands comma sepparated annotations',() =>{
      expect(description.parseDescription("annotations:anannotation,anotherannotation").task)
        .toMatchObject({'annotations':['anannotation','anotherannotation']});
    });
    it('understands non keyword words as description',() => {
      expect(description.parseDescription("simple description").task)
        .toMatchObject({'description':"simple description"});
    });
    it('understands non keyword words as description',() => {
      expect(description.parseDescription("simple +atag description").task)
        .toMatchObject({'description':"simple description"});
    });
    it('understands unknown keywords as description',() => {
      expect(description.parseDescription("an unknown:keyword as description").task)
        .toMatchObject({'description':"an unknown:keyword as description"});
    });
    it('understands single quoted tokens',() => {
      expect(description.parseDescription("'quoted token' ").task)
        .toMatchObject({'description':"quoted token"});
    });
    it('understands double quoted tokens',() => {
      expect(description.parseDescription('a "quoted token" ').task)
        .toMatchObject({'description':"quoted token"});
    });
    it('understands double quoted tokens with escaped double quotes',() => {
      expect(description.parseDescription('a "quoted \\"token" ').task)
        .toMatchObject({'description':"quoted \"token"});
    });
    it('understands single quoted tokens with escaped single quotes',() => {
      expect(description.parseDescription("'quoted \\'token' ").task)
        .toMatchObject({'description':"quoted \'token"});
    });
    it('understands single quoted tokens with escaped single quotes',() => {
      expect(description.parseDescription("'quoted \\'token' ").task)
        .toMatchObject({'description':"quoted 'token"});
    });
    it('understands single quotes within double quotes',() => {
      expect(description.parseDescription('a "quoted \'token"').task)
        .toMatchObject({'description':"quoted 'token"});
    });
    it('understands double quotes within single quotes',() => {
      expect(description.parseDescription("'quoted \"token'").task)
        .toMatchObject({'description':"quoted \"token"});
    });
    it('understands tags with double quotes',() => {
      expect(description.parseDescription('+"quoted tag"').task)
        .toMatchObject({'tags':["quoted tag"]});
    });
    it('understands tags with single quotes',() => {
      expect(description.parseDescription("+'quoted tag'").task)
        .toMatchObject({'tags':["quoted tag"]});
    });
    it('understands tags with escaped whitespace',() => {
      expect(description.parseDescription("+escaped\\ whitespace").task)
        .toMatchObject({'tags':["escaped whitespace"]});
    });
    it('understands keywords with double quotes',() => {
      expect(description.parseDescription('annotations:"quoted tag"').task)
        .toMatchObject({'annotations':["quoted tag"]});
    });
    it('understands keywords with single quotes',() => {
      expect(description.parseDescription("annotations:'quoted tag'").task)
        .toMatchObject({'annotations':["quoted tag"]});
    });
    it('understands keywords with escaped whitespace',() => {
      expect(description.parseDescription("annotations:escaped\\ whitespace").task)
        .toMatchObject({'annotations':["escaped whitespace"]});
    });
    it('understands comma separated quoted strings for annotations',() => {
      expect(description.parseDescription("annotations:\"quoted annotation\",'another quoted annotation'").task)
        .toMatchObject({'annotations':["quoted annotation","another quoted annotation"]});
    });
    it('understands comma separated quoted strings for tags',() => {
      expect(description.parseDescription("+\"quoted tag\",'another quoted tag'").task)
        .toMatchObject({'tags':["quoted tag","another quoted tag"]});
    });
    it('understands escaped whitespace in comma separated annotations',() => {
      expect(description.parseDescription("annotations:quoted\\ annotation,another\\ quoted\\ annotation").task)
        .toMatchObject({'annotations':["quoted annotation","another quoted annotation"]});
    });
    it('understands escaped whitespace in comma separated tags',() => {
      expect(description.parseDescription("+quoted\\ tag,another\\ quoted\\ tag").task)
        .toMatchObject({'tags':["quoted tag","another quoted tag"]});
    });
    it('understands natural language relative dates for schedule.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("scheduled:tomorrow").task;
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['scheduled']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it('understands natural language relative dates for until.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("until:tomorrow").task;
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['until']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it('understands natural language relative dates for due.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("due:tomorrow").task;
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['due']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it('understands natural language relative dates for wait.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("wait:tomorrow").task;
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['wait']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it.each`
      keyword     | command
      ${"add"}    | ${"add"}
      ${"ad"}     | ${"add"}
      ${"a"}      | ${"add"}
      ${"filter"} | ${"filter"}
      ${"filte"}  | ${"filter"}
      ${"filt"}   | ${"filter"}
      ${"fil"}    | ${"filter"}
      ${"fi"}     | ${"filter"}
      ${"f"}      | ${"filter"}
    `
    ("understands $command command when beginning with $keyword",({keyword, command})=>{
      expect(description.parseDescription(keyword + " atask")).toMatchObject({
        'command':command,
      });
    });
    it("defaults to the filter command",() => {
      expect(description.parseDescription("atask")).toMatchObject({
        'command':'filter',
      });
    });
  });
});
