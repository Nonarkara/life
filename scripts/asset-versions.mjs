// A versioned entry point must also version its relative module graph.
export function versionReferences(source,buildId){
 return source.replace(/(['"])((?:\.{1,2}\/)?[\w./-]+\.(?:js|css))\1/g,(_,quote,url)=>quote+url+'?v='+buildId+quote);
}
