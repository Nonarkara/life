// A reading view of the saved record. Never edits outcomes or infers missing events.
const routine=new Set([
 'An ordinary five years.', 'Small habits accumulate.', 'You kept your body in use.', 'You kept learning, and it showed in your work.', 'Friends and family took most of your attention.', 'You kept making things.', 'You pushed hard at work.',
 'You continued school.', 'Family support helped with books and travel.',
 'College brought study costs and more time to learn.', 'A degree does not guarantee a job.',
 'An apprenticeship paid a little while you learned through work.',
 'Regular work supported the household.', 'You learned on the job.'
]);
export function rememberedMoments(state){
 const moments=[];
 for(const row of state.history.filter(r=>r.age>=15)){
  const outcomes=(state.story?.seen??[]).filter(e=>e.age===row.age).map(e=>e.outcome);
  let outside=row.event??'';
  for(const outcome of outcomes)outside=outside.replace(outcome,'');
  const sentences=outside.match(/[^.!?]+[.!?]+|[^.!?]+$/g)??[];
  const consequential=sentences.map(s=>s.trim()).filter(s=>s&&!routine.has(s));
  const text=[...consequential,...outcomes].join(' ');
  if(text)moments.push({age:row.age,text});
 }
 return moments;
}
