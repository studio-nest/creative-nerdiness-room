import type { RoomContent } from './types';

/**
 * THE ROOM'S CONTENT.
 *
 * Edit this file to change what the room says. Projects come from
 * kei.framer.website; add `image` + `imageAlt` to a showcase item to show a
 * picture, and it appears in the panel and the list view with no rendering
 * changes.
 */
export const room: RoomContent = {
  artist: {
    name: 'Creative Nerdiness',
    role: 'Kei · designer, illustrator & photographer in Singapore',
    intro:
      "Hi, I'm Kei, a Vietnamese designer and artist based in Singapore. Visual maker, photo-taker, scribbler. This room is full of half-finished sketches, too many yarn balls and one very opinionated cat: poke around, everything in here is something I make, love or am still learning.",
    links: [
      { label: 'Portfolio', href: 'https://kei.framer.website/' },
      { label: 'Instagram', href: 'https://www.instagram.com/creative.nerdiness/' },
      { label: 'Behance', href: 'https://behance.net/NNKhanh' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nnkhanh' },
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
        'Ten years of designing things people actually use: character merchandise, internal software, consumer apps, brands and large-format graphics. I like interfaces that feel friendly on the first tap and layouts that leave room to breathe.',
        "I've often been the only designer on the team, so I'm used to owning everything from the logo to the last edge case.",
      ],
      accent: '#e2725b',
      note: "Now: Graphic Designer at Q's Advertising, Singapore, on advertising, experiential and spatial projects.",
      items: [
        {
          title: 'LOOP · Employee rewards platform',
          blurb: 'A FinTech platform where employees trade points for vouchers, gift cards, company swag or donations. UI/UX, logo, branding and the Webflow build (2023).',
          tags: ['UI/UX', 'Branding', 'Webflow'],
          href: 'https://kei.framer.website/work/loop',
        },
        {
          title: 'Skica · Skincare app',
          blurb: 'A skincare app with a cute AI assistant. As co-founder and the only designer I owned the characters, UX, UI and branding, and the MVP was acquired by a US beauty company (2020–21).',
          tags: ['Mobile', 'UI/UX', 'Branding'],
          href: 'https://kei.framer.website/work/skica',
        },
        {
          title: 'StudioDesk · Tools for artists',
          blurb: 'A web app of tools for working artists that I designed, built and product-managed (2026).',
          tags: ['UI/UX', 'Web dev', 'Product'],
          href: 'https://studio-desk.vercel.app/',
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
        "Character art, IP character extension and an honestly unreasonable amount of fanart. I've painted custom commissions through VGen and sold my own merch at artist alleys around Singapore.",
        'Fanart is how I say thank you to the stories that shaped me; original pieces are where those influences get remixed.',
      ],
      accent: '#d9a441',
      note: 'Freelance illustration commissions: ongoing.',
      items: [
        {
          title: 'Digital Art Collection',
          blurb: 'Two dozen digital paintings and illustrations, from character pieces to full scenes.',
          tags: ['Digital painting', 'Illustration'],
          href: 'https://kei.framer.website/work/digital-art',
        },
        {
          title: 'Merchandise designs',
          blurb: 'Character standees, acrylic charms and other goods, taken from illustration through packaging to production.',
          tags: ['Product', 'Packaging', 'Merch'],
          href: 'https://kei.framer.website/work/merchandise',
        },
        {
          title: 'Licensed character merchandise',
          blurb: 'Senior designer at TAGGER Licensing (2015–18): physical character merchandise, and working with Disney Singapore to bring Disney goods to Vietnam.',
          tags: ['Licensing', 'Merchandise'],
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
        'I carry a camera mostly as an excuse to slow down. These days that means portraits: directing the shoot, taking the photos and retouching them.',
        "I've also shot product and mood photography for food brands, and photography feeds everything else in this room: composition for design, colour for illustration, mood for stories.",
      ],
      accent: '#4f8a8b',
      items: [
        {
          title: 'Portraits',
          blurb: 'Portrait sessions, from direction to retouching.',
          tags: ['Portrait', 'Retouching'],
          href: 'https://www.playbook.com/s/keiphotokraft/portraits',
        },
        {
          title: 'Product & mood photography',
          blurb: 'Seasonal product and mood shoots for two food brands, The Cakery and KIRR Concept, in Hong Kong (2019–20).',
          tags: ['Product', 'Food'],
        },
        {
          title: 'Gingerbread tutorial',
          blurb: 'A cooking tutorial I shot, edited and colour-graded for YouTube.',
          tags: ['Video', 'Colour grading'],
          href: 'https://kei.framer.website/#reels',
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
        'So I design for storytellers too, from a game-jam visual novel to a whole platform for authors building their worlds.',
      ],
      accent: '#8e6aa8',
      items: [
        {
          title: 'Heartlander Housewife · Visual novel',
          blurb: 'Made in a week for the Singapore Heritage Game Jam: a visual novel about a lonely woman in a disconnected marriage during the pandemic, told through distinctly Singaporean characters. I did the UI and backgrounds and stepped in on character art.',
          tags: ['Visual novel', 'UI', 'Backgrounds'],
          href: 'https://kei.framer.website/work/games',
        },
        {
          title: 'LoreSmith · Worldbuilding for authors',
          blurb: 'A web platform where authors build and keep track of their worlds. I designed, built and product-managed it (2026).',
          tags: ['UI/UX', 'Web dev', 'Product'],
          href: 'https://loresmith-v0.vercel.app/',
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
        'Games and anime are where most of my colour palettes and character obsessions are born.',
        "I pay attention to the craft: UI in games, key animation frames, how a soundtrack makes a menu feel like home. And I've designed game UI for jams and volunteer projects.",
      ],
      accent: '#5d7bd5',
      items: [
        {
          title: 'Kids Play Safer',
          blurb: 'A volunteer project for better.sg: a matching game a caregiver plays with a child, meant to start conversations rather than score right answers. UI design.',
          tags: ['Game UI', 'Volunteer'],
          href: 'https://kei.framer.website/work/games',
        },
        {
          title: 'CMYK',
          blurb: 'Made in a week for Global Game Jam: a 3D browser shooter where you are a spray can beating enemies with their opposite colour on the colour wheel. My first Unity 3D project; design and art.',
          tags: ['Game jam', 'Unity', 'Art'],
          href: 'https://kei.framer.website/work/games',
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
        'After a day of screens, I want to make something I can hold. Crochet is my slow, offline hobby: some yarn, a hook and a lot of counting.',
        'Handmade things remind me that imperfection is charming, which is a lesson my digital work needs too.',
      ],
      accent: '#d77a94',
      items: [
        {
          title: 'Pieces coming soon',
          blurb: 'Photos of finished pieces will be pinned up here.',
          tags: ['Crochet', 'Handmade'],
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
        "The newest corner of the room. I'm learning to model, light and animate in Spline, Blender and Nomad, and to build interactive things for the web, like the room you're standing in.",
        'Being a beginner again is humbling and fun. Every wobbly render gets pinned up here.',
      ],
      accent: '#3f9d7c',
      items: [
        {
          title: '3D Experiments',
          blurb: 'Interactive Spline scenes you can orbit and zoom: an explosion-implosion, a grainy cube and sphere, a blob and a keyboard (2026).',
          tags: ['3D', 'Spline', 'Interactive'],
          href: 'https://kei.framer.website/work/3d',
        },
        {
          title: 'Motion graphics',
          blurb: "Short motion pieces, including Skica's launch promo and social posts for Zoey.",
          tags: ['Motion', 'Video'],
          href: 'https://kei.framer.website/#reels',
        },
        {
          title: 'This interactive room',
          blurb: 'A real-time 3D portfolio built with React, Three.js and React Three Fiber.',
          tags: ['WebGL', 'Creative code'],
          href: 'https://github.com/studio-nest/creative-nerdiness-room',
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
