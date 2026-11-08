// Duplica uma comp-base do After Effects para cada .mov de uma pasta, mantendo as camadas de ajuste.
// Edite as quatro linhas abaixo e rode com o After aberto:  AfterFX.exe -r "C:\caminho\linked_comps.jsx"
// Precisa de "Permitir que scripts gravem arquivos e acessem a rede" ligado nas preferências.
(function () {
  var BASE = 'Linked Comp 01';               // comp com as camadas de ajuste e um vídeo
  var PASTA = 'C:/caminho/out/final_1080/';  // pasta com os .mov
  var PREFIXO = 'Linked Comp ';              // início do nome das comps novas
  var INICIO = 2;                            // número da primeira comp nova

  var LOG = [];
  function p(s) { LOG.push(s); }
  app.beginUndoGroup('Linked comps');
  try {
    var pr = app.project, src = null, i, j;
    for (i = 1; i <= pr.numItems; i++) {
      if (pr.item(i) instanceof CompItem && pr.item(i).name === BASE) { src = pr.item(i); break; }
    }
    if (!src) throw 'comp-base nao encontrada: ' + BASE;
    var usado = (function () {
      for (var a = 1; a <= src.numLayers; a++) {
        var l = src.layer(a);
        if (!l.adjustmentLayer && l.source && l.source.mainSource && l.source.mainSource.file) return l.source.name;
      }
      return '';
    })();
    var arquivos = new Folder(PASTA).getFiles('*.mov');
    arquivos.sort(function (a, b) { return a.name < b.name ? -1 : 1; });
    var fold = pr.items.addFolder('Linked Comps');
    var ff = pr.items.addFolder('Camadas'); ff.parentFolder = fold;
    var n = INICIO;
    for (var k = 0; k < arquivos.length; k++) {
      var nome = decodeURI(arquivos[k].name);
      if (nome === usado) continue;
      var foot = pr.importFile(new ImportOptions(arquivos[k]));
      foot.parentFolder = ff;
      var c = src.duplicate();
      c.name = PREFIXO + (n < 10 ? '0' : '') + n + ' (' + nome.replace('.mov', '') + ')';
      n++;
      c.parentFolder = fold;
      c.duration = foot.duration;
      var fl = null;
      for (j = 1; j <= c.numLayers; j++) {
        var ly = c.layer(j);
        if (!ly.adjustmentLayer && ly.source && ly.source.mainSource && ly.source.mainSource.file) fl = ly;
      }
      if (!fl) throw 'camada de video nao encontrada em ' + c.name;
      fl.replaceSource(foot, false);
      fl.name = foot.name;
      fl.startTime = 0; fl.inPoint = 0; fl.outPoint = c.duration;
      for (j = 1; j <= c.numLayers; j++) {
        var aj = c.layer(j);
        if (aj.adjustmentLayer) { aj.startTime = 0; aj.inPoint = 0; aj.outPoint = c.duration; }
      }
      p(c.name + ' | ' + c.duration + ' s');
    }
    pr.save();
    p('SALVO ' + pr.file.fsName);
  } catch (err) {
    p('ERRO ' + err.toString() + ' linha ' + err.line);
  }
  app.endUndoGroup();
  var f = new File(PASTA + 'linked_comps.txt');
  f.encoding = 'UTF-8'; f.open('w'); f.write(LOG.join('\n')); f.close();
})();
