import { withSquares } from '../../../utils/format';
import ddb from './ddbTab.module.css';
import styles from './RulesTab.module.css';

/**
 * Referência rápida de regras (D&D 2024 — Livro do Jogador 2024).
 * Texto resumido em palavras próprias; conferido contra o livro (cap. 1 e Apêndice C).
 */
interface Entry { term: string; text: string; raw?: boolean }
interface Section { title: string; entries: Entry[]; raw?: boolean }

const SECTIONS: Section[] = [
  {
    title: 'Ações em combate',
    entries: [
      { term: 'No seu turno', text: 'Mover até seu Deslocamento, 1 ação, no máximo 1 Ação Bônus (se algo conceder) e 1 interação livre com objeto. 1 Reação por rodada.' },
      { term: 'Atacar', text: 'Ataque com arma ou Ataque Desarmado.' },
      { term: 'Usar Magia', text: 'Conjurar magia, usar item mágico ou característica mágica.' },
      { term: 'Correr', text: 'Ganha movimento extra igual ao seu Deslocamento neste turno.' },
      { term: 'Desengajar', text: 'Seu movimento não provoca Ataques de Oportunidade neste turno.' },
      { term: 'Esquivar', text: 'Até seu próximo turno, ataques contra você têm Desvantagem (se você vê o atacante) e salvaguardas de DES com Vantagem. Perde se ficar Incapacitado ou com Deslocamento 0.' },
      { term: 'Ajudar', text: 'Dá Vantagem no próximo teste/ataque de um aliado, ou presta primeiros socorros (Medicina CD 10 estabiliza).' },
      { term: 'Esconder', text: 'Teste de DES (Furtividade) CD 15 fora da visão dos inimigos e Totalmente Obscurecido ou atrás de cobertura ¾/total.' },
      { term: 'Outras', text: 'Analisar (INT), Procurar (SAB), Influenciar (CAR/SAB), Preparar (reage a um gatilho), Usar Objeto.' },
    ],
  },
  {
    title: 'Cobertura',
    entries: [
      { term: 'Meia (Parcial)', text: '+2 na CA e em salvaguardas de DES.' },
      { term: 'Três quartos', text: '+5 na CA e em salvaguardas de DES.' },
      { term: 'Total', text: 'Não pode ser alvo direto de ataques ou magias.' },
      { term: 'Várias', text: 'Vale só a cobertura mais forte; não somam.' },
    ],
  },
  {
    title: 'Luz e visão',
    entries: [
      { term: 'Luz Plena', text: 'Visão normal.' },
      { term: 'Meia-luz (penumbra)', text: 'Área Parcialmente Obscurecida: Desvantagem em SAB (Percepção) que dependa de visão.' },
      { term: 'Escuridão', text: 'Área Totalmente Obscurecida: você fica Cego ao tentar ver algo nela.' },
      { term: 'Visão no Escuro', text: 'Dentro do alcance, Meia-luz conta como Luz Plena e Escuridão como Meia-luz (só em tons de cinza).' },
    ],
  },
  {
    title: 'Movimento',
    entries: [
      { term: 'Terreno Difícil', text: 'Movimento custa o dobro (mover 1,5 m gasta 3 m). Não acumula.' },
      { term: 'Rastejar', text: 'Movimento custa o dobro (o triplo em Terreno Difícil).' },
      { term: 'Levantar-se', text: 'Gasta metade do Deslocamento para sair de Caído.' },
      { term: 'Escalar / Nadar', text: 'Movimento custa o dobro (o triplo em Terreno Difícil), a menos que tenha deslocamento de escalada/natação. Superfície escorregadia ou água agitada: FOR (Atletismo) CD 15, a critério do Mestre.' },
      { term: 'Salto em Distância', text: '30 cm por ponto de Força com corrida de 3 m; parado, metade. Cada metro saltado gasta movimento. Cair em Terreno Difícil: DES (Acrobacia) CD 10 ou fica Caído.' },
      { term: 'Salto em Altura', text: '1 m + 30 cm por modificador de FOR (mín. 0) com corrida de 3 m; parado, metade.', raw: true },
    ],
  },
  {
    title: 'Agarrar e Empurrar',
    entries: [
      { term: 'Como', text: 'Use um Ataque Desarmado (alvo a até 1,5 m, no máximo 1 tamanho maior que você) e escolha Imobilizar ou Empurrar em vez de dano.' },
      { term: 'CD', text: '8 + modificador de FOR + Bônus de Proficiência. O alvo faz salvaguarda de FOR ou DES (escolha dele).' },
      { term: 'Imobilizar', text: 'Exige uma mão livre. Na falha, o alvo fica Imobilizado (Deslocamento 0). Para escapar: ação e teste de FOR (Atletismo) ou DES (Acrobacia) contra a mesma CD.' },
      { term: 'Empurrar', text: 'Na falha, empurra o alvo 1,5 m para longe ou o deixa Caído.' },
    ],
  },
  {
    title: 'CDs típicas',
    entries: [
      { term: '5', text: 'Muito fácil' },
      { term: '10', text: 'Fácil' },
      { term: '15', text: 'Média' },
      { term: '20', text: 'Difícil' },
      { term: '25', text: 'Muito difícil' },
      { term: '30', text: 'Quase impossível' },
    ],
  },
  {
    title: 'Descanso curto e longo',
    entries: [
      { term: 'Curto (1 hora)', text: 'Precisa de 1+ PV. Gaste Dados de Vida: role cada um + mod. de CON e recupere PV. Interrompido por Iniciativa, magia (não truque) ou dano.' },
      { term: 'Longo (8 horas)', text: 'Precisa de 1+ PV; dorme 6 h, até 2 h de atividade leve. Recupera todos os PV e todos os Dados de Vida, e −1 nível de Exaustão. Só 1 a cada 24 h (espera 16 h após terminar).' },
      { term: 'Interrupção do longo', text: 'Iniciativa, magia (não truque), dano ou 1 h de esforço físico. Se já descansou 1 h, ganha um Descanso Curto.' },
    ],
  },
  {
    title: 'Ritmo de viagem',
    raw: true,
    entries: [
      { term: 'Rápido', text: '120 m/min · 6 km/h · 45 km/dia. Desvantagem em SAB (Percepção, Sobrevivência) e DES (Furtividade).' },
      { term: 'Normal', text: '90 m/min · 4,5 km/h · 36 km/dia. Desvantagem em DES (Furtividade).' },
      { term: 'Lento', text: '60 m/min · 3 km/h · 27 km/dia. Vantagem em SAB (Percepção, Sobrevivência).' },
      { term: 'Montaria', text: 'Pode dobrar a distância por 1 hora; depois a montaria precisa de descanso.' },
    ],
  },
  {
    title: 'Ataque de oportunidade',
    entries: [
      { term: 'Gatilho', text: 'Uma criatura que você vê sai do seu alcance usando o próprio movimento, ação ou reação.' },
      { term: 'Efeito', text: 'Gaste sua Reação para um ataque corpo a corpo (arma ou desarmado), resolvido logo antes de ela sair.' },
      { term: 'Evitar', text: 'Desengajar ou teleporte não provocam.' },
    ],
  },
  {
    title: 'Morrer e testes contra a morte',
    entries: [
      { term: '0 PV', text: 'Fica Inconsciente. Se o dano excedente for ≥ seus PV máximos, morre na hora.' },
      { term: 'Salvaguarda contra Morte', text: 'No início de cada turno com 0 PV, role d20: 10+ é sucesso, abaixo é falha. 3 sucessos = Estável; 3 falhas = morte.' },
      { term: '1 ou 20', text: '1 natural conta como 2 falhas; 20 natural recupera 1 PV.' },
      { term: 'Dano a 0 PV', text: 'Cada dano é 1 falha (Acerto Crítico: 2 falhas). Dano ≥ PV máximos mata.' },
      { term: 'Estabilizar', text: 'Ação Ajudar com SAB (Medicina) CD 10. Contagens zeram ao recuperar PV ou ficar Estável.' },
    ],
  },
];

export function RulesTab() {
  return (
    <div className={ddb.tab}>
      <div className={styles.grid}>
        {SECTIONS.map(section => (
          <section key={section.title} className={styles.section}>
            <div className={ddb.sectionHeader}>{section.title}</div>
            <dl className={styles.list}>
              {section.entries.map(e => (
                <div key={e.term} className={styles.row}>
                  <dt className={styles.term}>{e.term}</dt>
                  <dd className={styles.text}>{section.raw || e.raw ? e.text : withSquares(e.text)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <div className={ddb.notes}>Resumo das regras do Livro do Jogador 2024. Em caso de dúvida, vale o livro e o Mestre.</div>
    </div>
  );
}
