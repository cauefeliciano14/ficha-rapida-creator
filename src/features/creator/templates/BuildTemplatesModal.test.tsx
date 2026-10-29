import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuildTemplatesModal } from './BuildTemplatesModal';
import { BUILD_TEMPLATES } from '../../../data/buildTemplates';

describe('BuildTemplatesModal — filtro por classe', () => {
  it('mostra todos os templates quando nenhuma classe está selecionada', () => {
    render(<BuildTemplatesModal onClose={() => {}} onPick={() => {}} />);
    const grid = screen.getByRole('group', { name: 'Filtrar templates por classe' }).parentElement!;
    // todos os cards presentes
    for (const tpl of BUILD_TEMPLATES) {
      expect(within(grid).getByText(tpl.name)).toBeTruthy();
    }
  });

  it('ao clicar no chip de uma classe, mostra só os templates daquela classe', async () => {
    const user = userEvent.setup();
    render(<BuildTemplatesModal onClose={() => {}} onPick={() => {}} />);
    const group = screen.getByRole('group', { name: 'Filtrar templates por classe' });
    const mago = BUILD_TEMPLATES.find(t => t.classId === 'mago')!;
    await user.click(within(group).getByRole('button', { name: 'Mago' }));

    const grid = group.parentElement!;
    for (const tpl of BUILD_TEMPLATES.filter(t => t.classId === 'mago')) {
      expect(within(grid).getByText(tpl.name)).toBeTruthy();
    }
    for (const tpl of BUILD_TEMPLATES.filter(t => t.classId !== 'mago')) {
      expect(within(grid).queryByText(tpl.name)).toBeNull();
    }
  });

  it('o chip "Todas" restaura a lista completa', async () => {
    const user = userEvent.setup();
    render(<BuildTemplatesModal onClose={() => {}} onPick={() => {}} />);
    const group = screen.getByRole('group', { name: 'Filtrar templates por classe' });
    await user.click(within(group).getByRole('button', { name: 'Bardo' }));
    await user.click(within(group).getByRole('button', { name: 'Todas' }));
    const grid = group.parentElement!;
    expect(within(grid).getByText(BUILD_TEMPLATES[0].name)).toBeTruthy();
    expect(within(grid).getByText(BUILD_TEMPLATES[BUILD_TEMPLATES.length - 1].name)).toBeTruthy();
  });

  it('os chips de classe estão em ordem alfabética pt-BR, com "Todas" primeiro', () => {
    render(<BuildTemplatesModal onClose={() => {}} onPick={() => {}} />);
    const group = screen.getByRole('group', { name: 'Filtrar templates por classe' });
    const labels = within(group).getAllByRole('button').map(b => b.textContent);
    expect(labels[0]).toBe('Todas');
    const classLabels = labels.slice(1);
    const sorted = [...classLabels].sort((a, b) => a!.localeCompare(b!, 'pt-BR'));
    expect(classLabels).toEqual(sorted);
  });
});
