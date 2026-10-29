#!/usr/bin/env python3
"""Verifica que los títulos de las publicaciones del sitio coincidan con Crossref.

Uso:   python3 verificar_titulos.py "ruta/a/la/maqueta.html"
Solo usa la biblioteca estándar de Python 3.8+. Necesita internet (api.crossref.org).
Lee cada <article class="pgr-pub"> de la maqueta, toma el DOI y el título visibles y los
compara con el título depositado por la editorial. Sale con código 1 si hay diferencias.
"""
import html, json, re, sys, time, unicodedata, urllib.request

def limpiar(s):
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = unicodedata.normalize("NFKC", s)
    for ch in ("\u2010", "\u2011", "\u2012", "\u2013"):
        s = s.replace(ch, "-")
    return re.sub(r"\s+", " ", s).strip()

def clave(s):
    return limpiar(s).lower()

def crossref(doi):
    req = urllib.request.Request("https://api.crossref.org/works/" + doi, headers={"User-Agent": "verificar-titulos/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["message"]

def main(ruta):
    texto = open(ruta, encoding="utf8").read()
    arts = re.findall(r'<article class="pgr-pub"[^>]*>(.*?)</article>', texto, re.S)
    if not arts:
        print("No encontré <article class=\"pgr-pub\"> en el archivo."); return 2
    malos = 0
    for a in arts:
        m = re.search(r'<h3[^>]*>\s*<a href="https?://doi\.org/([^"]+)"[^>]*>(.*?)</a>', a, re.S)
        if not m:
            print("  ? entrada sin DOI en el título"); malos += 1; continue
        doi, visible = m.group(1), limpiar(m.group(2))
        try:
            real = limpiar(crossref(doi)["title"][0])
        except Exception as e:
            print(f"  ? {doi}: no pude consultar Crossref ({e})"); malos += 1; continue
        if clave(visible) == clave(real):
            print(f"  OK  {doi}")
        else:
            malos += 1
            print(f"  XX  {doi}\n      sitio   : {visible}\n      Crossref: {real}")
        time.sleep(0.3)
    print(f"\n{len(arts)} entradas revisadas, {malos} con problemas.")
    return 1 if malos else 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(2)
    sys.exit(main(sys.argv[1]))
