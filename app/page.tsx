import { FlaskConical, ShieldCheck } from 'lucide-react';
import Sandbox from '@/components/Sandbox';
import { INTERCOM_APP_ID } from '@/lib/intercom';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-med-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-med-600 text-white shadow-card">
              <span className="font-display text-xl leading-none">m</span>
            </div>
            <span className="font-medium tracking-tight">Medstation</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-ink-dim backdrop-blur">
            <FlaskConical size={13} className="text-med-600" /> Ambiente de testes
          </span>
        </header>

        <section className="py-14 sm:py-20">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-med-600">
            <ShieldCheck size={16} /> Intercom Messenger · app_id <code className="font-mono">{INTERCOM_APP_ID}</code>
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Sandbox do chat web da <em className="text-med-600">Medstation</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-dim">
            Teste o Messenger como visitante ou como usuário identificado, envie atributos e eventos e acompanhe cada
            resposta do widget no log ao vivo.
          </p>
        </section>

        <Sandbox />

        <footer className="mt-16 border-t border-line pt-6 text-sm text-ink-dim">
          Página interna de testes · não indexada · Escalate Ops
        </footer>
      </div>
    </main>
  );
}
