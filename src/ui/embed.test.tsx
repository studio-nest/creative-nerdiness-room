import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { resetRoomStore, useRoomStore } from '../state/useRoomStore';

vi.mock('../scene/Experience', () => ({ default: () => <div data-testid="scene" /> }));
vi.mock('../lib/webgl', () => ({ isWebGLAvailable: () => true }));
vi.mock('../lib/embed', () => ({ IS_EMBED: true, fullScreenUrl: () => 'https://example.test/room/' }));

import { App } from '../App';

describe('App embedded in another page', () => {
  beforeEach(resetRoomStore);

  it('does not load the 3D scene until the visitor asks, then walks straight in', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByTestId('scene')).not.toBeInTheDocument();

    const enter = screen.getByRole('button', { name: 'Step inside' });
    expect(enter).toBeEnabled();
    await user.click(enter);
    expect(await screen.findByTestId('scene')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Loading…' })).toBeDisabled();

    act(() => useRoomStore.getState().setReady());
    expect(useRoomStore.getState().entered).toBe(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('offers a full-screen link once inside', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Step inside' }));
    act(() => useRoomStore.getState().setReady());
    const link = screen.getByRole('link', { name: /Full screen/ });
    expect(link).toHaveAttribute('href', 'https://example.test/room/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
