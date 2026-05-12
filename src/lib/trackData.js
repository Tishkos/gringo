const COVER_FRONT =
  "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/67fd0813d_lainoficialmexico.png";

const trackData = [
  {
    title: "Mexico Inolvidable (Instrumental)",
    previewSrc: "/audio/previews/01-mexico-inolvidable-instrumental.mp3",
  },
  {
    title: "Hola, Gringo",
    previewSrc: "/audio/previews/02-hola-gringo.mp3",
  },
  {
    title: "Guadalajara (West Coast)",
    previewSrc: "/audio/previews/03-guadalajara-west-coast.mp3",
  },
  {
    title: "El Gaucho sin Caballo",
    previewSrc: "/audio/previews/04-el-gaucho-sin-caballo.mp3",
  },
  {
    title: "Gol para México con los Mariachis",
    previewSrc: "/audio/previews/05-gol-para-mexico-con-los-mariachis.mp3",
  },
  {
    title: "Hemos Perdido",
    previewSrc: "/audio/previews/06-hemos-perdido.mp3",
  },
  {
    title: "No One Believes in Tomorrow",
    previewSrc: "/audio/previews/07-no-one-believes-in-tomorrow.mp3",
  },
  {
    title: "Rumba Gol para México",
    previewSrc: "/audio/previews/08-rumba-gol-para-mexico.mp3",
  },
  {
    title: "The Women Take the City",
    previewSrc: "/audio/previews/09-the-women-take-the-city.mp3",
  },
  {
    title: "Mexico Inolvidable (Vocal)",
    previewSrc: "/audio/previews/10-mexico-inolvidable-vocal.mp3",
  },
  {
    title: "Guadalajara (Lat)",
    previewSrc: "/audio/previews/11-guadalajara-lat.mp3",
  },
  {
    title: "Gol para mexico additional",
    previewSrc: "/audio/previews/12-gol-para-mexico-additional.mp3",
  },
];

export const tracks = trackData.map((track, index) => ({
  id: index + 1,
  title: track.title,
  previewSrc: track.previewSrc,
  cover: COVER_FRONT,
  lyrics:
    track.title.includes("Instrumental")
      ? "Instrumental track."
      : "Lyrics will be available soon.",
  notes_en: "Official Hola Gringo digital album preview.",
  notes_es: "Preview oficial del album digital Hola Gringo.",
  description_en: `${String(index + 1).padStart(2, "0")} · ${track.title}`,
  description_es: `${String(index + 1).padStart(2, "0")} · ${track.title}`,
}));
