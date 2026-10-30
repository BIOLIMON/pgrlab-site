#!/usr/bin/env node
// Build the English edition from the rendered Spanish page. Keep IDs, data attributes,
// scientific names, citations, source URLs, and publication titles identical.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
// The shared design-system script renders labels inside canvas, SVG and controls.
// Generate a locale-specific copy so the Spanish page remains untouched.
const sourceAsset = html.match(/src="(\/assets\/pgr\.[a-f0-9]+\.js)"/)?.[1];
if (!sourceAsset) throw new Error('Could not find the design-system script');
let bundle = fs.readFileSync(path.join(dist, sourceAsset.slice(1)), 'utf8');
const bundleLiterals = {
  '"genoma"':'"genome"', '"expresión"':'"expression"', '"cromatina"':'"chromatin"',
  '"fenotipo"':'"phenotype"', '"ambiente"':'"environment"', '"sequía"':'"drought"',
  '"nitrato"':'"nitrate"', '"salida"':'"output"', '"p·lógico"':'"p·logic"',
  '"compuerta"':'"gate"', '"circuito interactivo"':'"interactive circuit"',
  '"Y"':'"AND"', '"O"':'"OR"', '"Y-NO"':'"AND-NOT"',
  '"sequía Y nitrato"':'"drought AND nitrate"',
  '"sequía O nitrato"':'"drought OR nitrate"',
  '"sequía Y NO nitrato"':'"drought AND NOT nitrate"',
  '"encendida"':'"on"', '"apagada"':'"off"', '"sí"':'"yes"',
  '"Red génica"':'"Gene network"', '"factor de transcripción"':'"transcription factor"',
  '"gen"':'"gene"', '" conexiones"':'" connections"',
  '"Circuito genético ilustrativo: dos sensores y una compuerta "':'"Illustrative gene circuit: two sensors and a gate "',
  '", compuerta "':'", gate "',
  'señales</span>':'signals</span>', 'Señales de entrada':'Input signals',
  'compuerta</span>':'gate</span>', 'Compuerta lógica':'Logic gate',
  'salida</span>':'output</span>', 'ver tabla de verdad':'view truth table',
  'tabla de verdad ·':'truth table ·'
};
for (const [from, to] of Object.entries(bundleLiterals)) bundle = bundle.replaceAll(from, to);
const bundleHash = crypto.createHash('sha256').update(bundle).digest('hex').slice(0, 10);
const englishAsset = `/assets/pgr.en.${bundleHash}.js`;
fs.writeFileSync(path.join(dist, englishAsset.slice(1)), bundle);
html = html.replace(sourceAsset, englishAsset);
const text = {
  'pausar animaciones':'pause animations','pausar':'pause','menú +':'menu +',
  'investigación':'research','Lógica de las redes transcripcionales':'Logic of transcriptional networks',
  'Estrategias de adaptación a sequía':'Drought adaptation strategies',
  'Señalización y uso de nitrógeno':'Nitrogen signaling and use',
  'Multi-ómica y sistemas predictivos':'Multi-omics and predictive systems',
  'Explora una red génica':'Explore a gene network','publicaciones':'publications',
  'herramientas':'tools','equipo':'team','núcleo':'nucleus','noticias':'news','contacto':'contact',
  'Plant Genome Regulation Lab · UNAB · Núcleo Milenio PhytoLearning':'Plant Genome Regulation Lab · UNAB · PhytoLearning Millennium Nucleus',
  '¿Cómo decide una planta?':'How does a plant decide?',
  'Leemos las redes génicas con las que tomate y':'We study the gene networks through which tomato and',
  'perciben la falta de agua y de nitrógeno, y deciden entre crecer o resistir.':'sense shortages of water and nitrogen, and decide whether to grow or withstand stress.',
  'Líneas de investigación':'Research areas','sede':'based at','organismos':'organisms',
  'pasa el cursor: aparecen las espirales de Fibonacci · clic: la planta decide':'hover to reveal Fibonacci spirals · click: the plant decides',
  'toca la espiral: la planta decide':'tap the spiral: the plant decides','· estado':'· state','crecer':'grow',
  'Cuatro preguntas que se cruzan: la sequía y el nitrógeno se leen en las mismas redes.':'Four connected questions: drought and nitrogen act through the same networks.',
  'redes transcripcionales':'transcriptional networks',
  'Cómo integran las plantas señales ambientales y nutricionales a través de redes génicas dinámicas: su arquitectura, su jerarquía y la forma en que reparten recursos entre crecimiento y respuesta al estrés.':'How plants integrate environmental and nutritional signals through dynamic gene networks: their architecture, hierarchy, and allocation of resources between growth and stress responses.',
  '¿qué factor de transcripción decide?':'which transcription factor makes the decision?',
  'pasa el cursor sobre un nodo para disparar su cascada · clic para silenciarlo (knockout)':'hover over a node to trigger its cascade · click to knock it out',
  'toca un nodo para silenciarlo (knockout) y ver cómo se apaga su cascada':'tap a node to knock it out and see its cascade switch off',
  'ver más':'read more','Organismos':'Organisms',', tomate':', tomato','Enfoques':'Methods',
  'Inferencia de redes desde RNA-seq, identificación de blancos directos (TARGET), accesibilidad de cromatina':'Network inference from RNA-seq, direct target identification (TARGET), chromatin accessibility',
  'Clave':'Key study','Redes por órgano en tomate, Plant Communications 2025 ↗':'Organ-specific networks in tomato, Plant Communications 2025 ↗',
  'explora una red de ejemplo →':'explore an example network →','sequía':'drought',
  'Los programas moleculares con que las plantas anticipan y responden a la falta de agua. Comparamos el tomate cultivado con':'The molecular programs that let plants anticipate and respond to water scarcity. We compare cultivated tomato with',
  ', un pariente silvestre del desierto con un transcriptoma «listo para el estrés».':', a wild desert relative with a stress-ready transcriptome.',
  '¿cómo se prepara una planta antes de la sequía?':'how does a plant prepare for drought?',
  'prueba el circuito ilustrativo · notación SBOL':'try the illustrative circuit · SBOL notation',
  'Genómica comparada, transcriptómica, análisis de ortólogos y motivos regulatorios':'Comparative genomics, transcriptomics, analysis of orthologs and regulatory motifs',
  'Tomate del desierto «stress-ready», PLoS ONE 2025 ↗':'Stress-ready desert tomato, PLoS ONE 2025 ↗',
  'nitrógeno':'nitrogen','Señalización y eficiencia de uso de nitrógeno':'Nitrogen signaling and use efficiency',
  'Cómo detectan, interpretan y optimizan las plantas el nitrógeno disponible, desde la cromatina hasta la transcripción, y cómo esa señal se cruza con la de sequía a través de reguladores como NLP7.':'How plants detect, interpret, and optimize available nitrogen, from chromatin to transcription, and how this signal intersects with drought through regulators such as NLP7.',
  '¿se puede usar menos fertilizante sin perder rendimiento?':'can we use less fertilizer without losing yield?',
  'Dinámica de cromatina, redes transcripcionales, modelos computacionales':'Chromatin dynamics, transcriptional networks, computational models',
  'NLP7 y el antagonismo nitrógeno–sequía, PNAS 2026 ↗':'NLP7 and nitrogen–drought antagonism, PNAS 2026 ↗',
  'multi-ómica':'multi-omics',
  'Integramos datos genómicos, transcriptómicos, epigenómicos, fenotípicos y ambientales en modelos de aprendizaje automático que predicen el desempeño de la planta en el campo, con sensores e inteligencia artificial para el fenotipado.':'We integrate genomic, transcriptomic, epigenomic, phenotypic, and environmental data in machine learning models that predict plant performance in the field, using sensors and AI for phenotyping.',
  '¿podemos predecir una cosecha desde el genoma?':'can we predict a harvest from the genome?',
  'mueve el cursor sobre las pistas para leer cada capa · clic: control o sequía':'hover over tracks to read each layer · click: control or drought',
  'toca las pistas: alterna entre control y sequía':'tap the tracks to switch between control and drought',
  'Datos':'Data','Miles de experimentos públicos de RNA-seq, sensores de invernadero, imágenes':'Thousands of public RNA-seq experiments, greenhouse sensors, images',
  'Aprendizaje automático, fenotipado automático, integración multi-ómica':'Machine learning, automated phenotyping, multi-omics integration',
  'Herramientas':'Tools','haz clic sobre la raíz para sembrarla de nuevo donde quieras':'click the root to plant it again anywhere',
  'toca la raíz para sembrarla de nuevo':'tap the root to plant it again',
  'Una red, dos señales':'One network, two signals','Cambia la condición y mira qué parte de la red se enciende.':'Change the condition and see which part of the network switches on.',
  'Pasa el cursor sobre un nodo para ver a quién regula; arrástralo para reordenar la red.':'Hover over a node to see what it regulates; drag it to rearrange the network.',
  'Toca un nodo para ver a quién regula.':'Tap a node to see what it regulates.',
  'reposo':'rest','+ nitrato':'+ nitrate','ambas':'both',
  'nitrato: se enciende el módulo de nitrógeno':'nitrate: the nitrogen module switches on',
  'cómo leer la red':'how to read the network',
  'Cada forma es un tipo de nodo. Los rellenos están encendidos en la condición elegida; las líneas punteadas que se mueven son regulaciones activas.':'Each shape represents a node type. Filled shapes are active in the selected condition; moving dotted lines show active regulation.',
  'verde = nitrógeno · ocre = sequía · púrpura = cruce entre ambas':'green = nitrogen · ochre = drought · purple = interaction',
  'factor de transcripción':'transcription factor','gen':'gene','hub (nodo muy conectado, no TF)':'hub (highly connected node, not a TF)',
  'activa':'activates','reprime':'represses',
  'La red interactiva necesita JavaScript. Su contenido completo está en «la red en texto».':'The interactive network requires JavaScript. Its full content is available in “the network in text.”',
  'la red en texto':'the network in text','Nitrato':'Nitrate','Sequía':'Drought','Cruce':'Interaction',
  'NRT1.1 (hub) activa a NLP7, TGA1, bZIP1 y NRT2.1. NLP7 activa a NIA1, NIR1 y NRT2.1. TGA1 activa a NRT2.1. bZIP1 activa a ASN1.':'NRT1.1 (hub) activates NLP7, TGA1, bZIP1, and NRT2.1. NLP7 activates NIA1, NIR1, and NRT2.1. TGA1 activates NRT2.1. bZIP1 activates ASN1.',
  'NCED3 activa a SnRK2 (hub). SnRK2 activa a ABF2, ABF3 y CIPK23. ABF2 activa a RD29B y RAB18. ABF3 activa a RAB18, P5CS1 y DREB2A. DREB2A activa a RD29A.':'NCED3 activates SnRK2 (hub). SnRK2 activates ABF2, ABF3, and CIPK23. ABF2 activates RD29B and RAB18. ABF3 activates RAB18, P5CS1, and DREB2A. DREB2A activates RD29A.',
  'CIPK23 reprime a NRT1.1. SnRK2 reprime a NLP7. NLP7 reprime a ABF2.':'CIPK23 represses NRT1.1. SnRK2 represses NLP7. NLP7 represses ABF2.',
  'Esquema ilustrativo: los nodos son genes y reguladores estudiados en las respuestas a nitrato y sequía; las conexiones están simplificadas para explicar la notación y no representan un resultado publicado del laboratorio.':'Illustrative diagram: the nodes are genes and regulators studied in nitrate and drought responses. Connections are simplified to explain the notation and do not represent a published finding from the lab.',
  'Publicaciones':'Publications','todas':'all','redes':'networks','cómo citar':'how to cite','copiar':'copy',
  'Lista completa en ORCID ↗':'Full list on ORCID ↗',
  'Todavía no hay publicaciones en esta línea dentro de esta selección.':'There are no publications in this area in the current selection.',
  'Mostrar todas':'Show all','Software desarrollado en el laboratorio.':'Software developed in the lab.',
  'Explorador de redes regulatorias de plantas que integra evidencia experimental de unión (TARGET, ChIP y DAP) con anotaciones de Gene Ontology.':'Plant regulatory network explorer that combines experimental binding evidence (TARGET, ChIP, and DAP) with Gene Ontology annotations.',
  'Equipo':'Team','Investigador principal':'Principal investigator',
  'Bioquímico y doctor en Ciencias Biológicas (PUC), con postdoctorado en NYU. Académico de la Facultad de Ciencias de la Vida de la Universidad Andrés Bello y director del Núcleo Milenio PhytoLearning.':'Biochemist with a PhD in Biological Sciences (PUC) and postdoctoral training at NYU. Faculty member in Life Sciences at Universidad Andrés Bello and director of the PhytoLearning Millennium Nucleus.',
  'EMBO Global Investigator · promoción 2025 (12 seleccionados) ↗':'EMBO Global Investigator · 2025 cohort (12 selected) ↗',
  'Postdoctorado':'Postdoctoral researchers',
  'Bioinformática del laboratorio: meta-análisis transcriptómico, inferencia de redes e integración de RNA-seq a gran escala.':'Lab bioinformatics: transcriptomic meta-analysis, network inference, and large-scale RNA-seq integration.',
  'Postdoctorado Fondecyt. Circuitos genéticos sintéticos para desacoplar el crecimiento de la respuesta al estrés; vínculo nitrógeno–sequía.':'Fondecyt postdoctoral researcher. Synthetic gene circuits to uncouple growth from stress responses; nitrogen–drought interactions.',
  'Desarrollo de pelos radicales bajo estrés salino y falta de fosfato.':'Root hair development under salt stress and phosphate deficiency.',
  'Doctora en Ciencias, mención Ingeniería Genética Vegetal.':'PhD in Science, specializing in Plant Genetic Engineering.',
  'Doctorado y magíster':'PhD and master’s students',
  'Doctorado en Bioinformática y Biología de Sistemas (UNAB). Resiliencia a sequía y elementos regulatorios en tomates del desierto.':'PhD in Bioinformatics and Systems Biology (UNAB). Drought resilience and regulatory elements in desert tomatoes.',
  'Doctorado en Bioinformática y Biología de Sistemas (UNAB). Modelamiento de redes regulatorias en respuesta a estrés.':'PhD in Bioinformatics and Systems Biology (UNAB). Modeling stress-responsive regulatory networks.',
  'Doctorado en Bioinformática y Biología de Sistemas (UNAB).':'PhD in Bioinformatics and Systems Biology (UNAB).',
  'Magíster en Biotecnología (UNAB). Redes regulatorias de estrés en plantas.':'Master’s in Biotechnology (UNAB). Plant stress regulatory networks.',
  'Gestión':'Operations',
  'Encargado de administración y gestión del Núcleo PhytoLearning; estandarización de técnicas del laboratorio.':'Administration and management of the PhytoLearning Nucleus; standardization of lab techniques.',
  'Asistentes de investigación':'Research assistants',
  'Magíster en Biotecnología. Estandarizó la técnica TARGET para identificar blancos directos de factores sensibles a ABA en tomate.':'Master’s in Biotechnology. Standardized TARGET to identify direct targets of ABA-responsive factors in tomato.',
  'Efecto del nitrógeno en la resistencia a sequía en tomate.':'Effect of nitrogen on drought resistance in tomato.',
  'Apoyo a los flujos experimentales y bioinformáticos del laboratorio.':'Supports experimental and bioinformatics workflows in the lab.',
  'Ingeniero en Biotecnología (UNAB). Manejo de recursos en tomate con sensores de bajo costo y herramientas abiertas.':'Biotechnology engineer (UNAB). Tomato resource management using low-cost sensors and open tools.',
  'Tesistas':'Thesis students','Tesis de pregrado, Universidad de Chile.':'Undergraduate thesis, Universidad de Chile.',
  'Núcleo Milenio PhytoLearning':'PhytoLearning Millennium Nucleus',
  'El laboratorio es la sede del Núcleo Milenio en Ciencia de Datos y Resiliencia Vegetal, que dirige José Miguel Álvarez.':'The lab hosts the Millennium Nucleus for Data Science and Plant Resilience, directed by José Miguel Álvarez.',
  'PhytoLearning reúne a investigadores de seis universidades chilenas para entender cómo integra la planta las señales de agua y nitrógeno, entrenar modelos que identifiquen los genes que las conectan y validarlos en tomate comercial, en variedades de pequeños agricultores y en sus parientes silvestres del desierto.':'PhytoLearning brings together researchers from six Chilean universities to understand how plants integrate water and nitrogen signals, train models to identify the genes connecting them, and validate the findings in commercial tomato, smallholder varieties, and their wild desert relatives.',
  'universidades del Núcleo':'Nucleus universities','trabajos revisados por pares (ORCID)':'peer-reviewed works (ORCID)',
  'personas en el laboratorio':'people in the lab','inicio del Núcleo':'Nucleus founded',
  'Universidades del Núcleo':'Millennium Nucleus universities',
  'Workshop gratuito de tecnología single cell ↗':'Free single-cell technology workshop ↗',
  'Curso online gratuito de Python para biólogos ↗':'Free online Python course for biologists ↗',
  'PhytoLink: seis talleres de programación e IA en el Centro Educacional Menesiano de Culiprán ↗':'PhytoLink: six programming and AI workshops at the Menesian Educational Center in Culiprán ↗',
  'Niñas Pro: programación y ciencia para niñas ↗':'Niñas Pro: programming and science for girls ↗',
  'CultivaDatos: ciencia de datos junto a residentes de la Fundación Las Rosas ↗':'CultivaDatos: data science with residents of Fundación Las Rosas ↗',
  'formación ·':'training ·','divulgación ·':'outreach ·','vinculación ·':'community engagement ·',
  'Noticias':'News',
  'Algoritmos contra la escasez de agua: las redes de adaptación vegetal en el X Encuentro de Biología Vegetal':'Algorithms against water scarcity: plant adaptation networks at the 10th Plant Biology Meeting',
  'Gonzalo Ruz revela la «lógica oculta» de la genética vegetal en congreso mundial de inteligencia computacional':'Gonzalo Ruz reveals the “hidden logic” of plant genetics at a global computational intelligence congress',
  'Inscripciones abiertas: workshop gratuito de tecnología single cell':'Registration open: free single-cell technology workshop',
  'Inscripciones abiertas: curso online gratuito de Python para biólogos':'Registration open: free online Python course for biologists',
  'Descifrando el código de la sequía: cómo la IA y la genómica reescriben la supervivencia vegetal':'Decoding drought: how AI and genomics reshape plant survival',
  'PhytoLearning en la XVIII Reunión de Biología Molecular Vegetal en España':'PhytoLearning at the 18th Plant Molecular Biology Meeting in Spain',
  'PhytoLink cierra su primera etapa con seis talleres de programación e IA aplicada a la agricultura':'PhytoLink completes its first phase with six workshops on programming and AI in agriculture',
  'PhytoLearning inaugura PhytoLink en el Colegio Menesiano de Culiprán':'PhytoLearning launches PhytoLink at Colegio Menesiano de Culiprán',
  'todas las noticias en phytolearning.cl ↗':'all news on phytolearning.cl ↗',
  'Contacto':'Contact','Dirección':'Address','Av. República 330, 3er piso':'Av. República 330, 3rd floor',
  'Correo':'Email','Buscamos estudiantes de pregrado, magíster y doctorado con interés en biología de plantas, bioinformática o ciencia de datos.':'We welcome undergraduate, master’s, and PhD students interested in plant biology, bioinformatics, or data science.',
  'Escríbenos para unirte':'Get in touch to join us','Investigación':'Research','Laboratorio':'Laboratory',
  'Núcleo':'Nucleus','divulgación':'outreach','únete':'join us',
  'Plant Genome Regulation Lab · Centro de Biotecnología Vegetal · Universidad Andrés Bello':'Plant Genome Regulation Lab · Center for Plant Biotechnology · Universidad Andrés Bello',
  '↑ volver al inicio':'↑ back to top'
};

