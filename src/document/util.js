//*****************************************************************************
//*****************************************************************************
//
// Document utilities
//
//*****************************************************************************
//*****************************************************************************

import {isGzip, gzip, gunzip} from "../util/compress"
import {uuid, nanoid} from "../util"

export {uuid, nanoid}

const fs = require("../system/localfs");

const utf8decoder = new TextDecoder();

//-----------------------------------------------------------------------------
// Determine file type by extension
//-----------------------------------------------------------------------------

export function getSuffix(filename, suffixes) {
  return suffixes.find(suffix => filename.endsWith(suffix))
}

export function suffix2format(f, suffixes = [".mawe", ".mawe.gz", ".moe"]) {
  const suffix = getSuffix(f, suffixes)
  return {
    ".mawe": "mawe",
    ".mawe.gz": "mawe",
    ".moe": "moe",
  }[suffix]
}

//-----------------------------------------------------------------------------
// Loading & generating buffers and trees.
//-----------------------------------------------------------------------------

export async function file2buf(file) {
  const buffer = await fs.read(file.id, null);
  const compressed = isGzip(buffer)
  //console.log("Buffer:", buffer)
  //console.log("isGzip:", compressed)
  return decodebuf(compressed ? gunzip(buffer) : buffer);
}

export function decodebuf(buffer) {
  return utf8decoder.decode(buffer)
}

export async function buf2file(doc, buffer) {
  const file = doc.file;

  // Sanity check here: make sure that buffer is extracted to the same doc as
  // sent for saving.
  //console.log(file)

  /*
  return await fs.write("savetest.mawe", buffer);
  /*/
  if(file.id.endsWith(".gz")) {
    return await fs.write(file.id, gzip(buffer, {level: 9}));
  } else {
    return await fs.write(file.id, buffer);
  }
  /**/
}

//-----------------------------------------------------------------------------
// History entry date stamps
//-----------------------------------------------------------------------------

export function createDateStamp(date) {
  if(!date) date = new Date()
  return date.toISOString().split("T")[0]
}

//-----------------------------------------------------------------------------

export function filterCtrlElems(blocks) {
  const ctrltypes = ["hact", "hchapter", "hscene"]
  return blocks.filter(block => !ctrltypes.includes(block.type))
}

export function elemAsText(elem) {
  if(!elem?.children) return ""
  return (
    elem.children
    .map(elem => elem.text)
    .join("")
  )
}

export function elemHeading(elem) {

  const [first] = elem.children ?? []
  if(first) {
    if(
      (elem.type === "act" && first.type === "hact") ||
      (elem.type === "chapter" && first.type === "hchapter") ||
      (elem.type === "scene" && first.type === "hscene")
    ) {
      return first
    }
  }

  return undefined
}

export function elemName(elem) {
  return elemAsText(elemHeading(elem))
}

export function elemNumbered(elem) {
  return elemHeading(elem)?.numbered
}

//-----------------------------------------------------------------------------
// Element tags
//-----------------------------------------------------------------------------

export function elemTags(elem) {
  if(!elem?.children) return []
  if(elem.type !== "tags") return []
  return elemAsText(elem).split(",").map(s => s.trim().toLowerCase()).filter(s => s)
}

//-----------------------------------------------------------------------------
// Split words only: This includes only words in paragraphs, not words in
// comments, synopses, chapter & section headers and so on.
//-----------------------------------------------------------------------------

export function text2words(text) {
  //return text.split(/[^\wåäö]+/i).filter(word => word.length)
  return text.split(/[^\p{L}\p{N}]+/iu).filter(word => word.length)
}

export function wordcount(text) {
  return text2words(text).length
}

export function createWordTable(section) {
  const wt = new Map()

  for(const act of section.acts) {
    for(const chapter of filterCtrlElems(act.children)) {
      for(const scene of filterCtrlElems(chapter.children)) {
        for(const p of scene.children) {
          if(p.type !== "p") continue
          for(const word of text2words(elemAsText(p))) {
            const lowcase = word.toLowerCase()
            const count = wt.has(lowcase) ? wt.get(lowcase) : 0
            wt.set(lowcase, count + 1)
          }
        }
      }
    }
  }

  return wt
}

//-----------------------------------------------------------------------------
// Create tag table from section
//-----------------------------------------------------------------------------

export function createTagTable(section) {
  const tags = new Set()

  for(const act of section.acts) {
    for(const chapter of filterCtrlElems(act.children)) {
      for(const scene of filterCtrlElems(chapter.children)) {
        for(const p of scene.children) {
          const keys = elemTags(p)
          for(const key of keys) {
            tags.add(key);
          }
        }
      }
    }
  }

  return Array.from(tags)
}

//-----------------------------------------------------------------------------
// Count words
//-----------------------------------------------------------------------------

function wcParagraph(elem) {
  const text = elemAsText(elem)
  const chars = text.length
  const words = text2words(text)
  const wc = words.length

  switch(elem.type) {
    //case "p": return { chars, text: wc, map: words2map(words) }
    case "p": return { chars, text: wc }
    case "missing": return { chars, missing: wc }
    case "fill":
      const fill = Math.max(0, parseInt(text))
      //console.log("Fill:", fill)
      return { missing: (isNaN(fill) ? 0 : fill) }
  }
  return undefined
}

export function wcChildren(children) {
  return children.filter(elem => elem.words).reduce((words, elem) => ({
    chars: words.chars + (elem.words.chars ?? 0),
    text: words.text + (elem.words.text ?? 0),
    missing: words.missing + (elem.words.missing ?? 0),
  }), {chars: 0, text: 0, missing: 0})
}

export function wcElem(elem) {

  switch(elem.type) {
    case "sect":
    case "act":
    case "chapter":
    case "scene":
      return wcChildren(elem.children)

    case "p":
    case "missing":
    case "fill":
      return wcParagraph(elem)

    default:
    //case "synopsis":
    //case "tag":
    //case "comment":
    //case "br":
      break;
  }
  return undefined
}

export function wcCompare(a, b) {
  return (
    a?.chars === b?.chars &&
    a?.text === b?.text &&
    a?.missing === b?.missing
  )
}

export function wcCumulative(section) {
  const flat = new Array()

  for(const act of section.acts) {
    flat.push(act)
    for(const chapter of act.children) {
      flat.push(chapter)
      for(const scene of chapter.children) {
        flat.push(scene)
      }
    }
  }

  const cumulative = {}
  var summed = 0

  for(const elem of flat) {
    if(elem.type === "scene") summed += elem.words?.text + elem.words?.missing
    cumulative[elem.id] = summed
  }

  return cumulative
}
