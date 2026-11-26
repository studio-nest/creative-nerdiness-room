import type { RoomContent } from './types';

/**
 * THE ROOM'S CONTENT.
 *
 * Edit this file to change what the room says. The showcase items below are
 * starter placeholders written in the artist's voice: swap in real projects,
 * add `href` / `image` fields, and they appear in the panel and the list view
 * with no rendering changes.
 */
export const room: RoomContent = {
  artist: {
    name: 'Creative Nerdiness',
    role: 'Independent multidisciplinary artist',
    intro:
      'A room full of half-finished sketches, too many yarn balls and one very opinionated cat. Poke around: everything in here is something I make, love or am still learning.',
    links: [
      // Add real links here, e.g. { label: 'Instagram', href: 'https://…' }
    ],
  },

  overview: {
    target: [-0.2, 1.5, -0.2],
    azimuth: Math.PI / 4,
    polar: 1.05,
    distance: 15,
    designAspect: 1.15,
  },

  intro: {
    target: [-0.2, 1.8, -0.2],
    azimuth: 0.35,
    polar: 0.8,
    distance: 21,
    designAspect: 1.15,
  },

  guitarLines: [
    '♪ Strum! (Three chords, all of them slightly off.)',
    '♪ A tiny lo-fi riff drifts across the room.',
    '♫ The cat flicks an ear. High praise.',
  ],

  // Wall pieces sit just in front of a wall: the back wall is z = -4.2 (facing
  // +z, rotationY 0) and the left wall is x = -4.2 (facing +x, rotationY PI/2).
  decor: [
    { id: 'pegboard', kind: 'pegboard', position: [-2.55, 2.85, -4.17] },
    { id: 'corkboard', kind: 'corkboard', position: [-1.3, 2.9, -4.17] },
    { id: 'crayon', kind: 'crayonDrawing', position: [2.15, 2.1, -4.17], scale: 0.8 },
    { id: 'wall-shelf', kind: 'wallShelf', position: [3.0, 3.5, -4.03] },
    { id: 'pothos', kind: 'hangingPothos', position: [-3.6, 4.0, -3.75] },
    { id: 'monstera', kind: 'monstera', position: [-3.5, 0, -3.45], scale: 1.1 },
    { id: 'guitar', kind: 'guitar', position: [-3.82, 0, -0.72], rotationY: Math.PI / 2 },
    { id: 'non-la', kind: 'nonLa', position: [-4.17, 3.2, 3.3], rotationY: Math.PI / 2 },
    { id: 'leaf-print-a', kind: 'leafPrint', position: [-4.17, 3.62, 1.05], rotationY: Math.PI / 2, variant: 'fern' },
    { id: 'leaf-print-b', kind: 'leafPrint', position: [-4.17, 3.6, 1.8], rotationY: Math.PI / 2, variant: 'sprig' },
    { id: 'citrus', kind: 'citrusTree', position: [0.3, 0, -3.72] },
    { id: 'beanbag-sketch', kind: 'beanbag', position: [0.55, 0, 0.3], rotationY: 0.5, variant: 'sketchbook' },
    { id: 'beanbag-reading', kind: 'beanbag', position: [-1.3, 0, 3.3], rotationY: 0.9, variant: 'reading' },
    { id: 'letter-tray', kind: 'letterTray', position: [-0.25, 0, 3.25] },
    { id: 'books-nook', kind: 'bookStack', position: [-2.15, 0, 3.6], rotationY: 0.4 },
    { id: 'books-desk', kind: 'bookStack', position: [3.75, 0, 0.2], rotationY: -0.3, variant: 'tall' },
  ],

  catLines: [
    'Mrrp. (The cat approves of your cursor.)',
    'Purr… do not disturb, creative napping in progress.',
    'The cat has knocked a pen off the desk. Again.',
    'Meow! Translation: “have you seen the yarn basket?”',
  ],

  stations: [
    {
      id: 'design',
      kind: 'designDesk',
      label: 'Design',
      title: 'Graphic design & UI/UX',
      tagline: 'Pixels pushed with love (and a strict 8-point grid).',
      body: [
        'This desk is where brands get their colours, apps get their flows and I argue with myself about corner radii. I like interfaces that feel friendly on the first tap and layouts that leave room to breathe.',
        'Most projects start on paper, move to wireframes, and end with a tidy design system someone else can actually use.',
      ],
      accent: '#e2725b',
      note: 'Currently: building a tiny design system for my own projects.',
      items: [
        {
          title: 'Brand identities',
          blurb: 'Logos, palettes and type systems for small creative businesses.',
          tags: ['Branding', 'Typography'],
        },
        {
          title: 'App & web interfaces',
          blurb: 'Wireframes to polished UI, with prototypes you can actually click.',
          tags: ['UI/UX', 'Prototyping'],
        },
        {
          title: 'Posters & print',
          blurb: 'Event posters, zines and stickers that survive a real printer.',
          tags: ['Print', 'Layout'],
        },
      ],
      placement: {
        position: [-1.45, 0, -3.15],
        rotationY: 0,
        hitbox: [2.9, 2.4, 1.5],
        hitboxOffset: [0, 1.2, 0.1],
        hotspot: [0, 2.55, 0],
      },
      camera: {
        target: [-1.45, 1.35, -3.15],
        azimuth: 0.22,
        polar: 1.25,
        distance: 5.4,
        designAspect: 1.1,
      },
    },
    {
      id: 'illustration',
      kind: 'easel',
      label: 'Illustration',
      title: 'Digital illustration & fanart',
      tagline: 'Drawing the characters that live rent-free in my head.',
      body: [
        'Character art, cosy scenes and an honestly unreasonable amount of fanart. I paint digitally, but I still think in pencil lines and chunky brush strokes.',
        'Fanart is how I say thank you to the stories that shaped me; original pieces are where those influences get remixed.',
      ],
      accent: '#d9a441',
      note: 'Currently: a seasonal illustration series, one painting a week.',
      items: [
        {
          title: 'Character illustrations',
          blurb: 'Original characters with expressive faces and loud colour palettes.',
          tags: ['Characters', 'Digital painting'],
        },
        {
          title: 'Fanart collection',
          blurb: 'Tributes to favourite games, anime and visual novels.',
          tags: ['Fanart', 'Anime'],
        },
        {
          title: 'Stickers & prints',
          blurb: 'Small illustrations designed to end up on laptops and walls.',
          tags: ['Merch', 'Print'],
        },
      ],
      placement: {
        position: [1.35, 0, -2.85],
        rotationY: -0.22,
        hitbox: [1.8, 2.7, 1.5],
        hitboxOffset: [0, 1.35, 0],
        hotspot: [0, 2.85, 0],
      },
      camera: {
        target: [1.35, 1.4, -2.85],
        azimuth: 0.1,
        polar: 1.3,
        distance: 5,
        designAspect: 1.0,
      },
    },
    {
      id: 'photography',
      kind: 'photoCorner',
      label: 'Photography',
      title: 'Photography',
      tagline: 'Collecting light, one quiet moment at a time.',
      body: [
        'I carry a camera mostly as an excuse to slow down. Street corners, late-afternoon light, tiny details most people walk past.',
        'Photography feeds everything else in this room: composition for design, colour for illustration, mood for stories.',
      ],
      accent: '#4f8a8b',
      note: 'Currently: shooting a series about windows at golden hour.',
      items: [
        {
          title: 'Street & travel',
          blurb: 'Wandering with one lens and no plan.',
          tags: ['Street', 'Travel'],
        },
        {
          title: 'Still life & details',
          blurb: 'Desks, cups, plants: the small scenes of everyday life.',
          tags: ['Still life', 'Colour'],
        },
        {
          title: 'Portraits of friends',
          blurb: 'Relaxed, natural-light portraits of people I like.',
          tags: ['Portrait', 'Natural light'],
        },
      ],
      placement: {
        position: [-3.4, 0, 1.55],
        rotationY: Math.PI / 2,
        // Rotated onto the left wall: local x runs along -z, local z along +x.
        // Kept clear of the floor lamp so the lamp stays clickable.
        hitbox: [1.7, 3.3, 1.0],
        hitboxOffset: [-0.2, 1.65, 0.1],
        hotspot: [0, 3.35, -0.2],
      },
      camera: {
        target: [-3.4, 1.75, 1.55],
        azimuth: 1.28,
        polar: 1.32,
        distance: 5.8,
        designAspect: 1.05,
      },
    },
    {
      id: 'stories',
      kind: 'bookshelf',
      label: 'Stories',
      title: 'Visual novels & storytelling',
      tagline: 'Branching paths, bittersweet endings, one more chapter.',
      body: [
        'I love stories you can step inside. Visual novels taught me how much feeling fits into a sprite, a text box and a well-timed pause.',
        'I write small interactive stories of my own and collect the ones that made me cry at 2am.',
      ],
      accent: '#8e6aa8',
      note: 'Currently: outlining a short visual novel about a lighthouse keeper.',
      items: [
        {
          title: 'Short visual novel (in progress)',
          blurb: 'A cosy mystery with three endings and hand-drawn sprites.',
          tags: ['Writing', 'Game dev'],
        },
        {
          title: 'Character sheets & lore',
          blurb: 'Backstories, relationship charts and world notes.',
          tags: ['Worldbuilding', 'Characters'],
        },
        {
          title: 'Favourite reads shelf',
          blurb: 'The stories I recommend to anyone who will listen.',
          tags: ['Recommendations'],
        },
      ],
      placement: {
        position: [-3.6, 0, -2.0],
        rotationY: Math.PI / 2,
        hitbox: [2.0, 3.2, 1.0],
        hitboxOffset: [0, 1.6, 0.1],
        hotspot: [0, 3.4, 0],
      },
      camera: {
        target: [-3.6, 1.6, -2.0],
        azimuth: 1.22,
        polar: 1.3,
        distance: 5.6,
        designAspect: 1.05,
      },
    },
    {
      id: 'gaming',
      kind: 'gamingNook',
      label: 'Games & anime',
      title: 'Gaming & anime',
      tagline: 'Save point reached. Snacks acquired.',
      body: [
        'Cosy games, big JRPGs, late-night anime marathons. This corner is where most of my colour palettes and character obsessions are born.',
        'I pay attention to the craft: UI in games, key animation frames, how a soundtrack makes a menu feel like home.',
      ],
      accent: '#5d7bd5',
      note: 'Currently: replaying an old favourite and screenshotting every menu.',
      items: [
        {
          title: 'Game UI studies',
          blurb: 'Redrawing and analysing menus and HUDs from games I love.',
          tags: ['UI', 'Study'],
        },
        {
          title: 'Pixel art experiments',
          blurb: 'Tiny sprites and looping animations, 32 pixels at a time.',
          tags: ['Pixel art', 'Animation'],
        },
        {
          title: 'Watch & play list',
          blurb: 'The anime and games currently fuelling the fanart pile.',
          tags: ['Anime', 'Games'],
        },
      ],
      placement: {
        position: [2.95, 0, -3.2],
        rotationY: 0,
        hitbox: [2.0, 3.0, 1.9],
        hitboxOffset: [0, 1.5, 0.35],
        hotspot: [0, 3.25, 0],
      },
      camera: {
        target: [2.95, 1.35, -3.2],
        azimuth: 0.18,
        polar: 1.27,
        distance: 5.4,
        designAspect: 1.05,
      },
    },
    {
      id: 'crochet',
      kind: 'crochetCorner',
      label: 'Crochet',
      title: 'Crochet & handmade crafts',
      tagline: 'Turning yarn into tiny friends, one stitch at a time.',
      body: [
        'After a day of screens, I want to make something I can hold. Amigurumi, granny squares and the occasional slightly lopsided scarf.',
        'Handmade things remind me that imperfection is charming, which is a lesson my digital work needs too.',
      ],
      accent: '#d77a94',
      note: 'Currently: crocheting a family of very round frogs.',
      items: [
        {
          title: 'Amigurumi friends',
          blurb: 'Small crocheted characters, many based on my own illustrations.',
          tags: ['Amigurumi', 'Characters'],
        },
        {
          title: 'Cosy wearables',
          blurb: 'Hats, scarves and one ambitious cardigan.',
          tags: ['Wearables', 'Yarn'],
        },
        {
          title: 'Pattern notes',
          blurb: 'Patterns and stitch diagrams I am writing up to share.',
          tags: ['Patterns', 'Tutorials'],
        },
      ],
      placement: {
        position: [2.45, 0, 1.25],
        rotationY: 0.9,
        hitbox: [1.9, 1.5, 1.5],
        hitboxOffset: [0, 0.85, 0],
        hotspot: [0.2, 1.65, 0],
      },
      camera: {
        target: [2.45, 0.7, 1.25],
        azimuth: 1.1,
        polar: 1.05,
        distance: 4.9,
        designAspect: 1.1,
      },
    },
    {
      id: 'threed',
      kind: 'pedestal3d',
      label: '3D & motion',
      title: 'Learning 3D, animation & creative tech',
      tagline: 'Currently confusing myself with vertices. Send help (and tutorials).',
      body: [
        'The newest corner of the room. I am learning to model, light and animate, and to build interactive things for the web, like the room you are standing in.',
        'Being a beginner again is humbling and fun. Every wobbly render gets pinned up here.',
      ],
      accent: '#3f9d7c',
      note: 'Currently: learning rigging so my characters can finally wave.',
      items: [
        {
          title: 'Low-poly dioramas',
          blurb: 'Tiny modelled scenes, practising shape, light and colour.',
          tags: ['Modelling', 'Lighting'],
        },
        {
          title: 'Animation exercises',
          blurb: 'Bouncing balls, walk cycles and squashy stretchy things.',
          tags: ['Animation', 'Fundamentals'],
        },
        {
          title: 'This interactive room',
          blurb: 'A real-time 3D portfolio built with React and Three.js.',
          tags: ['WebGL', 'Creative code'],
        },
      ],
      placement: {
        position: [-3.2, 0, 3.35],
        rotationY: 0.4,
        hitbox: [1.5, 2.5, 1.5],
        hitboxOffset: [0, 1.25, 0],
        hotspot: [0, 2.25, 0],
      },
      camera: {
        target: [-3.2, 1.15, 3.35],
        azimuth: 1.0,
        polar: 1.15,
        distance: 4.8,
        designAspect: 1.0,
      },
    },
  ],
};