// Replace only complete text nodes, leaving names, links, IDs and citations intact.
html = html.replace(/>([^<>]+)</g, (whole, value) => {
  const trimmed = value.trim();
  const publicationNote = trimmed.match(/^Se muestran (\d+) de los (\d+) trabajos revisados por pares de la PI \(artículos, revisiones, capítulos y ponencias revisadas por pares de la PI, (\d{4}–\d{4})\)\.$/);
  const translated = text[trimmed] || (publicationNote && `Showing ${publicationNote[1]} of the PI’s ${publicationNote[2]} peer-reviewed works (articles, reviews, chapters, and peer-reviewed conference contributions, ${publicationNote[3]}).`);
  if (!translated) return whole;
  return '>' + value.replace(trimmed, translated) + '<';
});
// Localize dates in visible <time> elements without changing datetime attributes.
const months = { ene:'Jan', feb:'Feb', mar:'Mar', abr:'Apr', may:'May', jun:'Jun', jul:'Jul', ago:'Aug', sep:'Sep', oct:'Oct', nov:'Nov', dic:'Dec' };
html = html.replace(/(<time\b[^>]*>)(\d{1,2}) (ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic) (\d{4})(<\/time>)/g,
  (_, a, d, m, y, z) => `${a}${months[m]} ${Number(d)}, ${y}${z}`);

