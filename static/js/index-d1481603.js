import{_ as e,v as l,r as a,C as t,a as i,c as n,d as o,e as r,w as s,j as c,t as d,b as u,l as p,g as v,i as f,G as g,K as m,E as h,H as w,o as b,f as y,F as _,q,h as R,L as N}from"./index-e507caa2.js";import{P as k}from"./pen-9ea49649.js";const C={id:"dialogs-container"},A=["href"],x={class:"ce-gray-color-italic"},T={class:"ce-dialog-footer-btn"},j=e({__name:"Dialogs",props:{reqNo:{type:String,required:!0},data:{type:Object,required:!0}},setup(e){const w=l(),b=e,y=a(!1),_=a(!1),q=t((()=>null==b?void 0:b.data)),R=async e=>{const l="Approved"===e?"APPROVE":"REJECT",a="Approved"===e?"Approve":"Reject";g.confirm(p(`Are you sure to ${l} this cancellation?`),"Warning",{confirmButtonText:p("OK"),cancelButtonText:p("Cancel"),type:"warning",showInput:"Rejected"===e,inputPlaceholder:p("Please leave a reason for rejection")}).then((l=>{y.value=!0;let t=l.value;setTimeout((async()=>{const l={result:e,comments:"Rejected"===e?t:""};await m(q.value.reqNo,l).then((()=>{y.value=!1,h.success(p(`${a} cancelling application successfully`))})).catch((()=>{y.value=!1,h.error(p(`Failed to ${a.toLowerCase()} cancelling application`))})),w.push("/reload")}),2e3)})).catch((()=>h.info(p("Action cancelled"))))};return(e,l)=>{const a=i("el-button"),t=i("el-tag"),g=i("el-descriptions-item"),m=i("el-descriptions"),h=i("el-dialog");return n(),o("div",C,[r(a,{icon:u(k),type:"info",plain:"",class:"p-2",onClick:l[0]||(l[0]=e=>_.value=!0)},{default:s((()=>[c(d(u(p)("Review")),1)])),_:1},8,["icon"]),r(h,{modelValue:u(_),"onUpdate:modelValue":l[3]||(l[3]=e=>f(_)?_.value=e:null),title:`${u(p)("Review application for cancelling")} #${b.reqNo}`,width:"500px"},{default:s((()=>[r(m,{column:"1",border:""},{default:s((()=>[r(g,{label:"ReqNo"},{default:s((()=>[v("a",{class:"ce-link",href:`#/detail/${u(q).reqNo}`,target:"_blank"},d(u(q).reqNo),9,A),r(t,{type:"primary",class:"ml-2"},{default:s((()=>[c(d(u(q).type),1)])),_:1})])),_:1}),r(g,{label:u(p)("Request name")},{default:s((()=>[c(d(u(q).reqName),1)])),_:1},8,["label"]),r(g,{label:u(p)("Received date")},{default:s((()=>[c(d(u(q).applyDate),1)])),_:1},8,["label"]),r(g,{label:u(p)("Applicant")},{default:s((()=>[c(d(u(q).applicant)+" ",1),v("span",x,"("+d(u(q).role)+")",1)])),_:1},8,["label"]),r(g,{label:u(p)("Reason")},{default:s((()=>[c(d(u(q).reason),1)])),_:1},8,["label"])])),_:1}),v("div",T,[r(a,{loading:u(y),onClick:l[1]||(l[1]=e=>R("Rejected"))},{default:s((()=>[c(d(u(p)("Reject")),1)])),_:1},8,["loading"]),r(a,{type:"primary",loading:u(y),onClick:l[2]||(l[2]=e=>R("Approved"))},{default:s((()=>[c(d(u(p)("Approve")),1)])),_:1},8,["loading"])])])),_:1},8,["modelValue","title"])])}}},[["__file","C:/Program Files/Workspace/reqm-vue3/src/views/review/components/Dialogs.vue"]]),P={class:"ce-main-container"},$={class:"ce-toolbar ml-0 mr-0"},V={class:"mr-4"},D={class:"mr-2"},I={id:"revTable-container"},E=["href"],F={key:0},S={key:1,class:"ce-gray-color-italic"},O={class:"ce-blue-color ce-text-bold"},W=e({__name:"index",setup(e){const t=l(),g=a(null),m=a([]),C=a(0),A=a(!1),x=w(),T=a(!1),W={contentMethod:({type:e,column:l,row:a})=>{switch(e){case"body":return"action"===l.field?p("Review this application"):"recipient"===l.field?a[l.field][0]:a[l.field];case"header":return l.title}}},z=async()=>{A.value=!0,await N(x.userId,B.value).then((e=>{m.value=e.data,C.value=m.value.length})),setTimeout((()=>A.value=!1),1e3)};b((async()=>{T.value=!!x.roles.includes("Administrator"),T.value?H.value.push({value:"total",label:"Total"},{value:"reviewing",label:"Reviewing"},{value:"cancellation",label:"Cancellation"}):H.value.push({value:"reviewing",label:"Reviewing"}),B.value=H.value[0].value,await z()}));const B=a(""),H=a([]);return(e,l)=>{const a=i("el-option"),w=i("el-select"),b=i("vxe-column"),N=i("el-button"),T=i("vxe-table");return n(),o("div",P,[y(" Toolbar "),v("div",$,[y(" Select menu "),v("span",V,[v("strong",D,d(u(p)("Switch status"))+":",1),r(w,{modelValue:u(B),"onUpdate:modelValue":l[0]||(l[0]=e=>f(B)?B.value=e:null),placeholder:u(p)("Please select"),onChange:z},{default:s((()=>[(n(!0),o(_,null,q(u(H),(e=>(n(),R(a,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue","placeholder"])])]),y(" Table "),v("div",I,[r(T,{ref_key:"tableRef",ref:g,border:"",align:"center",size:"mini",height:"100%",loading:u(A),"show-header-overflow":"","show-overflow":"",data:u(m),"empty-render":{name:"NoData"},"row-config":{isHover:!0},"column-config":{resizable:!0},"tooltip-config":W},{default:s((()=>[r(b,{field:"reqNo",title:u(p)("ReqNo"),width:"90",sortable:"",fixed:"left"},{default:s((({row:e})=>[v("a",{class:"ce-link",href:`#/detail/${e.reqNo}`,target:"_blank"},d(e.reqNo),9,E)])),_:1},8,["title"]),r(b,{field:"category",title:u(p)("Category"),width:"110",sortable:""},null,8,["title"]),r(b,{field:"applyDate",title:u(p)("Received date"),width:"120"},null,8,["title"]),r(b,{field:"reqName",title:u(p)("Request name"),"header-align":"center",align:"left"},null,8,["title"]),r(b,{field:"applicant",title:u(p)("Applicant"),width:"110"},null,8,["title"]),r(b,{field:"recipient",title:u(p)("Recipient"),width:"110"},{default:s((({row:e})=>[c(d(e.recipient[0]),1)])),_:1},8,["title"]),r(b,{field:"type",title:u(p)("Type"),width:"75"},{default:s((({row:e})=>[e.type?(n(),o("span",F,d(e.type),1)):(n(),o("span",S,"N/A"))])),_:1},8,["title"]),r(b,{field:"action",title:u(p)("Action"),width:"105","header-align":"center",align:"center"},{default:s((({row:e})=>["Cancellation"===e.category?(n(),R(u(j),{key:0,reqNo:e.reqNo,data:e},null,8,["reqNo","data"])):"Reviewing"===e.category?(n(),R(N,{key:1,icon:u(k),disabled:e.recipient[1]!==u(x).userId,type:"info",plain:"",class:"p-2",onClick:l=>{return a=e.reqNo,void(e.recipient[1]===x.userId?t.push({path:`/review/new/${a}`}):h.warning(p("Permission denied")));var a}},{default:s((()=>[c(d(u(p)("Review")),1)])),_:2},1032,["icon","disabled","onClick"])):y("v-if",!0)])),_:1},8,["title"])])),_:1},8,["loading","data"])]),y(" Search result "),v("span",null,[c(d(u(p)("Total"))+" ",1),v("span",O,d(u(C)),1),c(" "+d(u(C)>1?u(p)("records"):u(p)("record")),1)])])}}},[["__scopeId","data-v-8960ea16"],["__file","C:/Program Files/Workspace/reqm-vue3/src/views/review/index.vue"]]);export{W as default};