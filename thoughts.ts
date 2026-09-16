/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Thought {
  id: number;
  text: string;
  hasNamePlaceholder: boolean;
  pauseAfter: number; // custom pause in seconds after this phrase
}

export const THOUGHTS_DATA: Omit<Thought, 'hasNamePlaceholder'>[] = [
  { id: 1, text: "Que no nuble la luz del mundo en mí.", pauseAfter: 7 },
  { id: 2, text: "Que la luz del mundo refulja sobre esta apariencia.", pauseAfter: 7 },
  { id: 3, text: "Esta sombra desaparecerá ante la luz.", pauseAfter: 7 },
  { id: 4, text: "Que esto me ayude a aprender el significado del perdón.", pauseAfter: 7 },
  { id: 5, text: "Que no separe mi función de mi voluntad.", pauseAfter: 7 },
  { id: 6, text: "No me valdré de esto para apoyar un propósito ajeno a mí.", pauseAfter: 7 },
  { id: 7, text: "Que la paz se extienda desde mi mente hasta la tuya [nombre].", pauseAfter: 7 },
  { id: 8, text: "Comparto la luz del mundo contigo [nombre].", pauseAfter: 7 },
  { id: 9, text: "Mediante mi perdón puedo ver esto tal como es.", pauseAfter: 7 },
  { id: 10, text: "No me valdré de esto para ocultarme a mí mismo mi función.", pauseAfter: 7 },
  { id: 11, text: "Me valdré de esto como una oportunidad para desempeñar mi función.", pauseAfter: 7 },
  { id: 12, text: "Esto podrá ser una amenaza para mi ego, pero no puede alterar mi función en modo alguno.", pauseAfter: 7 },
  { id: 13, text: "Mi percepción de esto no altera mi función.", pauseAfter: 7 },
  { id: 14, text: "Esto no me confiere una función distinta de la que Dios me dio.", pauseAfter: 7 },
  { id: 15, text: "No me valdré de esto para justificar una función que Dios no me dio.", pauseAfter: 7 },
  { id: 16, text: "Esto no puede separar mi felicidad de mi función.", pauseAfter: 7 },
  { id: 17, text: "La unidad que existe entre mi felicidad y mi función no se ve afectada en modo alguno por esto.", pauseAfter: 7 },
  { id: 18, text: "Nada, incluido esto, puede justificar la ilusión de que puedo ser feliz si dejo de cumplir mi función.", pauseAfter: 7 },
  { id: 19, text: "Que no vea en esto una ilusión de mí mismo.", pauseAfter: 7 },
  { id: 20, text: "Mientras contemplo esto, quiero recordar a mi Creador.", pauseAfter: 7 },
  { id: 21, text: "Mi Creador no creó esto como yo lo estoy viendo.", pauseAfter: 7 },
  { id: 22, text: "Esto no justifica el que niegue a mi Ser.", pauseAfter: 7 },
  { id: 23, text: "No me valdré de esto para atacar al amor.", pauseAfter: 7 },
  { id: 24, text: "No dejaré que esto me tiente a atacarme a mí mismo.", pauseAfter: 7 },
  { id: 25, text: "Que no haga de esto un obstáculo a la visión.", pauseAfter: 7 },
  { id: 26, text: "La luz del mundo desvanecerá todo esto con su resplandor.", pauseAfter: 7 },
  { id: 27, text: "No tengo necesidad de esto. Lo que quiero es ver.", pauseAfter: 7 },
  { id: 28, text: "Que esto no me tiente a buscar mi salvación fuera de mí mismo.", pauseAfter: 7 },
  { id: 29, text: "No permitiré que esto interfiera en la conciencia que tengo de la Fuente de mi salvación.", pauseAfter: 7 },
  { id: 30, text: "Esto no puede privarme de la salvación.", pauseAfter: 7 },
  { id: 31, text: "El plan de Dios para la salvación me librará de mi percepción de esto.", pauseAfter: 7 },
  { id: 32, text: "Esto no es una excepción al plan de Dios para la salvación.", pauseAfter: 7 },
  { id: 33, text: "Quiero percibir esto únicamente a la luz del plan de Dios para la salvación.", pauseAfter: 7 },
  { id: 34, text: "Según contemplo esto estoy eligiendo entre la percepción falsa y la salvación.", pauseAfter: 7 },
  { id: 35, text: "Si veo motivos en esto para abrigar resentimientos, no veré motivos que justifiquen mi salvación.", pauseAfter: 7 },
  { id: 36, text: "Esto es un llamamiento a la salvación, no al ataque.", pauseAfter: 7 },
  { id: 37, text: "Esto no puede ocultar la luz que es mi voluntad ver.", pauseAfter: 7 },
  { id: 38, text: "[nombre], estás en la luz junto conmigo.", pauseAfter: 7 },
  { id: 39, text: "En la luz esto se verá de otra manera.", pauseAfter: 7 },
  { id: 40, text: "Percibiré esto en conformidad con la Voluntad de Dios.", pauseAfter: 7 },
  { id: 41, text: "La Voluntad de Dios, así como la mía, es que tú [nombre], seas Su Hijo.", pauseAfter: 7 },
  { id: 42, text: "Esto es parte de lo que la Voluntad de Dios ha dispuesto para mí, independientemente de cómo lo vea.", pauseAfter: 7 },
  { id: 43, text: "Esto no puede mostrarme la obscuridad, pues la luz ha llegado.", pauseAfter: 7 },
  { id: 44, text: "Tu luz [nombre] es lo único que quiero ver.", pauseAfter: 7 },
  { id: 45, text: "No quiero ver en esto más que lo que realmente se encuentra ahí.", pauseAfter: 7 },
  { id: 46, text: "Mi percepción de esto me muestra que creo en leyes que no existen.", pauseAfter: 7 },
  { id: 47, text: "Veo únicamente las Leyes de Dios operando en esto.", pauseAfter: 7 },
  { id: 48, text: "Que sean las Leyes de Dios las que operen en esto y no las mías.", pauseAfter: 7 },
  { id: 49, text: "Detrás de esto hay un milagro al que tengo derecho.", pauseAfter: 7 },
  { id: 50, text: "No voy a abrigar ningún resentimiento contra ti [nombre], sino que te voy a ofrecer el milagro al que tienes derecho.", pauseAfter: 7 },
  { id: 51, text: "Visto correctamente, esto me ofrece un milagro.", pauseAfter: 7 },
  { id: 52, text: "No quiero mantener este resentimiento separado de mi salvación.", pauseAfter: 7 },
  { id: 53, text: "[nombre], dejemos que los milagros reemplacen todos nuestros resentimientos.", pauseAfter: 7 },
  { id: 54, text: "Detrás de esto se encuentra el milagro que reemplaza todos mis resentimientos.", pauseAfter: 7 },
  { id: 55, text: "Esto supone un problema para mí que quiero que se resuelva.", pauseAfter: 7 },
  { id: 56, text: "El milagro que se encuentra tras este resentimiento lo resolverá por mí.", pauseAfter: 7 },
  { id: 57, text: "La solución de este problema es el milagro que el problema oculta.", pauseAfter: 7 },
  { id: 58, text: "No tengo que esperar a que esto se resuelva.", pauseAfter: 7 },
  { id: 59, text: "Ya se me ha dado la solución a este problema, si estoy dispuesto a aceptarla.", pauseAfter: 7 },
  { id: 60, text: "El tiempo no puede separar este problema de su solución.", pauseAfter: 10 }
];

export const getThoughts = (name: string): Thought[] => {
  const finalName = name.trim() || "Hermano";
  return THOUGHTS_DATA.map(t => {
    const hasNamePlaceholder = t.text.includes("[nombre]");
    const textWithoutComma = t.text.replace(/,\s*\[nombre\]/g, " [nombre]");
    const text = textWithoutComma.replace(/\[nombre\]/g, finalName);
    return {
      ...t,
      text,
      hasNamePlaceholder
    };
  });
};