const literals = {
  "document.documentElement.lang = 'es'":"document.documentElement.lang = 'en'",
  "'reanudar animaciones'":"'resume animations'", "'pausar animaciones'":"'pause animations'",
  "'reanudar'":"'resume'", "'pausar'":"'pause'",
  "'Reanudar animaciones'":"'Resume animations'", "'Pausar animaciones'":"'Pause animations'",
  "s === 'resistir'":"s === 'resistir'", // keep the component's internal state key
  "e.textContent = s;":"e.textContent = s === 'resistir' ? 'withstand stress' : 'grow';",
  "'cerrar −'":"'close −'", "'menú +'":"'menu +'",
  "{ nitrogeno: 'nitrógeno', sequia: 'sequía', cruce: 'cruce nitrógeno–sequía' }":"{ nitrogeno: 'nitrogen', sequia: 'drought', cruce: 'nitrogen–drought interaction' }",
  "{ tf: 'factor de transcripción', gene: 'gen', hub: 'hub' }":"{ tf: 'transcription factor', gene: 'gene', hub: 'hub' }",
  "Transportador y sensor de nitrato: percibe la señal y la reparte a varios reguladores.":"Nitrate transporter and sensor: detects the signal and relays it to several regulators.",
  "Factor de transcripción central de la respuesta primaria a nitrato.":"Central transcription factor in the primary nitrate response.",
  "Factor bZIP que activa genes de transporte de nitrato.":"bZIP factor that activates nitrate transport genes.",
  "Factor que transmite la señal de nitrógeno de forma transitoria («hit-and-run»).":"Factor that transmits the nitrogen signal transiently (hit-and-run).",
  "Nitrato reductasa: primer paso de la asimilación de nitrato.":"Nitrate reductase: first step in nitrate assimilation.",
  "Nitrito reductasa: continúa la asimilación hacia amonio.":"Nitrite reductase: continues assimilation toward ammonium.",
  "Transportador de nitrato de alta afinidad en la raíz.":"High-affinity nitrate transporter in the root.",
  "Asparagina sintetasa: almacena y moviliza nitrógeno.":"Asparagine synthetase: stores and mobilizes nitrogen.",
  "Enzima clave en la síntesis de ácido abscísico (ABA) ante la falta de agua.":"Key enzyme in abscisic acid (ABA) synthesis during water scarcity.",
  "Quinasas activadas por ABA: disparan la respuesta a sequía y se cruzan con la señal de nitrógeno.":"ABA-activated kinases: trigger drought responses and interact with nitrogen signaling.",
  "Factor bZIP que responde a ABA; regulador clave de la expresión ante sequía.":"ABA-responsive bZIP factor; a key regulator of drought-responsive expression.",
  "Factor bZIP que responde a ABA, junto a ABF2 en la respuesta a sequía.":"ABA-responsive bZIP factor that acts alongside ABF2 in the drought response.",
  "Factor AP2/ERF que activa genes de tolerancia a la deshidratación.":"AP2/ERF factor that activates dehydration tolerance genes.",
  "Gen marcador de respuesta a deshidratación.":"Marker gene for the dehydration response.",
  "Gen marcador de respuesta a ABA y sequía.":"Marker gene for ABA and drought responses.",
  "Proteína de tipo dehidrina que protege a la célula al perder agua.":"Dehydrin-like protein that protects cells as they lose water.",
  "Síntesis de prolina, un osmoprotector.":"Proline synthesis, providing an osmoprotectant.",
  "Quinasa que modula a NRT1.1 y participa del cierre de estomas: un punto de cruce entre ambas señales.":"Kinase that modulates NRT1.1 and helps close stomata: a point of interaction between both signals.",
  "'reposo: la red está quieta, nada encendido'":"'rest: the network is quiet, with no active nodes'",
  "'nitrato: se enciende el módulo de nitrógeno y NLP7 frena a ABF2'":"'nitrate: the nitrogen module activates and NLP7 represses ABF2'",
  "'sequía: ABA activa SnRK2, que frena a NLP7 y apaga la entrada de nitrato'":"'drought: ABA activates SnRK2, which represses NLP7 and reduces nitrate uptake'",
  "'ambas: las dos señales compiten por los mismos reguladores'":"'both: the signals compete for the same regulators'",
  "'Red génica de nitrógeno y sequía'":"'Nitrogen and drought gene network'",
  "'activa → '":"'activates → '", "'reprime ⊣ '":"'represses ⊣ '",
  "'recibe de '":"'receives from '", "' conexiones'":"' connections'",
  "' de ' + match.length + ' publicaciones'":"' of ' + match.length + ' publications'",
  "'Mostrar menos '":"'Show fewer '", "'Mostrar las '":"'Show all '",
  "'seleccionado'":"'selected'", "'copiado'":"'copied'", "'copiar'":"'copy'"
};
for (const [from, to] of Object.entries(literals)) html = html.replaceAll(from, to);

