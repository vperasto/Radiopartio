
import { QuestionCategory, QuestionType, Callsign, ManualPage, Rank } from './types';
import { User, Cat, Dog, Bird, Zap, Shield, Radio, Anchor, Skull, Ghost, Tent, Bug, Signal, MapPin, AlertTriangle, Play, Battery, Lock, ScanLine, RefreshCw, CheckCircle2, Siren, Mic } from 'lucide-react';

export const CALLSIGNS: Callsign[] = [
  'Haukka', 'Karhu', 'Susi' ,'Ilves', 
  'Salama', 'Myrsky', 'Kallio', 'Varjo', 
  'Kaiku', 'Halla'
];

// Progression Logic:
// 0 wins = Rank 0 (Kokelas) -> Plays R0 content.
// 1 win  = Rank 1 (Viestittäjä) -> Plays R1 content.
// 2 wins = Rank 2 (Tarkkailija) -> Plays R2 content.
// 3 wins = Rank 3 (Operaattori) -> Plays R3 content.
export const RANKS: Rank[] = [
    { id: 'R0', title: 'KOKELAS', minPassed: 0, icon: 'User' },
    { id: 'R1', title: 'VIESTITTÄJÄ', minPassed: 1, icon: 'Radio' },
    { id: 'R2', title: 'TARKKAILIJA', minPassed: 2, icon: 'Bird' },
    { id: 'R3', title: 'OPERAATTORI', minPassed: 3, icon: 'Zap' },
];

export const AVATAR_OPTIONS = [
    { id: 'default', icon: User },
    { id: 'cat', icon: Cat },
    { id: 'dog', icon: Dog },
    { id: 'bird', icon: Bird },
    { id: 'zap', icon: Zap },
    { id: 'shield', icon: Shield },
    { id: 'radio', icon: Radio },
    { id: 'anchor', icon: Anchor },
    { id: 'skull', icon: Skull },
    { id: 'ghost', icon: Ghost },
    { id: 'tent', icon: Tent },
    { id: 'bug', icon: Bug },
];

