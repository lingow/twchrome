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
      expect(description.parseDescription("due:2020-07-10")).toMatchObject({'due':'2020-07-10'});
      expect(description.parseDescription("du:2020-07-10")).toMatchObject({'due':'2020-07-10'});
    });
    it('understands "wait" and substrings',() =>{
      expect(description.parseDescription("wait:2020-07-10")).toMatchObject({'wait':'2020-07-10'});
      expect(description.parseDescription("wai:2020-07-10")).toMatchObject({'wait':'2020-07-10'});
      expect(description.parseDescription("wa:2020-07-10")).toMatchObject({'wait':'2020-07-10'});
      expect(description.parseDescription("w:2020-07-10")).toMatchObject({'wait':'2020-07-10'});
    });
    it('understands "until" and substrings',() =>{
      expect(description.parseDescription("until:2020-07-10")).toMatchObject({'until':'2020-07-10'});
      expect(description.parseDescription("unti:2020-07-10")).toMatchObject({'until':'2020-07-10'});
      expect(description.parseDescription("unt:2020-07-10")).toMatchObject({'until':'2020-07-10'});
      expect(description.parseDescription("un:2020-07-10")).toMatchObject({'until':'2020-07-10'});
      expect(description.parseDescription("u:2020-07-10")).toMatchObject({'until':'2020-07-10'});
    });
    it('understands "scheduled" and substrings',() =>{
      expect(description.parseDescription("scheduled:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("schedule:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("schedul:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("schedu:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("sched:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("sche:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("sch:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
      expect(description.parseDescription("sc:2020-07-10")).toMatchObject({'scheduled':'2020-07-10'});
    });
    it('understands "start" and substrings',() =>{
      expect(description.parseDescription("start:2020-07-10")).toMatchObject({'start':'2020-07-10'});
      expect(description.parseDescription("star:2020-07-10")).toMatchObject({'start':'2020-07-10'});
      expect(description.parseDescription("sta:2020-07-10")).toMatchObject({'start':'2020-07-10'});
      expect(description.parseDescription("st:2020-07-10")).toMatchObject({'start':'2020-07-10'});
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
  });
});
