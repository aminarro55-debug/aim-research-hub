const products=[
{name:"Retatrutide",cat:"Metabolic",desc:"Triple GIP/GLP-1/glucagon receptor agonist",page:"compounds/retatrutide.html"},
{name:"Tirzepatide",cat:"Metabolic",desc:"Dual GIP and GLP-1 receptor agonist",page:"compounds/tirzepatide.html"},
{name:"Semaglutide",cat:"Metabolic",desc:"GLP-1 receptor agonist",page:"compounds/semaglutide.html"},
{name:"Tesamorelin",cat:"Endocrine",desc:"Growth-hormone-releasing hormone analog",page:"compounds/tesamorelin.html"},
{name:"BPC-157",cat:"Tissue research",desc:"Experimental peptide studied in preclinical models",page:"compounds/bpc-157.html"},
{name:"TB-500 / Thymosin β4",cat:"Tissue research",desc:"Thymosin-beta-4-related research topic",page:"compounds/tb-500.html"},
{name:"CJC-1295",cat:"Endocrine",desc:"Growth-hormone-releasing hormone analog research",page:"compounds/cjc-1295.html"},
{name:"Ipamorelin",cat:"Endocrine",desc:"Growth-hormone secretagogue research",page:"compounds/ipamorelin.html"},
{name:"Semax",cat:"Neuroscience",desc:"Experimental neuropeptide research topic",page:"compounds/semax.html"},
{name:"Selank",cat:"Neuroscience",desc:"Experimental peptide research topic",page:"compounds/selank.html"}];

const grid=document.getElementById("grid"),search=document.getElementById("search"),count=document.getElementById("count"),filters=document.getElementById("filters");let active="All";
const cats=["All",...new Set(products.map(x=>x.cat))];
filters.innerHTML=cats.map(c=>`<button class="${c==="All"?"active":""}" data-cat="${c}">${c}</button>`).join("");
function render(){const q=search.value.toLowerCase();const rows=products.filter(x=>(active==="All"||x.cat===active)&&(`${x.name} ${x.cat} ${x.desc}`.toLowerCase().includes(q)));count.textContent=`${rows.length} topics`;grid.innerHTML=rows.map(x=>`<article class="card"><div class="eyebrow">${x.cat}</div><h3>${x.name}</h3><p>${x.desc}</p><a href="${x.page}">Read research overview →</a></article>`).join("")}
search.oninput=render;filters.onclick=e=>{if(e.target.tagName!=="BUTTON")return;active=e.target.dataset.cat;filters.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.cat===active));render()};render();

const SUPABASE_URL="https://mkxhosiptmmhotlqcqpy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_dvVyamZ5BKFopo_O2nC3EA_VahXHEbA";
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

const loggedOut=document.getElementById("authLoggedOut"),loggedIn=document.getElementById("authLoggedIn"),accountEmail=document.getElementById("accountEmail"),authMessage=document.getElementById("authMessage"),signupForm=document.getElementById("signupForm"),loginForm=document.getElementById("loginForm"),showSignup=document.getElementById("showSignup"),showLogin=document.getElementById("showLogin"),logoutButton=document.getElementById("logoutButton");
function msg(t,err=false){authMessage.textContent=t||"";authMessage.classList.toggle("error",err)}
function sessionUI(session){const u=session?.user;loggedOut.classList.toggle("hidden",!!u);loggedIn.classList.toggle("hidden",!u);if(u)accountEmail.textContent=`Signed in as ${u.email}`}
showSignup.onclick=()=>{signupForm.classList.remove("hidden");loginForm.classList.add("hidden");showSignup.classList.add("active");showLogin.classList.remove("active");msg("")};
showLogin.onclick=()=>{loginForm.classList.remove("hidden");signupForm.classList.add("hidden");showLogin.classList.add("active");showSignup.classList.remove("active");msg("")};
signupForm.addEventListener("submit",async e=>{e.preventDefault();msg("Creating account...");const email=document.getElementById("signupEmail").value.trim(),password=document.getElementById("signupPassword").value;const {data,error}=await supabaseClient.auth.signUp({email,password,options:{emailRedirectTo:"https://aminarro55-debug.github.io/aim-research-hub/"}});if(error)return msg(error.message,true);if(data.session){sessionUI(data.session);msg("")}else msg("Account created. Check your email for the confirmation link, then return here and log in.")});
loginForm.addEventListener("submit",async e=>{e.preventDefault();msg("Logging in...");const email=document.getElementById("loginEmail").value.trim(),password=document.getElementById("loginPassword").value;const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)return msg(error.message,true);sessionUI(data.session);msg("")});
logoutButton.onclick=async()=>{await supabaseClient.auth.signOut();sessionUI(null);msg("")};
supabaseClient.auth.getSession().then(({data})=>sessionUI(data.session));
supabaseClient.auth.onAuthStateChange((_event,session)=>sessionUI(session));