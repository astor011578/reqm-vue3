const e=()=>{let e=new Date,t=e.getFullYear(),a=e.getMonth()+1,n=e.getDate();return[t,a<10?`0${a}`:a,n<10?`0${n}`:n].join("/")},t=e=>{let t;switch(typeof e){case"object":t=e||"";break;case"string":t=""!==e?new Date(e):""}if(t){let e=t.getFullYear(),a=t.getMonth()+1,n=t.getDate();return[e,a<10?"0"+a:a,n<10?"0"+n:n].join("/")}return""},a=()=>(new Date).getTime();export{e as a,t as d,a as g};
