import { describe, expect, it } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, type Object3D } from 'three';
import { InkToonMaterial } from './ink';
import { LIVE, LIVE_CHILDREN, batchStatic } from './Merge';

const red = new InkToonMaterial({ color: '#ff0000' });
const blue = new InkToonMaterial({ color: '#0000ff' });

function box(material = red, x = 0) {
  const m = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), material);
  m.position.x = x;
  return m;
}
const merged = (o: Object3D) => o.children.filter((c) => c.userData.merged) as Mesh[];

describe('batchStatic', () => {
  it('merges meshes that share a material and hides the originals', () => {
    const root = new Group();
    const a = box(red, 0);
    const b = box(red, 2);
    root.add(a, b);
    batchStatic(root);
    const out = merged(root);
    expect(out).toHaveLength(1);
    expect(out[0].material).toBe(red);
    expect(a.visible).toBe(false);
    expect(b.visible).toBe(false);
    // the batched geometry keeps each part where it was
    out[0].geometry.computeBoundingBox();
    expect(out[0].geometry.boundingBox!.max.x).toBeCloseTo(2.25);
  });

  it('leaves a lone mesh alone and keeps different materials apart', () => {
    const root = new Group();
    const lone = box(blue);
    root.add(box(red), box(red), lone);
    batchStatic(root);
    expect(merged(root)).toHaveLength(1);
    expect(lone.visible).toBe(true);
  });

  it('batches a LIVE subtree inside the moving object, not with the static room', () => {
    const root = new Group();
    const mover = new Group();
    mover.userData = { ...LIVE };
    mover.position.set(5, 0, 0);
    mover.add(box(red, 0), box(red, 1));
    root.add(box(red), mover);
    batchStatic(root);
    expect(merged(root)).toHaveLength(0); // the single static box is alone
    const inner = merged(mover);
    expect(inner).toHaveLength(1);
    inner[0].geometry.computeBoundingBox();
    // stored relative to the mover, so it travels with it
    expect(inner[0].geometry.boundingBox!.min.x).toBeCloseTo(-0.25);
  });

  it('treats each child of a LIVE_CHILDREN group as its own piece', () => {
    const root = new Group();
    const shelf = new Group();
    shelf.userData = { ...LIVE_CHILDREN };
    const fig1 = new Group();
    const fig2 = new Group();
    fig1.add(box(red), box(red, 0.5));
    fig2.add(box(red), box(red, 0.5));
    shelf.add(fig1, fig2);
    root.add(shelf);
    batchStatic(root);
    expect(merged(fig1)).toHaveLength(1);
    expect(merged(fig2)).toHaveLength(1);
    expect(merged(shelf)).toHaveLength(0);
  });

  it('skips transparent and non-toon materials', () => {
    const root = new Group();
    const glass = new InkToonMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 });
    const basic = new MeshBasicMaterial();
    root.add(box(glass), box(glass), box(basic as unknown as InkToonMaterial), box(basic as unknown as InkToonMaterial));
    batchStatic(root);
    expect(merged(root)).toHaveLength(0);
  });

  it('undo restores the original meshes', () => {
    const root = new Group();
    const a = box();
    const b = box(red, 1);
    root.add(a, b);
    const undo = batchStatic(root);
    undo();
    expect(merged(root)).toHaveLength(0);
    expect(a.visible && b.visible).toBe(true);
  });
});