export const MANUAL_PAGES: ManualPage[] = [
  // --- RANK 0 (PERUSTEET) - EXISTING CONTENT ---
  {
    id: 1,
    title: "1. KUTSUKAAVA",
    icon: "Radio",
    requiredRankId: "R0",
    content: "Radiossa ei huudeta 'haloo'.\nKäytä aina tätä kaavaa:\n\n1. KENELLE (Vastaanottaja)\n2. KENELTÄ (Sinä)\n\nEsimerkki: 'Tukikohta, täällä Haukka.'"
  },
  {
    id: 2,
    title: "2. NAPPIKURI",
    icon: "Mic",
    requiredRankId: "R0",
    content: "Radio on hitaampi kuin puhelin.\n\nOIKEA TYYLI:\n1. Paina nappi pohjaan.\n2. Laske mielessä 'YKSI'.\n3. Puhu vasta sitten.\n\nJos puhut heti, viestin alku leikkaantuu pois!"
  },
  {
    id: 3,
    title: "3. SALAISUUDET",
    icon: "ShieldAlert",
    requiredRankId: "R0",
    content: "Radiota voi kuunnella kuka vain.\n\nSiksi meillä on säännöt:\n- Älä koskaan sano omaa nimeäsi.\n- Älä kerro kotiosoitetta.\n\nKäytä aina koodinimiä!"
  },
  {
    id: 4,
    title: "4. VÄRIKOODIT",
    icon: "Siren",
    requiredRankId: "R0",
    content: "Ilmoita tilanne väreillä:\n\n🟢 VIHREÄ: Kaikki ok.\n🟡 KELTAINEN: Jotain outoa (ilmoita heti).\n🔴 PUNAINEN: HÄTÄ! (Ei leikkiä! Nyt tarvitaan aikuista)."
  },
  {
    id: 5,
    title: "5. KUITTI & LOPPU",
    icon: "CheckCircle2",
    requiredRankId: "R0",
    content: "Nämä ovat kaksi eri asiaa:\n\nKUITTI = 'Ymmärsin viestisi.'\nLOPPU = 'Lopetin puhumisen, sinun vuorosi.'\n\nSano 'LOPPU', jotta kaveri tietää milloin saa painaa nappia!"
  },

  // --- RANK 1 (VIESTITTÄJÄ) - NEW CONTENT: Clarity & Connection ---
  {
    id: 6,
    title: "1. TAVUTUSAAKKOSET",
    icon: "ScanLine",
    requiredRankId: "R1",
    content: "Jos yhteys on huono, sanat pitää tavata.\n\nA = Alfa\nB = Bertta\nC = Celsius\nD = Daavid\nE = Eemeli\nF = Faarao\nG = Gideon\nH = Heikki\n\nOpettele ainakin oma nimesi näillä!"
  },
  {
    id: 7,
    title: "2. TOISTAMINEN",
    icon: "RefreshCw",
    requiredRankId: "R1",
    content: "Jos et saanut selvää, sano: 'TOISTA'.\n\nJos sanoit itse väärin, sano: 'KORJAAN' ja sano asia uudestaan.\n\nEi haittaa jos mokaa, kunhan korjaa virheen heti."
  },
  {
    id: 8,
    title: "3. KUULUVUUS",
    icon: "Wifi",
    requiredRankId: "R1",
    content: "Jos rätisee:\n1. Nosta radio pystyyn (antenni kohti taivasta).\n2. Kiipeä korkeammalle.\n3. Mene pois metalliaitojen vierestä.\n\nÄlä huuda. Puhu rauhallisesti ja selkeästi mikrofoniin."
  },

  // --- RANK 2 (TARKKAILIJA) - NEW CONTENT: Security & Observation ---
  {
    id: 9,
    title: "1. SIJAINTITURVA",
    icon: "Map",
    requiredRankId: "R2",
    content: "Älä koskaan kerro tarkkaa osoitetta radiossa.\n\nKäytä kiintopisteitä:\n'Olen Ison Kiven luona.'\n'Saavuin Kotipesään.'\n\nVihollinen voi kuunnella. Älä paljasta leirin sijaintia."
  },
  {
    id: 10,
    title: "2. RADIOHILJAISUUS",
    icon: "Lock",
    requiredRankId: "R2",
    content: "Jos kuulette komennon 'RADIOHILJAISUUS':\n\n1. Lopeta puhuminen HETI.\n2. Älä sammuta radiota (jotta kuulet ohjeet).\n3. Puhu vasta kun lupa annetaan.\n\nTätä käytetään vaaratilanteissa tai piiloleikissä."
  },
  {
    id: 11,
    title: "3. HARHAUTUS",
    icon: "Ghost",
    requiredRankId: "R2",
    content: "Jos tuntematon kysyy: 'Oletko yksin?', älä vastaa totta.\n\nVastaa: 'Partio Alpha saapuu sijaintiini.'\n\nNäin kuulostat isommalta joukolta."
  },

  // --- RANK 3 (OPERAATTORI) - NEW CONTENT: Emergency & Leadership ---
  {
    id: 12,
    title: "1. HÄTÄTILANNE",
    icon: "AlertTriangle",
    requiredRankId: "R3",
    content: "Jos sattuu oikea onnettomuus:\n\n1. Pysy rauhallisena.\n2. Kutsu Tukikohtaa sanalla 'HÄTÄ'.\n\nEsimerkki: 'TUKIKOHTA, TÄÄLLÄ HAUKKA. HÄTÄ. Kaveri loukkaantui.'\n\nÄlä koskaan leiki hätätilannetta radiossa."
  },
  {
    id: 13,
    title: "2. VIESTIN VÄLITYS",
    icon: "Play",
    requiredRankId: "R3",
    content: "Jos Karhu ei kuule Tukikohtaa, mutta sinä kuulet molemmat:\n\nToimi linkkinä.\n'Karhu, täällä Haukka. Tukikohta pyytää sinua palaamaan. Loppu.'\n\nOperaattori auttaa muita."
  },
  {
    id: 14,
    title: "3. KALUSTO",
    icon: "Battery",
    requiredRankId: "R3",
    content: "Pidä radiosta huolta.\n\n- Älä nosta antennista.\n- Pidä radio kuivana.\n- Jos akku loppuu, ilmoita siitä ENNEN sammumista: 'Akku loppu, suljen radion.'"
  }
];

