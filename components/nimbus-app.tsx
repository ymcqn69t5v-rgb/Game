"use client";

import { useMemo, useState } from "react";
import { Bell, CalendarDays, CheckSquare, FileText, FolderKanban, LayoutDashboard, MessageSquare, Plus, Search, Settings, Users } from "lucide-react";

type Section = "Přehled" | "Zprávy" | "Projekty" | "Úkoly" | "Kalendář" | "Dokumenty" | "Oznámení" | "Lidé";
type Status = "K vyřízení" | "Probíhá" | "Ke kontrole" | "Hotovo";
type Task = { id: number; title: string; project: string; owner: string; status: Status; due: string };

const sections: Array<{ label: Section; icon: React.ComponentType<{ size?: number }> }> = [
  { label: "Přehled", icon: LayoutDashboard }, { label: "Zprávy", icon: MessageSquare },
  { label: "Projekty", icon: FolderKanban }, { label: "Úkoly", icon: CheckSquare },
  { label: "Kalendář", icon: CalendarDays }, { label: "Dokumenty", icon: FileText },
  { label: "Oznámení", icon: Bell }, { label: "Lidé", icon: Users },
];

const initialTasks: Task[] = [
  { id: 1, title: "Schválit finální etiketu", project: "Nimbus Launch", owner: "Václav", status: "K vyřízení", due: "Dnes" },
  { id: 2, title: "Doplnit produktové fotografie", project: "Nimbus Launch", owner: "Tereza", status: "Probíhá", due: "29. 7." },
  { id: 3, title: "Zkontrolovat předobjednávkový formulář", project: "Předprodej", owner: "Martin", status: "Ke kontrole", due: "30. 7." },
  { id: 4, title: "Založit znalostní bázi", project: "Nimbus HQ", owner: "Václav", status: "Hotovo", due: "Hotovo" },
];

const projects = [
  { name: "Nimbus Launch", progress: 68, detail: "Produkt, výroba a spuštění prodeje" },
  { name: "Předprodej", progress: 42, detail: "Zájemci, objednávky a komunikace" },
  { name: "Nimbus HQ", progress: 24, detail: "Interní systém a procesy" },
];

export function NimbusApp() {
  const [section, setSection] = useState<Section>("Přehled");
  const [tasks, setTasks] = useState(initialTasks);
  const openTasks = useMemo(() => tasks.filter((task) => task.status !== "Hotovo").length, [tasks]);
  const moveTask = (id: number) => {
    const flow: Status[] = ["K vyřízení", "Probíhá", "Ke kontrole", "Hotovo"];
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status: flow[Math.min(flow.indexOf(task.status) + 1, 3)] } : task));
  };

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><span>N</span><div><strong>Nimbus HQ</strong><small>Firemní centrála</small></div></div>
      <nav>{sections.map(({ label, icon: Icon }) => <button key={label} className={section === label ? "active" : ""} onClick={() => setSection(label)}><Icon size={18}/>{label}</button>)}</nav>
      <button className="settings"><Settings size={18}/>Nastavení</button>
      <div className="profile"><div className="avatar">VV</div><div><strong>Václav</strong><small>Vlastník</small></div></div>
    </aside>

    <section className="workspace">
      <header><div><p>NIMBUS / INTERNÍ PROSTOR</p><h1>{section}</h1></div><div className="actions"><label><Search size={17}/><input placeholder="Hledat ve firmě…"/></label><button className="icon"><Bell size={18}/></button><button className="primary"><Plus size={18}/>Nový</button></div></header>
      {section === "Přehled" && <Dashboard openTasks={openTasks} tasks={tasks} moveTask={moveTask}/>} 
      {section === "Úkoly" && <Kanban tasks={tasks} moveTask={moveTask}/>} 
      {section === "Projekty" && <div className="grid projects">{projects.map((p) => <article className="card" key={p.name}><small>PROJEKT</small><h2>{p.name}</h2><p>{p.detail}</p><div className="bar"><span style={{width:`${p.progress}%`}}/></div><b>{p.progress}% hotovo</b></article>)}</div>}
      {section === "Zprávy" && <Messages/>}
      {section === "Dokumenty" && <Simple title="Dokumenty" items={["Obchodní materiály", "Produktové podklady", "Smlouvy a šablony"]}/>} 
      {section === "Oznámení" && <Simple title="Oznámení" items={["Nový harmonogram spuštění", "Aktuální ceníky jsou v Dokumentech"]}/>} 
      {section === "Kalendář" && <Simple title="Tento týden" items={["Úterý 10:00 — operativní porada", "Čtvrtek — uzávěrka etikety", "Pátek 14:00 — kontrola předprodeje"]}/>} 
      {section === "Lidé" && <Simple title="Tým" items={["Václav — vlastník", "Martin — obchod", "Tereza — marketing", "Jakub — externí vývoj"]}/>} 
    </section>
  </main>;
}

function Dashboard({ openTasks, tasks, moveTask }: { openTasks:number; tasks:Task[]; moveTask:(id:number)=>void }) {
  return <><div className="stats"><div className="card"><small>OTEVŘENÉ ÚKOLY</small><strong>{openTasks}</strong><p>2 mají termín tento týden</p></div><div className="card"><small>AKTIVNÍ PROJEKTY</small><strong>3</strong><p>Nimbus Launch je nejdál</p></div><div className="card"><small>NEPŘEČTENÉ ZPRÁVY</small><strong>7</strong><p>ve 3 kanálech</p></div></div><div className="grid two"><section className="card"><div className="cardhead"><h2>Moje úkoly</h2><button>Zobrazit vše</button></div>{tasks.slice(0,3).map(t=><div className="task" key={t.id}><button className="check" onClick={()=>moveTask(t.id)}>✓</button><div><b>{t.title}</b><small>{t.project} · {t.due}</small></div><span>{t.status}</span></div>)}</section><section className="card"><small>DŮLEŽITÉ OZNÁMENÍ</small><h2>Nový harmonogram spuštění</h2><p>První produktový batch plánujeme uzavřít do 15. srpna. Každý otevřený úkol musí mít vlastníka a termín.</p><button className="secondary">Potvrdit přečtení</button></section></div></>;
}

function Kanban({ tasks, moveTask }: { tasks:Task[]; moveTask:(id:number)=>void }) { const statuses:Status[]=["K vyřízení","Probíhá","Ke kontrole","Hotovo"]; return <div className="kanban">{statuses.map(status=><section key={status}><h3>{status} <span>{tasks.filter(t=>t.status===status).length}</span></h3>{tasks.filter(t=>t.status===status).map(t=><article className="card" key={t.id} onClick={()=>moveTask(t.id)}><small>{t.project}</small><h2>{t.title}</h2><p>{t.owner} · {t.due}</p></article>)}</section>)}</div> }
function Messages(){return <div className="grid messages"><aside className="card"><h2>Kanály</h2>{["obecný-chat","vedení","nimbus-launch","obchod"].map(x=><button key={x}># {x}</button>)}</aside><section className="card chat"><h2># obecný-chat</h2><div><p><b>Tereza</b> Produktové fotky jsou nahrané v Dokumentech.</p><p><b>Václav</b> Super, zítra je projdeme na poradě.</p></div><input placeholder="Napsat zprávu…"/></section></div>}
function Simple({title,items}:{title:string;items:string[]}){return <section className="card list"><h2>{title}</h2>{items.map(item=><div key={item}>{item}<span>Otevřít →</span></div>)}</section>}
