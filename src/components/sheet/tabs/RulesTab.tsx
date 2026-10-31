import { withSquares } from '../../../utils/format';
import ddb from './ddbTab.module.css';
import styles from './RulesTab.module.css';

/**
 * Referência rápida de regras (D&D 2024 — Livro do Jogador 2024).
 * Texto resumido em palavras próprias; conferido contra o livro (cap. 1, cap. 6, cap. 7 e Apêndice C).
 * Ordem: do que mais aparece na mesa ao que menos aparece.
 */
interface Entry { term: string; text: string; raw?: boolean }
interface Section { title: string; entries: Entry[]; raw?: boolean }
interface Group { title: string; sections: Section[] }

const GROUPS: Group[] = [
  {
    title: 'Toda hora',
    sections: [
      {
        title: 'Testes e d20',
        entries: [
          { term: 'Como rolar', text: 'd20 + modificador do atributo + Bônus de Proficiência (se proficiente). Igualou ou passou a CD ou a CA: sucesso.' },
          { term: 'Vantagem', text: 'Role 2d20 e use o maior. Desvantagem: use o menor. Tendo as duas, elas se anulam (rola 1 dado), não importa quantas de cada.' },
          { term: 'Proficiência', text: 'Nunca entra duas vezes na mesma jogada. Especialista dobra o bônus nas perícias escolhidas.' },
          { term: 'Inspiração Heroica', text: 'Gaste para rolar de novo qualquer dado logo após rolá-lo (vale o novo). Só pode ter 1; se ganhar outra, pode passar a um aliado.' },
          { term: 'CDs típicas', text: '5 muito fácil · 10 fácil · 15 média · 20 difícil · 25 muito difícil · 30 quase impossível.' },
        ],
      },
      {
        title: 'Ataques e dano',
        entries: [
          { term: 'Jogada de ataque', text: 'd20 + modificador + proficiência na arma. Igualou ou passou a CA: acerta. 20 natural sempre acerta (Acerto Crítico); 1 natural sempre erra.' },
          { term: 'Dano', text: 'Dados da arma + o mesmo modificador do ataque. Nunca fica negativo.' },
          { term: 'Acerto Crítico', text: 'Role os dados de dano duas vezes (inclui extras, como Ataque Furtivo); o modificador entra uma vez só.' },
          { term: 'À distância', text: 'Além do alcance normal: Desvantagem. Além do máximo: não pode. Com inimigo a até 1,5 m que você vê: Desvantagem.' },
          { term: 'Duas armas (Leve)', text: 'Após Atacar com arma Leve, pode atacar com outra arma Leve como Ação Bônus, sem somar o modificador no dano (a menos que seja negativo).' },
          { term: 'Resistência', text: 'Dano daquele tipo pela metade. Vulnerabilidade: o dobro. Imunidade: nenhum.' },
          { term: 'Em área', text: 'O dano é rolado uma vez para todos os alvos. Salvaguarda bem-sucedida costuma dar metade.' },
        ],
      },
    ],
  },
  {
    title: 'Em combate',
    sections: [
      {
        title: 'Seu turno',
        entries: [
          { term: 'Rodada', text: 'Cerca de 6 segundos. Cada um age uma vez, na ordem da Iniciativa (teste de DES).' },
          { term: 'Surpresa', text: 'Quem é pego de surpresa rola Iniciativa com Desvantagem.' },
          { term: 'No turno', text: 'Mover até seu Deslocamento (pode dividir antes e depois) + 1 ação. Ação Bônus só se algo lhe der uma. 1 interação simples com objeto. Falar é livre.' },
          { term: 'Reação', text: '1 por rodada; volta no início do seu turno. Ex.: Ataque de Oportunidade.' },
        ],
      },
      {
        title: 'Ações',
        entries: [
          { term: 'Atacar', text: 'Um ataque com arma ou Ataque Desarmado (mais, se tiver Ataque Extra).' },
          { term: 'Usar Magia', text: 'Conjurar magia, usar item mágico ou característica mágica.' },
          { term: 'Correr', text: 'Ganha movimento extra igual ao seu Deslocamento neste turno.' },
          { term: 'Desengajar', text: 'Seu movimento não provoca Ataques de Oportunidade neste turno.' },
          { term: 'Esquivar', text: 'Até seu próximo turno: ataques contra você com Desvantagem (se vê o atacante) e salvaguardas de DES com Vantagem. Some se ficar Incapacitado ou com Deslocamento 0.' },
          { term: 'Ajudar', text: 'Dá Vantagem no próximo teste ou ataque de um aliado, ou estabiliza alguém (SAB Medicina CD 10).' },
          { term: 'Esconder', text: 'DES (Furtividade) CD 15, fora da vista dos inimigos, em área Totalmente Obscurecida ou atrás de cobertura ¾ ou total.' },
          { term: 'Outras', text: 'Analisar (INT), Procurar (SAB), Influenciar (CAR/SAB), Preparar (age com a Reação quando um gatilho acontece), Usar Objeto.' },
        ],
      },
      {
        title: 'Magias',
        entries: [
          { term: '1 espaço por turno', text: 'Em um turno você só gasta um espaço de magia para conjurar. Truques não gastam espaço.' },
          { term: 'Concentração', text: 'Só uma por vez. Ao sofrer dano: salvaguarda de CON, CD 10 ou metade do dano (o maior), até 30. Acaba se ficar Incapacitado ou começar outra de Concentração.' },
          { term: 'Componentes', text: 'V = falar; S = gesto com a mão; M = material (um foco substitui, se o material não tiver custo).' },
          { term: 'Ritual', text: 'Magia preparada com o marcador Ritual pode ser conjurada com +10 minutos sem gastar espaço (não vai a círculo maior).' },
        ],
      },
      {
        title: 'Cobertura',
        entries: [
          { term: 'Meia', text: '+2 na CA e em salvaguardas de DES.' },
          { term: 'Três quartos', text: '+5 na CA e em salvaguardas de DES.' },
          { term: 'Total', text: 'Não pode ser alvo direto de ataques ou magias.' },
          { term: 'Várias', text: 'Vale só a mais forte; não somam.' },
        ],
      },
      {
        title: 'Ataque de Oportunidade',
        entries: [
          { term: 'Quando', text: 'Uma criatura que você vê sai do seu alcance usando o próprio movimento, ação ou Reação.' },
          { term: 'Como', text: 'Gaste a Reação para um ataque corpo a corpo, logo antes de ela sair.' },
          { term: 'Não provoca', text: 'Desengajar, teleporte ou ser movido por outro (empurrão, magia).' },
        ],
      },
    ],
  },
  {
    title: 'Vida e morte',
    sections: [
      {
        title: 'Pontos de Vida e cura',
        entries: [
          { term: 'Cura', text: 'Soma aos PV atuais, até o máximo. O que passar é perdido.' },
          { term: 'PV Temporários', text: 'Saem primeiro ao sofrer dano. Não acumulam: escolha entre os que tem e os novos. Cura não os restaura. Com 0 PV, não acordam você.' },
          { term: 'Sangrando', text: 'Com metade dos PV ou menos. Não faz nada sozinho, mas algumas regras usam.' },
        ],
      },
      {
        title: 'Cair a 0 PV',
        entries: [
          { term: '0 PV', text: 'Fica Inconsciente. Se o dano que sobrou for igual ou maior que seus PV máximos, morre na hora.' },
          { term: 'Teste contra a Morte', text: 'No início de cada turno com 0 PV, role d20: 10+ sucesso, abaixo falha. 3 sucessos = Estável; 3 falhas = morte.' },
          { term: '1 ou 20', text: '1 natural conta como 2 falhas; 20 natural recupera 1 PV.' },
          { term: 'Dano com 0 PV', text: 'Cada vez é 1 falha (Acerto Crítico: 2 falhas). Dano igual ou maior que os PV máximos mata.' },
          { term: 'Estabilizar', text: 'Ação Ajudar com SAB (Medicina) CD 10. As contagens zeram ao recuperar PV ou ficar Estável.' },
        ],
      },
    ],
  },
  {
    title: 'Exploração',
    sections: [
      {
        title: 'Descansos',
        entries: [
          { term: 'Curto (1 hora)', text: 'Precisa de 1+ PV. Gaste Dados de Vida: role cada um + mod. de CON e recupere esses PV. Interrompido por Iniciativa, magia (não truque) ou dano.' },
          { term: 'Longo (8 horas)', text: 'Precisa de 1+ PV; dorme 6 h e até 2 h de atividade leve. Recupera todos os PV e Dados de Vida e tira 1 nível de Exaustão. Só 1 a cada 24 h.' },
          { term: 'Longo interrompido', text: 'Iniciativa, magia (não truque), dano ou 1 h de esforço. Se já passou 1 h, conta como Descanso Curto.' },
        ],
      },
      {
        title: 'Luz e visão',
        entries: [
          { term: 'Luz Plena', text: 'Visão normal.' },
          { term: 'Meia-luz', text: 'Parcialmente Obscurecido: Desvantagem em SAB (Percepção) que use a visão.' },
          { term: 'Escuridão', text: 'Totalmente Obscurecido: na prática você fica Cego para o que está lá.' },
          { term: 'Visão no Escuro', text: 'No alcance, Meia-luz vira Luz Plena e Escuridão vira Meia-luz (só em tons de cinza).' },
        ],
      },
      {
        title: 'Movimento',
        entries: [
          { term: 'Terreno Difícil', text: 'Cada 1,5 m custa 3 m. Não acumula.' },
          { term: 'Levantar-se', text: 'Gasta metade do Deslocamento para sair de Caído.' },
          { term: 'Rastejar', text: 'Custa o dobro (o triplo em Terreno Difícil).' },
          { term: 'Escalar / Nadar', text: 'Custa o dobro (o triplo em Terreno Difícil), a menos que tenha deslocamento de escalada ou natação. Superfície lisa ou água agitada: FOR (Atletismo), a critério do Mestre.' },
          { term: 'Salto em Distância', text: '30 cm por ponto de Força, com corrida de 3 m; parado, metade. Cada metro saltado gasta movimento.' },
          { term: 'Salto em Altura', text: '1 m + 30 cm por modificador de FOR (mín. 0), com corrida de 3 m; parado, metade.', raw: true },
        ],
      },
      {
        title: 'Ritmo de viagem',
        raw: true,
        entries: [
          { term: 'Rápido', text: '6 km/h · 45 km/dia. Desvantagem em SAB (Percepção, Sobrevivência) e DES (Furtividade).' },
          { term: 'Normal', text: '4,5 km/h · 36 km/dia. Desvantagem em DES (Furtividade).' },
          { term: 'Lento', text: '3 km/h · 27 km/dia. Vantagem em SAB (Percepção, Sobrevivência).' },
        ],
      },
    ],
  },
  {
    title: 'Situações especiais',
    sections: [
      {
        title: 'Agarrar e Empurrar',
        entries: [
          { term: 'Como', text: 'No lugar do dano de um Ataque Desarmado. O alvo pode ser no máximo 1 tamanho maior que você.' },
          { term: 'CD', text: '8 + mod. de FOR + Bônus de Proficiência. O alvo escolhe salvaguarda de FOR ou DES.' },
          { term: 'Imobilizar', text: 'Precisa de uma mão livre. Na falha, o alvo fica Imobilizado. Para escapar: ação e FOR (Atletismo) ou DES (Acrobacia) contra a mesma CD.' },
          { term: 'Empurrar', text: 'Na falha, o alvo vai 1,5 m para longe ou fica Caído.' },
        ],
      },
      {
        title: 'Perigos',
        entries: [
          { term: 'Queda', text: '1d6 de dano Contundente a cada 3 m (máx. 20d6) e fica Caído. Caindo na água: Reação + FOR (Atletismo) ou DES (Acrobacia) CD 15 para levar metade.' },
          { term: 'Asfixia', text: 'Prende a respiração por 1 + mod. de CON minutos (mín. 30 s). Depois, ganha 1 nível de Exaustão ao fim de cada turno; perde todos ao voltar a respirar.' },
          { term: 'Debaixo d’água', text: 'Corpo a corpo sem deslocamento de natação: Desvantagem, salvo dano Perfurante. À distância: erra além do alcance normal e tem Desvantagem dentro dele. Resistência a dano Ígneo.' },
        ],
      },
    ],
  },
];

export function RulesTab() {
  return (
    <div className={ddb.tab}>
      {GROUPS.map(group => (
        <div key={group.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.grid}>
            {group.sections.map(section => (
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
        </div>
      ))}
      <div className={ddb.notes}>Resumo das regras do Livro do Jogador 2024. Em caso de dúvida, vale o livro e o Mestre.</div>
    </div>
  );
}
