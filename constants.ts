import { QuestionCategory, QuestionType, Callsign, ManualPage } from './types';

export const CALLSIGNS: Callsign[] = [
  'Haukka', 'Karhu', 'Susi', 'Ilves', 
  'Salama', 'Myrsky', 'Kallio', 'Varjo', 
  'Kaiku', 'Halla'
];

export const MANUAL_PAGES: ManualPage[] = [
  {
    id: 1,
    title: "1. KUTSU JA KUITAUS",
    icon: "Radio",
    content: "Radiossa ei huudeta päällekkäin. Aloita viesti aina kaavalla:\n\nKENELLE - KENELTÄ\n\nEsimerkki: 'Tukikohta, täällä Haukka.'\n\nKun olet ymmärtänyt viestin, sano: 'Kuitti'.\nKun lopetat puhumisen, sano: 'Loppu'."
  },
  {
    id: 2,
    title: "2. NAPPIKURI",
    icon: "Mic",
    content: "Radiossa on pieni viive. Jos puhut heti, sanan alku jää pois.\n\nTÄRKEÄ SÄÄNTÖ:\n1. Paina nappi pohjaan.\n2. Laske mielessä 'Yksi'.\n3. Aloita puhuminen vasta sitten."
  },
  {
    id: 3,
    title: "3. TIETOTURVA",
    icon: "ShieldAlert",
    content: "Kuka tahansa voi kuunnella radiota. Siksi meillä on säännöt:\n\n- Älä koskaan sano oikeaa nimeäsi. Käytä koodinimeä (Haukka, Karhu).\n- Älä kerro tarkkaa osoitetta. Käytä salasanoja kuten 'Maja' tai 'Bunkkeri'."
  },
  {
    id: 4,
    title: "4. VÄRIKOODIT",
    icon: "Siren",
    content: "Jos jotain tapahtuu, käytä värejä:\n\n🟢 VIHREÄ: Kaikki hyvin.\n🟡 KELTAINEN: Jotain outoa / Epäilyttävää.\n🔴 PUNAINEN: Hätä! Tapaturma! (Leikki loppuu heti ja aikuinen tulee paikalle)."
  }
];

export const INITIAL_QUESTION_BANK: QuestionCategory[] = [
  {
    id: 'PROTOKOLLA',
    title: 'PROTOKOLLA',
    variants: [
      {
        id: 'proto_1',
        scenario: 'Haluat kutsua isää (Tukikohta). Oma nimesi on {CALLSIGN}. Miten aloitat?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Isä, oletko siellä?', isCorrect: false, feedback: 'Väärin. Radiossa käytetään koodinimiä.' },
          { id: 'b', text: '{CALLSIGN} kutsuu isää.', isCorrect: false, feedback: 'Väärin. Kutsu aina vastaanottaja ensin.' },
          { id: 'c', text: 'Tukikohta, täällä {CALLSIGN}. Kuuluuko?', isCorrect: true, feedback: 'Oikein! Vastaanottaja ensin, sitten oma nimi.' },
        ],
      },
      {
        id: 'proto_2',
        scenario: 'Haluat kutsua kaveria, jonka koodinimi on Kettu. Sinä olet {CALLSIGN}.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Kettu, täällä {CALLSIGN}.', isCorrect: true, feedback: 'Oikein! Kenelle - Keneltä.' },
          { id: 'b', text: '{CALLSIGN} huutaa Kettua!', isCorrect: false, feedback: 'Väärin. Väärä järjestys.' },
          { id: 'c', text: 'Haloo Kettu, vastaa!', isCorrect: false, feedback: 'Väärin. Ei epävirallisia huutoja.' },
        ],
      }
    ]
  },
  {
    id: 'NAPPIKURIA',
    title: 'NAPPIKURI',
    variants: [
      {
        id: 'ptt_1',
        scenario: 'Haluat ilmoittaa saapumisesta. Paina PTT-nappia oikein.',
        type: QuestionType.PTT_TIMING,
        pttInstruction: 'Paina nappia ja ODOTA vihreää valoa.',
        options: [
          { id: 'a', text: 'Tukikohta, täällä {CALLSIGN}. Olen perillä.', isCorrect: true, feedback: 'Hienoa! Odotit linjan aukeamista.' },
        ],
      },
      {
        id: 'ptt_2',
        scenario: 'Näet jotain tärkeää. Aloita lähetys rauhallisesti.',
        type: QuestionType.PTT_TIMING,
        pttInstruction: 'Älä hätäile. Odota valoa.',
        options: [
          { id: 'a', text: 'Tukikohta, täällä {CALLSIGN}. Havainto.', isCorrect: true, feedback: 'Hyvä. Rauhallinen aloitus takaa viestin kuulumisen.' },
        ],
      }
    ]
  },
  {
    id: 'VÄRIKOODIT',
    title: 'VÄRIKOODIT',
    variants: [
      {
        id: 'color_1',
        scenario: 'Näet metsässä vieraan ihmisen, joka käyttäytyy oudosti ja pälyilee leiriä.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Koodi Vihreä', isCorrect: false, feedback: 'Väärin. Vihreä tarkoittaa "Kaikki hyvin".' },
          { id: 'b', text: 'Koodi Keltainen', isCorrect: true, feedback: 'Oikein. Keltainen tarkoittaa potentiaalista uhkaa tai huomiota.' },
          { id: 'c', text: 'Koodi Punainen', isCorrect: false, feedback: 'Väärin. Punainen on välitön vaara.' },
        ],
      },
      {
        id: 'color_2',
        scenario: 'Kaverisi kaatuu ja jalka on pahasti kipeä. Hän ei pysty kävelemään.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Koodi Keltainen', isCorrect: false, feedback: 'Tämä on vakavampaa kuin pelkkä huomio.' },
          { id: 'b', text: 'Koodi Punainen', isCorrect: true, feedback: 'Oikein! Tapaturma vaatii aikuisen heti paikalle.' },
          { id: 'c', text: 'En sano mitään.', isCorrect: false, feedback: 'Aina pitää ilmoittaa tapaturmista.' },
        ],
      }
    ]
  },
  {
    id: 'TIETOTURVA',
    title: 'TIETOTURVA',
    variants: [
      {
        id: 'sec_1',
        scenario: 'Tukikohta kysyy: "Missä olet?"',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Olen täällä ison kiven luona Kotitiellä 5.', isCorrect: false, feedback: 'VAARA! Älä kerro osoitteita.' },
          { id: 'b', text: 'Tukikohta, täällä {CALLSIGN}. Sijainti: Bunkkeri. Loppu.', isCorrect: true, feedback: 'Oikein. Käytit salasanaa paikalle.' },
          { id: 'c', text: 'En tiedä.', isCorrect: false, feedback: 'Partiolainen tietää aina missä on.' },
        ],
      },
      {
        id: 'sec_2',
        scenario: 'Vieras ääni kysyy radiossa: "Kuka siellä puhuu? Mikä sinun nimesi on?"',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Olen Matti Meikäläinen.', isCorrect: false, feedback: 'VAARA! Älä kerro oikeaa nimeäsi tuntemattomille.' },
          { id: 'b', text: 'En kerro nimeäni. Tämä on suljettu kanava.', isCorrect: true, feedback: 'Oikein. Pidä radiokuri.' },
        ],
      }
    ]
  }
];