const attributes = {
  'aria-label="Pausar animaciones"':'aria-label="Pause animations"',
  'aria-label="Principal"':'aria-label="Main navigation"',
  'aria-label="Condición"':'aria-label="Condition"',
  'aria-label="Leyenda"':'aria-label="Legend"',
  'aria-label="Filtrar por línea"':'aria-label="Filter by research area"',
  'aria-label="Divulgación y formación"':'aria-label="Outreach and training"',
  'alt="Núcleo Milenio PhytoLearning: Núcleo Milenio en Ciencia de Datos y Resiliencia Vegetal"':'alt="PhytoLearning Millennium Nucleus: Data Science and Plant Resilience"',
  'alt="Núcleo Milenio PhytoLearning"':'alt="PhytoLearning Millennium Nucleus"',
  'alt="Centro de Biotecnología Vegetal"':'alt="Center for Plant Biotechnology"',
  'alt="Retrato de José Miguel Álvarez"':'alt="Portrait of José Miguel Álvarez"',
  'title="pasa el cursor para acelerar la hélice"':'title="hover to speed up the helix"',
  'content="Laboratorio de la Universidad Andrés Bello y sede del Núcleo Milenio PhytoLearning. Estudiamos las redes génicas con las que tomate y Arabidopsis responden a la sequía y al nitrógeno."':'content="A research lab at Universidad Andrés Bello and host of the PhytoLearning Millennium Nucleus. We study gene networks that help tomato and Arabidopsis respond to drought and nitrogen availability."',
  'content="es_CL"':'content="en_US"',
  '<link rel="canonical" href="https://pgrlab.cl/">':'<link rel="canonical" href="https://pgrlab.cl/en/">',
  'content="https://pgrlab.cl/"':'content="https://pgrlab.cl/en/"',
  '<html lang="es">':'<html lang="en">',
  "subject=Quiero%20unirme%20al%20PGR%20Lab":"subject=I%20would%20like%20to%20join%20PGR%20Lab"
};
for (const [from, to] of Object.entries(attributes)) html = html.replaceAll(from, to);
html = html.replace('<li><a href="/en/" lang="en" hreflang="en" aria-label="View site in English">EN</a></li>', '');
html = html.replace('</ul></nav>', '<li><a href="/" lang="es" hreflang="es" aria-label="View site in Spanish">ES</a></li></ul></nav>');
html = html.replace('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="en_US">');
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, a, data, z) => {
  const schema = JSON.parse(data);
  const org = schema['@graph'].find((item) => item['@type'] === 'ResearchOrganization');
  const pi = schema['@graph'].find((item) => item['@type'] === 'Person' && item['@id']);
  org['@id'] = 'https://pgrlab.cl/en/#org';
  org.url = 'https://pgrlab.cl/en/';
  org.description = 'A research lab at Universidad Andrés Bello and host of the PhytoLearning Millennium Nucleus. We study gene networks that help tomato and Arabidopsis respond to drought and nitrogen availability.';
  org.address.streetAddress = 'Av. República 330, 3rd floor';
  org.member['@id'] = 'https://pgrlab.cl/en/#pi';
  pi['@id'] = 'https://pgrlab.cl/en/#pi';
  pi.jobTitle = 'Principal investigator';
  pi.affiliation['@id'] = 'https://pgrlab.cl/en/#org';
  return a + JSON.stringify(schema).replaceAll('</', '<\\/') + z;
});
fs.mkdirSync(path.join(dist, 'en'), { recursive: true });
fs.writeFileSync(path.join(dist, 'en', 'index.html'), html);

let notFound = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
notFound = notFound.replace('<html lang="es">', '<html lang="en">')
  .replace('Página no encontrada', 'Page not found')
  .replace('Esta página no existe.', 'This page does not exist.')
  .replace('Puede que la dirección haya cambiado con el nuevo sitio.', 'The address may have changed with the new site.')
  .replace('href="/">Ir a la portada', 'href="/en/">Go to the home page')
  .replaceAll('Laboratorio de la Universidad Andrés Bello y sede del Núcleo Milenio PhytoLearning. Estudiamos las redes génicas con las que tomate y Arabidopsis responden a la sequía y al nitrógeno.',
    'A research lab at Universidad Andrés Bello and host of the PhytoLearning Millennium Nucleus. We study gene networks that help tomato and Arabidopsis respond to drought and nitrogen availability.')
  .replace('content="es_CL"', 'content="en_US"')
  .replace('content="https://pgrlab.cl/"', 'content="https://pgrlab.cl/en/"');
fs.writeFileSync(path.join(dist, 'en', '404.html'), notFound);
console.log('dist/en/index.html generated');
