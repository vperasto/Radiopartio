import { QuestionCategory, QuestionType, Callsign, ManualPage } from './types';

export const CALLSIGNS: Callsign[] = [
  'Haukka', 'Karhu', 'Susi', 'Ilves', 
  'Salama', 'Myrsky', 'Kallio', 'Varjo', 
  'Kaiku', 'Halla'
];

export const MANUAL_PAGES: ManualPage[] = [
  {
    id: 1,
    title: "1. KUTSUKAAVA",
    icon: "Radio",
    content: "Radiossa ei huudeta 'haloo'.\nKäytä aina tätä kaavaa:\n\n1. KENELLE (Vastaanottaja)\n2. KENELTÄ (Sinä)\n\nEsimerkki: 'Tukikohta, täällä Haukka.'"
  },
  {
    id: 2,
    title: "2. NAPPIKURI",
    icon: "Mic",
    content: "Radio on hitaampi kuin puhelin.\n\nOIKEA TYYLI:\n1. Paina nappi pohjaan.\n2. Laske mielessä 'YKSI'.\n3. Puhu vasta sitten.\n\nJos puhut heti, viestin alku leikkaantuu pois!"
  },
  {
    id: 3,
    title: "3. SALAISUUDET",
    icon: "ShieldAlert",
    content: "Radiota voi kuunnella kuka vain.\n\nSiksi meillä on säännöt:\n- Älä koskaan sano omaa nimeäsi.\n- Älä kerro kotiosoitetta.\n\nKäytä aina koodinimiä!"
  },
  {
    id: 4,
    title: "4. VÄRIKOODIT",
    icon: "Siren",
    content: "Ilmoita tilanne väreillä:\n\n🟢 VIHREÄ: Kaikki ok.\n🟡 KELTAINEN: Jotain outoa (ilmoita heti).\n🔴 PUNAINEN: HÄTÄ! (Ei leikkiä! Nyt tarvitaan aikuista)."
  },
  {
    id: 5,
    title: "5. KUITTI & LOPPU",
    icon: "CheckCircle2",
    content: "Nämä ovat kaksi eri asiaa:\n\nKUITTI = 'Ymmärsin viestisi.'\nLOPPU = 'Lopetin puhumisen, sinun vuorosi.'\n\nSano 'LOPPU', jotta kaveri tietää milloin saa painaa nappia!"
  },
  {
    id: 6,
    title: "6. TÄRKEÄ SÄÄNTÖ",
    icon: "Wifi",
    content: "Älä koskaan kanna radiota sen antennista!\n\nAntenni on radion herkin osa. Jos se vääntyy sisältä, äänesi ei lennä enää perille.\n\nPidä kiinni vain laitteen rungosta."
  }
];

export const RADIO_FACTS = [
    "Lentäjät sanovat 'Roger', mikä tarkoittaa 'Viesti saatu'. R-kirjain on aakkosissa nykyään 'Romeo', mutta kuittauksena käytetään yhä vanhaa kunnon 'Rogeria'!",
    "Radioaallot eivät tykkää taloista tai mäistä. Jos yhteys pätkii, kiipeä korkeammalle kivelle tai mene ikkunaan. Ylhäältä kuuluu kauemmas!",
    "Radiopuhelimen keksi kanadalainen Donald Hings vuonna 1937. Sitä kutsuttiin aluksi nimellä 'packset'.",
    "Radiopuhelin on 'Simplex'-laite. Se tarkoittaa, että vain yksi voi puhua kerrallaan. Jos painatte nappia yhtä aikaa, kuuluu vain surinaa.",
    "Avaruudessa ei ole ilmaa, joten ääni ei kulje ilman radiota. Astronautit ovat radioammattilaisia!",
    "Sotilaat ja poliisit käyttävät radiokieltä, jotta viestit olisivat lyhyitä ja selkeitä melussa.",
    "Radioaallot kulkevat valon nopeudella. Viestisi on perillä melkein heti!",
    "Sana 'Mayday' (hätäkutsu) tulee ranskan kielen sanasta 'm'aidez', mikä tarkoittaa 'auta minua'.",
    "Jos sanot radiossa 'Toista', kaveri kertoo asian uudestaan. Radiokieli on tehty helpoksi.",
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