export const RADIO_FACTS = [
    "Lentäjät sanovat 'Roger', mikä tarkoittaa 'Viesti saatu'.",
    "Radioaallot eivät tykkää taloista tai mäistä. Kiipeä korkealle!",
    "Radiopuhelin on 'Simplex'-laite. Vain yksi voi puhua kerrallaan.",
    "Avaruudessa ei ole ilmaa, joten siellä tarvitaan radiota jutteluun.",
    "Antenni on radion herkin osa. Älä roikota radiota siitä!",
    "Poliisit käyttävät aakkosia: A=Aarne, B=Bertta...",
    "Radioaallot kulkevat valon nopeudella (300 000 km/s).",
    "Ensimmäinen radioviesti lähetettiin yli 100 vuotta sitten.",
];

export const INITIAL_QUESTION_BANK: QuestionCategory[] = [
  // ==========================
  // RANK 0: KOKELAS (Perusteet)
  // ==========================
  // Category 1: Protokolla
  {
    id: 'PROTOKOLLA_R0',
    title: 'PERUSPROTOKOLLA (R0)',
    requiredRankId: 'R0',
    variants: [
      {
        id: 'proto_1',
        scenario: 'Haluat kutsua isää (Tukikohta). Oma nimesi on {CALLSIGN}.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Isä, oletko siellä?', isCorrect: false, feedback: 'Väärin. Käytä koodinimiä.' },
          { id: 'b', text: '{CALLSIGN} kutsuu isää.', isCorrect: false, feedback: 'Väärin. Kutsu aina vastaanottaja ensin.' },
          { id: 'c', text: 'Tukikohta, täällä {CALLSIGN}. Kuuluuko?', isCorrect: true, feedback: 'Oikein! Kenelle - Keneltä.' },
        ],
      },
      {
        id: 'ptt_basic',
        scenario: 'Haluat puhua. Miten painat nappia?',
        type: QuestionType.PTT_TIMING,
        pttInstruction: 'Paina, odota valoa, sitten puhu.',
        options: [
          { id: 'a', text: 'Tukikohta, täällä {CALLSIGN}.', isCorrect: true, feedback: 'Hienoa! Odotit linjan aukeamista.' },
        ],
      }
    ]
  },
  // Category 2: Värikoodit
  {
    id: 'COLORS_R0',
    title: 'VÄRIKOODIT (R0)',
    requiredRankId: 'R0',
    variants: [
      {
        id: 'color_basic',
        scenario: 'Näet vieraan ihmisen leirin lähellä. Hän ei näe sinua.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Koodi Vihreä', isCorrect: false, feedback: 'Ei. Tämä vaatii huomiota.' },
          { id: 'b', text: 'Koodi Keltainen', isCorrect: true, feedback: 'Oikein. Potentiaalinen uhka.' },
          { id: 'c', text: 'Koodi Punainen', isCorrect: false, feedback: 'Ei. Ei ole välitöntä hätää.' },
        ],
      }
    ]
  },
  // Category 3: Salaisuudet (NEW) - Covers Manual Page 3
  {
    id: 'SECRETS_R0',
    title: 'SALAISUUDET (R0)',
    requiredRankId: 'R0',
    variants: [
      {
        id: 'secret_1',
        scenario: 'Joku kysyy radiossa: "Mikä sinun oikea nimesi on?"',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Olen Matti Meikäläinen.', isCorrect: false, feedback: 'VÄÄRIN! Älä koskaan kerro oikeaa nimeä.' },
          { id: 'b', text: 'En kerro nimeäni radiossa.', isCorrect: true, feedback: 'Oikein. Käytä vain koodinimeäsi {CALLSIGN}.' },
        ],
      },
      {
        id: 'secret_2',
        scenario: 'Haluat kertoa kaverille missä asut. Mitä teet?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Sanon osoitteeni radiossa.', isCorrect: false, feedback: 'VÄÄRIN! Radio ei ole turvallinen.' },
          { id: 'b', text: 'Odotan että näen hänet kasvotusten.', isCorrect: true, feedback: 'Oikein. Kotiosoite on salainen tieto.' },
        ]
      }
    ]
  },
  // Category 4: Kuitti & Loppu (NEW) - Covers Manual Page 5
  {
    id: 'TERMINOLOGY_R0',
    title: 'KUITTI JA LOPPU (R0)',
    requiredRankId: 'R0',
    variants: [
      {
        id: 'term_1',
        scenario: 'Olet lopettanut asiasi ja haluat vastauksen. Mitä sanot?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Loppu.', isCorrect: true, feedback: 'Oikein. "Loppu" tarkoittaa: Vuoro sinulle.' },
          { id: 'b', text: 'Kuitti.', isCorrect: false, feedback: 'Väärin. "Kuitti" tarkoittaa vain "Ymmärsin".' },
          { id: 'c', text: 'Ole hyvä.', isCorrect: false, feedback: 'Ei kuulu radiokieleen.' },
        ],
      },
      {
        id: 'term_2',
        scenario: 'Tukikohta pyytää sinua tulemaan syömään. Ymmärsit viestin.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Joo tulossa.', isCorrect: false, feedback: 'Liian epävirallista.' },
          { id: 'b', text: 'Selvä.', isCorrect: false, feedback: 'Ei ole virallinen kuittaus.' },
          { id: 'c', text: 'Kuitti.', isCorrect: true, feedback: 'Oikein. Lyhyt ja selkeä.' },
        ],
      }
    ]
  },

  // ==========================
  // RANK 1: VIESTITTÄJÄ (Aakkoset & Kuuluvuus)
  // ==========================
  {
    id: 'AAKKOSET_R1',
    title: 'TAVUTUS (R1)',
    requiredRankId: 'R1',
    variants: [
      {
        id: 'spell_1',
        scenario: 'Sinun pitää tavata sana "APU".',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Aarne - Paavo - Urho', isCorrect: false, feedback: 'Nuo ovat vanhoja nimiä. Käytämme uusia.' },
          { id: 'b', text: 'Alfa - Paavo - Urho', isCorrect: false, feedback: 'Sekoitus.' },
          { id: 'c', text: 'Alfa - Papa - Uniform (tai Alfa-Pekka-Urho)', isCorrect: true, feedback: 'Oikein. Tavutit selkeästi.' },
        ],
      },
    ]
  },
  // Added REPEAT category for R1
  {
    id: 'REPEAT_R1',
    title: 'TOISTAMINEN (R1)',
    requiredRankId: 'R1',
    variants: [
      {
        id: 'rep_1',
        scenario: 'Et saanut selvää viestistä. Mitä sanot?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Häh?', isCorrect: false, feedback: 'Epäselvää.' },
          { id: 'b', text: 'Toista.', isCorrect: true, feedback: 'Oikein. Lyhyt komento.' },
        ]
      },
      {
        id: 'correction_1',
        scenario: 'Sanoit vahingossa väärän ilmansuunnan. Miten korjaat?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Hups, eiku siis...', isCorrect: false, feedback: 'Epäammattimaista.' },
          { id: 'b', text: 'KORJAAN. Menen etelään.', isCorrect: true, feedback: 'Oikein. Käytä komentosanaa KORJAAN.' },
        ],
      }
    ]
  },
  {
    id: 'SIGNAL_R1',
    title: 'KUULUVUUS (R1)',
    requiredRankId: 'R1',
    variants: [
      {
        id: 'sig_1',
        scenario: 'Kaverin ääni rätisee pahasti. Mitä neuvot häntä?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Huuda lujempaa!', isCorrect: false, feedback: 'Huutaminen särkee ääntä lisää.' },
          { id: 'b', text: 'Nosta radio pystyyn ja etsi korkeampi paikka.', isCorrect: true, feedback: 'Oikein. Antennin asento vaikuttaa.' },
        ],
      }
    ]
  },

  // ==========================
  // RANK 2: TARKKAILIJA (Turvallisuus)
  // ==========================
  {
    id: 'SECURITY_R2',
    title: 'TURVALLISUUS (R2)',
    requiredRankId: 'R2',
    variants: [
      {
        id: 'loc_1',
        scenario: 'Tukikohta kysyy sijaintiasi. Olet K-Marketin edessä.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Olen K-Marketin edessä.', isCorrect: false, feedback: 'Liian tarkka! Vihollinen tietää missä olet.' },
          { id: 'b', text: 'Sijainti: Muonapiste Alpha.', isCorrect: true, feedback: 'Oikein. Käytit koodinimeä.' },
        ],
      },
      {
        id: 'silence_1',
        scenario: 'Päällikkö huutaa: "RADIOHILJAISUUS!" Mitä teet?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Sammutan radion.', isCorrect: false, feedback: 'Väärin! Et kuulisi uusia ohjeita.' },
          { id: 'b', text: 'Lopetan puhumisen ja kuuntelen.', isCorrect: true, feedback: 'Oikein. Pysy kuulolla.' },
          { id: 'c', text: 'Kuiskaan radiota hiljaa.', isCorrect: false, feedback: 'Hiljaisuus tarkoittaa täyttä hiljaisuutta.' },
        ],
      }
    ]
  },
  // Added DECEPTION category for R2
  {
    id: 'DECEPTION_R2',
    title: 'HARHAUTUS (R2)',
    requiredRankId: 'R2',
    variants: [
      {
        id: 'decep_1',
        scenario: 'Tuntematon kysyy: "Oletko yksin?". Olet yksin. Mitä vastaat?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
           { id: 'a', text: 'Kyllä, olen yksin.', isCorrect: false, feedback: 'Väärin. Paljastit heikkoutesi.' },
           { id: 'b', text: 'Partio Alpha saapuu sijaintiini.', isCorrect: true, feedback: 'Oikein. Harhautat kuuntelijaa.' },
        ]
      }
    ]
  },

  // ==========================
  // RANK 3: OPERAATTORI (Hätä & Johto)
  // ==========================
  {
    id: 'EMERGENCY_R3',
    title: 'HÄTÄTILANNE (R3)',
    requiredRankId: 'R3',
    variants: [
      {
        id: 'emergency_1',
        scenario: 'Kaverisi kaatui pahasti ja ei pysty kävelemään. Tarvitset apua heti.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Tukikohta, tulkaa tänne.', isCorrect: false, feedback: 'Liian epäselvä. Kerro että on hätä.' },
          { id: 'b', text: 'TUKIKOHTA, TÄÄLLÄ {CALLSIGN}. HÄTÄ. Kaveri loukkaantui.', isCorrect: true, feedback: 'Oikein. Selkeä ilmoitus.' },
        ],
      },
      {
        id: 'relay_1',
        scenario: 'Kuuluvuus on huono. Kuulet Tukikohdan ja Karhun, mutta he eivät kuule toisiaan.',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'En tee mitään.', isCorrect: false, feedback: 'Auta tiimiä!' },
          { id: 'b', text: 'Välitän viestin: "Karhu, Tukikohta pyytää kuittausta."', isCorrect: true, feedback: 'Oikein. Toimit linkkinä.' },
        ],
      }
    ]
  },
  // Added MAINTENANCE category for R3
  {
    id: 'MAINTENANCE_R3',
    title: 'KALUSTO (R3)',
    requiredRankId: 'R3',
    variants: [
      {
        id: 'maint_1',
        scenario: 'Akku on loppumassa. Mitä teet?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { id: 'a', text: 'Annan sen sammua.', isCorrect: false, feedback: 'Muut luulevat että katosit.' },
          { id: 'b', text: 'Ilmoitan: "Akku loppu, suljen radion."', isCorrect: true, feedback: 'Oikein. Kaikki tietävät miksi poistuit.' },
        ]
      }
    ]
  }
];
