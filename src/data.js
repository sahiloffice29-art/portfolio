export const services = [
  { id: 'photography', number: '01', title: 'Photography', kind: 'Capture', text: 'Portraits, campaigns, and frames that hold a mood.' },
  { id: 'photo-editing', number: '02', title: 'Photo Editing', kind: 'Post', text: 'Clean retouching and intentional compositions with room to breathe.' },
  { id: 'color-grading', number: '03', title: 'Color Grading', kind: 'Post', text: 'A considered palette that makes every cut feel like one world.' },
  { id: 'videography', number: '04', title: 'Videography', kind: 'Capture', text: 'Moving images shaped around people, places, and purpose.' },
  { id: 'cinematics', number: '05', title: 'Cinematics', kind: 'Capture', text: 'Light, motion, and atmosphere built for the big feeling.' },
  { id: 'photo-color-grading', number: '06', title: 'Photo Color Grading', kind: 'Post', text: 'Film-inspired tones, skin-safe color, and a signature finish.' },
  { id: 'video-editing', number: '07', title: 'Video Editing', kind: 'Post', text: 'Pace, rhythm, and story from the first assembly to final export.' },
  { id: 'podcast-editing', number: '08', title: 'Podcast Editing', kind: 'Post', text: 'Clear voices, tight pacing, and a clean listening experience.' },
  { id: 'movie-editing', number: '09', title: 'Movie / Serials Editing', kind: 'Post', text: 'Long-form storytelling with patient cuts and confident structure.' },
]

export const tools = [
  { name: 'Premiere Pro', tag: 'EDIT / 01', text: 'Video editing, narrative pacing, and final-cut precision.', services: ['Video Editing', 'Cinematics', 'Podcast Editing'] },
  { name: 'After Effects', tag: 'MOTION / 02', text: 'Motion graphics, compositing, and cinematic effects.', services: ['Cinematics', 'Movie / Serials Editing'] },
  { name: 'DaVinci Resolve', tag: 'COLOR / 03', text: 'Professional color grading and filmic finishing.', services: ['Color Grading', 'Photo Color Grading'] },
  { name: 'Illustrator', tag: 'DESIGN / 04', text: 'Titles, visual systems, and sharp supporting graphics.', services: ['Cinematics', 'Video Editing'] },
  { name: 'Photoshop', tag: 'IMAGE / 05', text: 'Retouching, compositing, and image-led storytelling.', services: ['Photo Editing', 'Photography'] },
  { name: 'Lightroom', tag: 'PHOTO / 06', text: 'Photography organization, tonal control, and color correction.', services: ['Photography', 'Photo Color Grading'] },
  { name: 'Media Encoder', tag: 'DELIVERY / 07', text: 'Reliable exports for every screen, format, and deadline.', services: ['Video Editing', 'Cinematics'] },
]

export const projects = [
  { slug: 'afterglow', title: 'Afterglow / 01', category: 'Color', year: '2025', service: 'Photo Color Grading', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', description: 'A warm, tactile portrait series built around skin, shadow, and late-evening light.' },
  { slug: 'quiet-motion', title: 'Quiet Motion / 02', category: 'Cinematics', year: '2025', service: 'Cinematics', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85', description: 'A cinematic study in movement, texture, and the spaces between scenes.' },
  { slug: 'new-ritual', title: 'New Ritual / 03', category: 'Photography', year: '2024', service: 'Photography', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', description: 'Editorial portraits for a new generation of makers and image-builders.' },
  { slug: 'frame-by-frame', title: 'Frame by Frame / 04', category: 'Editing', year: '2024', service: 'Video Editing', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85', description: 'Story-first post-production for a short film that moves with intention.' },
  { slug: 'blue-hour', title: 'Blue Hour / 05', category: 'Color', year: '2024', service: 'Color Grading', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85', description: 'Cool shadows and luminous highlights for an atmospheric travel campaign.' },
  { slug: 'the-listening-room', title: 'The Listening Room / 06', category: 'Podcast', year: '2023', service: 'Podcast Editing', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85', description: 'A warm sonic identity and clean edit for a long-form creative conversation.' },
]

