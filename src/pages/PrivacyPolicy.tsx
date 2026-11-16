import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/content/SiteContentContext';
import { cookieBannerAvailable, cookiePreferences } from '@/lib/tracking';
import { META_PIXEL_ALLOWED_PATHS } from '@/lib/tracking/routes';

// Política de privacidade. O texto descreve só o que o código do site faz de fato; mudou o
// rastreamento, os formulários ou os serviços de terceiros, revise esta página.
// A rota /politica-de-privacidade NÃO pode entrar em META_PIXEL_ALLOWED_PATHS (src/lib/tracking/routes.ts).

// Atualize ao publicar uma nova versão do texto
const UPDATED_AT = '16 de novembro de 2026';

// Nomes das páginas liberadas para o Pixel, para a lista do item 4
const PAGE_NAMES: Record<string, string> = {
  '/': 'Início',
  '/quem-somos': 'Quem Somos',
  '/como-ajudar': 'Como Ajudar',
  '/doacao': 'Doação',
  '/noticias': 'Notícias (somente a lista, não cada notícia)',
  '/transparencia': 'Transparência',
  '/contato': 'Contato',
};

const pixelPages = META_PIXEL_ALLOWED_PATHS.map((path) =>
  PAGE_NAMES[path] ?? (path.startsWith('/campanhas/') ? `Campanha de doação (${path})` : path),
);

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">{title}</h2>
    <div className="space-y-4 text-gray-700 font-nunito leading-relaxed">{children}</div>
  </section>
);

const linkClass = 'underline underline-offset-2';
const linkStyle = { color: 'var(--c-primary)' };

