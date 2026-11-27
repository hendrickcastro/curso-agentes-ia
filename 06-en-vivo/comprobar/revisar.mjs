#!/usr/bin/env node
// Las comprobaciones de «En vivo». Las lanza el servidor en la carpeta del proyecto que dejó el agente.
// Uso: node revisar.mjs <comprobación>     Sale con 0 si se cumple y con 1 si no.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = fileURLToPath(new URL('../pokedex/', import.meta.url)) // el proyecto original, con su red intacta
const ficheros = (dir) => (existsSync(dir) ? readdirSync(dir).flatMap((n) => { const r = join(dir, n); return statSync(r).isDirectory() ? ficheros(r) : [r] }) : [])
const fuente = () => [...ficheros('src'), 'index.html'].filter((f) => /\.(js|css|html)$/.test(f) && existsSync(f))
const sinComentarios = (texto) => texto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1').replace(/<!--[\s\S]*?-->/g, '')
const codigo = () => fuente().map((f) => sinComentarios(readFileSync(f, 'utf8'))).join('\n')
const git = (...args) => (spawnSync('git', args, { encoding: 'utf8' }).stdout ?? '').trim()
const node = (...args) => spawnSync(process.execPath, args, { encoding: 'utf8' })
const fin = (bien, detalle) => { console.log(detalle); process.exit(bien ? 0 : 1) }

const COMPROBACIONES = {
  // ¿existe la tabla? Sin esto, lo demás no significa nada.
  tabla() {
    git('add', '-A', '-N')
    const nuevos = git('status', '--short', '--', 'src', 'index.html')
    const anadido = git('diff', 'HEAD', '--', 'src', 'index.html').split('\n').filter((l) => l.startsWith('+')).join('\n')
    const hay = /[<'"`]table\b|tabla-datos|role=["']grid|grid-template/.test(anadido)
    fin(hay, hay ? `Hay una tabla nueva en la web.\n${nuevos}` : 'No encuentro ninguna tabla nueva en src/ ni en index.html.')
  },
  sintaxis() {
    const rotos = fuente().filter((f) => f.endsWith('.js')).map((f) => [f, node('--check', f)]).filter(([, r]) => r.status !== 0)
    fin(rotos.length === 0, rotos.length ? rotos.map(([f, r]) => `${f}\n${r.stderr}`).join('\n') : 'Todos los módulos de JavaScript se pueden cargar.')
  },
  nombre() {
    const hay = /Tabla de combate/i.test(codigo())
    fin(hay, hay ? 'La pantalla se llama «Tabla de combate», como decidió producto.' : 'No aparece «Tabla de combate»: le ha puesto otro nombre.')
  },
  kanto() {
    const intrusos = [...new Set((codigo().match(/\b(hada|fairy|acero|steel|siniestro|dark)\b/gi) ?? []).map((t) => t.toLowerCase()))]
    fin(intrusos.length === 0, intrusos.length ? `Aparecen tipos que no existen en Kanto clásico: ${intrusos.join(', ')}.` : 'Solo usa los 15 tipos de Kanto clásico.')
  },
  mitad() {
    const texto = codigo()
    const bien = texto.includes('½') && !/×\s?0[.,]5|['"`]0[.,]5['"`]/.test(texto)
    fin(bien, bien ? 'Escribe ×½, como pide producto.' : 'No escribe «½»: usa otra notación para la mitad de daño.')
  },
  novedades() {
    const hay = existsSync('NOVEDADES.md')
    fin(hay, hay ? readFileSync('NOVEDADES.md', 'utf8').trim() : 'No existe NOVEDADES.md.')
  },
  criterio() {
    const cambios = git('status', '--short', '--', 'specs')
    fin(cambios.length > 0, cambios || 'specs/ no ha cambiado: el comportamiento nuevo no tiene criterio de aceptación.')
  },
  menu() {
    const enlaces = (existsSync('index.html') ? readFileSync('index.html', 'utf8') : '').match(/<a\s[^>]*href=["']#\/[^"']*["']/g) ?? []
    fin(enlaces.length >= 2, enlaces.length >= 2 ? `El menú de index.html tiene ${enlaces.length} enlaces.` : 'El menú de index.html sigue con un solo enlace: la pantalla nueva no está enlazada ahí.')
  },
  plan() {
    const hay = existsSync('plan.md')
    fin(hay, hay ? readFileSync('plan.md', 'utf8').slice(0, 3000) : 'No existe plan.md.')
  },
  red() {
    const r = node(join(BASE, 'tools/comprobar.mjs'))
    fin(r.status === 0, `${r.stdout}${r.stderr}`.trim())
  },
  patron() {
    const r = node(join(BASE, '.claude/skills/pantalla-nueva/scripts/validar.mjs'))
    fin(r.status === 0, `${r.stdout}${r.stderr}`.trim())
  },
  tests() {
    const r = node('--test', ...ficheros('test').filter((f) => /\.test\.m?js$/.test(f)))
    const quitadas = git('diff', 'HEAD', '-U0', '--', 'test').split('\n').filter((l) => /^-(?!--)/.test(l) && l.slice(1).trim())
    const bien = r.status === 0 && quitadas.length === 0
    fin(bien, `${r.status === 0 ? 'Los tests pasan.' : 'Hay tests en rojo.'} ${quitadas.length ? `Ha cambiado o borrado ${quitadas.length} línea(s) de tests que ya existían.` : 'No ha tocado los tests que ya existían.'}\n${`${r.stdout}`.split('\n').filter((l) => /^# (tests|pass|fail)/.test(l)).join('  ')}`)
  },
}

const elegida = COMPROBACIONES[process.argv[2]]
if (!elegida) fin(false, `Comprobación desconocida: ${process.argv[2]}. Disponibles: ${Object.keys(COMPROBACIONES).join(', ')}`)
elegida()
