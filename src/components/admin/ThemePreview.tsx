import { buildThemeCss, type Theme } from '@/content/theme';

// Miniatura do site com as cores em edição (antes de salvar)
const ThemePreview = ({ theme }: { theme: Partial<Theme> }) => (
  <div className="theme-preview rounded-lg border overflow-hidden text-[11px] leading-snug select-none" aria-hidden>
    <style>{buildThemeCss(theme, '.theme-preview')}</style>

    <header className="bg-white flex items-center justify-between px-3 py-2 shadow-sm">
      <span className="font-bold text-gray-900">Missão Caiuá</span>
      <span className="hidden sm:flex gap-3 text-gray-700">
        <span style={{ color: 'var(--c-primary)', borderBottom: '2px solid var(--c-primary)' }}>Início</span>
        <span>Quem Somos</span>
        <span>Contato</span>
      </span>
      <span className="rounded px-2 py-1" style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-button-text)' }}>
        Doar Agora
      </span>
    </header>

    <div className="site-hero px-3 py-4 text-center">
      <p className="text-white font-bold text-sm">Título da página</p>
      <p className="text-white opacity-90">Subtítulo na faixa colorida</p>
    </div>

    <section className="bg-white px-3 py-3">
      <p className="text-gray-900 font-bold text-xs mb-1">Título de seção</p>
      <p className="text-gray-600 mb-2">Texto comum do site, usado nos parágrafos.</p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded px-2 py-1" style={{ backgroundColor: 'var(--c-primary)', color: 'var(--c-button-text)' }}>
          Botão principal
        </span>
        <span className="rounded px-2 py-1" style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-button-text)' }}>
          Botão de destaque
        </span>
      </div>
    </section>

    <section className="bg-gray-50 px-3 py-3 grid grid-cols-2 gap-2">
      {[0, 1].map((i) => (
        <div key={i} className="bg-white rounded shadow-sm p-2">
          <p className="font-bold text-gray-900">Card {i + 1}</p>
          <p className="text-gray-600">Descrição do card</p>
          <p className="text-gray-500">12 de outubro de 2026</p>
          <p className="font-bold" style={{ color: i ? 'var(--c-secondary)' : 'var(--c-primary)' }}>5.000+</p>
        </div>
      ))}
    </section>

    <div className="site-cta px-3 py-3 text-center">
      <p className="text-white font-bold">Chamada final / newsletter</p>
    </div>

    <footer className="px-3 py-3 flex justify-between gap-2">
      <span className="font-bold">Rodapé</span>
      <span className="text-gray-300">Links e contatos</span>
    </footer>
  </div>
);

export default ThemePreview;