const PrivacyPolicy = () => {
  const { siteName } = useContent('global');

  return (
    <div className="min-h-screen">
      <section className="relative py-20 site-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat">Política de Privacidade</h1>
            <p className="text-xl md:text-2xl font-nunito opacity-90">
              Como este site trata informações de quem o visita
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-10 space-y-10">
            <p className="text-sm text-gray-500 font-nunito">Última atualização: {UPDATED_AT}</p>

            <Section id="quem-somos" title="1. Quem somos">
              <p>
                Este site ({siteName || 'Missão Caiuá'}) é mantido pela Missão Evangélica Caiuá. Esta política
                explica quais informações o site trata quando você o visita, com quem elas são compartilhadas e como
                você pode recusar ou mudar suas escolhas.
              </p>
              <p>
                Serviços de terceiros citados aqui (Meta, Transforme.tech, YouTube e outros) têm políticas próprias,
                que regem o que eles fazem com as informações que recebem.
              </p>
            </Section>

            <Section id="navegacao" title="2. Informações técnicas de navegação">
              <p>
                Como em qualquer site, para entregar as páginas o seu navegador envia ao nosso servidor e à
                Cloudflare (serviço que fica entre o seu navegador e o servidor do site) informações técnicas como o
                endereço IP, o endereço da página pedida e dados do navegador.
              </p>
              <p>
                O site não pede cadastro a visitantes. A área administrativa (/admin) é de uso exclusivo da equipe
                da Missão.
              </p>
            </Section>

            <Section id="formularios" title="3. Formulários do site">
              <p>
                Nesta versão do site, os formulários de <Link to="/contato" className={linkClass} style={linkStyle}>Contato</Link>,
                de voluntariado (<Link to="/como-ajudar" className={linkClass} style={linkStyle}>Como Ajudar</Link>) e
                de inscrição na newsletter estão indisponíveis: os campos ficam desativados e o site não envia nem
                armazena dados por meio deles. Quando algum deles passar a funcionar, esta política será atualizada
                para explicar o que é coletado e para quê.
              </p>
            </Section>

            <Section id="pixel-meta" title="4. Pixel da Meta (somente com a sua autorização)">
              <p>
                Este site tem uma integração com o Pixel da Meta (empresa responsável pelo Facebook e pelo
                Instagram), usada para medir visitas a algumas páginas e o resultado das nossas campanhas de
                divulgação. Ela só funciona quando está habilitada no site e, mesmo assim, só com a sua autorização,
                nas condições abaixo.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Só com aceite.</strong> Esta integração só carrega o Pixel depois que você clica em
                  “Aceitar marketing” no aviso de cookies. Sem essa escolha, ou se você recusar, ela não o carrega e
                  o site funciona normalmente.
                </li>
                <li>
                  <strong>Só em algumas páginas.</strong> Mesmo com o aceite, o Pixel só funciona nas páginas:{' '}
                  {pixelPages.join('; ')}. Esta integração não o carrega nas páginas de projetos, em cada notícia,
                  na área administrativa, nesta política nem em outras páginas fora dessa lista. Se o Pixel já estiver
                  carregado e você for para uma dessas páginas, ela é aberta do zero, sem ele.
                </li>
                <li>
                  <strong>O que é enviado à Meta.</strong> Esta integração registra apenas a visualização de página
                  (“PageView”). O código da Meta, uma vez carregado, pode enviar também o endereço completo da página
                  (inclusive parâmetros após o “?”), a página de onde você veio, o seu endereço IP e dados do
                  navegador e do dispositivo. A integração não configura o envio de nome, e-mail, telefone, CPF,
                  valores de doação nem do que você digita nos formulários, e mantém desativada a configuração
                  automática de eventos da Meta. O que o código da Meta coleta por conta própria segue as regras da
                  Meta.
                </li>
                <li>
                  <strong>Cookies.</strong> O Pixel pode gravar no seu navegador os cookies <code>_fbp</code> e,
                  quando você chega ao site por um anúncio ou link da Meta, <code>_fbc</code>. A validade desses
                  cookies é definida pela Meta.
                </li>
                <li>
                  <strong>Uso pela Meta.</strong> O que a Meta faz com as informações que recebe, inclusive se as
                  associa à sua conta no Facebook ou no Instagram e por quanto tempo as guarda, é regido pela{' '}
                  <a
                    href="https://www.facebook.com/privacy/policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    style={linkStyle}
                  >
                    Política de Privacidade da Meta
                  </a>
                  .
                </li>
              </ul>
            </Section>

            <Section id="preferencias" title="5. Como recusar ou mudar sua escolha">
              <p>
                Você pode recusar no próprio aviso de cookies, clicando em “Recusar marketing”. Enquanto a
                integração com o Pixel estiver habilitada, o link “Preferências de cookies” fica no rodapé de todas as
                páginas públicas do site, inclusive nas que estão fora da lista do item 4 e nesta política, para você
                mudar de ideia a qualquer momento. Abrir as preferências ou aceitar numa página fora da lista não
                carrega o Pixel nela: a escolha fica gravada, e o Pixel só é carregado quando você visitar uma das
                páginas liberadas.
                {cookieBannerAvailable && (
                  <>
                    {' '}
                    <button
                      type="button"
                      onClick={cookiePreferences.open}
                      className={`${linkClass} font-semibold`}
                      style={linkStyle}
                    >
                      Abrir preferências de cookies
                    </button>
                  </>
                )}
              </p>
              <p>Ao recusar depois de ter aceitado:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>esta integração deixa de registrar visitas e, se o Pixel estiver carregado, a página é
                  recarregada sem ele;</li>
                <li>
                  o site apaga os cookies <code>_fbp</code> e <code>_fbc</code> que consegue alcançar nos domínios
                  deste site;
                </li>
                <li>a mudança vale também para outras abas do site abertas no mesmo navegador.</li>
              </ul>
              <p>
                <strong>Limites da revogação:</strong> recusar não apaga as informações que já foram enviadas à Meta
                enquanto o aceite estava valendo. Para essas informações, consulte as configurações da sua conta e a
                política da Meta.
              </p>
              <p>
                Sua escolha fica guardada apenas no seu navegador (no armazenamento local, com a data da escolha) e
                vale só para aquele navegador e dispositivo. Ela não é enviada ao nosso servidor. Se você apagar os
                dados do site no navegador, o aviso aparece de novo; se o navegador não permitir guardar a escolha, o
                Pixel não é carregado.
              </p>
            </Section>

            <Section id="doacoes" title="6. Doações pela Transforme.tech">
              <p>
                As doações são feitas pela plataforma Transforme.tech. Nas páginas de campanha (e na página Doação,
                quando há formulário nela), o site carrega um código da Transforme.tech que exibe o formulário de
                doação dentro de um quadro hospedado por ela. Links para a página da campanha na Transforme.tech
                levam ao site dela.
              </p>
              <p>
                O que você digita nesse formulário (como dados de identificação e de pagamento) é enviado à
                Transforme.tech, e não ao servidor deste site. O tratamento desses dados segue as regras da
                Transforme.tech e dos serviços de pagamento que ela utiliza. Esta seção trata apenas do que o site
                faz; ela não descreve quais informações sobre as doações a Transforme.tech disponibiliza à Missão. O formulário pode usar cookies ou
                tecnologias próprias, que <strong>não</strong> são controlados pela escolha feita no aviso de cookies
                deste site.
              </p>
            </Section>

            <Section id="terceiros" title="7. Conteúdos e links de terceiros">
              <p>
                Algumas páginas exibem vídeos do YouTube (no modo de privacidade aprimorada, pelo endereço
                youtube-nocookie.com) e imagens hospedadas em outros serviços. Ao exibir esses conteúdos, o seu
                navegador se conecta aos servidores desses serviços, que recebem informações técnicas como o endereço
                IP e dados do navegador. Os links para redes sociais (Facebook, Instagram, YouTube) levam a sites que
                seguem suas próprias políticas.
              </p>
            </Section>

            <Section id="direitos" title="8. Seus direitos">
              <p>
                A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante a você, entre outros, os direitos de
                confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir sua eliminação quando cabível, obter
                informações sobre compartilhamento e revogar o consentimento. {/* PENDENTE: canal oficial para
                pedidos de titulares (e-mail/encarregado), ainda não confirmado pela Missão */}Você também pode
                apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </Section>

            <Section id="alteracoes" title="9. Alterações desta política">
              <p>
                Esta política pode ser atualizada quando o funcionamento do site mudar. A data da última atualização
                fica no topo desta página. Se mudarmos o que é pedido no aviso de cookies, ele será exibido de novo
                para você escolher.
              </p>
            </Section>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
