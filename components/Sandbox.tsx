'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BellDot,
  Eye,
  EyeOff,
  Globe,
  Inbox,
  LogOut,
  MessageSquarePlus,
  Send,
  Tag,
  Trash2,
  UserRound,
  Zap,
} from 'lucide-react';
import { INTERCOM_APP_ID, ic, reboot } from '@/lib/intercom';

type LogEntry = { id: number; at: string; kind: 'evento' | 'ação' | 'erro'; text: string };

const SPACES = [
  { value: 'home', label: 'Início' },
  { value: 'messages', label: 'Mensagens' },
  { value: 'help', label: 'Ajuda' },
  { value: 'news', label: 'Novidades' },
  { value: 'tasks', label: 'Tarefas' },
];

const LANGUAGES = [
  { value: '', label: 'Automático (navegador)' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

let seq = 0;
const now = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });

export default function Sandbox() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [booted, setBooted] = useState(false);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [identity, setIdentity] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [language, setLanguage] = useState('');
  const [message, setMessage] = useState('Olá, preciso de ajuda com meu pedido');
  const [attrKey, setAttrKey] = useState('pais');
  const [attrValue, setAttrValue] = useState('BR');
  const [eventName, setEventName] = useState('teste_evento');

  const push = useCallback((kind: LogEntry['kind'], text: string) => {
    setLog((l) => [{ id: ++seq, at: now(), kind, text }, ...l].slice(0, 80));
  }, []);

  const run = (label: string, fn: () => boolean | void) => {
    const ok = fn();
    if (ok === false) push('erro', `${label}: o Messenger ainda não carregou`);
    else push('ação', label);
  };

  // Callbacks del Messenger: el stub los encola aunque el widget no haya terminado de cargar.
  useEffect(() => {
    const t = setInterval(() => {
      if (!window.Intercom) return;
      clearInterval(t);
      ic('onShow', () => { setOpen(true); push('evento', 'onShow — Messenger aberto'); });
      ic('onHide', () => { setOpen(false); push('evento', 'onHide — Messenger fechado'); });
      ic('onUnreadCountChange', (n: number) => { setUnread(n); push('evento', `onUnreadCountChange — ${n} não lidas`); });
      ic('onUserEmailSupplied', () => push('evento', 'onUserEmailSupplied — o visitante informou o e-mail'));
    }, 200);
    return () => clearInterval(t);
  }, [push]);

  // `booted` lo setea el widget real cuando termina de iniciar.
  useEffect(() => {
    const t = setInterval(() => {
      if (window.Intercom?.booted) {
        setBooted(true);
        push('evento', `Messenger iniciado (app_id ${INTERCOM_APP_ID})`);
        clearInterval(t);
      }
    }, 400);
    return () => clearInterval(t);
  }, [push]);

  const identify = () => {
    if (!email && !userId) return push('erro', 'Identificar: é preciso informar e-mail ou user_id');
    const settings: Record<string, unknown> = {};
    if (name) settings.name = name;
    if (email) settings.email = email;
    if (userId) settings.user_id = userId;
    if (language) settings.language_override = language;
    run(`Reiniciado como usuário ${email || userId}`, () => reboot(settings));
    setIdentity(email || userId);
  };

  const asVisitor = () => {
    run('Reiniciado como visitante anônimo', () => reboot(language ? { language_override: language } : {}));
    setIdentity(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Estado */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<Activity size={16} />} label="Widget" value={booted ? 'Carregado' : 'Carregando…'} live={booted} />
          <Stat icon={open ? <Eye size={16} /> : <EyeOff size={16} />} label="Messenger" value={open ? 'Aberto' : 'Fechado'} live={open} />
          <Stat icon={<BellDot size={16} />} label="Não lidas" value={String(unread)} live={unread > 0} />
          <Stat icon={<UserRound size={16} />} label="Identidade" value={identity ?? 'Visitante'} live={!!identity} />
        </div>

        {/* Abrir / mensajes */}
        <Card title="Messenger" icon={<Inbox size={18} />} hint="Abrir, fechar e navegar entre os espaços.">
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => run('show', () => ic('show'))}>
              <Eye size={16} /> Abrir
            </button>
            <button className="btn-ghost" onClick={() => run('hide', () => ic('hide'))}>
              <EyeOff size={16} /> Fechar
            </button>
            {SPACES.map((s) => (
              <button key={s.value} className="btn-ghost" onClick={() => run(`showSpace("${s.value}")`, () => ic('showSpace', s.value))}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input className="field" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensagem pré-preenchida" />
            <button className="btn-primary shrink-0" onClick={() => run(`showNewMessage("${message}")`, () => ic('showNewMessage', message))}>
              <MessageSquarePlus size={16} /> Nova conversa
            </button>
          </div>
        </Card>

        {/* Identidad */}
        <Card title="Identidade do usuário" icon={<UserRound size={18} />} hint="Reinicia o Messenger (shutdown + boot) para testar como lead ou como usuário identificado.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome"><input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana Souza" /></Field>
            <Field label="E-mail"><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@exemplo.com" /></Field>
            <Field label="user_id"><input className="field" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="teste-001" /></Field>
            <Field label="Idioma do Messenger">
              <div className="relative">
                <Globe size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
                <select className="field pl-8" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={identify}><UserRound size={16} /> Entrar como usuário</button>
            <button className="btn-ghost" onClick={asVisitor}><LogOut size={16} /> Voltar para visitante</button>
          </div>
        </Card>

        {/* Atributos y eventos */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Atributo personalizado" icon={<Tag size={18} />} hint="Enviado via update. O atributo precisa existir no workspace.">
            <div className="flex gap-2">
              <input className="field" value={attrKey} onChange={(e) => setAttrKey(e.target.value)} placeholder="chave" />
              <input className="field" value={attrValue} onChange={(e) => setAttrValue(e.target.value)} placeholder="valor" />
            </div>
            <button className="btn-ghost mt-3 w-full" onClick={() => run(`update({ ${attrKey}: "${attrValue}" })`, () => ic('update', { [attrKey]: attrValue }))}>
              <Send size={16} /> Enviar atributo
            </button>
          </Card>
          <Card title="Evento" icon={<Zap size={18} />} hint="trackEvent, útil para disparar workflows ou outbound.">
            <input className="field" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="nome_do_evento" />
            <button className="btn-ghost mt-3 w-full" onClick={() => run(`trackEvent("${eventName}")`, () => ic('trackEvent', eventName))}>
              <Zap size={16} /> Disparar evento
            </button>
          </Card>
        </div>
      </div>

      {/* Log */}
      <aside className="flex h-[640px] flex-col overflow-hidden rounded-2xl border border-line bg-ink text-white shadow-card lg:sticky lg:top-6">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
            </span>
            Log ao vivo
          </div>
          <button className="text-white/50 transition hover:text-white" onClick={() => setLog([])} aria-label="Limpar log">
            <Trash2 size={15} />
          </button>
        </div>
        <ul className="flex-1 space-y-1.5 overflow-y-auto p-3 font-mono text-[12px]">
          {log.length === 0 && <li className="px-1 py-2 text-white/40">Aguardando eventos do Messenger…</li>}
          <AnimatePresence initial={false}>
            {log.map((e) => (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md bg-white/[0.04] px-2.5 py-1.5"
              >
                <span className="text-white/40">{e.at}</span>{' '}
                <span className={e.kind === 'evento' ? 'text-med-400' : e.kind === 'erro' ? 'text-pulse' : 'text-sky-300'}>
                  {e.kind}
                </span>{' '}
                <span className="text-white/85">{e.text}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </aside>
    </div>
  );
}

function Card({ title, icon, hint, children }: { title: string; icon: React.ReactNode; hint: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-line bg-white p-5 shadow-card"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg bg-med-50 p-2 text-med-600">{icon}</div>
        <div>
          <h2 className="font-medium">{title}</h2>
          <p className="text-sm text-ink-dim">{hint}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-dim">{label}</span>
      {children}
    </label>
  );
}

function Stat({ icon, label, value, live }: { icon: React.ReactNode; label: string; value: string; live: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3.5 shadow-card">
      <div className="flex items-center justify-between text-ink-dim">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">{icon}{label}</span>
        <span className={`h-2 w-2 rounded-full transition ${live ? 'bg-med-400 shadow-[0_0_0_4px] shadow-med-100' : 'bg-line'}`} />
      </div>
      <div className="mt-2 truncate text-lg font-medium">{value}</div>
    </div>
  );
}
