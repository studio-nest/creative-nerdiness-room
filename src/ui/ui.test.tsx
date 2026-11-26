import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stations } from '../content';
import { resetRoomStore, useRoomStore } from '../state/useRoomStore';

// The WebGL scene cannot run in jsdom; UI behaviour is tested around a stub.
vi.mock('../scene/Experience', () => ({ default: () => <div data-testid="scene" /> }));
vi.mock('../lib/webgl', () => ({ isWebGLAvailable: vi.fn(() => true) }));

import { App } from '../App';
import { isWebGLAvailable } from '../lib/webgl';

const store = () => useRoomStore.getState();

async function enterRoom() {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByTestId('scene');
  act(() => store().setReady());
  await user.click(screen.getByRole('button', { name: 'Step inside' }));
  return user;
}

describe('App', () => {
  beforeEach(() => {
    resetRoomStore();
    vi.mocked(isWebGLAvailable).mockReturnValue(true);
  });

  it('keeps the door closed until the scene is ready', async () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Loading…' })).toBeDisabled();
    act(() => store().setReady());
    expect(await screen.findByRole('button', { name: 'Step inside' })).toBeEnabled();
  });

  it('lists every station in the dock and opens its panel on click', async () => {
    const user = await enterRoom();
    const dock = screen.getByRole('navigation', { name: 'Room stations' });
    for (const s of stations) expect(within(dock).getByRole('button', { name: s.label })).toBeInTheDocument();

    await user.click(within(dock).getByRole('button', { name: stations[1].label }));
    const heading = screen.getByRole('heading', { level: 2, name: stations[1].title });
    expect(heading).toHaveFocus();
    expect(within(dock).getByRole('button', { name: stations[1].label })).toHaveAttribute('aria-current', 'true');
    expect(window.location.hash).toBe(`#/${stations[1].id}`);
  });

  it('supports the keyboard tour: arrows, digits and Escape', async () => {
    const user = await enterRoom();
    await user.keyboard('{ArrowRight}');
    expect(store().activeId).toBe(stations[0].id);
    await user.keyboard('{ArrowRight}');
    expect(store().activeId).toBe(stations[1].id);
    await user.keyboard('{ArrowLeft}');
    expect(store().activeId).toBe(stations[0].id);
    await user.keyboard('5');
    expect(store().activeId).toBe(stations[4].id);
    await user.keyboard('{Escape}');
    expect(store().activeId).toBeNull();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    // focus goes back to the station the visitor just left
    expect(screen.getByRole('button', { name: stations[4].label })).toHaveFocus();
  });

  it('panel buttons step through stations and close', async () => {
    const user = await enterRoom();
    await user.keyboard('1');
    await user.click(screen.getByRole('button', { name: 'Next station' }));
    expect(store().activeId).toBe(stations[1].id);
    await user.click(screen.getByRole('button', { name: 'Previous station' }));
    expect(store().activeId).toBe(stations[0].id);
    await user.click(screen.getByRole('button', { name: /Close/ }));
    expect(store().activeId).toBeNull();
  });

  it('toggles night lights from the HUD and with N', async () => {
    const user = await enterRoom();
    const toggle = screen.getByRole('button', { name: 'Night lights' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('n');
    expect(store().mode).toBe('day');
  });

  it('switches to the list view and back', async () => {
    const user = await enterRoom();
    await user.click(screen.getByRole('button', { name: 'List view' }));
    expect(screen.queryByTestId('scene')).not.toBeInTheDocument();
    for (const s of stations) expect(screen.getByRole('heading', { level: 2, name: s.title })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '3D room' }));
    expect(await screen.findByTestId('scene')).toBeInTheDocument();
  });

  it('opens a deep-linked station after entering', async () => {
    window.location.hash = `#/${stations[3].id}`;
    await enterRoom();
    expect(store().activeId).toBe(stations[3].id);
  });

  it('falls back to a readable list when WebGL is unavailable', async () => {
    vi.mocked(isWebGLAvailable).mockReturnValue(false);
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not start the 3D view/);
    expect(screen.queryByTestId('scene')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3D room' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(stations.length);
  });
});
