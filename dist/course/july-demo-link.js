import {JULY_EPISODE} from './crisis-chapter.js';

export const isJulyDemo=params=>params.get('episode')===JULY_EPISODE;

export function julyDemoURL(path,language){
 const query=new URLSearchParams({episode:JULY_EPISODE,lang:language});
 return path+'?'+query;
}
