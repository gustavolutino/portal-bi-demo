'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),client=path.join(root,'clients/agromatic');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function validate(d){
 assert.equal(d.synthetic,true,'Solo fuentes sintéticas permitidas en este repositorio público');
 for(const key of ['months','zones','families','clients','commercial','stock','quality'])assert(Array.isArray(d[key])&&d[key].length,'Colección ausente: '+key);
 assert(/^\d{4}-\d{2}-\d{2}$/.test(d.cutoff),'Corte inválido');assert(d.months.includes(d.cutoff.slice(0,7)),'Corte fuera del histórico');
 function unique(rs,key){const keys=rs.map(key);assert.equal(new Set(keys).size,keys.length,'Clave duplicada');}
 unique(d.clients,x=>x.id);unique(d.commercial,x=>[x.month,x.client].join('|'));unique(d.stock,x=>[x.month,x.zone,x.sku].join('|'));unique(d.quality,x=>[x.month,x.zone].join('|'));
 const ids=new Set(d.clients.map(x=>x.id));
 for(const x of d.clients)assert(d.zones.includes(x.zone),'Zona de cliente inválida');
 function nums(x,keys){for(const k of keys)assert(typeof x[k]==='number'&&Number.isFinite(x[k])&&x[k]>=0,'Número inválido: '+k);}
 for(const x of d.commercial){assert(ids.has(x.client),'Cliente huérfano');assert(d.months.includes(x.month)&&d.zones.includes(x.zone)&&d.families.includes(x.family),'Dimensión comercial inválida');nums(x,['planned','visits','orders','delivered','gross','discount','sales','cost','target','ly','routeCost','km','debt','overdue','capacity']);assert(x.delivered<=x.orders&&x.orders<=x.visits&&x.visits<=x.planned,'Secuencia operativa inconsistente');assert(Math.abs(x.gross-x.discount-x.sales)<.02,'Venta neta no concilia');assert(x.overdue<=x.debt,'Mora mayor a saldo');}
 for(const x of d.stock){assert(d.months.includes(x.month)&&d.zones.includes(x.zone)&&d.families.includes(x.family),'Dimensión de inventario inválida');nums(x,['stock','unitCost','demand','stockStart','unitsSold','noMoveDays','leadDays']);}
 for(const x of d.quality){assert(d.months.includes(x.month)&&d.zones.includes(x.zone),'Dimensión de calidad inválida');nums(x,['records','valid','missing','duplicates','unmatched','source','portal','lagHours']);assert.equal(x.records,x.valid+x.missing+x.duplicates+x.unmatched,'Lote de control inconsistente');const net=d.commercial.filter(r=>r.month===x.month&&r.zone===x.zone).reduce((s,r)=>s+r.sales,0);assert(Math.abs(net-x.source)<.02,'Referencia monetaria no concilia');}
 return true;
}
function run(){
 const source=path.join(__dirname,'sources/agromatic-demo.json'),bytes=fs.readFileSync(source),data=JSON.parse(bytes);validate(data);
 const dir=path.join(root,'.build');fs.mkdirSync(dir,{recursive:true});for(const layer of ['bronze','silver','gold'])fs.mkdirSync(path.join(dir,layer),{recursive:true});
 fs.writeFileSync(path.join(dir,'bronze/source.json'),bytes);
 // Silver conserva claves y números validados. No corrige silenciosamente la fuente.
 const silver=JSON.stringify(data);fs.writeFileSync(path.join(dir,'silver/validated.json'),silver);
 const output=JSON.stringify(data);fs.writeFileSync(path.join(client,'data.json'),output);fs.writeFileSync(path.join(dir,'gold/data.json'),output);
 execFileSync(process.execPath,[path.join(client,'tests/metrics.cjs')],{stdio:'inherit'});
 const metrics=require(path.join(client,'metrics.js')),config=JSON.parse(fs.readFileSync(path.join(client,'client-config.json')));
 const products=config.modules.map(m=>{const r=metrics.analyze(data,m.id);return {id:m.id,title:m.title,kpis:r.kpis.length,charts:r.charts.length};});
 const report={schemaVersion:1,mode:'synthetic',status:'validated',builtAt:new Date().toISOString(),cutoff:data.cutoff,runId:process.env.GITHUB_RUN_ID||null,commit:process.env.GITHUB_SHA||null,sourceSha256:hash(bytes),datasetSha256:hash(output),counts:{clients:data.clients.length,commercial:data.commercial.length,inventory:data.stock.length,quality:data.quality.length},products,checks:['Fuente marcada como sintética','Claves únicas y relaciones válidas','Secuencia visitas-pedidos-entregas','Venta neta y cartera conciliadas','Inventario por foto mensual','Referencia monetaria del lote de control','378 combinaciones de KPI y 8 grupos de pruebas'],stages:[{name:'Bronze',description:'Copia íntegra de la fuente demo versionada'},{name:'Silver',description:'Validación de tipos, claves, referencias y conciliación'},{name:'Gold',description:'Dataset de consumo de los siete productos analíticos'},{name:'Publicación',description:'Paquete estático; despliegue solo tras validar en main'}]};
 fs.writeFileSync(path.join(client,'pipeline-status.json'),JSON.stringify(report,null,2)+'\n');
 const manifestPath=path.join(client,'release.json'),manifest=JSON.parse(fs.readFileSync(manifestPath));
 for(const name of ['arquitectura.html','architecture.js','pipeline-status.json'])manifest.files[name]={};
 for(const name of Object.keys(manifest.files)){const b=fs.readFileSync(path.join(client,name));manifest.files[name]={size:b.length,sha256:hash(b)};}manifest.builtAt=report.builtAt;manifest.files['pipeline-status.json']={size:fs.statSync(path.join(client,'pipeline-status.json')).size,sha256:hash(fs.readFileSync(path.join(client,'pipeline-status.json')))};fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 const dist=path.join(root,'dist');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist);
 for(const name of fs.readdirSync(root)){const p=path.join(root,name);if(fs.statSync(p).isFile()&&(/\.(html|css|js|json)$/.test(name)||name==='.nojekyll'))fs.copyFileSync(p,path.join(dist,name));}
 for(const name of ['clients','releases'])fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true,filter:p=>!p.split(path.sep).includes('tests')&&!p.endsWith('README.md')});
 fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('Paquete validado: dist/; informe: .build/report.json');return report;
}
module.exports={validate};if(require.main===module)run();
