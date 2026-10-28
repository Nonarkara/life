// Rebuild editable fields without deleting the static comparison/radar beside them.
export function resetProfileFields(editor){
 let fields=editor.querySelector('#profile-fields');
 if(!fields){fields=document.createElement('div');fields.id='profile-fields';editor.prepend(fields);}
 fields.replaceChildren();
 return fields;
}
