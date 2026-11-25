#!/usr/bin/env node
// Genera los vídeos explicativos a partir de guiones.mjs. Solo macOS:
//   - fotogramas: Google Chrome sin interfaz (captura de una página HTML por punto)
//   - narración:  `say` con la voz Mónica (es_ES)
//   - montaje:    ffmpeg
// Uso: node 03-videos/generar.mjs [número...]     p. ej.  node 03-videos/generar.mjs 02 05
import { execFile } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { VIDEOS } from './guiones.mjs'

const ejecutar = promisify(execFile)
const AQUI = fileURLToPath(new URL('.', import.meta.url))
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const VOZ = process.env.VOZ ?? 'Mónica'
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const pagina = (video, cuerpo, progreso) => `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box} body{margin:0;width:1920px;height:1080px;background:#f6f5f1;color:#1c1d1f;font-family:-apple-system,"Helvetica Neue",sans-serif;overflow:hidden}
.cab{position:absolute;top:56px;left:96px;right:96px;display:flex;justify-content:space-between;font-size:26px;color:#5d6168;letter-spacing:.04em;text-transform:uppercase}
.pie{position:absolute;left:0;bottom:0;height:10px;background:#0f6e66;width:${progreso}%}
.portada{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 160px}
.portada small{font-size:34px;color:#0f6e66;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.portada h1{font-size:112px;line-height:1.05;margin:24px 0 0;letter-spacing:-.02em}
.escena{position:absolute;top:150px;left:96px;right:96px;bottom:70px;display:grid;gap:60px;align-items:center}
.escena.con-codigo{grid-template-columns:1.15fr 1fr}
h2{font-size:68px;line-height:1.1;margin:0 0 44px;letter-spacing:-.015em}
ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:24px}
li{font-size:40px;line-height:1.25;padding:20px 28px;border-radius:16px;border-left:10px solid #d9d6cc;background:#fff;color:#8b8f96}
li.actual{border-color:#0f6e66;color:#1c1d1f;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.08)}
pre{margin:0;background:#1c1e22;color:#eceae4;font:30px/1.5 Menlo,monospace;padding:40px;border-radius:20px;white-space:pre-wrap}
</style>
<div class="cab"><span>Módulo ${video.n} · ${esc(video.titulo)}</span><span>Desarrollo de software con IA</span></div>
${cuerpo}<div class="pie"></div>`

function fotogramas(video) {
  const lista = [{ html: `<div class="portada"><small>Módulo ${video.n}</small><h1>${esc(video.titulo)}</h1></div>`, voz: `${video.titulo}.` }]
  for (const escena of video.escenas) {
    escena.p.forEach(([, voz], i) => {
      const puntos = escena.p.slice(0, i + 1).map(([texto], j) => `<li class="${j === i ? 'actual' : ''}">${esc(texto)}</li>`).join('')
      lista.push({
        html: `<div class="escena${escena.c ? ' con-codigo' : ''}"><div><h2>${esc(escena.t)}</h2><ul>${puntos}</ul></div>${escena.c ? `<pre>${esc(escena.c)}</pre>` : ''}</div>`,
        voz,
      })
    })
  }
  return lista
}

async function enParalelo(tareas, limite) {
  const cola = [...tareas]
  await Promise.all(Array.from({ length: limite }, async () => { while (cola.length) await cola.shift()() }))
}

async function generar(video) {
  const tmp = mkdtempSync(join(tmpdir(), `video-${video.n}-`))
  const lista = fotogramas(video)
  await enParalelo(lista.map((f, i) => async () => {
    const base = join(tmp, String(i).padStart(3, '0'))
    writeFileSync(`${base}.html`, pagina(video, f.html, ((i + 1) / lista.length) * 100))
    writeFileSync(`${base}.txt`, f.voz)
    await ejecutar(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1920,1080', `--user-data-dir=${base}-perfil`, `--screenshot=${base}.png`, `file://${base}.html`])
    await ejecutar('say', ['-v', VOZ, '-r', '178', '-f', `${base}.txt`, '-o', `${base}.aiff`])
    await ejecutar('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-framerate', '25', '-i', `${base}.png`, '-i', `${base}.aiff`,
      '-af', 'apad=pad_dur=0.5', '-c:v', 'libx264', '-tune', 'stillimage', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '25',
      '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2', '-shortest', `${base}.mp4`])
  }), 6)
  writeFileSync(join(tmp, 'lista.txt'), lista.map((_, i) => `file '${join(tmp, String(i).padStart(3, '0'))}.mp4'`).join('\n'))
  const salida = join(AQUI, `${video.n}-${video.slug}.mp4`)
  await ejecutar('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'lista.txt'), '-c', 'copy', '-movflags', '+faststart', salida])
  rmSync(tmp, { recursive: true, force: true })
  console.log(`${video.n}-${video.slug}.mp4  (${lista.length} fotogramas)`)
}

// Los guiones, también en Markdown para leerlos o grabarlos con voz propia.
const md = ['# Guiones de los vídeos', '', 'Generados desde `guiones.mjs`. Para regenerar un vídeo tras cambiar su guion: `node 03-videos/generar.mjs <número>` y después `node 04-site/build.mjs`.', '']
for (const v of VIDEOS) {
  md.push(`## ${v.n} · ${v.titulo}`, '')
  for (const e of v.escenas) {
    md.push(`### ${e.t}`, '', '| En pantalla | Narración |', '|---|---|', ...e.p.map(([a, b]) => `| ${a} | ${b} |`), '')
    if (e.c) md.push('```text', e.c, '```', '')
  }
}
writeFileSync(join(AQUI, 'guiones.md'), md.join('\n'))

const pedidos = process.argv.slice(2)
for (const video of VIDEOS.filter((v) => !pedidos.length || pedidos.includes(v.n))) await generar(video)
