const technologies=[
["HTML","languages","5"],["CSS","languages","3"],["JavaScript","languages","JS"],["TypeScript","languages","TS"],["PHP","languages","PHP"],["Python","languages","Py"],["Java","languages","J"],["C","languages","C"],["C++","languages","++"],["C#","languages","#"],["Go","languages","Go"],["Rust","languages","Rs"],["Kotlin","languages","K"],["Swift","languages","S"],["Dart","languages","D"],["Ruby","languages","Rb"],["Lua","languages","Lu"],["Perl","languages","Pl"],["Scala","languages","Sc"],["Haskell","languages","Hs"],["Elixir","languages","Ex"],["Julia","languages","Jl"],["R","languages","R"],["Objective-C","languages","Obj"],["Assembly","languages","ASM"],["Bash","languages","$"],["PowerShell","languages","PS"],["Zig","languages","Z"],["SQL","languages","DB"],
["React","web","R"],["Vue","web","V"],["Svelte","web","S"],["Angular","web","A"],["Node.js","web","N"],["Tailwind CSS","web","T"],["Bootstrap","web","B"],["Laravel","web","L"],["Electron","web","E"],["REST APIs","web","API"],["Vite","web","V"],
["Git","tools","⌘"],["GitHub","tools","GH"],["Firebase","tools","F"],["Cloudflare","tools","C"],["VS Code","tools","⌁"],["npm","tools","n"],["Linux","tools","L"],["Figma","tools","F"],["Docker","tools","D"],["MySQL","tools","DB"],["SQLite","tools","SQ"]
];
const grid=document.querySelector("#tech-grid");
function render(filter="all"){if(!grid)return;grid.innerHTML=technologies.filter(t=>filter==="all"||t[1]===filter).map(t=>'<div class="tech"><span class="tech-icon">'+t[2]+'</span><span>'+t[0]+'</span></div>').join("")}
render();
document.querySelector("#filters")?.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;document.querySelectorAll("#filters button").forEach(x=>x.classList.toggle("active",x===b));render(b.dataset.filter)});
const themeBtn=document.querySelector("#theme");const saved=localStorage.getItem("portfolio-theme");if(saved)document.documentElement.dataset.theme=saved;
themeBtn?.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("portfolio-theme",next)});
document.querySelector("#menu")?.addEventListener("click",()=>document.querySelector("nav")?.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("nav")?.classList.remove("open")));
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();