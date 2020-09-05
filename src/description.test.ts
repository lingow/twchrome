import * as description from './description'


describe('description',() =>{
  describe('parseDescription',() => {
    it('understands tags',() =>{
      expect(description.parseDescription("+atag")).toMatchObject({'tags':['atag']});
    });
    it('understands multiple tags',() =>{
      expect(description.parseDescription("+atag +anothertag"))
        .toMatchObject({'tags':['atag','anothertag']});
    });
    it('understands comma separated tags',() =>{
      expect(description.parseDescription("+atag,anothertag"))
        .toMatchObject({'tags':['atag','anothertag']});
    });
    it('understands "project" and substrings',() =>{
      expect(description.parseDescription("projec:aproject")).toMatchObject({'project':'aproject'});
      expect(description.parseDescription("proje:aproject")).toMatchObject({'project':'aproject'});
      expect(description.parseDescription("proj:aproject")).toMatchObject({'project':'aproject'});
      expect(description.parseDescription("pro:aproject")).toMatchObject({'project':'aproject'});
    });
    it('understands "priority" and substrings',() =>{
      expect(description.parseDescription("priority:H")).toMatchObject({'priority':'H'});
      expect(description.parseDescription("priorit:H")).toMatchObject({'priority':'H'});
      expect(description.parseDescription("priori:H")).toMatchObject({'priority':'H'});
      expect(description.parseDescription("prior:H")).toMatchObject({'priority':'H'});
      expect(description.parseDescription("prio:H")).toMatchObject({'priority':'H'});
      expect(description.parseDescription("pri:H")).toMatchObject({'priority':'H'});
    });
    it('understands priorities H M and L',() =>{
      expect(description.parseDescription("priority:H")).toMatchObject({'priority':'H'});
      expect(description.parseDescription("priority:M")).toMatchObject({'priority':'M'});
      expect(description.parseDescription("priority:L")).toMatchObject({'priority':'L'});
    });
    it('understands "depends" and substrings',() =>{
      expect(description.parseDescription("depends:10")).toMatchObject({'depends':['10']});
      expect(description.parseDescription("depend:10")).toMatchObject({'depends':['10']});
      expect(description.parseDescription("depen:10")).toMatchObject({'depends':['10']});
      expect(description.parseDescription("depe:10")).toMatchObject({'depends':['10']});
      expect(description.parseDescription("dep:10")).toMatchObject({'depends':['10']});
      expect(description.parseDescription("de:10")).toMatchObject({'depends':['10']});
    });
    it('understands multiple "depends"',() =>{
      expect(description.parseDescription("depends:10 depends:11"))
        .toMatchObject({'depends':['10','11']});
    });
    it('understands "due" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("due:" + isostring)).toMatchObject({'due':isostring});
      expect(description.parseDescription("du:" + isostring)).toMatchObject({'due':isostring});
    });
    it('understands "wait" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("wait:" + isostring)).toMatchObject({'wait':isostring});
      expect(description.parseDescription("wai:" + isostring)).toMatchObject({'wait':isostring});
      expect(description.parseDescription("wa:" + isostring)).toMatchObject({'wait':isostring});
      expect(description.parseDescription("w:" + isostring)).toMatchObject({'wait':isostring});
    });
    it('understands "until" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("until:" + isostring)).toMatchObject({'until':isostring});
      expect(description.parseDescription("unti:" + isostring)).toMatchObject({'until':isostring});
      expect(description.parseDescription("unt:" + isostring)).toMatchObject({'until':isostring});
      expect(description.parseDescription("un:" + isostring)).toMatchObject({'until':isostring});
      expect(description.parseDescription("u:" + isostring)).toMatchObject({'until':isostring});
    });
    it('understands "scheduled" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("scheduled:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("schedule:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("schedul:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("schedu:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sched:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sche:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sch:" + isostring)).toMatchObject({'scheduled':isostring});
      expect(description.parseDescription("sc:" + isostring)).toMatchObject({'scheduled':isostring});
    });
    it('understands "start" and substrings',() =>{
      const event = new Date('2020-07-10');
      const isostring = event.toISOString()
      expect(description.parseDescription("start:" + isostring)).toMatchObject({'start':isostring});
      expect(description.parseDescription("star:" + isostring)).toMatchObject({'start':isostring});
      expect(description.parseDescription("sta:" + isostring)).toMatchObject({'start':isostring});
      expect(description.parseDescription("st:" + isostring)).toMatchObject({'start':isostring});
    });
    it('understands "annotations" and substrings',() =>{
      expect(description.parseDescription("annotations:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotation:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotatio:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotati:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annotat:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annota:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("annot:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("ann:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("an:anannotation")).toMatchObject({'annotations':['anannotation']});
      expect(description.parseDescription("a:anannotation")).toMatchObject({'annotations':['anannotation']});
    });
    it('understands multiple annotations',() =>{
      expect(description.parseDescription("annotations:anannotation annotations:anotherannotation"))
        .toMatchObject({'annotations':['anannotation','anotherannotation']});
    });
    it('understands comma sepparated annotations',() =>{
      expect(description.parseDescription("annotations:anannotation,anotherannotation"))
        .toMatchObject({'annotations':['anannotation','anotherannotation']});
    });
    it('understands non keyword words as description',() => {
      expect(description.parseDescription("a simple description"))
        .toMatchObject({'description':"a simple description"});
    });
    it('understands non keyword words as description',() => {
      expect(description.parseDescription("a simple +atag description"))
        .toMatchObject({'description':"a simple description"});
    });
    it('understands unknown keywords as description',() => {
      expect(description.parseDescription("an unknown:keyword as description"))
        .toMatchObject({'description':"an unknown:keyword as description"});
    });
    it('understands single quoted tokens',() => {
      expect(description.parseDescription("a 'quoted token' "))
        .toMatchObject({'description':"a quoted token"});
    });
    it('understands double quoted tokens',() => {
      expect(description.parseDescription('a "quoted token" '))
        .toMatchObject({'description':"a quoted token"});
    });
    it('understands double quoted tokens with escaped double quotes',() => {
      expect(description.parseDescription('a "quoted \\"token" '))
        .toMatchObject({'description':"a quoted \"token"});
    });
    it('understands single quoted tokens with escaped single quotes',() => {
      expect(description.parseDescription("a 'quoted \\'token' "))
        .toMatchObject({'description':"a quoted \'token"});
    });
    it('understands single quoted tokens with escaped single quotes',() => {
      expect(description.parseDescription("a 'quoted \\'token' "))
        .toMatchObject({'description':"a quoted 'token"});
    });
    it('understands single quotes within double quotes',() => {
      expect(description.parseDescription('a "quoted \'token"'))
        .toMatchObject({'description':"a quoted 'token"});
    });
    it('understands double quotes within single quotes',() => {
      expect(description.parseDescription("a 'quoted \"token'"))
        .toMatchObject({'description':"a quoted \"token"});
    });
    it('understands tags with double quotes',() => {
      expect(description.parseDescription('+"quoted tag"'))
        .toMatchObject({'tags':["quoted tag"]});
    });
    it('understands tags with single quotes',() => {
      expect(description.parseDescription("+'quoted tag'"))
        .toMatchObject({'tags':["quoted tag"]});
    });
    it('understands tags with escaped whitespace',() => {
      expect(description.parseDescription("+escaped\\ whitespace"))
        .toMatchObject({'tags':["escaped whitespace"]});
    });
    it('understands keywords with double quotes',() => {
      expect(description.parseDescription('annotations:"quoted tag"'))
        .toMatchObject({'annotations':["quoted tag"]});
    });
    it('understands keywords with single quotes',() => {
      expect(description.parseDescription("annotations:'quoted tag'"))
        .toMatchObject({'annotations':["quoted tag"]});
    });
    it('understands keywords with escaped whitespace',() => {
      expect(description.parseDescription("annotations:escaped\\ whitespace"))
        .toMatchObject({'annotations':["escaped whitespace"]});
    });
    it('understands comma separated quoted strings for annotations',() => {
      expect(description.parseDescription("annotations:\"quoted annotation\",'another quoted annotation'"))
        .toMatchObject({'annotations':["quoted annotation","another quoted annotation"]});
    });
    it('understands comma separated quoted strings for tags',() => {
      expect(description.parseDescription("+\"quoted tag\",'another quoted tag'"))
        .toMatchObject({'tags':["quoted tag","another quoted tag"]});
    });
    it('understands escaped whitespace in comma separated annotations',() => {
      expect(description.parseDescription("annotations:quoted\\ annotation,another\\ quoted\\ annotation"))
        .toMatchObject({'annotations':["quoted annotation","another quoted annotation"]});
    });
    it('understands escaped whitespace in comma separated tags',() => {
      expect(description.parseDescription("+quoted\\ tag,another\\ quoted\\ tag"))
        .toMatchObject({'tags':["quoted tag","another quoted tag"]});
    });
    it('understands natural language relative dates for schedule.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("scheduled:tomorrow");
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['scheduled']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it('understands natural language relative dates for until.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("until:tomorrow");
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['until']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it('understands natural language relative dates for due.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("due:tomorrow");
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['due']).toDateString())
        .toBe(tomorrow.toDateString());
    });
    it('understands natural language relative dates for wait.',() => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = description.parseDescription("wait:tomorrow");
      // Dates should match. Disregard hour, minutes, seconds and millis.
      expect(new Date(result['wait']).toDateString())
        .toBe(tomorrow.toDateString());
    });
  });
});
