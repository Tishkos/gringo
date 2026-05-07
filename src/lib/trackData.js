const COVER_FRONT =
  "https://media.base44.com/images/public/user_6970ab0e6ab454a747b1106c/67fd0813d_lainoficialmexico.png";

const trackTitles = [
  "Mexico Inolvidable (Instrumental)",
  "Hola, Gringo",
  "Guadalajara (West Coast)",
  "El Gaucho sin Caballo",
  "Gol para México con los Mariachis",
  "Hemos Perdido",
  "No One Believes in Tomorrow",
  "Rumba Gol para México",
  "The Women Take the City",
  "Mexico Inolvidable (Vocal)",
  "Guadalajara (Lat)",
  "Gol para mexico additional",
];

export const tracks = trackTitles.map((title, index) => ({
  id: index + 1,
  title,
  cover: COVER_FRONT,
  lyrics:
    title.includes("Instrumental")
      ? "Instrumental track."
      : "Lyrics will be available soon.",
  notes_en: "Official Hola Gringo digital album track.",
  notes_es: "Canción oficial del álbum digital Hola Gringo.",
  description_en: `${String(index + 1).padStart(2, "0")} · ${title}`,
  description_es: `${String(index + 1).padStart(2, "0")} · ${title}`,
}));
